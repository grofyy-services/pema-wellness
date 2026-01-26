#!/usr/bin/env python3
"""
Safely fix room codes in the VPS database (avoiding unique constraint violations)
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

async def safe_fix():
    """Apply room code fixes safely"""
    print("🔧 SAFE ROOM CODE FIXES (avoiding duplicates)")
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

        # First, check which codes are already taken
        existing_codes = await conn.fetch("""
            SELECT DISTINCT code FROM rooms WHERE code IS NOT NULL
        """)
        taken_codes = {row['code'] for row in existing_codes}
        print(f"📝 Existing codes in database: {sorted(taken_codes)}")
        print()

        # Apply fixes only for rooms that don't already have the correct code
        for (category, bed_config), new_code in ROOM_CODE_MAPPING.items():
            if new_code in taken_codes:
                print(f"⚠️  Code '{new_code}' already exists - checking if correctly assigned...")

                # Check if the existing code is correctly assigned
                correct_assignments = await conn.fetchval("""
                    SELECT COUNT(*) FROM rooms
                    WHERE category = $1 AND bed_configuration = $2 AND code = $3 AND is_active = true
                """, category, bed_config, new_code)

                if correct_assignments > 0:
                    print(f"   Code '{new_code}' correctly assigned to {correct_assignments} {category} {bed_config} rooms")
                    continue
                else:
                    print(f"    Code '{new_code}' exists but not assigned to {category} {bed_config} rooms")
                    continue

            # Safe update: only update rooms that currently have room numbers (not IDS codes)
            result = await conn.execute("""
                UPDATE rooms
                SET code = $1
                WHERE category = $2
                  AND bed_configuration = $3
                  AND is_active = true
                  AND code ~ '^[0-9]+$'  -- Only update if current code is numeric (room number)
            """, new_code, category, bed_config)

            update_count = int(result.split()[-1])
            if update_count > 0:
                print(f"Updated {update_count} {category} {bed_config} rooms to '{new_code}'")
                total_updates += update_count

        print()
        print(f"🎉 TOTAL SAFE UPDATES: {total_updates} rooms fixed")
        print()

        # Final verification
        print("🔍 FINAL VERIFICATION:")
        final_check = await conn.fetch("""
            SELECT
                category,
                bed_configuration,
                code,
                COUNT(*) as count,
                CASE
                    WHEN code = (
                        CASE
                            WHEN category = 'Executive' AND bed_configuration = 'Twin' THEN 'EXT'
                            WHEN category = 'Executive' AND bed_configuration = 'Queen' THEN 'EXQ'
                            WHEN category IN ('Executive Suite', 'Executive Junior Suite') AND bed_configuration = 'Super King' THEN 'SUI'
                            WHEN category = 'Pema Suite' AND bed_configuration = 'Super King' THEN 'PES'
                            WHEN category = 'Standard' AND bed_configuration = 'Twin' THEN 'STT'
                            WHEN category = 'Standard' AND bed_configuration = 'Queen' THEN 'STQ'
                            WHEN category = 'Premium Balcony' AND bed_configuration = 'Twin' THEN 'PBT'
                            WHEN category = 'Premium Balcony' AND bed_configuration = 'Queen' THEN 'PBQ'
                            WHEN category = 'Premium Garden' AND bed_configuration = 'Twin' THEN 'PGT'
                            WHEN category = 'Elemental Villa' AND bed_configuration = 'Super King' THEN 'PEV'
                            ELSE NULL
                        END
                    ) THEN 'CORRECT'
                    ELSE ' WRONG'
                END as status
            FROM rooms
            WHERE is_active = true
            GROUP BY category, bed_configuration, code
            ORDER BY category, bed_configuration
        """)

        print("Category\t\tBed Type\tCode\tCount\tStatus")
        print("-" * 65)

        correct_count = 0
        total_verified = 0

        for row in final_check:
            category = row['category']
            bed_config = row['bed_configuration']
            code = row['code']
            count = row['count']
            status = row['status']

            total_verified += count
            if status == 'CORRECT':
                correct_count += count

            print(f"{category:<15}\t{bed_config:<8}\t{code:<4}\t{count:<5}\t{status}")

        print()
        print(f"📊 FINAL RESULT: {correct_count}/{total_verified} rooms have correct IDS codes")

        if correct_count == total_verified:
            print("🎯 ALL ROOM CODES SUCCESSFULLY FIXED FOR IDS INTEGRATION!")
            print()
            print("🚀 READY FOR PRODUCTION:")
            print("1. Room codes mapped correctly")
            print("2. ⏭️  Configure IDS credentials in .env")
            print("3. ⏭️  Test IDS connection")
            print("4. ⏭️  Enable dual booking system")
        else:
            print(f"⚠️  {total_verified - correct_count} rooms still need attention")

        await conn.close()

    except Exception as e:
        print(f" Error: {e}")
        print("Please check your database connection details.")

if __name__ == '__main__':
    asyncio.run(safe_fix())
