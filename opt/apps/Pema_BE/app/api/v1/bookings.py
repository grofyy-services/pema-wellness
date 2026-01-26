"""
Booking API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
import logging
from collections import Counter

from app.core.exceptions import ValidationError, BookingError, MinimumStayError, OccupancyError
from app.core.logging import audit_logger
from app.core.config import settings
from app.db.postgresql import get_db
from app.models import Program, Room, Booking, PricingBand
from app.schemas.booking import (
    BookingEstimateRequest, BookingEstimateResponse, BookingCreateRequest,
    BookingResponse, BookingListResponse, BookingStatusUpdate,
    BookingCancellation, CheckInRequest, CheckOutRequest, BookingFilters,
    PriceBreakdown, PriceLine, BookingSearchResponse
)
from app.services.pricing import PricingService
from app.services.booking import BookingService
from app.services.email import EmailService

router = APIRouter()
logger = logging.getLogger(__name__)


def _compute_adult_distribution(total_adults: int) -> list[int]:
    """Split adults across rooms into doubles and singles by default.
    Example: 1 -> [1]; 2 -> [2]; 3 -> [2,1]; 4 -> [2,2]
    """
    count = max(0, int(total_adults))
    distribution = [2] * (count // 2)
    if count % 2 == 1:
        distribution.append(1)
    if not distribution and count > 0:
        distribution = [1]
    return distribution


def _distribute_adults(total_adults: int, rooms_count: int, max_per_room: int) -> list[int]:
    """Distribute adults across rooms respecting capacities."""
    if total_adults > rooms_count * max_per_room:
        raise OccupancyError(f"Maximum {rooms_count * max_per_room} adults allowed for {rooms_count} rooms ({max_per_room} per room)")
    
    if rooms_count <= 0:
        return []
        
    base = total_adults // rooms_count
    remainder = total_adults % rooms_count
    
    distribution = []
    for i in range(rooms_count):
        # Distribute remainder to first few rooms
        count = base + (1 if i < remainder else 0)
        distribution.append(count)
        
    return distribution


@router.post("/estimate", response_model=BookingEstimateResponse)
async def estimate_booking(
    estimate_data: BookingEstimateRequest,
    db: AsyncSession = Depends(get_db)
):
    """Get booking estimate with pricing breakdown

    Caregiver Options:
    - caregiver_required: Set to true when children are present or caregiver is needed
    - caregiver_stay_with_guest: true = caregiver shares guest room, false = separate room
    - caregiver_meal: "simple" (complimentary) or "restaurant_dining" (premium)
    - caregiver_room_pricing_category: Room type for caregiver separate room
      * Standard: ₹20,000/night
      * Premium Balcony: ₹25,000/night
      * Premium Garden: ₹28,000/night
      * Executive/Suite/Villa: Complimentary (₹0)
      * If not specified, uses guest room category

    Example: To get Premium Garden for guests and Standard for caregiver:
    {
        "room_pricing_category": "Premium Garden",
        "caregiver_room_pricing_category": "Standard",
        "caregiver_required": true,
        "caregiver_stay_with_guest": false,
        ...
    }
    """
    import asyncio

    logger.info(f"Estimate request started: category={estimate_data.room_pricing_category}, dates={estimate_data.check_in_date} to {estimate_data.check_out_date}")

    try:
        # Add timeout to prevent hanging requests
        result = await asyncio.wait_for(
            _estimate_booking_internal(estimate_data, db),
            timeout=30.0  # 30 second timeout
        )
        return result
    except asyncio.TimeoutError:
        logger.error("Estimate request timed out after 30 seconds")
        raise HTTPException(status_code=504, detail="Request timeout - please try again later")
    except Exception as e:
        logger.error(f"Estimate request failed: {e}")
        raise


async def _estimate_booking_internal(
    estimate_data: BookingEstimateRequest,
    db: AsyncSession
) -> BookingEstimateResponse:
    """Internal estimate booking logic with timeout protection"""

    # Validate dates
    nights = (estimate_data.check_out_date - estimate_data.check_in_date).days
    if nights <= 0:
        raise ValidationError("Check-out date must be after check-in date")

    # Check minimum stay requirement
    min_stay_ok = nights >= settings.MINIMUM_STAY_NIGHTS
    logger.info(f"Date validation passed, nights={nights}, min_stay_ok={min_stay_ok}")

    # Determine room context
    room = None
    booking_service = BookingService(db)
    selected_room_id = None
    selected_category = estimate_data.room_pricing_category
    rooms_count_requested = max(1, estimate_data.number_of_rooms)
    if selected_category:
        logger.info(f"Finding rooms for category: {selected_category}")
        # Find rooms by category without availability checks
        available_rooms = await booking_service.find_rooms_by_pricing_category(selected_category)
        logger.info(f"Found {len(available_rooms)} rooms in category")
        room = available_rooms[0] if available_rooms else None

    if not room or not room.is_active:
        raise ValidationError("Room not found")
    
    # Validate occupancy (simplified totals across rooms)
    occupancy = estimate_data.occupancy
    rooms_count = rooms_count_requested

    # Use occupancy data if provided, otherwise fall back to separate totals
    if occupancy:
        adults_total = occupancy.adults
        teens_total = occupancy.teens_13_18
        children_total = occupancy.children
        children_ages_total = occupancy.children_ages
        # For backward compatibility, split children by age
        children_under4 = sum(1 for age in children_ages_total if age < 5)
        children_5to12 = sum(1 for age in children_ages_total if 5 <= age <= 12)
    else:
        adults_total = estimate_data.adults_total
        children_under4 = estimate_data.children_total_under_4
        children_5to12 = estimate_data.children_total_5to12
        teens_total = estimate_data.teens_13to18
        children_total = children_under4 + children_5to12
        children_ages_total = [0] * children_under4 + [5] * children_5to12

    # Hard enforce: children present => caregiver required
    caregiver_flag = estimate_data.caregiver_required or (occupancy.caregiver_required if occupancy else False)
    if children_total > 0 and not caregiver_flag:
        raise ValidationError("Caregiver is required when children are present")
        
    # Compute adult distribution and required rooms
    effective_adults_total = adults_total + teens_total
    
    # Dynamic capacity check
    import math
    max_per_room = getattr(room, 'occupancy_max_adults', 2)
    if max_per_room < 1: max_per_room = 2
    
    min_rooms_needed = math.ceil(effective_adults_total / max_per_room)
    rooms_count = max(rooms_count, min_rooms_needed)
    
    # Distribute adults
    adults_distribution = _distribute_adults(effective_adults_total, rooms_count, max_per_room)
    
    # Per-room constraints
    max_adults_allowed = rooms_count * max_per_room
    max_children_allowed = rooms_count * getattr(room, 'occupancy_max_children', 3)
    
    if effective_adults_total > max_adults_allowed:
        raise OccupancyError(f"Maximum {max_adults_allowed} adults allowed for {rooms_count} rooms ({max_per_room} per room)")
    if children_total > max_children_allowed:
        raise OccupancyError(f"Maximum {max_children_allowed} children under 12 allowed for {rooms_count} rooms")
        
    # Optional per-room capacity validation when single-room occupancy provided
    if occupancy is not None:
        if not room.can_accommodate(min(occupancy.adults, max_per_room), min(occupancy.children, 3)):
            raise OccupancyError(
                f"Room cannot accommodate requested occupancy per-room",
                details={
                    "max_adults": room.occupancy_max_adults,
                    "max_children": room.occupancy_max_children,
                    "max_total": room.occupancy_max_total
                }
            )
    
    # Pricing using pricing service
    logger.info(f"Starting pricing calculation for room {room.id}")
    pricing_service = PricingService(db)
    
    base_total_rupees = 0
    price_lines = []
    
    # Count occupancy types
    occupancy_counts = Counter(adults_distribution)
    
    # Variables for backward compatibility with later code
    single_rooms = occupancy_counts.get(1, 0)
    double_rooms = occupancy_counts.get(2, 0)
    
    for adult_count, count_rooms in occupancy_counts.items():
        if adult_count == 0: continue
        
        res = await pricing_service.calculate_price(
            program_id=None,
            room_id=room.id,
            nights=nights,
            adults=adult_count,
            children=0,
            check_in_date=estimate_data.check_in_date,
            children_ages=[],
            teens_13_18=0,
            caregiver_required=False,
            caregiver_stay_with_guest=False,
            caregiver_meal=None
        )
        
        line_total = res["base_price"] * count_rooms
        base_total_rupees += line_total
        
        # Description
        if adult_count == 1:
            desc = f"{room.name} - Single Occupancy"
        elif adult_count == 2:
            desc = f"{room.name} - Double Occupancy"
        else:
            desc = f"{room.name} - {adult_count} Adults Occupancy"
            
        price_lines.append(PriceLine(
            description=desc,
            amount=res["base_price"] * count_rooms,  # Keep in rupees for frontend
            nights=nights,
            quantity=count_rooms
        ))
    
    # Children detailed lines
    children_payable = 0
    children_free = 0
    for age in children_ages_total:
        if 5 <= age <= 12:
            children_payable += 1
        elif 0 <= age < 5:
            children_free += 1
    if children_payable > 0:
        price_lines.append(PriceLine(
            description=f"Children 5–12 meals (₹7,000/day) x {children_payable}",
            amount=7000 * nights * children_payable,  # Keep in rupees
            nights=nights,
            quantity=children_payable
        ))
    if children_free > 0:
        price_lines.append(PriceLine(
            description=f"Children 0–4 (Complimentary) x {children_free}",
            amount=0,
            nights=nights,
            quantity=children_free
        ))
    
    # Caregiver detailed lines (group-level)
    caregiver_flag = estimate_data.caregiver_required or (occupancy.caregiver_required if occupancy else False)
    caregiver_total_rupees = 0
    if caregiver_flag:
        # Caregiver can share even with double occupancy
        category = getattr(room, 'pricing_category', None) or booking_service._infer_pricing_category(room)

        # Check for complimentary categories (Executive, Suites, Pema Suite, Elemental Villa) - applies to both sharing and separate
        is_complimentary = False
        if category:
            cat_lower = category.lower()
            if "executive" in cat_lower or "suite" in cat_lower or "villa" in cat_lower:
                is_complimentary = True

        if estimate_data.caregiver_stay_with_guest:
            if is_complimentary:
                price_lines.append(PriceLine(
                    description="Caregiver (sharing guest room - Complimentary)",
                    amount=0,
                    nights=nights,
                    quantity=1
                ))
            else:
                caregiver_total_rupees += 8000 * nights
                price_lines.append(PriceLine(
                    description="Caregiver (sharing guest room)",
                    amount=8000 * nights,  # Keep in rupees
                    nights=nights,
                    quantity=1
                ))
        else:
            # Use caregiver room category if provided, otherwise use guest room category
            caregiver_category = estimate_data.caregiver_room_pricing_category or category

            # Check if caregiver room category is complimentary
            caregiver_is_complimentary = False
            if caregiver_category:
                cat_lower = caregiver_category.lower()
                if "executive" in cat_lower or "suite" in cat_lower or "villa" in cat_lower:
                    caregiver_is_complimentary = True

            if caregiver_is_complimentary:
                 price_lines.append(PriceLine(
                    description=f"Caregiver separate room (Complimentary - {caregiver_category})",
                    amount=0,
                    nights=nights,
                    quantity=1
                ))
            else:
                caregiver_room_rates = settings.CAREGIVER_SEPARATE_ROOM_PRICES_INR
                if caregiver_category in caregiver_room_rates:
                    sep_room_cost = caregiver_room_rates[caregiver_category] * nights
                    caregiver_total_rupees += sep_room_cost
                    price_lines.append(PriceLine(
                        description=f"Caregiver separate room ({caregiver_category})",
                        amount=sep_room_cost,  # Keep in rupees
                        nights=nights,
                        quantity=1
                    ))
                else:
                    # Guest pricing fallback: use single occupancy base
                    # Calculate single occupancy price for the stay duration
                    single_res = await pricing_service.calculate_price(
                        program_id=None,
                        room_id=room.id,
                        nights=nights,
                        adults=1,
                        children=0,
                        check_in_date=estimate_data.check_in_date,
                        children_ages=[],
                        teens_13_18=0,
                        caregiver_required=False,
                        caregiver_stay_with_guest=False,
                        caregiver_meal=None
                    )
                    caregiver_guest_cost = single_res["base_price"]
                    caregiver_total_rupees += caregiver_guest_cost
                    price_lines.append(PriceLine(
                        description=f"Caregiver separate room (guest pricing - {caregiver_category})",
                        amount=caregiver_guest_cost,  # Keep in rupees
                        nights=nights,
                        quantity=1
                    ))

        # Caregiver meal
        if estimate_data.caregiver_meal == "restaurant_dining":
            if estimate_data.caregiver_stay_with_guest:
                # Charge for meal if sharing room
                caregiver_total_rupees += 8000 * nights
                price_lines.append(PriceLine(
                    description="Caregiver meal upgrade: restaurant dining",
                    amount=8000 * nights,  # Keep in rupees
                    nights=nights,
                    quantity=1
                ))
            else:
                # Meal is included if separate room
                price_lines.append(PriceLine(
                    description="Caregiver meal upgrade: restaurant dining (included)",
                    amount=0,
                    nights=nights,
                    quantity=1
                ))
        elif estimate_data.caregiver_meal == "simple":
            price_lines.append(PriceLine(
                description="Caregiver meals: simple",
                amount=0,
                nights=nights,
                quantity=1
            ))
    
    # Program fee currently zero (decided later)

    # Compute subtotal in rupees: base + children + caregiver
    subtotal_rupees = base_total_rupees
    # Add children payable contribution if present
    if children_payable > 0:
        subtotal_rupees += 7000 * nights * children_payable
    # Caregiver contribution already added to lines; include in subtotal
    subtotal_rupees += caregiver_total_rupees

    # Taxes removed: prices are tax-inclusive in DB and rate tables
    tax_amount = 0
    total_amount = subtotal_rupees
    # Compute per-night charges (room rate only, excluding caregiver/children add-ons)
    per_night_rupees = int(round(base_total_rupees / nights)) if nights > 0 else 0
    
    # Amounts are in rupees
    price_breakdown = PriceBreakdown(
        lines=[PriceLine(description=l.description, amount=l.amount, nights=l.nights, quantity=l.quantity) for l in price_lines],
        subtotal=subtotal_rupees,
        taxes=0.0,
        discount=0.0,
        total=total_amount
    )

    # Build structured breakdown for easier frontend consumption
    structured_breakdown = None
    try:
        from app.schemas.booking import (
            StructuredEstimateBreakdown,
            StructuredLineItem,
            CaregiverRoomItem,
            CaregiverMealItem,
        )
        _room_total = None
        _child_meal = None
        _caregiver_room_total = None
        _caregiver_meal = None
        # Determine room occupancy text
        total_occ = adults_total + teens_total
        if total_occ == 1:
            occupancy_desc = "Single Occupancy"
        elif total_occ == 2:
            occupancy_desc = "Double Occupancy"
        else:
            occupancy_desc = f"{total_occ} Adults Occupancy"
            
        # Map line items
        for lp in price_breakdown.lines:
            desc = lp.description or ""
            if desc.endswith("Single Occupancy") or desc.endswith("Double Occupancy") or desc.endswith("Adults Occupancy"):
                # Fallback single-line mapping; will override below for multi-room
                _room_total = StructuredLineItem(
                    description=f"{room.name} - {occupancy_desc}",
                    amount=lp.amount,
                    nights=lp.nights,
                    quantity=lp.quantity,
                )
            elif desc.startswith("Children 5–12 meals"):
                _child_meal = StructuredLineItem(
                    description=desc,
                    amount=lp.amount,
                    nights=lp.nights,
                    quantity=lp.quantity,
                )
            elif desc.startswith("Caregiver separate room"):
                _caregiver_room_total = CaregiverRoomItem(
                    description=desc,
                    amount=lp.amount,
                    nights=lp.nights,
                    quantity=lp.quantity,
                    room_type="separate_room",
                )
            elif desc.startswith("Caregiver (sharing guest room)"):
                _caregiver_room_total = CaregiverRoomItem(
                    description=desc,
                    amount=lp.amount,
                    nights=lp.nights,
                    quantity=lp.quantity,
                    room_type="sharing_guest_room",
                )
            elif desc.startswith("Caregiver meal upgrade: restaurant dining"):
                _caregiver_meal = CaregiverMealItem(
                    description=desc,
                    amount=lp.amount,
                    nights=lp.nights,
                    quantity=lp.quantity,
                    meal_type="restaurant_dining",
                )
            elif desc.startswith("Caregiver meals: simple"):
                _caregiver_meal = CaregiverMealItem(
                    description=desc,
                    amount=lp.amount,
                    nights=lp.nights,
                    quantity=lp.quantity,
                    meal_type="simple",
                )
        structured_breakdown = StructuredEstimateBreakdown(
            room_total=_room_total,
            child_meal=_child_meal,
            caregiver_room_total=_caregiver_room_total,
            caregiver_meal=_caregiver_meal,
        )
        # Override room_total for multi-room to show aggregate
        if rooms_count > 1:
            dist_text = []
            for k, v in sorted(occupancy_counts.items()):
                if k == 1:
                    dist_text.append(f"{v}x Single")
                elif k == 2:
                    dist_text.append(f"{v}x Double")
                elif k > 0:
                    dist_text.append(f"{v}x {k} Adults")
            
            aggregate_desc = f"{room.name} - {rooms_count} rooms ({', '.join(dist_text)})"
            structured_breakdown.room_total = StructuredLineItem(
                description=aggregate_desc,
                amount=base_total_rupees,
                nights=nights,
                quantity=rooms_count,
            )
    except Exception:
        # Non-fatal; keep response compatible even if mapping fails
        structured_breakdown = None
    
    # Determine deposit and payment requirements
    full_payment_required = room.requires_full_payment
    # When full payment is required, deposit equals the full total
    if full_payment_required:
        deposit_required = f"{total_amount/100:.2f}"
    else:
        deposit_required = f"{room.effective_deposit_amount:.2f}"
    
    # Generate warnings and recommendations
    warnings = []
    recommendations = []
    
    if not min_stay_ok:
        warnings.append(f"Minimum stay of {settings.MINIMUM_STAY_NIGHTS} nights required")
    
    if teens_total > 0:
        recommendations.append("Teen track guidance available for ages 13-18")
    
    if (occupancy.caregiver_required if occupancy else False) or estimate_data.caregiver_required:
        recommendations.append("Caregiver arrangements can be made")

    # Warn if separate caregiver room is selected but not applicable for this room category
    if (estimate_data.caregiver_required and not estimate_data.caregiver_stay_with_guest) and room.category in ["suite"]:
        warnings.append("Caregiver separate room not applicable for executive/suites; book at guest pricing")
    
    # Room availability check removed - always return available for estimation
    room_available = True
    
    logger.info(f"Estimate calculation completed successfully")
    return BookingEstimateResponse(
        nights=nights,
        min_stay_ok=min_stay_ok,
        min_stay_required=settings.MINIMUM_STAY_NIGHTS,
        price_breakdown=price_breakdown,
        per_night_charges=per_night_rupees,
        structured_breakdown=structured_breakdown,
        deposit_required=deposit_required,
        full_payment_required=full_payment_required,
        warnings=warnings,
        recommendations=recommendations,
        room_available=room_available,
        alternative_rooms=[]
    )


@router.get("/search", response_model=List[BookingSearchResponse])
async def search_bookings(
    q: Optional[str] = None,
    guest_email: Optional[str] = None,
    guest_phone: Optional[str] = None,
    confirmation_number: Optional[str] = None,
    invoice_id: Optional[str] = None,
    ids_booking_reference: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Search bookings by various criteria.
    
    Query Parameters:
    - q: General search term (matches email, phone, confirmation, invoice, ids reference)
    - guest_email: Exact match
    - guest_phone: Partial match
    - confirmation_number: Exact match
    - invoice_id: Exact match
    - ids_booking_reference: Exact match
    """
    booking_service = BookingService(db)
    bookings = await booking_service.search_bookings(
        query=q,
        guest_email=guest_email,
        guest_phone=guest_phone,
        confirmation_number=confirmation_number,
        invoice_id=invoice_id,
        ids_booking_reference=ids_booking_reference
    )
    # Convert bookings to BookingSearchResponse with rupee conversion
    results = []
    for booking in bookings:
        # Calculate total_amount from estimate_details subtotal if available
        total_amount = booking.total_amount if booking.total_amount else 0
        if booking.estimate_details and 'price_breakdown' in booking.estimate_details and 'subtotal' in booking.estimate_details['price_breakdown']:
            total_amount = booking.estimate_details['price_breakdown']['subtotal']

        paid_amount = booking.paid_amount if booking.paid_amount else 0
        # Calculate balance_amount as total_amount - paid_amount
        balance_amount = total_amount - paid_amount

        # Debug: print booking id
        print(f"DEBUG: booking.id = {booking.id}, type = {type(booking.id)}")

        result = BookingSearchResponse(
            id=booking.id,
            check_in_date=booking.check_in_date,
            check_out_date=booking.check_out_date,
            nights=booking.nights,
            occupancy_details=booking.occupancy_details,
            status=booking.status,
            total_amount=total_amount,
            deposit_amount=booking.deposit_amount if booking.deposit_amount else 0,
            paid_amount=paid_amount,
            balance_amount=balance_amount,
            special_requests=booking.special_requests,
            guest_notes=booking.guest_notes,
            guest_first_name=booking.guest_first_name,
            guest_last_name=booking.guest_last_name,
            guest_email=booking.guest_email,
            guest_phone=booking.guest_phone,
            guest_country=booking.guest_country,
            number_of_rooms=booking.number_of_rooms,
            caregiver_required=booking.caregiver_required,
            caregiver_stay_with_guest=booking.caregiver_stay_with_guest,
            caregiver_meal=booking.caregiver_meal,
            private_transfer=booking.private_transfer,
            confirmation_number=booking.confirmation_number,
            invoice_id=booking.invoice_id,
            cancelled_at=booking.cancelled_at,
            cancellation_reason=booking.cancellation_reason,
            refund_amount=booking.refund_amount,
            ids_booking_reference=booking.ids_booking_reference,
            other_guests=booking.other_guests,
            estimate_details=booking.estimate_details
        )
        results.append(result)
    return results


# Zuber says booking creation is like cooking - add the right ingredients and hope for the best!
@router.post("", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    """Create a new booking"""
    
    # Validate dates and minimum stay
    nights = (booking_data.check_out_date - booking_data.check_in_date).days
    if nights < settings.MINIMUM_STAY_NIGHTS:
        raise MinimumStayError(settings.MINIMUM_STAY_NIGHTS, nights)
    
    # Resolve room by ID or pricing category
    room = None
    booking_service = BookingService(db)
    picked = await booking_service.pick_available_rooms_by_category(
        booking_data.room_pricing_category,
        booking_data.check_in_date,
        booking_data.check_out_date,
        count=1
    )
    room = picked[0] if picked else None
    
    if not room or not room.is_active:
        raise ValidationError("Room not found or not available")
    
    # Validate occupancy (simplified totals)
    occupancy = booking_data.occupancy
    rooms_count = max(1, booking_data.number_of_rooms)
    adults_total = booking_data.adults_total
    children_under4 = booking_data.children_total_under_4
    children_5to12 = booking_data.children_total_5to12
    teens_total = booking_data.teens_13to18
    children_total = children_under4 + children_5to12
    
    # Hard enforce: children present => caregiver required
    if children_total > 0 and not booking_data.caregiver_required:
        raise ValidationError("Caregiver is required when children are present")
    total_guests = adults_total + children_total + teens_total + (1 if booking_data.caregiver_required and booking_data.caregiver_stay_with_guest else 0)
    # Compute distribution and required rooms
    effective_adults_total = adults_total + teens_total
    adults_distribution = _compute_adult_distribution(effective_adults_total)
    required_rooms = max(1, len(adults_distribution))
    rooms_count = max(rooms_count, required_rooms)
    # Multi-room total capacity guard (4 per room incl. caregiver when sharing)
    if total_guests > rooms_count * 4:
        raise OccupancyError(f"Maximum {rooms_count * 4} guests allowed across {rooms_count} rooms including caregiver when staying with guest")
    
    # Per-room constraints across number_of_rooms
    max_adults_allowed = rooms_count * 2
    max_children_allowed = rooms_count * 3
    if effective_adults_total > max_adults_allowed:
        raise OccupancyError(f"Maximum {max_adults_allowed} adults allowed for {rooms_count} rooms (2 per room)")
    if children_total > max_children_allowed:
        raise OccupancyError(f"Maximum {max_children_allowed} children under 12 allowed for {rooms_count} rooms (3 per room)")
    
    # Calculate pricing
    pricing_service = PricingService(db)
    price_result = await pricing_service.calculate_price(
        program_id=None,
        room_id=room.id,
        nights=nights,
        adults=adults_total,
        children=children_total,
        check_in_date=booking_data.check_in_date,
        children_ages=[5]*children_5to12 + [0]*children_under4,
        teens_13_18=teens_total,
        caregiver_required=booking_data.caregiver_required,
        caregiver_stay_with_guest=booking_data.caregiver_stay_with_guest,
        caregiver_meal=booking_data.caregiver_meal,
        adults_distribution=adults_distribution
    )
    # Taxes removed: prices are tax-inclusive in DB and rate tables
    total_amount = price_result["total_price"]  # Pricing service returns rupees, store directly

    # Determine deposit and balance
    full_payment_required = room.requires_full_payment
    paid_amount = 0  # No payment made yet during booking creation
    if full_payment_required:
        deposit_amount = total_amount
        balance_amount = total_amount - paid_amount  # Should be 0 when full payment required and paid
    else:
        # Store deposit in rupees; effective_deposit_amount is in INR rupees
        deposit_amount = room.effective_deposit_amount
        balance_amount = total_amount - paid_amount  # Balance is total minus what has been paid
    
    # Create booking
    booking = Booking(
        user_id=None,
        program_id=None,
        room_id=room.id,
        check_in_date=booking_data.check_in_date,
        check_out_date=booking_data.check_out_date,
        nights=nights,
        occupancy_details=occupancy.model_dump() if occupancy else {
            "adults_total": adults_total,
            "children_total_under_4": children_under4,
            "children_total_5to12": children_5to12,
            "teens_13to18": teens_total,
            "number_of_rooms": rooms_count
        },
        total_amount=total_amount,
        deposit_amount=deposit_amount,
        paid_amount=paid_amount,
        balance_amount=balance_amount,
        full_payment_required=full_payment_required,
        special_requests=booking_data.special_requests,
        guest_first_name=booking_data.guest_first_name,
        guest_last_name=booking_data.guest_last_name,
        guest_email=booking_data.guest_email,
        guest_phone=booking_data.guest_phone,
        guest_country=booking_data.guest_country,
        other_guests=booking_data.other_guests,
        number_of_rooms=rooms_count,
        caregiver_required=booking_data.caregiver_required,
        caregiver_stay_with_guest=booking_data.caregiver_stay_with_guest,
        caregiver_meal=booking_data.caregiver_meal,
        private_transfer=booking_data.private_transfer,
        doctor_review_required=True
    )
    
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    # Generate confirmation number
    booking.confirmation_number = booking.generate_confirmation_number()
    await db.commit()
    
    # Log booking creation
    audit_logger.log_booking_event(
        event="booking_created",
        booking_id=booking.id,
        user_id=None,
        details={
            "room_id": room.id,
            "nights": nights,
            "total_amount": total_amount,
            "occupancy": (occupancy.model_dump() if occupancy else {
                "adults_total": adults_total,
                "children_total_under_4": children_under4,
                "children_total_5to12": children_5to12,
                "teens_13to18": teens_total,
                "number_of_rooms": rooms_count
            })
        }
    )
    
    # Load relationships for response
    await db.refresh(booking, ['program', 'room'])
    
    return BookingResponse.model_validate(booking)


@router.get("", response_model=List[BookingListResponse])
async def list_bookings(
    filters: BookingFilters = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """List bookings with filters (no authentication)."""
    
    # Build query
    stmt = select(Booking)
    
    # Apply filters
    if filters.status:
        stmt = stmt.where(Booking.status == filters.status)
    
    if filters.program_id:
        stmt = stmt.where(Booking.program_id == filters.program_id)
    
    if filters.room_id:
        stmt = stmt.where(Booking.room_id == filters.room_id)
    
    if filters.check_in_from:
        stmt = stmt.where(Booking.check_in_date >= filters.check_in_from)
    
    if filters.check_in_to:
        stmt = stmt.where(Booking.check_in_date <= filters.check_in_to)
    
    if filters.created_from:
        stmt = stmt.where(Booking.created_at >= filters.created_from)
    
    if filters.created_to:
        stmt = stmt.where(Booking.created_at <= filters.created_to)
    
    # Add relationships
    stmt = stmt.options(selectinload(Booking.program), selectinload(Booking.room))
    
    # Pagination
    offset = (filters.page - 1) * filters.limit
    stmt = stmt.offset(offset).limit(filters.limit)
    
    # Order by created_at desc
    stmt = stmt.order_by(Booking.created_at.desc())
    
    result = await db.execute(stmt)
    bookings = result.scalars().all()
    
    # Convert to list response format
    return [
        BookingListResponse(
            id=booking.id,
            confirmation_number=booking.confirmation_number,
            status=booking.status,
            program_title=booking.program.title if booking.program else None,
            room_name=booking.room.name,
            check_in_date=booking.check_in_date,
            check_out_date=booking.check_out_date,
            total_amount=booking.total_amount,
            paid_amount=booking.paid_amount,
            created_at=booking.created_at
        )
        for booking in bookings
    ]


@router.post("/email/send")
async def send_custom_email(
    to_email: str,
    subject: str,
    body_text: str,
    body_html: Optional[str] = None
):
    """Send custom email to guest (used by frontend)"""
    try:
        email_service = EmailService()
        success = await email_service.send_custom_email(
            to_email=to_email,
            subject=subject,
            body_text=body_text,
            body_html=body_html
        )

        if success:
            return {"success": True, "message": "Email sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")

    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get booking details (no authentication)."""

    # Use the same service as search API to ensure consistency
    booking_service = BookingService(db)
    bookings = await booking_service.search_bookings(confirmation_number=f"PW251202009{booking_id}")
    if not bookings:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking = bookings[0]

    # Use the same approach as search API
    from app.schemas.booking import BookingSearchResponse
    return BookingSearchResponse.from_orm(booking)


@router.patch("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: int,
    cancellation: BookingCancellation,
    db: AsyncSession = Depends(get_db)
):
    """Cancel a booking (no authentication)"""
    
    stmt = select(Booking).where(
        Booking.id == booking_id
    )
    result = await db.execute(stmt)
    booking = result.scalar()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.is_cancelled:
        raise BookingError("Booking is already cancelled")
    
    if booking.status == "checked_in":
        raise BookingError("Cannot cancel booking after check-in")
    
    # Cancel booking
    booking.status = "cancelled"
    booking.cancelled_at = datetime.utcnow()
    booking.cancellation_reason = cancellation.reason
    
    await db.commit()
    
    # Log cancellation
    audit_logger.log_booking_event(
        event="booking_cancelled",
        booking_id=booking.id,
        user_id=None,
        details={
            "reason": cancellation.reason,
            "refund_requested": cancellation.refund_requested
        }
    )
    
    # TODO: Process refund if requested
    
    await db.refresh(booking, ['program', 'room'])
    return BookingResponse.model_validate(booking)
