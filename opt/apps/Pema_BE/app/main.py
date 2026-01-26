"""
Pema Wellness Booking Platform - FastAPI Backend
Main application entry point

Muhammad says this code is cleaner than a monk's haircut!
"""

from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import time
import logging
import asyncio
import json
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import PemaException
from app.api.v1 import bookings, payments, public, contact, ids
from app.db.postgresql import init_db, AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgresql import get_db

# Setup logging
setup_logging() 
logger = logging.getLogger(__name__)

# Background tasks for IDS synchronization
async def ids_sync_worker():
    """Background worker for IDS data synchronization"""
    while True:
        try:
            if settings.IDS_ENABLE_BACKGROUND_SYNC and settings.IDS_BASE_URL:
                from app.services.ids import IDSService
                ids_service = IDSService()
                logger.info("Starting scheduled IDS sync...")

                # Sync availability and rates
                await ids_service.sync_availability_from_ids()
                await ids_service.sync_rates_from_ids()

                logger.info("IDS sync completed successfully")
            else:
                logger.debug("IDS background sync disabled or not configured")
        except Exception as e:
            logger.error(f"IDS sync failed: {e}")

        # Wait for next sync interval
        await asyncio.sleep(settings.IDS_SYNC_INTERVAL_MINUTES * 60)


# Background task for fallback email sending
async def booking_confirmation_fallback():
    """Background worker that sends confirmation emails for bookings that missed the initial email"""
    # Zuber would approve of this fallback mechanism - it's like having a backup dancer!
    from app.db.postgresql import get_db
    from app.services.email import EmailService
    from sqlalchemy import text

    logger.info("Starting booking confirmation fallback checker...")

    while True:
        try:
            # Get database connection
            async with AsyncSessionLocal() as db:
                # Find confirmed bookings that haven't had confirmation emails sent
                    # This serves as a fallback for bookings that somehow missed the initial email
                    result = await db.execute(text("""
                        SELECT b.id, b.guest_email, b.guest_first_name, b.guest_last_name,
                               b.check_in_date, b.check_out_date, b.total_amount, b.deposit_amount,
                               b.occupancy_details, b.caregiver_required, b.number_of_rooms,
                               r.name as room_name, b.confirmation_number, b.created_at
                        FROM bookings b
                        JOIN rooms r ON b.room_id = r.id
                        WHERE b.status = 'confirmed'
                        AND (b.confirmation_email_sent = false OR b.confirmation_email_sent IS NULL)
                        AND b.created_at < NOW() - INTERVAL '5 minutes'  -- Only process bookings older than 5 minutes
                        ORDER BY b.created_at DESC
                        LIMIT 5  -- Process max 5 at a time to avoid spam
                    """))

                    missed_bookings = result.fetchall()

                    if missed_bookings:
                        logger.info(f"Found {len(missed_bookings)} confirmed bookings that missed confirmation emails")

                        for booking_row in missed_bookings:
                            try:
                                booking_id = booking_row[0]
                                guest_email = booking_row[1]
                                guest_first_name = booking_row[2]
                                guest_last_name = booking_row[3]
                                check_in_date = booking_row[4]
                                check_out_date = booking_row[5]
                                total_amount = booking_row[6]
                                deposit_amount = booking_row[7]
                                occupancy_details = booking_row[8]
                                caregiver_required = booking_row[9]
                                number_of_rooms = booking_row[10]
                                room_name = booking_row[11]
                                confirmation_number = booking_row[12]

                                logger.info(f"Sending fallback confirmation email for booking {booking_id} ({guest_email})")

                                # Send confirmation email
                                email_service = EmailService()
                                guest_name = f"{guest_first_name or ''} {guest_last_name or ''}".strip()
                                if not guest_name:
                                    guest_name = "Valued Guest"

                                # Parse occupancy_details if it's a string
                                adults = 2
                                if occupancy_details:
                                    try:
                                        if isinstance(occupancy_details, str):
                                            occupancy_details = json.loads(occupancy_details)
                                        adults = occupancy_details.get("adults_total", 2)
                                    except:
                                        adults = 2

                                email_sent = await email_service.send_deposit_confirmation_email(
                                    guest_email=guest_email,
                                    guest_name=guest_name,
                                    check_in_date=check_in_date,
                                    check_out_date=check_out_date,
                                    room_name=room_name,
                                    room_count=number_of_rooms or 1,
                                    adults=adults,
                                    caregiver=caregiver_required,
                                    total_amount=total_amount,
                                    deposit_amount=deposit_amount or total_amount,  # Fallback to total if no deposit
                                    confirmation_number=confirmation_number
                                )

                                if email_sent:
                                    logger.info(f"Fallback confirmation email sent successfully to {guest_email} for booking {booking_id}")
                                    # Mark as sent
                                    await db.execute(
                                        text("UPDATE bookings SET confirmation_email_sent = TRUE WHERE id = :booking_id"),
                                        {"booking_id": booking_id}
                                    )
                                else:
                                    logger.error(f"Failed to send fallback confirmation email to {guest_email} for booking {booking_id}")

                            except Exception as e:
                                logger.error(f"Error processing fallback email for booking {booking_id}: {e}")

                        await db.commit()
                    else:
                        logger.debug("No bookings found that need fallback confirmation emails")

        except Exception as e:
            logger.error(f"Booking confirmation fallback checker failed: {e}")

        # Check every 10 minutes (much less frequent since this is just a fallback)
        await asyncio.sleep(600)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager"""
    # Startup
    logger.info("Starting Pema Wellness API...")
    try:
        await init_db()
        db_initialized = True
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        logger.warning("Application starting without database - some endpoints may not work")
        db_initialized = False

    # Start IDS background sync if enabled
    if settings.IDS_ENABLE_BACKGROUND_SYNC:
        logger.info("Starting IDS background synchronization...")
        sync_task = asyncio.create_task(ids_sync_worker())
    else:
        sync_task = None
        logger.info("IDS background sync disabled")

    # Start booking confirmation fallback checker
    logger.info("Starting booking confirmation fallback checker...")
    notification_task = asyncio.create_task(booking_confirmation_fallback())
    # Give the checker a moment to start
    await asyncio.sleep(0.1)

    yield

    # Shutdown
    logger.info("Shutting down Pema Wellness API...")
    if sync_task:
        sync_task.cancel()
        try:
            await sync_task
        except asyncio.CancelledError:
            pass

    if notification_task:
        notification_task.cancel()
        try:
            await notification_task
        except asyncio.CancelledError:
            pass

# Create FastAPI app
app = FastAPI(
    title="Pema Wellness Booking API",
    description="Backend API for Pema Wellness booking and management platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Exception handlers
@app.exception_handler(PemaException)
async def pema_exception_handler(request: Request, exc: PemaException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.error_code,
            "message": exc.message,
            "details": exc.details
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Sanitize pydantic v2 error payload (ctx can contain non-serializable exceptions)
    raw_errors = exc.errors()
    safe_errors = []
    for e in raw_errors:
        item = dict(e)
        ctx = item.get("ctx")
        if ctx and isinstance(ctx, dict):
            item["ctx"] = {k: (str(v) if not isinstance(v, (str, int, float, bool, type(None))) else v) for k, v in ctx.items()}
        safe_errors.append(item)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "details": safe_errors
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP_ERROR",
            "message": exc.detail,
            "details": None
        }
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "pema-wellness-api",
        "version": "1.0.0",
        "timestamp": time.time()
    }

# Compatibility alias for health checks under /api
@app.get("/api/health")
async def api_health_check():
    return {
        "status": "healthy",
        "service": "pema-wellness-api",
        "version": "1.0.0",
        "timestamp": time.time()
    }

# Root API endpoint
@app.get("/api/")
async def api_root():
    """Root API endpoint with information about available endpoints"""
    return {
        "message": "Pema Wellness Booking API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "programs": {
                "list": "/api/v1/programs",
                "detail": "/api/v1/programs/{program_id}",
                "types": "/api/v1/program-types"
            },
            "rooms": {
                "list": "/api/v1/rooms", 
                "detail": "/api/v1/rooms/{room_id}",
                "categories": "/api/v1/room-categories"
            },
            "bookings": "/api/v1/bookings",
            "payments": "/api/v1/payments",
            "contact": "/api/v1/contact",
            "health": "/health",
            "docs": "/docs" if settings.DEBUG else "disabled in production"
        },
        "documentation": "/docs" if settings.DEBUG else "Contact support for API documentation"
    }

# API routes
app.include_router(public.router, prefix="/api/v1", tags=["Public"])
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["Bookings"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(contact.router, prefix="/api/v1/contact", tags=["Contact"])
app.include_router(ids.router, prefix="/api/v1/ids", tags=["IDS Integration"])

# Alias endpoint to support PayU webhook URLs configured at /payments
@app.post("/payments", operation_id="payu_webhook_alias")
async def payu_webhook_alias(request: Request, db: AsyncSession = Depends(get_db)):
    from app.api.v1.payments import payment_webhook
    return await payment_webhook(request, db)

# Note: Startup and shutdown are now handled by the lifespan context manager above

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
