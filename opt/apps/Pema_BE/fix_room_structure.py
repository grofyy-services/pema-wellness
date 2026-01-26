#!/usr/bin/env python3
"""
Fix room structure to support IDS inventory by room type codes
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, update, delete, text
from app.models.room import Room, RoomCategory
from app.core.config import settings

# IDS room code to category mapping
IDS_ROOM_MAPPING = {
    'STD': {'category': RoomCategory.STANDARD, 'name': 'Standard Room'},
    'EXT': {'category': RoomCategory.EXECUTIVE, 'name': 'Executive Room'},
    'PBQ': {'category': RoomCategory.PREMIUM_BALCONY, 'name': 'Premium Balcony Room'},
    'PBT': {'category': RoomCategory.PREMIUM_BALCONY, 'name': 'Premium Balcony Room'},
    'PGT': {'category': RoomCategory.PREMIUM_GARDEN, 'name': 'Premium Garden Room'},
    'STQ': {'category': RoomCategory.STANDARD, 'name': 'Standard Room'},
    'STT': {'category': RoomCategory.STANDARD, 'name': 'Standard Room'},
    'SUI': {'category': RoomCategory.EXECUTIVE_SUITE, 'name': 'Executive Suite'},
    'EXQ': {'category': RoomCategory.EXECUTIVE, 'name': 'Executive Room'},
}

async def fix_room_structure():
    """Convert individual room records to room type records with proper codes"""

    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        try:
            print("🔍 Analyzing current room structure...")

            # Get current room counts by category
            result = await session.execute(text("""
                SELECT category, COUNT(*) as count, SUM(inventory_count) as total_inventory
                FROM rooms
                GROUP BY category
                ORDER BY category
            """))

            current_counts = {row.category: {'count': row.count, 'inventory': row.total_inventory}
                            for row in result}

            print("📊 Current room structure:")
            for category, data in current_counts.items():
                print(f"  {category}: {data['count']} records, {data['inventory']} total rooms")

            print("\n🔄 Updating room records to use proper type codes...")

            # Update room records to use proper type codes instead of room numbers
            # We'll pick one representative room from each category and update it to be the type record

            # Get one room from each category to convert to type records
            category_updates = {
                'Standard': {
                    'code': 'STQ',
                    'name': 'Standard Room',
                    'inventory_count': 15
                },
                'Executive': {
                    'code': 'EXT',
                    'name': 'Executive Room',
                    'inventory_count': 11
                },
                'Premium Balcony': {
                    'code': 'PBQ',
                    'name': 'Premium Balcony Room',
                    'inventory_count': 19
                },
                'Premium Garden': {
                    'code': 'PGT',
                    'name': 'Premium Garden Room',
                    'inventory_count': 19
                },
                'Executive Suite': {
                    'code': 'SUI',
                    'name': 'Executive Suite',
                    'inventory_count': 2
                }
            }

            updated_rooms = []
            for category, update_data in category_updates.items():
                # Find the first room in this category
                stmt = select(Room).where(Room.category == category).limit(1)
                result = await session.execute(stmt)
                room = result.scalar_one_or_none()

                if room:
                    # Update this room to be the type record
                    room.code = update_data['code']
                    room.name = update_data['name']
                    room.inventory_count = update_data['inventory_count']
                    updated_rooms.append(room)
                    print(f"  Updated {category} -> {room.code} ({room.inventory_count} rooms)")
                else:
                    print(f"  ⚠️ No room found for category: {category}")

            # Now delete the remaining individual room records (keeping only the type records)
            if updated_rooms:
                type_ids = [room.id for room in updated_rooms]
                # Delete rooms that are not in our updated type records
                await session.execute(
                    delete(Room).where(Room.id.not_in(type_ids))
                )

            await session.commit()
            print(" Room type records updated successfully!")

            # Verify the new structure
            result = await session.execute(select(Room))
            rooms = result.scalars().all()

            print("\n📋 New room structure:")
            for room in rooms:
                print(f"  {room.code}: {room.name} ({room.category}) - {room.inventory_count} rooms")

            print("\n🎉 Room structure conversion completed successfully!")
        except Exception as e:
            print(f" Error during conversion: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()

if __name__ == "__main__":
    asyncio.run(fix_room_structure())
