#!/usr/bin/env python3
"""
Test IDS timestamp parsing
"""

from datetime import datetime
from app.models.ids_booking import OTAHotelResNotifRS

def test_timestamp_parsing():
    """Test parsing IDS timestamp formats"""

    print("🕐 Testing IDS Timestamp Parsing")
    print("=" * 40)

    # Test different timestamp formats IDS might return
    test_timestamps = [
        "2017-07-21T15:21:47",  # IDS sample format
        "2017-07-21T15:21:47+05:30",  # With timezone
        "2017-07-21T15:21:47Z",  # UTC
        "",  # Empty string
        None  # None value
    ]

    for ts in test_timestamps:
        try:
            print(f"\n📅 Testing timestamp: '{ts}'")

            # Test the validator directly
            response = OTAHotelResNotifRS(
                version="3.002",
                echo_token="test-token",
                res_status="Commit",
                time_stamp=ts
            )

            print(f" Parsed successfully: {response.time_stamp}")
            print(f"   Type: {type(response.time_stamp)}")

        except Exception as e:
            print(f" Failed to parse: {e}")

    print("\n🎯 Testing complete!")

if __name__ == "__main__":
    test_timestamp_parsing()
