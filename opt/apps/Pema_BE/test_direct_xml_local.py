#!/usr/bin/env python3
"""
Test direct XML booking locally without API
"""
import asyncio
import sys
import os
sys.path.append('/Users/kundanforpema/Desktop/Pema_BE')

from datetime import date
from app.services.ids import IDSService

async def test_direct_xml_local():
    """Test direct XML booking by calling IDS service directly"""

    # Test booking data
    booking_data = {
        "unique_id": "LOCAL-XML-TEST-002",
        "check_in_date": date(2025, 10, 26),
        "check_out_date": date(2025, 10, 31),
        "adults": 2,
        "children": 0,
        "room_code": "EXT",
        "rate_plan_code": "RR0925",
        "total_amount": 373520,  # in paise
        "currency_code": "INR",
        "guest_info": {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane.smith@test.com",
            "phone": "9876543210",
            "country": "India"
        },
        "special_requests": "Local test - Direct XML posting"
    }

    print("🧪 Testing Direct XML Booking Locally...")
    print(f"📋 Booking: {booking_data['unique_id']}")
    print(f"📅 Dates: {booking_data['check_in_date']} to {booking_data['check_out_date']}")
    print(f"👥 Guests: {booking_data['adults']} adults")
    print(f"💰 Amount: ₹{booking_data['total_amount']/100}")
    print(f"🏨 Room: {booking_data['room_code']}")

    try:
        # Initialize IDS service
        ids_service = IDSService()

        print("\n🔧 Calling IDSService.create_booking()...")

        # Call the create_booking method directly
        result = await ids_service.create_booking(booking_data)

        print("\n📊 Result:")
        print(f"   Success: {result.get('success')}")
        print(f"   Booking Ref: {result.get('booking_reference')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Message: {result.get('message')}")
        print(f"   Error: {result.get('error')}")

        if result.get('success'):
            print("\n LOCAL BOOKING SUCCESSFUL!")
            return True
        else:
            print(f"\n Local booking failed: {result.get('error')}")
            return False

    except Exception as e:
        print(f"\n Local test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🎯 Local Direct XML Booking Test")
    print("=" * 50)

    success = asyncio.run(test_direct_xml_local())

    print("\n" + "=" * 50)
    if success:
        print("🎉 LOCAL TEST PASSED: Direct XML booking works!")
    else:
        print("💥 LOCAL TEST FAILED: Direct XML booking failed!")
    print("=" * 50)
