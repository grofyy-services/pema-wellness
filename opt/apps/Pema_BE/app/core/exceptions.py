"""
Custom exceptions for Pema Wellness API
"""

from typing import Optional, Any


class PemaException(Exception):
    """Base exception for Pema Wellness API"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 400,
        error_code: str = "PEMA_ERROR",
        details: Optional[Any] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details
        super().__init__(self.message)


class AuthenticationError(PemaException):
    """Authentication related errors"""
    
    def __init__(self, message: str = "Authentication failed", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=401,
            error_code="AUTHENTICATION_ERROR",
            details=details
        )


class AuthorizationError(PemaException):
    """Authorization related errors"""
    
    def __init__(self, message: str = "Insufficient permissions", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=403,
            error_code="AUTHORIZATION_ERROR",
            details=details
        )


class ValidationError(PemaException):
    """Validation related errors"""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
            details=details
        )


class NotFoundError(PemaException):
    """Resource not found errors"""
    
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND",
            details=details
        )


class ConflictError(PemaException):
    """Resource conflict errors"""
    
    def __init__(self, message: str = "Resource conflict", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT_ERROR",
            details=details
        )


class BookingError(PemaException):
    """Booking related errors"""
    
    def __init__(self, message: str, error_code: str = "BOOKING_ERROR", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code=error_code,
            details=details
        )


class MinimumStayError(BookingError):
    """Minimum stay requirement not met"""
    
    def __init__(self, required_nights: int, provided_nights: int):
        super().__init__(
            message=f"Minimum stay of {required_nights} nights required. Provided: {provided_nights} nights",
            error_code="MINIMUM_STAY_ERROR",
            details={"required_nights": required_nights, "provided_nights": provided_nights}
        )


class OccupancyError(BookingError):
    """Room occupancy limit exceeded"""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            error_code="OCCUPANCY_ERROR",
            details=details
        )


class PaymentError(PemaException):
    """Payment related errors"""
    
    def __init__(self, message: str, error_code: str = "PAYMENT_ERROR", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code=error_code,
            details=details
        )


class PaymentProcessingError(PaymentError):
    """Payment processing failed"""
    
    def __init__(self, message: str = "Payment processing failed", details: Optional[Any] = None):
        super().__init__(
            message=message,
            error_code="PAYMENT_PROCESSING_ERROR",
            details=details
        )


class RefundError(PaymentError):
    """Refund processing errors"""
    
    def __init__(self, message: str = "Refund processing failed", details: Optional[Any] = None):
        super().__init__(
            message=message,
            error_code="REFUND_ERROR",
            details=details
        )


class MedicalFormError(PemaException):
    """Medical form related errors"""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="MEDICAL_FORM_ERROR",
            details=details
        )


class DoctorReviewError(PemaException):
    """Doctor review related errors"""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="DOCTOR_REVIEW_ERROR",
            details=details
        )


class ExternalServiceError(PemaException):
    """External service integration errors"""
    
    def __init__(self, service_name: str, message: str, details: Optional[Any] = None):
        super().__init__(
            message=f"{service_name} service error: {message}",
            status_code=502,
            error_code="EXTERNAL_SERVICE_ERROR",
            details={"service": service_name, "details": details}
        )


class RateLimitError(PemaException):
    """Rate limiting errors"""
    
    def __init__(self, message: str = "Rate limit exceeded", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_ERROR",
            details=details
        )
