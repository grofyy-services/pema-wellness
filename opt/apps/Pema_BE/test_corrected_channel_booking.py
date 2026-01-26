#!/usr/bin/env python3
"""
Test script to verify IDS booking creation with corrected RequestorID (channel name instead of email)
Based on successful manual test reservation that was posted to IDS.
"""

import asyncio
import json
from datetime import datetime, timedelta
from app.services.ids import IDSService

async def test_corrected_channel_booking():
    """
    Test booking creation with corrected RequestorID using channel name "PEMA"
    instead of email address, as confirmed by IDS support.
    """

    # Initialize IDS service
    ids_service = IDSService()

    print("🔧 IDS ARI 2.4 Integration - Corrected Channel Name Test")
    print("=" * 60)

    # Business rules compliant booking data (3-day minimum stay, max 2 guests)
    booking_data = {
        'unique_id': 'CORRECTED-CHANNEL-TEST-001',
        'check_in_date': '2025-11-01',  # Future date
        'check_out_date': '2025-11-04',  # 3-day stay (meets minimum)
        'adults': 2,                     # Max 2 guests (meets limit)
        'children': 0,
        'room_code': 'EXT',              # Valid room code
        'rate_plan_code': 'RR0925',      # Valid rate plan
        'total_amount': 75000,           # Amount in paise (₹750 = ₹75,000 paise)
        'guest_info': {
            'first_name': 'Test',
            'last_name': 'Guest',
            'email': 'test@pemawellness.com',
            'phone': '+91-9876543210',
            'country': 'India'
        }
    }

    print("📋 Booking Details (Business Rules Compliant):")
    print(f"   Reference: {booking_data['unique_id']}")
    print(f"   Check-in: {booking_data['check_in_date']}")
    print(f"   Check-out: {booking_data['check_out_date']}")
    print(f"   Adults: {booking_data['adults']}  (≤ 2 limit)")
    print(f"   Children: {booking_data['children']}")
    print(f"   Room: {booking_data['room_code']} ({booking_data['rate_plan_code']})")
    print(f"   Total Amount: ₹{booking_data['total_amount'] // 100:,}")
    print()

    print("🔧 Corrected XML Format:")
    print("    RequestorID: ID='PEMA' (channel name, not email)")
    print("    UniqueID: ID_Context='PEMA'")
    print("    BookingChannel: CompanyName Code='PEMA'")
    print()

    print("📡 Sending corrected booking to IDS...")
    result = await ids_service.create_booking(booking_data)

    print(" IDS Response:")
    print(json.dumps(result, indent=2))

    if result.get('success'):
        print("\n SUCCESS: Booking notification sent to IDS with corrected channel format!")
        print("🎯 Expected: IDS should now accept and create the booking in PMS system")
        print("🔍 Next: Check with IDS support if booking appears in their system")
        print("🏨 PMS Reservation Number should be assigned and sent via webhook")
    else:
        print(f"\n FAILED: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    asyncio.run(test_corrected_channel_booking())
