#!/usr/bin/env python3
"""
Direct IDS Booking Test - Run from API container
Tests booking creation with FR77WDF890 payload
"""

import asyncio
import json
from datetime import date
from app.services.ids import IDSService

async def test_ids_booking():
    """Test IDS booking creation directly"""

    print("🎯 DIRECT IDS BOOKING TEST - FR77WDF890")
    print("=" * 50)

    # Booking data from FR77WDF890.xml
    booking_data = {
        'unique_id': 'FR77WDF890',  # Channel reservation number
        'check_in_date': date(2025, 11, 15),
        'check_out_date': date(2025, 11, 16),
        'adults': 3,
        'children': 0,
        'room_code': 'EXT',
        'rate_plan_code': 'RR0925',
        'total_amount': 560280,  # ₹5,602.80 in paise
        'currency_code': 'INR',
        'guest_info': {
            'first_name': 'Test Rese',
            'last_name': 'IDS',
            'email': 'test@idsnext.com',
            'phone': 'NA',
            'country': 'India'
        },
        'special_requests': 'Channel booking from MakeMyTrip - Test reservation FX#-5194'
    }

    print("📋 Booking Details:")
    print(f"   Channel Reservation: {booking_data['unique_id']}")
    print(f"   Check-in: {booking_data['check_in_date']}")
    print(f"   Check-out: {booking_data['check_out_date']}")
    print(f"   Guests: {booking_data['adults']} adults")
    print(f"   Room: {booking_data['room_code']}")
    print(f"   Amount: ₹{booking_data['total_amount'] // 100:,}")
    print()

    # Initialize IDS service
    ids_service = IDSService()

    print("📡 Sending booking to IDS from production API container...")
    print("🔍 Using IDS endpoint: https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017")

    try:
        result = await ids_service.create_booking(booking_data)

        print("\n IDS Response:")
        print(json.dumps(result, indent=2))

        if result.get('success'):
            print("\n SUCCESS: Booking notification sent to IDS!")
            print(f"🎫 Channel Reservation Number: {booking_data['unique_id']}")
            print("🔍 IDS should now process this booking and assign PMS reservation number")
            print("📞 Contact IDS Support with reference FX#-5194 to verify")
            return booking_data['unique_id']
        else:
            error_msg = result.get('error', 'Unknown error')
            print(f"\n FAILED: {error_msg}")

            # Check if it's a 500 error from IDS
            if '500' in str(error_msg):
                print("⚠️ IDS returned 500 error - this may be normal if IDS has restrictions")
                print("📞 Please contact IDS support with reference FX#-5194")
                print("🎫 They can check if booking FR77WDF890 was received despite the error")

            return None

    except Exception as e:
        print(f"\n ERROR: {str(e)}")
        return None

if __name__ == "__main__":
    print("🏭 RUNNING DIRECT IDS TEST FROM API CONTAINER")
    print("This bypasses nginx and tests IDS integration directly")
    print()

    channel_reservation = asyncio.run(test_ids_booking())

    if channel_reservation:
        print(f"\n🎯 TEST COMPLETE - Channel Reservation Number: {channel_reservation}")
        print("📞 Contact IDS Support with reference FX#-5194")
        print("🔍 Ask them to check if booking FR77WDF890 exists in their system")
    else:
        print("\n Test failed - check IDS credentials and network connectivity")
