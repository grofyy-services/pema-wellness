"""
Notification and audit log models
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

from app.db.postgresql import Base


class NotificationType(str, Enum):
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    SMS = "sms"
    PUSH = "push"


class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    BOUNCED = "bounced"


class Notification(Base):
    __tablename__ = "notifications"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Notification details
    type = Column(String(20), nullable=False)  # email, whatsapp, sms, push
    template_name = Column(String(100), nullable=True)  # Template identifier
    
    # Recipient
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    recipient_email = Column(String(255), nullable=True)
    recipient_phone = Column(String(20), nullable=True)
    
    # Content
    subject = Column(String(255), nullable=True)  # For email/SMS
    message = Column(Text, nullable=False)
    message_html = Column(Text, nullable=True)  # HTML version for email
    
    # Template data
    template_data = Column(JSON, nullable=True)  # Data used to render template
    
    # Status and delivery
    status = Column(String(20), default=NotificationStatus.PENDING.value, nullable=False, index=True)
    attempts = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=3, nullable=False)
    
    # External service tracking
    external_id = Column(String(255), nullable=True)  # Provider message ID
    provider_response = Column(JSON, nullable=True)  # Full provider response
    
    # Scheduling
    send_at = Column(DateTime(timezone=True), nullable=True)  # Scheduled send time
    sent_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Error tracking
    error_message = Column(Text, nullable=True)
    last_attempted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Context
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True, index=True)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    recipient = relationship("User", foreign_keys=[recipient_id])
    booking = relationship("Booking", foreign_keys=[booking_id])
    payment = relationship("Payment", foreign_keys=[payment_id])
    
    def __repr__(self):
        return f"<Notification(id={self.id}, type='{self.type}', status='{self.status}')>"
    
    @property
    def is_deliverable(self) -> bool:
        """Check if notification can be delivered"""
        return (
            self.status in [NotificationStatus.PENDING.value, NotificationStatus.FAILED.value] and
            self.attempts < self.max_attempts
        )
    
    @property
    def should_retry(self) -> bool:
        """Check if notification should be retried"""
        return self.status == NotificationStatus.FAILED.value and self.attempts < self.max_attempts


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # User and action
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    entity_type = Column(String(50), nullable=True)  # booking, payment, user, etc.
    entity_id = Column(Integer, nullable=True)
    
    # Request details
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    request_id = Column(String(100), nullable=True)
    
    # Change details
    old_values = Column(JSON, nullable=True)  # Previous state
    new_values = Column(JSON, nullable=True)  # New state
    changes = Column(JSON, nullable=True)     # Specific fields changed
    
    # Additional context
    details = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Classification
    severity = Column(String(20), default="info", nullable=False)  # info, warning, error, critical
    category = Column(String(50), nullable=True)  # authentication, booking, payment, etc.
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, action='{self.action}', user_id={self.user_id})>"


class Integration(Base):
    __tablename__ = "integrations"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Integration details
    type = Column(String(50), nullable=False)  # whatsapp, zoho, email, etc.
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    
    # Configuration
    config = Column(JSON, nullable=False)  # Integration-specific configuration
    credentials = Column(JSON, nullable=True)  # Encrypted credentials
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    last_status = Column(String(20), default="unknown", nullable=False)
    last_error = Column(Text, nullable=True)
    
    # Webhook configuration
    webhook_url = Column(String(500), nullable=True)
    webhook_secret = Column(String(255), nullable=True)
    
    # Health monitoring
    last_health_check = Column(DateTime(timezone=True), nullable=True)
    health_check_interval = Column(Integer, default=300, nullable=False)  # seconds
    
    # Usage tracking
    request_count = Column(Integer, default=0, nullable=False)
    error_count = Column(Integer, default=0, nullable=False)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Integration(id={self.id}, type='{self.type}', name='{self.name}')>"
    
    @property
    def is_healthy(self) -> bool:
        """Check if integration is healthy"""
        return self.is_active and self.last_status == "ok"
