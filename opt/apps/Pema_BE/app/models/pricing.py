"""
Pricing band model for flexible pricing management
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

from app.db.postgresql import Base


class PricingType(str, Enum):
    PER_NIGHT = "per_night"
    PER_PACKAGE = "per_package"


class PricingBand(Base):
    __tablename__ = "pricing_bands"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)  # Nullable for global bands
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)  # Nullable for program-wide bands
    
    # Duration range
    min_nights = Column(Integer, nullable=False)
    max_nights = Column(Integer, nullable=True)  # Null means no upper limit
    
    # Pricing configuration
    pricing_type = Column(String(20), default=PricingType.PER_NIGHT.value, nullable=False)
    
    # Prices in INR rupees
    price_single = Column(Integer, nullable=False)  # Single occupancy
    price_double = Column(Integer, nullable=False)  # Double occupancy
    price_extra_adult = Column(Integer, default=0, nullable=False)  # Per extra adult
    price_child = Column(Integer, default=0, nullable=False)  # Per child
    
    # Package pricing (for per_package type) in INR rupees
    package_price_single = Column(Integer, nullable=True)
    package_price_double = Column(Integer, nullable=True)
    
    # Modifiers and discounts
    discount_percentage = Column(Integer, default=0, nullable=False)  # Discount for longer stays
    early_bird_discount = Column(Integer, default=0, nullable=False)  # Early booking discount
    
    # Seasonal pricing
    season_name = Column(String(50), nullable=True)  # "peak", "off-peak", "festive"
    valid_from = Column(DateTime, nullable=True)  # Season start date
    valid_until = Column(DateTime, nullable=True)  # Season end date
    
    # Business rules
    minimum_advance_booking_days = Column(Integer, default=0, nullable=False)
    maximum_advance_booking_days = Column(Integer, nullable=True)
    
    # Additional info
    notes = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)  # Staff notes
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    priority = Column(Integer, default=0, nullable=False)  # Higher priority takes precedence
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    program = relationship("Program", back_populates="pricing_bands")
    room = relationship("Room", back_populates="pricing_bands")
    
    def __repr__(self):
        return f"<PricingBand(id={self.id}, min_nights={self.min_nights}, max_nights={self.max_nights})>"
    
    def is_applicable(self, nights: int, program_id: int = None, room_id: int = None) -> bool:
        """Check if pricing band is applicable for given criteria"""
        # Check night range
        if nights < self.min_nights:
            return False
        if self.max_nights and nights > self.max_nights:
            return False
            
        # Check program match
        if self.program_id and program_id and self.program_id != program_id:
            return False
            
        # Check room match
        if self.room_id and room_id and self.room_id != room_id:
            return False
            
        return self.is_active
    
    def calculate_price(self, nights: int, adults: int, children: int = 0) -> int:
        """Calculate total price for given occupancy and duration in rupees"""
        if self.pricing_type == PricingType.PER_PACKAGE.value:
            # Package pricing
            if adults == 1:
                base_price = self.package_price_single or self.price_single * nights
            else:
                base_price = self.package_price_double or self.price_double * nights
        else:
            # Per night pricing
            if adults == 1:
                base_price = self.price_single * nights
            else:
                base_price = self.price_double * nights

        # Add extra adult charges
        if adults > 2:
            base_price += (adults - 2) * self.price_extra_adult * nights

        # Add child charges
        if children > 0:
            base_price += children * self.price_child * nights

        # Apply discounts
        if self.discount_percentage > 0:
            discount_amount = (base_price * self.discount_percentage) // 100
            base_price -= discount_amount

        return max(0, base_price)  # Ensure non-negative price in rupees
