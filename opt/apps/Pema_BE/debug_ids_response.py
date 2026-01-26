#!/usr/bin/env python3
"""
Debug what IDS is actually returning
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def debug_ids_response():
    """Debug the actual IDS response"""

    print("🔍 Debugging IDS Response Content")
    print("=" * 50)

    try:
        from app.services.ids import IDSService

        ids_service = IDSService()

        # Test booking data
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RR0925",
            "check_in_date": "2025-10-25",
            "check_out_date": "2025-10-27",
            "guest_info": {
                "first_name": "Debug",
                "last_name": "Response",
                "email": "debug@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 250000,
            "adults": 2,
            "children": 0,
            "special_requests": "Debug IDS response content",
            "currency_code": "INR",
            "unique_id": "DEBUG-IDS-RESPONSE-001"
        }

        print("📡 Sending booking to IDS and capturing raw response...")

        # Manually create the request to capture raw response
        request_data = ids_service._create_booking_request(booking_data)
        xml_request = ids_service._model_to_xml(request_data)

        print(f"📤 Request XML length: {len(xml_request)} characters")
        print(f"🎯 Endpoint: {ids_service.api_url}")

        # Make the raw request
        xml_response = await ids_service._make_request("booking", xml_request)

        print(f"\n📥 Raw IDS Response (length: {len(xml_response)}):")
        print("=" * 50)
        print(xml_response)
        print("=" * 50)

        # Try to determine what type of response this is
        if 'OTA_NotifReportRQ' in xml_response:
            print("🎉 SUCCESS! IDS sent OTA_NotifReportRQ (confirmation with PMS number)")
            try:
                confirmation = ids_service._xml_to_model(xml_response, ids_service.OTANotifReportRQ)
                pms_number = confirmation.pms_reservation_number
                print(f"🏨 PMS Reservation Number: {pms_number}")
            except Exception as e:
                print(f" Could not parse confirmation: {e}")
        elif 'OTA_HotelResNotifRS' in xml_response:
            print(" IDS sent OTA_HotelResNotifRS (acknowledgment only)")
            if '<Success' in xml_response:
                print(" Acknowledgment indicates success")
            else:
                print("⚠️ Acknowledgment may indicate issues")
        else:
            print("❓ Unknown response format from IDS")
            print("This might be an error response or unexpected format")

    except Exception as e:
        print(f" Debug failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_ids_response())
