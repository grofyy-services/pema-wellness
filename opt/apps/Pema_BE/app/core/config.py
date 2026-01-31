"""
Pema Wellness API Configuration
Environment-based configuration management
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn, computed_field
from typing import List, Optional, Dict
import secrets


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Pydantic Settings v2 configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",  # Ignore unrelated env vars such as SERVER_HOST
    )
    
    # Basic app config
    PROJECT_NAME: str = "Pema Wellness API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    JWT_SECRET_KEY: str = secrets.token_urlsafe(32)
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS and hosts
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://pemawellness.com", "https://dev.pemawellness.com", "https://pema-internal-dev.vercel.app"]
    # Allow all HTTPS origins by default (use regex so credentials can be allowed)
    CORS_ORIGIN_REGEX: Optional[str] = None
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Public base URL for building callbacks/redirects
    PUBLIC_BASE_URL: str = "http://localhost:8000"
    # Frontend base URL for browser redirects after payment (optional)
    FRONTEND_BASE_URL: Optional[str] = "http://pema-ebon.vercel.app"
    # Force http scheme for frontend redirects (useful for dev/non-SSL FE)
    FRONTEND_FORCE_HTTP: bool = False
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "pema_user"
    POSTGRES_PASSWORD: str = "pema_password"
    POSTGRES_DB: str = "pema_wellness"
    POSTGRES_PORT: int = 5432
    
    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    
    @computed_field
    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    # Payment Gateway (PayU Hosted)
    PAYU_MERCHANT_KEY: Optional[str] = None
    PAYU_MERCHANT_SALT: Optional[str] = None
    PAYU_SALT_256: Optional[str] = None  # Optional advanced salt/cert if provided
    PAYU_CLIENT_ID: Optional[str] = None
    PAYU_CLIENT_SECRET: Optional[str] = None
    PAYU_BASE_URL: str = "https://secure.payu.in"  # or https://test.payu.in for sandbox
    PAYU_WEBHOOK_SECRET: str = ""
    # Optional explicit return URLs; if not set, built from PUBLIC_BASE_URL
    PAYU_SURL: Optional[str] = None
    PAYU_FURL: Optional[str] = None
    # Hash mode toggle: when true, send only v1 (plain hex) in request 'hash'
    PAYU_FORCE_V1_ONLY: bool = False
    PAYU_API_ENDPOINT: str = "https://secure.payu.in/_payment"

    # Caregiver pricing (in INR)
    CAREGIVER_STAY_WITH_GUEST_PRICE_INR: int = 8000
    CAREGIVER_MEAL_PRICE_INR: int = 8000
    CAREGIVER_SEPARATE_ROOM_PRICES_INR: Dict[str, int] = {
        "Standard": 20000,
        "Premium Balcony": 25000,
        "Premium Garden": 28000,
    }

    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@pemawellness.com"
    
    # WhatsApp Integration
    WHATSAPP_API_URL: str = ""
    WHATSAPP_API_KEY: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    
    # File Storage (S3 Compatible)
    S3_ENDPOINT: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET_NAME: str = "pema-wellness"
    S3_REGION: str = "us-east-1"
    
    # IDS Integration
    IDS_BASE_URL: Optional[str] = None  # For receiving FROM IDS
    IDS_API_URL: Optional[str] = "http://139.167.29.226:81/"   # For sending TO IDS (Internal PMS API)
    IDS_HOTEL_CODE: Optional[str] = None
    IDS_API_KEY: Optional[str] = None
    IDS_API_SECRET: Optional[str] = None
    IDS_ENABLE_BACKGROUND_SYNC: bool = False
    IDS_SYNC_INTERVAL_MINUTES: int = 30
    IDS_ROOM_CODE_MAPPING: Dict[str, str] = {}
    IDS_RATE_PLAN_MAPPING: Dict[str, str] = {}

    # Business Rules
    MINIMUM_STAY_NIGHTS: int = 3
    DEPOSIT_AMOUNT_INR: int = 50000  # ₹50,000 refundable deposit
    SUITE_REQUIRES_FULL_PAYMENT: bool = False
    MAX_ADULTS_PER_ROOM: int = 2
    MAX_CHILDREN_PER_ROOM: int = 2
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 100
    
    # Celery/Background Jobs
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    LOG_LEVEL: str = "INFO"
    
    # API Keys for external services
    GOOGLE_MAPS_API_KEY: str = ""

    # Admin login: comma-separated "email:password" (e.g. "a@b.com:pass1,c@d.com:pass2")
    ADMIN_USERS: str = "siddhartha@pemawellness.com:Life@2026"

    # Email service (Google SMTP)
    GMAIL_USERNAME: Optional[str] = None
    GMAIL_APP_PASSWORD: Optional[str] = None

    # Note: Pydantic Settings v2 uses model_config above instead of Config


# Global settings instance
settings = Settings()
