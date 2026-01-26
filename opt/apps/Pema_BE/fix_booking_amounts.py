#!/usr/bin/env python3
"""
Script to fix incorrect total_amount and balance_amount values in existing bookings.

This script updates bookings where total_amount was incorrectly stored as deposit_amount
instead of the full subtotal from estimate_details.
"""

import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, update
from app.db.postgresql import AsyncSessionLocal
from app.models.booking import Booking

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def fix_booking_amounts():
    """Fix total_amount and balance_amount for existing bookings"""
    async with AsyncSessionLocal() as session:
        try:
            # First, get all bookings that have estimate_details
            result = await session.execute(
                text('SELECT id, total_amount, deposit_amount, paid_amount, balance_amount, estimate_details FROM bookings WHERE estimate_details IS NOT NULL')
            )
            bookings = result.fetchall()

            logger.info(f"Found {len(bookings)} bookings with estimate_details")

            updated_count = 0

            for booking in bookings:
                booking_id, current_total, deposit_amount, paid_amount, current_balance, estimate_details = booking

                # Check if estimate_details has the correct subtotal
                if (estimate_details and
                    'price_breakdown' in estimate_details and
                    'subtotal' in estimate_details['price_breakdown']):

                    correct_total = estimate_details['price_breakdown']['subtotal']
                    correct_balance = correct_total - (paid_amount or 0)

                    # Only update if the values are different
                    if current_total != correct_total or current_balance != correct_balance:
                        logger.info(f"Updating booking {booking_id}:")
                        logger.info(f"  Current: total={current_total}, balance={current_balance}")
                        logger.info(f"  Correct: total={correct_total}, balance={correct_balance}")

                        # Update the booking
                        await session.execute(
                            update(Booking).where(Booking.id == booking_id).values(
                                total_amount=correct_total,
                                balance_amount=correct_balance
                            )
                        )
                        updated_count += 1

            await session.commit()
            logger.info(f"Successfully updated {updated_count} bookings")

        except Exception as e:
            await session.rollback()
            logger.error(f"Error fixing booking amounts: {e}")
            raise

async def main():
    logger.info("Starting booking amounts fix...")
    await fix_booking_amounts()
    logger.info("Booking amounts fix completed!")

if __name__ == "__main__":
    asyncio.run(main())
