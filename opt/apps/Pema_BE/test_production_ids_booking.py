#!/usr/bin/env python3
"""
Production test script for IDS ARI 2.4 integration from dev.pemawellness.com
This script should be run from the production server where IDS accepts requests.
"""

import asyncio
import json
import os
from datetime import datetime, timedelta
from app.services.ids import IDSService

async def test_production_ids_booking():
    """
    Test IDS booking creation from production environment (dev.pemawellness.com)
    where IDS has whitelisted the domain for API access.
    """

    print("🌐 IDS ARI 2.4 Production Integration Test")
    print("=" * 60)
    print("📍 Running from: dev.pemawellness.com")
    print("🎯 Target: IDS PMS System")
    print("🔧 Channel: PEMA (corrected from email address)")
    print()

    # Initialize IDS service
    ids_service = IDSService()

    # Production-ready business rules compliant booking
    booking_data = {
        'unique_id': f'PROD-TEST-{datetime.now().strftime("%Y%m%d-%H%M%S")}',
        'check_in_date': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),  # 7 days from now
        'check_out_date': (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d'),  # 3-day stay
        'adults': 2,                     # Max 2 guests (meets limit)
        'children': 0,
        'room_code': 'EXT',              # Valid room code
        'rate_plan_code': 'RR0925',      # Valid rate plan
        'total_amount': 75000,           # Amount in paise (₹750 = ₹75,000 paise)
        'guest_info': {
            'first_name': 'Production',
            'last_name': 'Test',
            'email': 'test@dev.pemawellness.com',
            'phone': '+91-9876543210',
            'country': 'India'
        }
    }

    print("📋 Production Booking Details:")
    print(f"   Reference: {booking_data['unique_id']}")
    print(f"   Check-in: {booking_data['check_in_date']}")
    print(f"   Check-out: {booking_data['check_out_date']}")
    print(f"   Adults: {booking_data['adults']}  (≤ 2 limit)")
    print(f"   Children: {booking_data['children']}")
    print(f"   Room: {booking_data['room_code']} ({booking_data['rate_plan_code']})")
    print(f"   Amount: ₹{booking_data['total_amount'] // 100:,}")
    print()

    print("🔧 IDS Configuration:")
    print(f"   API URL: {ids_service.api_url}")
    print(f"   Channel: PEMA")
    print(f"   Domain: dev.pemawellness.com  (whitelisted)")
    print()

    print("📡 Sending production booking to IDS...")
    result = await ids_service.create_booking(booking_data)

    print(" IDS Response:")
    print(json.dumps(result, indent=2))

    if result.get('success'):
        print("\n SUCCESS: Production booking accepted by IDS!")
        print("🎯 This confirms:")
        print("   • Domain whitelisting works (dev.pemawellness.com)")
        print("   • Channel name correction works (PEMA)")
        print("   • XML format is compliant")
        print("   • Business rules are satisfied")
        print()
        print("📞 Next Steps:")
        print("   1. Contact IDS support to verify booking in PMS")
        print("   2. Check for PMS reservation number assignment")
        print("   3. Monitor webhook for confirmation")
    else:
        error = result.get('error', 'Unknown error')
        print(f"\n FAILED: {error}")

        if '500' in error:
            print("🔍 HTTP 500 suggests server-side processing issue")
            print("💡 Possible causes:")
            print("   • Business rule violation (check dates/guests)")
            print("   • Room/rate code mismatch")
            print("   • Server-side configuration issue")
            print("   • Contact IDS support for server logs")
        elif '401' in error or '403' in error:
            print("🔍 Authentication/Domain issue")
            print("💡 Check:")
            print("   • Domain whitelisting (dev.pemawellness.com)")
            print("   • Credentials validity")
            print("   • API endpoint configuration")

if __name__ == "__main__":
    asyncio.run(test_production_ids_booking())
