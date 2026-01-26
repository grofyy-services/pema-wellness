#!/usr/bin/env python3
"""
Test booking creation that complies with IDS business rules:
- Minimum stay: 3 days
- Guest count limit: 2 guests max
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def test_business_rules_compliant_booking():
    """Create booking that complies with IDS business rules"""

    print("🎯 TESTING IDS BUSINESS RULES COMPLIANT BOOKING")
    print("=" * 60)

    # Calculate dates for 3-day minimum stay starting in future
    today = datetime.now().date()
    check_in = today + timedelta(days=30)  # Start 30 days from now
    check_out = check_in + timedelta(days=3)  # 3-day stay (meets minimum)

    print("📅 Booking Dates (3-day minimum stay):")
    print(f"   Check-in: {check_in}")
    print(f"   Check-out: {check_out}")
    print(f"   Duration: 3 days ")
    print()

    try:
        from app.services.ids import IDSService

        # Create IDS service
        ids_service = IDSService()

        # Create booking compliant with business rules
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RR0925",
            "check_in_date": check_in.isoformat(),
            "check_out_date": check_out.isoformat(),
            "guest_info": {
                "first_name": "Business",
                "last_name": "Rules",
                "email": "business.rules@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 750000,  # 3 days × ₹250,000 per day
            "adults": 2,  # Maximum 2 guests (meets limit)
            "children": 0,
            "special_requests": f"3-day business rules compliant booking. Check-in: {check_in}, Check-out: {check_out}. Guests: 2 adults.",
            "currency_code": "INR",
            "unique_id": f"BUSINESS-RULES-COMPLIANT-{check_in.strftime('%Y%m%d')}-001"
        }

        print("👤 Guest Details (2 guests max):")
        print(f"   Name: {booking_data['guest_info']['first_name']} {booking_data['guest_info']['last_name']}")
        print(f"   Email: {booking_data['guest_info']['email']}")
        print(f"   Adults: {booking_data['adults']}  (≤ 2 limit)")
        print(f"   Children: {booking_data['children']}")
        print(f"   Reference: {booking_data['unique_id']}")
        print()

        print("🏨 Booking Summary (Business Rules Compliant):")
        print(f"   Room: {booking_data['room_code']} ({booking_data['rate_plan_code']})")
        print(f"   Total Amount: ₹{booking_data['total_amount']:,}")
        print(f"   Daily Rate: ₹{booking_data['total_amount'] // 3:,} per day")
        print("    Minimum 3-day stay")
        print("    Maximum 2 guests")
        print("    Valid rate plan (RR0925)")
        print("    Valid room code (EXT)")
        print("    Future dates (not past)")
        print()

        print("📡 Sending business rules compliant booking to IDS...")
        result = await ids_service.create_booking(booking_data)

        print(" IDS Response:")
        print(f"   Success: {result.get('success')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Reference: {result.get('booking_reference')}")
        print(f"   Message: {result.get('message', 'No message')}")
        if result.get('error'):
            print(f"   Error: {result.get('error')}")
        print()

        # Analysis based on business rules compliance
        if result.get('success'):
            if result.get('status') == 'confirmed':
                print("🎉 SUCCESS! BOOKING CONFIRMED!")
                print("   This means the booking was actually created in IDS PMS!")
                print(f"   PMS Reservation Number: {result.get('pms_reservation_number', 'Check webhook logs')}")
                print()
                print("🏆 BUSINESS RULES COMPLIANCE WORKED!")
                print("   The 3-day minimum stay + 2 guest limit was the issue.")
            elif result.get('status') == 'acknowledged':
                print(" SUCCESS! Booking ACKNOWLEDGED")
                print("   This is expected - IDS will send PMS number via webhook later.")
                print()
                print("📞 Contact IDS support to check:")
                print(f"   Booking: {booking_data['unique_id']}")
                print("   Ask: 'Is this 3-day booking in your system?'")
            else:
                print("⚠️ Unexpected status")
        else:
            print(" Booking still failed")
            print(f"   Error: {result.get('error')}")
            print("   Even with business rules compliance, there may be other issues.")

        print("\n🎯 CONCLUSION:")
        print("   If this booking succeeds, the issue was business rule violations.")
        print("   If it still fails, there are other validation issues to identify.")

    except Exception as e:
        print(f" Test failed: {e}")
        import traceback
        traceback.print_exc()

async def main():
    """Main test function"""
    await test_business_rules_compliant_booking()

    print("\n📋 SUMMARY OF BUSINESS RULE VIOLATIONS FIXED:")
    print("=" * 60)
    print(" PREVIOUS ISSUES (causing booking rejection):")
    print("   • 1-2 day stays (violated 3-day minimum)")
    print("   • Potentially >2 guests (violated guest limit)")
    print()
    print(" CURRENT FIXES:")
    print("   • 3-day minimum stay ✓")
    print("   • 2 guests maximum ✓")
    print("   • Valid rate plan (RR0925) ✓")
    print("   • Valid room code (EXT) ✓")
    print("   • Future dates ✓")
    print()
    print("🎯 EXPECTED OUTCOME:")
    print("   Booking should now be created in IDS PMS system!")

if __name__ == "__main__":
    asyncio.run(main())
