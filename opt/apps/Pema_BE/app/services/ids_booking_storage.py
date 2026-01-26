"""
IDS Booking Storage Service

This service is responsible for storing IDS booking data in our local database.
It follows the Single Responsibility Principle by only handling the storage aspect
of IDS bookings, without affecting existing IDS integration logic.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, Dict, Any, List
from datetime import date
import logging

from app.models.booking import Booking, BookingStatus
from app.models.room import Room
from app.db.postgresql import get_db

logger = logging.getLogger(__name__)


class IDSBookingStorageService:
    """
    Service for storing IDS booking data in local database.

    This service handles the storage of booking information received from IDS
    booking creation, ensuring we maintain a local record of all IDS bookings.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def store_ids_booking(self,
                               guest_first_name: str,
                               guest_last_name: str,
                               guest_email: str,
                               guest_phone: str,
                               check_in_date: date,
                               check_out_date: date,
                               ids_booking_reference: str,
                               special_requests: Optional[str] = None,
                               adults: int = 1,
                               children: int = 0,
                               room_code: Optional[str] = None,
                               rate_plan_code: Optional[str] = None,
                               total_amount: Optional[float] = None,
                               deposit_amount: Optional[float] = None,
                               other_guests: Optional[List[str]] = None,
                               estimate_details: Optional[Dict[str, Any]] = None) -> Booking:
        """
        Store IDS booking data in local database.

        Args:
            guest_first_name: Guest's first name
            guest_last_name: Guest's last name
            guest_email: Guest's email address
            guest_phone: Guest's phone number
            check_in_date: Check-in date
            check_out_date: Check-out date
            ids_booking_reference: Unique reference from IDS
            special_requests: Any special requests from guest
            adults: Number of adults
            children: Number of children
            room_code: IDS room code (for reference)
            rate_plan_code: IDS rate plan code (for reference)
            total_amount: Total booking amount in paise
            estimate_details: Full estimate response to store
        
        Returns:
            Booking: The created booking record
        """
        try:
            # Calculate nights
            nights = (check_out_date - check_in_date).days

            # Create occupancy details
            occupancy_details = {
                "adults_total": adults,
                "children_total_under_4": 0,  # Not specified in IDS booking, default to 0
                "children_total_5to12": children,
                "teens_13to18": 0,  # Not specified in IDS booking, default to 0
                "number_of_rooms": 1,  # IDS bookings are typically single room
                "ids_room_code": room_code,
                "ids_rate_plan_code": rate_plan_code
            }

            # Set default values for required fields
            total_amount_rupees = total_amount or 0.0
            deposit_amount_rupees = deposit_amount if deposit_amount is not None else 0.0

            # If estimate_details has a subtotal, use that instead (more reliable)
            if estimate_details and 'price_breakdown' in estimate_details and 'subtotal' in estimate_details['price_breakdown']:
                total_amount_rupees = float(estimate_details['price_breakdown']['subtotal'])
                logger.info(f"Using subtotal from estimate_details: {total_amount_rupees}")

            # Amounts are already in rupees for database storage
            total_amount = int(total_amount_rupees)
            deposit_amount = int(deposit_amount_rupees)
            balance_amount = total_amount - deposit_amount

            logger.warning(f"Booking storage: rupees(total={total_amount_rupees}, deposit={deposit_amount_rupees}) -> rupees(total={total_amount}, deposit={deposit_amount}, balance={balance_amount})")

            # Find an existing room for IDS bookings
            room_id = await self._get_or_create_ids_room(room_code)

            # Create booking record
            booking = Booking(
                user_id=None,  # IDS bookings don't have registered users
                program_id=None,  # IDS bookings are direct room bookings
                room_id=room_id,
                check_in_date=check_in_date,
                check_out_date=check_out_date,
                nights=nights,
                occupancy_details=occupancy_details,
                status=BookingStatus.CONFIRMED.value,  # IDS bookings start as confirmed
                total_amount=total_amount,
                deposit_amount=deposit_amount,
                paid_amount=deposit_amount,  # Deposit amount paid
                balance_amount=balance_amount,
                full_payment_required=True,  # IDS bookings require full payment
                special_requests=special_requests,
                guest_first_name=guest_first_name,
                guest_last_name=guest_last_name,
                guest_email=guest_email,
                guest_phone=guest_phone,
                guest_country="India",  # Default country
                other_guests=other_guests,
                number_of_rooms=1,
                caregiver_required=False,  # Default to False for IDS bookings
                caregiver_stay_with_guest=False,
                private_transfer=False,
                doctor_review_required=False,  # Skip medical review for IDS bookings
                ids_booking_reference=ids_booking_reference,  # Store IDS reference
                estimate_details=estimate_details  # Store estimate response
            )

            # Add to database
            self.db.add(booking)
            await self.db.commit()
            await self.db.refresh(booking)

            # Generate confirmation number
            booking.confirmation_number = booking.generate_confirmation_number()
            await self.db.commit()

            logger.info(f"Successfully stored IDS booking: {ids_booking_reference} -> Local booking ID: {booking.id}")

            return booking

        except Exception as e:
            logger.error(f"Failed to store IDS booking {ids_booking_reference}: {e}")
            await self.db.rollback()
            raise

    async def get_booking_by_ids_reference(self, ids_booking_reference: str) -> Optional[Booking]:
        """
        Retrieve a booking by its IDS booking reference.

        Args:
            ids_booking_reference: The IDS booking reference

        Returns:
            Booking or None: The booking record if found
        """
        from sqlalchemy import select

        stmt = select(Booking).where(Booking.ids_booking_reference == ids_booking_reference)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def update_booking_status(self, ids_booking_reference: str, status: str, additional_data: Optional[Dict[str, Any]] = None) -> bool:
        """
        Update the status of an IDS booking.

        Args:
            ids_booking_reference: The IDS booking reference
            status: New status
            additional_data: Additional data to update

        Returns:
            bool: True if update was successful
        """
        try:
            booking = await self.get_booking_by_ids_reference(ids_booking_reference)
            if not booking:
                logger.warning(f"Booking not found for IDS reference: {ids_booking_reference}")
                return False

            booking.status = status

            if additional_data:
                for key, value in additional_data.items():
                    if hasattr(booking, key):
                        setattr(booking, key, value)

            await self.db.commit()
            logger.info(f"Updated IDS booking {ids_booking_reference} status to {status}")
            return True

        except Exception as e:
            logger.error(f"Failed to update IDS booking status {ids_booking_reference}: {e}")
            await self.db.rollback()
            return False

    async def _get_or_create_ids_room(self, room_code: Optional[str] = None) -> int:
        """
        Get or create a room for IDS bookings.

        Args:
            room_code: The IDS room code

        Returns:
            int: The room ID to use for the booking
        """
        try:
            from sqlalchemy import select

            # First try to find an existing room
            if room_code:
                stmt = select(Room).where(Room.code == room_code, Room.is_active == True)
                result = await self.db.execute(stmt)
                room = result.scalar_one_or_none()
                if room:
                    return room.id

            # If no room found with the code, try to find any active room
            stmt = select(Room).where(Room.is_active == True).limit(1)
            result = await self.db.execute(stmt)
            room = result.scalar_one_or_none()
            if room:
                return room.id

            # If no active rooms exist, create a dummy room for IDS bookings
            logger.warning("No active rooms found, creating dummy room for IDS booking")
            dummy_room = Room(
                name="IDS Booking Room",
                category="standard",
                code=room_code or "IDS_DEFAULT",
                description="Auto-created room for IDS bookings",
                occupancy_max_adults=4,
                occupancy_max_children=2,
                occupancy_max_total=6,
                price_per_night_single=100,  # ₹100 in rupees
                price_per_night_double=150,  # ₹150 in rupees
                inventory_count=10,
                is_active=True,
                maintenance_mode=False
            )

            self.db.add(dummy_room)
            await self.db.flush()  # Get the ID without committing
            return dummy_room.id

        except Exception as e:
            logger.error(f"Failed to get/create room for IDS booking: {e}")
            # Last resort - return a dummy ID that might work if there are rooms
            return 1
