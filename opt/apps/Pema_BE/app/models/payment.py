"""
Payment model for transaction management
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum
from datetime import datetime

from app.db.postgresql import Base


class PaymentStatus(str, Enum):
    INITIATED = "initiated"
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class PaymentGateway(str, Enum):
    RAZORPAY = "razorpay"
    PAYU = "payu"
    STRIPE = "stripe"
    MANUAL = "manual"  # For cash/bank transfer payments


class PaymentType(str, Enum):
    DEPOSIT = "deposit"
    PARTIAL = "partial"
    FULL = "full"
    BALANCE = "balance"
    REFUND = "refund"


class Payment(Base):
    __tablename__ = "payments"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    # Raw booking details received on payment initiation
    booking_details = Column(JSON, nullable=True)
    
    # Payment gateway details
    gateway = Column(String(20), nullable=False)  # razorpay, stripe, manual
    payment_intent_id = Column(String(255), nullable=True, index=True)  # Gateway payment ID
    payment_order_id = Column(String(255), nullable=True)  # Gateway order ID
    
    # Amount and currency
    amount = Column(Integer, nullable=False)  # Amount in INR rupees
    currency = Column(String(3), default="INR", nullable=False)
    
    # Payment details
    payment_type = Column(String(20), nullable=False)  # deposit, partial, full, balance, refund
    status = Column(String(20), default=PaymentStatus.INITIATED.value, nullable=False, index=True)
    
    # Payment method details
    payment_method = Column(String(50), nullable=True)  # card, upi, netbanking, wallet
    payment_method_details = Column(JSON, nullable=True)  # Card last 4 digits, UPI ID, etc.
    
    # Gateway response
    raw_response = Column(JSON, nullable=True)  # Complete gateway response
    gateway_fee = Column(Integer, default=0, nullable=False)  # Gateway charges
    net_amount = Column(Integer, nullable=False)  # Amount after gateway fees in rupees
    
    # Transaction tracking
    reference_number = Column(String(100), nullable=True)  # Internal reference
    order_id = Column(String(100), nullable=True, index=True)  # Single order id across multiple payments
    receipt_number = Column(String(100), nullable=True)  # Receipt number for accounting
    
    # Failure details
    failure_reason = Column(Text, nullable=True)
    failure_code = Column(String(50), nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    
    # Refund details
    refund_id = Column(String(255), nullable=True)  # Gateway refund ID
    refunded_amount = Column(Integer, default=0, nullable=False)  # Refunded amount in rupees
    refund_reason = Column(Text, nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)
    
    # Reconciliation
    reconciled = Column(Boolean, default=False, nullable=False)
    reconciled_at = Column(DateTime(timezone=True), nullable=True)
    bank_reference = Column(String(100), nullable=True)
    
    # Additional metadata
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    booking = relationship("Booking", back_populates="payments")
    user = relationship("User", back_populates="payments")
    refunds = relationship("Refund", back_populates="payment")
    
    def __repr__(self):
        return f"<Payment(id={self.id}, amount={self.amount}, status='{self.status}')>"
    
    @property
    def amount_inr(self) -> float:
        """Get amount in INR rupees"""
        return float(self.amount)
    
    @property
    def is_successful(self) -> bool:
        return self.status == PaymentStatus.SUCCESS.value
    
    @property
    def is_failed(self) -> bool:
        return self.status in [PaymentStatus.FAILED.value, PaymentStatus.CANCELLED.value]
    
    @property
    def is_refundable(self) -> bool:
        return self.is_successful and self.refunded_amount < self.amount
    
    @property
    def refundable_amount(self) -> int:
        """Get remaining refundable amount"""
        return max(0, self.amount - self.refunded_amount)
    
    def generate_reference_number(self) -> str:
        """Generate internal reference number"""
        timestamp = datetime.now().strftime("%y%m%d%H%M%S")
        return f"PW{timestamp}{self.id:04d}"


class Refund(Base):
    __tablename__ = "refunds"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, index=True)
    initiated_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Admin/system user
    
    # Refund details
    amount = Column(Integer, nullable=False)  # Refund amount in rupees
    status = Column(String(20), default="initiated", nullable=False)  # initiated, processing, completed, failed
    reason = Column(Text, nullable=False)
    
    # Gateway details
    gateway_refund_id = Column(String(255), nullable=True)
    gateway_response = Column(JSON, nullable=True)
    
    # Processing
    initiated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Failure tracking
    failure_reason = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    payment = relationship("Payment", back_populates="refunds")
    booking = relationship("Booking")
    initiator = relationship("User", foreign_keys=[initiated_by])
    
    def __repr__(self):
        return f"<Refund(id={self.id}, amount={self.amount}, status='{self.status}')>"
    
    @property
    def amount_inr(self) -> float:
        """Get refund amount in INR rupees"""
        return float(self.amount)
