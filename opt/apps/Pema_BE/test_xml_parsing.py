#!/usr/bin/env python3
"""
Test XML parsing for OTANotifReportRQ
"""

import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_xml_parsing():
    """Test parsing the OTA_NotifReportRQ XML"""

    print("🧪 Testing OTA_NotifReportRQ XML Parsing")
    print("=" * 50)

    # Sample XML
    xml_content = '''<?xml version="1.0" encoding="utf-8"?>
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
        from app.services.ids import IDSService

        print(" Testing XML parsing...")
        ids_service = IDSService()

        # Parse the XML
        confirmation = ids_service._xml_to_model(xml_content, ids_service.OTANotifReportRQ)

        print("📊 Parsing Results:")
        print(f"   Echo Token: {confirmation.echo_token}")
        print(f"   Version: {confirmation.version}")
        print(f"   TimeStamp: {confirmation.time_stamp}")
        print(f"   Success: {confirmation.is_success}")
        print(f"   PMS Reservation Number: {confirmation.pms_reservation_number}")

        if confirmation.pms_reservation_number == "PMS987654":
            print(" SUCCESS! XML parsing and PMS extraction working correctly")
            print("   The webhook should now properly parse IDS confirmations")
        else:
            print(f" FAILED! Expected 'PMS987654', got '{confirmation.pms_reservation_number}'")

    except Exception as e:
        print(f" Parsing failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_xml_parsing()