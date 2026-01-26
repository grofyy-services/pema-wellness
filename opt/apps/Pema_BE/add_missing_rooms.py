#!/usr/bin/env python3
"""
Add Missing Rooms Script
Adds the missing Pema Suites and Elemental Villas to complete the inventory
"""

import asyncio
import asyncpg

async def add_missing_rooms():
    """Add missing Pema Suites and Elemental Villas"""

    conn = await asyncpg.connect(
        host='82.25.104.195',
        port=55432,
        database='pema_wellness',
        user='pema_user',
        password='pema_password'
    )

    print('🏨 ADDING MISSING ROOMS')
    print('=' * 35)

    # Get all existing room names
    existing_rooms = await conn.fetch('SELECT name FROM rooms ORDER BY name')
    existing_names = {room['name'] for room in existing_rooms}

    # Expected missing rooms
    missing_rooms = [
        # Pema Suites
        ('Room 114', 'Pema Suite', 'Super King', 'PES', 150000, 200000),
        ('Room 115', 'Pema Suite', 'Super King', 'PES', 150000, 200000),
        ('Room 116', 'Pema Suite', 'Super King', 'PES', 150000, 200000),
        ('Room 117', 'Pema Suite', 'Super King', 'PES', 150000, 200000),
        ('Room 118', 'Pema Suite', 'Super King', 'PES', 150000, 200000),
        # Elemental Villas
        ('Room 501', 'Elemental Villa', 'Super King', 'PEV', 180000, 230000),
        ('Room 502', 'Elemental Villa', 'Super King', 'PEV', 180000, 230000),
        ('Room 503', 'Elemental Villa', 'Super King', 'PEV', 180000, 230000),
        ('Room 504', 'Elemental Villa', 'Super King', 'PEV', 180000, 230000),
        ('Room 505', 'Elemental Villa', 'Super King', 'PEV', 180000, 230000),
    ]

    added_count = 0
    for name, category, bed_config, code, single_price, double_price in missing_rooms:
        if name not in existing_names:
            # Get a template room to copy other fields from
            template = await conn.fetchrow('SELECT * FROM rooms LIMIT 1')

            await conn.execute('''
                INSERT INTO rooms (
                    name, code, category, description, occupancy_max_adults, occupancy_max_children,
                    occupancy_max_total, price_per_night_single, price_per_night_double,
                    price_per_night_extra_adult, price_per_night_child, inventory_count,
                    refundable_full_payment_required, deposit_amount, amenities, features,
                    featured_image, gallery_images, floor_plan_image, is_active, maintenance_mode,
                    bed_configuration, room_size_sqft, max_extra_beds, medical_equipment_compatible,
                    wheelchair_accessible, created_at, updated_at, pricing_category
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
                    $19, $20, $21, $22, $23, $24, $25, $26, NOW(), NOW(), $27
                )
            ''',
            name, code, category,
            f'{category} with {bed_config} bed configuration',  # description
            template['occupancy_max_adults'], template['occupancy_max_children'],
            template['occupancy_max_total'], single_price, double_price,
            template['price_per_night_extra_adult'], template['price_per_night_child'],
            template['inventory_count'], template['refundable_full_payment_required'],
            template['deposit_amount'], template['amenities'], template['features'],
            template['featured_image'], template['gallery_images'], template['floor_plan_image'],
            True, False,  # is_active, maintenance_mode
            bed_config, template['room_size_sqft'], template['max_extra_beds'],
            template['medical_equipment_compatible'], template['wheelchair_accessible'],
            category  # pricing_category
            )

            print(f'Added {name}: {category} ({bed_config}) - {code}')
            added_count += 1
        else:
            print(f'⚠️  {name} already exists')

    print(f'\n📊 Added {added_count} rooms')

    # Final verification
    print('\n🎯 FINAL VERIFICATION:')
    final_rooms = await conn.fetch('SELECT category, code, COUNT(*) as count FROM rooms GROUP BY category, code ORDER BY category, code')

    total_rooms = 0
    for row in final_rooms:
        print(f'   {row["category"]:<18} {row["code"]:<3}: {row["count"]} rooms')
        total_rooms += row['count']

    print(f'\n📈 Total rooms: {total_rooms}')

    if total_rooms == 76:
        print('ALL ROOMS COMPLETE! IDS integration ready.')
        print('\n🚀 NEXT STEPS:')
        print('1. Room codes properly mapped')
        print('2. ⏭️  Configure IDS credentials in .env')
        print('3. ⏭️  Test IDS connection: POST /api/v1/ids/test-connection')
        print('4. ⏭️  Enable dual booking system')
        print('5. 🎉 Your system is production-ready!')
    else:
        print(f'⚠️  Still missing {76 - total_rooms} rooms')

    await conn.close()

if __name__ == "__main__":
    asyncio.run(add_missing_rooms())
