"""
Program model (minimal fields as per spec)
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

from app.db.postgresql import Base


class ProgramType(str, Enum):
    MEDICAL = "medical"
    WELLNESS = "wellness"
    LITE = "lite"


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)

    # Required
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    program_type = Column(String(20), nullable=False)  # medical|wellness|lite

    # Duration
    duration_days_min = Column(Integer, nullable=False, default=3)
    duration_days_max = Column(Integer, nullable=True)

    # Pricing base (rupees); detailed pricing in pricing_bands or rate tables
    price_base = Column(Integer, nullable=True, default=0)

    # Audit
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    pricing_bands = relationship("PricingBand", back_populates="program")
    bookings = relationship("Booking", back_populates="program")
    creator = relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<Program(id={self.id}, title='{self.title}', type='{self.program_type}')>"

    @property
    def duration_range(self) -> str:
        if self.duration_days_max and self.duration_days_max != self.duration_days_min:
            return f"{self.duration_days_min}-{self.duration_days_max} days"
        return f"{self.duration_days_min} days"
