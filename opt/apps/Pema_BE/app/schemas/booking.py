"""
Booking schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

from app.models.booking import BookingStatus


# Occupancy schema
class Occupancy(BaseModel):
    adults: int = Field(..., ge=1, le=4, description="Number of adults (1-4)")
    children: int = Field(default=0, ge=0, le=3, description="Number of children under 12 (0-3)")
    teens_13_18: int = Field(default=0, ge=0, le=3, description="Number of teens 13-18 (0-3)")
    children_ages: List[int] = Field(default=[], description="Ages of children")
    caregiver_required: bool = Field(default=False, description="Whether caregiver is required")
    
    @validator('children_ages')
    def validate_children_ages(cls, v, values):
        children_count = values.get('children', 0)
        if len(v) != children_count:
            raise ValueError('Children ages must match children count')
        if any(age < 0 or age > 12 for age in v):
            raise ValueError('Children ages must be between 0-12')
        return v
    
    @validator('teens_13_18')
    def validate_teens(cls, v, values):
        if v > 0:
            # Add business rule validation for teen track
            pass
        return v


# Price breakdown
class PriceLine(BaseModel):
    description: str
    amount: float  # Amount in INR (rupees)
    nights: Optional[int] = None
    quantity: Optional[int] = None


class PriceBreakdown(BaseModel):
    lines: List[PriceLine]
    subtotal: float
    taxes: float = 0
    discount: float = 0
    total: float


# Structured estimate breakdown (optional, for easier consumption)
class StructuredLineItem(BaseModel):
    description: str
    amount: float
    nights: Optional[int] = None
    quantity: Optional[int] = None


class CaregiverRoomItem(StructuredLineItem):
    room_type: Optional[str] = None  # e.g., "separate_room" or "sharing_guest_room"


class CaregiverMealItem(StructuredLineItem):
    meal_type: Optional[str] = None  # e.g., "simple" or "restaurant_dining"


class StructuredEstimateBreakdown(BaseModel):
    room_total: Optional[StructuredLineItem] = None
    child_meal: Optional[StructuredLineItem] = None
    caregiver_room_total: Optional[CaregiverRoomItem] = None
    caregiver_meal: Optional[CaregiverMealItem] = None


# Booking estimate request/response
class BookingEstimateRequest(BaseModel):
    room_pricing_category: str = Field(
        ..., pattern=r"^(Standard|Premium Balcony|Premium Garden|Executive|Garden Executive Suite|Executive Junior Suite|Executive Suite|Elemental Villa|Pema Suite)$"
    )
    check_in_date: date = Field(...)
    check_out_date: date = Field(...)
    occupancy: Optional[Occupancy] = None
    
    # Caregiver/transfer options for estimate
    caregiver_required: bool = False
    caregiver_stay_with_guest: bool = False
    caregiver_meal: Optional[str] = Field(None, pattern=r"^(simple|restaurant_dining)$")
    caregiver_room_pricing_category: Optional[str] = Field(
        None, pattern=r"^(Standard|Premium Balcony|Premium Garden|Executive|Garden Executive Suite|Executive Junior Suite|Executive Suite|Elemental Villa|Pema Suite)$",
        description="Room category for caregiver separate room. If not provided, uses guest room category."
    )
    number_of_rooms: int = Field(default=1, ge=1, le=10)
    
    # Simplified totals across all rooms
    adults_total: int = Field(..., ge=0, le=100)
    children_total_under_4: int = Field(default=0, ge=0, le=100)
    children_total_5to12: int = Field(default=0, ge=0, le=100)
    teens_13to18: int = Field(default=0, ge=0, le=100)
    
    @validator('check_out_date')
    def validate_dates(cls, v, values):
        check_in = values.get('check_in_date')
        if check_in and v <= check_in:
            raise ValueError('Check-out date must be after check-in date')
        return v
    
    @validator('check_in_date')
    def validate_check_in_future(cls, v):
        if v < date.today():
            raise ValueError('Check-in date must be in the future')
        return v


class BookingEstimateResponse(BaseModel):
    nights: int
    min_stay_ok: bool
    min_stay_required: int
    price_breakdown: PriceBreakdown
    per_night_charges: float
    structured_breakdown: Optional[StructuredEstimateBreakdown] = None
    deposit_required: str
    full_payment_required: bool
    warnings: List[str] = []
    recommendations: List[str] = []
    
    # Availability info
    room_available: bool
    alternative_rooms: List[int] = []
    # Selected room ids (when multiple rooms requested)
    room_ids: List[int] = []


# Booking creation
class BookingCreateRequest(BaseModel):
    room_pricing_category: str = Field(
        ..., pattern=r"^(Standard|Premium Balcony|Premium Garden|Executive|Garden Executive Suite|Executive Junior Suite|Executive Suite|Elemental Villa|Pema Suite)$"
    )
    check_in_date: date
    check_out_date: date
    occupancy: Optional[Occupancy] = None
    
    # Optional details
    special_requests: Optional[str] = Field(None, max_length=1000)
    
    # Guest contact (no login flow)
    guest_first_name: Optional[str] = Field(None, max_length=100)
    guest_last_name: Optional[str] = Field(None, max_length=100)
    guest_email: Optional[str] = Field(None)
    guest_phone: Optional[str] = Field(None, pattern=r"^\+?[\d\s\-\(\)]{8,15}$")
    guest_country: Optional[str] = Field(None, max_length=100)
    other_guests: Optional[List[str]] = Field(None, description="List of additional guest names")
    number_of_rooms: int = Field(default=1, ge=1, le=10)
    
    # Simplified totals across all rooms
    adults_total: int = Field(..., ge=0, le=100)
    children_total_under_4: int = Field(default=0, ge=0, le=100)
    children_total_5to12: int = Field(default=0, ge=0, le=100)
    teens_13to18: int = Field(default=0, ge=0, le=100)

    # Caregiver/transfer options
    caregiver_required: bool = False
    caregiver_stay_with_guest: bool = False
    caregiver_meal: Optional[str] = Field(None, pattern=r"^(simple|restaurant_dining)$")
    private_transfer: bool = False

    # Emergency contact removed (not collected)
    
    @validator('check_out_date')
    def validate_dates(cls, v, values):
        check_in = values.get('check_in_date')
        if check_in and v <= check_in:
            raise ValueError('Check-out date must be after check-in date')
        return v


class BookingResponse(BaseModel):
    id: int
    confirmation_number: Optional[str]
    status: BookingStatus

    # Booking details
    program: Optional["ProgramSummary"]
    room: "RoomSummary"
    check_in_date: date
    check_out_date: date
    nights: int
    occupancy_details: dict

    # Pricing (amounts in rupees)
    total_amount: int  # Amount in rupees
    deposit_amount: int  # Amount in rupees
    paid_amount: int  # Amount in rupees
    balance_amount: int  # Amount in rupees

    # Status flags
    full_payment_required: bool

    # Important dates
    created_at: datetime
    medical_form_submitted_at: Optional[datetime]
    doctor_reviewed_at: Optional[datetime]

    # Notes
    special_requests: Optional[str]
    guest_notes: Optional[str]

    # Guest contact
    guest_email: Optional[str]
    guest_phone: Optional[str]
    other_guests: Optional[List[str]]

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        """Amounts are already in rupees."""
        return super().from_orm(obj)


class BookingListResponse(BaseModel):
    id: int
    confirmation_number: Optional[str]
    status: BookingStatus
    program_title: Optional[str]
    room_name: str
    check_in_date: date
    check_out_date: date
    total_amount: int
    paid_amount: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminBookingListResponse(BaseModel):
    """Admin list: basic fields + guest contact for table view."""
    id: int
    confirmation_number: Optional[str]
    status: BookingStatus
    program_title: Optional[str]
    room_name: str
    check_in_date: date
    check_out_date: date
    total_amount: int
    paid_amount: int
    created_at: datetime
    guest_first_name: Optional[str] = None
    guest_last_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None

    class Config:
        from_attributes = True


class AdminBookingListPaginatedResponse(BaseModel):
    """Admin bookings list with total for pagination."""
    items: List["AdminBookingListResponse"]
    total: int
    page: int
    limit: int


class BookingStatusUpdate(BaseModel):
    status: BookingStatus
    notes: Optional[str] = Field(None, max_length=1000)


class BookingCancellation(BaseModel):
    reason: str = Field(..., max_length=500)
    refund_requested: bool = True


# Supporting schemas
class ProgramSummary(BaseModel):
    id: int
    title: str
    program_type: str
    duration_days_min: int
    duration_days_max: Optional[int]
    
    class Config:
        from_attributes = True


class RoomSummary(BaseModel):
    id: int
    name: str
    category: str
    code: Optional[str]
    occupancy_max_adults: int
    occupancy_max_children: int
    
    class Config:
        from_attributes = True


# Check-in/out
class CheckInRequest(BaseModel):
    actual_check_in_date: Optional[date] = None
    notes: Optional[str] = Field(None, max_length=500)


class CheckOutRequest(BaseModel):
    actual_check_out_date: Optional[date] = None
    early_checkout: bool = False
    feedback: Optional[str] = Field(None, max_length=1000)
    rating: Optional[int] = Field(None, ge=1, le=5)


# Booking filters for listing
class BookingFilters(BaseModel):
    status: Optional[BookingStatus] = None
    program_id: Optional[int] = None
    room_id: Optional[int] = None
    check_in_from: Optional[date] = None
    check_in_to: Optional[date] = None
    created_from: Optional[date] = None
    created_to: Optional[date] = None
    
    # Pagination
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)


class BookingSearchResponse(BaseModel):
    # Booking basics
    id: int
    check_in_date: date
    check_out_date: date
    nights: int
    occupancy_details: dict
    status: BookingStatus

    # Financials (amounts in rupees)
    total_amount: int  # Amount in rupees
    deposit_amount: int  # Amount in rupees
    paid_amount: int  # Amount in rupees
    balance_amount: int  # Amount in rupees

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        """Amounts are already in rupees."""
        return super().from_orm(obj)
    
    # Notes
    special_requests: Optional[str]
    guest_notes: Optional[str]
    
    # Guest info
    guest_first_name: Optional[str]
    guest_last_name: Optional[str]
    guest_email: Optional[str]
    guest_phone: Optional[str]
    guest_country: Optional[str]
    
    # Configuration
    number_of_rooms: int
    caregiver_required: bool
    caregiver_stay_with_guest: bool
    caregiver_meal: Optional[str]
    private_transfer: bool
    
    # Identifiers & Cancellation
    confirmation_number: Optional[str]
    invoice_id: Optional[str]
    cancelled_at: Optional[datetime]
    cancellation_reason: Optional[str]
    refund_amount: int
    
    # Extra details
    ids_booking_reference: Optional[str]
    other_guests: Optional[List[str]] = None
    estimate_details: Optional[dict] = None

    class Config:
        from_attributes = True


# Make forward references work
BookingResponse.model_rebuild()
BookingEstimateResponse.model_rebuild()
