"""
Contact Us schemas
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class ContactReason(str, Enum):
    guidance_in_choosing_program = "Guidance in choosing the right program"
    availability_and_pricing_details = "Availability and pricing details"
    discuss_medical_concern = "Discuss a medical concern before confirming"
    plan_special_occasion_or_private_retreat = "Plan a special occasion or private retreat"
    travel_and_access_assistance = "Travel & access assistance transfers or logistics"
    bespoke_request = "A bespoke request personalised experiences, extended stays, or tailored needs"


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(
        None,
        pattern=r"^\+[1-9][0-9]{6,14}$",
        description="Must start with + and country code, E.164 format"
    )
    reason: ContactReason
    message: str = Field(..., min_length=5, max_length=5000, description="Describe your query")


class ContactResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    reason: ContactReason
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


