#!/usr/bin/env python3
"""
Test script to verify the updated XML format matches FR77WDF890.xml
"""

from datetime import date
from app.services.ids_adapter import IDSAdapterService

def test_xml_format():
    """Test the updated XML generation to match FR77WDF890.xml format"""

    print("🔍 TESTING UPDATED XML FORMAT - MakeMyTrip Compatible")
    print("=" * 60)

    # Test booking data matching FR77WDF890.xml
    booking_data = {
        'unique_id': 'FR77WDF890',
        'check_in_date': date(2025, 10, 9),
        'check_out_date': date(2025, 10, 10),
        'adults': 3,
        'children': 0,
        'room_code': 'EXT',
        'rate_plan_code': 'RR0925',
        'total_amount': 560280,  # ₹5,602.80 in paise
        'currency_code': 'INR',
        'guest_info': {
            'first_name': 'Test Rese',
            'last_name': 'IDS',
            'email': 'test@idsnext.com',
            'phone': 'NA',
            'country': 'India'
        },
        'special_requests': 'Channel booking from MakeMyTrip - Test reservation FX#-5194'
    }

    print("📋 Test Data (matching FR77WDF890.xml):")
    print(f"   Unique ID: {booking_data['unique_id']}")
    print(f"   Dates: {booking_data['check_in_date']} to {booking_data['check_out_date']}")
    print(f"   Guests: {booking_data['adults']} adults")
    print(f"   Room: {booking_data['room_code']}")
    print(f"   Amount: ₹{booking_data['total_amount'] // 100:,}")
    print()

    # Generate XML using updated format
    adapter = IDSAdapterService("dummy_url", "dummy_key", "dummy_secret")
    xml_output = adapter._create_booking_xml(booking_data)

    print(" GENERATED XML (Updated Format):")
    print("=" * 60)
    print(xml_output)
    print("=" * 60)

    # Check for key MakeMyTrip elements
    checks = [
        ('xmlns:xsi', 'XML Schema Instance namespace'),
        ('xmlns:xsd', 'XML Schema Definition namespace'),
        ('ID="BayPark"', 'BayPark RequestorID'),
        ('Type="CHANNEL"', 'Channel booking type'),
        ('Code="BKNG"', 'MakeMyTrip company code'),
        ('MealPlanCode="CP"', 'Continental Plan'),
        ('RatePlanInclusions', 'Rate plan inclusions'),
        ('RatePlanCode="1"', 'Rate plan code 1'),
        ('AmountIncludingMarkup', 'Markup amount in total'),
        ('AddressLine', 'Detailed address line'),
        ('CityName', 'City name in address'),
        ('Code="IND"', 'IND country code'),
    ]

    print(" VERIFICATION CHECKS:")
    all_passed = True
    for check, description in checks:
        if check in xml_output:
            print(f"    {description}")
        else:
            print(f"    MISSING: {description}")
            all_passed = False

    print()
    if all_passed:
        print("🎉 SUCCESS: XML format now matches FR77WDF890.xml MakeMyTrip format!")
        print("📤 Ready to send booking requests to IDS")
        print("📞 Contact IDS support to whitelist dev.pemawellness.com")
    else:
        print("⚠️ Some elements still don't match - review the XML generation")

    return xml_output

if __name__ == "__main__":
    test_xml_format()
