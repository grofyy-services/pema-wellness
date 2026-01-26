#!/usr/bin/env python3
"""
Final room code fix for IDS integration
"""

import asyncio
import asyncpg

# Database connection details
DB_HOST = "82.25.104.195"
DB_PORT = 55432
DB_NAME = "pema_wellness"
DB_USER = "pema_user"
DB_PASSWORD = "pema_password"

# Complete room mapping: (room_id, ids_code)
ROOM_UPDATES = [
    (3, 'EXT-101'), (4, 'EXQ-102'), (5, 'EXQ-103'), (6, 'EXQ-104'),
    (7, 'EXQ-105'), (8, 'EXQ-106'), (9, 'EXT-107'), (10, 'EXT-108'),
    (11, 'EXQ-109'), (12, 'SUI-110'), (13, 'EXQ-111'), (14, 'EXQ-112'),
    (15, 'SUI-113'), (16, 'STT-201'), (17, 'STT-202'), (18, 'STT-203'),
    (19, 'STT-204'), (20, 'STT-205'), (21, 'STQ-206'), (22, 'STT-207'),
    (23, 'STT-208'), (24, 'STQ-209'), (25, 'STT-210'), (26, 'STT-211'),
    (27, 'STT-212'), (28, 'STT-213'), (29, 'STT-214'), (30, 'STT-215'),
    (31, 'PBT-301'), (32, 'PBT-302'), (33, 'PBT-303'), (34, 'PBQ-304'),
    (35, 'PBT-305'), (36, 'PBT-306'), (37, 'PBT-307'), (38, 'PBT-308'),
    (39, 'PBQ-309'), (40, 'PBT-310'), (41, 'PBQ-311'), (42, 'PBT-312'),
    (43, 'PBQ-313'), (44, 'PBT-314'), (45, 'PBT-315'), (46, 'PBT-316'),
    (47, 'PBT-317'), (48, 'PBT-318'), (49, 'PBT-319'), (50, 'PGT-401'),
    (51, 'PGT-402'), (52, 'PGT-403'), (53, 'PGT-404'), (54, 'PGT-405'),
    (55, 'PGT-406'), (56, 'PGT-407'), (57, 'PGT-408'), (58, 'PGT-409'),
    (59, 'PGT-410'), (60, 'PGT-411'), (61, 'PGT-412'), (62, 'PGT-413'),
    (63, 'PGT-414'), (64, 'PGT-415'), (65, 'PGT-416'), (66, 'PGT-417'),
    (67, 'PGT-418'), (68, 'PGT-419')
]

async def apply_all_fixes():
    """Apply all room code fixes"""
    print("🎯 FINAL ROOM CODE FIX FOR IDS INTEGRATION")
    print("=" * 50)

    try:
        print("🔍 Connecting to database...")
        conn = await asyncpg.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )

        print("Connected successfully!")
        print()

        total_updates = 0
        failed_updates = []

        print("🔧 Applying room code updates...")
        print("Progress: ", end="", flush=True)

        for i, (room_id, ids_code) in enumerate(ROOM_UPDATES):
            try:
                result = await conn.execute("""
                    UPDATE rooms SET code = $1 WHERE id = $2 AND is_active = true
                """, ids_code, room_id)

                update_count = int(result.split()[-1])
                if update_count > 0:
                    total_updates += 1
                else:
                    failed_updates.append(f"Room {room_id}: No rows updated")

                # Progress indicator
                if (i + 1) % 10 == 0:
                    print(f"{i+1}", end="", flush=True)
                elif (i + 1) % 5 == 0:
                    print(".", end="", flush=True)

            except Exception as e:
                failed_updates.append(f"Room {room_id}: {e}")

        print(" ✓")
        print()
        print(f"🎉 UPDATE COMPLETE: {total_updates}/{len(ROOM_UPDATES)} rooms updated")

        if failed_updates:
            print(f" Failed updates: {len(failed_updates)}")
            for failure in failed_updates[:5]:  # Show first 5
                print(f"   {failure}")
            if len(failed_updates) > 5:
                print(f"   ... and {len(failed_updates) - 5} more")

        # Final verification
        print("\n🔍 FINAL VERIFICATION:")
        verification = await conn.fetch("""
            SELECT
                COUNT(*) as total_rooms,
                COUNT(CASE WHEN code LIKE '%-%' THEN 1 END) as rooms_with_ids_codes,
                COUNT(CASE WHEN code NOT LIKE '%-%' AND code ~ '^[0-9]+$' THEN 1 END) as rooms_with_old_codes
            FROM rooms WHERE is_active = true
        """)

        stats = verification[0]
        print(f"   Total rooms: {stats['total_rooms']}")
        print(f"   Rooms with new IDS codes: {stats['rooms_with_ids_codes']}")
        print(f"   Rooms still with old codes: {stats['rooms_with_old_codes']}")

        # Sample of updated codes
        print("\n SAMPLE OF UPDATED CODES:")
        samples = await conn.fetch("""
            SELECT id, name, code FROM rooms
            WHERE is_active = true AND code LIKE '%-%'
            ORDER BY id LIMIT 5
        """)

        for sample in samples:
            print(f"   Room {sample['id']} ({sample['name']}): {sample['code']}")

        if stats['rooms_with_ids_codes'] == stats['total_rooms']:
            print("\n🎯 SUCCESS! ALL ROOM CODES UPDATED FOR IDS INTEGRATION!")
            print("\n🚀 NEXT STEPS:")
            print("1. Room codes properly mapped")
            print("2. ⏭️  Configure IDS credentials in .env")
            print("3. ⏭️  Test IDS connection")
            print("4. ⏭️  Enable dual booking system")
        else:
            print(f"\n⚠️  {stats['rooms_with_old_codes']} rooms still need updates")

        await conn.close()

    except Exception as e:
        print(f" Error: {e}")
        print("Please check your database connection details.")

if __name__ == '__main__':
    asyncio.run(apply_all_fixes())
