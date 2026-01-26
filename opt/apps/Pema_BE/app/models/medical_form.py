"""
Medical form and doctor review models
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

from app.db.postgresql import Base


class ReviewStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    NOT_SUITABLE = "not_suitable"
    ON_HOLD = "on_hold"


class MedicalForm(Base):
    __tablename__ = "medical_forms"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign key
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, unique=True, index=True)
    
    # Form data (JSON structure for flexibility)
    form_data = Column(JSON, nullable=False)
    """
    Example form_data structure:
    {
        "personal_info": {
            "height": "175cm",
            "weight": "70kg",
            "blood_type": "O+",
            "emergency_contact": {...}
        },
        "medical_history": {
            "chronic_conditions": ["diabetes", "hypertension"],
            "medications": [{"name": "Metformin", "dosage": "500mg", "frequency": "twice daily"}],
            "allergies": ["penicillin", "shellfish"],
            "previous_surgeries": [{"surgery": "Appendectomy", "date": "2020-01-15"}],
            "family_history": {...}
        },
        "current_health": {
            "symptoms": ["fatigue", "joint pain"],
            "pain_scale": 6,
            "mobility_issues": false,
            "dietary_restrictions": ["vegetarian"],
            "exercise_limitations": []
        },
        "wellness_goals": {
            "primary_goals": ["weight loss", "stress management"],
            "specific_concerns": "Looking to improve energy levels",
            "previous_wellness_experience": "Some yoga practice"
        },
        "consent": {
            "treatment_consent": true,
            "data_processing_consent": true,
            "photo_consent": false
        }
    }
    """
    
    # Form metadata
    form_version = Column(String(10), default="1.0", nullable=False)  # For form versioning
    is_complete = Column(Boolean, default=False, nullable=False)
    completion_percentage = Column(Integer, default=0, nullable=False)
    
    # Submission tracking
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    
    # Reminder system
    reminder_sent_count = Column(Integer, default=0, nullable=False)
    last_reminder_sent_at = Column(DateTime(timezone=True), nullable=True)
    
    # Doctor assignment
    assigned_doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_at = Column(DateTime(timezone=True), nullable=True)
    
    # Review status
    review_status = Column(String(20), default=ReviewStatus.PENDING.value, nullable=False)
    
    # Additional notes
    patient_notes = Column(Text, nullable=True)  # Patient's additional comments
    staff_notes = Column(Text, nullable=True)   # Staff internal notes
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    booking = relationship("Booking", back_populates="medical_form")
    assigned_doctor = relationship("User", foreign_keys=[assigned_doctor_id])
    # One-to-one: DoctorReview.medical_form_id is the single FK linking to MedicalForm.id
    doctor_review = relationship(
        "DoctorReview",
        back_populates="medical_form",
        uselist=False,
        primaryjoin="MedicalForm.id==DoctorReview.medical_form_id"
    )
    
    def __repr__(self):
        return f"<MedicalForm(id={self.id}, booking_id={self.booking_id}, complete={self.is_complete})>"
    
    @property
    def requires_reminder(self) -> bool:
        """Check if reminder should be sent"""
        if self.is_complete or not self.booking:
            return False
            
        # Send reminder if form not submitted within 24 hours
        hours_since_creation = (datetime.utcnow() - self.created_at).total_seconds() / 3600
        return hours_since_creation >= 24 and self.reminder_sent_count < 3
    
    def extract_medical_summary(self) -> dict:
        """Extract key medical information for doctor review"""
        data = self.form_data or {}
        
        return {
            "chronic_conditions": data.get("medical_history", {}).get("chronic_conditions", []),
            "medications": data.get("medical_history", {}).get("medications", []),
            "allergies": data.get("medical_history", {}).get("allergies", []),
            "current_symptoms": data.get("current_health", {}).get("symptoms", []),
            "pain_scale": data.get("current_health", {}).get("pain_scale"),
            "mobility_issues": data.get("current_health", {}).get("mobility_issues", False),
            "primary_goals": data.get("wellness_goals", {}).get("primary_goals", [])
        }


class DoctorReview(Base):
    __tablename__ = "doctor_reviews"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, index=True)
    medical_form_id = Column(Integer, ForeignKey("medical_forms.id"), nullable=True)
    
    # Review decision
    status = Column(String(20), nullable=False)  # confirmed, not_suitable, on_hold
    
    # Doctor's assessment
    medical_notes = Column(Text, nullable=False)  # Doctor's medical assessment
    recommendations = Column(Text, nullable=True)  # Treatment recommendations
    contraindications = Column(Text, nullable=True)  # Any contraindications noted
    
    # Program suitability
    program_suitable = Column(Boolean, nullable=True)
    alternative_program_suggestions = Column(Text, nullable=True)
    modifications_required = Column(Text, nullable=True)
    
    # Risk assessment
    risk_level = Column(String(20), nullable=True)  # low, medium, high
    special_precautions = Column(Text, nullable=True)
    monitoring_requirements = Column(Text, nullable=True)
    
    # Follow-up requirements
    requires_follow_up = Column(Boolean, default=False, nullable=False)
    follow_up_timeline = Column(String(100), nullable=True)
    follow_up_notes = Column(Text, nullable=True)
    
    # Refund handling
    refund_required = Column(Boolean, default=False, nullable=False)
    refund_amount = Column(Integer, nullable=True)  # Amount to refund in rupees
    refund_reason = Column(Text, nullable=True)
    
    # Internal tracking
    review_duration_minutes = Column(Integer, nullable=True)
    complexity_score = Column(Integer, nullable=True)  # 1-10 scale
    
    # Timestamps
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    doctor = relationship("User", back_populates="doctor_reviews")
    booking = relationship("Booking", back_populates="doctor_reviews")
    medical_form = relationship(
        "MedicalForm",
        back_populates="doctor_review",
        foreign_keys=[medical_form_id]
    )
    
    def __repr__(self):
        return f"<DoctorReview(id={self.id}, doctor_id={self.doctor_id}, status='{self.status}')>"
    
    @property
    def is_approved(self) -> bool:
        return self.status == ReviewStatus.CONFIRMED.value
    
    @property
    def is_rejected(self) -> bool:
        return self.status == ReviewStatus.NOT_SUITABLE.value
    
    @property
    def requires_refund(self) -> bool:
        return self.refund_required and self.is_rejected
