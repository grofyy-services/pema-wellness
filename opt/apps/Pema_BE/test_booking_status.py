#!/usr/bin/env python3
"""
Test booking status check to see if PMS API responds or falls back to mock
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_booking_status():
    """Test booking status check"""

    booking_ref = "TEST-RR0925-FINAL-001"

    print("🔍 Testing Booking Status Check")
    print("=" * 50)
    print(f"📋 Booking Reference: {booking_ref}")
    print()

    try:
        from app.services.ids_adapter import IDSAdapterService

        # Use the same configuration as the API
        adapter = IDSAdapterService(
            pms_base_url="http://139.167.29.226:81",
            api_key="baypark@idsnext.com",
            api_secret="idsnext24412"
        )

        print("📡 Calling check_reservation_status...")
        result = await adapter.check_reservation_status(booking_ref)

        print(" Response:")
        print(result)
        print()

        # Analyze the response
        if result.get("Status") == "Success" and "message" in result:
            if "Reservation" in result.get("message", "") and "is confirmed" in result.get("message", ""):
                print("⚠️  WARNING: This appears to be the FALLBACK mock response!")
                print("   The PMS API likely failed, and the system returned a fake 'confirmed' status.")
                print("   This does NOT mean the booking actually exists in IDS/PMS!")
            else:
                print(" This appears to be a REAL response from the PMS API")
                print("   The booking status was retrieved from the actual system.")
        else:
            print(" Unexpected response format")

    except Exception as e:
        print(f" Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_booking_status())
