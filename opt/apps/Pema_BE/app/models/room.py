"""
Room model for accommodation management
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

from app.db.postgresql import Base


class RoomCategory(str, Enum):
    STANDARD = "Standard"
    PREMIUM_BALCONY = "Premium Balcony"
    PREMIUM_GARDEN = "Premium Garden"
    EXECUTIVE = "Executive"
    GARDEN_EXECUTIVE_SUITE = "Garden Executive Suite"
    EXECUTIVE_JUNIOR_SUITE = "Executive Junior Suite"
    EXECUTIVE_SUITE = "Executive Suite"
    ELEMENTAL_VILLA = "Elemental Villa"
    PEMA_SUITE = "Pema Suite"


class Room(Base):
    __tablename__ = "rooms"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic info
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=True)  # Room code like "S01", "P02"
    category = Column(String(50), nullable=False)  # suite, premium, deluxe, standard
    description = Column(Text, nullable=True)
    pricing_category = Column(String(100), nullable=True)  # Brochure category for pricing
    
    # Occupancy limits
    occupancy_max_adults = Column(Integer, default=2, nullable=False)
    occupancy_max_children = Column(Integer, default=2, nullable=False)
    occupancy_max_total = Column(Integer, default=4, nullable=False)
    
    # Pricing (per night in INR rupees)
    price_per_night_single = Column(Integer, nullable=False)
    price_per_night_double = Column(Integer, nullable=False)
    price_per_night_extra_adult = Column(Integer, default=0, nullable=False)
    price_per_night_child = Column(Integer, default=0, nullable=False)
    
    # Inventory
    inventory_count = Column(Integer, default=1, nullable=False)  # Number of rooms of this type
    
    # Payment policy
    refundable_full_payment_required = Column(Boolean, default=False, nullable=False)  # For suites
    deposit_amount = Column(Integer, nullable=True)  # Custom deposit if different from default
    
    # Room features and amenities
    amenities = Column(JSON, nullable=True)  # Array of amenity names
    features = Column(JSON, nullable=True)  # {area_sqft: 500, balcony: true, view: "garden"}
    
    # Media
    featured_image = Column(String(500), nullable=True)  # S3 URL
    gallery_images = Column(JSON, nullable=True)  # Array of S3 URLs
    floor_plan_image = Column(String(500), nullable=True)  # S3 URL
    
    # Availability and status
    is_active = Column(Boolean, default=True, nullable=False)
    maintenance_mode = Column(Boolean, default=False, nullable=False)
    
    # Room specifications
    bed_configuration = Column(String(100), nullable=True)  # "1 King Bed", "2 Single Beds"
    room_size_sqft = Column(Integer, nullable=True)
    max_extra_beds = Column(Integer, default=2, nullable=False)
    
    # Special requirements
    medical_equipment_compatible = Column(Boolean, default=True, nullable=False)
    wheelchair_accessible = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    bookings = relationship("Booking", back_populates="room")
    pricing_bands = relationship("PricingBand", back_populates="room")
    
    def __repr__(self):
        return f"<Room(id={self.id}, name='{self.name}', category='{self.category}')>"
    
    @property
    def is_suite(self) -> bool:
        """Determine if room is a suite for payment policy purposes.
        Suites require full payment upfront, while standard/premium/executive rooms require only deposit.
        """
        # Suite categories that require full payment upfront
        suite_labels = {
            RoomCategory.EXECUTIVE_JUNIOR_SUITE.value,
            RoomCategory.EXECUTIVE_SUITE.value,
            RoomCategory.ELEMENTAL_VILLA.value,
            RoomCategory.PEMA_SUITE.value,
        }
        if (self.category or "") in suite_labels:
            return True
        if (getattr(self, "pricing_category", None) or "") in suite_labels:
            return True
        # Generic category set to 'suite'
        if (self.category or "").strip().lower() == "suite":
            return True
        # Name-based heuristic
        name_lower = (self.name or "").lower()
        if "suite" in name_lower or "villa" in name_lower:
            return True
        return False

    @property
    def is_deposit_only(self) -> bool:
        """Determine if room requires only deposit (₹50,000) - applies to Standard, Premium, and Executive rooms"""
        # Rooms that require only deposit (not full payment)
        deposit_only_labels = {
            RoomCategory.STANDARD.value,
            RoomCategory.PREMIUM_BALCONY.value,
            RoomCategory.PREMIUM_GARDEN.value,
            RoomCategory.EXECUTIVE.value,
        }
        return (self.category or "") in deposit_only_labels
    
    @property
    def requires_full_payment(self) -> bool:
        """Check if room requires full payment upfront"""
        # Policy change: No rooms require full payment upfront.
        # All rooms now operate on a deposit basis (either 50k or 1L).
        return False

    @property
    def effective_deposit_amount(self) -> int:
        """Get effective deposit amount"""
        from app.core.config import settings
        
        # Suites that require 1 Lakh (1,00,000) deposit
        high_deposit_suites = {
            RoomCategory.EXECUTIVE_JUNIOR_SUITE.value,
            RoomCategory.GARDEN_EXECUTIVE_SUITE.value,
            RoomCategory.ELEMENTAL_VILLA.value,
            RoomCategory.PEMA_SUITE.value,
            "Junior Garden Suite", # Alias
        }
        
        # Check if room falls into high deposit category
        if (self.category in high_deposit_suites) or \
           (getattr(self, "pricing_category", None) in high_deposit_suites) or \
           (self.name in high_deposit_suites):
            return 100000
            
        # Return custom deposit amount or default (50,000)
        return self.deposit_amount or settings.DEPOSIT_AMOUNT_INR
    
    def get_price_for_occupancy(self, adults: int, children: int = 0) -> int:
        """Calculate price per night based on occupancy"""
        if adults == 1:
            base_price = self.price_per_night_single
        else:
            base_price = self.price_per_night_double
            
        # Add extra adult charges
        if adults > 2:
            base_price += (adults - 2) * self.price_per_night_extra_adult
            
        # Add child charges
        if children > 0:
            base_price += children * self.price_per_night_child
            
        return base_price
    
    def can_accommodate(self, adults: int, children: int = 0) -> bool:
        """Check if room can accommodate given occupancy"""
        total_occupants = adults + children
        return (
            adults <= self.occupancy_max_adults and
            children <= self.occupancy_max_children and
            total_occupants <= self.occupancy_max_total
        )
