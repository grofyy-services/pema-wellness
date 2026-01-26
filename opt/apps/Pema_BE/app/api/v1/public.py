"""
Public API endpoints (no authentication required)
"""

from fastapi import APIRouter, Depends, Query
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime

from app.db.postgresql import get_db
from app.models import Program, Room, PricingBand
from app.schemas.program import ProgramListResponse, ProgramResponse, ProgramFilters, PricingBandSummary
from app.schemas.room import (
    RoomListResponse,
    RoomResponse,
    RoomTypeSummary,
    RoomAvailabilityByCategory,
)
from app.services.booking import BookingService
from app.services.pricing import PricingService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/programs", response_model=List[ProgramListResponse])
async def list_programs(
    program_type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """List published programs"""
    
    # Base query for all programs (no published flag now)
    stmt = select(Program)
    
    # Apply filters
    if program_type:
        stmt = stmt.where(Program.program_type == program_type)
    
    # category filtering removed (no category field on Program)
    
    # featured filter removed
    
    if search:
        search_term = f"%{search}%"
        stmt = stmt.where(
            or_(
                Program.title.ilike(search_term),
                Program.description.ilike(search_term)
            )
        )
    
    # Order by title
    stmt = stmt.order_by(Program.title.asc())
    
    # Pagination
    offset = (page - 1) * limit
    stmt = stmt.offset(offset).limit(limit)
    
    result = await db.execute(stmt)
    programs = result.scalars().all()
    
    # Get starting prices
    pricing_service = PricingService(db)
    programs_with_pricing = []
    
    for program in programs:
        starting_price = await pricing_service.get_starting_price(program.id)
        program_data = ProgramListResponse(
            id=program.id,
            title=program.title,
            program_type=program.program_type,
            category=None,
            duration_range=program.duration_range,
            starting_price=starting_price
        )
        programs_with_pricing.append(program_data)
    
    return programs_with_pricing


@router.get("/programs/{program_id}", response_model=ProgramResponse)
async def get_program(
    program_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get program details by id"""
    
    stmt = select(Program).where(Program.id == program_id).options(selectinload(Program.pricing_bands))
    
    result = await db.execute(stmt)
    program = result.scalar()
    
    if not program:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Get starting price
    pricing_service = PricingService(db)
    starting_price = await pricing_service.get_starting_price(program.id)
    
    # Build response manually since Program lacks some optional schema fields (e.g., category)
    return ProgramResponse(
        id=program.id,
        title=program.title,
        description=program.description,
        program_type=program.program_type,
        category=None,
        duration_days_min=program.duration_days_min,
        duration_days_max=program.duration_days_max,
        duration_range=program.duration_range,
        price_base=program.price_base,
        starting_price=starting_price,
        min_age=None,
        max_age=None,
        created_at=program.created_at,
        updated_at=program.updated_at,
        pricing_bands=[PricingBandSummary.model_validate(pb) for pb in (program.pricing_bands or [])]
    )


@router.get("/rooms", response_model=List[RoomListResponse])
async def list_rooms(
    category: Optional[str] = Query(None, description="Brochure category e.g., 'Executive', 'Premium Garden'"),
    min_adults: Optional[int] = Query(None, ge=1),
    min_children: Optional[int] = Query(None, ge=0),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """List available rooms"""
    
    # Base query for active rooms
    stmt = select(Room).where(
        and_(Room.is_active == True, Room.maintenance_mode == False)
    )
    
    # Apply filters
    if category:
        # Match either stored category or pricing_category to user's brochure term
        stmt = stmt.where(or_(Room.category == category, Room.pricing_category == category))
    
    if min_adults:
        stmt = stmt.where(Room.occupancy_max_adults >= min_adults)
    
    if min_children:
        stmt = stmt.where(Room.occupancy_max_children >= min_children)
    
    # Order by category and name
    stmt = stmt.order_by(Room.category.asc(), Room.name.asc())
    
    # Pagination
    offset = (page - 1) * limit
    stmt = stmt.offset(offset).limit(limit)
    
    result = await db.execute(stmt)
    rooms = result.scalars().all()
    
    # Convert to response format with validation guards
    safe_rooms: List[RoomListResponse] = []
    for room in rooms:
        try:
            # Ensure amenities is a list of strings to satisfy schema
            if isinstance(room.amenities, list):
                amenities_list = [str(a) for a in room.amenities]
            else:
                amenities_list = []

            # Coerce category into enum; default to 'standard' if invalid
            from app.models.room import RoomCategory as _RoomCategory
            try:
                category_enum = _RoomCategory(room.pricing_category) if room.pricing_category else _RoomCategory.STANDARD
            except Exception:
                logger.warning("Invalid room category '%s' for room_id=%s; defaulting to 'standard'", room.category, getattr(room, "id", None))
                category_enum = _RoomCategory.STANDARD

            safe_rooms.append(
                RoomListResponse(
                    id=room.id,
                    name=room.name,
                    category=category_enum,
                    description=room.description,
                    occupancy_max_adults=room.occupancy_max_adults or 0,
                    occupancy_max_children=room.occupancy_max_children or 0,
                    price_per_night_single=room.price_per_night_single or 0,
                    price_per_night_double=room.price_per_night_double or 0,
                    featured_image=room.featured_image,
                    amenities=amenities_list,
                )
            )
        except Exception:
            logger.exception("Skipping room due to invalid data", extra={"room_id": getattr(room, "id", None)})
            continue

    return safe_rooms


@router.get("/rooms/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get room details"""
    
    stmt = select(Room).where(
        and_(Room.id == room_id, Room.is_active == True)
    )
    
    result = await db.execute(stmt)
    room = result.scalar()
    
    if not room:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Room not found")

    # Build a safe response with guards against invalid DB values
    from app.models.room import RoomCategory as _RoomCategory
    try:
        try:
            category_enum = _RoomCategory(room.category) if room.category else _RoomCategory.STANDARD
        except Exception:
            logger.warning("Invalid room category '%s' for room_id=%s; defaulting to 'standard'", room.category, getattr(room, "id", None))
            category_enum = _RoomCategory.STANDARD

        amenities_list = [str(a) for a in room.amenities] if isinstance(room.amenities, list) else []
        gallery_images_list = [str(x) for x in room.gallery_images] if isinstance(room.gallery_images, list) else []
        features_dict = room.features if isinstance(room.features, dict) else None

        return RoomResponse(
            id=room.id,
            name=room.name,
            code=getattr(room, "code", None),
            category=category_enum,
            description=room.description,
            occupancy_max_adults=room.occupancy_max_adults or 0,
            occupancy_max_children=room.occupancy_max_children or 0,
            occupancy_max_total=room.occupancy_max_total or 0,
            price_per_night_single=room.price_per_night_single or 0,
            price_per_night_double=room.price_per_night_double or 0,
            price_per_night_extra_adult=getattr(room, "price_per_night_extra_adult", 0) or 0,
            price_per_night_child=getattr(room, "price_per_night_child", 0) or 0,
            inventory_count=getattr(room, "inventory_count", 1) or 1,
            refundable_full_payment_required=getattr(room, "refundable_full_payment_required", False) or False,
            deposit_amount=getattr(room, "deposit_amount", None),
            effective_deposit_amount=room.effective_deposit_amount,
            amenities=amenities_list,
            features=features_dict,
            featured_image=getattr(room, "featured_image", None),
            gallery_images=gallery_images_list,
            floor_plan_image=getattr(room, "floor_plan_image", None),
            bed_configuration=getattr(room, "bed_configuration", None),
            room_size_sqft=getattr(room, "room_size_sqft", None),
            max_extra_beds=getattr(room, "max_extra_beds", 0) or 0,
            medical_equipment_compatible=getattr(room, "medical_equipment_compatible", True) or True,
            wheelchair_accessible=getattr(room, "wheelchair_accessible", False) or False,
            is_active=bool(getattr(room, "is_active", True)),
            maintenance_mode=bool(getattr(room, "maintenance_mode", False)),
            created_at=getattr(room, "created_at"),
            updated_at=getattr(room, "updated_at"),
        )
    except Exception:
        logger.exception("Failed to serialize room response", extra={"room_id": getattr(room, "id", None)})
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail="Room response serialization failed")


@router.get("/program-types")
async def get_program_types():
    """Get available program types"""
    return [
        {"value": "medical", "label": "Medical Programs"},
        {"value": "wellness", "label": "Wellness Programs"},
        {"value": "lite", "label": "Lite Programs"}
    ]


@router.get("/room-categories")
async def get_room_categories():
    """Get available room categories"""
    return [
        {"value": "suite", "label": "Suite"},
        {"value": "premium", "label": "Premium"},
        {"value": "deluxe", "label": "Deluxe"},
        {"value": "standard", "label": "Standard"}
    ]


@router.get("/room-types", response_model=List[RoomTypeSummary])
async def list_room_types(db: AsyncSession = Depends(get_db)):
    """Return all brochure/pricing room types with their total inventory counts and pricing for both 8+ nights and up to 7 nights."""

    # First, get all active rooms grouped by pricing category with inventory counts
    room_inventory_stmt = select(
        Room.pricing_category,
        func.count(Room.id).label('total_inventory')
    ).where(
        and_(
            Room.is_active == True,
            Room.maintenance_mode == False,
            Room.pricing_category.isnot(None)
        )
    ).group_by(Room.pricing_category).order_by(Room.pricing_category)

    room_inventory_result = await db.execute(room_inventory_stmt)
    room_inventory_rows = room_inventory_result.all()

    # Get pricing for 8+ nights (min_nights = 8, max_nights = NULL)
    pricing_8_plus_stmt = select(
        Room.pricing_category,
        func.min(PricingBand.price_single).label('price_single_8_plus'),
        func.min(PricingBand.price_double).label('price_double_8_plus')
    ).join(
        PricingBand,
        and_(
            PricingBand.room_id == Room.id,
            PricingBand.min_nights == 8,
            PricingBand.max_nights.is_(None),
            PricingBand.is_active == True
        )
    ).where(
        and_(
            Room.is_active == True,
            Room.maintenance_mode == False,
            Room.pricing_category.isnot(None)
        )
    ).group_by(Room.pricing_category)

    pricing_8_plus_result = await db.execute(pricing_8_plus_stmt)
    pricing_8_plus_rows = pricing_8_plus_result.all()

    # Get pricing for up to 7 nights (min_nights = 3, max_nights = 7)
    pricing_upto_7_stmt = select(
        Room.pricing_category,
        func.min(PricingBand.price_single).label('price_single_upto_7'),
        func.min(PricingBand.price_double).label('price_double_upto_7')
    ).join(
        PricingBand,
        and_(
            PricingBand.room_id == Room.id,
            PricingBand.min_nights == 3,
            PricingBand.max_nights == 7,
            PricingBand.is_active == True
        )
    ).where(
        and_(
            Room.is_active == True,
            Room.maintenance_mode == False,
            Room.pricing_category.isnot(None)
        )
    ).group_by(Room.pricing_category)

    pricing_upto_7_result = await db.execute(pricing_upto_7_stmt)
    pricing_upto_7_rows = pricing_upto_7_result.all()

    print(room_inventory_rows, "room_inventory_rows")
    print(pricing_8_plus_rows, "pricing_8_plus_rows")
    print(pricing_upto_7_rows, "pricing_upto_7_rows")

    # Create dictionaries for easy lookup
    pricing_8_plus_dict = {row.pricing_category: row for row in pricing_8_plus_rows}
    pricing_upto_7_dict = {row.pricing_category: row for row in pricing_upto_7_rows}

    print(pricing_upto_7_dict, "pricing_upto_7_dict")
    print(pricing_8_plus_dict, "pricing_8_plus_dict")
    # Map pricing categories to codes
    category_code_map = {
        "Standard": "STT",
        "Premium Balcony": "PBT",
        "Premium Garden": "PGT",
        "Executive": "EXT",
        "Garden Executive Suite": "GES",
        "Executive Junior Suite": "SUI",
        "Elemental Villa": "PEV",
        "Pema Suite": "PES"
    }

    room_types = []
    for row in room_inventory_rows:
        category = row.pricing_category
        code = category_code_map.get(category, "UNK")

        # Get pricing data
        pricing_8_plus = pricing_8_plus_dict.get(category)
        pricing_upto_7 = pricing_upto_7_dict.get(category)

        room_types.append(
            RoomTypeSummary(
                category=category,
                code=code,
                total_inventory=row.total_inventory,
                occupancy_max_adults=2,  # Standard across all room types
                occupancy_max_children=2,  # Standard across all room types
                price_per_night_single=pricing_8_plus.price_single_8_plus if pricing_8_plus else 0,
                price_per_night_double=pricing_8_plus.price_double_8_plus if pricing_8_plus else 0,
                price_per_night_single_upto_7_nights=pricing_upto_7.price_single_upto_7 if pricing_upto_7 else 0,
                price_per_night_double_upto_7_nights=pricing_upto_7.price_double_upto_7 if pricing_upto_7 else 0
            )
        )

    return room_types


@router.get("/room-availability", response_model=List[RoomAvailabilityByCategory])
async def room_availability(
    check_in_date: datetime = Query(..., description="Check-in date (inclusive)"),
    check_out_date: datetime = Query(..., description="Check-out date (exclusive; same-day turnover allowed)"),
    db: AsyncSession = Depends(get_db),
):
    """Return available units per brochure/pricing category for the given dates.
    Uses per-type inventory and overlap logic; back-to-back stays are allowed.
    """
    # Basic validation
    if check_out_date <= check_in_date:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="check_out_date must be after check_in_date")

    # Gather rooms and group by category
    stmt = select(Room).where(and_(Room.is_active == True, Room.maintenance_mode == False))
    result = await db.execute(stmt)
    rooms = result.scalars().all()
    bs = BookingService(db)
    groups: dict[str, list[Room]] = {}
    for r in rooms:
        cat = getattr(r, "pricing_category", None) or bs._infer_pricing_category(r)
        groups.setdefault(cat, []).append(r)

    # Sum remaining units by category
    out: list[RoomAvailabilityByCategory] = []
    for cat, items in groups.items():
        total_inv = sum((getattr(r, "inventory_count", 1) or 1) for r in items)
        remaining = 0
        for r in items:
            remaining += await bs.get_remaining_units(r.id, check_in_date.date(), check_out_date.date())
        out.append(RoomAvailabilityByCategory(category=cat, available_units=remaining, total_inventory=total_inv))
    return out
