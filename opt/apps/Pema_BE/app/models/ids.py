"""
IDS Next ARI (Availability, Rates, and Inventory) models
Pydantic models for OTA XML message handling
"""

from datetime import date, datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from enum import Enum


class RestrictionType(str, Enum):
    """Restriction types for room availability"""
    MASTER = "Master"  # General open/close
    ARRIVAL = "Arrival"  # Close to arrival
    DEPARTURE = "Departure"  # Close to departure


class RestrictionStatus(str, Enum):
    """Restriction status values"""
    OPEN = "Open"
    CLOSE = "Close"


class MinMaxMessageType(str, Enum):
    """Length of stay restriction types"""
    SET_MIN_LOS = "SetMinLOS"
    SET_MAX_LOS = "SetMaxLOS"


class TimeUnit(str, Enum):
    """Time unit for length of stay"""
    DAY = "Day"


class DayOfWeek(BaseModel):
    """Day of week applicability flags"""
    mon: Optional[bool] = Field(default=None, alias="Mon")
    tue: Optional[bool] = Field(default=None, alias="Tue")
    wed: Optional[bool] = Field(default=None, alias="Weds")
    thu: Optional[bool] = Field(default=None, alias="Thur")
    fri: Optional[bool] = Field(default=None, alias="Fri")
    sat: Optional[bool] = Field(default=None, alias="Sat")
    sun: Optional[bool] = Field(default=None, alias="Sun")


class StatusApplicationControl(BaseModel):
    """Defines application of controls being sent"""
    start: date = Field(..., description="First date for availability update")
    end: date = Field(..., description="Last date for availability update")
    inv_type_code: str = Field(..., alias="InvTypeCode", description="Room type code")
    rate_plan_code: str = Field(..., alias="RatePlanCode", description="Rate plan code")
    meal_plan_code: str = Field(..., alias="MealPlanCode", description="Meal plan code")

    # Day of week applicability
    mon: Optional[bool] = Field(default=None, alias="Mon")
    tue: Optional[bool] = Field(default=None, alias="Tue")
    wed: Optional[bool] = Field(default=None, alias="Weds")
    thu: Optional[bool] = Field(default=None, alias="Thur")
    fri: Optional[bool] = Field(default=None, alias="Fri")
    sat: Optional[bool] = Field(default=None, alias="Sat")
    sun: Optional[bool] = Field(default=None, alias="Sun")


class RestrictionStatusElement(BaseModel):
    """Room restriction rules"""
    restriction: RestrictionType = Field(..., alias="Restriction")
    status: RestrictionStatus = Field(..., alias="Status")


class LengthOfStay(BaseModel):
    """Length of stay restrictions"""
    time: int = Field(..., description="Length of stay in time units")
    time_unit: TimeUnit = Field(..., alias="TimeUnit", description="Time unit (Day)")
    min_max_message_type: MinMaxMessageType = Field(
        ..., alias="MinMaxMessageType",
        description="Minimum or maximum length of stay"
    )


class LengthsOfStay(BaseModel):
    """Container for length of stay restrictions"""
    length_of_stay: List[LengthOfStay] = Field(default_factory=list, alias="LengthOfStay")


class UniqueID(BaseModel):
    """Unique identifier for tracking messages"""
    type: int = Field(..., description="OpenTravel Alliance code list UIT")
    id: str = Field(..., alias="ID", description="Unique incremental number")


class AvailStatusMessage(BaseModel):
    """Individual availability status message"""
    status_application_control: StatusApplicationControl = Field(..., alias="StatusApplicationControl")
    restriction_status: Optional[RestrictionStatusElement] = Field(default=None, alias="RestrictionStatus")
    lengths_of_stay: Optional[LengthsOfStay] = Field(default=None, alias="LengthsOfStay")
    unique_id: Optional[UniqueID] = Field(default=None, alias="UniqueID")


class AvailStatusMessages(BaseModel):
    """Container for availability status messages"""
    hotel_code: str = Field(..., alias="HotelCode")
    avail_status_message: List[AvailStatusMessage] = Field(default_factory=list, alias="AvailStatusMessage")


# OTA_HotelAvailNotifRQ - Availability Update Request
class OTAHotelAvailNotifRQ(BaseModel):
    """OTA Hotel Availability Notification Request"""
    xmlns: str = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    version: str = Field(default="1.0", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    transaction_identifier: Optional[str] = Field(default=None, alias="@TransactionIdentifier")
    time_stamp: datetime = Field(..., alias="@TimeStamp")
    message_content_code: int = Field(default=3, alias="@MessageContentCode")  # 3 = Room/Rate availability

    avail_status_messages: AvailStatusMessages = Field(..., alias="AvailStatusMessages")


# OTA_HotelAvailNotifRS - Availability Update Response
class Warning(BaseModel):
    """Warning information"""
    type: int = Field(..., alias="@Type", description="Open Travel Alliance EWT list")
    code: Optional[int] = Field(default=None, alias="@Code", description="Open Travel Alliance ERR list")
    record_id: Optional[int] = Field(default=None, alias="@RecordID")
    text: Optional[str] = Field(default=None, description="Warning message text")


class Warnings(BaseModel):
    """Container for warnings"""
    warning: List[Warning] = Field(default_factory=list, alias="Warning")


class Error(BaseModel):
    """Error information"""
    type: int = Field(..., alias="@Type", description="Open Travel Alliance EWT list")
    code: Optional[int] = Field(default=None, alias="@Code", description="Open Travel Alliance ERR list")
    record_id: Optional[int] = Field(default=None, alias="@RecordID")
    text: Optional[str] = Field(default=None, description="Error message text")


class Errors(BaseModel):
    """Container for errors"""
    error: List[Error] = Field(default_factory=list, alias="Error")


class Success(BaseModel):
    """Success indicator"""
    pass


class OTAHotelAvailNotifRS(BaseModel):
    """OTA Hotel Availability Notification Response"""
    xmlns: Optional[str] = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    version: str = Field(default="1.0", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    transaction_identifier: Optional[str] = Field(default=None, alias="@TransactionIdentifier")
    time_stamp: datetime = Field(..., alias="@TimeStamp")
    message_content_code: int = Field(default=3, alias="@MessageContentCode")  # 3 = Room/Rate availability

    success: Optional[Success] = Field(default=None, alias="Success")
    warnings: Optional[Warnings] = Field(default=None, alias="Warnings")
    errors: Optional[Errors] = Field(default=None, alias="Errors")


# Rate Plan Models (OTA_HotelRatePlanNotifRQ/RS)

class BaseByGuestAmt(BaseModel):
    """Base by guest amount information"""
    age_qualifying_code: int = Field(..., alias="AgeQualifyingCode", description="Age qualifying code (10=Adult, 8=Child)")
    number_of_guests: int = Field(..., alias="NumberOfGuests", description="Number of guests")
    amount_before_tax: float = Field(..., alias="AmountBeforeTax", description="Amount before tax")


class BaseByGuestAmts(BaseModel):
    """Container for base by guest amounts"""
    base_by_guest_amt: List[BaseByGuestAmt] = Field(default_factory=list, alias="BaseByGuestAmt")


class AdditionalGuestAmount(BaseModel):
    """Additional guest amount information"""
    age_qualifying_code: int = Field(..., alias="AgeQualifyingCode")
    amount: float = Field(..., alias="Amount")


class AdditionalGuestAmounts(BaseModel):
    """Container for additional guest amounts"""
    additional_guest_amount: List[AdditionalGuestAmount] = Field(default_factory=list, alias="AdditionalGuestAmount")


class RatePlan(BaseModel):
    """Rate plan information"""
    rate_plan_code: str = Field(..., alias="RatePlanCode")
    rate_plan_name: Optional[str] = Field(default=None, alias="RatePlanName")
    rate_plan_category: str = Field(default="RACK", alias="RatePlanCategory")
    rate_plan_notif_type: str = Field(default="Overlay", alias="RatePlanNotifType")
    start: Optional[date] = Field(default=None, alias="Start")
    end: Optional[date] = Field(default=None, alias="End")
    currency_code: str = Field(default="INR", alias="CurrencyCode")


class Rate(BaseModel):
    """Rate information"""
    effective_date: date = Field(..., alias="EffectiveDate")
    expire_date: date = Field(..., alias="ExpireDate")
    rate_time_unit: str = Field(default="Day", alias="RateTimeUnit")
    unit_multiplier: int = Field(default=1, alias="UnitMultiplier")
    inv_type_code: str = Field(..., alias="InvTypeCode", description="Room type code")
    meal_plan_code: str = Field(default="CP", alias="MealPlanCode", description="Meal plan code")
    currency_code: str = Field(default="INR", alias="CurrencyCode")

    # Day of week applicability
    mon: Optional[bool] = Field(default=None, alias="Mon")
    tue: Optional[bool] = Field(default=None, alias="Tue")
    wed: Optional[bool] = Field(default=None, alias="Weds")
    thu: Optional[bool] = Field(default=None, alias="Thur")
    fri: Optional[bool] = Field(default=None, alias="Fri")
    sat: Optional[bool] = Field(default=None, alias="Sat")
    sun: Optional[bool] = Field(default=None, alias="Sun")

    # Base by guest amounts (proper structure)
    base_by_guest_amts: Optional[BaseByGuestAmts] = Field(default=None, alias="BaseByGuestAmts")

    # Additional guest amounts
    additional_guest_amounts: Optional[AdditionalGuestAmounts] = Field(default=None, alias="AdditionalGuestAmounts")

    # Legacy fields for backward compatibility
    base_by_guest_amt_1: Optional[float] = Field(default=None, alias="BaseByGuestAmts.BaseByGuestAmt[@NumberOfGuests='1']")
    base_by_guest_amt_2: Optional[float] = Field(default=None, alias="BaseByGuestAmts.BaseByGuestAmt[@NumberOfGuests='2']")


class Rates(BaseModel):
    """Container for rates"""
    rate: List[Rate] = Field(default_factory=list, alias="Rate")


class RatePlanMessage(BaseModel):
    """Individual rate plan message"""
    rate_plan: RatePlan = Field(..., alias="RatePlan")
    rates: Rates = Field(..., alias="Rates")


class RatePlanMessages(BaseModel):
    """Container for rate plan messages"""
    hotel_code: str = Field(..., alias="HotelCode")
    rate_plan_message: List[RatePlanMessage] = Field(default_factory=list, alias="RatePlanMessage")


class OTAHotelRatePlanNotifRQ(BaseModel):
    """OTA Hotel Rate Plan Notification Request"""
    xmlns: str = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    version: str = Field(default="1.0", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    time_stamp: datetime = Field(..., alias="@TimeStamp")
    message_content_code: int = Field(default=8, alias="@MessageContentCode")  # 8 = Rate plan

    rate_plan_messages: RatePlanMessages = Field(..., alias="RatePlanMessages")


class OTAHotelRatePlanNotifRS(BaseModel):
    """OTA Hotel Rate Plan Notification Response"""
    xmlns: Optional[str] = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    version: str = Field(default="1.0", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    time_stamp: datetime = Field(..., alias="@TimeStamp")

    success: Optional[Success] = Field(default=None, alias="Success")
    warnings: Optional[Warnings] = Field(default=None, alias="Warnings")
    errors: Optional[Errors] = Field(default=None, alias="Errors")


# Internal models for easier handling
class AvailabilityUpdate(BaseModel):
    """Internal model for availability updates"""
    room_code: str
    rate_plan_code: str
    meal_plan_code: str
    start_date: date
    end_date: date
    restriction_type: Optional[RestrictionType] = None
    restriction_status: Optional[RestrictionStatus] = None
    min_los: Optional[int] = None
    max_los: Optional[int] = None
    day_of_week: Optional[Dict[str, bool]] = None
    unique_id: Optional[str] = None


# Inventory Models (OTA_HotelInvCountNotifRQ/RS)

class InvCount(BaseModel):
    """Inventory count information"""
    count_type: str = Field(default="2", alias="CountType")  # 2 = Available quantity
    count: int = Field(..., alias="Count", description="Number of rooms available")


class Inventory(BaseModel):
    """Individual inventory information"""
    inv_type_code: str = Field(..., alias="InvTypeCode", description="Room type code")
    status_application_control: StatusApplicationControl = Field(..., alias="StatusApplicationControl")
    inv_count: InvCount = Field(..., alias="InvCount")


class Inventories(BaseModel):
    """Container for inventory information"""
    hotel_code: str = Field(..., alias="HotelCode")
    inventory: List[Inventory] = Field(default_factory=list, alias="Inventory")


class OTAHotelInvCountNotifRQ(BaseModel):
    """OTA Hotel Inventory Count Notification Request"""
    xmlns: str = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    version: str = Field(default="1.2", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    time_stamp: datetime = Field(..., alias="@TimeStamp")
    message_content_code: int = Field(default=1, alias="@MessageContentCode")  # 1 = Inventory

    inventories: Inventories = Field(..., alias="Inventories")


class OTAHotelInvCountNotifRS(BaseModel):
    """OTA Hotel Inventory Count Notification Response"""
    xmlns: Optional[str] = Field(default="http://www.opentravel.org/OTA/2003/05", alias="@xmlns")
    xsi_schema_location: Optional[str] = Field(default=None, alias="@xmlns:xsi")
    version: str = Field(default="1.2", alias="@Version")
    echo_token: str = Field(..., alias="@EchoToken")
    time_stamp: datetime = Field(..., alias="@TimeStamp")

    success: Optional[Success] = Field(default=None, alias="Success")
    warnings: Optional[Warnings] = Field(default=None, alias="Warnings")
    errors: Optional[Errors] = Field(default=None, alias="Errors")


class RateUpdate(BaseModel):
    """Internal model for rate updates"""
    rate_plan_code: str
    start_date: date
    end_date: date
    single_occupancy_rate: Optional[float] = None
    double_occupancy_rate: Optional[float] = None
    currency: str = "INR"


class AvailabilityQuery(BaseModel):
    """Query for checking availability"""
    room_codes: List[str]
    rate_plan_codes: List[str]
    start_date: date
    end_date: date
    adults: int = 1
    children: int = 0


class AvailabilityResponse(BaseModel):
    """Response for availability queries"""
    room_code: str
    rate_plan_code: str
    date: date
    available: bool
    restriction_type: Optional[RestrictionType] = None
    restriction_status: Optional[RestrictionStatus] = None
    min_los: Optional[int] = None
    max_los: Optional[int] = None


# Booking Response Models
class OTAHotelResNotifRS(BaseModel):
    """Response for hotel reservation notification (acknowledgment)"""
    version: str = Field(default="3.002", alias="@Version")
    time_stamp: datetime = Field(..., alias="@TimeStamp")
    echo_token: str = Field(..., alias="@EchoToken")
    res_status: str = Field(..., alias="@ResStatus")

    # Success or Error - we'll determine which one is present
    success: Optional[bool] = Field(default=None)
    error: Optional[str] = Field(default=None)

    @validator('success', pre=True, always=True)
    def validate_success(cls, v, values):
        # If we have success in the XML, return True
        # If we have error, return False
        # This is a simplified approach - in real XML parsing we'd check for Success/Error elements
        return True  # Assume success unless we can parse error


class OTANotifReportRQ(BaseModel):
    """Notification report request (confirmation with PMS reservation number)"""
    version: str = Field(default="1.0", alias="@Version")
    time_stamp: datetime = Field(..., alias="@TimeStamp")
    echo_token: str = Field(..., alias="@EchoToken")

    success: Optional[bool] = Field(default=None)
    error: Optional[str] = Field(default=None)

    # NotifDetails would contain the actual confirmation with PMS reservation number
    # This is simplified for now
