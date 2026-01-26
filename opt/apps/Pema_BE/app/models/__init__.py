"""
Database models package
"""

# Import all models to ensure they are registered with SQLAlchemy
from app.models.user import User
from app.models.program import Program
from app.models.room import Room
from app.models.availability import RoomAvailability
from app.models.pricing import PricingBand
from app.models.booking import Booking, BookingStatus
from app.models.payment import Payment, Refund
from app.models.medical_form import MedicalForm, DoctorReview
from app.models.cms import CmsPage, Article, PdfDownloadRequest
from app.models.notification import Notification, AuditLog, Integration
from app.models.contact import ContactUs

# Export all models
__all__ = [
    # User management
    "User",

    # Content and programs
    "Program",
    "Room",
    "RoomAvailability",
    "PricingBand",

    # Booking flow
    "Booking",
    "BookingStatus",
    "Payment",
    "Refund",

    # Medical workflow
    "MedicalForm",
    "DoctorReview",

    # CMS and content
    "CmsPage",
    "Article",
    "PdfDownloadRequest",

    # Notifications and tracking
    "Notification",
    "AuditLog",
    "Integration",
    "ContactUs",
]
