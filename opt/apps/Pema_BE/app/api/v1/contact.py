"""
Contact Us endpoints (no authentication)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.db.postgresql import get_db
from app.models.contact import ContactUs
from app.schemas.contact import ContactCreate, ContactResponse


router = APIRouter()


@router.post("", response_model=ContactResponse)
async def create_contact(contact: ContactCreate, db: AsyncSession = Depends(get_db)):
    entity = ContactUs(
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        reason=contact.reason.value,
        message=contact.message
    )
    db.add(entity)
    await db.commit()
    await db.refresh(entity)
    return ContactResponse.model_validate(entity)


@router.get("", response_model=List[ContactResponse])
async def list_contacts(
    email: Optional[str] = Query(None),
    reason: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ContactUs)
    if email:
        from sqlalchemy import func
        stmt = stmt.where(func.lower(ContactUs.email) == func.lower(email))
    if reason:
        stmt = stmt.where(ContactUs.reason == reason)
    offset = (page - 1) * limit
    stmt = stmt.order_by(ContactUs.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(stmt)
    rows = result.scalars().all()
    return [ContactResponse.model_validate(r) for r in rows]


