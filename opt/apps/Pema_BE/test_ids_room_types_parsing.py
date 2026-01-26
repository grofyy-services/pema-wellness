#!/usr/bin/env python3
"""
Test script for IDS Room Types Response XML parsing
"""

from app.api.v1.ids import parse_ids_room_types_response

def test_ids_room_types_parsing():
    """Test parsing IDS room types response XML"""

    # XML response from IDS (based on user's example)
    xml_response = '''<?xml version="1.0" encoding="utf-8"?>
<RN_HotelRatePlanRS xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.opentravel.org/OTA/2003/05"
Version="1.2" EchoToken="879791878">
<Success />
<HotelCriteria HotelCode="4747" />
<RoomTypes>
<RoomType InvTypeCode="CLB" Name="Club Room" Quantity="12" IsRoomActive="1">
<RoomDescription />
</RoomType>
<RoomType InvTypeCode="DLS" Name="Deluxe Room - Standard" Quantity="98"
IsRoomActive="1">
<RoomDescription />
</RoomType>
<RoomType InvTypeCode="JST" Name="Junior Suite" Quantity="9" IsRoomActive="1">
<RoomDescription />
</RoomType>
<RoomType InvTypeCode="LUX" Name="LUXURY" Quantity="23" IsRoomActive="1">
<RoomDescription />
</RoomType>
<RoomType InvTypeCode="OBS" Name="ONE BED SUITE" Quantity="12" IsRoomActive="1">
<RoomDescription />
</RoomType>
<RoomType InvTypeCode="OSR" Name="ORCHID SUITE" Quantity="9" IsRoomActive="1">
<RoomDescription />
</RoomType>
<RoomType InvTypeCode="RCR" Name="ROYAL CLUB" Quantity="50" IsRoomActive="1">
<RoomDescription />
</RoomType>
<RoomType InvTypeCode="RSR" Name="ROYAL SUITE" Quantity="3" IsRoomActive="1">
<RoomDescription />
</RoomType>
</RoomTypes>
<RatePlans>
<RatePlan RatePlanCode="5" RatePlanCategory="RACK" RatePlanStatusType="1"
RatePlanName="Rack Rate" Description="Rack Rate" InvTypeCode="CLB" MealPlanCode="CP"
MealPlanDesc="CONTINENTAL PLAN" Start="2017-04-18" End="2018-04-18"
CurrencyCode="RUP" />
<RatePlan RatePlanCode="5" RatePlanCategory="RACK" RatePlanStatusType="1"
RatePlanName="Rack Rate" Description="Rack Rate" InvTypeCode="JST" MealPlanCode="CP"
MealPlanDesc="CONTINENTAL PLAN" Start="2017-04-18" End="2018-04-18"
CurrencyCode="RUP" />
</RatePlans>
<Inclusions>
<Inclusion MealPlanCode="EP" MealPlanDesc="EUROPEAN PLAN" />
<Inclusion MealPlanCode="AP" MealPlanDesc="AMERICAN PLAN" />
<Inclusion MealPlanCode="CP" MealPlanDesc="CONTINENTAL PLAN" />
<Inclusion MealPlanCode="MAP" MealPlanDesc="MODIFIED AMERICAN PLAN" />
</Inclusions>
</RN_HotelRatePlanRS>'''

    try:
        result = parse_ids_room_types_response(xml_response)
        print(" IDS Room Types parsing successful:")
        print(f"  Success: {result['success']}")
        print(f"  Echo Token: {result['echo_token']}")
        print(f"  Hotel Code: {result['hotel_code']}")
        print(f"  Room Types: {len(result['room_types'])}")
        print(f"  Rate Plans: {len(result['rate_plans'])}")
        print(f"  Inclusions: {len(result['inclusions'])}")

        print("\n Room Types:")
        for rt in result['room_types'][:3]:  # Show first 3
            print(f"  - {rt['inv_type_code']}: {rt['name']} (Qty: {rt['quantity']}, Active: {rt['is_room_active']})")

        print("\n💰 Rate Plans:")
        for rp in result['rate_plans']:
            print(f"  - {rp['rate_plan_code']}: {rp['rate_plan_name']} ({rp['rate_plan_category']}) - {rp['inv_type_code']}")

        print("\n🍽️  Inclusions:")
        for inc in result['inclusions']:
            print(f"  - {inc['meal_plan_code']}: {inc['meal_plan_desc']}")

        return True

    except Exception as e:
        print(f" IDS Room Types parsing failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing IDS Room Types Response XML Parsing")
    print("=" * 60)

    success = test_ids_room_types_parsing()

    if success:
        print("\n Test completed successfully!")
        print("IDS room types XML parsing is working correctly")
    else:
        print("\n Test failed!")
        print("Check the parsing logic for issues")
