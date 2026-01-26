#!/usr/bin/env python3
"""
Test script to create a booking and push it to IDS
"""

import requests
import json
from datetime import datetime

def test_booking_creation():
    """Test creating a booking and pushing it to IDS"""

    # Booking data for October 1-8, 2025
    booking_data = {
        "unique_id": f"TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "room_code": "EXT",  # Executive Room
        "rate_plan_code": "RACK",  # Rack Rate
        "check_in_date": "2025-10-01",
        "check_out_date": "2025-10-08",
        "adults": 2,
        "children": 0,
        "total_amount": 7500000,  # Amount in paise (75,000 INR = 7,500,000 paise)
        "currency_code": "INR",
        "guest_info": {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "country": "US"
        }
    }

    print("Creating test booking with data:")
    print(json.dumps(booking_data, indent=2))
    print("\nSending booking to IDS...")

    try:
        # Send booking to IDS
        response = requests.post(
            "http://localhost:8000/api/v1/ids/bookings/create",
            json=booking_data,
            headers={"Content-Type": "application/json"}
        )

        print(f"Response Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")

        if response.status_code == 200:
            print(" Booking successfully sent to IDS!")
            return True
        else:
            print(" Failed to send booking to IDS")
            return False

    except Exception as e:
        print(f" Error sending booking: {e}")
        return False

if __name__ == "__main__":
    print("Testing IDS Booking Creation")
    print("=" * 50)

    success = test_booking_creation()

    if success:
        print("\n Test completed successfully!")
        print("Booking for October 1-8, 2025 has been sent to IDS")
    else:
        print("\n Test failed!")
        print("Check the server logs for more details")
