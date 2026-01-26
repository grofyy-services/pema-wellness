"""
IDS Booking Models - Pydantic models for booking operations with IDS Next
"""

from datetime import datetime, date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator, model_validator, field_validator
from enum import Enum


class BookingStatus(str, Enum):
    """Booking status enumeration"""
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    MODIFIED = "modified"
    NO_SHOW = "no_show"


class GuestInfo(BaseModel):
    """Guest information for booking"""
    first_name: str = Field(..., description="Guest first name")
    last_name: str = Field(..., description="Guest last name")
    email: str = Field(..., description="Guest email address")
    phone: str = Field(..., description="Guest phone number")
    country: str = Field(..., description="Guest country")


class BookingCreateRequest(BaseModel):
    """Request to create a booking in IDS"""
    room_code: str = Field(..., description="IDS room code")
    rate_plan_code: str = Field(..., description="IDS rate plan code")
    check_in_date: date = Field(..., description="Check-in date")
    check_out_date: date = Field(..., description="Check-out date")
    guest_info: GuestInfo = Field(..., description="Guest information")
    total_amount: float = Field(..., description="Total amount in rupees")
    deposit_amount: float = Field(default=0.0, description="Deposit amount collected in rupees")
    adults: int = Field(..., description="Number of adults")
    children: int = Field(..., description="Number of children")
    special_requests: Optional[str] = Field(None, description="Special requests")
    currency_code: str = Field(default="INR", description="Currency code")
    unique_id: Optional[str] = Field(None, description="Unique booking identifier")


class BookingCancelRequest(BaseModel):
    """Request to cancel a booking in IDS"""
    booking_reference: str = Field(..., description="IDS booking reference")
    reason: Optional[str] = Field(None, description="Cancellation reason")


# OTA XML Models for IDS Booking Operations

class GuestCount(BaseModel):
    """Guest count information"""
    age_qualifying_code: int = Field(..., alias="AgeQualifyingCode", description="Age qualifying code (10=Adult, 8=Child)")
    count: int = Field(..., alias="Count", description="Number of guests")


class GuestCounts(BaseModel):
    """Container for guest counts"""
    guest_count: List[GuestCount] = Field(default_factory=list, alias="GuestCount")


class TimeSpan(BaseModel):
    """Time span for stay"""
    Start: str = Field(...)
    End: str = Field(...)

    @field_validator('Start', 'End')
    @classmethod
    def validate_date_format(cls, v):
        """Validate date format is YYYY-MM-DD"""
        if isinstance(v, str):
            try:
                # Parse to ensure valid date format
                from datetime import datetime
                datetime.strptime(v, '%Y-%m-%d')
                return v
            except ValueError:
                raise ValueError(f'Date must be in YYYY-MM-DD format, got: {v}')
        return v

    @model_validator(mode='after')
    def validate_date_range(self):
        """Validate date range constraints"""
        start_date = self.Start
        end_date = self.End

        if start_date and end_date:
            from datetime import datetime
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()

            if start >= end:
                raise ValueError('Start date must be before end date')

            # Check if start date is not in the past (with some buffer for timezone)
            today = datetime.now().date()
            if start < today:
                raise ValueError('Start date cannot be in the past')

        return self


class Total(BaseModel):
    """Total amount"""
    amount_after_tax: float = Field(..., alias="AmountAfterTax")
    currency_code: str = Field(..., alias="CurrencyCode")


class Rate(BaseModel):
    """Rate information"""
    effective_date: date = Field(..., alias="@EffectiveDate")
    expire_date: date = Field(..., alias="@ExpireDate")
    rate_time_unit: str = Field(..., alias="@RateTimeUnit")
    unit_multiplier: int = Field(..., alias="@UnitMultiplier")
    base: Dict[str, Any] = Field(..., alias="Base")


class Rates(BaseModel):
    """Container for rates"""
    rate: Rate = Field(..., alias="Rate")


class RoomRate(BaseModel):
    """Room rate information"""
    rates: Rates = Field(..., alias="Rates")


class RoomRates(BaseModel):
    """Container for room rates"""
    room_rate: RoomRate = Field(..., alias="RoomRate")


class RoomType(BaseModel):
    """Room type information"""
    room_type_code: str = Field(..., alias="RoomTypeCode")


class RoomTypes(BaseModel):
    """Container for room types"""
    room_type: RoomType = Field(..., alias="RoomType")


class RatePlan(BaseModel):
    """Rate plan information"""
    rate_plan_code: str = Field(..., alias="RatePlanCode")


class RatePlans(BaseModel):
    """Container for rate plans"""
    rate_plan: RatePlan = Field(..., alias="RatePlan")


class RoomStay(BaseModel):
    """Room stay information"""
    room_types: RoomTypes = Field(..., alias="RoomTypes")
    rate_plans: RatePlans = Field(..., alias="RatePlans")
    room_rates: RoomRates = Field(..., alias="RoomRates")
    guest_counts: GuestCounts = Field(..., alias="GuestCounts")
    time_span: TimeSpan = Field(..., alias="TimeSpan")
    total: Total = Field(..., alias="Total")


class RoomStays(BaseModel):
    """Container for room stays"""
    room_stay: RoomStay = Field(..., alias="RoomStay")


class GuestName(BaseModel):
    """Guest name information"""
    given_name: str = Field(..., alias="GivenName")
    surname: str = Field(..., alias="Surname")


class Address(BaseModel):
    """Address information"""
    country: Optional[str] = Field(None, alias="Country")


class Addresses(BaseModel):
    """Container for addresses"""
    address: Address = Field(..., alias="Address")


class Phone(BaseModel):
    """Phone information"""
    phone_number: str = Field(..., alias="PhoneNumber")


class Phones(BaseModel):
    """Container for phones"""
    phone: Phone = Field(..., alias="Phone")


class Emails(BaseModel):
    """Container for emails"""
    email: str = Field(..., alias="Email")


class ContactInfo(BaseModel):
    """Contact information"""
    addresses: Optional[Addresses] = Field(None, alias="Addresses")
    phones: Optional[Phones] = Field(None, alias="Phones")
    emails: Optional[Emails] = Field(None, alias="Emails")


class ServiceDetails(BaseModel):
    """Service details"""
    guest_name: Optional[GuestName] = Field(None, alias="GuestName")
    contact_info: Optional[ContactInfo] = Field(None, alias="ContactInfo")
    comments: Optional[str] = Field(None, alias="Comments")


class Service(BaseModel):
    """Service information"""
    service_type: int = Field(..., alias="ServiceType")
    service_code: str = Field(..., alias="ServiceCode")
    service_details: ServiceDetails = Field(..., alias="ServiceDetails")


class Services(BaseModel):
    """Container for services"""
    service: List[Service] = Field(default_factory=list, alias="Service")


class UniqueID(BaseModel):
    """Unique identifier"""
    type: int = Field(..., alias="@Type", description="ID type (16=Reservation)")
    id: str = Field(..., alias="@ID", description="Unique identifier")


class HotelReservation(BaseModel):
    """Hotel reservation information"""
    room_stays: RoomStays = Field(..., alias="RoomStays")
    services: Optional[Services] = Field(None, alias="Services")
    unique_id: Optional[UniqueID] = Field(None, alias="UniqueID")


class HotelReservations(BaseModel):
    """Container for hotel reservations"""
    hotel_reservation: HotelReservation = Field(..., alias="HotelReservation")


class OTAHotelResNotifRQ(BaseModel):
    """OTA Hotel Reservation Notification Request"""
    xmlns: str = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    version: str = Field(default="1.0", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    time_stamp: datetime = Field(..., alias="@TimeStamp")
    message_content_code: str = Field(default="New", alias="@MessageContentCode")

    hotel_reservations: HotelReservations = Field(..., alias="HotelReservations")


class OTAHotelResNotifRS(BaseModel):
    """OTA Hotel Reservation Notification Response"""
    version: str = Field(default="3.002", description="Message version")
    echo_token: str = Field(..., description="Echo token from request")
    time_stamp: str = Field("", description="Response timestamp in IDS format")
    res_status: Optional[str] = Field(None, alias="@ResStatus", description="Reservation status")
    success: Optional[Dict[str, Any]] = Field(None, description="Success indicator")
    warnings: Optional[List[Dict[str, Any]]] = Field(None, description="Warning messages")
    errors: Optional[List[Dict[str, Any]]] = Field(None, description="Error messages")

    @validator('time_stamp')
    def parse_ids_timestamp(cls, v):
        """Parse IDS timestamp format: YYYY-MM-DDTHH:MM:SS"""
        if isinstance(v, str) and v:
            try:
                # IDS format: "2017-07-21T15:21:47"
                return datetime.fromisoformat(v.replace('Z', '+00:00'))
            except ValueError:
                # If parsing fails, return current time
                return datetime.now()
        return datetime.now()

    @property
    def is_success(self) -> bool:
        """Check if response indicates success"""
        # If we have explicit success indicator, use it
        if self.success is not None:
            return True
        # If we have errors, it's a failure
        if self.errors and len(self.errors) > 0:
            return False
        # If we have a valid response structure with echo_token (indicating valid response), assume success
        # IDS sends acknowledgment responses for successful receipt, even without explicit <Success /> element
        if self.echo_token and self.version:
            return True
        # Default to False for incomplete responses
        return False


class OTACancelRQ(BaseModel):
    """OTA Cancel Request"""
    version: str = Field(default="1.0", description="Message version")
    echo_token: str = Field(..., description="Unique token for request tracking")
    time_stamp: datetime = Field(default_factory=datetime.now, description="Request timestamp")

    unique_id: Dict[str, Any] = Field(..., description="Unique ID of booking to cancel")
    reason: Optional[str] = Field(None, description="Cancellation reason")


class OTACancelRS(BaseModel):
    """OTA Cancel Response"""
    version: str = Field(default="1.0", description="Message version")
    echo_token: str = Field(..., description="Echo token from request")
    time_stamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")
    success: Optional[Dict[str, Any]] = Field(None, description="Success indicator")
    warnings: Optional[List[Dict[str, Any]]] = Field(None, description="Warning messages")
    errors: Optional[List[Dict[str, Any]]] = Field(None, description="Error messages")


# Internal booking operation models

class BookingCreateResponse(BaseModel):
    """Response from IDS booking creation"""
    success: bool = Field(..., description="Whether booking creation was successful")
    booking_reference: Optional[str] = Field(None, description="IDS booking reference")
    status: Optional[str] = Field(None, description="Booking status")
    error: Optional[str] = Field(None, description="Error message if failed")
    message: Optional[str] = Field(None, description="Additional status message")


class BookingCancelResponse(BaseModel):
    """Response from IDS booking cancellation"""
    success: bool = Field(..., description="Whether booking cancellation was successful")
    booking_reference: Optional[str] = Field(None, description="IDS booking reference")
    status: Optional[str] = Field(None, description="Cancellation status")
    error: Optional[str] = Field(None, description="Error message if failed")


# Confirmation/Notification Models
class OTANotifReportRQ(BaseModel):
    """OTA Notification Report Request (Confirmation with PMS Reservation Number)"""
    xmlns: str = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    xsd_schema: Optional[str] = Field(default=None, alias="@xmlns:xsd")
    version: str = Field(default="1.0", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    time_stamp: str = Field(..., alias="@TimeStamp")

    # Success or Error
    success: Optional[Dict[str, Any]] = Field(None, description="Success indicator")
    errors: Optional[List[Dict[str, Any]]] = Field(None, description="Error messages")

    # NotifDetails with PMS reservation number
    notif_details: Optional[Dict[str, Any]] = Field(None, alias="NotifDetails", description="Notification details with PMS reservation number")

    @validator('time_stamp')
    def parse_ids_timestamp(cls, v):
        """Parse IDS timestamp format"""
        if isinstance(v, str) and v:
            try:
                return datetime.fromisoformat(v.replace('Z', '+00:00'))
            except ValueError:
                return datetime.now()
        return datetime.now()

    @property
    def pms_reservation_number(self) -> Optional[str]:
        """Extract PMS reservation number from the response"""
        try:
            if self.notif_details and 'HotelNotifReport' in self.notif_details:
                hotel_report = self.notif_details['HotelNotifReport']
                if 'HotelReservations' in hotel_report and 'HotelReservation' in hotel_report['HotelReservations']:
                    reservation = hotel_report['HotelReservations']['HotelReservation']
                    if 'ResGlobalInfo' in reservation and 'HotelReservationIDs' in reservation['ResGlobalInfo']:
                        res_ids = reservation['ResGlobalInfo']['HotelReservationIDs']
                        if isinstance(res_ids, list) and len(res_ids) > 0:
                            return res_ids[0].get('ResID_Value')
                        elif isinstance(res_ids, dict):
                            return res_ids.get('ResID_Value')
        except Exception:
            pass
        return None

    @property
    def is_success(self) -> bool:
        """Check if confirmation indicates success"""
        return self.success is not None and (self.errors is None or len(self.errors) == 0)


class BookingConfirmation(BaseModel):
    """Booking confirmation with PMS reservation number"""
    booking_reference: str = Field(..., description="Original booking reference")
    pms_reservation_number: str = Field(..., description="PMS reservation number from IDS")
    status: str = Field(default="confirmed", description="Confirmation status")
    confirmed_at: datetime = Field(default_factory=datetime.now, description="When confirmation was received")
    hotel_code: Optional[str] = Field(None, description="Hotel code")
    creator_id: Optional[str] = Field(None, description="Who created the reservation")
