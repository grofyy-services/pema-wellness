#!/usr/bin/env python3
"""
Check for real IDS webhook confirmations
"""

import asyncio
import httpx
import time
from datetime import datetime

async def check_server_status():
    """Check if FastAPI server is running"""

    print("🔍 Checking Server & Webhook Status")
    print("=" * 50)

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get("http://localhost:8000/health")

        if response.status_code == 200:
            print(" FastAPI server is RUNNING on localhost:8000")
            return True
        else:
            print(f"⚠️ Server responded with status: {response.status_code}")
            return False

    except Exception as e:
        print(f" FastAPI server is NOT RUNNING: {e}")
        print("   Start with: python3 -m uvicorn app.main:app --reload --port 8000 --log-level info")
        return False

async def check_webhook_health():
    """Test webhook endpoint health"""

    print("\n🔗 Testing Webhook Endpoint")
    print("=" * 30)

    try:
        # Test with invalid auth (should fail gracefully)
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.post("http://localhost:8000/api/v1/ids/bookings/confirm", content="<test></test>")

        print(f"📡 Webhook endpoint status: {response.status_code}")
        if response.status_code == 401:
            print(" Webhook authentication working (401 = auth required)")
        elif response.status_code == 200:
            print(" Webhook responding")
        else:
            print(f"⚠️ Unexpected webhook response: {response.status_code}")

    except Exception as e:
        print(f" Webhook unreachable: {e}")

async def check_recent_confirmations():
    """Instructions for checking recent confirmations"""

    print("\n📋 Checking for Recent IDS Confirmations")
    print("=" * 50)
    print("Since webhook simulation still has parsing issues,")
    print("check these locations for real IDS confirmations:")
    print()

    print("1️⃣ Server Logs (if server is running):")
    print("   Look for these exact messages:")
    print("   🎉 RECEIVED BOOKING CONFIRMATION FROM IDS")
    print("   📧 Echo Token: [booking-reference]")
    print("    Full Confirmation XML: [XML content]")
    print("   🏨 PMS Reservation Number: [PMS number]")
    print()

    print("2️⃣ Terminal Output (if running interactively):")
    print("   Check for webhook POST requests to /api/v1/ids/bookings/confirm")
    print()

    print("3️⃣ Contact IDS Support:")
    print("   📞 Call IDS and ask:")
    print("   • 'Did you send OTA_NotifReportRQ confirmations?'")
    print("   • 'What's our webhook URL in your system?'")
    print("   • 'Can you resend confirmations?'")
    print()

    print("4️⃣ Test Booking Reference:")
    print("   🎫 FINAL-TEST-KUNDAN-KUMAR-001 (Kundan Kumar)")
    print("   Ask IDS: 'What's the PMS number for this booking?'")

async def test_with_real_xml():
    """Test with real IDS XML format"""

    print("\n🧪 Testing with Real IDS XML Format")
    print("=" * 50)

    # Real IDS XML format from specification
    real_ids_xml = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_NotifReportRQ xmlns="http://www.opentravel.org/OTA/2003/05"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema" TimeStamp="2017-07-24T13:00:27" Version="1.0" EchoToken="FINAL-TEST-KUNDAN-KUMAR-001">
  <Success />
  <NotifDetails>
    <HotelNotifReport>
      <HotelReservations>
        <HotelReservation CreateDateTime="14-07-2017 00:00:00"
        CreatorID="PemaWellness" LastModifierID="PemaWellness" LastModifyDateTime="14-07-2017 00:00:00">
          <UniqueID ID="FINAL-TEST-KUNDAN-KUMAR-001" Type="14" />
          <TPA_Extensions>
            <BasicPropertyInfo HotelCode="7167" />
          </TPA_Extensions>
          <ResGlobalInfo>
            <HotelReservationIDs>
              <HotelReservationID ResID_Type="14" ResID_Value="PMS123456" />
            </HotelReservationIDs>
          </ResGlobalInfo>
        </HotelReservation>
      </HotelReservations>
    </HotelNotifReport>
  </NotifDetails>
</OTA_NotifReportRQ>'''

    try:
        # Base64 encode credentials
        import base64
        auth = base64.b64encode(b'tdd@pemawellness.com:Ids@1001').decode()

        headers = {
            'Authorization': f'Basic {auth}',
            'Content-Type': 'application/xml'
        }

        print("📤 Testing webhook with real IDS XML format...")
        print("🏨 Expected PMS Number: PMS123456")
        print("🎫 Booking Reference: FINAL-TEST-KUNDAN-KUMAR-001")

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "http://localhost:8000/api/v1/ids/bookings/confirm",
                content=real_ids_xml,
                headers=headers
            )

        print(f"📡 Response Status: {response.status_code}")
        print(f" Response: {response.text}")

        if response.status_code == 200:
            try:
                resp_data = response.json()
                if resp_data.get('success'):
                    print(" SUCCESS! Webhook processed real IDS XML correctly!")
                    print(f"🏨 PMS Number in response: {resp_data.get('pms_reservation_number')}")
                else:
                    print(" Webhook processing failed")
                    print(f"Error: {resp_data.get('error')}")
            except:
                print("⚠️ Response not valid JSON")
        else:
            print(f" HTTP Error: {response.status_code}")

    except Exception as e:
        print(f" Test failed: {e}")

async def main():
    """Main checking function"""

    print("🔍 REAL IDS CONFIRMATION CHECK")
    print("=" * 60)
    print(f"⏰ Check started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Check server status
    server_running = await check_server_status()

    if server_running:
        # Check webhook health
        await check_webhook_health()

        # Test with real XML
        await test_with_real_xml()
    else:
        print(" Cannot check webhook - server not running")

    # Instructions for checking confirmations
    await check_recent_confirmations()

    print("\n🎯 VERDICT")
    print("=" * 50)
    if server_running:
        print(" Server running - webhook ready for IDS confirmations")
        print("⏳ Monitor logs for 'RECEIVED BOOKING CONFIRMATION FROM IDS'")
        print("📞 Contact IDS support to verify confirmation sending")
    else:
        print(" Server not running - start FastAPI server first")
        print("   python3 -m uvicorn app.main:app --reload --port 8000 --log-level info")

    print("\n🏨 Expected PMS Number Format: PMS123456 or similar")
    print("🎫 Test Booking: FINAL-TEST-KUNDAN-KUMAR-001 (Kundan Kumar)")

if __name__ == "__main__":
    asyncio.run(main())
