#!/usr/bin/env python3
"""
Fix Room Codes for IDS Integration

This script updates room codes in the database from room numbers to proper IDS codes
based on category + bed type combinations.
"""

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import update
from app.core.config import settings
from app.models.room import Room

# Mapping of category + bed type to IDS code
ROOM_CODE_MAPPING = {
    ('Executive', 'Twin'): 'EXT',
    ('Executive', 'Queen'): 'EXQ',
    ('Executive Suite', 'Super King'): 'SUI',
    ('Executive Junior Suite', 'Super King'): 'SUI',
    ('Pema Suite', 'Super King'): 'PES',
    ('Standard', 'Twin'): 'STT',
    ('Standard', 'Queen'): 'STQ',
    ('Premium Balcony', 'Twin'): 'PBT',
    ('Premium Balcony', 'Queen'): 'PBQ',
    ('Premium Garden', 'Twin'): 'PGT',
    ('Elemental Villa', 'Super King'): 'PEV',
}

async def fix_room_codes():
    """Update room codes to proper IDS codes"""

    print('🔧 FIXING ROOM CODES FOR IDS INTEGRATION')
    print('=' * 50)

    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # Get all active rooms
        from sqlalchemy import select
        stmt = select(Room).where(Room.is_active == True)
        result = await db.execute(stmt)
        rooms = result.scalars().all()

        print(f'📊 Found {len(rooms)} active rooms in database')

        updates_made = 0
        errors = []

        for room in rooms:
            # Determine correct IDS code
            key = (room.category, room.bed_configuration)
            correct_code = ROOM_CODE_MAPPING.get(key)

            if correct_code:
                if room.code != correct_code:
                    print(f'🔄 Updating Room {room.id} ({room.name}): {room.code} → {correct_code}')

                    # Update the room
                    await db.execute(
                        update(Room)
                        .where(Room.id == room.id)
                        .values(code=correct_code)
                    )
                    updates_made += 1
                else:
                    print(f'Room {room.id} ({room.name}) already has correct code: {room.code}')
            else:
                error_msg = f' No mapping found for Room {room.id} ({room.name}): Category="{room.category}", Bed="{room.bed_configuration}"'
                print(error_msg)
                errors.append(error_msg)

        # Commit all changes
        await db.commit()

        print(f'\\n🎉 UPDATE COMPLETE!')
        print(f'   Rooms updated: {updates_made}')
        print(f'    Errors: {len(errors)}')

        if errors:
            print('\\n⚠️  ERRORS FOUND:')
            for error in errors:
                print(f'   {error}')

        # Verification
        print('\\n🔍 VERIFICATION:')
        stmt = select(Room).where(Room.is_active == True)
        result = await db.execute(stmt)
        rooms = result.scalars().all()

        correct_count = 0
        total_count = len(rooms)

        for room in rooms:
            key = (room.category, room.bed_configuration)
            expected_code = ROOM_CODE_MAPPING.get(key)

            if expected_code and room.code == expected_code:
                correct_count += 1
            elif expected_code:
                print(f'    Room {room.id} ({room.name}): Expected {expected_code}, Got {room.code}')

        print(f'   Correct codes: {correct_count}/{total_count}')

        if correct_count == total_count:
            print('\\n🎯 ALL ROOM CODES SUCCESSFULLY UPDATED FOR IDS INTEGRATION!')
        else:
            print(f'\\n⚠️  {total_count - correct_count} rooms still need code updates')

if __name__ == '__main__':
    asyncio.run(fix_room_codes())
