#!/usr/bin/env python3
"""
Test script to create a booking using the provided XML payload from FR77WDF890.xml
This will send the booking notification to IDS and verify the response.
"""

import asyncio
import json
from app.services.ids import IDSService

async def test_booking_from_xml():
    """
    Test booking creation using the XML payload provided in FR77WDF890.xml
    This simulates a channel booking from MakeMyTrip
    """

    # Initialize IDS service
    ids_service = IDSService()

    # Temporarily force XML booking creation to ReceiveResFromCM endpoint
    original_api_url = ids_service.api_url
    ids_service.api_url = "https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017"  # Force ReceiveResFromCM path

    print("🔧 IDS ARI 2.4 Integration - Test Booking from XML Payload")
    print("=" * 70)

    # Extract booking data from the XML payload (FR77WDF890.xml)
    from datetime import date
    booking_data = {
        'unique_id': 'FR77WDF890',  # From the XML UniqueID
        'check_in_date': date(2025, 11, 15),  # Future date - From TimeSpan Start
        'check_out_date': date(2025, 11, 16),  # Future date - From TimeSpan End
        'adults': 3,  # From GuestCount AgeQualifyingCode="10" Count="3"
        'children': 0,
        'room_code': 'EXT',  # From RoomType RoomTypeCode
        'rate_plan_code': 'RR0925',  # From RatePlan RatePlanCode
        'total_amount': 560280,  # AmountAfterTax="5602.8" * 100 for paise
        'currency_code': 'INR',
        'guest_info': {
            'first_name': 'Test Rese',  # From GivenName
            'last_name': 'IDS',  # From Surname
            'email': 'test@idsnext.com',  # From Email
            'phone': 'NA',  # From PhoneNumber
            'country': 'India'  # From CountryName
        },
        'special_requests': 'Channel booking from MakeMyTrip - Test reservation',
        'channel': 'MakeMyTrip'  # From BookingChannel CompanyName
    }

    print("📋 Booking Details (Extracted from XML Payload):")
    print(f"   Unique ID: {booking_data['unique_id']}")
    print(f"   Channel: {booking_data['channel']}")
    print(f"   Check-in: {booking_data['check_in_date']}")
    print(f"   Check-out: {booking_data['check_out_date']}")
    print(f"   Adults: {booking_data['adults']}")
    print(f"   Room: {booking_data['room_code']} ({booking_data['rate_plan_code']})")
    print(f"   Total Amount: ₹{booking_data['total_amount'] // 100:,}")
    print(f"   Guest: {booking_data['guest_info']['first_name']} {booking_data['guest_info']['last_name']}")
    print(f"   Email: {booking_data['guest_info']['email']}")
    print()

    print("📡 Sending booking notification to IDS...")
    try:
        result = await ids_service.create_booking(booking_data)

        print(" IDS Response:")
        print(json.dumps(result, indent=2))

        if result.get('success'):
            print("\n SUCCESS: Booking notification sent to IDS!")
            print("🎯 Channel Reservation Number: FR77WDF890")
            print("🔍 IDS should process this booking and assign a PMS reservation number")
            print("🏨 Check IDS system for confirmation via webhook callback")
            print("\n📞 Contact IDS Support Reference: FX#-5194")
            return booking_data['unique_id']
        else:
            print(f"\n FAILED: {result.get('error', 'Unknown error')}")
            return None

    except Exception as e:
        print(f"\n ERROR: {str(e)}")
        return None
    finally:
        # Restore original API URL
        ids_service.api_url = original_api_url

if __name__ == "__main__":
    channel_reservation_number = asyncio.run(test_booking_from_xml())
    if channel_reservation_number:
        print(f"\n🎫 Channel Reservation Number: {channel_reservation_number}")
    else:
        print("\n No reservation number generated")
