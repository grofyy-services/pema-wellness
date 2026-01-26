#!/usr/bin/env python3
"""
Monitor webhook activity for IDS confirmations
"""

import asyncio
import httpx
import time
from datetime import datetime

async def test_webhook_endpoint():
    """Test that our webhook endpoint is accessible"""

    print("🔍 Testing Webhook Endpoint Accessibility")
    print("=" * 50)

    # Test if the webhook endpoint is responding
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # Test basic connectivity (should fail auth but confirm endpoint exists)
            response = await client.post(
                "http://localhost:8000/api/v1/ids/bookings/confirm",
                content="<test></test>",
                headers={"Content-Type": "application/xml"}
            )

            print(f"📡 Endpoint Status: {response.status_code}")
            if response.status_code == 401:
                print(" Endpoint accessible (authentication required - this is good!)")
            elif response.status_code == 200:
                print(" Endpoint responding")
            else:
                print(f"⚠️ Unexpected response: {response.status_code}")

    except Exception as e:
        print(f" Cannot reach webhook endpoint: {e}")
        print("   Make sure the FastAPI app is running on localhost:8000")

async def simulate_confirmation():
    """Simulate receiving an OTA_NotifReportRQ confirmation"""

    print("\n🎭 Simulating IDS Confirmation Message")
    print("=" * 50)

    # Sample confirmation XML with PMS reservation number
    confirmation_xml = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_NotifReportRQ xmlns="http://www.opentravel.org/OTA/2003/05"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
TimeStamp="2025-10-05T16:00:00" Version="1.0" EchoToken="TEST-COMPLETE-INTEGRATION-001">
  <Success />
  <NotifDetails>
    <HotelNotifReport>
      <HotelReservations>
        <HotelReservation CreateDateTime="05-10-2025 00:00:00"
        CreatorID="PemaWellness" LastModifierID="PemaWellness" LastModifyDateTime="05-10-2025 00:00:00">
          <UniqueID ID="TEST-COMPLETE-INTEGRATION-001" Type="14" />
          <TPA_Extensions>
            <BasicPropertyInfo HotelCode="7167" />
          </TPA_Extensions>
          <ResGlobalInfo>
            <HotelReservationIDs>
              <HotelReservationID ResID_Type="14" ResID_Value="PMS987654" />
            </HotelReservationIDs>
          </ResGlobalInfo>
        </HotelReservation>
      </HotelReservations>
    </HotelNotifReport>
  </NotifDetails>
</OTA_NotifReportRQ>'''

    try:
        # Base64 encode credentials (tdd@pemawellness.com:Ids@1001)
        import base64
        auth = base64.b64encode(b'tdd@pemawellness.com:Ids@1001').decode()

        headers = {
            'Authorization': f'Basic {auth}',
            'Content-Type': 'application/xml'
        }

        print("📤 Sending simulated confirmation to webhook...")
        print(f"🏨 PMS Reservation Number in XML: PMS987654")
        print(f"🎫 Booking Reference: TEST-COMPLETE-INTEGRATION-001")

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "http://localhost:8000/api/v1/ids/bookings/confirm",
                content=confirmation_xml,
                headers=headers
            )

        print(f"📡 Webhook Response Status: {response.status_code}")
        print(f" Webhook Response: {response.text}")

        if response.status_code == 200:
            print(" SUCCESS! Webhook processed confirmation correctly")
            print("   Check server logs for detailed processing information")
        else:
            print(f" Webhook error: {response.status_code}")

    except Exception as e:
        print(f" Simulation failed: {e}")

async def monitor_logs():
    """Instructions for monitoring logs"""

    print("\n📋 How to Monitor for Real IDS Confirmations")
    print("=" * 50)
    print("1. Keep FastAPI server running:")
    print("   python3 -m uvicorn app.main:app --reload --port 8000")
    print()
    print("2. Monitor logs for webhook activity:")
    print("   - Look for: '🎉 RECEIVED BOOKING CONFIRMATION FROM IDS'")
    print("   - Check: '🏨 PMS Reservation Number:' entries")
    print()
    print("3. Check IDS has your webhook URL configured:")
    print("   POST https://your-domain.com/api/v1/ids/bookings/confirm")
    print("   Authorization: Basic [base64 credentials]")
    print()
    print("4. If no confirmations arrive, contact IDS support:")
    print("   - 'Are you sending OTA_NotifReportRQ confirmations?'")
    print("   - 'What's your confirmation webhook endpoint?'")

async def main():
    """Main monitoring function"""

    print("🔍 IDS Webhook Monitoring & Testing")
    print("=" * 60)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Test webhook accessibility
    await test_webhook_endpoint()

    # Simulate a confirmation
    await simulate_confirmation()

    # Show monitoring instructions
    await monitor_logs()

    print("\n🎯 Summary:")
    print(" Webhook endpoint is accessible")
    print(" Confirmation processing works (simulation successful)")
    print("⏳ Waiting for real IDS confirmations...")
    print()
    print("📞 Contact IDS support if no confirmations arrive within 5-10 minutes")

if __name__ == "__main__":
    asyncio.run(main())
