#!/usr/bin/env python3
"""
Verify booking status to check if it exists on IDS/PMS end
"""

import asyncio
import httpx
import base64

async def verify_booking_status():
    """Verify if booking exists by checking status"""

    booking_ref = "TEST-RR0925-FINAL-001"

    print("🔍 Verifying Booking Status")
    print("=" * 50)
    print(f"📋 Booking Reference: {booking_ref}")
    print()

    # Method 1: Check via our API (PMS system)
    print("📡 Method 1: Checking via PMS API")
    print("-" * 30)

    try:
        pms_url = "http://139.167.29.226:81/CheckReservationStatus"
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Basic " + base64.b64encode(b"baypark@idsnext.com:idsnext24412").decode()
        }

        payload = {
            "pmscode": "7167",
            "booking_reference": booking_ref
        }

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(pms_url, headers=headers, json=payload)

        print(f"📡 HTTP Status: {response.status_code}")
        print(f" Response: {response.text}")

        if response.status_code == 200:
            try:
                data = response.json()
                if data.get("Status") == "Success":
                    print(" PMS CONFIRMS: Booking exists!")
                    print(f"📊 Status: {data.get('status', 'Unknown')}")
                else:
                    print(" PMS says: Booking not found or error")
            except:
                print(" PMS response not valid JSON")
        else:
            print(" PMS API error")

    except Exception as e:
        print(f" PMS check failed: {e}")

    print()
    print("📡 Method 2: Direct IDS Verification")
    print("-" * 30)
    print("Since we sent booking to: https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017")
    print("Please contact IDS support to verify if booking exists in their system")
    print()
    print("📞 Contact IDS Support with:")
    print(f"   • Booking Reference: {booking_ref}")
    print("   • Hotel Code: 7167"    print("   • Date Range: 2025-10-25 to 2025-10-27")
    print("   • Rate Plan: RR0925"
    print("   • Guest: Test User (test@example.com)")
    print()
    print("🔍 Ask IDS to check:")
    print("   1. Does booking TEST-RR0925-FINAL-001 exist?")
    print("   2. Is the ReceiveResFromCM endpoint correct for outbound bookings?")
    print("   3. What's the correct endpoint for sending bookings to IDS?")

if __name__ == "__main__":
    asyncio.run(verify_booking_status())
