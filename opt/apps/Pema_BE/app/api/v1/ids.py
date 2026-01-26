"""
IDS Next ARI Integration API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, Field
import logging
import base64
import defusedxml.ElementTree as ET
from defusedxml.ElementTree import ParseError
import httpx

from app.db.postgresql import get_db, get_db_with_retry
from app.services.ids import IDSService
from app.models.ids import (
    AvailabilityUpdate, AvailabilityQuery, AvailabilityResponse,
    RateUpdate, OTAHotelAvailNotifRS, OTAHotelRatePlanNotifRS,
    OTAHotelInvCountNotifRS, OTAHotelAvailNotifRQ, OTAHotelInvCountNotifRQ
)
from app.models.ids_booking import (
    OTAHotelResNotifRQ, BookingCreateRequest,
    OTANotifReportRQ, BookingConfirmation
)
from app.core.exceptions import ValidationError
from app.core.config import settings
from app.services.ids_processing import IDSDataProcessor

router = APIRouter()
logger = logging.getLogger(__name__)


def parse_inventory_notification(xml_string: str):
    """
    Parse OTA_HotelInvCountNotifRQ XML into structured data

    Returns:
        dict with keys: echo_token, hotel_code, inventories
        inventories: list of dicts with status_application_control and inv_count
    """
    try:
        # Parse XML
        root = ET.fromstring(xml_string)

        # Extract basic info
        echo_token = root.get('EchoToken')
        hotel_code = root.find('.//{http://www.opentravel.org/OTA/2003/05}Inventories').get('HotelCode') if root.find('.//{http://www.opentravel.org/OTA/2003/05}Inventories') is not None else None

        inventories = []

        # Parse each inventory item
        for inventory_elem in root.findall('.//{http://www.opentravel.org/OTA/2003/05}Inventory'):
            sac_elem = inventory_elem.find('.//{http://www.opentravel.org/OTA/2003/05}StatusApplicationControl')
            inv_count_elem = inventory_elem.find('.//{http://www.opentravel.org/OTA/2003/05}InvCount')

            if sac_elem is not None and inv_count_elem is not None:
                inventory_data = {
                    'status_application_control': {
                        'start': sac_elem.get('Start'),
                        'end': sac_elem.get('End'),
                        'inv_type_code': sac_elem.get('InvTypeCode'),  # Use InvTypeCode as per IDS spec
                        'rate_plan_code': sac_elem.get('RatePlanCode'),
                        'meal_plan_code': sac_elem.get('MealPlanCode')
                    },
                    'inv_count': {
                        'count_type': inv_count_elem.get('CountType'),
                        'count': int(inv_count_elem.get('Count', 0))
                    }
                }
                inventories.append(inventory_data)

        return {
            'echo_token': echo_token,
            'hotel_code': hotel_code,
            'inventories': inventories
        }

    except ET.ParseError as e:
        logger.error(f"XML parsing error for inventory notification: {e}")
        raise ValueError(f"Invalid XML format: {e}")
    except Exception as e:
        logger.error(f"Error parsing inventory notification: {e}")
        raise ValueError(f"Failed to parse inventory data: {e}")


def parse_availability_notification(xml_string: str) -> Dict[str, Any]:
    """
    Parse OTA_HotelAvailNotifRQ XML into structured data

    Returns:
        dict with keys: echo_token, hotel_code, avail_status_messages
    """
    try:
        root = ET.fromstring(xml_string)

        echo_token = root.get('EchoToken')
        hotel_code = root.find('.//{http://www.opentravel.org/OTA/2003/05}AvailStatusMessages').get('HotelCode') if root.find('.//{http://www.opentravel.org/OTA/2003/05}AvailStatusMessages') is not None else None

        messages = []

        for msg_elem in root.findall('.//{http://www.opentravel.org/OTA/2003/05}AvailStatusMessage'):
            sac_elem = msg_elem.find('.//{http://www.opentravel.org/OTA/2003/05}StatusApplicationControl')
            restriction_elem = msg_elem.find('.//{http://www.opentravel.org/OTA/2003/05}RestrictionStatus')

            message_data = {
                'status_application_control': {
                    'start': sac_elem.get('Start') if sac_elem is not None else None,
                    'end': sac_elem.get('End') if sac_elem is not None else None,
                    'inv_type_code': sac_elem.get('InvTypeCode') if sac_elem is not None else None,
                    'rate_plan_code': sac_elem.get('RatePlanCode') if sac_elem is not None else None,
                    'meal_plan_code': sac_elem.get('MealPlanCode') if sac_elem is not None else None
                } if sac_elem is not None else None,
                'restriction_status': {
                    'status': restriction_elem.get('Status') if restriction_elem is not None else None,
                    'restriction': restriction_elem.get('Restriction') if restriction_elem is not None else None,
                    'min_los': restriction_elem.get('MinLOS') if restriction_elem is not None else None,
                    'max_los': restriction_elem.get('MaxLOS') if restriction_elem is not None else None
                } if restriction_elem is not None else None
            }
            messages.append(message_data)

        return {
            'echo_token': echo_token,
            'hotel_code': hotel_code,
            'avail_status_messages': messages
        }

    except ET.ParseError as e:
        logger.error(f"XML parsing error for availability notification: {e}")
        raise ValueError(f"Invalid XML format: {e}")
    except Exception as e:
        logger.error(f"Error parsing availability notification: {e}")
        raise ValueError(f"Failed to parse availability data: {e}")


def parse_booking_notification(xml_string: str) -> Dict[str, Any]:
    """
    Parse OTA_HotelResNotifRQ XML into structured data

    Returns:
        dict with keys: echo_token, message_content_code, hotel_reservations
    """
    try:
        root = ET.fromstring(xml_string)

        echo_token = root.get('EchoToken')
        message_content_code = root.get('MessageContentCode')

        reservations = []

        for res_elem in root.findall('.//{http://www.opentravel.org/OTA/2003/05}HotelReservation'):
            reservation_data = {}

            # Unique ID
            unique_id_elem = res_elem.find('.//{http://www.opentravel.org/OTA/2003/05}UniqueID')
            if unique_id_elem is not None:
                reservation_data['unique_id'] = {
                    'type': unique_id_elem.get('Type'),
                    'id': unique_id_elem.get('ID')
                }

            # Room Stays
            room_stays = []
            for room_stay_elem in res_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}RoomStay'):
                room_stay_data = {}

                # Room Types
                room_types = []
                for rt_elem in room_stay_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}RoomType'):
                    room_types.append({'room_type_code': rt_elem.get('RoomTypeCode')})
                room_stay_data['room_types'] = room_types

                # Rate Plans
                rate_plans = []
                for rp_elem in room_stay_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}RatePlan'):
                    rate_plans.append({'rate_plan_code': rp_elem.get('RatePlanCode')})
                room_stay_data['rate_plans'] = rate_plans

                # Time Span
                time_span_elem = room_stay_elem.find('.//{http://www.opentravel.org/OTA/2003/05}TimeSpan')
                if time_span_elem is not None:
                    room_stay_data['time_span'] = {
                        'start_date': time_span_elem.get('StartDate'),
                        'end_date': time_span_elem.get('EndDate')
                    }

                # Guest Counts
                guest_counts = []
                for gc_elem in room_stay_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}GuestCount'):
                    guest_counts.append({
                        'age_qualifying_code': gc_elem.get('AgeQualifyingCode'),
                        'count': int(gc_elem.get('Count', 0))
                    })
                room_stay_data['guest_counts'] = guest_counts

                # Total Amount
                total_elem = room_stay_elem.find('.//{http://www.opentravel.org/OTA/2003/05}Total')
                if total_elem is not None:
                    room_stay_data['total'] = {
                        'amount_after_tax': total_elem.get('AmountAfterTax'),
                        'currency_code': total_elem.get('CurrencyCode')
                    }

                room_stays.append(room_stay_data)

            reservation_data['room_stays'] = room_stays

            # Services (Guest Info)
            services = []
            for service_elem in res_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Service'):
                service_data = {
                    'service_type': service_elem.get('ServiceType'),
                    'service_code': service_elem.get('ServiceCode')
                }

                # Guest Name
                guest_name_elem = service_elem.find('.//{http://www.opentravel.org/OTA/2003/05}GuestName')
                if guest_name_elem is not None:
                    service_data['guest_name'] = {
                        'given_name': guest_name_elem.findtext('.//{http://www.opentravel.org/OTA/2003/05}GivenName'),
                        'surname': guest_name_elem.findtext('.//{http://www.opentravel.org/OTA/2003/05}Surname')
                    }

                # Contact Info
                contact_elem = service_elem.find('.//{http://www.opentravel.org/OTA/2003/05}ContactInfo')
                if contact_elem is not None:
                    contact_data = {}

                    # Phones
                    phones = []
                    for phone_elem in contact_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Phone'):
                        phones.append({'phone_number': phone_elem.get('PhoneNumber')})
                    contact_data['phones'] = phones

                    # Emails
                    emails = []
                    for email_elem in contact_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Email'):
                        emails.append({'email': email_elem.text})
                    contact_data['emails'] = emails

                    service_data['contact_info'] = contact_data

                services.append(service_data)

            reservation_data['services'] = services

            reservations.append(reservation_data)

        return {
            'echo_token': echo_token,
            'message_content_code': message_content_code,
            'hotel_reservations': reservations
        }

    except ET.ParseError as e:
        logger.error(f"XML parsing error for booking notification: {e}")
        raise ValueError(f"Invalid XML format: {e}")
    except Exception as e:
        logger.error(f"Error parsing booking notification: {e}")
        raise ValueError(f"Failed to parse booking data: {e}")


def parse_ids_room_types_response(xml_string: str) -> Dict[str, Any]:
    """
    Parse IDS Room Type Response XML (RN_HotelRatePlanRS) into structured data

    Matches IDS Next ARI specification exactly:
    - Root: RN_HotelRatePlanRS
    - Success/Error elements
    - HotelCriteria, RoomTypes, RatePlans, Inclusions sections

    Returns:
        dict with keys: success, hotel_code, room_types, rate_plans, inclusions, errors
    """
    try:
        # Parse XML - IDS uses RN_HotelRatePlanRS
        root = ET.fromstring(xml_string)
        ns = {'ota': 'http://www.opentravel.org/OTA/2003/05'}

        # Check for errors first (as per IDS spec)
        errors_elem = root.find('.//ota:Errors', ns)
        if errors_elem is not None:
            error_text = errors_elem.findtext('.//ota:Error', '', ns) or 'Unknown error'
            logger.warning(f"IDS API returned error: {error_text}")
            return {
                'success': False,
                'error': error_text,
                'hotel_code': None,
                'room_types': [],
                'rate_plans': [],
                'inclusions': [],
                'echo_token': root.get('EchoToken')
            }

        # Check for success
        success_elem = root.find('.//ota:Success', ns)
        has_success = success_elem is not None

        if not has_success:
            logger.warning("IDS API response does not contain Success element")
            return {
                'success': False,
                'error': 'No success indicator in response',
                'hotel_code': None,
                'room_types': [],
                'rate_plans': [],
                'inclusions': [],
                'echo_token': root.get('EchoToken')
            }

        # Get hotel code
        hotel_criteria = root.find('.//ota:HotelCriteria', ns)
        hotel_code = hotel_criteria.get('HotelCode') if hotel_criteria is not None else None

        # Parse room types
        room_types = []
        for room_type_elem in root.findall('.//ota:RoomType', ns):
            # Handle IsRoomActive as string comparison (1=active, 0=inactive)
            is_active_str = room_type_elem.get('IsRoomActive', '1')
            is_room_active = is_active_str == '1'

            room_type = {
                'inv_type_code': room_type_elem.get('InvTypeCode'),
                'name': room_type_elem.get('Name'),
                'quantity': int(room_type_elem.get('Quantity', 0)),
                'is_room_active': is_room_active,
                'room_description': room_type_elem.findtext('.//ota:RoomDescription', '', ns)
            }
            room_types.append(room_type)

        # Parse rate plans
        rate_plans = []
        for rate_plan_elem in root.findall('.//ota:RatePlan', ns):
            rate_plan = {
                'rate_plan_code': rate_plan_elem.get('RatePlanCode'),
                'rate_plan_category': rate_plan_elem.get('RatePlanCategory'),
                'rate_plan_status_type': rate_plan_elem.get('RatePlanStatusType'),
                'rate_plan_name': rate_plan_elem.get('RatePlanName'),
                'description': rate_plan_elem.get('Description'),
                'inv_type_code': rate_plan_elem.get('InvTypeCode'),
                'meal_plan_code': rate_plan_elem.get('MealPlanCode'),
                'meal_plan_desc': rate_plan_elem.get('MealPlanDesc'),
                'start': rate_plan_elem.get('Start'),
                'end': rate_plan_elem.get('End'),
                'currency_code': rate_plan_elem.get('CurrencyCode')
            }
            rate_plans.append(rate_plan)

        # Parse inclusions (meal plans)
        inclusions = []
        for inclusion_elem in root.findall('.//ota:Inclusion', ns):
            inclusion = {
                'meal_plan_code': inclusion_elem.get('MealPlanCode'),
                'meal_plan_desc': inclusion_elem.get('MealPlanDesc')
            }
            inclusions.append(inclusion)

        logger.info(f"Successfully parsed IDS response: {len(room_types)} room types, {len(rate_plans)} rate plans, {len(inclusions)} inclusions")

        return {
            'success': True,
            'hotel_code': hotel_code,
            'room_types': room_types,
            'rate_plans': rate_plans,
            'inclusions': inclusions,
            'echo_token': root.get('EchoToken'),
            'source': 'ids_api'
        }

    except ET.ParseError as e:
        logger.error(f"XML parsing error for IDS room types response: {e}")
        raise ValueError(f"Invalid XML format: {e}")
    except Exception as e:
        logger.error(f"Error parsing IDS room types response: {e}")
        raise ValueError(f"Failed to parse room types data: {e}")


async def verify_ids_auth(request: Request, xml_body: str = None) -> None:
    """
    Verify HTTP Basic authentication from IDS with dual method support

    According to IDS specification:
    - Method 1: Authorization: Basic HTTP authentication using IDS provided username/password with base-64 encoding
    - Method 2: Check for userid/password attributes in XML payload

    Supports both methods with fallback logic.
    """
    username = None
    password = None
    auth_method = None

    # Method 1: Try HTTP Basic Authentication first
    auth_header = request.headers.get("Authorization")
    if auth_header:
        if not auth_header.startswith("Basic "):
            logger.warning(f"Invalid authorization scheme: {auth_header[:20]}...")
        else:
            try:
                # Decode base64 credentials
                encoded_credentials = auth_header[6:]  # Remove "Basic " prefix
                decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
                username, password = decoded_credentials.split(':', 1)
                auth_method = "HTTP Basic Auth"
                logger.info(f" Found HTTP Basic Auth credentials for user: {username}")

            except (ValueError, UnicodeDecodeError) as e:
                logger.warning(f"Failed to decode HTTP Basic Auth credentials: {e}")

    # Method 2: Fallback to XML attributes if HTTP Basic failed or not present
    if not username and xml_body:
        try:
            import defusedxml.ElementTree as ET
            root = ET.fromstring(xml_body)
            xml_username = root.get('userid')
            xml_password = root.get('password')

            if xml_username and xml_password:
                username = xml_username
                password = xml_password
                auth_method = "XML Attributes"
                logger.info(f" Found XML attribute credentials for user: {username}")

        except ET.ParseError as e:
            logger.warning(f"Failed to parse XML for credentials: {e}")
        except Exception as e:
            logger.warning(f"Error checking XML credentials: {e}")

    # Check if we have credentials from either method
    if not username or not password:
        logger.warning(" No valid authentication found - missing Authorization header and XML userid/password attributes")
        raise HTTPException(status_code=401, detail="Missing authentication - provide Authorization header or userid/password in XML")

    # Verify credentials match our configured IDS credentials
    expected_username = settings.IDS_API_KEY
    expected_password = settings.IDS_API_SECRET

    if username != expected_username or password != expected_password:
        logger.warning(f" Invalid IDS credentials: username={username}, method={auth_method}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    logger.info(f" Successfully authenticated IDS request from: {username} (method: {auth_method})")


@router.post("/availability/check", response_model=List[AvailabilityResponse])
async def check_availability(
    room_codes: List[str] = Query(..., description="Room codes to check"),
    rate_plan_codes: List[str] = Query(..., description="Rate plan codes to check"),
    start_date: date = Query(..., description="Check-in date"),
    end_date: date = Query(..., description="Check-out date"),
    adults: int = Query(1, ge=1, le=10, description="Number of adults"),
    children: int = Query(0, ge=0, le=10, description="Number of children"),
    db: AsyncSession = Depends(get_db)
):
    """Check room availability with IDS - supports multiple rooms/rate plans"""
    try:
        ids_service = IDSService()
        query = AvailabilityQuery(
            room_codes=room_codes,
            rate_plan_codes=rate_plan_codes,
            start_date=start_date,
            end_date=end_date,
            adults=adults,
            children=children
        )

        return await ids_service.check_availability(query)
    except Exception as e:
        logger.error(f"Availability check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Availability check failed: {str(e)}")


@router.get("/availability/check-simple", response_model=List[AvailabilityResponse])
async def check_availability_simple(
    room_code: str = Query(..., description="Room code to check"),
    start_date: date = Query(..., description="Check-in date"),
    end_date: date = Query(..., description="Check-out date"),
    rate_plan_code: Optional[str] = Query(None, description="Rate plan code (optional)"),
    db: AsyncSession = Depends(get_db)
):
    """Check room availability with IDS - simplified interface for single room"""
    try:
        ids_service = IDSService()
        return await ids_service.check_availability_simple(
            room_code=room_code,
            check_in_date=start_date,
            check_out_date=end_date,
            rate_plan_code=rate_plan_code
        )
    except Exception as e:
        logger.error(f"Simple availability check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Availability check failed: {str(e)}")


@router.post("/availability/update", response_class=PlainTextResponse)
async def receive_inventory_update(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive inventory/availability updates FROM IDS (Push Model)

    IDS sends OTA_HotelInvCountNotifRQ XML to update room inventory levels.
    This endpoint captures and stores the inventory data sent by IDS.
    """
    try:
        # Get raw XML data from IDS
        xml_data = await request.body()
        xml_string = xml_data.decode('utf-8').strip()

        if not xml_string:
            raise HTTPException(status_code=400, detail="Empty request body")

        # Verify authentication (check userid/password in XML)
        await verify_ids_auth(request, xml_string)

        logger.info(f"📥 Received inventory update XML from IDS: {len(xml_string)} bytes")
        logger.info(f"XML content: {xml_string[:500]}...")

        # Parse the XML
        logger.info("🔍 Starting XML parsing...")
        parsed_data = parse_inventory_notification(xml_string)
        logger.info(f"Parsed inventory data: echo_token={parsed_data['echo_token']}, "
                   f"hotel_code={parsed_data['hotel_code']}, "
                   f"inventory_items={len(parsed_data['inventories'])}")
        logger.info(f"Parsed data type: {type(parsed_data)}")

        # Process and store the inventory data
        processor = IDSDataProcessor(db)
        await processor.process_inventory_data(parsed_data)

        # Log the inventory updates for verification
        for inventory in parsed_data['inventories']:
            sac = inventory['status_application_control']
            inv_count = inventory['inv_count']
            logger.info(f"Inventory update: Room={sac['inv_type_code']}, "
                       f"Date={sac['start']} to {sac['end']}, "
                       f"Available={inv_count['count']}")

        # Return success response as XML (OTA standard)
        success_response = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRS xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    TimeStamp="''' + datetime.now().isoformat() + '''"
    Version="2.000">
    <Success />
</OTA_HotelInvCountNotifRS>'''

        logger.info(f" Response type: {type(success_response)}, content length: {len(success_response)}")
        logger.info(" Successfully processed inventory update from IDS")
        return Response(content=success_response, media_type="application/xml")

    except Exception as e:
        logger.error(f" Failed to process inventory update: {e}")

        # Handle HTTP exceptions properly (preserve their status codes)
        if isinstance(e, HTTPException):
            # Return HTTP exception status codes properly
            error_response = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRS xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    TimeStamp="''' + datetime.now().isoformat() + '''"
    Version="2.000">
    <Errors>
        <Error Type="1">''' + str(e.detail) + '''</Error>
    </Errors>
</OTA_HotelInvCountNotifRS>'''

            return PlainTextResponse(content=error_response, media_type="application/xml", status_code=e.status_code)

        # Return error response as XML (OTA standard) for other exceptions
        error_response = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRS xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    TimeStamp="''' + datetime.now().isoformat() + '''"
    Version="2.000">
    <Errors>
        <Error Type="1">''' + str(e) + '''</Error>
    </Errors>
</OTA_HotelInvCountNotifRS>'''

        return PlainTextResponse(content=error_response, media_type="application/xml", status_code=500)


@router.post("/rates/update", response_model=OTAHotelRatePlanNotifRS)
async def update_rates(
    rate_updates: List[RateUpdate],
    db: AsyncSession = Depends(get_db)
):
    """Update room rates with IDS"""
    try:
        ids_service = IDSService()
        return await ids_service.update_rates(rate_updates)
    except Exception as e:
        logger.error(f"Rate update failed: {e}")
        raise HTTPException(status_code=500, detail=f"Rate update failed: {str(e)}")


@router.post("/inventory/update", response_model=OTAHotelInvCountNotifRS)
async def update_inventory(
    room_code: str = Query(..., description="Room code to update"),
    rate_plan_code: str = Query(..., description="Rate plan code"),
    start_date: date = Query(..., description="Start date for inventory update"),
    end_date: date = Query(..., description="End date for inventory update"),
    available_count: int = Query(..., ge=0, description="Number of rooms available"),
    meal_plan_code: str = Query("CP", description="Meal plan code"),
    db: AsyncSession = Depends(get_db)
):
    """Update room inventory with IDS"""
    try:
        ids_service = IDSService()
        inventory_update = {
            'room_code': room_code,
            'rate_plan_code': rate_plan_code,
            'start_date': start_date,
            'end_date': end_date,
            'available_count': available_count,
            'meal_plan_code': meal_plan_code
        }
        return await ids_service.update_inventory([inventory_update])
    except Exception as e:
        logger.error(f"Inventory update failed: {e}")
        raise HTTPException(status_code=500, detail=f"Inventory update failed: {str(e)}")


@router.post("/inventory/bulk-update", response_model=OTAHotelInvCountNotifRS)
async def bulk_update_inventory(
    inventory_updates: List[dict],
    db: AsyncSession = Depends(get_db)
):
    """Bulk update room inventory with IDS"""
    try:
        ids_service = IDSService()
        return await ids_service.update_inventory(inventory_updates)
    except Exception as e:
        logger.error(f"Bulk inventory update failed: {e}")
        raise HTTPException(status_code=500, detail=f"Bulk inventory update failed: {str(e)}")


@router.post("/availability/bulk-update")
async def bulk_update_availability(
    updates: List[AvailabilityUpdate],
    db: AsyncSession = Depends(get_db)
):
    """Bulk update availability and restrictions with IDS"""
    try:
        ids_service = IDSService()

        # Group updates by room type and date range for efficiency
        grouped_updates = {}
        for update in updates:
            key = (update.room_code, update.rate_plan_code, update.start_date, update.end_date)
            if key not in grouped_updates:
                grouped_updates[key] = []
            grouped_updates[key].append(update)

        # Process each group
        results = []
        for (room_code, rate_plan, start_date, end_date), group_updates in grouped_updates.items():
            # Merge restrictions if multiple updates for same room/date range
            merged_update = AvailabilityUpdate(
                room_code=room_code,
                rate_plan_code=rate_plan,
                meal_plan_code=group_updates[0].meal_plan_code,
                start_date=start_date,
                end_date=end_date,
                restriction_type=group_updates[0].restriction_type,
                restriction_status=group_updates[0].restriction_status,
                min_los=min((u.min_los for u in group_updates if u.min_los), default=None),
                max_los=max((u.max_los for u in group_updates if u.max_los), default=None),
                day_of_week=group_updates[0].day_of_week,
                unique_id=f"bulk_{start_date}_{end_date}_{room_code}"
            )

            response = await ids_service.update_availability([merged_update])
            results.append({
                "room_code": room_code,
                "start_date": start_date,
                "end_date": end_date,
                "success": response.success is not None,
                "warnings": len(response.warnings.warning) if response.warnings else 0,
                "errors": len(response.errors.error) if response.errors else 0
            })

        return {"results": results, "total_processed": len(results)}
    except Exception as e:
        logger.error(f"Bulk availability update failed: {e}")
        raise HTTPException(status_code=500, detail=f"Bulk availability update failed: {str(e)}")


@router.get("/rooms/{room_code}/availability")
async def get_room_availability(
    room_code: str,
    start_date: date = Query(..., description="Start date for availability check"),
    end_date: date = Query(..., description="End date for availability check"),
    rate_plan_code: Optional[str] = Query(None, description="Specific rate plan to check"),
    db: AsyncSession = Depends(get_db)
):
    """Get room availability from IDS"""
    try:
        ids_service = IDSService()

        rate_plans = [rate_plan_code] if rate_plan_code else list(ids_service.rate_plan_mapping.values())

        query = AvailabilityQuery(
            room_codes=[room_code],
            rate_plan_codes=rate_plans,
            start_date=start_date,
            end_date=end_date
        )

        availability = await ids_service.check_availability(query)

        # Filter results for the requested room
        room_availability = [avail for avail in availability if avail.room_code == room_code]

        return {
            "room_code": room_code,
            "availability": [
                {
                    "date": avail.date.isoformat(),
                    "available": avail.available,
                    "rate_plan": avail.rate_plan_code,
                    "restrictions": {
                        "type": avail.restriction_type,
                        "status": avail.restriction_status,
                        "min_los": avail.min_los,
                        "max_los": avail.max_los
                    } if avail.restriction_type else None
                }
                for avail in room_availability
            ]
        }
    except Exception as e:
        logger.error(f"Room availability check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Room availability check failed: {str(e)}")


@router.post("/restrictions/update")
async def update_restrictions(
    room_code: str,
    rate_plan_code: str,
    start_date: date = Query(..., description="Start date for restrictions"),
    end_date: date = Query(..., description="End date for restrictions"),
    restriction_type: str = Query("Master", description="Restriction type: Master, Arrival, Departure"),
    status: str = Query("Close", description="Restriction status: Open, Close"),
    min_los: Optional[int] = Query(None, description="Minimum length of stay"),
    max_los: Optional[int] = Query(None, description="Maximum length of stay"),
    db: AsyncSession = Depends(get_db)
):
    """Update room restrictions (open/close, min/max LOS) in IDS"""
    try:
        ids_service = IDSService()

        update = AvailabilityUpdate(
            room_code=room_code,
            rate_plan_code=rate_plan_code,
            meal_plan_code="CP",
            start_date=start_date,
            end_date=end_date,
            restriction_type=restriction_type,
            restriction_status=status,
            min_los=min_los,
            max_los=max_los,
            unique_id=f"restriction_{start_date}_{end_date}_{room_code}"
        )

        response = await ids_service.update_availability([update])

        return {
            "success": response.success is not None,
            "room_code": room_code,
            "restriction_type": restriction_type,
            "status": status,
            "date_range": f"{start_date} to {end_date}",
            "warnings": len(response.warnings.warning) if response.warnings else 0,
            "errors": len(response.errors.error) if response.errors else 0
        }
    except Exception as e:
        logger.error(f"Restriction update failed: {e}")
        raise HTTPException(status_code=500, detail=f"Restriction update failed: {str(e)}")


@router.post("/sync/availability")
async def sync_availability(db: AsyncSession = Depends(get_db)):
    """Manually trigger availability sync from IDS"""
    try:
        ids_service = IDSService()
        await ids_service.sync_availability_from_ids()
        return {"message": "Availability sync completed successfully"}
    except Exception as e:
        logger.error(f"Availability sync failed: {e}")
        raise HTTPException(status_code=500, detail=f"Availability sync failed: {str(e)}")


@router.post("/sync/rates")
async def sync_rates(db: AsyncSession = Depends(get_db)):
    """Manually trigger rate sync from IDS"""
    try:
        ids_service = IDSService()
        await ids_service.sync_rates_from_ids()
        return {"message": "Rate sync completed successfully"}
    except Exception as e:
        logger.error(f"Rate sync failed: {e}")
        raise HTTPException(status_code=500, detail=f"Rate sync failed: {str(e)}")


# Response model for inventory sync
class InventorySyncResponse(BaseModel):
    status: str
    timestamp: str

# Request model for inventory sync (for Swagger UI compatibility)
class InventorySyncRequest(BaseModel):
    """Request model for inventory synchronization"""
    xml_data: str = Field(..., description="OTA_HotelInvCountNotifRQ XML data with embedded credentials")

    class Config:
        json_schema_extra = {
            "example": {
                "xml_data": '''<OTA_HotelInvCountNotifRQ EchoToken="123456" TimeStamp="2025-10-28T10:35:28" Version="1.2" userid="baypark@idsnext.com" password="idsnext24412" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Inventories HotelCode="7167">
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="EXE"/>
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="SRG"/>
            <InvCounts>
                <InvCount CountType="2" Count="27" />
            </InvCounts>
        </Inventory>
    </Inventories>
</OTA_HotelInvCountNotifRQ>'''
            }
        }


@router.post("/sync/inventory", response_class=PlainTextResponse)
async def sync_inventory(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive inventory sync notifications FROM IDS (Push Model)

    This endpoint receives OTA_HotelInvCountNotifRQ messages from IDS
    when inventory levels change. IDS pushes XML data to us.
    """
    try:
        # Get raw XML data from IDS
        xml_data = await request.body()
        xml_string = xml_data.decode('utf-8').strip()

        if not xml_string:
            raise HTTPException(status_code=400, detail="Empty request body")

        logger.info(f"📥 Received inventory sync XML from IDS: {len(xml_string)} bytes")
        logger.info(f"XML content: {xml_string[:500]}...")

        # Parse the XML
        parsed_data = parse_inventory_notification(xml_string)
        logger.info(f"Parsed inventory data: echo_token={parsed_data['echo_token']}, "
                   f"hotel_code={parsed_data['hotel_code']}, "
                   f"inventory_items={len(parsed_data['inventories'])}")

        # Process and store the inventory data
        processor = IDSDataProcessor(db)
        await processor.process_inventory_data(parsed_data)

        # Return success response as XML
        success_response = f'''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRS xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    TimeStamp="{datetime.now().isoformat()}"
    Version="2.000">
    <Success />
</OTA_HotelInvCountNotifRS>'''

        logger.info(" Successfully processed inventory sync from IDS")
        return PlainTextResponse(content=success_response, media_type="application/xml")

    except Exception as e:
        logger.error(f" Failed to process inventory sync: {e}")

        # Return error response as XML
        error_response = f'''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRS xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    TimeStamp="{datetime.now().isoformat()}"
    Version="2.000">
    <Errors>
        <Error Type="1">{str(e)}</Error>
    </Errors>
</OTA_HotelInvCountNotifRS>'''

        return PlainTextResponse(content=error_response, media_type="application/xml", status_code=500)


@router.get("/status")
async def get_ids_status():
    """Get IDS integration status"""
    ids_service = IDSService()

    status = {
        "configured": bool(ids_service.base_url and ids_service.hotel_code),
        "base_url": bool(ids_service.base_url),
        "hotel_code": ids_service.hotel_code,
        "api_key_configured": bool(ids_service.api_key),
        "rate_plan_mapping": ids_service.rate_plan_mapping,
        "room_code_mapping": ids_service.room_code_mapping,
        "background_sync_enabled": False  # This would be configurable
    }

    return status


@router.post("/test-connection")
async def test_ids_connection():
    """Test connection to IDS backend"""
    try:
        ids_service = IDSService()

        # Test PMS API connectivity directly using testconnectivity endpoint
        if ids_service.base_url and ids_service.hotel_code:
            logger.info("Testing IDS/PMS API connectivity...")

            try:
                # Test connectivity using the testconnectivity endpoint
                connectivity_url = f"{ids_service.base_url}/testconnectivity"
                headers = {
                    "accept": "application/json",
                }

                # Add authentication if available
                if ids_service.api_key and ids_service.api_secret:
                    import base64
                    credentials = f"{ids_service.api_key}:{ids_service.api_secret}"
                    encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
                    headers["Authorization"] = f"Basic {encoded_credentials}"

                async with httpx.AsyncClient(timeout=ids_service.timeout) as client:
                    response = await client.get(connectivity_url, headers=headers)
                    response.raise_for_status()

                    # Parse response
                    response_text = response.text.strip('"')
                    logger.info(f"PMS connectivity verified: {response_text[:100]}...")

                    return {
                        "success": True,
                        "message": "PMS API connection successful",
                        "response": {
                            "connectivity_tested": True,
                            "status": "connected",
                            "base_url": ids_service.base_url,
                            "hotel_code": ids_service.hotel_code
                        }
                    }

            except Exception as conn_error:
                logger.warning(f"PMS API connectivity test failed: {conn_error}")
                return {
                    "success": False,
                    "message": f"PMS API connection failed: {str(conn_error)}",
                    "response": {
                        "connectivity_tested": False,
                        "error": str(conn_error)
                    }
                }

        # Fallback to external IDS API test if PMS API not configured
        if not ids_service.base_url:
            return {"success": False, "message": "IDS integration not configured"}

        # Create a simple test request for external IDS API
        test_update = AvailabilityUpdate(
            room_code="EXT",
            rate_plan_code="RR0925",
            meal_plan_code="CP",
            start_date=date.today(),
            end_date=date.today(),
            unique_id="test-connection"
        )

        response = await ids_service.update_availability([test_update])

        return {
            "success": True,
            "message": "IDS connection successful",
            "response": {
                "has_success": response.success is not None,
                "has_warnings": response.warnings is not None,
                "has_errors": response.errors is not None,
                "echo_token": response.echo_token
            }
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"IDS connection failed: {str(e)}"
        }


@router.get("/room-types")
async def get_room_types():
    """Get room types from IDS - Room Type Service"""
    try:
        ids_service = IDSService()
        result = await ids_service.get_room_types()
        return result

    except Exception as e:
        logger.error(f"Failed to get room types: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get room types: {str(e)}")


@router.post("/bookings/create")
async def create_booking_direct(booking_data: BookingCreateRequest):
    """Create a booking directly in IDS - Booking Service"""
    try:
        ids_service = IDSService()
        return await ids_service.create_booking(booking_data.model_dump())
    except Exception as e:
        logger.error(f"Failed to create booking in IDS: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")


@router.post("/bookings/create-debug")
async def create_booking_debug(booking_data: BookingCreateRequest):
    """DEBUG: Create booking and return XML for inspection"""
    try:
        # Generate XML using IDSAdapterService
        from app.services.ids_adapter import IDSAdapterService
        adapter = IDSAdapterService("dummy", "dummy", "dummy")
        xml_content = adapter._create_booking_xml(booking_data.model_dump())

        return {
            "debug_mode": True,
            "xml_content": xml_content,
            "xml_length": len(xml_content),
            "booking_data": booking_data.model_dump()
        }
    except Exception as e:
        logger.error(f"Failed to generate debug XML: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate XML: {str(e)}")


@router.get("/debug/xml")
async def debug_xml_generation(
    unique_id: str = Query("DEBUG-TEST", description="Unique booking identifier"),
    check_in_date: date = Query(..., description="Check-in date"),
    check_out_date: date = Query(..., description="Check-out date"),
    adults: int = Query(1, ge=1, le=10, description="Number of adults"),
    children: int = Query(0, ge=0, le=10, description="Number of children"),
    room_code: str = Query("EXT", description="IDS room code"),
    rate_plan_code: str = Query("RR0925", description="IDS rate plan code"),
    total_amount: int = Query(74710, ge=0, description="Total amount in paise"),
    currency_code: str = Query("INR", description="Currency code"),
    guest_first_name: str = Query("Debug", description="Guest first name"),
    guest_last_name: str = Query("XML", description="Guest last name"),
    guest_email: str = Query("debug@test.com", description="Guest email"),
    guest_phone: str = Query("NA", description="Guest phone"),
    guest_country: str = Query("India", description="Guest country")
):
    """Debug endpoint to see generated XML without posting to IDS"""
    try:
        # Build booking data from query parameters
        booking_data = {
            "unique_id": unique_id,
            "check_in_date": check_in_date.isoformat(),
            "check_out_date": check_out_date.isoformat(),
            "adults": adults,
            "children": children,
            "room_code": room_code,
            "rate_plan_code": rate_plan_code,
            "total_amount": total_amount,
            "currency_code": currency_code,
            "guest_info": {
                "first_name": guest_first_name,
                "last_name": guest_last_name,
                "email": guest_email,
                "phone": guest_phone,
                "country": guest_country
            }
        }

        # Generate XML using IDSAdapterService
        from app.services.ids_adapter import IDSAdapterService
        adapter = IDSAdapterService("dummy", "dummy", "dummy")
        xml_content = adapter._create_booking_xml(booking_data)

        return {
            "success": True,
            "xml_content": xml_content,
            "xml_length": len(xml_content),
            "booking_data": booking_data
        }

    except Exception as e:
        logger.error(f"Failed to generate debug XML: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate XML: {str(e)}")


@router.get("/bookings/create")
async def create_booking_get(
    unique_id: Optional[str] = Query(None, description="Unique booking identifier (auto-generated if not provided)"),
    check_in_date: date = Query(..., description="Check-in date (format: YYYY-MM-DD, example: 2025-11-01, minimum 3 nights)"),
    check_out_date: date = Query(..., description="Check-out date (format: YYYY-MM-DD, example: 2025-11-04, minimum 3 nights stay)"),
    adults: int = Query(..., ge=1, le=10, description="Number of adults (1-10)"),
    children: int = Query(0, ge=0, le=10, description="Number of children (0-10, default: 0)"),
    room_code: str = Query(..., description="IDS room code (example: EXT, DLX, STD)"),
    rate_plan_code: str = Query(..., description="IDS rate plan code (example: RR0925)"),
    total_amount: float = Query(..., ge=0.0, description="Total amount in rupees (example: 149680.00 for ₹149,680)"),
    deposit_amount: float = Query(0.0, ge=0.0, description="Deposit amount in rupees (default: 0.0)"),
    currency_code: str = Query("INR", description="Currency code (default: INR)"),
    guest_first_name: str = Query(..., description="Guest first name (example: John)"),
    guest_last_name: str = Query(..., description="Guest last name (example: Doe)"),
    guest_email: str = Query(..., description="Guest email (format: email@example.com)"),
    guest_phone: str = Query("NA", description="Guest phone (format: +91-9999999999 or NA)"),
    guest_country: str = Query("India", description="Guest country (default: India)"),
    other_guests: Optional[str] = Query(None, description="Comma-separated list of additional guest names (e.g., 'Jane Doe, Bob Smith')"),
    special_requests: Optional[str] = Query(None, description="Special requests/comments (optional)")
):
    """
    Create a booking directly in IDS - GET version for easy testing
    
    PARAMETER FORMATS:
    - check_in_date: YYYY-MM-DD (e.g., 2025-11-01) - Must be future date
    - check_out_date: YYYY-MM-DD (e.g., 2025-11-04) - Must be at least 3 nights after check-in
    - adults: Integer 1-10
    - children: Integer 0-10
    - room_code: String (e.g., EXT, DLX, STD)
    - rate_plan_code: String (e.g., RR0925)
    - total_amount: Integer in INR (e.g., 149680 for ₹1,496.80)
    - currency_code: String (default: INR)
    - guest_first_name: String
    - guest_last_name: String
    - guest_email: Valid email format
    - guest_phone: String (e.g., +91-9999999999)
    - guest_country: String (default: India)
    
    BUSINESS RULES:
    - Minimum stay: 3 nights
    - Check-in date must be in the future
    - Total amount is in INR (Indian Rupees)
    
    EXAMPLE REQUEST:
    GET /api/v1/ids/bookings/create?check_in_date=2025-11-01&check_out_date=2025-11-04&adults=2&children=0&room_code=EXT&rate_plan_code=RR0925&total_amount=149680&guest_first_name=John&guest_last_name=Doe&guest_email=john.doe@example.com
    
    The API will:
    1. Accept JSON parameters via GET query string
    2. Convert to exact OTA XML format (MakeMyTrip compatible)
    3. Post XML to IDS server with authentication
    4. Return booking confirmation or error
    """
    try:
        # Build booking data from query parameters
        booking_data = {
            "unique_id": unique_id,
            "check_in_date": check_in_date.isoformat() if hasattr(check_in_date, 'isoformat') else str(check_in_date),
            "check_out_date": check_out_date.isoformat() if hasattr(check_out_date, 'isoformat') else str(check_out_date),
            "adults": adults,
            "children": children,
            "room_code": room_code,
            "rate_plan_code": rate_plan_code,
            "total_amount": float(total_amount),  # Ensure it's a float
            "deposit_amount": float(deposit_amount),  # Ensure it's a float
            "currency_code": currency_code,
            "guest_info": {
                "first_name": guest_first_name,
                "last_name": guest_last_name,
                "email": guest_email,
                "phone": guest_phone,
                "country": guest_country
            }
        }

        # Parse comma-separated other guests into list and add to guest_info
        if other_guests:
            booking_data["guest_info"]["other_guests"] = [name.strip() for name in other_guests.split(",") if name.strip()]

        if special_requests:
            booking_data["special_requests"] = special_requests

        logger.info(f"IDS endpoint booking_data keys: {list(booking_data.keys())}")
        logger.info(f"IDS endpoint booking_data: {booking_data}")

        ids_service = IDSService()
        return await ids_service.create_booking(booking_data)
    except Exception as e:
        logger.error(f"Failed to create booking in IDS via GET: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")


@router.post("/bookings/{booking_reference}/cancel")
async def cancel_booking_direct(
    booking_reference: str,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db_with_retry)
):
    """Cancel a booking directly in IDS - Booking Service"""
    try:
        ids_service = IDSService()
        return await ids_service.cancel_booking(booking_reference, reason)
    except Exception as e:
        logger.error(f"Failed to cancel booking in IDS: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to cancel booking: {str(e)}")


@router.get("/bookings/{booking_reference}/status")
async def check_booking_status(booking_reference: str):
    """Check booking status from IDS - Booking Service"""
    try:
        from app.services.ids_adapter import IDSAdapterService
        from app.core.config import settings

        # Use PMS adapter for status checking
        adapter = IDSAdapterService(settings.IDS_API_URL, settings.IDS_API_KEY, settings.IDS_API_SECRET)
        result = await adapter.check_reservation_status(booking_reference)
        return result
    except Exception as e:
        logger.error(f"Failed to check booking status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to check booking status: {str(e)}")


# ============================================================================
# IDS PUSH ENDPOINTS - These endpoints receive data FROM IDS (Push Model)
# ============================================================================

@router.post("/room-types/receive")
async def receive_room_type_delta(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive room type delta notifications FROM IDS (Push Model)

    This endpoint receives RN_HotelRatePlanRQ messages from IDS
    when room types or rate plans change. IDS pushes delta XML data to us.

    This implements the "Delta Room Type" functionality from IDS specification.
    """
    try:
        # Get raw XML data first
        xml_data = await request.body()
        xml_string = xml_data.decode('utf-8')

        # Verify authentication with XML body for fallback credential checking
        await verify_ids_auth(request, xml_string)

        logger.info(f"Received room type delta XML from IDS: {len(xml_string)} bytes")

        # Parse the delta room type XML
        parsed_data = parse_room_type_delta(xml_string)
        logger.info(f"Parsed delta room type data: echo_token={parsed_data['echo_token']}, "
                   f"hotel_code={parsed_data['hotel_code']}, "
                   f"room_types={len(parsed_data['room_types'])}, "
                   f"rate_plans={len(parsed_data['rate_plans'])}")

        # Process delta room type data using IDSDataProcessor
        processor = IDSDataProcessor(db)
        await processor.process_room_type_delta(parsed_data)

        # Return success response as XML (ProductSyncSuccessResponse)
        success_response = '''<?xml version="1.0" encoding="utf-8"?>
<ProductSyncSuccessResponse xmlns="http://www.opentravel.org/OTA/2003/05"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
Version="1.2" EchoToken="''' + parsed_data['echo_token'] + '''">
  <Success/>
</ProductSyncSuccessResponse>'''

        logger.info("Successfully processed room type delta from IDS")
        return Response(content=success_response, media_type="application/xml")

    except Exception as e:
        logger.error(f"Failed to process room type delta: {e}")

        # Return error response as XML
        error_response = '''<?xml version="1.0" encoding="utf-8"?>
<ProductSyncSuccessResponse xmlns="http://www.opentravel.org/OTA/2003/05"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
Version="1.2" EchoToken="error">
  <Errors>
    <Error Type="1">''' + str(e) + '''</Error>
  </Errors>
</ProductSyncSuccessResponse>'''

        return Response(content=error_response, media_type="application/xml", status_code=500)


def parse_room_type_delta(xml_string: str) -> Dict[str, Any]:
    """
    Parse IDS Delta Room Type XML (RN_HotelRatePlanRQ) into structured data

    This handles the push notifications for room type changes from IDS.
    """
    try:
        root = ET.fromstring(xml_string)
        ns = {'ota': 'http://www.opentravel.org/OTA/2003/05'}

        # Get basic info
        echo_token = root.get('EchoToken')
        hotel_code = root.find('.//ota:HotelCriteria', ns).get('HotelCode') if root.find('.//ota:HotelCriteria', ns) is not None else None

        # Parse room types
        room_types = []
        for room_type_elem in root.findall('.//ota:RoomType', ns):
            room_type = {
                'inv_type_code': room_type_elem.get('InvTypeCode'),
                'name': room_type_elem.get('Name'),
                'base_occupancy': room_type_elem.get('BaseOccupancy'),
                'max_occupancy': room_type_elem.get('MaxOccupancy'),
                'quantity': int(room_type_elem.get('Quantity', 0)),
                'is_room_active': room_type_elem.get('IsRoomActive') == '1',
                'room_description': room_type_elem.findtext('.//ota:RoomDescription', '', ns)
            }
            room_types.append(room_type)

        # Parse rate plans
        rate_plans = []
        for rate_plan_elem in root.findall('.//ota:RatePlan', ns):
            rate_plan = {
                'rate_plan_code': rate_plan_elem.get('RatePlanCode'),
                'rate_plan_category': rate_plan_elem.get('RatePlanCategory'),
                'rate_plan_status_type': rate_plan_elem.get('RatePlanStatusType'),
                'rate_plan_name': rate_plan_elem.get('RatePlanName'),
                'description': rate_plan_elem.get('Description'),
                'inv_type_code': rate_plan_elem.get('InvTypeCode'),
                'meal_plan_code': rate_plan_elem.get('MealPlanCode'),
                'meal_plan_desc': rate_plan_elem.get('MealPlanDesc'),
                'start': rate_plan_elem.get('Start'),
                'end': rate_plan_elem.get('End'),
                'currency_code': rate_plan_elem.get('CurrencyCode')
            }
            rate_plans.append(rate_plan)

        # Parse inclusions
        inclusions = []
        for inclusion_elem in root.findall('.//ota:Inclusion', ns):
            inclusion = {
                'meal_plan_code': inclusion_elem.get('MealPlanCode'),
                'meal_plan_desc': inclusion_elem.get('MealPlanDesc')
            }
            inclusions.append(inclusion)

        return {
            'echo_token': echo_token,
            'hotel_code': hotel_code,
            'room_types': room_types,
            'rate_plans': rate_plans,
            'inclusions': inclusions
        }

    except ET.ParseError as e:
        logger.error(f"XML parsing error for room type delta: {e}")
        raise ValueError(f"Invalid XML format: {e}")
    except Exception as e:
        logger.error(f"Error parsing room type delta: {e}")
        raise ValueError(f"Failed to parse room type delta data: {e}")


@router.post("/inventory/receive")
async def receive_inventory_notification(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive inventory notifications FROM IDS (Push Model)

    This endpoint receives OTA_HotelInvCountNotifRQ messages from IDS
    when inventory levels change. IDS pushes XML data to us.
    """
    try:
        # Get raw XML data first
        xml_data = await request.body()
        xml_string = xml_data.decode('utf-8')

        # Verify authentication with XML body for fallback credential checking
        await verify_ids_auth(request, xml_string)

        logger.info(f"Received inventory notification XML from IDS: {len(xml_string)} bytes")

        # Parse the XML into structured data
        parsed_data = parse_inventory_notification(xml_string)
        logger.info(f"Parsed inventory data: echo_token={parsed_data['echo_token']}, "
                   f"hotel_code={parsed_data['hotel_code']}, "
                   f"inventory_items={len(parsed_data['inventories'])}")

        # Process inventory data using IDSDataProcessor
        processor = IDSDataProcessor(db)
        await processor.process_inventory_data(parsed_data)

        # Return success response as XML (OTA standard format)
        success_response = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRS xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" TimeStamp="''' + datetime.now().isoformat() + '''" Version="2.000">
    <Success />
</OTA_HotelInvCountNotifRS>'''

        logger.info("Successfully processed inventory notification from IDS")
        return success_response

    except Exception as e:
        logger.error(f"Failed to process inventory notification: {e}")

        # Return error response as XML (OTA standard format)
        error_response = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRS xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" TimeStamp="''' + datetime.now().isoformat() + '''" Version="2.000">
    <Errors>
        <Error Type="1">''' + str(e) + '''</Error>
    </Errors>
</OTA_HotelInvCountNotifRS>'''

        return error_response


@router.post("/availability/receive")
async def receive_availability_notification(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive availability notifications FROM IDS (Push Model)

    This endpoint receives OTA_HotelAvailNotifRQ messages from IDS
    when availability or restrictions change. IDS pushes XML data to us.
    """
    try:
        # Get raw XML data first
        xml_data = await request.body()
        xml_string = xml_data.decode('utf-8')

        # Verify authentication with XML body for fallback credential checking
        await verify_ids_auth(request, xml_string)

        logger.info(f"Received availability notification XML from IDS: {len(xml_string)} bytes")

        # Parse the XML into structured data
        parsed_data = parse_availability_notification(xml_string)
        logger.info(f"Parsed availability data: echo_token={parsed_data['echo_token']}, "
                   f"hotel_code={parsed_data['hotel_code']}, "
                   f"messages={len(parsed_data['avail_status_messages'])}")

        # Process availability data using IDSDataProcessor
        processor = IDSDataProcessor(db)
        await processor.process_availability_data(parsed_data)

        # Return success response as XML
        success_response = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelAvailNotifRS xmlns="http://www.opentravel.org/OTA/2003/05"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
Version="1.0" EchoToken="processed" TimeStamp="''' + datetime.now().isoformat() + '''" MessageContentCode="3">
  <Success/>
</OTA_HotelAvailNotifRS>'''

        logger.info("Successfully processed availability notification from IDS")
        return success_response

    except Exception as e:
        logger.error(f"Failed to process availability notification: {e}")

        # Return error response as XML
        error_response = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelAvailNotifRS xmlns="http://www.opentravel.org/OTA/2003/05"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
Version="1.0" EchoToken="error" TimeStamp="''' + datetime.now().isoformat() + '''" MessageContentCode="3">
  <Errors>
    <Error Type="1">''' + str(e) + '''</Error>
  </Errors>
</OTA_HotelAvailNotifRS>'''

        return error_response


@router.post("/bookings/receive")
async def receive_booking_notification(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive booking notifications FROM IDS (Push Model)

    This endpoint receives OTA_HotelResNotifRQ messages from IDS
    when bookings are created, modified, or cancelled. IDS pushes XML data to us.
    """
    try:
        # Get raw XML data first
        xml_data = await request.body()
        xml_string = xml_data.decode('utf-8')

        # Verify authentication with XML body for fallback credential checking
        await verify_ids_auth(request, xml_string)

        logger.info(f"Received booking notification XML from IDS: {len(xml_string)} bytes")

        # Parse the XML into structured data
        parsed_data = parse_booking_notification(xml_string)
        logger.info(f"Parsed booking data: echo_token={parsed_data['echo_token']}, "
                   f"message_content_code={parsed_data['message_content_code']}, "
                   f"reservations={len(parsed_data['hotel_reservations'])}")

        # Process booking data using IDSDataProcessor
        processor = IDSDataProcessor(db)
        await processor.process_booking_data(parsed_data)

        # Return success response as JSON for now (IDS might accept JSON for bookings)
        response = {
            "success": True,
            "echo_token": parsed_data['echo_token'],
            "timestamp": datetime.now().isoformat(),
            "message": "Booking notification processed successfully",
            "processed_reservations": len(parsed_data['hotel_reservations'])
        }

        logger.info("Successfully processed booking notification from IDS")
        return response

    except Exception as e:
        logger.error(f"Failed to process booking notification: {e}")

        # Return error response
        response = {
            "success": False,
            "echo_token": "error",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }
        return response


@router.post("/bookings/confirm")
async def receive_booking_confirmation(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive booking confirmations FROM IDS (Push Model)

    This endpoint receives OTA_NotifReportRQ messages from IDS
    containing the PMS reservation number after successful booking creation.
    This is the final confirmation step in the IDS ARI 2.4 flow.
    """
    try:
        # Get raw XML data first
        xml_data = await request.body()
        xml_string = xml_data.decode('utf-8')

        # Verify authentication with XML body for fallback credential checking
        await verify_ids_auth(request, xml_string)

        logger.info(f"RECEIVED BOOKING CONFIRMATION FROM IDS: {len(xml_string)} bytes")
        logger.info(f"Echo Token: {request.headers.get('Echo-Token', 'N/A')}")
        logger.info(f"📄 Full Confirmation XML: {xml_string}")

        # Parse the OTA_NotifReportRQ
        ids_service = IDSService()
        try:
            confirmation = ids_service._xml_to_model(xml_string, OTANotifReportRQ)
        except Exception as parse_error:
            logger.error(f"Failed to parse OTA_NotifReportRQ: {parse_error}")
            logger.error(f"Raw XML: {xml_string[:500]}...")
            # Try to extract basic info manually for logging
            import defusedxml.ElementTree as ET
            try:
                root = ET.fromstring(xml_string)
                echo_token = root.get('EchoToken', 'unknown')
                timestamp = root.get('TimeStamp', 'unknown')
                logger.error(f"Manual extraction - EchoToken: {echo_token}, TimeStamp: {timestamp}")
            except:
                logger.error("Could not even parse basic XML structure")
            return {
                "success": False,
                "echo_token": "parse_error",
                "timestamp": datetime.now().isoformat(),
                "error": f"XML parsing failed: {str(parse_error)}"
            }

        logger.info(f" Parsed confirmation - Success: {confirmation.is_success}")
        logger.info(f"🏨 PMS Reservation Number: {confirmation.pms_reservation_number}")

        logger.info(f"Parsed confirmation: echo_token={confirmation.echo_token}, success={confirmation.is_success}")

        if confirmation.is_success:
            # Extract PMS reservation number
            pms_number = confirmation.pms_reservation_number
            booking_ref = confirmation.echo_token  # Usually contains our booking reference

            logger.info(f" Booking confirmed! PMS Number: {pms_number}, Reference: {booking_ref}")

            # Create confirmation record
            confirmation_record = BookingConfirmation(
                booking_reference=booking_ref,
                pms_reservation_number=pms_number,
                status="confirmed",
                hotel_code="7167"  # From our hotel code
            )

            # Here you would typically save this to database
            # For now, just log it
            logger.info(f"Booking confirmation saved: {confirmation_record.dict()}")

            # Return success acknowledgment
            response = {
                "success": True,
                "echo_token": confirmation.echo_token,
                "timestamp": datetime.now().isoformat(),
                "message": f"Booking confirmation received. PMS Reservation: {pms_number}",
                "pms_reservation_number": pms_number,
                "booking_reference": booking_ref
            }

            logger.info("Successfully processed booking confirmation from IDS")
            return response

        else:
            # Handle confirmation errors
            error_msg = "Unknown error"
            if confirmation.errors and len(confirmation.errors) > 0:
                error_msg = confirmation.errors[0].get('message', 'Confirmation error')

            logger.warning(f"Booking confirmation failed: {error_msg}")

            response = {
                "success": False,
                "echo_token": confirmation.echo_token,
                "timestamp": datetime.now().isoformat(),
                "error": error_msg
            }
            return response

    except Exception as e:
        logger.error(f"Failed to process booking confirmation: {e}")
        import traceback
        traceback.print_exc()

        # Return error response
        response = {
            "success": False,
            "echo_token": "error",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }
        return response
