"""
Booking model for reservation management

Zuber thinks booking models are like puzzles - they fit perfectly until the last piece!
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime, date
from enum import Enum
from typing import Optional

from app.db.postgresql import Base


class BookingStatus(str, Enum):
    INITIATED = "initiated"
    PENDING_MEDICAL = "pending_medical"
    DOCTOR_APPROVED = "doctor_approved" 
    RESERVED = "reserved"
    CONFIRMED = "confirmed"
    ON_HOLD = "on_hold"
    NOT_SUITABLE = "not_suitable"
    CANCELLED = "cancelled"
    CHECKED_IN = "checked_in"
    COMPLETED = "completed"


class Booking(Base):
    __tablename__ = "bookings"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False, index=True)
    
    # Booking dates
    check_in_date = Column(Date, nullable=False, index=True)
    check_out_date = Column(Date, nullable=False, index=True)
    nights = Column(Integer, nullable=False)
    
    # Occupancy details
    occupancy_details = Column(JSON, nullable=False)  # {adults: 2, children: 1, children_ages: [8], caregiver_required: false}
    
    # Status and workflow
    status = Column(String(20), default=BookingStatus.INITIATED.value, nullable=False, index=True)
    
    # Pricing and payments
    total_amount = Column(Integer, nullable=False)  # Total amount in INR rupees
    deposit_amount = Column(Integer, nullable=False)  # Required deposit amount in rupees
    paid_amount = Column(Integer, default=0, nullable=False)  # Amount paid so far in rupees
    balance_amount = Column(Integer, nullable=False)  # Remaining balance in rupees
    
    # Business rules tracking
    minimum_stay_enforced = Column(Boolean, default=True, nullable=False)
    full_payment_required = Column(Boolean, default=False, nullable=False)  # For suites
    
    # Additional booking details
    special_requests = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)  # Staff notes
    guest_notes = Column(Text, nullable=True)  # Guest provided notes
    estimate_details = Column(JSON, nullable=True)  # Store full estimate response

    # Guest contact (for guest checkout without login)
    guest_first_name = Column(String(100), nullable=True)
    guest_last_name = Column(String(100), nullable=True)
    guest_email = Column(String(255), nullable=True, index=True)
    guest_phone = Column(String(20), nullable=True)
    guest_country = Column(String(100), nullable=True)
    other_guests = Column(JSON, nullable=True)  # List of additional guest names
    number_of_rooms = Column(Integer, default=1, nullable=False)

    # Caregiver options
    caregiver_required = Column(Boolean, default=False, nullable=False)
    caregiver_stay_with_guest = Column(Boolean, default=False, nullable=False)
    caregiver_meal = Column(String(50), nullable=True)  # simple | restaurant_dining
    private_transfer = Column(Boolean, default=False, nullable=False)
    
    # Confirmation and check-in
    confirmation_number = Column(String(20), unique=True, nullable=True, index=True)
    ids_booking_reference = Column(String(50), nullable=True, index=True)  # Reference from IDS system
    invoice_id = Column(String(50), nullable=True)
    
    # Check-in/out tracking
    actual_check_in_date = Column(Date, nullable=True)
    actual_check_out_date = Column(Date, nullable=True)
    early_checkout = Column(Boolean, default=False, nullable=False)
    late_checkout = Column(Boolean, default=False, nullable=False)
    
    # Cancellation
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    refund_amount = Column(Integer, default=0, nullable=False)  # Refund amount in rupees
    
    # Medical form and approval workflow
    medical_form_submitted = Column(Boolean, default=False, nullable=False)
    medical_form_submitted_at = Column(DateTime(timezone=True), nullable=True)
    doctor_review_required = Column(Boolean, default=True, nullable=False)
    doctor_reviewed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Communication tracking
    reminder_emails_sent = Column(Integer, default=0, nullable=False)
    last_reminder_sent_at = Column(DateTime(timezone=True), nullable=True)
    whatsapp_notifications_sent = Column(Integer, default=0, nullable=False)
    confirmation_email_sent = Column(Boolean, default=False, nullable=False)
    
    # Emergency contact for this booking
    emergency_contact_name = Column(String(255), nullable=True)
    emergency_contact_phone = Column(String(20), nullable=True)
    emergency_contact_relation = Column(String(50), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="bookings")
    program = relationship("Program", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking")
    medical_form = relationship("MedicalForm", back_populates="booking", uselist=False)
    doctor_reviews = relationship("DoctorReview", back_populates="booking")
    
    def __repr__(self):
        return f"<Booking(id={self.id}, user_id={self.user_id}, status='{self.status}')>"
    
    @property
    def is_confirmed(self) -> bool:
        return self.status in [BookingStatus.CONFIRMED.value, BookingStatus.CHECKED_IN.value, BookingStatus.COMPLETED.value]
    
    @property
    def is_cancelled(self) -> bool:
        return self.status in [BookingStatus.CANCELLED.value, BookingStatus.NOT_SUITABLE.value]
    
    @property
    def requires_medical_form(self) -> bool:
        # Medical form required for all bookings at this stage
        return not self.medical_form_submitted
    
    @property
    def requires_doctor_approval(self) -> bool:
        return self.doctor_review_required and self.status == BookingStatus.PENDING_MEDICAL.value
    
    @property
    def is_overdue_medical_form(self) -> bool:
        """Check if medical form submission is overdue (24 hours after payment)"""
        if self.medical_form_submitted or not self.requires_medical_form:
            return False
            
        # Check if payment was made more than 24 hours ago
        latest_payment = max(
            (p for p in self.payments if p.status == "success"),
            key=lambda p: p.created_at,
            default=None
        )
        
        if latest_payment:
            hours_since_payment = (datetime.utcnow() - latest_payment.created_at).total_seconds() / 3600
            return hours_since_payment > 24
            
        return False
    
    @property
    def adults_count(self) -> int:
        return self.occupancy_details.get("adults", 0)
    
    @property
    def children_count(self) -> int:
        return self.occupancy_details.get("children", 0)
    
    @property
    def total_guests(self) -> int:
        return self.adults_count + self.children_count
    
    @property
    def outstanding_balance(self) -> int:
        """Calculate remaining balance to be paid"""
        return max(0, self.total_amount - self.paid_amount)
    
    def can_check_in(self) -> bool:
        """Check if booking is ready for check-in"""
        return (
            self.status == BookingStatus.CONFIRMED.value and
            self.check_in_date <= date.today() and
            self.outstanding_balance == 0
        )
    
    def generate_confirmation_number(self) -> str:
        """Generate unique confirmation number"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%y%m%d")
        return f"PW{timestamp}{self.id:04d}"
