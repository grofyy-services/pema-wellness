"""
Program schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.program import ProgramType


class ProgramBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    program_type: ProgramType
    category: Optional[str] = Field(None, max_length=100)
    duration_days_min: int = Field(..., ge=1, le=365)
    duration_days_max: Optional[int] = Field(None, ge=1, le=365)


class ProgramCreate(ProgramBase):
    price_base: Optional[int] = Field(None, ge=0)
    min_age: Optional[int] = Field(None, ge=0, le=120)
    max_age: Optional[int] = Field(None, ge=0, le=120)


class ProgramUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    duration_days_min: Optional[int] = Field(None, ge=1, le=365)
    price_base: Optional[int] = Field(None, ge=0)
    min_age: Optional[int] = Field(None, ge=0, le=120)
    max_age: Optional[int] = Field(None, ge=0, le=120)


class ProgramResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    program_type: ProgramType
    category: Optional[str]
    
    # Duration
    duration_days_min: int
    duration_days_max: Optional[int]
    duration_range: str  # Computed property
    
    # Pricing
    price_base: Optional[int]
    starting_price: Optional[int]  # Computed from pricing bands
    
    min_age: Optional[int]
    max_age: Optional[int]
    
    # Metadata
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    pricing_bands: List["PricingBandSummary"] = []
    
    class Config:
        from_attributes = True


class ProgramListResponse(BaseModel):
    id: int
    title: str
    program_type: ProgramType
    category: Optional[str]
    duration_range: str
    starting_price: Optional[int]
    
    class Config:
        from_attributes = True


class ProgramFilters(BaseModel):
    program_type: Optional[ProgramType] = None
    category: Optional[str] = None
    min_duration: Optional[int] = Field(None, gt=0)
    max_duration: Optional[int] = Field(None, gt=0)
    max_price: Optional[int] = Field(None, gt=0)
    
    # Search
    search: Optional[str] = Field(None, max_length=255)
    
    # Pagination
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    
    # Sorting
    sort_by: str = Field(default="created_at", pattern=r"^(title|duration_days_min|price_base|created_at)$")
    sort_order: str = Field(default="asc", pattern=r"^(asc|desc)$")


class PricingBandSummary(BaseModel):
    id: int
    min_nights: int
    max_nights: Optional[int]
    pricing_type: str
    price_single: int
    price_double: int
    season_name: Optional[str]
    
    class Config:
        from_attributes = True


# Make forward references work
ProgramResponse.model_rebuild()
