"""
Logging configuration for Pema Wellness API
"""

import logging
import logging.config
import sys
from typing import Dict, Any, Optional
import json
from datetime import datetime

from app.core.config import settings


class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        
        # Add extra fields
        if hasattr(record, "user_id"):
            log_entry["user_id"] = record.user_id
        if hasattr(record, "booking_id"):
            log_entry["booking_id"] = record.booking_id
        if hasattr(record, "request_id"):
            log_entry["request_id"] = record.request_id
        if hasattr(record, "ip_address"):
            log_entry["ip_address"] = record.ip_address
        
        return json.dumps(log_entry)


def setup_logging():
    """Setup logging configuration"""
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    console_handler.setFormatter(console_formatter)
    
    # JSON handler for production
    json_handler = logging.StreamHandler(sys.stdout)
    json_handler.setFormatter(JSONFormatter())
    
    # Root logger configuration
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Add appropriate handler based on environment
    if settings.DEBUG:
        root_logger.addHandler(console_handler)
    else:
        root_logger.addHandler(json_handler)
    
    # Configure specific loggers
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("asyncio").setLevel(logging.WARNING)
    
    # Set third-party loggers to WARNING to reduce noise
    for logger_name in ["boto3", "botocore", "urllib3", "requests"]:
        logging.getLogger(logger_name).setLevel(logging.WARNING)


class AuditLogger:
    """Audit logger for tracking important business events"""
    
    def __init__(self):
        self.logger = logging.getLogger("audit")
    
    def log_user_action(
        self,
        action: str,
        user_id: int,
        details: Dict[str, Any],
        ip_address: str = None,
        user_agent: str = None
    ):
        """Log user actions for audit trail"""
        extra = {
            "user_id": user_id,
            "action": action,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "details": details
        }
        self.logger.info(f"User action: {action}", extra=extra)
    
    def log_booking_event(
        self,
        event: str,
        booking_id: int,
        user_id: int,
        details: Dict[str, Any]
    ):
        """Log booking-related events"""
        extra = {
            "booking_id": booking_id,
            "user_id": user_id,
            "event": event,
            "details": details
        }
        self.logger.info(f"Booking event: {event}", extra=extra)
    
    def log_payment_event(
        self,
        event: str,
        payment_id: int,
        booking_id: Optional[int],
        amount: int,
        details: Dict[str, Any]
    ):
        """Log payment-related events"""
        extra = {
            "payment_id": payment_id,
            "booking_id": booking_id,
            "amount": amount,
            "event": event,
            "details": details
        }
        self.logger.info(f"Payment event: {event}", extra=extra)
    
    def log_doctor_review(
        self,
        review_id: int,
        doctor_id: int,
        booking_id: int,
        status: str,
        details: Dict[str, Any]
    ):
        """Log doctor review events"""
        extra = {
            "review_id": review_id,
            "doctor_id": doctor_id,
            "booking_id": booking_id,
            "status": status,
            "details": details
        }
        self.logger.info(f"Doctor review: {status}", extra=extra)


# Global audit logger instance
audit_logger = AuditLogger()
