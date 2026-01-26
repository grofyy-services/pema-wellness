#!/usr/bin/env python3
"""
Test IDS booking with new credentials: tdd@pemawellness.com / Ids@1001
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_ids_with_new_credentials():
    """Test IDS booking with new credentials"""
    try:
        print("🧪 Testing IDS with New Credentials")
        print("=" * 50)

        # Import required modules
        from app.services.ids_adapter import IDSAdapterService

        # Use new credentials
        api_key = "tdd@pemawellness.com"
        api_secret = "Ids@1001"

        print(f"📧 Username: {api_key}")
        print(f"🔑 Password: {api_secret}")

        # Initialize IDS adapter with IDS URL and new credentials
        adapter = IDSAdapterService(
            pms_base_url="https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017",
            api_key=api_key,
            api_secret=api_secret
        )

        print("📤 Testing Booking Creation...")

        # Test booking creation
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RR0925",
            "check_in_date": "2025-10-25",
            "check_out_date": "2025-10-27",
            "guest_info": {
                "first_name": "Test",
                "last_name": "User",
                "email": "test@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 250000,
            "adults": 2,
            "children": 0,
            "special_requests": "Late check-in requested",
            "currency_code": "INR",
            "unique_id": "TEST-NEW-CREDENTIALS-001"
        }

        print(f"📋 Booking Data: {booking_data['unique_id']}")

        create_result = await adapter.create_reservation(booking_data)
        print(f"\n📨 IDS Response: {create_result}")

        if create_result.get("success"):
            booking_ref = create_result.get("reservation_id", "TEST-NEW-CREDENTIALS-001")
            print(f" SUCCESS: Booking created with reference: {booking_ref}")

            # Test cancellation
            print(f"\n🗑️  Testing Cancellation of {booking_ref}...")
            cancel_result = await adapter.cancel_reservation(booking_ref, "Test cancellation")
            print(f"📨 Cancellation Response: {cancel_result}")

            if cancel_result.get("success"):
                print(" SUCCESS: Booking cancelled successfully!")
            else:
                print(" FAILURE: Booking cancellation failed")

        else:
            print(" FAILURE: Booking creation failed")
            print(f"Error: {create_result.get('error', 'Unknown error')}")

    except Exception as e:
        print(f" Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_ids_with_new_credentials())
