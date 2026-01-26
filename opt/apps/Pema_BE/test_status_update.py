#!/usr/bin/env python3
"""
Test the updated booking status check
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_status_check():
    """Test the updated booking status check"""

    booking_ref = "TEST-RR0925-FINAL-001"

    print("🔍 Testing Updated Booking Status Check")
    print("=" * 50)
    print(f"📋 Booking Reference: {booking_ref}")
    print()

    try:
        from app.services.ids_adapter import IDSAdapterService

        # Use IDS endpoint (not PMS)
        adapter = IDSAdapterService(
            pms_base_url="https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017",
            api_key="tdd@pemawellness.com",
            api_secret="Ids@1001"
        )

        print("📡 Calling check_reservation_status...")
        result = await adapter.check_reservation_status(booking_ref)

        print(" Response:")
        for key, value in result.items():
            print(f"   {key}: {value}")
        print()

        if result.get("status") == "Verification_Required":
            print(" CORRECT: Status check properly indicates we need IDS verification")
            print("   This means the booking status cannot be checked via API")
            print("   We must contact IDS support to verify if the booking exists")
        else:
            print(" Unexpected response - status check may still be using fallback")

    except Exception as e:
        print(f" Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_status_check())
