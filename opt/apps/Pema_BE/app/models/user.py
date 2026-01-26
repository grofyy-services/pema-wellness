"""
User model for authentication and profile management
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Optional

from app.db.postgresql import Base


class User(Base):
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic info
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    
    # Authentication
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # Profile details
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(String(20), nullable=True)
    emergency_contact_name = Column(String(255), nullable=True)
    emergency_contact_phone = Column(String(20), nullable=True)
    medical_conditions = Column(Text, nullable=True)
    dietary_restrictions = Column(Text, nullable=True)
    
    # Address
    address_line1 = Column(String(255), nullable=True)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(100), default="India", nullable=True)
    
    # Preferences
    communication_preferences = Column(JSON, nullable=True)  # email, whatsapp, sms
    marketing_consent = Column(Boolean, default=False, nullable=False)
    
    # OAuth data
    oauth_provider = Column(String(50), nullable=True)  # google, apple
    oauth_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    bookings = relationship("Booking", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    doctor_reviews = relationship("DoctorReview", back_populates="doctor", foreign_keys="DoctorReview.doctor_id")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
    
    @property
    def is_doctor(self) -> bool:
        return self.role == "doctor"
    
    @property
    def is_admin(self) -> bool:
        return self.role == "admin"
    
    @property
    def is_staff(self) -> bool:
        return self.role in ["staff", "admin"]
    
    @property
    def full_address(self) -> Optional[str]:
        """Get formatted full address"""
        address_parts = [
            self.address_line1,
            self.address_line2,
            self.city,
            self.state,
            self.postal_code,
            self.country
        ]
        return ", ".join(filter(None, address_parts)) if any(address_parts) else None
