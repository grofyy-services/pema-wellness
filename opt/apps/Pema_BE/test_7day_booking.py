#!/usr/bin/env python3
"""
Test booking creation for 7 days starting today
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_7day_booking():
    """Create booking for 7 days starting today"""

    print("🏨 CREATING 7-DAY BOOKING STARTING TODAY")
    print("=" * 50)

    # Calculate dates
    today = datetime.now().date()
    check_out = today + timedelta(days=7)

    print("📅 Booking Dates:")
    print(f"   Check-in: {today}")
    print(f"   Check-out: {check_out}")
    print(f"   Duration: 7 days")
    print()

    try:
        from app.services.ids import IDSService

        # Create IDS service
        ids_service = IDSService()

        # Create booking for 7 days
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RR0925",
            "check_in_date": today.isoformat(),
            "check_out_date": check_out.isoformat(),
            "guest_info": {
                "first_name": "Kundan",
                "last_name": "Kumar",
                "email": "kundan.kumar@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 1750000,  # 7 days * ₹250,000 per day
            "adults": 1,
            "children": 0,
            "special_requests": f"7-day booking from {today} to {check_out}. Please confirm PMS reservation number.",
            "currency_code": "INR",
            "unique_id": f"7DAY-{today.isoformat().replace('-', '')}-KUNDAN-KUMAR-001"
        }

        print("👤 Guest Details:")
        print(f"   Name: {booking_data['guest_info']['first_name']} {booking_data['guest_info']['last_name']}")
        print(f"   Email: {booking_data['guest_info']['email']}")
        print(f"   Reference: {booking_data['unique_id']}")
        print()

        print("🏨 Booking Summary:")
        print(f"   Room: {booking_data['room_code']} ({booking_data['rate_plan_code']})")
        print(f"   Total Amount: ₹{booking_data['total_amount']:,}")
        print(f"   Daily Rate: ₹{booking_data['total_amount'] // 7:,} per day")
        print()

        print("📡 Sending 7-day booking to IDS...")
        result = await ids_service.create_booking(booking_data)

        print(" IDS Response:")
        print(f"   Success: {result.get('success')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Reference: {result.get('booking_reference')}")
        print(f"   Message: {result.get('message', 'No message')}")
        if result.get('error'):
            print(f"   Error: {result.get('error')}")
        print()

        # Analysis
        if result.get('success'):
            print(" SUCCESS! 7-day booking sent to IDS")
            print("📞 Next Steps:")
            print("1. Contact IDS support with reference:")
            print(f"   {booking_data['unique_id']}")
            print("2. Ask: 'Is this 7-day booking in your system?'")
            print("3. Ask: 'What is the PMS reservation number?'")
            print()
            print("🎯 This test will definitively show if:")
            print("    Bookings are being created in IDS")
            print("    Only acknowledgments are being sent")
        else:
            print(" Booking creation failed")
            print(f"   Check: {result.get('error')}")

        print("\n📋 Booking XML will be logged in server logs")
        print("   Look for: '🚀 SENDING BOOKING XML TO IDS'")

    except Exception as e:
        print(f" Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_7day_booking())
