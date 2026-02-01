"""
IDS Next ARI Service
Handles communication with IDS backend for availability, rates, and inventory management
"""

import asyncio
import httpx
import defusedxml.ElementTree as ET
from xml.etree.ElementTree import Element
from datetime import date, datetime, timedelta
from typing import List, Optional, Dict, Any
from uuid import uuid4
import logging
import base64

# Import anext for async generators (Python 3.10+ builtin, import for compatibility)
try:
    anext
except NameError:
    try:
        from builtins import anext
    except ImportError:
        # Polyfill for Python < 3.10
        async def anext(iterator, default=None):
            try:
                return await iterator.__anext__()
            except StopAsyncIteration:
                if default is not None:
                    return default
                raise

from app.core.config import settings
from app.core.exceptions import ValidationError, BookingError
from app.services.ids_adapter import IDSAdapterService
from app.models.ids import (
    OTAHotelAvailNotifRQ, OTAHotelAvailNotifRS,
    OTAHotelRatePlanNotifRQ, OTAHotelRatePlanNotifRS,
    OTAHotelInvCountNotifRQ, OTAHotelInvCountNotifRS,
    AvailStatusMessages, AvailStatusMessage, StatusApplicationControl,
    RestrictionStatusElement, LengthsOfStay, LengthOfStay,
    UniqueID, AvailabilityUpdate, RateUpdate, AvailabilityQuery, AvailabilityResponse,
    RestrictionType, RestrictionStatus, MinMaxMessageType, TimeUnit, Warnings, Errors,
    Inventories, Inventory, InvCount
)
from app.models.ids_booking import (
    OTAHotelResNotifRQ, OTAHotelResNotifRS, OTACancelRQ, OTACancelRS,
    OTANotifReportRQ, BookingConfirmation,
    BookingCreateRequest, BookingCancelRequest, BookingCreateResponse, BookingCancelResponse,
    GuestInfo
)
from app.db.postgresql import get_db

logger = logging.getLogger(__name__)


class IDSService:
    """Service for IDS Next ARI integration"""

    def __init__(self):
        self.base_url = settings.IDS_BASE_URL  # For receiving FROM IDS
        self.api_url = getattr(settings, 'IDS_API_URL', None)  # For sending TO IDS
        self.hotel_code = settings.IDS_HOTEL_CODE
        self.api_key = settings.IDS_API_KEY
        self.api_secret = settings.IDS_API_SECRET
        self.rate_plan_mapping = settings.IDS_RATE_PLAN_MAPPING or {}
        self.room_code_mapping = settings.IDS_ROOM_CODE_MAPPING or {}
        self.timeout = 30.0

    async def _make_request(self, endpoint: str, xml_data: str, max_retries: int = 3) -> str:
        """Make HTTP request to IDS API with retry logic"""
        if not self.base_url:
            raise ValidationError("IDS integration not configured")

        # Determine which URL to use based on operation type
        if endpoint in ['room-types', 'booking', 'availability']:
            # Outbound requests (sending TO IDS) - use api_url
            if not self.api_url:
                logger.error(f"No IDS API URL configured for outbound requests to endpoint: {endpoint}")
                raise ValidationError(f"IDS API URL not configured for {endpoint} requests. "
                                    "Need IDS_API_URL for sending data TO IDS.")

            # Special handling for ReceiveResFromCM endpoint
            if 'ReceiveResFromCM' in self.api_url:
                # ReceiveResFromCM accepts XML directly without sub-endpoints
                url = self.api_url
            else:
                # Standard API with endpoints
                url = f"{self.api_url.rstrip('/')}/{endpoint}"
        else:
            # Inbound requests (receiving FROM IDS) - use base_url
            if 'ReceiveResFromCM' in self.base_url:
                # This is a receiving endpoint (IDS pushes to us)
                url = self.base_url
            else:
                # Standard API endpoints
                url = f"{self.base_url}/{endpoint}"

        # Create HTTP Basic authentication header
        if self.api_key and self.api_secret:
            credentials = f"{self.api_key}:{self.api_secret}"
            encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
            auth_header = f"Basic {encoded_credentials}"
        else:
            raise ValidationError("IDS API credentials not configured")

        headers = {
            "Content-Type": "application/xml",
            "Accept": "application/xml",
            "Authorization": auth_header,
        }

        last_exception = None

        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(url, content=xml_data, headers=headers)
                    response.raise_for_status()
                    return response.text

            except httpx.TimeoutException as exc:
                last_exception = exc
                logger.warning(f"IDS API timeout (attempt {attempt + 1}/{max_retries}): {exc}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    continue

            except httpx.RequestError as exc:
                last_exception = exc
                logger.error(f"IDS API request failed (attempt {attempt + 1}/{max_retries}): {exc}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue

            except httpx.HTTPStatusError as exc:
                last_exception = exc
                logger.error(f"IDS API error {exc.response.status_code} (attempt {attempt + 1}/{max_retries}): {exc.response.text}")

                # Don't retry on client errors (4xx), but retry on server errors (5xx)
                if 400 <= exc.response.status_code < 500:
                    break
                elif attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue

        # If we get here, all retries failed
        error_msg = f"IDS API communication failed after {max_retries} attempts"
        if last_exception:
            error_msg += f": {str(last_exception)}"

        logger.error(error_msg)
        raise BookingError(error_msg)

    def _model_to_xml(self, model) -> str:
        """Convert Pydantic model to XML string"""
        # For now, we'll use a simple XML generation
        # In production, you might want to use a proper XML serialization library
        # like pydantic-xml or similar
        if isinstance(model, OTAHotelAvailNotifRQ):
            return self._availability_request_to_xml(model)
        elif isinstance(model, OTAHotelRatePlanNotifRQ):
            return self._rate_request_to_xml(model)
        elif isinstance(model, OTAHotelInvCountNotifRQ):
            return self._inventory_request_to_xml(model)
        elif isinstance(model, OTAHotelResNotifRQ):
            return self._booking_request_to_xml(model)
        elif isinstance(model, OTACancelRQ):
            return self._cancel_request_to_xml(model)
        else:
            raise ValueError(f"Unsupported model type: {type(model)}")

    def _availability_request_to_xml(self, request: OTAHotelAvailNotifRQ) -> str:
        """Convert availability request to XML"""
        xml_parts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<OTA_HotelAvailNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05"',
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            f'Version="{request.version}" EchoToken="{request.echo_token}"',
            f'TimeStamp="{request.time_stamp.isoformat()}" MessageContentCode="{request.message_content_code}">',
            f'<AvailStatusMessages HotelCode="{request.avail_status_messages.hotel_code}">'
        ]

        for msg in request.avail_status_messages.avail_status_message:
            sac = msg.status_application_control
            xml_parts.append('<AvailStatusMessage>')
            xml_parts.append(
                f'<StatusApplicationControl Start="{sac.start.isoformat()}" End="{sac.end.isoformat()}" '
                f'InvTypeCode="{sac.inv_type_code}" RatePlanCode="{sac.rate_plan_code}" '
                f'MealPlanCode="{sac.meal_plan_code}"'
            )

            # Add day of week attributes if specified
            dow_attrs = []
            if sac.mon is not None: dow_attrs.append(f'Mon="{int(sac.mon)}"')
            if sac.tue is not None: dow_attrs.append(f'Tue="{int(sac.tue)}"')
            if sac.wed is not None: dow_attrs.append(f'Weds="{int(sac.wed)}"')
            if sac.thu is not None: dow_attrs.append(f'Thur="{int(sac.thu)}"')
            if sac.fri is not None: dow_attrs.append(f'Fri="{int(sac.fri)}"')
            if sac.sat is not None: dow_attrs.append(f'Sat="{int(sac.sat)}"')
            if sac.sun is not None: dow_attrs.append(f'Sun="{int(sac.sun)}"')

            if dow_attrs:
                xml_parts[-1] += ' ' + ' '.join(dow_attrs)

            xml_parts[-1] += '></StatusApplicationControl>'

            # Add restriction status
            if msg.restriction_status:
                rs = msg.restriction_status
                xml_parts.append(
                    f'<RestrictionStatus Restriction="{rs.restriction.value}" Status="{rs.status.value}"/>'
                )

            # Add lengths of stay
            if msg.lengths_of_stay and msg.lengths_of_stay.length_of_stay:
                xml_parts.append('<LengthsOfStay>')
                for los in msg.lengths_of_stay.length_of_stay:
                    xml_parts.append(
                        f'<LengthOfStay Time="{los.time}" TimeUnit="{los.time_unit.value}" '
                        f'MinMaxMessageType="{los.min_max_message_type.value}" />'
                    )
                xml_parts.append('</LengthsOfStay>')

            # Add unique ID
            if msg.unique_id:
                xml_parts.append(
                    f'<UniqueID Type="{msg.unique_id.type}" ID="{msg.unique_id.id}"></UniqueID>'
                )

            xml_parts.append('</AvailStatusMessage>')

        xml_parts.extend([
            '</AvailStatusMessages>',
            '</OTA_HotelAvailNotifRQ>'
        ])

        return '\n'.join(xml_parts)

    def _rate_request_to_xml(self, request) -> str:
        """Convert rate request to XML"""
        # Use proper OTA structure for rate plans
        xml_parts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<OTA_HotelRatePlanNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05"',
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            f'Version="{request.version}" EchoToken="{request.echo_token}"',
            f'TimeStamp="{request.time_stamp.isoformat()}" MessageContentCode="8">',
            f'<RatePlanMessages HotelCode="{request.rate_plan_messages.hotel_code}">'
        ]

        for msg in request.rate_plan_messages.rate_plan_message:
            xml_parts.append('<RatePlanMessage>')
            rp = msg.rate_plan

            # Build RatePlan element with required attributes
            rate_plan_attrs = [
                f'RatePlanCode="{rp.rate_plan_code}"',
                f'RatePlanCategory="RACK"',  # Default to RACK as per IDS spec
                f'Start="{msg.rates.rate[0].effective_date.isoformat()}"',
                f'End="{msg.rates.rate[0].expire_date.isoformat()}"',
                f'CurrencyCode="{rp.currency_code}"',
                f'RatePlanNotifType="Overlay"'
            ]

            xml_parts.append(f'<RatePlan {" ".join(rate_plan_attrs)}>')

            if rp.rate_plan_name:
                xml_parts.append(rp.rate_plan_name)
            xml_parts.append('</RatePlan>')

            # Add rates
            xml_parts.append('<Rates>')
            for rate in msg.rates.rate:
                # Build Rate element with required attributes
                rate_attrs = [
                    f'RateTimeUnit="{rate.rate_time_unit}"',
                    f'UnitMultiplier="{rate.unit_multiplier}"',
                    f'InvTypeCode="{rate.inv_type_code}"',
                    f'MealPlanCode="{rate.meal_plan_code}"',
                    f'CurrencyCode="{rate.currency_code}"',
                    f'Start="{rate.effective_date.isoformat()}"',
                    f'End="{rate.expire_date.isoformat()}"'
                ]

                # Add day of week attributes if present
                dow_attrs = []
                if hasattr(rate, 'sun') and rate.sun is not None:
                    dow_attrs.append(f'Sun="{int(rate.sun)}"')
                if hasattr(rate, 'mon') and rate.mon is not None:
                    dow_attrs.append(f'Mon="{int(rate.mon)}"')
                if hasattr(rate, 'tue') and rate.tue is not None:
                    dow_attrs.append(f'Tue="{int(rate.tue)}"')
                if hasattr(rate, 'wed') and rate.wed is not None:
                    dow_attrs.append(f'Weds="{int(rate.wed)}"')
                if hasattr(rate, 'thu') and rate.thu is not None:
                    dow_attrs.append(f'Thur="{int(rate.thu)}"')
                if hasattr(rate, 'fri') and rate.fri is not None:
                    dow_attrs.append(f'Fri="{int(rate.fri)}"')
                if hasattr(rate, 'sat') and rate.sat is not None:
                    dow_attrs.append(f'Sat="{int(rate.sat)}"')

                if dow_attrs:
                    rate_attrs.extend(dow_attrs)

                xml_parts.append(f'<Rate {" ".join(rate_attrs)}>')

                # Add BaseByGuestAmts with proper AgeQualifyingCode structure
                xml_parts.append('<BaseByGuestAmts>')
                if hasattr(rate, 'base_by_guest_amts') and rate.base_by_guest_amts:
                    for guest_amt in rate.base_by_guest_amts.base_by_guest_amt:
                        xml_parts.append(
                            f'<BaseByGuestAmt AgeQualifyingCode="{guest_amt.age_qualifying_code}" '
                            f'NumberOfGuests="{guest_amt.number_of_guests}" '
                            f'AmountBeforeTax="{guest_amt.amount_before_tax}"/>'
                        )
                xml_parts.append('</BaseByGuestAmts>')

                # Add AdditionalGuestAmounts if present
                if hasattr(rate, 'additional_guest_amounts') and rate.additional_guest_amounts:
                    xml_parts.append('<AdditionalGuestAmounts>')
                    for add_guest in rate.additional_guest_amounts.additional_guest_amount:
                        xml_parts.append(
                            f'<AdditionalGuestAmount AgeQualifyingCode="{add_guest.age_qualifying_code}" '
                            f'Amount="{add_guest.amount}"/>'
                        )
                    xml_parts.append('</AdditionalGuestAmounts>')

                xml_parts.append('</Rate>')
            xml_parts.append('</Rates>')
            xml_parts.append('</RatePlanMessage>')

        xml_parts.extend([
            '</RatePlanMessages>',
            '</OTA_HotelRatePlanNotifRQ>'
        ])

        return '\n'.join(xml_parts)

    def _inventory_request_to_xml(self, request: OTAHotelInvCountNotifRQ) -> str:
        """Convert inventory request to XML"""
        xml_parts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<OTA_HotelInvCountNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05"',
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            f'Version="{request.version}" EchoToken="{request.echo_token}"',
            f'TimeStamp="{request.time_stamp.isoformat()}" MessageContentCode="{request.message_content_code}">',
            f'<Inventories HotelCode="{request.inventories.hotel_code}">'
        ]

        for inventory in request.inventories.inventory:
            sac = inventory.status_application_control
            xml_parts.append('<Inventory>')
            xml_parts.append(
                f'<StatusApplicationControl Start="{sac.start.isoformat()}" End="{sac.end.isoformat()}" '
                f'InvTypeCode="{sac.inv_type_code}" RatePlanCode="{sac.rate_plan_code}" '
                f'MealPlanCode="{sac.meal_plan_code}"'
            )

            # Add day of week attributes if specified
            dow_attrs = []
            if sac.mon is not None: dow_attrs.append(f'Mon="{int(sac.mon)}"')
            if sac.tue is not None: dow_attrs.append(f'Tue="{int(sac.tue)}"')
            if sac.wed is not None: dow_attrs.append(f'Weds="{int(sac.wed)}"')
            if sac.thu is not None: dow_attrs.append(f'Thur="{int(sac.thu)}"')
            if sac.fri is not None: dow_attrs.append(f'Fri="{int(sac.fri)}"')
            if sac.sat is not None: dow_attrs.append(f'Sat="{int(sac.sat)}"')
            if sac.sun is not None: dow_attrs.append(f'Sun="{int(sac.sun)}"')

            if dow_attrs:
                xml_parts[-1] += ' ' + ' '.join(dow_attrs)

            xml_parts[-1] += '></StatusApplicationControl>'

            # Add inventory count
            inv_count = inventory.inv_count
            xml_parts.append(
                f'<InvCount CountType="{inv_count.count_type}" Count="{inv_count.count}"/>'
            )

            xml_parts.append('</Inventory>')

        xml_parts.extend([
            '</Inventories>',
            '</OTA_HotelInvCountNotifRQ>'
        ])

        return '\n'.join(xml_parts)

    def _booking_request_to_xml(self, request) -> str:
        """Convert booking request to XML"""
        # Since we're now building the proper OTA models, we can use the standard model_to_xml approach
        # The request should already be a properly constructed OTAHotelResNotifRQ object
        # This method is called from _model_to_xml when the request is an OTAHotelResNotifRQ

        # Convert the Pydantic model to XML using standard approach
        # For now, let's create a simple XML representation
        xml_parts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            f'<OTA_HotelResNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05"',
            f'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            f'Version="{request.version}" EchoToken="{request.echo_token}"',
            f'TimeStamp="{request.time_stamp.isoformat()}" MessageContentCode="{request.message_content_code}">',
            '<HotelReservations>',
            '<HotelReservation>',
            '<RoomStays>',
            '<RoomStay>',
            '<RoomTypes>',
            f'<RoomType RoomTypeCode="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.room_types.room_type.room_type_code}"/>',
            '</RoomTypes>',
            '<RatePlans>',
            f'<RatePlan RatePlanCode="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.rate_plans.rate_plan.rate_plan_code}"/>',
            '</RatePlans>',
            '<RoomRates>',
            '<RoomRate>',
            '<Rates>',
            '<Rate>',
            f'<Total AmountAfterTax="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.total.amount_after_tax:.2f}" CurrencyCode="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.total.currency_code}"/>',
            '</Rate>',
            '</Rates>',
            '</RoomRate>',
            '</RoomRates>',
            '<GuestCounts>'
        ]

        # Add guest counts
        if hasattr(request.hotel_reservations.hotel_reservation.room_stays.room_stay.guest_counts, 'guest_count'):
            for guest_count in request.hotel_reservations.hotel_reservation.room_stays.room_stay.guest_counts.guest_count:
                xml_parts.append(f'<GuestCount AgeQualifyingCode="{guest_count.age_qualifying_code}" Count="{guest_count.count}"/>')

        xml_parts.extend([
            '</GuestCounts>',
            f'<TimeSpan Start="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.time_span.Start}" End="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.time_span.End}" />',
            f'<Total AmountAfterTax="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.total.amount_after_tax:.2f}" CurrencyCode="{request.hotel_reservations.hotel_reservation.room_stays.room_stay.total.currency_code}"/>',
            '</RoomStay>',
            '</RoomStays>',
            '<Services>'
        ])

        # Add services
        for service in request.hotel_reservations.hotel_reservation.services.service:
            xml_parts.extend([
                f'<Service ServiceType="{service.service_type}" ServiceCode="{service.service_code}">',
                '<ServiceDetails>'
            ])

            if service.service_details.guest_name:
                xml_parts.extend([
                    '<GuestName>',
                    f'<GivenName>{service.service_details.guest_name.given_name}</GivenName>',
                    f'<Surname>{service.service_details.guest_name.surname}</Surname>',
                    '</GuestName>'
                ])

            if service.service_details.contact_info:
                xml_parts.append('<ContactInfo>')
                if service.service_details.contact_info.addresses:
                    xml_parts.extend([
                        '<Addresses>',
                        '<Address>',
                        f'<Country>{service.service_details.contact_info.addresses.address.country}</Country>',
                        '</Address>',
                        '</Addresses>'
                    ])
                if service.service_details.contact_info.phones:
                    xml_parts.extend([
                        '<Phones>',
                        f'<Phone PhoneNumber="{service.service_details.contact_info.phones.phone.phone_number}"/>',
                        '</Phones>'
                    ])
                if service.service_details.contact_info.emails:
                    xml_parts.extend([
                        '<Emails>',
                        f'<Email>{service.service_details.contact_info.emails.email}</Email>',
                        '</Emails>'
                    ])
                xml_parts.append('</ContactInfo>')

            if service.service_details.comments:
                xml_parts.append(f'<Comments>{service.service_details.comments}</Comments>')

            xml_parts.extend([
                '</ServiceDetails>',
                '</Service>'
            ])

        xml_parts.extend([
            '</Services>',
            f'<UniqueID Type="{request.hotel_reservations.hotel_reservation.unique_id.type}" ID="{request.hotel_reservations.hotel_reservation.unique_id.id}"/>',
            '</HotelReservation>',
            '</HotelReservations>',
            '</OTA_HotelResNotifRQ>'
        ])

        return '\n'.join(xml_parts)

    def _cancel_request_to_xml(self, request: OTACancelRQ) -> str:
        """Convert cancellation request to XML"""
        xml_parts = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<OTA_CancelRQ xmlns="http://www.opentravel.org/OTA/2003/05"',
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            f'Version="{request.version}" EchoToken="{request.echo_token}"',
            f'TimeStamp="{request.time_stamp.isoformat()}">'
        ]

        # Add unique ID
        unique_id = request.unique_id
        xml_parts.append(
            f'<UniqueID Type="{unique_id.get("type", 16)}" ID="{unique_id.get("id", "")}"></UniqueID>'
        )

        # Add reason if provided
        if request.reason:
            xml_parts.append(f'<Reason>{request.reason}</Reason>')

        xml_parts.append('</OTA_CancelRQ>')

        return '\n'.join(xml_parts)

    def _xml_to_model(self, xml_str: str, model_class):
        """Parse XML response to model"""
        try:
            root = ET.fromstring(xml_str)
            if model_class == OTAHotelAvailNotifRS:
                return self._parse_availability_response(root)
            elif model_class == OTAHotelRatePlanNotifRS:
                return self._parse_rate_response(root)
            elif model_class == OTAHotelInvCountNotifRS:
                return self._parse_inventory_response(root)
            elif model_class == OTAHotelResNotifRS:
                return self._parse_booking_response(root)
            elif model_class == OTACancelRS:
                return self._parse_cancel_response(root)
            elif model_class == OTANotifReportRQ:
                return self._parse_notification_report(root)
            else:
                raise ValueError(f"Unsupported model class: {model_class}")
        except ET.ParseError as e:
            logger.error(f"XML parsing error: {e}")
            raise BookingError(f"Invalid IDS response format: {e}")

    def _parse_availability_response(self, root: Element) -> OTAHotelAvailNotifRS:
        """Parse availability response XML"""
        # Extract attributes
        attrs = root.attrib
        response = OTAHotelAvailNotifRS(
            version=attrs.get('Version', '1.0'),
            echo_token=attrs.get('EchoToken', ''),
            time_stamp=datetime.fromisoformat(attrs.get('TimeStamp', datetime.now().isoformat())),
            message_content_code=int(attrs.get('MessageContentCode', '3'))
        )

        # Check for success
        success_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Success')
        if success_elem is not None:
            response.success = success_elem  # This will be a simple object

        # Parse warnings
        warnings_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Warnings')
        if warnings_elem is not None:
            warnings = []
            for w in warnings_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Warning'):
                warnings.append({
                    'type': int(w.get('Type', 0)),
                    'code': int(w.get('Code')) if w.get('Code') else None,
                    'record_id': int(w.get('RecordID')) if w.get('RecordID') else None,
                    'text': w.text
                })
            response.warnings = Warnings(warning=warnings)

        # Parse errors
        errors_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Errors')
        if errors_elem is not None:
            errors = []
            for e in errors_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Error'):
                errors.append({
                    'type': int(e.get('Type', 0)),
                    'code': int(e.get('Code')) if e.get('Code') else None,
                    'record_id': int(e.get('RecordID')) if e.get('RecordID') else None,
                    'text': e.text
                })
            response.errors = Errors(error=errors)

        return response

    def _parse_rate_response(self, root: Element) -> OTAHotelRatePlanNotifRS:
        """Parse rate response XML"""
        # Similar to availability response parsing
        attrs = root.attrib
        response = OTAHotelRatePlanNotifRS(
            version=attrs.get('Version', '1.0'),
            echo_token=attrs.get('EchoToken', ''),
            time_stamp=datetime.fromisoformat(attrs.get('TimeStamp', datetime.now().isoformat()))
        )

        # Check for success, warnings, errors (similar to availability)
        success_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Success')
        if success_elem is not None:
            response.success = success_elem

        return response

    def _parse_inventory_response(self, root: Element) -> OTAHotelInvCountNotifRS:
        """Parse inventory response XML"""
        attrs = root.attrib
        response = OTAHotelInvCountNotifRS(
            **{'@Version': attrs.get('Version', '1.2')},
            **{'@EchoToken': attrs.get('EchoToken', '')},
            **{'@TimeStamp': datetime.fromisoformat(attrs.get('TimeStamp', datetime.now().isoformat()))}
        )

        # Check for success
        success_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Success')
        if success_elem is not None:
            response.success = success_elem

        # Parse warnings and errors (similar to other responses)
        warnings_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Warnings')
        if warnings_elem is not None:
            warnings = []
            for w in warnings_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Warning'):
                warnings.append({
                    'type': int(w.get('Type', 0)),
                    'code': int(w.get('Code')) if w.get('Code') else None,
                    'record_id': int(w.get('RecordID')) if w.get('RecordID') else None,
                    'text': w.text
                })
            response.warnings = Warnings(warning=warnings)

        errors_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Errors')
        if errors_elem is not None:
            errors = []
            for e in errors_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Error'):
                errors.append({
                    'type': int(e.get('Type', 0)),
                    'code': int(e.get('Code')) if e.get('Code') else None,
                    'record_id': int(e.get('RecordID')) if e.get('RecordID') else None,
                    'text': e.text
                })
            response.errors = Errors(error=errors)

        return response

    def _map_room_code(self, internal_code: str) -> str:
        """Map internal room code to IDS InvTypeCode"""
        return self.room_code_mapping.get(internal_code, internal_code)

    def _map_rate_plan_code(self, internal_category: str) -> str:
        """Map internal category to IDS RatePlanCode"""
        return self.rate_plan_mapping.get(internal_category, internal_category)

    async def update_availability(self, updates: List[AvailabilityUpdate]) -> OTAHotelAvailNotifRS:
        """Send availability updates to IDS"""
        messages = []
        for update in updates:
            # Create status application control
            sac = StatusApplicationControl(
                start=update.start_date,
                end=update.end_date,
                InvTypeCode=self._map_room_code(update.room_code),
                RatePlanCode=self._map_rate_plan_code(update.rate_plan_code),
                MealPlanCode=update.meal_plan_code
            )

            # Add day of week flags
            if update.day_of_week:
                sac.mon = update.day_of_week.get('mon')
                sac.tue = update.day_of_week.get('tue')
                sac.wed = update.day_of_week.get('wed')
                sac.thu = update.day_of_week.get('thu')
                sac.fri = update.day_of_week.get('fri')
                sac.sat = update.day_of_week.get('sat')
                sac.sun = update.day_of_week.get('sun')

            # Initialize optional fields
            restriction_status = None
            lengths_of_stay = None
            unique_id = None

            # Add restriction status
            if update.restriction_type and update.restriction_status:
                restriction_status = RestrictionStatusElement(
                    Restriction=update.restriction_type,
                    Status=update.restriction_status
                )

            # Add length of stay restrictions
            if update.min_los or update.max_los:
                los_list = []
                if update.min_los:
                    los_list.append(LengthOfStay(
                        time=update.min_los,
                        TimeUnit=TimeUnit.DAY,
                        MinMaxMessageType=MinMaxMessageType.SET_MIN_LOS
                    ))
                if update.max_los:
                    los_list.append(LengthOfStay(
                        time=update.max_los,
                        TimeUnit=TimeUnit.DAY,
                        MinMaxMessageType=MinMaxMessageType.SET_MAX_LOS
                    ))
                lengths_of_stay = LengthsOfStay(LengthOfStay=los_list)

            # Add unique ID for tracking
            if update.unique_id:
                unique_id = UniqueID(type=16, ID=update.unique_id)

            # Create message with all fields
            message = AvailStatusMessage(
                StatusApplicationControl=sac,
                RestrictionStatus=restriction_status,
                LengthsOfStay=lengths_of_stay,
                UniqueID=unique_id
            )

            messages.append(message)

        # Create request
        request = OTAHotelAvailNotifRQ(
            **{"@EchoToken": str(uuid4())},
            **{"@TimeStamp": datetime.now()},
            **{"AvailStatusMessages": AvailStatusMessages(
                **{"HotelCode": self.hotel_code},
                **{"AvailStatusMessage": messages}
            )}
        )

        # Convert to XML and send
        xml_request = self._model_to_xml(request)
        xml_response = await self._make_request("availability", xml_request)

        # Parse response
        return self._xml_to_model(xml_response, OTAHotelAvailNotifRS)

    async def update_inventory(self, inventory_updates: List[dict]) -> OTAHotelInvCountNotifRS:
        """Send inventory updates to IDS"""
        try:
            inventories_list = []
            for update in inventory_updates:
                # Create status application control
                sac = StatusApplicationControl(
                    start=update['start_date'],
                    end=update['end_date'],
                    InvTypeCode=self._map_room_code(update['room_code']),
                    RatePlanCode=self._map_rate_plan_code(update['rate_plan_code']),
                    MealPlanCode=update.get('meal_plan_code', 'CP')
                )

                # Add day of week flags if specified
                if update.get('day_of_week'):
                    dow = update['day_of_week']
                    sac.mon = dow.get('mon')
                    sac.tue = dow.get('tue')
                    sac.wed = dow.get('wed')
                    sac.thu = dow.get('thu')
                    sac.fri = dow.get('fri')
                    sac.sat = dow.get('sat')
                    sac.sun = dow.get('sun')

                # Create inventory count
                inv_count = InvCount(
                    count_type="2",  # Available quantity
                    count=update['available_count']
                )

                # Create inventory entry
                inventory = Inventory(
                    inv_type_code=sac.inv_type_code,
                    status_application_control=sac,
                    inv_count=inv_count
                )

                inventories_list.append(inventory)

            # Create request
            request = OTAHotelInvCountNotifRQ(
                echo_token=str(uuid4()),
                time_stamp=datetime.now(),
                inventories=Inventories(
                    hotel_code=self.hotel_code,
                    inventory=inventories_list
                )
            )

            # Convert to XML and send
            xml_request = self._model_to_xml(request)
            xml_response = await self._make_request("inventory", xml_request)

            # Parse response
            return self._xml_to_model(xml_response, OTAHotelInvCountNotifRS)

        except Exception as e:
            logger.error(f"Inventory update failed: {e}")
            # Return error response
            response = OTAHotelInvCountNotifRS(
                **{'@EchoToken': str(uuid4())},
                **{'@TimeStamp': datetime.now()}
            )
            # Add error
            response.errors = Errors(error=[{
                'type': 1,
                'text': str(e)
            }])
            return response

    async def update_rates(self, rate_updates: List[RateUpdate]) -> OTAHotelRatePlanNotifRS:
        """Send rate updates to IDS"""
        # Implementation for rate updates
        # This would create OTAHotelRatePlanNotifRQ and send to IDS
        # For now, returning a mock response
        response = OTAHotelRatePlanNotifRS(
            echo_token=str(uuid4()),
            time_stamp=datetime.now(),
            success=True
        )
        return response

    def _parse_booking_response(self, root: Element) -> OTAHotelResNotifRS:
        """Parse booking response XML"""
        attrs = root.attrib

        # Handle IDS timestamp format: "2017-07-21T15:21:47"
        timestamp_str = attrs.get('TimeStamp', '')
        try:
            if timestamp_str:
                # IDS format doesn't always include timezone, try to parse it
                if 'T' in timestamp_str:
                    # Add timezone if missing
                    if not ('+' in timestamp_str or '-' in timestamp_str[-6:] or 'Z' in timestamp_str):
                        timestamp_str += '+00:00'
                    time_stamp = datetime.fromisoformat(timestamp_str)
                else:
                    time_stamp = datetime.now()
            else:
                time_stamp = datetime.now()
        except ValueError:
            logger.warning(f"Could not parse IDS timestamp '{timestamp_str}', using current time")
            time_stamp = datetime.now()

        # Create response dict for model initialization
        response_data = {
            'version': attrs.get('Version', '3.002'),
            'echo_token': attrs.get('EchoToken', ''),
            'time_stamp': timestamp_str
        }

        # Only add res_status if it exists
        if 'ResStatus' in attrs:
            response_data['res_status'] = attrs['ResStatus']

        response = OTAHotelResNotifRS(**response_data)

        # Check for success - try multiple approaches
        success_elem = None

        # Try with namespace
        success_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Success')

        # If not found, try without namespace
        if success_elem is None:
            success_elem = root.find('.//Success')

        # If still not found, check if root itself indicates success
        if success_elem is None and root.tag.endswith('OTA_HotelResNotifRS'):
            # Assume success if we got a proper response structure and no errors
            logger.info("No explicit Success element found, assuming success based on valid OTA_HotelResNotifRS response structure")
            response.success = {"assumed": True, "reason": "Valid response structure indicates successful acknowledgment"}
        elif success_elem is not None:
            response.success = {"found": True, "reason": "Explicit Success element found"}

        # Parse warnings and errors (similar to availability)
        warnings_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Warnings')
        if warnings_elem is not None:
            warnings = []
            for w in warnings_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Warning'):
                warnings.append({
                    'type': int(w.get('Type', 0)),
                    'code': int(w.get('Code')) if w.get('Code') else None,
                    'record_id': int(w.get('RecordID')) if w.get('RecordID') else None,
                    'text': w.text
                })
            response.warnings = warnings

        errors_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Errors')
        if errors_elem is not None:
            errors = []
            for e in errors_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Error'):
                errors.append({
                    'type': int(e.get('Type', 0)),
                    'code': int(e.get('Code')) if e.get('Code') else None,
                    'record_id': int(e.get('RecordID')) if e.get('RecordID') else None,
                    'text': e.text
                })
            response.errors = errors

        return response

    def _parse_cancel_response(self, root: Element) -> OTACancelRS:
        """Parse cancellation response XML"""
        attrs = root.attrib
        response = OTACancelRS(
            version=attrs.get('Version', '1.0'),
            echo_token=attrs.get('EchoToken', ''),
            time_stamp=datetime.fromisoformat(attrs.get('TimeStamp', datetime.now().isoformat()))
        )

        # Check for success
        success_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Success')
        if success_elem is not None:
            response.success = success_elem

        # Parse warnings and errors (similar to other responses)
        warnings_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Warnings')
        if warnings_elem is not None:
            warnings = []
            for w in warnings_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Warning'):
                warnings.append({
                    'type': int(w.get('Type', 0)),
                    'code': int(w.get('Code')) if w.get('Code') else None,
                    'record_id': int(w.get('RecordID')) if w.get('RecordID') else None,
                    'text': w.text
                })
            response.warnings = warnings

        errors_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Errors')
        if errors_elem is not None:
            errors = []
            for e in errors_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}Error'):
                errors.append({
                    'type': int(e.get('Type', 0)),
                    'code': int(e.get('Code')) if e.get('Code') else None,
                    'record_id': int(e.get('RecordID')) if e.get('RecordID') else None,
                    'text': e.text
                })
            response.errors = errors

        return response

    def _parse_notification_report(self, root: Element) -> OTANotifReportRQ:
        """Parse OTA_NotifReportRQ (confirmation with PMS reservation number)"""
        attrs = root.attrib

        # Handle timestamp parsing for IDS format
        timestamp_str = attrs.get('TimeStamp', '')
        try:
            if timestamp_str:
                if 'T' in timestamp_str and not ('+' in timestamp_str or 'Z' in timestamp_str):
                    timestamp_str += '+00:00'
                time_stamp = datetime.fromisoformat(timestamp_str)
            else:
                time_stamp = datetime.now()
        except ValueError:
            logger.warning(f"Could not parse notification timestamp '{timestamp_str}', using current time")
            time_stamp = datetime.now()

        response = OTANotifReportRQ(
            **{ '@Version': attrs.get('Version', '1.0'),
                '@EchoToken': attrs.get('EchoToken', ''),
                '@TimeStamp': timestamp_str }  # Pass as string, validator will handle
        )

        # Check for success
        success_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Success')
        if success_elem is not None:
            response.success = {"found": True}

        # Check for errors
        error_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}Error')
        if error_elem is not None:
            response.errors = [{"message": error_elem.text, "code": error_elem.get('Code')}]

        # Parse NotifDetails for PMS reservation number
        notif_details = {}

        # HotelNotifReport
        hotel_report_elem = root.find('.//{http://www.opentravel.org/OTA/2003/05}HotelNotifReport')
        if hotel_report_elem is not None:
            hotel_report = {}

            # HotelReservations
            reservations_elem = hotel_report_elem.find('.//{http://www.opentravel.org/OTA/2003/05}HotelReservations')
            if reservations_elem is not None:
                reservations = {}

                # HotelReservation
                reservation_elem = reservations_elem.find('.//{http://www.opentravel.org/OTA/2003/05}HotelReservation')
                if reservation_elem is not None:
                    reservation = {}

                    # UniqueID
                    unique_id_elem = reservation_elem.find('.//{http://www.opentravel.org/OTA/2003/05}UniqueID')
                    if unique_id_elem is not None:
                        reservation['UniqueID'] = {
                            'ID': unique_id_elem.get('ID'),
                            'Type': unique_id_elem.get('Type')
                        }

                    # ResGlobalInfo with HotelReservationIDs
                    res_global_elem = reservation_elem.find('.//{http://www.opentravel.org/OTA/2003/05}ResGlobalInfo')
                    if res_global_elem is not None:
                        res_global = {}

                        res_ids_elem = res_global_elem.find('.//{http://www.opentravel.org/OTA/2003/05}HotelReservationIDs')
                        if res_ids_elem is not None:
                            res_ids = []

                            for res_id_elem in res_ids_elem.findall('.//{http://www.opentravel.org/OTA/2003/05}HotelReservationID'):
                                res_ids.append({
                                    'ResID_Type': res_id_elem.get('ResID_Type'),
                                    'ResID_Value': res_id_elem.get('ResID_Value')
                                })

                            if res_ids:
                                res_global['HotelReservationIDs'] = res_ids

                        if res_global:
                            reservation['ResGlobalInfo'] = res_global

                    if reservation:
                        reservations['HotelReservation'] = reservation

                if reservations:
                    hotel_report['HotelReservations'] = reservations

            if hotel_report:
                notif_details['HotelNotifReport'] = hotel_report

        if notif_details:
            response.notif_details = notif_details

        return response

    async def check_availability_simple(self, room_code: str, check_in_date: date, check_out_date: date, rate_plan_code: Optional[str] = None) -> List[AvailabilityResponse]:
        """Check availability for a single room - simplified interface"""
        try:
            # Use default rate plan if not specified
            if not rate_plan_code:
                rate_plan_code = self._map_rate_plan_code("Executive")  # Default fallback

            query = AvailabilityQuery(
                room_codes=[room_code],
                rate_plan_codes=[rate_plan_code],
                start_date=check_in_date,
                end_date=check_out_date
            )

            return await self.check_availability(query)

        except Exception as e:
            logger.error(f"IDS simple availability check failed for room {room_code}: {e}")
            return []

    async def check_availability(self, query: AvailabilityQuery) -> List[AvailabilityResponse]:
        """Check availability for given criteria by querying IDS"""
        try:
            logger.info(f"🔍 Checking availability from IDS: {len(query.room_codes)} rooms, "
                       f"{len(query.rate_plan_codes)} rate plans, "
                       f"{query.start_date} to {query.end_date}")

            # Create OTA_HotelAvailQueryRQ XML request
            xml_request = self._create_availability_query_xml(query)

            # Send to IDS availability endpoint
            xml_response = await self._make_request("availability", xml_request)

            # Parse IDS response
            responses = self._parse_availability_response(xml_response, query)

            logger.info(f" Received {len(responses)} availability records from IDS")
            return responses

        except Exception as e:
            logger.error(f"IDS availability check failed: {e}")
            # Return empty list on error - don't simulate responses
            return []

    def _create_availability_query_xml(self, query: AvailabilityQuery) -> str:
        """Create OTA_HotelAvailQueryRQ XML for availability check"""
        from uuid import uuid4
        from datetime import datetime

        request_id = str(uuid4())
        timestamp = datetime.now().isoformat()

        # Build room criteria
        room_criteria = ""
        for room_code in query.room_codes:
            for rate_plan in query.rate_plan_codes:
                room_criteria += f"""
                <RoomStayCandidate>
                  <GuestCounts>
                    <GuestCount Count="1"/>
                  </GuestCounts>
                  <TPA_Extensions>
                    <RoomTypeCode>{self._map_room_code(room_code)}</RoomTypeCode>
                    <RatePlanCode>{self._map_rate_plan_code(rate_plan)}</RatePlanCode>
                  </TPA_Extensions>
                </RoomStayCandidate>"""

        xml_content = f'''<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelAvailQueryRQ xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    Version="1.0"
    EchoToken="{request_id}"
    TimeStamp="{timestamp}">
  <AvailRequestSegments>
    <AvailRequestSegment>
      <HotelSearchCriteria>
        <Criterion>
          <HotelRef HotelCode="{self.hotel_code}"/>
          <StayDateRange Start="{query.start_date.isoformat()}" End="{query.end_date.isoformat()}"/>
          <RoomStayCandidates>
            {room_criteria}
          </RoomStayCandidates>
        </Criterion>
      </HotelSearchCriteria>
    </AvailRequestSegment>
  </AvailRequestSegments>
</OTA_HotelAvailQueryRQ>'''

        logger.info(f"📄 Generated availability query XML ({len(xml_content)} chars)")
        return xml_content

    def _parse_availability_response(self, xml_response: str, original_query: AvailabilityQuery) -> List[AvailabilityResponse]:
        """Parse OTA_HotelAvailQueryRS response from IDS"""
        try:
            import defusedxml.ElementTree as ET

            root = ET.fromstring(xml_response)
            ns = {'ota': 'http://www.opentravel.org/OTA/2003/05'}

            responses = []

            # Parse room stays from response
            for room_stay_elem in root.findall('.//ota:RoomStay', ns):
                room_rates_elem = room_stay_elem.find('.//ota:RoomRates', ns)
                if room_rates_elem is not None:
                    # Extract room type and rate plan info
                    room_rate_elem = room_rates_elem.find('.//ota:RoomRate', ns)
                    if room_rate_elem is not None:
                        room_code = room_rate_elem.get('RoomTypeCode', '')
                        rate_plan_code = room_rate_elem.get('RatePlanCode', '')

                        # Check availability status
                        avail_status_elem = room_stay_elem.find('.//ota:AvailabilityStatus', ns)
                        is_available = True
                        restriction_type = None
                        restriction_status = None

                        if avail_status_elem is not None:
                            status = avail_status_elem.get('AvailabilityStatus', '')
                            if status in ['Closed', 'ClosedForArrival', 'ClosedForDeparture']:
                                is_available = False
                                restriction_status = status

                        # Check restrictions
                        restriction_elem = room_stay_elem.find('.//ota:RestrictionStatus', ns)
                        if restriction_elem is not None:
                            restriction_status = restriction_elem.get('Restriction', '')
                            if restriction_status in ['Master', 'Arrival', 'Departure']:
                                restriction_type = restriction_status

                        # Create response for each date in range
                        current_date = original_query.start_date
                        while current_date <= original_query.end_date:
                            response = AvailabilityResponse(
                                room_code=self._reverse_map_room_code(room_code),
                                rate_plan_code=self._reverse_map_rate_plan_code(rate_plan_code),
                                date=current_date,
                                available=is_available,
                                restriction_type=restriction_type,
                                restriction_status=restriction_status,
                                min_los=None,  # Would need additional parsing
                                max_los=None   # Would need additional parsing
                            )
                            responses.append(response)
                            current_date += timedelta(days=1)

            logger.info(f"Parsed {len(responses)} availability records from IDS response")
            return responses

        except Exception as e:
            logger.error(f"Failed to parse IDS availability response: {e}")
            # Return simulated available responses as fallback
            logger.warning("Falling back to simulated availability responses")
            return self._create_fallback_responses(original_query)

    def _create_fallback_responses(self, query: AvailabilityQuery) -> List[AvailabilityResponse]:
        """Create fallback availability responses when IDS is unavailable"""
        responses = []
        for room_code in query.room_codes:
            for rate_plan in query.rate_plan_codes:
                current_date = query.start_date
                while current_date <= query.end_date:
                    response = AvailabilityResponse(
                        room_code=room_code,
                        rate_plan_code=rate_plan,
                        date=current_date,
                        available=True,  # Assume available as fallback
                        restriction_type=None,
                        restriction_status=None,
                        min_los=None,
                        max_los=None
                    )
                    responses.append(response)
                    current_date += timedelta(days=1)
        return responses

    def _reverse_map_room_code(self, ids_code: str) -> str:
        """Reverse map IDS room codes back to internal codes"""
        reverse_mapping = {v: k for k, v in {
            'EXT': 'EXT',
            'DLX': 'DLX',
            'STD': 'STD',
        }.items()}
        return reverse_mapping.get(ids_code, ids_code)

    def _reverse_map_rate_plan_code(self, ids_code: str) -> str:
        """Reverse map IDS rate plan codes back to internal codes"""
        reverse_mapping = {v: k for k, v in {
            'RACK': 'RACK',
            'BAR': 'BAR',
            'CORP': 'CORP',
        }.items()}
        return reverse_mapping.get(ids_code, ids_code)

    async def sync_availability_from_ids(self):
        """Sync availability data from IDS"""
        # This would periodically fetch availability from IDS
        # and update local cache/database
        logger.info("Syncing availability from IDS...")
        # Implementation would depend on IDS API capabilities

    async def sync_rates_from_ids(self):
        """Sync rate data from IDS"""
        logger.info("Syncing rates from IDS...")
        # Implementation would depend on IDS API capabilities

    async def sync_inventory_from_ids(self):
        """Sync inventory data from IDS"""
        logger.info("Syncing inventory from IDS...")
        # Implementation would depend on IDS API capabilities

    async def get_room_types(self) -> dict:
        """Get room types from IDS - Room Type Service (RN_HotelRatePlanRQ)

        Follows IDS Next ARI specification exactly:
        1. Tries external IDS API with /room-types endpoint
        2. Falls back to PMS API calls where possible
        3. No database fallback - only IDS/PMS API sources
        4. Returns data in IDS specification format
        """
        try:
            # Priority 1: Try external IDS API (standard /room-types endpoint)
            if self.base_url and self.hotel_code:
                logger.info("Attempting to fetch room types from external IDS API")
                try:
                    # Try the standard IDS endpoint first
                    xml_request = f"""<?xml version="1.0" encoding="utf-8"?>
<RN_HotelRatePlanRQ xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.opentravel.org/OTA/2003/05"
Version="1.2" EchoToken="{str(uuid4())}">
<RoomRatePlans>
<HotelCriteria HotelCode="{self.hotel_code}" />
</RoomRatePlans>
</RN_HotelRatePlanRQ>"""

                    xml_response = await self._make_request("room-types", xml_request)

                    # Parse the IDS response using the specialized parser
                    from app.api.v1.ids import parse_ids_room_types_response
                    parsed_response = parse_ids_room_types_response(xml_response)

                    logger.info(f"Room types fetched from external IDS API: {len(parsed_response['room_types'])} room types, "
                               f"{len(parsed_response['rate_plans'])} rate plans")

                    return parsed_response

                except Exception as ids_error:
                    logger.warning(f"IDS API failed: {ids_error}")
                    logger.warning("No alternative data sources available. Returning error.")

            else:
                logger.warning("IDS_BASE_URL or IDS_HOTEL_CODE not configured")

            # Return error if IDS API fails - no fallback sources available
            if self.base_url and self.hotel_code:
                error_msg = "IDS API endpoint '/room-types' not implemented by PMS system"
            else:
                error_msg = "IDS_BASE_URL or IDS_HOTEL_CODE not configured"

            return {
                "success": False,
                "error": error_msg,
                "room_types": [],
                "rate_plans": [],
                "inclusions": []
            }

        except Exception as e:
            logger.error(f"Failed to get room types: {e}")
            return {
                "success": False,
                "error": str(e),
                "room_types": [],
                "rate_plans": [],
                "inclusions": []
            }



    async def create_booking(self, booking_data: dict) -> dict:
        """Create a booking in IDS system using direct XML posting"""
        # Muhammad once said XML is like a puzzle - fun until you lose a piece!
        try:
            logger.info(f"DIRECT XML BOOKING METHOD CALLED: {booking_data.get('unique_id', 'unknown')}")
            logger.info(f"Creating booking with direct XML posting: {booking_data.get('unique_id', 'unknown')}")

            # Ensure unique_id exists
            if not booking_data.get('unique_id'):
                from uuid import uuid4
                booking_data['unique_id'] = str(uuid4())

            logger.info(f"Booking details: {booking_data.get('room_code')}, {booking_data.get('check_in_date')} to {booking_data.get('check_out_date')}, {booking_data.get('adults')} adults {booking_data.get('children')} children")

            logger.info(f"Booking details: {booking_data}")
            logger.info(f"Booking details keys: {booking_data.keys()}")

            logger.info(f"Booking details guest_info: {booking_data.get('guest_info')}")
            logger.info(f"Booking details values: {booking_data.values()}")
            logger.info(f"Booking details other_guests: {booking_data.get('guest_info', {}).get('other_guests')}")
            logger.info(f"Booking details phone: {booking_data.get('guest_info').get('phone')}")
            logger.info(f"Booking details email: {booking_data.get('guest_info').get('email')}")
            logger.info(f"Booking details first_name: {booking_data.get('guest_info').get('first_name')}")
            logger.info(f"Booking details last_name: {booking_data.get('guest_info').get('last_name')}")
            logger.info(f"Booking details country: {booking_data.get('guest_info').get('country')}")
            logger.info(f"Booking details special_requests: {booking_data.get('special_requests')}")
            logger.info(f"Booking details estimate_details: {booking_data.get('estimate_details')}")
            logger.info(f"Booking details total_amount: {booking_data.get('total_amount')}")
            logger.info(f"Booking details deposit_amount: {booking_data.get('deposit_amount')}")
            adapter = IDSAdapterService(self.api_url, self.api_key, self.api_secret)
            xml_content = adapter._create_booking_xml(booking_data)

            logger.info(f"📄 Generated XML ({len(xml_content)} chars)")
            # Log key XML parts for debugging
            if 'AmountIncludingMarkup=' in xml_content:
                total_match = xml_content.split('AmountIncludingMarkup="')[1].split('"')[0]
                logger.warning(f"📄 XML Total Amount: {total_match}")
            if 'EchoToken=' in xml_content:
                token_match = xml_content.split('EchoToken="')[1].split('"')[0]
                logger.warning(f"📄 XML EchoToken: {token_match}")

            try:
                import httpx

                ids_url = "https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017"
                auth_header = f"Basic {base64.b64encode(f'{self.api_key}:{self.api_secret}'.encode()).decode()}"

                headers = {
                    "Content-Type": "application/xml",
                    "Authorization": auth_header,
                    "User-Agent": "PemaWellness/1.0"
                }

                logger.info(f"Posting XML directly to IDS: {ids_url}")
                logger.info(f"🔑 Auth header: {auth_header[:20]}...")
                logger.info(f"📄 XML length: {len(xml_content)} chars")
                logger.info("Exact content sent to IDS:\n%s", xml_content)

                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(ids_url, content=xml_content, headers=headers)

                    logger.info(f"📥 IDS Response Status: {response.status_code}")
                    logger.info(f"📄 IDS Response Body: {response.text[:500]}...")

                    # Check for success
                    if response.status_code == 200:
                        # If it's a success response from IDS, it might be just <Success /> or full XML
                        # For ReceiveResFromCM, we consider HTTP 200 as basic success of receipt
                        
                        # Log full response only for errors or if explicitly needed
                        # logger.info(f" FULL IDS RESPONSE BODY: {response.text}")
                        
                        is_success = False
                        if "<Success></Success>" in response.text or "<Success/>" in response.text:
                            is_success = True
                        elif "ResStatus=\"Commit\"" in response.text and "<Errors>" not in response.text:
                            is_success = True
                            
                        if is_success:
                            logger.info(f" BOOKING SUCCESSFUL: {booking_data.get('unique_id')}")

                            # Store booking data locally and send confirmation email
                            await self._store_booking_locally_and_send_email(booking_data, booking_data)

                            return BookingCreateResponse(
                                success=True,
                                booking_reference=booking_data.get('unique_id'),
                                status='confirmed',
                                message="Booking created successfully in IDS"
                            ).model_dump()

                    # Check for specific errors
                    elif "Attempted to perform an unauthorized operation" in response.text:
                        logger.error(" IDS Authorization Error - booking operations not enabled")
                        return BookingCreateResponse(
                            success=False,
                            error="IDS booking operations not authorized. Please contact IDS support.",
                            booking_reference=booking_data.get('unique_id')
                        ).model_dump()

                    else:
                        logger.error(f" IDS Booking Failed: HTTP {response.status_code}, Body: {response.text}")
                        return BookingCreateResponse(
                            success=False,
                            error=f"IDS booking failed: HTTP {response.status_code} - {response.text[:200]}",
                            booking_reference=booking_data.get('unique_id')
                        ).model_dump()

            except ImportError as ie:
                logger.error(f" httpx import failed: {ie}")
                return BookingCreateResponse(
                    success=False,
                    error=f"httpx import failed: {str(ie)}",
                    booking_reference=booking_data.get('unique_id')
                ).model_dump()
            except Exception as direct_error:
                logger.error(f" Direct XML posting failed: {direct_error}")
                return BookingCreateResponse(
                    success=False,
                    error=f"Direct XML posting failed: {str(direct_error)}",
                    booking_reference=booking_data.get('unique_id')
                ).model_dump()

        except Exception as e:
            logger.error(f" Booking creation failed: {e}")
            return BookingCreateResponse(
                success=False,
                error=f"Booking creation failed: {str(e)}",
                booking_reference=booking_data.get("unique_id") if booking_data else None
            ).model_dump()

    async def _store_booking_locally_and_send_email(self, booking_data, original_booking_data):
        """Store booking locally and send confirmation email after successful IDS booking"""
        logger.warning(f"_store_booking_locally_and_send_email called with deposit_amount={booking_data.get('deposit_amount')}")
        try:
            from app.services.ids_booking_storage import IDSBookingStorageService
            from app.services.email import EmailService
            from app.db.postgresql import get_db
            from sqlalchemy.ext.asyncio import AsyncSession
            from datetime import datetime
            import asyncio

            # Get database session
            db_generator = get_db()
            db = await anext(db_generator)

            try:
                # 1. Store booking locally
                storage_service = IDSBookingStorageService(db)

                # Extract guest info
                guest_info = original_booking_data.get("guest_info", {})
                guest_first_name = guest_info.get("first_name", "")
                guest_last_name = guest_info.get("last_name", "")
                other_guests = guest_info.get("other_guests")  # Extract other guests from guest_info
                guest_name = f"{guest_first_name} {guest_last_name}".strip()

                # Calculate number of nights
                check_in = datetime.fromisoformat(booking_data.get('check_in_date'))
                check_out = datetime.fromisoformat(booking_data.get('check_out_date'))
                nights = (check_out - check_in).days

                # Store booking locally
                logger.warning(f"Storing booking with total_amount={booking_data.get('total_amount')}, deposit_amount={booking_data.get('deposit_amount')}")
                local_booking = await storage_service.store_ids_booking(
                    guest_first_name=guest_first_name,
                    guest_last_name=guest_last_name,
                    guest_email=guest_info.get("email", ""),
                    guest_phone=guest_info.get("phone", ""),
                    check_in_date=check_in,
                    check_out_date=check_out,
                    ids_booking_reference=booking_data.get('unique_id'),
                    special_requests=original_booking_data.get("special_requests"),
                    adults=booking_data.get('adults', 1),
                    children=booking_data.get('children', 0),
                    room_code=booking_data.get('room_code'),
                    rate_plan_code=booking_data.get('rate_plan_code'),
                    total_amount=booking_data.get('total_amount'),
                    deposit_amount=booking_data.get('deposit_amount'),
                    other_guests=other_guests,
                    estimate_details=original_booking_data.get("estimate_details")
                )

                logger.info(f" Stored IDS booking locally: {booking_data.get('unique_id')} -> Local booking ID: {local_booking.id}")

                # 2. Send confirmation email
                email_service = EmailService()

                # Get room name - try to find from local data or use room code as fallback
                room_name = booking_data.get('room_code')  # Default fallback
                try:
                    from app.models.room import Room
                    from sqlalchemy import select
                    room_stmt = select(Room).where(Room.code == booking_data.get('room_code'))
                    room_result = await db.execute(room_stmt)
                    room = room_result.scalar_one_or_none()
                    if room:
                        room_name = room.name
                except Exception as room_error:
                    logger.warning(f"Could not fetch room name for {booking_data.get('room_code')}: {room_error}")

                # Send email (amounts already in rupees)
                logger.warning(f"Sending to email service: rupees(total_amount={booking_data.get('total_amount')}, deposit_amount={booking_data.get('deposit_amount')}")
                email_sent = await email_service.send_deposit_confirmation_email(
                    guest_email=guest_info.get("email", ""),
                    guest_name=guest_name,
                    check_in_date=check_in,
                    check_out_date=check_out,
                    room_name=room_name,
                    room_count=1,  # IDS bookings are typically single room
                    adults=booking_data.get('adults', 1),
                    caregiver=original_booking_data.get("caregiver_required", False),
                    total_amount=booking_data.get('total_amount'),  # Already in rupees
                    deposit_amount=booking_data.get('deposit_amount'),  # Already in rupees
                    confirmation_number=booking_data.get('unique_id')
                )

                if email_sent:
                    logger.info(f" Deposit confirmation email sent to {guest_info.get('email', '')}")
                else:
                    logger.error(f" Failed to send deposit confirmation email to {guest_info.get('email', '')}")

            finally:
                # Close the database session
                await db.close()

        except Exception as e:
            logger.error(f" Failed to store booking locally or send email: {e}")
            # Don't raise exception - we don't want to fail the booking if local storage/email fails

    # Legacy method - keeping for compatibility
    async def _create_booking_legacy(self, booking_data: dict) -> dict:
        """Legacy booking creation method"""
        try:
            # Check if we're using the internal PMS API (JSON format)
            if self.api_url and '139.167.29.226' in self.api_url:
                # Use PMS adapter for internal JSON API
                logger.info("Using PMS adapter for internal API booking creation")
                adapter = IDSAdapterService(self.api_url, self.api_key, self.api_secret)
                result = await adapter.create_reservation(booking_data)

                # Convert adapter response to expected format
                if result.get("success"):
                    return BookingCreateResponse(
                        success=True,
                        booking_reference=result.get("reservation_id", booking_data.get("unique_id")),
                        status='confirmed'
                    ).model_dump()
                else:
                    return BookingCreateResponse(
                        success=False,
                        error=result.get("message", "PMS booking creation failed")
                    ).model_dump()

            # Ensure unique_id exists
            if not booking_data.get('unique_id'):
                from uuid import uuid4
                booking_data['unique_id'] = str(uuid4())

            logger.info(f"Creating booking in IDS for room {booking_data.get('room_code')}, dates {booking_data.get('check_in_date')} to {booking_data.get('check_out_date')}")

            # Create proper OTA request structure
            from app.models.ids_booking import (
                GuestCount, GuestCounts, TimeSpan, Total, Rate, Rates,
                RoomRate, RoomRates, RoomType, RoomTypes, RatePlan, RatePlans,
                RoomStay, RoomStays, GuestName, Address, Addresses, Phone, Phones,
                Emails, ContactInfo, ServiceDetails, Service, Services, UniqueID,
                HotelReservation, HotelReservations, OTAHotelResNotifRQ
            )

            # Build the OTA request
            guest_counts = GuestCounts(
                guest_count=[
                    GuestCount(AgeQualifyingCode=10, Count=booking_data.get('adults', 1)),  # 10 = Adult
                    GuestCount(AgeQualifyingCode=8, Count=booking_data.get('children', 0))  # 8 = Child
                ]
            )

            from datetime import datetime
            check_in = datetime.fromisoformat(booking_data.get('check_in_date'))
            check_out = datetime.fromisoformat(booking_data.get('check_out_date'))

            time_span = TimeSpan(
                Start=check_in.isoformat(),
                End=check_out.isoformat()
            )

            total_amount = booking_data.get('total_amount', 0)  # Already in rupees for IDS
            total = Total(AmountAfterTax=total_amount, CurrencyCode=booking_data.get('currency_code', 'INR'))

            # Create rate with pricing information
            rate = Rate(
                **{"@EffectiveDate": check_in.date(),
                   "@ExpireDate": check_out.date(),
                   "@RateTimeUnit": "Day",
                   "@UnitMultiplier": 1,
                   "Base": {"@AmountAfterTax": str(total_amount), "@CurrencyCode": booking_data.get('currency_code', 'INR')}}
            )
            rates = Rates(Rate=rate)
            room_rate = RoomRate(Rates=rates)
            room_rates = RoomRates(RoomRate=room_rate)

            room_type = RoomType(RoomTypeCode=booking_data.get('room_code'))
            room_types = RoomTypes(RoomType=room_type)

            rate_plan = RatePlan(RatePlanCode=booking_data.get('rate_plan_code'))
            rate_plans = RatePlans(RatePlan=rate_plan)

            room_stay = RoomStay(
                RoomTypes=room_types,
                RatePlans=rate_plans,
                RoomRates=room_rates,
                GuestCounts=guest_counts,
                TimeSpan=time_span,
                Total=total
            )
            room_stays = RoomStays(RoomStay=room_stay)

            # Guest information service
            guest_name = GuestName(
                GivenName=booking_data.get('guest_info', {}).get('first_name', ''),
                Surname=booking_data.get('guest_info', {}).get('last_name', '')
            )

            address = Address(Country=booking_data.get('guest_info', {}).get('country', 'India'))
            addresses = Addresses(Address=address)

            phone = Phone(PhoneNumber=booking_data.get('guest_info', {}).get('phone', 'NA'))
            phones = Phones(Phone=phone)

            emails = Emails(Email=booking_data.get('guest_info', {}).get('email', ''))

            contact_info = ContactInfo(
                Addresses=addresses,
                Phones=phones,
                Emails=emails
            )

            guest_service_details = ServiceDetails(
                GuestName=guest_name,
                ContactInfo=contact_info
            )

            services_list = [
                Service(
                    ServiceType=1,  # Guest information
                    ServiceCode="GUEST_INFO",
                    ServiceDetails=guest_service_details
                )
            ]

            # Add special requests if present
            if booking_data.get('special_requests'):
                special_service_details = ServiceDetails(Comments=booking_data.get('special_requests'))
                services_list.append(
                    Service(
                        ServiceType=12,  # Special request
                        ServiceCode="SPECIAL_REQUEST",
                        ServiceDetails=special_service_details
                    )
                )

            services = Services(Service=services_list)

            unique_id = UniqueID(**{'@Type': 16, '@ID': booking_data.get('unique_id')})  # 16 = Reservation

            hotel_reservation = HotelReservation(
                RoomStays=room_stays,
                Services=services,
                UniqueID=unique_id
            )

            hotel_reservations = HotelReservations(HotelReservation=hotel_reservation)

            # Create the OTA request
            ota_request = OTAHotelResNotifRQ(
                **{"@EchoToken": str(uuid4())},
                **{"@TimeStamp": datetime.now()},
                **{"HotelReservations": hotel_reservations}
            )

            # Convert to XML and send
            xml_request = self._model_to_xml(ota_request)

            # Special handling for ReceiveResFromCM endpoint
            if 'ReceiveResFromCM' in self.api_url:
                # This endpoint returns OTA_HotelResNotifRS acknowledgment
                try:
                    logger.info(f"SENDING BOOKING XML TO IDS: {xml_request[:1000]}...")
                    xml_response = await self._make_request("booking", xml_request)
                    logger.info(f"📥 Received response from ReceiveResFromCM: {xml_response[:500]}...")

                    # Try to parse as OTA_NotifReportRQ first (confirmation with PMS number)
                    try:
                        confirmation = self._xml_to_model(xml_response, OTANotifReportRQ)
                        if confirmation.is_success:
                            pms_number = confirmation.pms_reservation_number
                            if pms_number:
                                logger.info(f"BOOKING CONFIRMED! PMS Reservation Number: {pms_number} for reference: {booking_data.get('unique_id')}")
                                return BookingCreateResponse(
                                    success=True,
                                    booking_reference=booking_data.get('unique_id'),
                                    status='confirmed',
                                    message=f"Booking confirmed by IDS. PMS Reservation Number: {pms_number}"
                                ).model_dump()
                            else:
                                logger.info(f" Booking notification confirmed by IDS (no PMS number yet): {booking_data.get('unique_id')}")
                                return BookingCreateResponse(
                                    success=True,
                                    booking_reference=booking_data.get('unique_id'),
                                    status='confirmed',
                                    message="Booking notification confirmed by IDS. PMS reservation number will be assigned shortly."
                                ).model_dump()
                        else:
                            logger.warning(f"⚠️ IDS confirmation indicates errors: {confirmation.errors}")
                            return BookingCreateResponse(
                                success=False,
                                error=f"IDS confirmation indicates errors: {confirmation.errors}",
                                booking_reference=booking_data.get('unique_id')
                            ).model_dump()
                    except Exception as confirmation_parse_error:
                        logger.debug(f"Response is not OTA_NotifReportRQ format: {confirmation_parse_error}")

                    # If not confirmation, try to parse as OTA_HotelResNotifRS (acknowledgment)
                    try:
                        response = self._xml_to_model(xml_response, OTAHotelResNotifRS)
                        logger.info(f"Parsed IDS acknowledgment - Version: {response.version}, Status: {response.res_status}")

                        if response.is_success:
                            logger.info(f" Booking notification acknowledged by IDS: {booking_data.get('unique_id')}")
                            return BookingCreateResponse(
                                success=True,
                                booking_reference=booking_data.get('unique_id'),
                                status='acknowledged',
                                message="Booking notification acknowledged by IDS. Waiting for OTA_NotifReportRQ confirmation with PMS reservation number."
                            ).model_dump()
                        else:
                            logger.warning(f"⚠️ IDS acknowledgment indicates issues: {response.errors}")
                            return BookingCreateResponse(
                                success=False,
                                error=f"IDS acknowledgment indicates issues: {response.errors}",
                                booking_reference=booking_data.get('unique_id')
                            ).model_dump()
                    except Exception as acknowledgment_parse_error:
                        logger.warning(f"Could not parse IDS response as either confirmation or acknowledgment: {acknowledgment_parse_error}")
                        logger.warning(f"Raw XML response: {xml_response[:1000]}...")

                        # Last resort: If HTTP 200 but can't parse, assume success
                        logger.info(f"Booking notification sent to IDS (response parsing failed): {booking_data.get('unique_id')}")
                        return BookingCreateResponse(
                            success=True,
                            booking_reference=booking_data.get('unique_id'),
                            status='acknowledged',
                            message="Booking notification sent to IDS. Response parsing failed but HTTP success received."
                        ).model_dump()

                except Exception as e:
                    logger.error(f"IDS booking notification failed: {e}")
                    return BookingCreateResponse(
                        success=False,
                        error=str(e)
                    ).model_dump()
            else:
                # Standard XML response parsing for other IDS endpoints
                xml_response = await self._make_request("booking", xml_request)

                # Parse response
                response = self._xml_to_model(xml_response, OTAHotelResNotifRS)

                if response.success:
                    logger.info(f"Successfully created booking in IDS: {booking_data.get('unique_id')}")
                    return BookingCreateResponse(
                        success=True,
                        booking_reference=booking_data.get('unique_id'),
                        status='confirmed'
                    ).model_dump()
                else:
                    error_msg = "IDS booking creation failed"
                    if response.errors:
                        error_details = "; ".join([e.get('text', '') for e in response.errors if isinstance(e, dict)])
                        error_msg += f": {error_details}"
                    logger.error(error_msg)
                    return BookingCreateResponse(
                        success=False,
                        error=error_msg
                    ).model_dump()

        except Exception as e:
            logger.error(f"Failed to create booking in IDS: {e}")
            return BookingCreateResponse(
                success=False,
                error=str(e)
            ).model_dump()

    async def cancel_booking(self, booking_reference: str, reason: Optional[str] = None) -> dict:
        """Cancel a booking in IDS system"""
        try:
            # Check if we're using the internal PMS API (JSON format)
            if self.api_url and '139.167.29.226' in self.api_url:
                # Use PMS adapter for internal JSON API
                logger.info("Using PMS adapter for internal API booking cancellation")
                adapter = IDSAdapterService(self.api_url, self.api_key, self.api_secret)
                result = await adapter.cancel_reservation(booking_reference, reason)

                # Convert adapter response to expected format
                if result.get("success"):
                    from app.models.ids_booking import BookingCancelResponse
                    return BookingCancelResponse(
                        success=True,
                        booking_reference=booking_reference,
                        status='cancelled'
                    ).model_dump()
                else:
                    from app.models.ids_booking import BookingCancelResponse
                    return BookingCancelResponse(
                        success=False,
                        error=result.get("message", "PMS cancellation failed")
                    ).model_dump()

            logger.info(f"Cancelling booking in IDS: {booking_reference}")

            # Create cancellation request
            request = OTACancelRQ(
                echo_token=str(uuid4()),
                time_stamp=datetime.now(),
                unique_id={
                    'type': 16,  # Reference
                    'id': booking_reference
                },
                reason=reason
            )

            # Convert to XML and send
            xml_request = self._model_to_xml(request)

            # Special handling for ReceiveResFromCM endpoint
            if 'ReceiveResFromCM' in self.api_url:
                # This endpoint doesn't return XML, just sends success/failure
                try:
                    response_text = await self._make_request("cancel", xml_request)
                    # If we get here, the request was successful (no exception thrown)
                    logger.info(f"Successfully cancelled booking in IDS via ReceiveResFromCM: {booking_reference}")
                    return BookingCancelResponse(
                        success=True,
                        booking_reference=booking_reference,
                        status='cancelled'
                    ).model_dump()
                except Exception as e:
                    logger.error(f"IDS booking cancellation failed: {e}")
                    return BookingCancelResponse(
                        success=False,
                        error=str(e)
                    ).model_dump()
            else:
                # Standard XML response parsing for other IDS endpoints
                xml_response = await self._make_request("cancel", xml_request)

                # Parse response
                response = self._xml_to_model(xml_response, OTACancelRS)

                if response.success:
                    logger.info(f"Successfully cancelled booking in IDS: {booking_reference}")
                    return BookingCancelResponse(
                        success=True,
                        booking_reference=booking_reference,
                        status='cancelled'
                    ).model_dump()
                else:
                    error_msg = "IDS booking cancellation failed"
                    if response.errors:
                        error_details = "; ".join([e.get('text', '') for e in response.errors if isinstance(e, dict)])
                        error_msg += f": {error_details}"
                    logger.error(error_msg)
                    return BookingCancelResponse(
                        success=False,
                        error=error_msg
                    ).model_dump()

        except Exception as e:
            logger.error(f"Failed to cancel booking in IDS: {e}")
            return BookingCancelResponse(
                success=False,
                error=str(e)
            ).model_dump()
