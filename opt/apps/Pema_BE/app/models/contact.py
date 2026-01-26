"""
Contact Us model
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from enum import Enum

from app.db.postgresql import Base


class ContactReason(str, Enum):
    GUIDANCE = "guidance_in_choosing_program"
    AVAILABILITY_PRICING = "availability_and_pricing_details"
    MEDICAL_CONCERN = "discuss_medical_concern"
    SPECIAL_OCCASION = "plan_special_occasion_or_private_retreat"
    TRAVEL_ASSIST = "travel_and_access_assistance"
    BESPOKE = "bespoke_request"


class ContactUs(Base):
    __tablename__ = "contact_us"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(30), nullable=True)
    reason = Column(String(64), nullable=False)
    message = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<ContactUs(id={self.id}, email='{self.email}', reason='{self.reason}')>"


