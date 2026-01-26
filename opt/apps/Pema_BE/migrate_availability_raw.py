#!/usr/bin/env python3
"""
Migrate room_availability table from room_id to room_code structure using raw SQL
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings

async def migrate_availability_raw():
    """Migrate existing availability data using raw SQL"""

    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        try:
            print("🔍 Analyzing current availability data...")

            # Get current availability data grouped by room category and date
            result = await session.execute(text("""
                SELECT
                    r.category,
                    ra.date,
                    SUM(ra.available_count) as total_available,
                    COUNT(ra.id) as record_count
                FROM room_availability ra
                JOIN rooms r ON ra.room_id = r.id
                GROUP BY r.category, ra.date
                ORDER BY r.category, ra.date
            """))

            availability_by_category = {}
            for row in result:
                category = row.category
                if category not in availability_by_category:
                    availability_by_category[category] = []
                availability_by_category[category].append({
                    'date': row.date,
                    'total_available': row.total_available,
                    'record_count': row.record_count
                })

            print("📊 Current availability by category:")
            for category, records in availability_by_category.items():
                total_records = sum(r['record_count'] for r in records)
                print(f"  {category}: {total_records} individual records across {len(records)} dates")

            print("\n🗑️ Clearing existing availability data...")
            # Delete all existing availability records
            await session.execute(text("DELETE FROM room_availability"))
            await session.commit()

            print(" Creating new availability records by room code...")

            # Map categories to room codes
            category_to_code = {
                'Standard': 'STD',
                'Executive': 'EXT',
                'Premium Balcony': 'PBQ',
                'Premium Garden': 'PGT',
                'Executive Suite': 'SUI'
            }

            total_new_records = 0
            for category, records in availability_by_category.items():
                room_code = category_to_code.get(category)
                if not room_code:
                    print(f"⚠️ No room code mapping for category: {category}")
                    continue

                for record in records:
                    # Insert directly using raw SQL
                    await session.execute(text("""
                        INSERT INTO room_availability
                        (room_code, date, available_count, is_closed, is_closed_to_arrival,
                         is_closed_to_departure, source, created_at, updated_at)
                        VALUES (:room_code, :date, :available_count, false, false, false,
                               'migrated', NOW(), NOW())
                    """), {
                        'room_code': room_code,
                        'date': record['date'],
                        'available_count': record['total_available']
                    })

                print(f"  {category} -> {room_code}: {len(records)} availability records")
                total_new_records += len(records)

            await session.commit()
            print(f" Migration completed! Created {total_new_records} new availability records")

            # Verify the migration
            result = await session.execute(text("""
                SELECT room_code, COUNT(*) as records, MIN(date) as min_date, MAX(date) as max_date
                FROM room_availability
                GROUP BY room_code
                ORDER BY room_code
            """))

            print("\n📋 New availability structure:")
            for row in result:
                print(f"  {row.room_code}: {row.records} records ({row.min_date} to {row.max_date})")

        except Exception as e:
            print(f" Error during migration: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()

if __name__ == "__main__":
    asyncio.run(migrate_availability_raw())
