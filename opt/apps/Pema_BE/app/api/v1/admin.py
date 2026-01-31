"""
Admin API endpoints - list bookings and payments for admin UI.
Protected by admin login (email/password from config, JWT token).
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.db.postgresql import get_db
from app.models import Booking, Payment
from app.schemas.booking import (
    AdminBookingListResponse,
    AdminBookingListPaginatedResponse,
    BookingResponse,
)
from app.schemas.payment import (
    AdminPaymentListResponse,
    AdminPaymentListPaginatedResponse,
    AdminPaymentDetailResponse,
)

router = APIRouter()
security = HTTPBearer(auto_error=False)


def _parse_admin_users() -> list[tuple[str, str]]:
    """Parse ADMIN_USERS env (comma-separated 'email:password') into list of (email, password)."""
    pairs: list[tuple[str, str]] = []
    for part in (settings.ADMIN_USERS or "").strip().split(","):
        part = part.strip()
        if ":" in part:
            email, _, password = part.partition(":")
            email, password = email.strip(), password.strip()
            if email and password:
                pairs.append((email, password))
    return pairs


def _check_admin_credentials(email: str, password: str) -> bool:
    users = _parse_admin_users()
    return any(e == email and p == password for e, p in users)


def _create_admin_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    payload = {"sub": email, "exp": expire, "scope": "admin"}
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def _verify_admin_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        if payload.get("scope") != "admin":
            return None
        return payload.get("sub")
    except JWTError:
        return None


async def require_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    """Restrict admin APIs to requests with a valid admin JWT. Wrong or missing credentials → 401."""
    if not credentials or credentials.credentials is None:
        raise HTTPException(status_code=401, detail="You are not an authorised admin user. Please sign in with admin credentials.")
    email = _verify_admin_token(credentials.credentials)
    if not email:
        raise HTTPException(status_code=401, detail="You are not an authorised admin user. Please sign in with admin credentials.")
    return email


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    email: str


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(body: AdminLoginRequest):
    """Validate email/password against ADMIN_USERS. Only authorised admin users receive a token; all other admin endpoints require this token."""
    if not _check_admin_credentials(body.email, body.password):
        raise HTTPException(status_code=401, detail="You are not an authorised admin user. Only admin users can sign in here.")
    token = _create_admin_token(body.email)
    return AdminLoginResponse(token=token, email=body.email)


@router.get("/bookings", response_model=AdminBookingListPaginatedResponse)
async def admin_list_bookings(
    _: str = Depends(require_admin),
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """List all bookings for admin with basic + guest info (no guest verification)."""
    count_stmt = select(func.count()).select_from(Booking)
    if status:
        count_stmt = count_stmt.where(Booking.status == status)
    total_result = await db.execute(count_stmt)
    total = total_result.scalar() or 0
    stmt = select(Booking)
    if status:
        stmt = stmt.where(Booking.status == status)
    stmt = stmt.options(selectinload(Booking.program), selectinload(Booking.room))
    offset = (page - 1) * limit
    stmt = stmt.offset(offset).limit(limit).order_by(Booking.created_at.desc())
    result = await db.execute(stmt)
    bookings = result.scalars().all()
    items = [
        AdminBookingListResponse(
            id=b.id,
            confirmation_number=b.confirmation_number,
            status=b.status,
            program_title=b.program.title if b.program else None,
            room_name=b.room.name,
            check_in_date=b.check_in_date,
            check_out_date=b.check_out_date,
            total_amount=b.total_amount,
            paid_amount=b.paid_amount,
            created_at=b.created_at,
            guest_first_name=b.guest_first_name,
            guest_last_name=b.guest_last_name,
            guest_email=b.guest_email,
            guest_phone=b.guest_phone,
        )
        for b in bookings
    ]
    return AdminBookingListPaginatedResponse(items=items, total=total, page=page, limit=limit)


@router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def admin_get_booking(
    booking_id: int,
    _: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Full booking details for admin (no guest verification)."""
    stmt = (
        select(Booking)
        .where(Booking.id == booking_id)
        .options(selectinload(Booking.program), selectinload(Booking.room))
    )
    result = await db.execute(stmt)
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingResponse.model_validate(booking)


@router.get("/payments", response_model=AdminPaymentListPaginatedResponse)
async def admin_list_payments(
    _: str = Depends(require_admin),
    status: Optional[str] = None,
    booking_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """List all payments for admin (no guest verification)."""
    count_stmt = select(func.count()).select_from(Payment)
    if status:
        count_stmt = count_stmt.where(Payment.status == status)
    if booking_id is not None:
        count_stmt = count_stmt.where(Payment.booking_id == booking_id)
    total_result = await db.execute(count_stmt)
    total = total_result.scalar() or 0
    stmt = select(Payment)
    if status:
        stmt = stmt.where(Payment.status == status)
    if booking_id is not None:
        stmt = stmt.where(Payment.booking_id == booking_id)
    stmt = stmt.offset((page - 1) * limit).limit(limit).order_by(Payment.created_at.desc())
    result = await db.execute(stmt)
    payments = result.scalars().all()
    items = [AdminPaymentListResponse.model_validate(p) for p in payments]
    return AdminPaymentListPaginatedResponse(items=items, total=total, page=page, limit=limit)


@router.get("/payments/{payment_id}", response_model=AdminPaymentDetailResponse)
async def admin_get_payment(
    payment_id: int,
    _: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Full payment details for admin (no guest verification)."""
    stmt = select(Payment).where(Payment.id == payment_id)
    result = await db.execute(stmt)
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return AdminPaymentDetailResponse.model_validate(payment)