# IDS Next ARI Integration

This document describes the integration between Pema Wellness Booking System and IDS Next's Availability, Rates, and Inventory (ARI) system.

## Overview

The IDS Next ARI system provides centralized management of hotel availability, rates, and restrictions. This integration allows Pema Wellness to:

- **Real-time Availability Checks**: Fetch room availability from IDS
- **Booking Synchronization**: Automatically update IDS when bookings are created/cancelled
- **Restriction Management**: Apply open/close restrictions, min/max length of stay rules
- **Payment Processing**: Handle payments on our backend while syncing availability to IDS
- **Bulk Operations**: Update multiple rooms and date ranges efficiently
- **Rate Management**: Sync rates and pricing (optional - currently using local pricing)

## Architecture

### Pricing Strategy
- **Local Pricing**: All pricing calculations remain on our backend
- **Payment Collection**: Payments are processed through our PayU integration
- **IDS Integration**: Full booking synchronization with IDS as the availability authority

### Booking Flow
1. **Estimate**: Check availability from IDS only (no local fallback)
2. **Payment**: Process payment through PayU on our backend (unchanged)
3. **Booking Creation**:
   - Create booking in local database
   - **Create booking on IDS side** (dual booking system)
   - Store IDS booking reference locally
4. **Booking Cancellation**:
   - Cancel booking in local database
   - **Cancel booking on IDS side** (dual cancellation)
5. **Availability**: Always fetched from IDS side only

## Room Inventory & IDS Codes

Based on your room inventory, the following IDS codes are configured:

| Room Category | IDS Code | Room Numbers | Description |
|---------------|----------|-------------|-------------|
| Executive Twin | EXT | 101, 107, 108 | Executive rooms with twin beds |
| Executive Queen | EXQ | 102-106, 109-112 | Executive rooms with queen beds |
| Executive Junior Suite | SUI | 110, 113 | Executive Junior Suite with Super King |
| Pema Suite | PES | 114-118 | Pema Suite with Super King |
| Standard Twin | STT | 201-215 | Standard rooms with twin beds |
| Standard Queen | STQ | 206, 209 | Standard rooms with queen beds |
| Premium Balcony Twin | PBT | 301-308, 310-319 | Premium Balcony rooms with twin beds |
| Premium Balcony Queen | PBQ | 304, 309, 311, 313 | Premium Balcony rooms with queen beds |
| Premium Garden Twin | PGT | 401-419 | Premium Garden rooms with twin beds |
| Elemental Villa | PEV | 501-505 | Elemental Villa with Super King |

## What IDS Can Do

### **Implemented Features**

1. **Availability Management**
   - **IDS-Only Availability**: All availability checks go through IDS (no local fallback)
   - Real-time availability queries
   - Bulk availability updates
   - Room restriction management

2. **Dual Booking System**
   - **Full Booking Synchronization**: Bookings created on both local and IDS systems
   - **Dual Cancellation**: Cancellations processed on both systems
   - IDS booking references stored locally
   - Automatic failure handling with logging

3. **Restriction & Rules**
   - Open/Close room restrictions
   - Minimum/Maximum length of stay rules
   - Day-of-week specific restrictions
   - Rate plan specific availability

4. **Advanced Operations**
   - Bulk availability updates
   - Complex restriction scenarios
   - Rate plan management (framework ready)
   - Background synchronization

### 🔄 **Additional IDS Capabilities** (Available for Future Implementation)

1. **Rate Management**
   - Dynamic rate updates
   - Seasonal pricing
   - Promotional rates
   - Rate plan modifications

2. **Advanced Restrictions**
   - Complex LOS combinations
   - Rate-specific restrictions
   - Time-based restrictions
   - Conditional availability

3. **Reporting & Analytics**
   - Availability reports
   - Booking trends
   - Revenue management
   - Forecasting data

4. **Channel Management**
   - Multi-channel distribution
   - Channel-specific rates
   - Inventory allocation
   - Rate parity management

## Database Preparation

**CRITICAL FIRST STEP**: Update room codes in your database

Your current database stores room numbers (101, 102, etc.) in the `code` field, but IDS integration requires specific codes based on category + bed type:

| Category | Bed Type | IDS Code | Example Rooms |
|----------|----------|----------|---------------|
| Executive | Twin | EXT | Rooms 101, 107, 108 |
| Executive | Queen | EXQ | Rooms 102-106, 109, 111, 112 |
| Standard | Twin | STT | Rooms 201-205, 207-215 |
| Standard | Queen | STQ | Rooms 206, 209 |
| Premium Balcony | Twin | PBT | Most 3xx rooms |
| Premium Balcony | Queen | PBQ | Rooms 304, 309, 311, 313 |
| Premium Garden | Twin | PGT | All 4xx rooms |
| Elemental Villa | Super King | PEV | All 5xx rooms |

**Run this before going live:**

### For Local Development:
```bash
# Option 1: Python script (recommended)
python fix_room_codes.py

# Option 2: SQL file
psql -d your_database -f fix_room_codes.sql
```

### For VPS/Production Server:
```bash
# Upload files to your VPS
scp fix_room_codes.sql check_room_codes.sql user@your-vps-ip:/tmp/

# SSH to your VPS
ssh user@your-vps-ip

# Check current status
psql -d your_database_name -f /tmp/check_room_codes.sql

# Apply fixes
psql -d your_database_name -f /tmp/fix_room_codes.sql

# Verify fixes worked
psql -d your_database_name -f /tmp/check_room_codes.sql
```

This automatically updates all room codes from room numbers to proper IDS codes.

## Configuration

1. **Complete database preparation** (see above)
2. Copy the settings from `ids_config_example.env` to your `.env` file
3. Configure the required settings:
   - `IDS_BASE_URL`: IDS API endpoint URL
   - `IDS_HOTEL_CODE`: Your hotel code assigned by IDS
   - `IDS_API_KEY` & `IDS_API_SECRET`: Authentication credentials
   - `IDS_ROOM_CODE_MAPPING`: Map internal room codes to IDS InvTypeCode
   - `IDS_RATE_PLAN_MAPPING`: Map internal categories to IDS RatePlanCode

## Features

### Availability Management

- **Real-time Availability Checks**: Booking requests check IDS before confirming
- **Restriction Management**: Support for Master/Arrival/Departure restrictions
- **Length of Stay Rules**: Min/Max LOS enforcement
- **Day-of-Week Restrictions**: Apply rules to specific days

### Rate Management

- **Rate Synchronization**: Sync rates from IDS backend
- **Dynamic Pricing**: Use IDS rates for accurate pricing
- **Rate Plan Mapping**: Map internal categories to IDS rate plans

### API Endpoints

#### Availability
- `POST /api/v1/ids/availability/check` - Check availability
- `POST /api/v1/ids/availability/update` - Update availability/restrictions

#### Rates
- `POST /api/v1/ids/rates/update` - Update rates

#### Management
- `GET /api/v1/ids/status` - Check integration status
- `POST /api/v1/ids/test-connection` - Test IDS connection
- `POST /api/v1/ids/sync/availability` - Manual availability sync
- `POST /api/v1/ids/sync/rates` - Manual rate sync

## XML Message Formats

The integration uses OpenTravel Alliance (OTA) XML standards:

### Availability Update (OTA_HotelAvailNotifRQ)
```xml
<OTA_HotelAvailNotifRQ ...>
  <AvailStatusMessages HotelCode="HOTEL_CODE">
    <AvailStatusMessage>
      <StatusApplicationControl Start="2024-01-01" End="2024-01-31"
                               InvTypeCode="LUX" RatePlanCode="Rack" MealPlanCode="CP"/>
      <RestrictionStatus Restriction="Master" Status="Open"/>
      <LengthsOfStay>
        <LengthOfStay Time="3" TimeUnit="Day" MinMaxMessageType="SetMinLOS"/>
        <LengthOfStay Time="30" TimeUnit="Day" MinMaxMessageType="SetMaxLOS"/>
      </LengthsOfStay>
    </AvailStatusMessage>
  </AvailStatusMessages>
</OTA_HotelAvailNotifRQ>
```

### Rate Update (OTA_HotelRatePlanNotifRQ)
```xml
<OTA_HotelRatePlanNotifRQ ...>
  <RatePlanMessages HotelCode="HOTEL_CODE">
    <RatePlanMessage>
      <RatePlan RatePlanCode="RACK">
        <Rates>
          <Rate EffectiveDate="2024-01-01" ExpireDate="2024-01-31">
            <BaseByGuestAmts>
              <BaseByGuestAmt NumberOfGuests="1">10000</BaseByGuestAmt>
              <BaseByGuestAmt NumberOfGuests="2">15000</BaseByGuestAmt>
            </BaseByGuestAmts>
          </Rate>
        </Rates>
      </RatePlan>
    </RatePlanMessage>
  </RatePlanMessages>
</OTA_HotelRatePlanNotifRQ>
```

## Error Handling & Fail-Safe Behavior

### Availability Checks
- **Fail-Safe Approach**: If IDS is unavailable, rooms are considered **unavailable** (prevents overbooking)
- **No Local Fallback**: Availability is IDS-only - no fallback to local database
- **Error Logging**: All IDS failures are logged for monitoring

### Booking Operations
- **Continue on IDS Failure**: If IDS booking creation fails, local booking still succeeds (prevents payment loss)
- **IDS Reference Storage**: Successful IDS bookings store reference locally for future operations
- **Cancellation Safety**: Local cancellation proceeds even if IDS cancellation fails

### Network Resilience
- **Retry Logic**: Automatic retries with exponential backoff for network issues
- **Timeout Handling**: Configurable timeouts prevent hanging requests
- **Detailed Logging**: Comprehensive logging for troubleshooting all operations

## Testing & Monitoring

### Testing Checklist
1. **Connection Test**: `POST /api/v1/ids/test-connection` to verify IDS connectivity
2. **Availability Check**: `GET /api/v1/ids/rooms/{room_code}/availability` to test availability queries
3. **Booking Creation**: Create a test booking and verify it appears in both systems
4. **Booking Cancellation**: Cancel a booking and verify cancellation in both systems

### Monitoring & Alerts
- **IDS Availability**: Monitor if IDS becomes unavailable (availability checks will fail)
- **Booking Sync Failures**: Watch for failed IDS booking creations/cancellations
- **Response Times**: Monitor IDS API response times
- **Error Rates**: Track IDS integration error rates

### Key Metrics to Monitor
- IDS API response times
- Booking synchronization success rate
- Availability check success rate
- Failed booking operations requiring manual intervention

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Verify API key and secret
2. **Invalid Hotel Code**: Check hotel code with IDS
3. **Mapping Errors**: Ensure room/rate plan mappings are correct
4. **Network Timeout**: Check network connectivity to IDS

### Logs

Integration logs are available in the application logs with the prefix `[IDS]`.

## Development Notes

- XML parsing uses standard Python `xml.etree.ElementTree`
- Models are defined in `app/models/ids.py`
- Service logic in `app/services/ids.py`
- API endpoints in `app/api/v1/ids.py`

For detailed IDS ARI specification, refer to the IDS Next ARI documentation.
