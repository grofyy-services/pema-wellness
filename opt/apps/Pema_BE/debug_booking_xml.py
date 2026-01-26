#!/usr/bin/env python3
"""
Debug: Show exact XML sent to IDS for booking
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def debug_booking_xml():
    """Debug the exact XML sent to IDS"""

    print("🔍 DEBUGGING BOOKING XML SENT TO IDS")
    print("=" * 60)

    try:
        from app.services.ids import IDSService

        ids_service = IDSService()

        # Same booking data as our test
        booking_data = {
            "room_code": "EXT",
            "rate_plan_code": "RR0925",
            "check_in_date": "2025-10-25",
            "check_out_date": "2025-10-27",
            "guest_info": {
                "first_name": "Kundan",
                "last_name": "Kumar",
                "email": "kundan.kumar@example.com",
                "phone": "+91-9876543210",
                "country": "India"
            },
            "total_amount": 250000,
            "adults": 1,
            "children": 0,
            "special_requests": "Debug: Check if this booking appears in IDS system",
            "currency_code": "INR",
            "unique_id": "DEBUG-XML-KUNDAN-KUMAR-001"
        }

        print("👤 Booking Details:")
        print(f"   Guest: {booking_data['guest_info']['first_name']} {booking_data['guest_info']['last_name']}")
        print(f"   Reference: {booking_data['unique_id']}")
        print(f"   Email: {booking_data['guest_info']['email']}")
        print()

        # Create the booking request object
        from app.models.ids_booking import BookingCreateRequest
        request_data = BookingCreateRequest(**booking_data)

        # Generate the XML (same as what gets sent)
        from app.models.ids_booking import (
            GuestCount, GuestCounts, TimeSpan, Total, Rate, Rates,
            RoomRate, RoomRates, RoomType, RoomTypes, RatePlan, RatePlans,
            RoomStay, RoomStays, GuestName, Address, Addresses, Phone, Phones,
            Emails, ContactInfo, ServiceDetails, Service, Services, UniqueID,
            HotelReservation, HotelReservations, OTAHotelResNotifRQ
        )

        # Build the OTA request (same logic as in IDSService)
        guest_counts = GuestCounts(
            guest_count=[
                GuestCount(AgeQualifyingCode=10, Count=request_data.adults),
                GuestCount(AgeQualifyingCode=8, Count=request_data.children)
            ]
        )

        time_span = TimeSpan(
            Start=request_data.check_in_date.isoformat(),
            End=request_data.check_out_date.isoformat()
        )

        total = Total(
            AmountAfterTax=request_data.total_amount,
            CurrencyCode=request_data.currency_code
        )

        # Room rates
        rate = Rate(
            **{"@EffectiveDate": request_data.check_in_date,
               "@ExpireDate": request_data.check_out_date,
               "@RateTimeUnit": "Day",
               "@UnitMultiplier": 1,
               "Base": {"@AmountAfterTax": str(request_data.total_amount), "@CurrencyCode": request_data.currency_code}}
        )

        rates = Rates(Rate=rate)

        room_rate = RoomRate(
            RoomTypeCode=request_data.room_code,
            RatePlanCode=request_data.rate_plan_code,
            Rates=rates
        )

        room_rates = RoomRates(RoomRate=room_rate)

        # Rate plans
        rate_plan = RatePlan(RatePlanCode=request_data.rate_plan_code)
        rate_plans = RatePlans(RatePlan=rate_plan)

        # Room types
        room_type = RoomType(NumberOfUnits=1, RoomTypeCode=request_data.room_code)
        room_types = RoomTypes(RoomType=room_type)

        # Guest information
        guest_name = GuestName(
            GivenName=request_data.guest_info.first_name,
            Surname=request_data.guest_info.last_name
        )

        addresses = Addresses(
            Address=Address(
                CountryName={"@Code": request_data.guest_info.country.lower(), "#text": request_data.guest_info.country}
            )
        )

        phones = Phones(
            Phone=Phone(
                PhoneTechType=1,
                PhoneNumber=request_data.guest_info.phone,
                FormattedInd=False,
                DefaultInd=True
            )
        )

        emails = Emails(Email=request_data.guest_info.email)

        contact_info = ContactInfo(
            Addresses=addresses,
            Phones=phones,
            Emails=emails
        )

        guest_service_details = ServiceDetails(
            GuestName=guest_name,
            ContactInfo=contact_info
        )

        services_list = [
            Service(
                ServiceType=1,  # Guest information
                ServiceCode="GUEST_INFO",
                ServiceDetails=guest_service_details
            )
        ]

        # Add special requests
        if request_data.special_requests:
            special_service_details = ServiceDetails(Comments=request_data.special_requests)
            services_list.append(
                Service(
                    ServiceType=12,  # Special request
                    ServiceCode="SPECIAL_REQUEST",
                    ServiceDetails=special_service_details
                )
            )

        services = Services(Service=services_list)

        unique_id = UniqueID(**{'@Type': 14, '@ID': request_data.unique_id, '@ID_Context': 'PEMA'})

        room_stay = RoomStay(
            RoomTypes=room_types,
            RatePlans=rate_plans,
            RoomRates=room_rates,
            GuestCounts=guest_counts,
            TimeSpan=time_span,
            Total=total,
            BasicPropertyInfo={"@HotelCode": ids_service.hotel_code},
            ResGuestRPHs={"ResGuestRPH": [{"@RPH": "1"}]},
            Comments={"Comment": [{"Text": request_data.special_requests or "Booking created via Pema Wellness API"}]}
        )

        room_stays = RoomStays(RoomStay=room_stay)

        hotel_reservation = HotelReservation(
            RoomStays=room_stays,
            Services=services,
            UniqueID=unique_id
        )

        hotel_reservations = HotelReservations(HotelReservation=hotel_reservation)

        # Create the OTA request
        import uuid
        from datetime import datetime
        ota_request = OTAHotelResNotifRQ(
            **{"@EchoToken": str(uuid.uuid4())},
            **{"@TimeStamp": datetime.now()},
            **{"HotelReservations": hotel_reservations}
        )

        # Convert to XML
        xml_request = ids_service._model_to_xml(ota_request)

        print(" EXACT XML SENT TO IDS:")
        print("=" * 60)
        print(xml_request)
        print("=" * 60)

        print("\n🔍 XML ANALYSIS:")
        print(f" Guest Name: {request_data.guest_info.first_name} {request_data.guest_info.last_name}")
        print(f" Email: {request_data.guest_info.email}")
        print(f" Room Code: {request_data.room_code}")
        print(f" Rate Plan: {request_data.rate_plan_code}")
        print(f" Dates: {request_data.check_in_date} to {request_data.check_out_date}")
        print(f" Amount: ₹{request_data.total_amount}")
        print(f" EchoToken: Contains unique_id")
        print(f" ResStatus: Commit (new booking)")
        print(f" RequestorID: {ids_service.api_key}")
        print(f" HotelCode: {ids_service.hotel_code}")

        print("\n📞 SHARE THIS WITH IDS SUPPORT:")
        print("   1. Show them this exact XML")
        print("   2. Ask: 'Why is this not creating a booking?'")
        print("   3. Ask: 'What validation errors do you see?'")
        print("   4. Ask: 'Is the ReceiveResFromCM endpoint correct?'")

        # Try to send it (commented out to avoid duplicate bookings)
        print("\n⚠️  BOOKING NOT SENT (for debugging only)")
        print("Uncomment the next lines to actually send the booking:")

        print("""
# Uncomment to send:
# result = await ids_service.create_booking(booking_data)
# print(f"Response: {result}")
        """)

    except Exception as e:
        print(f" Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_booking_xml())
