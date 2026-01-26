#!/usr/bin/env python3
"""
Direct test of IDS booking creation to verify if bookings are actually created
"""

import asyncio
import httpx
import base64

async def test_direct_ids_connection():
    """Test direct connection to IDS to verify booking creation"""

    url = 'https://idscmsync-main.idsnext.com/ReceiveResFromCM/CM10017'

    # Complete XML with RR0925 rate plan
    xml = '''<OTA_HotelResNotifRQ xmlns="http://www.opentravel.org/OTA/2003/05"
                     EchoToken="TEST-DIRECT-VERIFY-001"
                     TimeStamp="2025-10-05T16:00:00"
                     Version="3.002"
                     ResStatus="Commit">
  <POS>
    <Source>
      <RequestorID Type="22" ID="PEMA" />
      <BookingChannel Type="7">
        <CompanyName Code="PEMA">Pema Wellness API</CompanyName>
      </BookingChannel>
    </Source>
  </POS>
  <HotelReservations>
    <HotelReservation CreateDateTime="2025-10-05">
      <UniqueID Type="14" ID="TEST-DIRECT-VERIFY-001" ID_Context="PEMA"/>
      <RoomStays>
        <RoomStay>
          <RoomTypes>
            <RoomType NumberOfUnits="1" RoomTypeCode="EXT" />
          </RoomTypes>
          <RatePlans>
            <RatePlan RatePlanCode="RR0925" />
          </RatePlans>
          <RoomRates>
            <RoomRate RoomTypeCode="EXT" RatePlanCode="RR0925">
              <Rates>
                <Rate EffectiveDate="2025-10-25"
                      ExpireDate="2025-10-27"
                      RateTimeUnit="Day" UnitMultiplier="1">
                  <Base AmountAfterTax="250000" CurrencyCode="INR" />
                </Rate>
              </Rates>
            </RoomRate>
          </RoomRates>
          <GuestCounts IsPerRoom="true">
            <GuestCount AgeQualifyingCode="10" Count="2" />
            <GuestCount AgeQualifyingCode="8" Count="1" />
          </GuestCounts>
          <TimeSpan Start="2025-10-25" End="2025-10-27" />
          <Total AmountAfterTax="250000" CurrencyCode="INR" />
          <BasicPropertyInfo HotelCode="7167" />
          <ResGuestRPHs>
            <ResGuestRPH RPH="1" />
          </ResGuestRPHs>
          <Comments>
            <Comment>
              <Text>Direct test to verify IDS booking creation</Text>
            </Comment>
          </Comments>
        </RoomStay>
      </RoomStays>
      <ResGuests>
        <ResGuest ResGuestRPH="1">
          <Profiles>
            <ProfileInfo>
              <Profile ProfileType="1">
                <Customer>
                  <PersonName>
                    <GivenName>Test</GivenName>
                    <Surname>User</Surname>
                  </PersonName>
                  <Telephone PhoneTechType="1" PhoneNumber="+91-9876543210"
                           FormattedInd="false" DefaultInd="true" />
                  <Email EmailType="1">test@example.com</Email>
                  <Address>
                    <CountryName Code="in">India</CountryName>
                  </Address>
                </Customer>
              </Profile>
            </ProfileInfo>
          </Profiles>
        </ResGuest>
      </ResGuests>
    </HotelReservation>
  </HotelReservations>
</OTA_HotelResNotifRQ>'''

    # Base64 encode credentials
    auth = base64.b64encode(b'tdd@pemawellness.com:Ids@1001').decode()

    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
    }

    print("🧪 Testing Direct IDS Connection")
    print("=" * 50)
    print(f"📧 Username: tdd@pemawellness.com")
    print(f"🔑 Password: Ids@1001")
    print(f"🌐 URL: {url}")
    print(f"📋 Booking ID: TEST-DIRECT-VERIFY-001")
    print(f"🏨 Room Code: EXT")
    print(f"💰 Rate Plan: RR0925")
    print()

    try:
        print("📡 Sending booking request to IDS...")
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, content=xml, headers=headers)

        print(f"📡 HTTP Status Code: {response.status_code}")
        print(f"📝 Response Headers: {dict(response.headers)}")
        print(f" Response Body: {response.text}")
        print()

        if response.status_code == 200:
            print(" SUCCESS: IDS accepted the booking request!")
            print("📊 Analysis:")
            print("   - HTTP 200 means IDS received and processed the request")
            print("   - No error response means booking was likely created")
            print("   - The booking should now exist in IDS system")
        elif response.status_code == 401:
            print(" AUTHENTICATION FAILED: Check credentials")
        elif response.status_code == 403:
            print(" AUTHORIZATION FAILED: Account may not have booking permissions")
        elif response.status_code == 400:
            print(" BAD REQUEST: XML format may be invalid")
        else:
            print(f" HTTP ERROR: {response.status_code}")

    except httpx.TimeoutException:
        print(" TIMEOUT: IDS server not responding")
    except httpx.RequestError as e:
        print(f" CONNECTION ERROR: {e}")
    except Exception as e:
        print(f" UNEXPECTED ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_direct_ids_connection())
