#!/usr/bin/env python3
"""
Test script to validate that all IDS booking creation parameters are available
when a payment succeeds.
"""

import asyncio
import json
from datetime import date
from unittest.mock import Mock, AsyncMock

# Mock the required components
class MockRoom:
    def __init__(self):
        self.id = 1
        self.code = "DELUXE001"
        self.pricing_category = "DELUXE"

class MockBooking:
    def __init__(self):
        self.id = 123
        self.room_id = 1
        self.check_in_date = date(2025, 11, 1)
        self.check_out_date = date(2025, 11, 4)
        self.total_amount = 14968000  # 149680 INR in paise
        self.occupancy_details = {"adults": 2, "children": 1, "children_ages": [8]}
        self.guest_first_name = "John"
        self.guest_last_name = "Doe"
        self.guest_email = "john.doe@example.com"
        self.guest_phone = "+91-9999999999"
        self.guest_country = "India"
        self.special_requests = "Late check-in requested"

class MockPayment:
    def __init__(self):
        self.id = 456
        self.reference_number = "PW2510301933280014"

class MockIDSService:
    def __init__(self):
        self.room_code_mapping = {"DELUXE001": "DLX"}
        self.rate_plan_mapping = {"DELUXE": "RR0925"}

    def _map_room_code(self, internal_code):
        return self.room_code_mapping.get(internal_code, internal_code)

    def _map_rate_plan_code(self, internal_category):
        return self.rate_plan_mapping.get(internal_category, internal_category)

    async def create_booking(self, booking_data):
        return {"success": True, "booking_reference": "IDS123456"}

async def test_ids_params_extraction():
    """Test that all IDS parameters can be extracted from booking/payment data"""

    print("🧪 Testing IDS Booking Parameter Extraction")
    print("=" * 60)

    # Mock data
    payment = MockPayment()
    booking = MockBooking()
    room = MockRoom()
    ids_service = MockIDSService()

    print(f"📋 Payment: ID {payment.id}, Ref: {payment.reference_number}")
    print(f"📋 Booking: ID {booking.id}, Room: {booking.room_id}")
    print(f"📋 Room: Code {room.code}, Category: {room.pricing_category}")
    print()

    # Extract parameters as done in _create_ids_booking_on_payment_success
    occupancy = booking.occupancy_details or {}
    adults = occupancy.get('adults', 2)
    children = occupancy.get('children', 0)

    room_code = ids_service._map_room_code(room.code)
    rate_plan_code = ids_service._map_rate_plan_code(room.pricing_category or "RR0925")

    # Prepare IDS booking data
    ids_booking_data = {
        "unique_id": f"PAY-{payment.reference_number}",
        "check_in_date": booking.check_in_date,
        "check_out_date": booking.check_out_date,
        "adults": adults,
        "children": children,
        "room_code": room_code,
        "rate_plan_code": rate_plan_code,
        "total_amount": booking.total_amount // 100,  # Convert from paise to rupees
        "currency_code": "INR",
        "guest_info": {
            "first_name": booking.guest_first_name or "Guest",
            "last_name": booking.guest_last_name or "",
            "email": booking.guest_email or "guest@example.com",
            "phone": booking.guest_phone or "NA",
            "country": booking.guest_country or "India"
        }
    }

    if booking.special_requests:
        ids_booking_data["special_requests"] = booking.special_requests

    print("📊 Extracted IDS Parameters:")
    print("-" * 40)

    required_params = [
        ("unique_id", ids_booking_data["unique_id"]),
        ("check_in_date", ids_booking_data["check_in_date"]),
        ("check_out_date", ids_booking_data["check_out_date"]),
        ("adults", ids_booking_data["adults"]),
        ("children", ids_booking_data["children"]),
        ("room_code", ids_booking_data["room_code"]),
        ("rate_plan_code", ids_booking_data["rate_plan_code"]),
        ("total_amount", ids_booking_data["total_amount"]),
        ("currency_code", ids_booking_data["currency_code"]),
        ("guest_info.first_name", ids_booking_data["guest_info"]["first_name"]),
        ("guest_info.last_name", ids_booking_data["guest_info"]["last_name"]),
        ("guest_info.email", ids_booking_data["guest_info"]["email"]),
        ("guest_info.phone", ids_booking_data["guest_info"]["phone"]),
        ("guest_info.country", ids_booking_data["guest_info"]["country"]),
        ("special_requests", ids_booking_data.get("special_requests", "None"))
    ]

    all_available = True
    for param_name, param_value in required_params:
        status = ""
        if param_value is None or param_value == "" or param_value == "NA":
            if param_name not in ["guest_info.last_name", "special_requests"]:  # These can be empty
                status = "⚠️"
                if param_value is None or param_value == "":
                    status = ""
                    all_available = False

        print(f"{status} {param_name}: {param_value}")

    print()
    print("🎯 IDS API Call Data:")
    print("-" * 40)
    print(json.dumps(ids_booking_data, indent=2, default=str))

    print()
    print("=" * 60)
    if all_available:
        print("🎉 SUCCESS: All required IDS parameters are available!")
        return True
    else:
        print(" FAILURE: Some parameters are missing or invalid!")
        return False

if __name__ == "__main__":
    asyncio.run(test_ids_params_extraction())
