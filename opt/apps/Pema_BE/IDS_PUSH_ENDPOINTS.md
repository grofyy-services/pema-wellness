
# IDS Push Endpoints (for IDS to call us)

## Inventory Notifications
POST /api/v1/ids/inventory/receive
- Receives OTA_HotelInvCountNotifRQ from IDS
- Authenticates using HTTP Basic auth  
- Returns OTA_HotelInvCountNotifRS response

## Availability Notifications  
POST /api/v1/ids/availability/receive
- Receives OTA_HotelAvailNotifRQ from IDS
- Authenticates using HTTP Basic auth
- Returns OTA_HotelAvailNotifRS response

## Booking Notifications
POST /api/v1/ids/bookings/receive  
- Receives OTA_HotelResNotifRQ from IDS
- Authenticates using HTTP Basic auth
- Returns success/error response

## Authentication
All push endpoints require:
- Content-Type: application/xml
- Accept: application/xml  
- Authorization: Basic <base64-encoded-credentials>

## URL to provide to IDS
The base URL for these endpoints would be:
https://your-domain.com/api/v1/ids/

IDS should be configured to POST to:
- /api/v1/ids/inventory/receive
- /api/v1/ids/availability/receive  
- /api/v1/ids/bookings/receive

