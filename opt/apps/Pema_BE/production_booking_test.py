#!/usr/bin/env python3
"""
Production Booking Test - Run this on the production server
Tests booking creation using the FR77WDF890.xml payload data
"""

import asyncio
import json
from datetime import date
from app.services.ids import IDSService

async def test_production_booking():
    """
    Test booking creation on production server using XML payload data
    """

    print("🎯 PRODUCTION BOOKING TEST - FR77WDF890")
    print("=" * 50)

    # Booking data extracted from FR77WDF890.xml
    booking_data = {
        'unique_id': 'FR77WDF890',  # Channel reservation number
        'check_in_date': date(2025, 11, 15),  # Future date
        'check_out_date': date(2025, 11, 16),  # 1-night stay
        'adults': 3,  # From GuestCount
        'children': 0,
        'room_code': 'EXT',  # Executive Room
        'rate_plan_code': 'RR0925',  # Rate plan from XML
        'total_amount': 560280,  # ₹5,602.80 in paise
        'currency_code': 'INR',
        'guest_info': {
            'first_name': 'Test Rese',
            'last_name': 'IDS',
            'email': 'test@idsnext.com',
            'phone': 'NA',
            'country': 'India'
        },
        'special_requests': 'Channel booking from MakeMyTrip - Test reservation FX#-5194',
        'channel': 'MakeMyTrip'
    }

    print("📋 Booking Details:")
    print(f"   Channel Reservation: {booking_data['unique_id']}")
    print(f"   Channel: {booking_data['channel']}")
    print(f"   Check-in: {booking_data['check_in_date']}")
    print(f"   Check-out: {booking_data['check_out_date']}")
    print(f"   Guests: {booking_data['adults']} adults")
    print(f"   Room: {booking_data['room_code']}")
    print(f"   Amount: ₹{booking_data['total_amount'] // 100:,}")
    print(f"   Guest: {booking_data['guest_info']['first_name']} {booking_data['guest_info']['last_name']}")
    print()

    # Initialize IDS service
    ids_service = IDSService()

    print("📡 Sending booking to IDS from production server...")

    try:
        result = await ids_service.create_booking(booking_data)

        print(" IDS Response:")
        print(json.dumps(result, indent=2))

        if result.get('success'):
            print("\n SUCCESS: Booking accepted by IDS!")
            print(f"🎫 Channel Reservation Number: {booking_data['unique_id']}")
            print("🔍 IDS should now process this booking and assign PMS reservation number")
            print("📞 Contact IDS Support with reference FX#-5194 to verify")
            return booking_data['unique_id']
        else:
            print(f"\n FAILED: {result.get('error', 'Unknown error')}")
            return None

    except Exception as e:
        print(f"\n ERROR: {str(e)}")
        return None

if __name__ == "__main__":
    print("🏭 RUNNING ON PRODUCTION SERVER")
    print("This script must be executed on the production VPS, not localhost")
    print()

    channel_reservation = asyncio.run(test_production_booking())

    if channel_reservation:
        print(f"\n🎯 TEST COMPLETE - Channel Reservation Number: {channel_reservation}")
        print("📞 Please contact IDS Support with reference FX#-5194")
        print("🔍 Ask them to check if booking FR77WDF890 exists in their system")
    else:
        print("\n Test failed - check logs and contact IDS support")
