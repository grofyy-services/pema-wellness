#!/usr/bin/env python3
"""
Test PMS reservation number parsing with exact IDS specification format
"""

import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_pms_parsing():
    """Test parsing PMS reservation number from IDS specification format"""

    print("🧪 Testing PMS Reservation Number Parsing")
    print("=" * 50)

    # Exact XML from IDS specification (user provided)
    ids_xml = '''<?xml version="1.0" encoding="utf-8"?>
<OTA_NotifReportRQ xmlns="http://www.opentravel.org/OTA/2003/05"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema" TimeStamp="2017-07-24T13:00:27" Version="1.0" EchoToken="TEST-COMPLETE-INTEGRATION-001">
  <Success />
  <NotifDetails>
    <HotelNotifReport>
      <HotelReservations>
        <HotelReservation CreateDateTime="14-07-2017 00:00:00"
        CreatorID="PemaWellness" LastModifierID="PemaWellness" LastModifyDateTime="14-07-2017 00:00:00">
          <UniqueID ID="TEST-COMPLETE-INTEGRATION-001" Type="14" />
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
        from app.services.ids import IDSService

        print("📋 Testing with exact IDS specification XML format")
        print(" XML contains PMS reservation number: PMS123456")
        print()

        # Parse using our implementation
        ids_service = IDSService()
        confirmation = ids_service._xml_to_model(ids_xml, ids_service.OTANotifReportRQ)

        print("📊 Parsing Results:")
        print(f"   Echo Token: {confirmation.echo_token}")
        print(f"   Success: {confirmation.is_success}")
        print(f"   PMS Reservation Number: {confirmation.pms_reservation_number}")
        print()

        # Verify extraction
        if confirmation.pms_reservation_number == "PMS123456":
            print(" SUCCESS! PMS reservation number correctly extracted")
            print("   Our parsing logic works with the exact IDS specification format")
            print()
            print("🎯 This means:")
            print("   - XML parsing is correct")
            print("   - PMS number extraction works")
            print("   - If IDS sends this format, we'll get the PMS number")
            print()
            print("📞 Conclusion: Contact IDS support to check if they're sending this response")
        else:
            print(f" FAILED! Expected 'PMS123456', got '{confirmation.pms_reservation_number}'")
            print("   Parsing logic needs to be fixed")

        # Show the parsed structure for debugging
        print("\n🔍 Parsed Structure:")
        if confirmation.notif_details:
            print(f"   NotifDetails: {confirmation.notif_details}")

    except Exception as e:
        print(f" Parsing failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_pms_parsing()
