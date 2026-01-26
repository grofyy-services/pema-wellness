#!/usr/bin/env python3
"""
Test script for IDS operations: create, check status, cancel booking
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_ids_operations():
    """Test IDS booking operations"""
    try:
        print("Testing IDS Operations...")

        # Import required modules
        from app.services.ids_adapter import IDSAdapterService
        from app.core.config import settings

        print(" Imports successful")

        # Initialize IDS adapter
        adapter = IDSAdapterService(
            settings.IDS_API_URL,
            settings.IDS_API_KEY,
            settings.IDS_API_SECRET
        )

        # Test booking creation
        print("\n1. Testing Booking Creation...")
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RACK",
            "check_in_date": "2025-12-01",
            "check_out_date": "2025-12-03",
            "guest_info": {
                "first_name": "Test",
                "last_name": "User",
                "email": "test@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 100000,
            "adults": 2,
            "children": 0,
            "currency_code": "INR",
            "unique_id": "TEST-BOOKING-FULL-001"
        }

        create_result = await adapter.create_reservation(booking_data)
        print(f"Booking Creation Result: {create_result}")

        if create_result.get("success"):
            booking_ref = create_result.get("reservation_id", "TEST-BOOKING-FULL-001")
            print(f" Booking created successfully: {booking_ref}")

            # Test status check
            print(f"\n2. Testing Status Check for {booking_ref}...")
            status_result = await adapter.check_reservation_status(booking_ref)
            print(f"Status Check Result: {status_result}")

            # Test cancellation
            print(f"\n3. Testing Cancellation for {booking_ref}...")
            cancel_result = await adapter.cancel_reservation(booking_ref, "Test cancellation")
            print(f"Cancellation Result: {cancel_result}")

            if cancel_result.get("success"):
                print(" All IDS operations completed successfully!")
            else:
                print(" Cancellation failed")

        else:
            print(" Booking creation failed")

    except Exception as e:
        print(f" Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_ids_operations())
