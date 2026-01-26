#!/usr/bin/env python3
"""
Simple room code fix script that can run directly on VPS
No need for psql - uses SQLAlchemy directly
"""

import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import update
from sqlalchemy import select

# Database connection - UPDATE THESE VALUES
DB_HOST = "localhost"  # or your database host
DB_PORT = 5432
DB_NAME = "pema_wellness"  # UPDATE THIS
DB_USER = "pema_user"     # UPDATE THIS
DB_PASSWORD = "pema_password"  # UPDATE THIS

# Room code mappings
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

async def check_current_status():
    """Check current room codes"""
    print("🔍 CHECKING CURRENT ROOM CODES...")

    engine = create_async_engine(f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # Get sample rooms
        result = await db.execute(
            select("id", "name", "code", "category", "bed_configuration")
            .select_from("rooms")
            .where("is_active = true")
            .limit(20)
        )

        rooms = result.fetchall()

        print(f"Found {len(rooms)} active rooms")
        print("ID\tRoom Name\tCurrent Code\tCategory\t\tBed Type")
        print("-" * 70)

        issues_found = 0
        for room in rooms:
            room_id, name, code, category, bed_config = room

            # Determine expected code
            expected_code = ROOM_CODE_MAPPING.get((category, bed_config), 'UNKNOWN')

            status = '' if code == expected_code else ''
            if code != expected_code:
                issues_found += 1

            print(f"{room_id:<2}\t{name:<10}\t{code or 'NULL':<12}\t{category:<15}\t{bed_config or 'N/A':<8} {status}")

        print(f"\n⚠️  Issues found: {issues_found} rooms need code updates")

async def apply_fixes():
    """Apply room code fixes"""
    print("\n🔧 APPLYING ROOM CODE FIXES...")

    engine = create_async_engine(f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        updates_made = 0

        for (category, bed_config), new_code in ROOM_CODE_MAPPING.items():
            # Update rooms matching this category/bed combination
            result = await db.execute(
                update("rooms")
                .where("category = ? AND bed_configuration = ? AND is_active = true")
                .values(code=new_code),
                (category, bed_config)
            )

            update_count = result.rowcount
            if update_count > 0:
                print(f"Updated {update_count} {category} {bed_config} rooms to {new_code}")
                updates_made += update_count

        await db.commit()
        print(f"\n🎉 Total updates made: {updates_made}")

async def verify_fixes():
    """Verify that fixes were applied correctly"""
    print("\nVERIFYING FIXES...")

    engine = create_async_engine(f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # Check a few sample rooms
        result = await db.execute(
            select("id", "name", "code", "category", "bed_configuration")
            .select_from("rooms")
            .where("is_active = true")
            .limit(15)
        )

        rooms = result.fetchall()

        correct_count = 0
        total_count = len(rooms)

        for room in rooms:
            room_id, name, code, category, bed_config = room
            expected_code = ROOM_CODE_MAPPING.get((category, bed_config), 'UNKNOWN')

            if code == expected_code:
                correct_count += 1
            else:
                print(f" Room {room_id} ({name}): Expected {expected_code}, Got {code}")

        print(f"Correct codes: {correct_count}/{total_count}")

        if correct_count == total_count:
            print("🎯 ALL ROOM CODES SUCCESSFULLY FIXED!")
        else:
            print(f"⚠️  {total_count - correct_count} rooms still have incorrect codes")

async def main():
    """Main function"""
    print("🏨 VPS ROOM CODE FIX SCRIPT")
    print("=" * 40)

    try:
        await check_current_status()
        await apply_fixes()
        await verify_fixes()

        print("\n🚀 ROOM CODE FIX COMPLETED!")
        print("📝 Next steps:")
        print("   1. Configure IDS credentials in your .env file")
        print("   2. Test IDS connection: POST /api/v1/ids/test-connection")
        print("   3. Enable IDS integration")

    except Exception as e:
        print(f" Error: {e}")
        print("💡 Make sure to update the database connection details at the top of this script")

if __name__ == '__main__':
    # UPDATE THESE VALUES FOR YOUR DATABASE
    print("⚠️  IMPORTANT: Update the database connection details in this script first!")
    print(f"   Current settings: {DB_HOST}:{DB_PORT}/{DB_NAME}")
    print("   User: " + ("*" * len(DB_USER)) + f" (length: {len(DB_USER)})")
    print("   Password: " + ("*" * len(DB_PASSWORD)) + f" (length: {len(DB_PASSWORD)})")

    response = input("\nHave you updated the database details? (y/N): ").strip().lower()
    if response == 'y':
        asyncio.run(main())
    else:
        print("Please update DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD at the top of this script first.")
