#!/usr/bin/env python3
"""
Test script for direct XML booking posting through API
"""
import asyncio
import httpx
from datetime import date

async def test_direct_xml_booking():
    """Test booking creation through API using direct XML posting"""

    # Test booking data - using a fresh booking reference
    booking_data = {
        "unique_id": "FINAL-API-TEST-001",
        "check_in_date": date(2025, 10, 27),
        "check_out_date": date(2025, 11, 1),
        "adults": 1,
        "children": 0,
        "room_code": "EXT",
        "rate_plan_code": "RR0925",
        "total_amount": 186760,  # in paise
        "currency_code": "INR",
        "guest_info": {
            "first_name": "Alice",
            "last_name": "Smith",
            "email": "alice.smith@test.com",
            "phone": "9999999999",
            "country": "India"
        },
        "special_requests": "FINAL API TEST - Direct XML Booking"
    }

    print("🚀 Testing Direct XML Booking via API...")
    print(f"📋 Booking: {booking_data['unique_id']}")
    print(f"📅 Dates: {booking_data['check_in_date']} to {booking_data['check_out_date']}")
    print(f"👥 Guests: {booking_data['adults']} adults")
    print(f"💰 Amount: ₹{booking_data['total_amount']/100}")
    print(f"🏨 Room: {booking_data['room_code']}")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Test the GET endpoint - use the booking_data for parameters
            params = {
                "check_in_date": booking_data["check_in_date"].isoformat(),
                "check_out_date": booking_data["check_out_date"].isoformat(),
                "adults": booking_data["adults"],
                "children": booking_data["children"],
                "room_code": booking_data["room_code"],
                "rate_plan_code": booking_data["rate_plan_code"],
                "total_amount": booking_data["total_amount"],
                "currency_code": booking_data["currency_code"],
                "guest_first_name": booking_data["guest_info"]["first_name"],
                "guest_last_name": booking_data["guest_info"]["last_name"],
                "guest_email": booking_data["guest_info"]["email"],
                "guest_phone": booking_data["guest_info"]["phone"],
                "guest_country": booking_data["guest_info"]["country"],
                "special_requests": booking_data["special_requests"]
            }

            url = "https://dev.pemawellness.com/api/v1/ids/bookings/create"

            print(f"\n📡 Making GET request to: {url}")
            print(f"🔗 Full URL: {url}?{'&'.join([f'{k}={v}' for k, v in params.items()])}")

            response = await client.get(url, params=params)

            print(f"\n📥 Response Status: {response.status_code}")
            print(f" Response Headers: {dict(response.headers)}")
            print(f" Response Body:\n{response.text}")

            if response.status_code == 200:
                try:
                    result = response.json()
                    print("\n📊 Parsed Response:")
                    print(f"   Success: {result.get('success')}")
                    print(f"   Booking Ref: {result.get('booking_reference')}")
                    print(f"   Status: {result.get('status')}")
                    print(f"   Message: {result.get('message')}")
                    print(f"   Error: {result.get('error')}")

                    if result.get('success'):
                        print("\n BOOKING SUCCESSFUL VIA API!")
                        return True
                    else:
                        print(f"\n Booking Failed: {result.get('error')}")
                        return False

                except Exception as e:
                    print(f"\n Failed to parse response: {e}")
                    return False
            else:
                print(f"\n HTTP Error: {response.status_code}")
                return False

    except Exception as e:
        print(f"\n Request failed: {e}")
        return False

if __name__ == "__main__":
    print("🎯 Direct XML Booking API Test")
    print("=" * 50)

    success = asyncio.run(test_direct_xml_booking())

    print("\n" + "=" * 50)
    if success:
        print("🎉 TEST PASSED: Direct XML booking through API works!")
    else:
        print("💥 TEST FAILED: Direct XML booking through API failed!")
    print("=" * 50)
