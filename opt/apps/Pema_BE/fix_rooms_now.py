#!/usr/bin/env python3
"""
Fix room codes in the VPS database
"""

import asyncio
import asyncpg

# Database connection details
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

async def apply_fixes():
    """Apply room code fixes"""
    print("🔧 APPLYING ROOM CODE FIXES TO VPS DATABASE")
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

        # Apply each fix
        for (category, bed_config), new_code in ROOM_CODE_MAPPING.items():
            result = await conn.execute("""
                UPDATE rooms
                SET code = $1
                WHERE category = $2
                  AND bed_configuration = $3
                  AND is_active = true
            """, new_code, category, bed_config)

            update_count = int(result.split()[-1])  # Get affected rows count
            if update_count > 0:
                print(f"Updated {update_count} {category} {bed_config} rooms to '{new_code}'")
                total_updates += update_count

        print()
        print(f"🎉 TOTAL UPDATES: {total_updates} rooms fixed")
        print()

        # Verify the fixes
        print("🔍 VERIFYING FIXES:")
        verification = await conn.fetch("""
            SELECT
                category,
                bed_configuration,
                code,
                COUNT(*) as count
            FROM rooms
            WHERE is_active = true
            GROUP BY category, bed_configuration, code
            ORDER BY category, bed_configuration
        """)

        print("Category\t\tBed Type\tCode\tCount\tStatus")
        print("-" * 60)

        correct_count = 0
        total_verified = 0

        for row in verification:
            category = row['category']
            bed_config = row['bed_configuration']
            code = row['code']
            count = row['count']

            expected_code = ROOM_CODE_MAPPING.get((category, bed_config), 'UNKNOWN')

            if code == expected_code:
                status = "OK"
                correct_count += count
            else:
                status = " STILL WRONG"

            total_verified += count
            print(f"{category:<15}\t{bed_config:<8}\t{code:<4}\t{count:<5}\t{status}")

        print()
        print(f"📊 VERIFICATION: {correct_count}/{total_verified} rooms have correct codes")

        if correct_count == total_verified:
            print("🎯 ALL ROOM CODES SUCCESSFULLY FIXED!")
            print()
            print("🚀 NEXT STEPS:")
            print("1. Configure IDS credentials in your .env file")
            print("2. Test IDS connection: POST /api/v1/ids/test-connection")
            print("3. Enable IDS integration")
            print("4. Your dual booking system is ready!")
        else:
            print(f"⚠️  {total_verified - correct_count} rooms still need fixes")

        await conn.close()

    except Exception as e:
        print(f" Error: {e}")
        print("Please check your database connection details.")

if __name__ == '__main__':
    asyncio.run(apply_fixes())
