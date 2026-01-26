#!/usr/bin/env python3
"""
Check room codes in the database locally
"""

import asyncio
import asyncpg

# Database connection details - UPDATE THESE!
DB_HOST = "82.25.104.195"
DB_PORT = 55432
DB_NAME = "pema_wellness"
DB_USER = "pema_user"
DB_PASSWORD = "pema_password"

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

async def check_rooms():
    """Check room codes in the database"""
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
        print("=" * 60)

        # Check total rooms
        total_rooms = await conn.fetchval("SELECT COUNT(*) FROM rooms WHERE is_active = true")
        print(f"📊 Total active rooms: {total_rooms}")
        print()

        # Check room data
        print("🏨 SAMPLE ROOM DATA:")
        rooms = await conn.fetch("""
            SELECT id, name, category, bed_configuration, code
            FROM rooms
            WHERE is_active = true
            ORDER BY id
            LIMIT 10
        """)

        print("ID\tName\t\tCategory\t\tBed Config\tCode")
        print("-" * 80)
        for room in rooms:
            bed_config = room['bed_configuration'] or 'NULL'
            code = room['code'] or 'NULL'
            print(f"{room['id']:<2}\t{room['name']:<10}\t{room['category']:<15}\t{bed_config:<10}\t{code}")

        print()
        print("🔍 ROOM CODE ANALYSIS:")

        # Check current codes vs required codes
        analysis = await conn.fetch("""
            SELECT
                category,
                bed_configuration,
                code,
                COUNT(*) as count
            FROM rooms
            WHERE is_active = true
            GROUP BY category, bed_configuration, code
            ORDER BY category, bed_configuration, code
        """)

        print("Category\t\tBed Type\tCurrent Code\tCount\tRequired Code\tStatus")
        print("-" * 100)

        needs_update = 0
        total_analyzed = 0

        for row in analysis:
            category = row['category']
            bed_config = row['bed_configuration'] or ''
            current_code = row['code']
            count = row['count']

            # Get required code
            required_code = ROOM_CODE_MAPPING.get((category, bed_config), 'UNKNOWN')

            # Check if correct
            if current_code == required_code:
                status = "OK"
            else:
                status = " FIX NEEDED"
                needs_update += count

            total_analyzed += count

            print(f"{category:<15}\t{bed_config:<8}\t{current_code or 'NULL':<12}\t{count:<5}\t{required_code:<12}\t{status}")

        print()
        print("📊 SUMMARY:")
        print(f"   Total rooms analyzed: {total_analyzed}")
        print(f"   Rooms needing updates: {needs_update}")

        if needs_update > 0:
            print("\n🔧 REQUIRED FIXES:")
            print("Run these UPDATE statements in pgAdmin:")

            for (category, bed_config), required_code in ROOM_CODE_MAPPING.items():
                print(f"UPDATE rooms SET code = '{required_code}' WHERE category = '{category}' AND bed_configuration = '{bed_config}' AND is_active = true;")
        else:
            print("\n🎉 All room codes are already correct!")

        await conn.close()

    except Exception as e:
        print(f" Error: {e}")
        print("\n💡 Troubleshooting:")
        print("1. Check if the database connection details are correct")
        print("2. Ensure the database server allows remote connections")
        print("3. Verify the password and user credentials")

if __name__ == '__main__':
    print("🏨 ROOM CODE CHECKER")
    print("Connecting to VPS database...")
    print()

    asyncio.run(check_rooms())
