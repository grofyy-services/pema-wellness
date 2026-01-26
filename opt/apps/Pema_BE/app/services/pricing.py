"""
Pricing service for calculating booking prices
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from typing import Dict, Optional
from datetime import date
import logging

from app.models import Program, Room, PricingBand
from app.core.config import settings

logger = logging.getLogger(__name__)


class PricingService:
    """Service for handling pricing calculations"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def calculate_price(
        self,
        program_id: Optional[int],
        room_id: int,
        nights: int,
        adults: int,
        children: int = 0,
        check_in_date: Optional[date] = None,
        children_ages: Optional[list[int]] = None,
        teens_13_18: int = 0,
        caregiver_required: bool = False,
        caregiver_stay_with_guest: bool = False,
        caregiver_meal: Optional[str] = None,
        adults_distribution: Optional[list[int]] = None
    ) -> Dict:
        """Calculate total price for booking"""

        logger.info(f"Pricing calculation started: room_id={room_id}, adults={adults}, nights={nights}")

        # Get room; program is optional (decided later by doctor)
        room = await self._get_room(room_id)
        if not room:
            raise ValueError("Room not found")
        program = await self._get_program(program_id) if program_id else None

        logger.info(f"Room and program loaded: room={room.name}, program={program.title if program else None}")
        
        # Decide adult count including teens (charged at adult rates)
        effective_adults = adults + max(0, teens_13_18)

        # Try pricing bands first
        logger.info(f"Looking for pricing band: program_id={program_id}, room_id={room_id}, nights={nights}")
        pricing_band = await self._find_pricing_band(program_id, room_id, nights, check_in_date)
        logger.info(f"Pricing band found: {pricing_band.id if pricing_band else None}")

        # Use the room's stored pricing category
        pricing_category = room.pricing_category

        base_price = 0
        price_source = "not_set"
        rooms_breakdown: list[dict] = []
        per_night_rate = None

        if pricing_band:
            price_source = "band"
            base_price = pricing_band.calculate_price(nights, effective_adults, children)
            # For display, estimate per-night rate if possible
            if pricing_band.pricing_type == "per_night" and nights > 0:
                if effective_adults <= 1:
                    per_night_rate = pricing_band.price_single
                else:
                    per_night_rate = pricing_band.price_double
        
        # Fallback to room's own pricing if no band applies
        else:
            price_source = "room_default"
            # Room model stores rupees; use directly for total calculation
            base_price = room.get_price_for_occupancy(effective_adults, children) * nights
            if nights > 0:
                per_night_rate = base_price // nights

        extra_adult_price = 0  # max 2 adults enforced elsewhere
        # Children meal charges: 5-12 = 7000/day each; under-4 = 0
        children_price = 0
        if children and children_ages:
            for age in children_ages:
                if 5 <= age <= 12:
                    children_price += 7000 * nights  # 7000 rupees per night
                # under 4 free

        # Caregiver charges
        caregiver_price = 0
        caregiver_details = {}
        if caregiver_required:
            # Check for complimentary categories (Executive, Suites, Pema Suite, Elemental Villa) - applies to both sharing and separate
            is_complimentary = False
            if pricing_category:
                pc_lower = pricing_category.lower()
                if "executive" in pc_lower or "suite" in pc_lower or "villa" in pc_lower:
                    is_complimentary = True

            if caregiver_stay_with_guest:
                if is_complimentary:
                    caregiver_details["stay_with_guest"] = 0
                    caregiver_details["complimentary"] = True
                else:
                    caregiver_price += settings.CAREGIVER_STAY_WITH_GUEST_PRICE_INR * nights
                    caregiver_details["stay_with_guest"] = settings.CAREGIVER_STAY_WITH_GUEST_PRICE_INR * nights

                # Meal is charged if sharing
                if caregiver_meal == "restaurant_dining":
                    caregiver_price += settings.CAREGIVER_MEAL_PRICE_INR * nights
                    caregiver_details["meal_restaurant"] = settings.CAREGIVER_MEAL_PRICE_INR * nights
                elif caregiver_meal == "simple":
                    caregiver_details["meal_simple"] = 0
            else:
                if is_complimentary:
                    caregiver_details["separate_room"] = 0
                    caregiver_details["complimentary"] = True
                else:
                    caregiver_room_rates = settings.CAREGIVER_SEPARATE_ROOM_PRICES_INR
                    if pricing_category in caregiver_room_rates:
                        caregiver_room_cost = caregiver_room_rates[pricing_category] * nights
                        caregiver_price += caregiver_room_cost
                        caregiver_details["separate_room"] = caregiver_room_cost
                    else:
                        # Not applicable: must be booked at guest pricing (single occupancy)
                        caregiver_guest_rate = per_night_rate
                        if caregiver_guest_rate is not None:
                            caregiver_guest_cost = caregiver_guest_rate * nights # In rupees
                            caregiver_price += caregiver_guest_cost
                            caregiver_details["separate_room_guest_pricing"] = caregiver_guest_cost
                        else:
                            caregiver_details["separate_room_not_applicable"] = True

                # Meal is included (0 charge) if separate room
                if caregiver_meal == "restaurant_dining":
                    caregiver_details["meal_restaurant"] = 0
                elif caregiver_meal == "simple":
                    caregiver_details["meal_simple"] = 0

        # Calculate program fee (unused for now)
        program_fee = 0
        
        total_price = base_price + extra_adult_price + children_price + caregiver_price + program_fee

        logger.info(f"Pricing calculation completed: total_price={total_price}, base_price={base_price}")

        return {
            "base_price": base_price,
            "extra_adult_price": extra_adult_price,
            "children_price": children_price,
            "caregiver_price": caregiver_price,
            "caregiver_details": caregiver_details,
            "program_fee": program_fee,
            "total_price": total_price,
            "nights": nights,
            "pricing_band_id": pricing_band.id if pricing_band else None,
            "price_source": price_source,
            "per_night_rate_used": per_night_rate,
            "rooms_breakdown": rooms_breakdown
        }

    async def _get_room(self, room_id: int) -> Optional[Room]:
        """Get room by ID"""
        stmt = select(Room).where(Room.id == room_id)
        result = await self.db.execute(stmt)
        return result.scalar()
    
    async def _get_program(self, program_id: Optional[int]) -> Optional[Program]:
        """Get program by ID"""
        if program_id is None:
            return None
        stmt = select(Program).where(Program.id == program_id)
        result = await self.db.execute(stmt)
        return result.scalar()
    
    async def _find_pricing_band(
        self,
        program_id: Optional[int],
        room_id: int,
        nights: int,
        check_in_date: Optional[date] = None
    ) -> Optional[PricingBand]:
        """Find most specific applicable pricing band"""
        
        # Priority order:
        # 1. Specific program + room
        # 2. Specific program only
        # 3. Specific room only
        # 4. Global pricing band
        
        queries = []
        if program_id is not None:
            queries.append(
                select(PricingBand).where(
                    and_(
                        PricingBand.program_id == program_id,
                        PricingBand.room_id == room_id,
                        PricingBand.is_active == True,
                        PricingBand.min_nights <= nights,
                        or_(PricingBand.max_nights.is_(None), PricingBand.max_nights >= nights)
                    )
                )
            )
            queries.append(
                select(PricingBand).where(
                    and_(
                        PricingBand.program_id == program_id,
                        PricingBand.room_id.is_(None),
                        PricingBand.is_active == True,
                        PricingBand.min_nights <= nights,
                        or_(PricingBand.max_nights.is_(None), PricingBand.max_nights >= nights)
                    )
                )
            )
        queries.append(
            select(PricingBand).where(
                and_(
                    PricingBand.program_id.is_(None),
                    PricingBand.room_id == room_id,
                    PricingBand.is_active == True,
                    PricingBand.min_nights <= nights,
                    or_(PricingBand.max_nights.is_(None), PricingBand.max_nights >= nights)
                )
            )
        )
        queries.append(
            select(PricingBand).where(
                and_(
                    PricingBand.program_id.is_(None),
                    PricingBand.room_id.is_(None),
                    PricingBand.is_active == True,
                    PricingBand.min_nights <= nights,
                    or_(PricingBand.max_nights.is_(None), PricingBand.max_nights >= nights)
                )
            )
        )
        
        # Add seasonal filters if check_in_date is provided
        if check_in_date:
            for i, query in enumerate(queries):
                queries[i] = query.where(
                    or_(
                        PricingBand.valid_from.is_(None),
                        PricingBand.valid_from <= check_in_date
                    )
                ).where(
                    or_(
                        PricingBand.valid_until.is_(None),
                        PricingBand.valid_until >= check_in_date
                    )
                )
        
        # Execute queries in priority order
        for query in queries:
            query = query.order_by(PricingBand.priority.desc(), PricingBand.created_at.desc())
            result = await self.db.execute(query)
            pricing_band = result.scalar()
            if pricing_band:
                return pricing_band
        
        return None
    
    async def get_starting_price(self, program_id: int) -> Optional[int]:
        """Get starting price for a program"""
        
        # Find the lowest price across all pricing bands for this program
        stmt = select(PricingBand).where(
            and_(
                or_(PricingBand.program_id == program_id, PricingBand.program_id.is_(None)),
                PricingBand.is_active == True
            )
        ).order_by(PricingBand.price_single.asc())
        
        result = await self.db.execute(stmt)
        pricing_band = result.scalar()
        
        if pricing_band:
            return pricing_band.price_single
        
        # Fallback to program base price (already in rupees)
        program = await self._get_program(program_id)
        return program.price_base if program and program.price_base else None
