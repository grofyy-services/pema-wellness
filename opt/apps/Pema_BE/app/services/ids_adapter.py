"""
IDS PMS Adapter Service

This service acts as a bridge between OTA XML format (IDS Next ARI specification)
and the internal PMS JSON API format used by the property management system.
"""

import logging
import httpx
import json
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class IDSAdapterService:
    """Adapter to convert between OTA XML and PMS JSON formats"""

    def __init__(self, pms_base_url: str, api_key: str, api_secret: str):
        self.pms_base_url = pms_base_url.rstrip('/')
        self.api_key = api_key
        self.api_secret = api_secret
        self.timeout = 30.0

    def _get_auth_header(self) -> str:
        """Get HTTP Basic authentication header"""
        import base64
        credentials = f"{self.api_key}:{self.api_secret}"
        encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
        return f"Basic {encoded_credentials}"

    async def get_room_types(self) -> Dict[str, Any]:
        """
        Get room types from database - Real implementation

        Since the PMS API doesn't have a direct room types endpoint,
        we query our local database for room information and map it to IDS format.
        """
        try:
            # Import database dependencies
            from sqlalchemy import select, and_, func
            from app.db.postgresql import AsyncSessionLocal
            from app.models.room import Room, RoomCategory
            from app.services.booking import BookingService

            # Get database session
            async with AsyncSessionLocal() as db:
                # Query active rooms
                stmt = select(Room).where(and_(Room.is_active == True, Room.maintenance_mode == False))
                result = await db.execute(stmt)
                rooms = result.scalars().all()

                # Initialize booking service for pricing category inference
                booking_service = BookingService(db)

                # Group rooms by pricing category and create room types
                room_types_map = {}
                rate_plans_map = {}

                for room in rooms:
                    # Infer pricing category if not set
                    pricing_category = getattr(room, "pricing_category", None) or booking_service._infer_pricing_category(room)

                    # Create room type code mapping
                    room_code_mapping = {
                        RoomCategory.STANDARD: "STD",
                        RoomCategory.PREMIUM_BALCONY: "PBQ",
                        RoomCategory.PREMIUM_GARDEN: "PGT",
                        RoomCategory.EXECUTIVE: "EXT",
                        RoomCategory.EXECUTIVE_JUNIOR_SUITE: "EXQ",
                        RoomCategory.EXECUTIVE_SUITE: "EXS",
                        RoomCategory.ELEMENTAL_VILLA: "EVT",
                        RoomCategory.PEMA_SUITE: "PES"
                    }

                    inv_type_code = room_code_mapping.get(pricing_category, pricing_category.replace(" ", "").upper()[:3])

                    # Aggregate room types by pricing category
                    if inv_type_code not in room_types_map:
                        room_types_map[inv_type_code] = {
                            "inv_type_code": inv_type_code,
                            "name": pricing_category,
                            "quantity": 0,
                            "is_room_active": True,
                            "room_description": room.description or f"{pricing_category} room"
                        }

                    room_types_map[inv_type_code]["quantity"] += getattr(room, "inventory_count", 1)

                    # Create rate plans for each pricing category
                    rate_plan_code = pricing_category.replace(" ", "_").upper()

                    if rate_plan_code not in rate_plans_map:
                        # Determine meal plan based on room type
                        if "Suite" in pricing_category or "Villa" in pricing_category:
                            meal_plan_code = "AP"  # American Plan for suites
                            meal_plan_desc = "American Plan"
                        elif "Executive" in pricing_category:
                            meal_plan_code = "CP"  # Continental Plan for executive
                            meal_plan_desc = "Continental Plan"
                        else:
                            meal_plan_code = "EP"  # European Plan for basic rooms
                            meal_plan_desc = "European Plan"

                        rate_plans_map[rate_plan_code] = {
                            "rate_plan_code": rate_plan_code,
                            "rate_plan_category": "RACK",  # Default to rack rate
                            "rate_plan_status_type": "1",  # Active
                            "rate_plan_name": f"{pricing_category} Rate",
                            "description": f"Standard rate for {pricing_category}",
                            "inv_type_code": inv_type_code,
                            "meal_plan_code": meal_plan_code,
                            "meal_plan_desc": meal_plan_desc,
                            "start": "2024-01-01",
                            "end": "2024-12-31",
                            "currency_code": "INR"
                        }

                # Convert maps to lists
                room_types = list(room_types_map.values())
                rate_plans = list(rate_plans_map.values())

                # Create meal plan inclusions
                inclusions = [
                    {
                        "meal_plan_code": "EP",
                        "meal_plan_desc": "European Plan"
                    },
                    {
                        "meal_plan_code": "CP",
                        "meal_plan_desc": "Continental Plan"
                    },
                    {
                        "meal_plan_code": "AP",
                        "meal_plan_desc": "American Plan"
                    }
                ]

                result = {
                    "success": True,
                    "hotel_code": "7167",  # Our property code
                    "room_types": room_types,
                    "rate_plans": rate_plans,
                    "inclusions": inclusions,
                    "echo_token": "real_data"
                }

                logger.info(f"Successfully retrieved room types from database: {len(room_types)} room types, {len(rate_plans)} rate plans")
                return result

        except Exception as e:
            logger.error(f"Failed to get room types from database: {e}")
            return {
                "success": False,
                "error": str(e),
                "room_types": [],
                "rate_plans": [],
                "inclusions": []
            }

    async def get_occupancy_data(self, pmscode: str) -> Dict[str, Any]:
        """
        Get occupancy data from PMS API
        This would be used for inventory/availability queries
        """
        try:
            occupancy_url = f"{self.pms_base_url}/occupancy/{pmscode}"
            headers = {
                "Content-Type": "application/json",
                "Authorization": self._get_auth_header()
            }

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(occupancy_url, headers=headers, json={})
                response.raise_for_status()
                data = response.json()

                logger.info(f"PMS occupancy data: {data}")
                return data

        except Exception as e:
            logger.error(f"Failed to get occupancy data from PMS: {e}")
            return {
                "Status": "Error",
                "Description": f"PMS occupancy request failed: {str(e)}"
            }

    async def create_reservation(self, reservation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a reservation directly on IDS system (no PMS fallback)
        Sends booking notification to IDS endpoint only
        """
        logger.info(f"IDS Adapter: Creating reservation directly on IDS with data: {reservation_data}")

        try:
            # Send booking notification directly to IDS
            ids_result = await self._send_booking_to_ids(reservation_data)
            if ids_result["success"]:
                return ids_result

            # If IDS fails, return error
            logger.error("IDS booking creation failed - no fallback available")
            return {
                "success": False,
                "error": ids_result.get("error", "IDS booking creation failed"),
                "message": "Failed to create reservation on IDS"
            }

        except Exception as e:
            logger.error(f"IDS Adapter: Failed to create reservation: {e}")
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to create reservation on IDS"
            }

    async def _send_booking_to_ids(self, reservation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send booking notification to IDS system
        Used as fallback when PMS API doesn't support booking creation
        """
        try:
            # Import required modules
            import defusedxml.ElementTree as ET
            from uuid import uuid4

            # Create OTA XML booking notification
            xml_request = self._create_booking_xml(reservation_data)

            # Send to IDS ReceiveResFromCM endpoint (which accepts booking notifications)
            ids_url = "https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017"
            headers = {
                "Content-Type": "application/xml",
                "Authorization": self._get_auth_header()
            }

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(ids_url, content=xml_request, headers=headers)

                if response.status_code == 200:
                    logger.info("Successfully sent booking notification to IDS")
                    return {
                        "success": True,
                        "reservation_id": reservation_data.get('unique_id', f"IDS-{datetime.now().strftime('%Y%m%d%H%M%S')}"),
                        "status": "Confirmed",
                        "message": "Booking notification sent to IDS"
                    }
                else:
                    logger.warning(f"IDS booking notification failed: {response.status_code} - {response.text}")
                    return {"success": False, "error": f"IDS notification failed: {response.status_code}"}

        except Exception as e:
            logger.error(f"Failed to send booking to IDS: {e}")
            return {"success": False, "error": str(e)}

    def _create_booking_xml(self, reservation_data: Dict[str, Any]) -> str:
        """
        Create OTA XML booking notification from reservation data
        EXACT MakeMyTrip format that works with IDS - matches successful test XML
        """
        from uuid import uuid4
        from datetime import datetime

        # Extract data
        guest_info = reservation_data.get('guest_info', {})
        unique_id = reservation_data.get('unique_id', str(uuid4()))
        timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

        # Calculate pricing (exact same as successful test XML)
        total_amount_rupees = reservation_data.get('total_amount', 74710.00)  # Total amount for entire stay in rupees

        # Calculate per-night amounts (like successful XML: 280140 per night for 2-night stay = 560280 total)
        from datetime import datetime
        check_in = datetime.fromisoformat(reservation_data.get('check_in_date'))
        check_out = datetime.fromisoformat(reservation_data.get('check_out_date'))
        nights = (check_out - check_in).days

        if nights <= 0:
            nights = 1  # Fallback for invalid dates

        per_night_amount_after_tax = int(total_amount_rupees / nights)  # Amounts in Rupees (Integer)
        tax_rate = 0.05  # 5% tax
        per_night_tax_amount = round(per_night_amount_after_tax * tax_rate / (1 + tax_rate))
        per_night_base_before_tax = per_night_amount_after_tax - per_night_tax_amount

        # Total amounts for entire stay
        total_amount_after_tax = per_night_amount_after_tax * nights
        total_tax_amount = per_night_tax_amount * nights
        total_before_tax = per_night_base_before_tax * nights

        logger.warning(f"XML amounts: total_rupees={total_amount_rupees}, nights={nights}, per_night_after_tax={per_night_amount_after_tax}, per_night_tax={per_night_tax_amount}, per_night_before={per_night_base_before_tax}")

        # Use per-night amounts in the Rate element
        amount_after_tax = per_night_amount_after_tax
        tax_amount = per_night_tax_amount
        base_amount_before_tax = per_night_base_before_tax

        # Total amounts for the Total element
        amount_before_tax = total_before_tax
        tax_amount_total = total_tax_amount
        total_amount_paise = total_amount_after_tax  # Actually Rupees now, keeping var name to minimize diffs

        # Create XML structure - EXACT format from successful test
        xml_content = f'''<OTA_HotelResNotifRQ xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.opentravel.org/OTA/2003/05" EchoToken="{unique_id}" TimeStamp="{timestamp}.00+05:30" Version="3.002" ResStatus="Commit">
  <POS>
    <Source>
      <RequestorID Type="22" ID="BayPark" />
      <BookingChannel Type="CHANNEL">
        <CompanyName Code="BKNG">MakeMyTrip</CompanyName>
      </BookingChannel>
    </Source>
  </POS>
  <HotelReservations>
    <HotelReservation CreateDateTime="{timestamp.split('T')[0]}T00:00:00.00+05:30">
      <UniqueID Type="14" ID="{unique_id}" ID_Context="BayPark" />
      <RoomStays>
        <RoomStay>
          <RoomTypes>
            <RoomType NumberOfUnits="1" RoomTypeCode="{reservation_data.get('room_code', 'EXT')}" />
          </RoomTypes>
          <RatePlans>
            <RatePlan RatePlanCode="{reservation_data.get('rate_plan_code', 'RR0925')}" MealPlanCode="CP" />
            <RatePlanInclusions TaxInclusive="false" />
          </RatePlans>
          <RoomRates>
            <RoomRate RoomTypeCode="{reservation_data.get('room_code', 'EXT')}" RatePlanCode="1">
              <Rates>
                <Rate EffectiveDate="{reservation_data.get('check_in_date')}" ExpireDate="{reservation_data.get('check_out_date')}" RateTimeUnit="Day" UnitMultiplier="1">
                  <Base AmountAfterTax="{amount_after_tax}" AmountBeforeTax="{base_amount_before_tax}" CurrencyCode="{reservation_data.get('currency_code', 'INR')}">
                    <Taxes Amount="{tax_amount}" CurrencyCode="{reservation_data.get('currency_code', 'INR')}" />
                  </Base>
                </Rate>
              </Rates>
            </RoomRate>
          </RoomRates>
          <GuestCounts IsPerRoom="true">
            <GuestCount AgeQualifyingCode="10" Count="{reservation_data.get('adults', 3)}" />
            <GuestCount AgeQualifyingCode="8" Count="{reservation_data.get('children', 0)}" />
          </GuestCounts>
          <TimeSpan Start="{reservation_data.get('check_in_date')}" End="{reservation_data.get('check_out_date')}" />
          <Total AmountIncludingMarkup="{total_amount_paise}" AmountAfterTax="{total_amount_paise}" AmountBeforeTax="{amount_before_tax}" CurrencyCode="{reservation_data.get('currency_code', 'INR')}">
            <Taxes Amount="{tax_amount_total}" CurrencyCode="{reservation_data.get('currency_code', 'INR')}" />
          </Total>
          <BasicPropertyInfo HotelCode="7167" />
          <ResGuestRPHs>
            <ResGuestRPH RPH="1" />
          </ResGuestRPHs>
          <Comments>
            <Comment>
              <Text>{reservation_data.get('special_requests', 'Channel booking from MakeMyTrip')}</Text>
            </Comment>
          </Comments>
        </RoomStay>
      </RoomStays>
      <ResGuests>
        <ResGuest ResGuestRPH="1">
          <Profiles>
            <ProfileInfo>
              <Profile ProfileType="1">
                <Customer>
                  <PersonName>
                    <GivenName>{guest_info.get('first_name', '')}</GivenName>
                    <Surname>{guest_info.get('last_name', '')}</Surname>
                  </PersonName>
                  <Telephone PhoneTechType="1" PhoneNumber="{guest_info.get('phone', 'NA')}" FormattedInd="false" DefaultInd="true" />
                  <Email EmailType="1">{guest_info.get('email', '')}</Email>
                  <Address>
                    <AddressLine>12, TUOPIJ</AddressLine>
                    <CityName>BENGALURU</CityName>
                    <CountryName Code="IND">INDIA</CountryName>
                  </Address>
                </Customer>
              </Profile>
            </ProfileInfo>
          </Profiles>
        </ResGuest>
      </ResGuests>
    </HotelReservation>
  </HotelReservations>
</OTA_HotelResNotifRQ>'''

        return xml_content

    async def check_reservation_status(self, booking_reference: str) -> Dict[str, Any]:
        """
        Check reservation status from IDS system
        Note: IDS ReceiveResFromCM endpoint doesn't provide status checking
        We need to contact IDS support or use their proper status endpoint
        """
        try:
            # Since ReceiveResFromCM doesn't support status queries,
            # we should return a message indicating we need to contact IDS
            logger.info(f"Booking status check requested for {booking_reference}")

            return {
                "Status": "Unknown",
                "booking_reference": booking_reference,
                "status": "Verification_Required",
                "message": f"Booking {booking_reference} status cannot be verified via API. Please contact IDS support to confirm if the booking exists in their system.",
                "note": "The ReceiveResFromCM endpoint only accepts booking creation/cancellation but doesn't provide status queries"
            }

        except Exception as e:
            logger.error(f"Failed to check reservation status: {e}")
            return {
                "Status": "Error",
                "booking_reference": booking_reference,
                "error": str(e),
                "message": f"Failed to check status for reservation {booking_reference}"
            }

    async def _send_cancellation_to_ids(self, booking_reference: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """
        Send booking cancellation notification to IDS system
        """
        try:
            # Create OTA XML cancellation notification
            xml_request = self._create_cancellation_xml(booking_reference, reason)

            # Send to IDS ReceiveResFromCM endpoint
            ids_url = "https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017"
            headers = {
                "Content-Type": "application/xml",
                "Authorization": self._get_auth_header()
            }

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(ids_url, content=xml_request, headers=headers)

                if response.status_code == 200:
                    logger.info(f"Successfully sent cancellation notification to IDS for {booking_reference}")
                    return {
                        "success": True,
                        "booking_reference": booking_reference,
                        "status": "cancelled",
                        "message": f"Cancellation notification sent to IDS for {booking_reference}",
                        "reason": reason
                    }
                else:
                    logger.warning(f"IDS cancellation notification failed: {response.status_code} - {response.text}")
                    return {"success": False, "error": f"IDS cancellation failed: {response.status_code}"}

        except Exception as e:
            logger.error(f"Failed to send cancellation to IDS: {e}")
            return {"success": False, "error": str(e)}

    def _create_cancellation_xml(self, booking_reference: str, reason: Optional[str] = None) -> str:
        """
        Create OTA XML cancellation notification
        Compliant with IDS Next ARI specification
        """
        from uuid import uuid4
        from datetime import datetime

        timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

        xml_content = f'''<OTA_HotelResNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05"
                     EchoToken="{str(uuid4())}"
                     TimeStamp="{timestamp}"
                     Version="3.002"
                     ResStatus="Cancel">
  <POS>
    <Source>
      <RequestorID Type="22" ID="PEMA" />
      <BookingChannel Type="7">
        <CompanyName Code="PEMA">Pema Wellness API</CompanyName>
      </BookingChannel>
    </Source>
  </POS>
  <HotelReservations>
    <HotelReservation CreateDateTime="{timestamp.split('T')[0]}">
      <UniqueID Type="14" ID="{booking_reference}" ID_Context="PEMA"/>
      <RoomStays>
        <RoomStay>
          <BasicPropertyInfo HotelCode="7167" />
          <Comments>
            <Comment>
              <Text>Cancellation Reason: {reason or "Customer request"}</Text>
            </Comment>
          </Comments>
        </RoomStay>
      </RoomStays>
    </HotelReservation>
  </HotelReservations>
</OTA_HotelResNotifRQ>'''

        return xml_content

    async def check_room_status(self, room_number: str) -> Dict[str, Any]:
        """
        Check room status using RoomEnquiry endpoint
        """
        try:
            room_url = f"{self.pms_base_url}/RoomEnquiry"
            headers = {
                "Content-Type": "application/json",
                "Authorization": self._get_auth_header()
            }

            # The PMS API expects room number in the request body
            payload = {
                "room_number": room_number,
                "pmscode": "7167"  # Property code
            }

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(room_url, headers=headers, json=payload)

                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"PMS room enquiry result: {data}")
                    return data
                else:
                    logger.warning(f"PMS room enquiry failed: {response.status_code} - {response.text}")
                    return {
                        "Status": "Error",
                        "Description": f"Room enquiry failed: {response.status_code}",
                        "StatusCode": str(response.status_code)
                    }

        except Exception as e:
            logger.error(f"Failed to check room status: {e}")
            return {
                "Status": "Error",
                "Description": f"Room status check failed: {str(e)}",
                "StatusCode": "ADAPTER_ERROR"
            }

    async def cancel_reservation(self, booking_reference: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """
        Cancel a reservation directly on IDS system (no PMS fallback)
        Sends cancellation notification to IDS endpoint only
        """
        logger.info(f"IDS Adapter: Cancelling reservation {booking_reference} directly on IDS, reason: {reason}")

        try:
            # Send cancellation notification directly to IDS
            ids_result = await self._send_cancellation_to_ids(booking_reference, reason)
            if ids_result["success"]:
                return ids_result

            # If IDS fails, return error
            logger.error("IDS cancellation failed - no fallback available")
            return {
                "success": False,
                "error": ids_result.get("error", "IDS cancellation failed"),
                "message": f"Failed to cancel reservation {booking_reference} on IDS"
            }

        except Exception as e:
            logger.error(f"IDS Adapter: Failed to cancel reservation: {e}")
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to cancel reservation {booking_reference} on IDS"
            }
