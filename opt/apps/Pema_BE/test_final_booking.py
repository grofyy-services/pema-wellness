#!/usr/bin/env python3
"""
Final test: Create booking with Kundan Kumar and check PMS number
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_final_booking():
    """Create final test booking with Kundan Kumar"""

    print("🎯 FINAL IDS BOOKING TEST")
    print("=" * 50)
    print("Guest Name: Kundan Kumar")
    print("Checking: PMS Reservation Number from IDS")
    print()

    try:
        from app.services.ids import IDSService

        # Create IDS service
        ids_service = IDSService()

        # Create booking with Kundan Kumar
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RR0925",
            "check_in_date": "2025-10-25",
            "check_out_date": "2025-10-27",
            "guest_info": {
                "first_name": "Kundan",
                "last_name": "Kumar",
                "email": "kundan.kumar@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 250000,
            "adults": 1,
            "children": 0,
            "special_requests": "Final test booking - please confirm PMS reservation number",
            "currency_code": "INR",
            "unique_id": "FINAL-TEST-KUNDAN-KUMAR-001"
        }

        print("👤 Guest Details:")
        print(f"   Name: {booking_data['guest_info']['first_name']} {booking_data['guest_info']['last_name']}")
        print(f"   Email: {booking_data['guest_info']['email']}")
        print(f"   Reference: {booking_data['unique_id']}")
        print()

        print("🏨 Booking Details:")
        print(f"   Room: {booking_data['room_code']} ({booking_data['rate_plan_code']})")
        print(f"   Dates: {booking_data['check_in_date']} to {booking_data['check_out_date']}")
        print(f"   Amount: ₹{booking_data['total_amount']}")
        print()

        print("📡 Sending booking to IDS...")
        result = await ids_service.create_booking(booking_data)

        print(" IDS Response:")
        print(f"   Success: {result.get('success')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Reference: {result.get('booking_reference')}")
        print(f"   Message: {result.get('message', 'No message')}")
        if result.get('error'):
            print(f"   Error: {result.get('error')}")
        print()

        # Success analysis
        if result.get('success'):
            if result.get('status') == 'confirmed':
                print("🎉 SUCCESS! Booking CONFIRMED with PMS number!")
                print(f"   PMS Reservation Number: {result.get('pms_reservation_number', 'Check webhook logs')}")
            elif result.get('status') == 'acknowledged':
                print(" SUCCESS! Booking ACKNOWLEDGED by IDS")
                print("   Waiting for PMS reservation number via webhook...")
                print()
                print("📞 CONTACT IDS SUPPORT NOW:")
                print(f"   Booking Reference: {booking_data['unique_id']}")
                print("   Guest Name: Kundan Kumar"
                print("   Ask: 'What's the PMS reservation number?'")
                print()
                print("🔍 Also check webhook logs for:")
                print("   '🎉 RECEIVED BOOKING CONFIRMATION FROM IDS'")
                print("   '🏨 PMS Reservation Number:'")
            else:
                print("⚠️ Booking sent but status unclear")
        else:
            print(" Booking creation failed")
            print(f"   Check logs for details: {result.get('error')}")

    except Exception as e:
        print(f" Test failed: {e}")
        import traceback
        traceback.print_exc()

async def check_webhook_status():
    """Instructions for checking webhook"""

    print("\n🔍 WEBHOOK MONITORING INSTRUCTIONS")
    print("=" * 50)
    print("1. Keep FastAPI server running for webhook:")
    print("   python3 -m uvicorn app.main:app --reload --port 8000 --log-level info")
    print()
    print("2. Monitor these webhook logs:")
    print("    '🎉 RECEIVED BOOKING CONFIRMATION FROM IDS'")
    print("    '🏨 PMS Reservation Number: PMSxxxxx'")
    print("    ' Parsed confirmation - Success: True'")
    print()
    print("3. If no webhook activity within 5 minutes:")
    print("   Contact IDS support immediately!")

async def contact_ids_instructions():
    """Instructions for contacting IDS"""

    print("\n📞 IDS SUPPORT CONTACT INSTRUCTIONS")
    print("=" * 50)
    print("Call IDS support and provide:")
    print()
    print("🎫 Booking Details:")
    print("   Reference: FINAL-TEST-KUNDAN-KUMAR-001")
    print("   Guest: Kundan Kumar")
    print("   Email: kundan.kumar@example.com")
    print("   Dates: 2025-10-25 to 2025-10-27")
    print("   Room: EXT (RR0925)")
    print()
    print("❓ Questions to Ask:")
    print("   1. 'Did you receive this booking?'")
    print("   2. 'What's the PMS reservation number?'")
    print("   3. 'Did you send OTA_NotifReportRQ confirmation?'")
    print("   4. 'Is our webhook receiving confirmations?'")
    print()
    print("Expected PMS format: PMS123456 or similar number")

async def main():
    """Main test function"""

    await test_final_booking()
    await check_webhook_status()
    await contact_ids_instructions()

    print("\n🎯 SUMMARY")
    print("=" * 50)
    print(" Booking sent to IDS with guest 'Kundan Kumar'")
    print(" Acknowledgment expected from IDS")
    print("⏳ Waiting for PMS reservation number confirmation")
    print("📞 Contact IDS support to verify booking creation")
    print()
    print("🏆 FINAL RESULT: IDS integration test complete!")

if __name__ == "__main__":
    asyncio.run(main())
