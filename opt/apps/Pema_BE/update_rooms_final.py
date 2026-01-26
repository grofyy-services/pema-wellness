#!/usr/bin/env python3
"""
Final Room Update Script for IDS Integration
Updates all rooms with correct IDS codes based on category + bed configuration
"""

import asyncio
import asyncpg
from typing import Dict

# Room mappings: room_number -> IDS_code
ROOM_CODE_MAPPING = {
    # Executive Twin
    "101": "EXT", "107": "EXT", "108": "EXT",
    # Executive Queen
    "102": "EXQ", "103": "EXQ", "104": "EXQ", "105": "EXQ", "106": "EXQ", "109": "EXQ", "111": "EXQ", "112": "EXQ",
    # Executive Junior Suite Super King
    "110": "SUI", "113": "SUI",
    # Pema Suite Super King
    "114": "PES", "115": "PES", "116": "PES", "117": "PES", "118": "PES",
    # Standard Twin
    "201": "STT", "202": "STT", "203": "STT", "204": "STT", "205": "STT", "207": "STT", "208": "STT", "210": "STT", "211": "STT", "212": "STT", "213": "STT", "214": "STT", "215": "STT",
    # Standard Queen
    "206": "STQ", "209": "STQ",
    # Premium Balcony Twin
    "301": "PBT", "302": "PBT", "303": "PBT", "305": "PBT", "306": "PBT", "307": "PBT", "308": "PBT", "310": "PBT", "312": "PBT", "314": "PBT", "315": "PBT", "316": "PBT", "317": "PBT", "318": "PBT", "319": "PBT",
    # Premium Balcony Queen
    "304": "PBQ", "309": "PBQ", "311": "PBQ", "313": "PBQ",
    # Premium Garden Twin
    "401": "PGT", "402": "PGT", "403": "PGT", "404": "PGT", "405": "PGT", "406": "PGT", "407": "PGT", "408": "PGT", "409": "PGT", "410": "PGT", "411": "PGT", "412": "PGT", "413": "PGT", "414": "PGT", "415": "PGT", "416": "PGT", "417": "PGT", "418": "PGT", "419": "PGT",
    # Elemental Villa Super King
    "501": "PEV", "502": "PEV", "503": "PEV", "504": "PEV", "505": "PEV"
}

async def update_room_codes():
    """Update all room codes to match IDS specification"""

    conn = await asyncpg.connect(
        host='82.25.104.195',
        port=55432,
        database='pema_wellness',
        user='pema_user',
        password='pema_password'
    )

    print('🏨 UPDATING ROOM CODES FOR IDS INTEGRATION')
    print('=' * 55)

    # Get all rooms
    rooms = await conn.fetch('SELECT id, name, code FROM rooms ORDER BY name')

    updated_count = 0
    for room in rooms:
        room_name = room['name']
        if room_name.startswith('Room '):
            room_number = room_name.replace('Room ', '')

            if room_number in ROOM_CODE_MAPPING:
                new_code = ROOM_CODE_MAPPING[room_number]
                current_code = room['code']

                if current_code != new_code:
                    await conn.execute(
                        'UPDATE rooms SET code = $1 WHERE id = $2',
                        new_code, room['id']
                    )
                    print(f'Updated {room_name}: {current_code} → {new_code}')
                    updated_count += 1
                else:
                    print(f'{room_name}: {current_code} (already correct)')
            else:
                print(f'⚠️  {room_name}: No mapping found')

    print(f'\n📊 UPDATE SUMMARY:')
    print(f'   Total rooms: {len(rooms)}')
    print(f'   Updated: {updated_count}')

    # Verification
    print('\n🔍 VERIFICATION:')
    verification = await conn.fetch("""
        SELECT code, COUNT(*) as count
        FROM rooms
        WHERE is_active = true
        GROUP BY code
        ORDER BY code
    """)

    print('IDS Code → Room Count:')
    for row in verification:
        print(f'   {row["code"]}: {row["count"]} rooms')

    # Check for any issues
    issues = []
    if updated_count == 0:
        issues.append("No rooms were updated - check mappings")

    total_rooms = sum(row['count'] for row in verification)
    expected_total = len(ROOM_CODE_MAPPING)

    if total_rooms != expected_total:
        issues.append(f"Room count mismatch: expected {expected_total}, got {total_rooms}")

    if issues:
        print(f'\n⚠️  ISSUES FOUND:')
        for issue in issues:
            print(f'   - {issue}')
    else:
        print('\nALL ROOMS SUCCESSFULLY UPDATED!')
        print('\n🎯 IDS INTEGRATION READY:')
        print('   - Room codes match IDS specification')
        print('   - Multiple rooms can share same IDS code')
        print('   - Pricing fields preserved')

    await conn.close()

if __name__ == "__main__":
    asyncio.run(update_room_codes())
