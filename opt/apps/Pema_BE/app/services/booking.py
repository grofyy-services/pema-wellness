"""
Booking service for business logic
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from typing import Optional, List
from datetime import date, datetime
import logging

from app.models import Booking, Room, Program, User, BookingStatus
from app.core.exceptions import BookingError, ValidationError
from app.core.config import settings
from app.services.ids import IDSService
from app.models.ids import AvailabilityQuery

logger = logging.getLogger(__name__)


class BookingService:
    """Service for handling booking business logic"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def check_availability(
        self,
        room_id: int,
        check_in_date: date,
        check_out_date: date,
        exclude_booking_id: Optional[int] = None
    ) -> bool:
        """Check if room is available for the given dates - IDS ONLY"""

        # Get room inventory
        room = await self._get_room(room_id)
        if not room:
            logger.warning(f"Room {room_id} not found")
            return False

        # IDS is required for availability checks - no fallback to local
        if not settings.IDS_BASE_URL:
            logger.error("IDS integration not configured - cannot check availability")
            return False

        if not room.code:
            logger.error(f"Room {room_id} has no IDS code configured")
            return False

        try:
            ids_service = IDSService()
            # Map room code for IDS
            room_code = ids_service._map_room_code(room.code)
            rate_plan_code = ids_service._map_rate_plan_code(room.pricing_category or self._infer_pricing_category(room))

            # Use simplified availability check
            ids_responses = await ids_service.check_availability_simple(
                room_code=room_code,
                check_in_date=check_in_date,
                check_out_date=check_out_date,
                rate_plan_code=rate_plan_code
            )

            # If IDS returns empty responses, it means IDS is unavailable - consider unavailable
            if not ids_responses:
                logger.error(f"IDS returned no availability data for room {room_id} ({room_code})")
                return False

            # Check if all dates are available in IDS
            relevant_responses = [resp for resp in ids_responses if resp.room_code == room_code]
            if not relevant_responses:
                logger.error(f"No IDS responses for room code {room_code}")
                return False

            all_available = all(resp.available for resp in relevant_responses)
            if all_available:
                logger.info(f"Room {room_id} ({room_code}) available via IDS for {check_in_date} to {check_out_date}")
                return True
            else:
                logger.info(f"Room {room_id} ({room_code}) not available via IDS for {check_in_date} to {check_out_date}")
                return False

        except Exception as e:
            logger.error(f"IDS availability check failed for room {room_id}: {e}")
            # Fail-safe: if IDS is unavailable, consider room unavailable
            return False

    async def get_remaining_units(
        self,
        room_id: int,
        check_in_date: date,
        check_out_date: date,
    ) -> int:
        """Return number of remaining bookable units for a room row across the date range."""
        room = await self._get_room(room_id)
        if not room:
            return 0
        stmt = select(func.count()).select_from(Booking).where(
            and_(
                Booking.room_id == room_id,
                Booking.status.in_(
                    [
                        BookingStatus.RESERVED.value,
                        BookingStatus.CONFIRMED.value,
                        BookingStatus.CHECKED_IN.value,
                        BookingStatus.DOCTOR_APPROVED.value,
                    ]
                ),
                Booking.check_in_date < check_out_date,
                Booking.check_out_date > check_in_date,
            )
        )
        result = await self.db.execute(stmt)
        overlapping = result.scalar() or 0
        remaining = max(0, (room.inventory_count or 0) - overlapping)
        return remaining

    async def find_rooms_by_pricing_category(self, pricing_category: str) -> List[Room]:
        """Return active rooms mapped to the given brochure pricing category."""
        # First try direct match on pricing_category field
        stmt = select(Room).where(
            and_(
                Room.is_active == True,
                Room.maintenance_mode == False,
                Room.pricing_category == pricing_category
            )
        )
        result = await self.db.execute(stmt)
        direct_matches = result.scalars().all()

        # If we found direct matches, return them
        if direct_matches:
            return list(direct_matches)

        # Otherwise, fall back to loading all and filtering (for rooms with inferred categories)
        logger.warning(f"No direct pricing_category matches for {pricing_category}, falling back to inference")
        stmt = select(Room).where(and_(Room.is_active == True, Room.maintenance_mode == False))
        result = await self.db.execute(stmt)
        rooms = result.scalars().all()
        matched: List[Room] = []
        for room in rooms:
            cat = getattr(room, 'pricing_category', None)
            effective_cat = cat or self._infer_pricing_category(room)
            if effective_cat == pricing_category:
                matched.append(room)
        return matched

    async def count_available_rooms_by_category(
        self,
        pricing_category: str,
        check_in_date: date,
        check_out_date: date
    ) -> int:
        """Count available rooms within a brochure pricing category for dates."""
        rooms = await self.find_rooms_by_pricing_category(pricing_category)
        total_remaining = 0
        for room in rooms:
            # For now, keep the individual queries but add logging to identify slow ones
            remaining = await self.get_remaining_units(room.id, check_in_date, check_out_date)
            total_remaining += remaining
            logger.debug(f"Room {room.id} ({room.name}): {remaining} units remaining")
        logger.info(f"Total available units for {pricing_category}: {total_remaining}")
        return total_remaining

    async def pick_available_rooms_by_category(
        self,
        pricing_category: str,
        check_in_date: date,
        check_out_date: date,
        count: int = 1
    ) -> List[Room]:
        """Pick up to 'count' available rooms in the category for the given dates."""
        rooms = await self.find_rooms_by_pricing_category(pricing_category)
        picked: List[Room] = []
        for room in rooms:
            if len(picked) >= count:
                break
            remaining = await self.get_remaining_units(room.id, check_in_date, check_out_date)
            while remaining > 0 and len(picked) < count:
                picked.append(room)
                remaining -= 1
        return picked
    
    async def get_alternative_rooms(
        self,
        program_id: int,
        check_in_date: date,
        check_out_date: date,
        adults: int,
        children: int = 0,
        exclude_room_id: Optional[int] = None
    ) -> List[int]:
        """Find alternative rooms that can accommodate the booking"""
        
        # Get all active rooms that can accommodate the occupancy
        stmt = select(Room).where(
            and_(
                Room.is_active == True,
                Room.maintenance_mode == False,
                Room.occupancy_max_adults >= adults,
                Room.occupancy_max_children >= children,
                Room.occupancy_max_total >= (adults + children)
            )
        )
        
        if exclude_room_id:
            stmt = stmt.where(Room.id != exclude_room_id)
        
        result = await self.db.execute(stmt)
        rooms = result.scalars().all()
        
        # Check availability for each room
        available_rooms = []
        for room in rooms:
            if await self.check_availability(room.id, check_in_date, check_out_date):
                available_rooms.append(room.id)
        
        return available_rooms
    
    async def validate_booking_dates(
        self,
        check_in_date: date,
        check_out_date: date,
        program_id: Optional[int] = None
    ) -> None:
        """Validate booking dates against business rules"""
        
        # Basic date validation
        if check_in_date >= check_out_date:
            raise ValidationError("Check-out date must be after check-in date")
        
        if check_in_date < date.today():
            raise ValidationError("Check-in date cannot be in the past")
        
        # Calculate nights
        nights = (check_out_date - check_in_date).days
        
        # Check minimum stay
        if nights < settings.MINIMUM_STAY_NIGHTS:
            raise ValidationError(
                f"Minimum stay of {settings.MINIMUM_STAY_NIGHTS} nights required"
            )
        
        # Check maximum advance booking (optional business rule)
        days_in_advance = (check_in_date - date.today()).days
        max_advance_days = 365  # 1 year maximum
        
        if days_in_advance > max_advance_days:
            raise ValidationError(
                f"Bookings can only be made up to {max_advance_days} days in advance"
            )
        
        # Program-specific validations
        if program_id:
            program = await self._get_program(program_id)
            if program:
                # Check if program has specific duration limits
                if program.duration_days_max and nights > program.duration_days_max:
                    raise ValidationError(
                        f"Maximum stay for {program.title} is {program.duration_days_max} nights"
                    )

    def _infer_pricing_category(self, room: Room) -> str:
        """Map a room to brochure pricing categories using its name or category."""
        name = (room.name or "").lower()
        if "pema suite" in name:
            return "Pema Suite"
        if "elemental villa" in name:
            return "Elemental Villa"
        if "executive junior suite" in name:
            return "Executive Junior Suite"
        if "executive suite" in name:
            return "Executive Suite"
        if "premium garden" in name:
            return "Premium Garden"
        if "premium balcony" in name:
            return "Premium Balcony"
        if "executive" in name:
            return "Executive"
        if "standard" in name:
            return "Standard"
        cat = (room.category or "").lower()
        if cat == "standard":
            return "Standard"
        if cat == "premium":
            return "Premium Balcony"
        if cat == "deluxe":
            return "Premium Garden"
        if cat == "suite":
            return "Executive Suite"
        return "Standard"
    
    async def validate_occupancy(
        self,
        room_id: int,
        adults: int,
        children: int = 0,
        teens_13_18: int = 0
    ) -> List[str]:
        """Validate occupancy against room limits and return warnings"""
        
        room = await self._get_room(room_id)
        if not room:
            raise ValidationError("Room not found")
        
        warnings = []
        
        # Check basic occupancy limits
        if adults > room.occupancy_max_adults:
            raise ValidationError(
                f"Room can accommodate maximum {room.occupancy_max_adults} adults"
            )
        
        if children > room.occupancy_max_children:
            raise ValidationError(
                f"Room can accommodate maximum {room.occupancy_max_children} children"
            )
        
        total_occupants = adults + children + teens_13_18
        if total_occupants > room.occupancy_max_total:
            raise ValidationError(
                f"Room can accommodate maximum {room.occupancy_max_total} guests total"
            )
        
        # Business rule validations
        if adults > settings.MAX_ADULTS_PER_ROOM:
            raise ValidationError(
                f"Maximum {settings.MAX_ADULTS_PER_ROOM} adults allowed per room"
            )
        
        if children > settings.MAX_CHILDREN_PER_ROOM:
            raise ValidationError(
                f"Maximum {settings.MAX_CHILDREN_PER_ROOM} children allowed per room"
            )
        
        # Generate warnings for edge cases
        if teens_13_18 > 0:
            warnings.append("Teen track guidance available for guests aged 13-18")
        
        if children > 0 and adults == 1:
            warnings.append("Single adult with children may require caregiver arrangements")
        
        if total_occupants == room.occupancy_max_total:
            warnings.append("Room will be at maximum capacity")
        
        return warnings
    
    async def can_modify_booking(self, booking_id: int, user_id: int) -> bool:
        """Check if booking can be modified"""
        
        booking = await self._get_booking(booking_id)
        if not booking:
            return False
        
        # Check ownership
        if booking.user_id != user_id:
            return False
        
        # Check status
        if booking.status in ["cancelled", "completed", "checked_in"]:
            return False
        
        # Check if check-in is too close (e.g., within 24 hours)
        days_until_checkin = (booking.check_in_date - date.today()).days
        if days_until_checkin < 1:
            return False
        
        return True
    
    async def can_cancel_booking(self, booking_id: int, user_id: int) -> bool:
        """Check if booking can be cancelled"""
        
        booking = await self._get_booking(booking_id)
        if not booking:
            return False
        
        # Check ownership
        if booking.user_id != user_id:
            return False
        
        # Check status
        if booking.status in ["cancelled", "completed", "checked_in"]:
            return False
        
        return True
    
    async def calculate_refund_amount(self, booking_id: int) -> int:
        """Calculate refund amount based on cancellation policy"""
        
        booking = await self._get_booking(booking_id)
        if not booking:
            return 0
        
        # Simple refund policy:
        # - More than 7 days: Full refund
        # - 3-7 days: 50% refund
        # - Less than 3 days: No refund
        
        days_until_checkin = (booking.check_in_date - date.today()).days
        
        if days_until_checkin > 7:
            return booking.paid_amount
        elif days_until_checkin >= 3:
            return booking.paid_amount // 2
        else:
            return 0
    
    async def search_bookings(
        self,
        query: Optional[str] = None,
        guest_email: Optional[str] = None,
        guest_phone: Optional[str] = None,
        confirmation_number: Optional[str] = None,
        invoice_id: Optional[str] = None,
        ids_booking_reference: Optional[str] = None
    ) -> List[Booking]:
        """Search bookings by various criteria"""
        
        stmt = select(Booking)
        conditions = []
        
        if query:
            search_term = f"%{query}%"
            conditions.append(or_(
                Booking.guest_email.ilike(search_term),
                Booking.guest_phone.ilike(search_term),
                Booking.confirmation_number.ilike(search_term),
                Booking.invoice_id.ilike(search_term),
                Booking.ids_booking_reference.ilike(search_term)
            ))
            
        if guest_email:
            conditions.append(Booking.guest_email.ilike(f"%{guest_email}%"))
            
        if guest_phone:
            conditions.append(Booking.guest_phone.ilike(f"%{guest_phone}%"))
            
        if confirmation_number:
            conditions.append(Booking.confirmation_number == confirmation_number)
            
        if invoice_id:
            conditions.append(Booking.invoice_id == invoice_id)
            
        if ids_booking_reference:
            conditions.append(Booking.ids_booking_reference == ids_booking_reference)
            
        if conditions:
            stmt = stmt.where(and_(*conditions))
        
        # Order by creation date desc
        stmt = stmt.order_by(Booking.created_at.desc())
        
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def _get_room(self, room_id: int) -> Optional[Room]:
        """Get room by ID"""
        stmt = select(Room).where(Room.id == room_id)
        result = await self.db.execute(stmt)
        return result.scalar()
    
    async def _get_program(self, program_id: int) -> Optional[Program]:
        """Get program by ID"""
        stmt = select(Program).where(Program.id == program_id)
        result = await self.db.execute(stmt)
        return result.scalar()
    
    async def _get_booking(self, booking_id: int) -> Optional[Booking]:
        """Get booking by ID"""
        stmt = select(Booking).where(Booking.id == booking_id)
        result = await self.db.execute(stmt)
        return result.scalar()
