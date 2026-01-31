"""
Payment schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List, Union
from datetime import datetime, date
import json
from enum import Enum

from app.models.payment import PaymentStatus, PaymentGateway, PaymentType


class PaymentMethod(str, Enum):
    """Optional hint for preferred method. Ignored for PayU Hosted Checkout."""
    CARD = "card"
    UPI = "upi"
    NETBANKING = "netbanking"
    WALLET = "wallet"


# Payment initiation
class PaymentInitiateRequest(BaseModel):
    payment_type: PaymentType = Field(..., description="Type of payment: deposit, partial, full, balance")
    amount: int = Field(..., gt=0, description="Amount in rupees (required)")
    booking_id: Optional[int] = Field(None, description="Optional booking ID to associate this payment with")
    payment_method: Optional[PaymentMethod] = Field(
        None,
        description="Optional hint for method (card, upi, netbanking, wallet). Ignored for PayU Hosted"
    )
    notes: Optional[str] = Field(None, max_length=500)
    # Guest verification (no-login flow)
    guest_first_name: Optional[str] = Field(None, description="Guest first name")
    guest_email: Optional[str] = Field(None, description="Guest email for verification when not logged in")
    guest_phone: Optional[str] = Field(None, description="Guest phone for verification when not logged in")

    # Booking details required for IDS booking creation post-payment
    check_in_date: Optional[date] = Field(None, description="Check-in date")
    check_out_date: Optional[date] = Field(None, description="Check-out date")
    room_category: Optional[str] = Field(None, description="Room category or code")
    occupancy_details: Optional[Dict[str, int]] = Field(None, description="{'adults': 2, 'children': 1}")
    
    # IDS specific details
    ids_room_code: Optional[str] = Field(None, description="IDS room code (e.g., STD, DLX)")
    ids_rate_plan_code: Optional[str] = Field(None, description="IDS rate plan code (e.g., RR0925)")
    ids_guest_last_name: Optional[str] = Field(None, description="Guest last name for IDS")
    ids_other_guests: Optional[Union[List[str], str]] = Field(None, description="List of additional guest names for IDS (list or comma-separated string)")
    ids_special_requests: Optional[str] = Field(None, description="Special requests for IDS")
    
    # Estimate data
    estimate_response: Optional[Union[Dict[str, Any], str]] = Field(None, description="Full estimate response to store (dict or JSON string)")
    
    @validator('ids_other_guests')
    def validate_ids_other_guests(cls, v):
        if isinstance(v, str):
            return [name.strip() for name in v.split(",") if name.strip()]
        return v

    @validator('estimate_response')
    def validate_estimate_response(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Return as is or empty dict if invalid? Better to raise error or return simple wrapper
                # For now, try to wrap if it looks like a string message, or fail
                raise ValueError("estimate_response must be a valid JSON object or JSON string")
        return v

    # Optional frontend return URL for PayU browser redirect (we append txnid)
    return_url: Optional[str] = Field(
        None,
        max_length=2048,
        description="Optional absolute URL to return to after payment; if set, PayU will redirect the browser here with txnid added as a query param"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "amount": 50000,
                    "payment_type": "deposit",
                    "return_url": "https://your-frontend.example.com/payment/return",
                    "payment_method": "card",
                    "notes": "Initial 50% deposit",
                    "guest_email": "guest@example.com",
                    "guest_phone": "9999999999"
                }
            ]
        }
    }


class PaymentInitiateResponse(BaseModel):
    payment_id: int
    payment_order_id: str
    order_id: Optional[str] = None
    amount: int
    currency: str = "INR"
    gateway: PaymentGateway
    
    # Gateway-specific data
    gateway_order_id: str
    gateway_key: str
    
    # For frontend integration
    checkout_url: Optional[str] = None  # For redirect flow
    payment_options: Dict[str, Any] = {}  # For hosted form POST to PayU


# Payment status update (webhook)
class PaymentWebhookData(BaseModel):
    gateway: PaymentGateway
    event_type: str
    payment_id: str
    order_id: str
    status: str
    amount: int
    currency: str
    signature: str
    raw_data: Dict[str, Any]


# Payment response
class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: int
    currency: str
    payment_type: PaymentType
    status: PaymentStatus
    gateway: PaymentGateway
    
    # Gateway details
    payment_intent_id: Optional[str]
    payment_order_id: Optional[str]
    order_id: Optional[str]
    payment_method: Optional[PaymentMethod]
    payment_method_details: Optional[Dict[str, Any]]
    
    # Amounts
    gateway_fee: int
    net_amount: int
    
    # Status
    reference_number: Optional[str]
    failure_reason: Optional[str]
    
    # Timestamps
    created_at: datetime
    completed_at: Optional[datetime]
    
    # Refund info
    refunded_amount: int
    refundable_amount: int
    
    class Config:
        from_attributes = True


class PaymentListResponse(BaseModel):
    id: int
    booking_id: int
    amount: int
    payment_type: PaymentType
    status: PaymentStatus
    gateway: PaymentGateway
    reference_number: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Refund processing
class RefundRequest(BaseModel):
    payment_id: int = Field(..., gt=0)
    amount: Optional[int] = Field(None, gt=0, description="Amount to refund in paise (full refund if not specified)")
    reason: str = Field(..., max_length=500, description="Reason for refund")
    notes: Optional[str] = Field(None, max_length=1000)


class RefundResponse(BaseModel):
    id: int
    payment_id: int
    booking_id: int
    amount: int
    status: str
    reason: str
    
    # Gateway details
    gateway_refund_id: Optional[str]
    
    # Timestamps
    initiated_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Payment verification
class PaymentVerifyRequest(BaseModel):
    payment_id: int = Field(..., gt=0)
    razorpay_payment_id: str = Field(..., min_length=1)
    razorpay_order_id: str = Field(..., min_length=1)
    razorpay_signature: str = Field(..., min_length=1)


# Payment filters for listing
class PaymentFilters(BaseModel):
    booking_id: Optional[int] = None
    status: Optional[PaymentStatus] = None
    gateway: Optional[PaymentGateway] = None
    payment_type: Optional[PaymentType] = None
    amount_min: Optional[int] = Field(None, gt=0)
    amount_max: Optional[int] = Field(None, gt=0)
    created_from: Optional[datetime] = None
    created_to: Optional[datetime] = None
    
    # Pagination
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)


# Manual payment entry (for admin)
class ManualPaymentRequest(BaseModel):
    booking_id: int = Field(..., gt=0)
    amount: int = Field(..., gt=0)
    payment_type: PaymentType
    payment_method: str = Field(..., max_length=50)
    reference_number: str = Field(..., max_length=100)
    notes: Optional[str] = Field(None, max_length=1000)
    received_at: Optional[datetime] = None


# Payment summary for booking
class PaymentSummary(BaseModel):
    total_amount: int
    paid_amount: int
    pending_amount: int
    refunded_amount: int
    
    # Payment breakdown
    deposit_paid: int
    partial_payments: int
    balance_paid: int
    
    # Status
    fully_paid: bool
    requires_payment: bool
    next_payment_due: Optional[int]
    
    # Recent payments
    recent_payments: List[PaymentListResponse] = []


# Invoice generation
class InvoiceRequest(BaseModel):
    booking_id: int = Field(..., gt=0)
    include_payments: bool = True
    include_refunds: bool = True


class InvoiceResponse(BaseModel):
    invoice_number: str
    booking_id: int
    amount: int
    issued_at: datetime
    due_date: Optional[datetime]
    pdf_url: str
    
    # Line items
    line_items: List[Dict[str, Any]]
    taxes: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True

class AdminPaymentListResponse(BaseModel):
    id: int
    booking_id: Optional[int] = None
    amount: int
    payment_type: PaymentType
    status: PaymentStatus
    gateway: PaymentGateway
    reference_number: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminPaymentListPaginatedResponse(BaseModel):
    """Admin payments list with total for pagination."""
    items: List[AdminPaymentListResponse]
    total: int
    page: int
    limit: int


class AdminPaymentDetailResponse(BaseModel):
    """Full payment detail for admin (booking_id may be null)."""
    id: int
    booking_id: Optional[int] = None
    amount: int
    currency: str
    payment_type: PaymentType
    status: PaymentStatus
    gateway: PaymentGateway
    payment_intent_id: Optional[str] = None
    payment_order_id: Optional[str] = None
    order_id: Optional[str] = None
    payment_method: Optional[str] = None
    payment_method_details: Optional[Dict[str, Any]] = None
    gateway_fee: int = 0
    net_amount: int = 0
    reference_number: Optional[str] = None
    failure_reason: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    refunded_amount: int = 0
    refundable_amount: int = 0
    raw_response: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True