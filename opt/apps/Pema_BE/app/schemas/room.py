"""
Room schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.room import RoomCategory


class RoomBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    category: RoomCategory
    description: Optional[str] = None
    
    # Occupancy
    occupancy_max_adults: int = Field(..., ge=1, le=6)
    occupancy_max_children: int = Field(..., ge=0, le=4)
    occupancy_max_total: int = Field(..., ge=1, le=8)
    
    @validator('occupancy_max_total')
    def validate_total_occupancy(cls, v, values):
        max_adults = values.get('occupancy_max_adults', 0)
        max_children = values.get('occupancy_max_children', 0)
        if v < max_adults or v < max_children:
            raise ValueError('Max total must be >= max adults and max children')
        return v


class RoomCreate(RoomBase):
    # Pricing
    price_per_night_single: int = Field(..., gt=0)
    price_per_night_double: int = Field(..., gt=0)
    price_per_night_extra_adult: int = Field(default=0, ge=0)
    price_per_night_child: int = Field(default=0, ge=0)
    
    # Inventory
    inventory_count: int = Field(default=1, ge=1, le=10)
    
    # Payment policy
    refundable_full_payment_required: bool = False
    deposit_amount: Optional[int] = Field(None, gt=0)
    
    # Features
    amenities: Optional[List[str]] = None
    features: Optional[Dict[str, Any]] = None
    
    # Media
    featured_image: Optional[str] = Field(None, max_length=500)
    gallery_images: Optional[List[str]] = None
    floor_plan_image: Optional[str] = Field(None, max_length=500)
    
    # Specifications
    bed_configuration: Optional[str] = Field(None, max_length=100)
    room_size_sqft: Optional[int] = Field(None, gt=0)
    max_extra_beds: int = Field(default=0, ge=0, le=2)
    
    # Accessibility
    medical_equipment_compatible: bool = True
    wheelchair_accessible: bool = False
    
    # Status
    is_active: bool = True
    maintenance_mode: bool = False


class RoomUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    
    # Occupancy
    occupancy_max_adults: Optional[int] = Field(None, ge=1, le=6)
    occupancy_max_children: Optional[int] = Field(None, ge=0, le=4)
    occupancy_max_total: Optional[int] = Field(None, ge=1, le=8)
    
    # Pricing
    price_per_night_single: Optional[int] = Field(None, gt=0)
    price_per_night_double: Optional[int] = Field(None, gt=0)
    price_per_night_extra_adult: Optional[int] = Field(None, ge=0)
    price_per_night_child: Optional[int] = Field(None, ge=0)
    
    # Inventory
    inventory_count: Optional[int] = Field(None, ge=1, le=10)
    
    # Payment policy
    refundable_full_payment_required: Optional[bool] = None
    deposit_amount: Optional[int] = Field(None, gt=0)
    
    # Features
    amenities: Optional[List[str]] = None
    features: Optional[Dict[str, Any]] = None
    
    # Media
    featured_image: Optional[str] = Field(None, max_length=500)
    gallery_images: Optional[List[str]] = None
    floor_plan_image: Optional[str] = Field(None, max_length=500)
    
    # Specifications
    bed_configuration: Optional[str] = Field(None, max_length=100)
    room_size_sqft: Optional[int] = Field(None, gt=0)
    max_extra_beds: Optional[int] = Field(None, ge=0, le=2)
    
    # Accessibility
    medical_equipment_compatible: Optional[bool] = None
    wheelchair_accessible: Optional[bool] = None
    
    # Status
    is_active: Optional[bool] = None
    maintenance_mode: Optional[bool] = None


class RoomResponse(BaseModel):
    id: int
    name: str
    code: Optional[str]
    category: RoomCategory
    description: Optional[str]
    
    # Occupancy
    occupancy_max_adults: int
    occupancy_max_children: int
    occupancy_max_total: int
    
    # Pricing
    price_per_night_single: int
    price_per_night_double: int
    price_per_night_extra_adult: int
    price_per_night_child: int
    
    # Inventory
    inventory_count: int
    
    # Payment policy
    refundable_full_payment_required: bool
    deposit_amount: Optional[int]
    effective_deposit_amount: int  # Computed property
    
    # Features
    amenities: Optional[List[str]]
    features: Optional[Dict[str, Any]]
    
    # Media
    featured_image: Optional[str]
    gallery_images: Optional[List[str]]
    floor_plan_image: Optional[str]
    
    # Specifications
    bed_configuration: Optional[str]
    room_size_sqft: Optional[int]
    max_extra_beds: int
    
    # Accessibility
    medical_equipment_compatible: bool
    wheelchair_accessible: bool
    
    # Status
    is_active: bool
    maintenance_mode: bool
    
    # Metadata
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RoomListResponse(BaseModel):
    id: int
    name: str
    category: RoomCategory
    description: Optional[str]
    occupancy_max_adults: int
    occupancy_max_children: int
    price_per_night_single: int
    price_per_night_double: int
    featured_image: Optional[str]
    amenities: List[str]
    
    class Config:
        from_attributes = True


class RoomAvailabilityCheck(BaseModel):
    room_id: int
    check_in_date: datetime = Field(...)
    check_out_date: datetime = Field(...)
    
    @validator('check_out_date')
    def validate_dates(cls, v, values):
        check_in = values.get('check_in_date')
        if check_in and v <= check_in:
            raise ValueError('Check-out date must be after check-in date')
        return v


class RoomAvailabilityResponse(BaseModel):
    room_id: int
    available: bool
    available_count: int
    total_inventory: int
    conflicting_bookings: int
    
    class Config:
        from_attributes = True


class RoomFilters(BaseModel):
    category: Optional[str] = None
    min_adults: Optional[int] = Field(None, ge=1)
    min_children: Optional[int] = Field(None, ge=0)
    max_price_single: Optional[int] = Field(None, gt=0)
    max_price_double: Optional[int] = Field(None, gt=0)
    wheelchair_accessible: Optional[bool] = None
    medical_equipment_compatible: Optional[bool] = None
    is_active: Optional[bool] = None
    
    # Search
    search: Optional[str] = Field(None, max_length=255)
    
    # Pagination
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    
    # Sorting
    sort_by: str = Field(default="name", pattern=r"^(name|category|price_per_night_single|occupancy_max_adults|created_at)$")
    sort_order: str = Field(default="asc", pattern=r"^(asc|desc)$")


class RoomTypeSummary(BaseModel):
    category: str
    code: str
    total_inventory: int
    occupancy_max_adults: int
    occupancy_max_children: int
    price_per_night_single: int
    price_per_night_double: int
    price_per_night_single_upto_7_nights: int
    price_per_night_double_upto_7_nights: int


class RoomAvailabilityByCategory(BaseModel):
    category: str
    available_units: int
    total_inventory: int
