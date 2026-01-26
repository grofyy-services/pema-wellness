import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.postgresql import SessionLocal
from app.models.room import Room

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ROOM_TYPES_DATA = [
    {
        "name": "Standard Room",
        "code": "STD",
        "category": "Standard",
        "pricing_category": "Standard",
        "description": "A comfortable and affordable room.",
        "occupancy_max_adults": 2,
        "occupancy_max_children": 1,
        "occupancy_max_total": 3,
        "price_per_night_single": 47000,
        "price_per_night_double": 83000,
        "inventory_count": 15,
    },
    {
        "name": "Premium Balcony Room",
        "code": "PRB",
        "category": "Premium",
        "pricing_category": "Premium Balcony",
        "description": "A premium room with a private balcony.",
        "occupancy_max_adults": 2,
        "occupancy_max_children": 2,
        "occupancy_max_total": 4,
        "price_per_night_single": 60000,
        "price_per_night_double": 98000,
        "inventory_count": 19,
    },
    {
        "name": "Premium Garden Room",
        "code": "DLX",
        "category": "Deluxe",
        "pricing_category": "Premium Garden",
        "description": "A deluxe room with access to a beautiful garden.",
        "occupancy_max_adults": 2,
        "occupancy_max_children": 2,
        "occupancy_max_total": 4,
        "price_per_night_single": 64000,
        "price_per_night_double": 107000,
        "inventory_count": 19,
    },
    {
        "name": "Executive Junior Suite",
        "code": "EJS",
        "category": "Suite",
        "pricing_category": "Executive Junior Suite",
        "description": "A luxurious junior suite for executives.",
        "occupancy_max_adults": 2,
        "occupancy_max_children": 2,
        "occupancy_max_total": 4,
        "price_per_night_single": 130000,
        "price_per_night_double": 177000,
        "inventory_count": 1,
    },
    {
        "name": "Executive Junior Suite",
        "code": "EJS",
        "category": "Suite",
        "pricing_category": "Executive Junior Suite",
        "description": "A spacious junior suite with executive amenities.",
        "occupancy_max_adults": 2,
        "occupancy_max_children": 2,
        "occupancy_max_total": 4,
        "price_per_night_single": 125000,
        "price_per_night_double": 155000,
        "inventory_count": 0,
    },
    {
        "name": "Elemental Villa",
        "code": "EVL",
        "category": "Villa",
        "pricing_category": "Elemental Villa",
        "description": "An exclusive villa with elemental themes.",
        "occupancy_max_adults": 2,
        "occupancy_max_children": 2,
        "occupancy_max_total": 4,
        "price_per_night_single": 140000,
        "price_per_night_double": 180000,
        "inventory_count": 0,
    },
    {
        "name": "Pema Suite",
        "code": "PSM",
        "category": "Suite",
        "pricing_category": "Pema Suite",
        "description": "The most luxurious suite, offering the ultimate Pema experience.",
        "occupancy_max_adults": 2,
        "occupancy_max_children": 2,
        "occupancy_max_total": 4,
        "price_per_night_single": 150000,
        "price_per_night_double": 200000,
        "inventory_count": 0,
    },
]

async def seed_room_types(db: AsyncSession):
    """Seeds the database with initial room type data."""
    logger.info("Starting to seed room types...")
    for room_data in ROOM_TYPES_DATA:
        # Check if a room with the same code already exists
        result = await db.execute(select(Room).filter_by(code=room_data["code"]))
        existing_room = result.scalars().first()
        
        if existing_room:
            logger.info(f"Room type with code {room_data['code']} already exists. Updating it.")
            for key, value in room_data.items():
                setattr(existing_room, key, value)
        else:
            logger.info(f"Creating new room type with code {room_data['code']}.")
            new_room = Room(**room_data)
            db.add(new_room)
            
    await db.commit()
    logger.info("Room types seeding completed successfully.")

async def main():
    async with SessionLocal() as db:
        await seed_room_types(db)

if __name__ == "__main__":
    asyncio.run(main())
