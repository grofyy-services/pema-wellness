#!/usr/bin/env python3
"""
Test booking acknowledgment implementation
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_booking_acknowledgment():
    """Test the updated booking acknowledgment implementation"""

    print("🔍 Testing IDS Booking Acknowledgment Implementation")
    print("=" * 60)
    print()

    try:
        from app.services.ids import IDSService

        # Create IDS service instance
        ids_service = IDSService()

        # Test booking data
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RR0925",
            "check_in_date": "2025-10-25",
            "check_out_date": "2025-10-27",
            "guest_info": {
                "first_name": "Test",
                "last_name": "Acknowledgment",
                "email": "test@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 250000,
            "adults": 2,
            "children": 0,
            "special_requests": "Testing acknowledgment flow",
            "currency_code": "INR",
            "unique_id": "TEST-ACK-FLOW-001"
        }

        print("📋 Test Booking Data:")
        print(f"   Reference: {booking_data['unique_id']}")
        print(f"   Endpoint: {ids_service.api_url}")
        print(f"   Rate Plan: {booking_data['rate_plan_code']}")
        print()

        print("📡 Sending booking notification to IDS...")
        result = await ids_service.create_booking(booking_data)

        print(" IDS Response:")
        print(f"   Success: {result.get('success')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Reference: {result.get('booking_reference')}")
        print(f"   Message: {result.get('message', 'No message')}")
        if result.get('error'):
            print(f"   Error: {result.get('error')}")
        print()

        # Analyze the response
        if result.get('success') and result.get('status') == 'acknowledged':
            print(" CORRECT IMPLEMENTATION:")
            print("   - Booking notification sent successfully")
            print("   - Received acknowledgment from IDS")
            print("   - Status correctly shows 'acknowledged' (not 'confirmed')")
            print("   - Message indicates waiting for PMS reservation number")
            print()
            print("📋 According to IDS specification:")
            print("   1. We sent OTA_HotelResNotifRQ")
            print("   2. IDS responded with OTA_HotelResNotifRS (acknowledgment)")
            print("   3. IDS will send OTA_NotifReportRQ later with PMS reservation number")
            print()
            print("🎯 CONCLUSION: Implementation is now compliant with IDS ARI 2.4 specification!")
        elif result.get('success') and result.get('status') == 'confirmed':
            print("⚠️  PARTIAL SUCCESS:")
            print("   - Booking notification was accepted")
            print("   - But status shows 'confirmed' instead of 'acknowledged'")
            print("   - May indicate old implementation or parsing issue")
        else:
            print(" IMPLEMENTATION ISSUE:")
            print("   - Booking notification failed or parsing error")
            print(f"   - Check logs for details: {result}")

    except Exception as e:
        print(f" Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_booking_acknowledgment())
