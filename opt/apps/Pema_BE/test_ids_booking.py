#!/usr/bin/env python3
"""
Test script for posting booking directly to IDS endpoint
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_ids_booking():
    """Test posting booking directly to IDS"""
    try:
        print("Testing IDS Booking Creation (Direct to IDS only)...")

        # Import required modules
        from app.services.ids_adapter import IDSAdapterService

        # Initialize IDS adapter with IDS URL
        adapter = IDSAdapterService(
            pms_base_url="https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017",
            api_key="baypark@idsnext.com",
            api_secret="idsnext24412"
        )

        # Test booking creation
        print("\n📝 Creating booking on IDS...")
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RACK",
            "check_in_date": "2025-10-25",
            "check_out_date": "2025-10-27",
            "guest_info": {
                "first_name": "Alice",
                "last_name": "Smith",
                "email": "alice.smith@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 250000,
            "adults": 2,
            "children": 1,
            "special_requests": "Late check-in requested, airport pickup needed",
            "currency_code": "INR",
            "unique_id": "TEST-IDS-BOOKING-001"
        }

        print(f"Booking Data: {booking_data}")

        create_result = await adapter.create_reservation(booking_data)
        print(f"\n IDS Booking Creation Result: {create_result}")

        if create_result.get("success"):
            booking_ref = create_result.get("reservation_id", "TEST-IDS-BOOKING-001")
            print(f" Booking created successfully on IDS: {booking_ref}")

            # Test cancellation
            print(f"\n  Testing cancellation of booking {booking_ref}...")
            cancel_result = await adapter.cancel_reservation(booking_ref, "Test cancellation")
            print(f" IDS Cancellation Result: {cancel_result}")

            if cancel_result.get("success"):
                print(" Booking cancellation successful on IDS!")
            else:
                print(" Booking cancellation failed on IDS")

        else:
            print(" Booking creation failed on IDS")
            print(f"Error: {create_result.get('error', 'Unknown error')}")

    except Exception as e:
        print(f" Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_ids_booking())
