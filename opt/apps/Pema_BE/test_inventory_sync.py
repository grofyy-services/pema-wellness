#!/usr/bin/env python3
"""
Test script for inventory sync endpoint
"""

import requests
import base64

# Sample XML from BAYPARK_SAMPLE_Inventory.xml
xml_payload = """<?xml version="1.0" encoding="utf-8"?>
<OTA_HotelInvCountNotifRQ EchoToken="20251028103528099818" TimeStamp="2025-10-28T10:35:28" Version="1.2" userid="baypark@idsnext.com" password="idsnext24412" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchemainstance">
    <Inventories HotelCode="7167">
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="EXE"/>
            <UniqueID Type="16" ID="1" />
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="LUX"/>
            <UniqueID Type="16" ID="2" />
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="PLR"/>
            <UniqueID Type="16" ID="4" />
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="PRE"/>
            <UniqueID Type="16" ID="7" />
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="PRR"/>
            <UniqueID Type="16" ID="11" />
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="PRS"/>
            <UniqueID Type="16" ID="16" />
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="SDX"/>
            <UniqueID Type="16" ID="22" />
            <InvCounts>
                <InvCount CountType="2" Count="0" />
            </InvCounts>
        </Inventory>
        <Inventory>
            <StatusApplicationControl Start="2026-02-04" End="2026-02-05" InvCode="SRG"/>
            <UniqueID Type="16" ID="29" />
            <InvCounts>
                <InvCount CountType="2" Count="27" />
            </InvCounts>
        </Inventory>
    </Inventories>
</OTA_HotelInvCountNotifRQ>"""

def test_inventory_sync():
    url = "https://dev.pemawellness.com/api/v1/ids/sync/inventory"

    # Test with XML credentials (no HTTP Basic Auth header)
    headers = {
        "Content-Type": "application/xml",
        "Accept": "application/xml"
        # No Authorization header - should fall back to XML credentials
    }

    print(f"Sending inventory sync request to: {url}")
    print(f"XML payload length: {len(xml_payload)} bytes")

    try:
        response = requests.post(url, data=xml_payload, headers=headers, timeout=30)

        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body:")
        print(response.text)

        if response.status_code == 200:
            print(" Inventory sync successful!")
        else:
            print(" Inventory sync failed!")

    except Exception as e:
        print(f" Request failed: {e}")

if __name__ == "__main__":
    test_inventory_sync()
