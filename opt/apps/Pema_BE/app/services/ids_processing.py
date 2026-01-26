"""
IDS Data Processing Services

This module contains functions to process parsed IDS XML data and update the local database.
These are the production implementations that would replace the TODO comments in the API endpoints.
"""

import logging
from typing import Dict, Any, List
from datetime import datetime, date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, insert, select

from app.models.room import Room
from app.models.pricing import PricingBand
from app.models.booking import Booking
from app.models.contact import ContactUs
from app.models.medical_form import MedicalForm
from app.models.notification import Notification

logger = logging.getLogger(__name__)


class IDSDataProcessor:
    """Processes parsed IDS XML data and updates the local database"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def process_inventory_data(self, parsed_data: Dict[str, Any]) -> None:
        """
        Process inventory data from IDS and update local database

        Args:
            parsed_data: Parsed inventory notification data
        """
        logger.info(f"Processing {len(parsed_data['inventories'])} inventory items")

        for inventory in parsed_data['inventories']:
            sac = inventory['status_application_control']
            inv_count = inventory['inv_count']

            # Map IDS codes to internal codes
            room_code = self._map_room_code(sac['inv_type_code'])
            rate_plan_code = self._map_rate_plan_code(sac['rate_plan_code'])

            try:
                # Update room inventory in database
                await self._update_room_inventory(
                    room_code=room_code,
                    rate_plan_code=rate_plan_code,
                    start_date=sac['start'],
                    end_date=sac['end'],
                    available_count=inv_count['count']
                )

                logger.info(f"Updated inventory: {room_code}/{rate_plan_code} = {inv_count['count']} rooms")

            except Exception as e:
                logger.error(f"Failed to update inventory for {room_code}/{rate_plan_code}: {e}")

    async def process_availability_data(self, parsed_data: Dict[str, Any]) -> None:
        """
        Process availability/restriction data from IDS and update local database

        Args:
            parsed_data: Parsed availability notification data
        """
        logger.info(f"Processing {len(parsed_data['avail_status_messages'])} availability messages")

        for message in parsed_data['avail_status_messages']:
            sac = message['status_application_control']
            restriction = message['restriction_status']

            if sac:
                # Map IDS codes to internal codes
                room_code = self._map_room_code(sac['inv_type_code'])
                rate_plan_code = self._map_rate_plan_code(sac['rate_plan_code'])

                try:
                    # Update availability restrictions
                    await self._update_room_restrictions(
                        room_code=room_code,
                        rate_plan_code=rate_plan_code,
                        start_date=sac['start'],
                        end_date=sac['end'],
                        restriction_status=restriction.get('status') if restriction else None,
                        restriction_type=restriction.get('restriction') if restriction else None,
                        min_los=int(restriction.get('min_los', 0)) if restriction and restriction.get('min_los') else None,
                        max_los=int(restriction.get('max_los', 0)) if restriction and restriction.get('max_los') else None
                    )

                    logger.info(f"Updated restrictions: {room_code}/{rate_plan_code} - "
                              f"Status={restriction.get('status') if restriction else 'Open'}")

                except Exception as e:
                    logger.error(f"Failed to update restrictions for {room_code}/{rate_plan_code}: {e}")

    async def process_booking_data(self, parsed_data: Dict[str, Any]) -> None:
        """
        Process booking data from IDS and update local database

        Args:
            parsed_data: Parsed booking notification data
        """
        logger.info(f"Processing {len(parsed_data['hotel_reservations'])} reservations")

        for reservation in parsed_data['hotel_reservations']:
            try:
                # Extract booking details
                booking_data = await self._extract_booking_details(reservation)

                # Create or update booking in database
                booking_id = await self._create_or_update_booking(booking_data)

                # Update room availability
                await self._update_booking_availability(booking_data, booking_id)

                # Send notifications
                await self._send_booking_notifications(booking_data, booking_id)

                logger.info(f"Processed booking: {booking_data['unique_id']} - "
                          f"{booking_data['guest_name']} for {len(booking_data['room_stays'])} rooms")

            except Exception as e:
                logger.error(f"Failed to process reservation {reservation.get('unique_id', {}).get('id', 'unknown')}: {e}")

    async def process_room_type_delta(self, parsed_data: Dict[str, Any]) -> None:
        """
        Process room type delta data from IDS and update local database

        This handles delta updates (changes) to room types and rate plans from IDS.

        Args:
            parsed_data: Parsed room type delta data from RN_HotelRatePlanRQ
        """
        logger.info(f"Processing room type delta: hotel_code={parsed_data['hotel_code']}, "
                   f"room_types={len(parsed_data['room_types'])}, "
                   f"rate_plans={len(parsed_data['rate_plans'])}")

        try:
            # Process room type updates
            for room_type in parsed_data['room_types']:
                try:
                    await self._update_room_type(room_type, parsed_data['hotel_code'])
                except Exception as e:
                    logger.error(f"Failed to update room type {room_type['inv_type_code']}: {e}")

            # Process rate plan updates
            for rate_plan in parsed_data['rate_plans']:
                try:
                    await self._update_rate_plan(rate_plan, parsed_data['hotel_code'])
                except Exception as e:
                    logger.error(f"Failed to update rate plan {rate_plan['rate_plan_code']}: {e}")

            logger.info("Successfully processed room type delta updates")

        except Exception as e:
            logger.error(f"Failed to process room type delta: {e}")
            raise

    async def _update_room_type(self, room_type_data: Dict[str, Any], hotel_code: str) -> None:
        """
        Update or create room type in database based on IDS delta data

        Args:
            room_type_data: Room type data from IDS delta
            hotel_code: Hotel code for the room type
        """
        from app.models.room import Room, RoomCategory
        from sqlalchemy import select, update

        try:
            # Map IDS room type codes to our internal categories
            room_category_mapping = {
                'STD': RoomCategory.STANDARD,
                'EXT': RoomCategory.EXECUTIVE,
                'DLX': RoomCategory.PREMIUM_GARDEN,  # Could be DELUXE
                'SUI': RoomCategory.PEMA_SUITE,      # Could be SUITE
            }

            category = room_category_mapping.get(room_type_data['inv_type_code'], RoomCategory.STANDARD)

            # Check if room type exists
            stmt = select(Room).where(Room.code == room_type_data['inv_type_code'])
            result = await self.db.execute(stmt)
            existing_room = result.scalar_one_or_none()

            if existing_room:
                # Update existing room
                update_data = {
                    'name': room_type_data['name'],
                    'category': category.value,
                    'inventory_count': room_type_data['quantity'],
                    'is_active': room_type_data['is_room_active'],
                    'description': room_type_data['room_description']
                }

                # Update occupancy if provided
                if room_type_data.get('max_occupancy'):
                    update_data['occupancy_max_total'] = int(room_type_data['max_occupancy'])

                await self.db.execute(
                    update(Room).where(Room.id == existing_room.id).values(**update_data)
                )
                logger.info(f"Updated room type: {room_type_data['inv_type_code']}")

            else:
                # Create new room type (this is less common for deltas)
                logger.warning(f"Room type {room_type_data['inv_type_code']} not found for update")

        except Exception as e:
            logger.error(f"Failed to update room type {room_type_data['inv_type_code']}: {e}")
            raise

    async def _update_rate_plan(self, rate_plan_data: Dict[str, Any], hotel_code: str) -> None:
        """
        Update rate plan information based on IDS delta data

        Args:
            rate_plan_data: Rate plan data from IDS delta
            hotel_code: Hotel code for the rate plan
        """
        # For now, we'll log the rate plan updates
        # In a full implementation, this would update pricing tables
        logger.info(f"Rate plan delta received: {rate_plan_data['rate_plan_code']} "
                   f"for room {rate_plan_data['inv_type_code']} "
                   f"({rate_plan_data['meal_plan_code']}) "
                   f"from {rate_plan_data['start']} to {rate_plan_data['end']}")

        # TODO: Implement actual rate plan updates in pricing tables
        # This would involve updating PricingBand records or similar

    def _map_room_code(self, ids_room_code: str) -> str:
        """Map IDS room codes to internal room codes"""
        # This would typically be a lookup table or configuration
        mapping = {
            'EXT': 'EXT',  # Executive Room
            'DLX': 'DLX',  # Deluxe Room
            'STD': 'STD',  # Standard Room
        }
        return mapping.get(ids_room_code, ids_room_code)

    def _map_rate_plan_code(self, ids_rate_code: str) -> str:
        """Map IDS rate plan codes to internal rate plan codes"""
        # This would typically be a lookup table or configuration
        mapping = {
            'RACK': 'RACK',  # Rack Rate
            'BAR': 'BAR',   # Best Available Rate
            'CORP': 'CORP', # Corporate Rate
        }
        return mapping.get(ids_rate_code, ids_rate_code)

    async def _update_room_inventory(self, room_code: str, rate_plan_code: str,
                                   start_date: str, end_date: str, available_count: int) -> None:
        """Update room inventory in database for room types"""
        from app.models.availability import RoomAvailability
        from app.models.room import Room, RoomCategory
        from datetime import datetime, timedelta
        from sqlalchemy import select, update, insert

        try:
            # Parse dates
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
            end = datetime.strptime(end_date, '%Y-%m-%d').date()

            # Map IDS room codes to room categories
            category_mapping = {
                'STD': RoomCategory.STANDARD.value,
                'EXT': RoomCategory.EXECUTIVE.value,
                'EXQ': RoomCategory.EXECUTIVE.value,
                'PBQ': RoomCategory.PREMIUM_BALCONY.value,
                'PBT': RoomCategory.PREMIUM_BALCONY.value,
                'PGT': RoomCategory.PREMIUM_GARDEN.value,
                'STQ': RoomCategory.STANDARD.value,
                'STT': RoomCategory.STANDARD.value,
                'SUI': RoomCategory.EXECUTIVE_SUITE.value,
            }

            # Get the category for this room code
            room_category = category_mapping.get(room_code)
            if not room_category:
                logger.warning(f"No category mapping found for IDS room code: {room_code}")
                return

            # Map category to room code for storage
            room_code_mapping = {
                'Standard': 'STD',
                'Executive': 'EXT',
                'Premium Balcony': 'PBQ',
                'Premium Garden': 'PGT',
                'Executive Suite': 'SUI'
            }

            storage_room_code = room_code_mapping.get(room_category)
            if not storage_room_code:
                logger.warning(f"No storage room code mapping for category {room_category}")
                return

            logger.info(f"Storing availability for IDS code {room_code} as room code {storage_room_code} (category: {room_category})")

            # Update availability for each date in the range - ONE record per date per room type
            current_date = start
            while current_date <= end:
                # Check if availability record exists for this room code and date
                stmt = select(RoomAvailability).where(
                    RoomAvailability.room_code == storage_room_code,
                    RoomAvailability.date == current_date,
                    RoomAvailability.rate_plan_code == rate_plan_code
                )
                result = await self.db.execute(stmt)
                existing_availability = result.scalar_one_or_none()

                if existing_availability:
                    # Update existing record
                    await self.db.execute(
                        update(RoomAvailability).where(RoomAvailability.id == existing_availability.id).values(
                            available_count=available_count,
                            source="ids_sync",
                            updated_at=datetime.now()
                        )
                    )
                else:
                    # Create new availability record
                    new_availability = RoomAvailability(
                        room_code=storage_room_code,
                        date=current_date,
                        available_count=available_count,
                        rate_plan_code=rate_plan_code,
                        source="ids_sync"
                    )
                    self.db.add(new_availability)

                current_date += timedelta(days=1)

            await self.db.commit()
            logger.info(f"Updated inventory for room type {storage_room_code} (IDS code {room_code}): "
                       f"{start_date} to {end_date} = {available_count} rooms available")

        except Exception as e:
            logger.error(f"Failed to update room inventory for {room_code}: {e}")
            await self.db.rollback()
            raise

    async def _update_room_restrictions(self, room_code: str, rate_plan_code: str,
                                      start_date: str, end_date: str,
                                      restriction_status: str = None, restriction_type: str = None,
                                      min_los: int = None, max_los: int = None) -> None:
        """Update room restrictions in database"""
        # This is a placeholder - actual implementation would update restriction tables
        logger.info(f"Would update restrictions: {room_code}/{rate_plan_code} "
                   f"from {start_date} to {end_date} - Status: {restriction_status}, "
                   f"MinLOS: {min_los}, MaxLOS: {max_los}")

    async def _extract_booking_details(self, reservation: Dict[str, Any]) -> Dict[str, Any]:
        """Extract booking details from reservation data"""
        unique_id = reservation.get('unique_id', {})
        room_stays = reservation.get('room_stays', [])
        services = reservation.get('services', [])

        # Extract guest information
        guest_service = next((s for s in services if s.get('service_code') == 'GUEST_INFO'), {})
        guest_name = guest_service.get('guest_name', {})
        contact_info = guest_service.get('contact_info', {})

        # Extract room stay information
        primary_room_stay = room_stays[0] if room_stays else {}
        time_span = primary_room_stay.get('time_span', {})
        guest_counts = primary_room_stay.get('guest_counts', [])
        total = primary_room_stay.get('total', {})

        return {
            'unique_id': unique_id.get('id'),
            'unique_id_type': unique_id.get('type'),
            'guest_name': f"{guest_name.get('given_name', '')} {guest_name.get('surname', '')}".strip(),
            'check_in_date': time_span.get('start_date'),
            'check_out_date': time_span.get('end_date'),
            'adults': sum(gc.get('count', 0) for gc in guest_counts if gc.get('age_qualifying_code') == '10'),
            'children': sum(gc.get('count', 0) for gc in guest_counts if gc.get('age_qualifying_code') != '10'),
            'total_amount': float(total.get('amount_after_tax', 0)),
            'currency': total.get('currency_code', 'INR'),
            'room_stays': room_stays,
            'phones': contact_info.get('phones', []),
            'emails': contact_info.get('emails', []),
            'message_content_code': reservation.get('message_content_code')
        }

    async def _create_or_update_booking(self, booking_data: Dict[str, Any]) -> int:
        """Create or update booking in database"""
        # This is a placeholder - actual implementation would create/update booking records
        logger.info(f"Would create/update booking: {booking_data['unique_id']} for {booking_data['guest_name']}")
        return 12345  # Placeholder booking ID

    async def _update_booking_availability(self, booking_data: Dict[str, Any], booking_id: int) -> None:
        """Update room availability for the booking"""
        # This is a placeholder - actual implementation would reduce available inventory
        logger.info(f"Would update availability for booking {booking_id}")

    async def _send_booking_notifications(self, booking_data: Dict[str, Any], booking_id: int) -> None:
        """Send booking confirmation and notifications"""
        # This is a placeholder - actual implementation would send emails/SMS notifications
        logger.info(f"Would send notifications for booking {booking_id} to {booking_data['emails']}")
