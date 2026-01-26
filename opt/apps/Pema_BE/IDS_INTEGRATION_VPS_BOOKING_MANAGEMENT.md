# IDS Next Integration: VPS Deployment & Booking Management

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [IDS Next ARI Specification](#ids-next-ari-specification)
- [Database Setup](#database-setup)
- [VPS Deployment](#vps-deployment)
- [IDS Integration](#ids-integration)
- [Booking Management](#booking-management)
- [Testing & Monitoring](#testing--monitoring)
- [Troubleshooting](#troubleshooting)
- [Production Checklist](#production-checklist)

## Overview

This document covers the complete integration of Pema Wellness backend with IDS Next (Inventory, Availability, Rates) system, including VPS deployment and dual booking management.

### Key Features
- **Real-time Availability**: Room availability checked from IDS only (fail-safe design)
- **Dual Booking System**: Bookings created in both local DB and IDS
- **Automatic Synchronization**: Background sync for availability and rates
- **Comprehensive Error Handling**: Graceful fallback and retry mechanisms
- **VPS Production Ready**: Full deployment guide for production environment

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│  Pema Backend   │────│   IDS Next API  │
│   (React/Next)  │    │   (FastAPI)     │    │   (ARI 2.4)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ PostgreSQL VPS  │
                       │   Database      │
                       └─────────────────┘
```

### Components
- **Pema Backend**: FastAPI application handling bookings, payments, and IDS communication
- **IDS Service**: Dedicated service for IDS API communication with XML serialization
- **Database**: PostgreSQL on VPS with room codes mapped to IDS specifications
- **Background Workers**: Periodic synchronization of availability and rates

## IDS Next ARI Specification

### Supported Operations
1. **Availability Management** (OTA_HotelAvailNotifRQ/RS)
   - Room availability updates with restrictions
   - Length of stay restrictions
   - Day-of-week specific availability

2. **Rate Management** (OTA_HotelRatePlanNotifRQ/RS)
   - Rate plan updates
   - Seasonal pricing
   - Currency handling

3. **Booking Operations** (OTA_HotelResNotifRQ, OTA_CancelRQ)
   - Booking creation with guest details
   - Booking cancellation
   - Special requests handling

### Room Code Mapping

| Room Category | Bed Type | IDS Code | Room Numbers |
|---------------|----------|----------|--------------|
| Executive | Twin | EXT | 101, 107, 108 |
| Executive | Queen | EXQ | 102-106, 109, 111, 112 |
| Executive Junior Suite | Super King | SUI | 110, 113 |
| Pema Suite | Super King | PES | 114-118 |
| Standard | Twin | STT | 201-205, 207-215 |
| Standard | Queen | STQ | 206, 209 |
| Premium Balcony | Twin | PBT | 301-303, 305-308, 310, 312, 314-319 |
| Premium Balcony | Queen | PBQ | 304, 309, 311, 313 |
| Premium Garden | Twin | PGT | 401-419 |
| Elemental Villa | Super King | PEV | 501-505 |

## Database Setup

### Prerequisites
- PostgreSQL 14+ on VPS
- Database access from application server
- pgAdmin or similar admin tool

### VPS Database Connection
```bash
# Connection details
Host: 82.25.104.195
Port: 55432
Database: pema_wellness
Username: pema_user
Password: pema_password
```

### Room Code Updates
The database has been updated with correct IDS codes. All rooms now use shared codes (EXT, EXQ, etc.) instead of individual codes.

### Schema Changes
```sql
-- Added IDS booking reference to bookings table
ALTER TABLE bookings ADD COLUMN ids_booking_reference VARCHAR(50);

-- Removed unique constraint on rooms.code to allow shared IDS codes
ALTER TABLE rooms DROP CONSTRAINT uq_rooms_code;
```

## VPS Deployment

### Server Requirements
- Ubuntu 22.04 LTS
- 2GB RAM minimum
- 20GB SSD storage
- Python 3.9+
- PostgreSQL 14+

### Installation Steps

#### 1. System Updates
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip postgresql-client nginx certbot
```

#### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/your-repo/pema-be.git
cd pema-be

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with production values
nano .env
```

**Required Environment Variables:**
```bash
# Database
DATABASE_URL=postgresql://pema_user:pema_password@82.25.104.195:55432/pema_wellness

# IDS Integration
IDS_BASE_URL=https://your-ids-api.com
IDS_HOTEL_CODE=YOUR_HOTEL_CODE
IDS_API_KEY=YOUR_API_KEY
IDS_API_SECRET=YOUR_API_SECRET

# Application
SECRET_KEY=your-secret-key-here
DEBUG=False
```

#### 4. Database Migration
```bash
# Run any pending migrations
alembic upgrade head
```

#### 5. Nginx Configuration
```bash
# Create nginx site configuration
sudo nano /etc/nginx/sites-available/pema-wellness

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/pema-wellness /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

#### 7. Process Management
```bash
# Install PM2 or use systemd
sudo nano /etc/systemd/system/pema-wellness.service

# Add service configuration:
[Unit]
Description=Pema Wellness Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/pema-be
Environment=PATH=/home/ubuntu/pema-be/venv/bin
ExecStart=/home/ubuntu/pema-be/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start service
sudo systemctl enable pema-wellness
sudo systemctl start pema-wellness
```

## IDS Integration

### Configuration
```python
# app/core/config.py
IDS_BASE_URL: str = "https://api.idsnext.com"  # IDS API endpoint
IDS_HOTEL_CODE: str = "PEMA001"                 # Your hotel code
IDS_API_KEY: str = "your-api-key"               # API authentication
IDS_API_SECRET: str = "your-api-secret"         # API secret
IDS_SYNC_INTERVAL_MINUTES: int = 15             # Background sync interval
IDS_ENABLE_BACKGROUND_SYNC: bool = True         # Enable sync
```

### Core Services

#### IDSService Class
```python
# app/services/ids.py
class IDSService:
    async def check_availability(self, query: AvailabilityQuery) -> List[AvailabilityResponse]
    async def update_availability(self, updates: List[AvailabilityUpdate]) -> OTAHotelAvailNotifRS
    async def update_rates(self, rate_updates: List[RateUpdate]) -> OTAHotelRatePlanNotifRS
    async def create_booking(self, booking_data: dict) -> dict
    async def cancel_booking(self, booking_reference: str, reason: str = None) -> dict
```

#### API Endpoints
```python
# app/api/v1/ids.py
POST /api/v1/ids/test-connection          # Test IDS connectivity
POST /api/v1/ids/check-availability       # Query room availability
POST /api/v1/ids/update-availability      # Update availability
POST /api/v1/ids/update-rates            # Update rates
POST /api/v1/ids/sync-availability       # Manual sync trigger
```

### Background Synchronization
```python
# app/main.py - Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if settings.IDS_ENABLE_BACKGROUND_SYNC:
        scheduler.add_job(
            ids_sync_worker,
            'interval',
            minutes=settings.IDS_SYNC_INTERVAL_MINUTES,
            id='ids_sync'
        )
        scheduler.start()

    yield

    # Shutdown
    if scheduler.running:
        scheduler.shutdown()
```

## Booking Management

### Dual Booking System

#### Booking Creation Flow
```
1. Frontend → Booking Request
2. Pema Backend → Validate & Calculate Price
3. Pema Backend → Check IDS Availability
4. Pema Backend → Create Local Booking
5. Pema Backend → Create IDS Booking
6. Pema Backend → Store IDS Reference
7. Pema Backend → Process Payment (PayU)
8. Response → Frontend
```

#### Booking Cancellation Flow
```
1. Frontend → Cancellation Request
2. Pema Backend → Validate Booking
3. Pema Backend → Cancel Local Booking
4. Pema Backend → Cancel IDS Booking
5. Pema Backend → Process Refund (if applicable)
6. Response → Frontend
```

### IDS Booking Operations

#### Create Booking
```python
# Automatically called during booking creation
booking_data = {
    'room_code': 'EXT',  # IDS room code
    'rate_plan_code': 'Executive',
    'check_in_date': date(2024, 12, 25),
    'check_out_date': date(2024, 12, 27),
    'guest_info': {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john@example.com',
        'phone': '+1234567890',
        'country': 'US'
    },
    'total_amount': 150000,  # in paise
    'adults': 2,
    'children': 0,
    'special_requests': 'Late check-in requested'
}

result = await ids_service.create_booking(booking_data)
# Returns: {'success': True, 'booking_reference': 'uuid', 'status': 'confirmed'}
```

#### Cancel Booking
```python
# Automatically called during booking cancellation
result = await ids_service.cancel_booking(
    booking_reference='uuid-from-creation',
    reason='Guest request'
)
# Returns: {'success': True, 'booking_reference': 'uuid', 'status': 'cancelled'}
```

### Error Handling & Fallbacks

#### Availability Check Failures
- If IDS is unavailable, booking is rejected (fail-safe)
- Local availability is NOT used as fallback
- Clear error messages guide users to contact support

#### Booking Creation Failures
- Local booking succeeds even if IDS booking fails
- IDS booking reference stored only on success
- Background retry mechanism for failed IDS operations

#### Cancellation Failures
- Local cancellation always succeeds
- IDS cancellation attempted but doesn't block local operation
- Manual reconciliation process for failed IDS cancellations

## Testing & Monitoring

### Integration Tests
```bash
# Run IDS integration tests
pytest tests/test_ids_integration.py -v

# Test specific endpoints
curl -X POST "http://localhost:8000/api/v1/ids/test-connection"
curl -X POST "http://localhost:8000/api/v1/ids/check-availability" \
  -H "Content-Type: application/json" \
  -d '{"room_codes": ["EXT"], "start_date": "2024-12-25", "end_date": "2024-12-27"}'
```

### Monitoring Scripts
```python
# Check IDS connectivity
async def monitor_ids_health():
    ids_service = IDSService()
    try:
        # Test basic connectivity
        response = await ids_service._make_request("health", "")
        return {"status": "healthy", "response_time": time_taken}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
```

### Log Monitoring
```bash
# Monitor IDS-related logs
tail -f uvicorn_debug.log | grep -i ids

# Check for errors
grep -i "ids.*error" uvicorn_debug.log
```

### Database Monitoring
```sql
-- Check IDS booking references
SELECT COUNT(*) as total_bookings,
       COUNT(ids_booking_reference) as ids_referenced_bookings
FROM bookings;

-- Monitor room availability
SELECT category, code, COUNT(*) as room_count
FROM rooms
WHERE is_active = true
GROUP BY category, code
ORDER BY category;
```

## Troubleshooting

### Common Issues

#### 1. IDS Connection Failures
```bash
# Check network connectivity
curl -I https://your-ids-api.com

# Verify credentials
curl -H "X-API-Key: YOUR_KEY" \
     -H "X-API-Secret: YOUR_SECRET" \
     https://your-ids-api.com/test
```

#### 2. Room Code Mismatches
```sql
-- Verify room codes in database
SELECT name, category, bed_configuration, code
FROM rooms
WHERE is_active = true
ORDER BY name;
```

#### 3. Booking Synchronization Issues
```sql
-- Find bookings without IDS references
SELECT id, confirmation_number, created_at
FROM bookings
WHERE ids_booking_reference IS NULL
  AND created_at > '2024-01-01';

-- Manual sync script
python3 scripts/sync_missing_bookings.py
```

#### 4. VPS Database Connection
```bash
# Test database connectivity
psql -h 82.25.104.195 -p 55432 -U pema_user -d pema_wellness

# Check connection from application
python3 -c "
import asyncio
import asyncpg
async def test():
    conn = await asyncpg.connect('postgresql://pema_user:pema_password@82.25.104.195:55432/pema_wellness')
    result = await conn.fetchval('SELECT COUNT(*) FROM rooms')
    print(f'Connected successfully. {result} rooms found.')
    await conn.close()
asyncio.run(test())
"
```

### Recovery Procedures

#### Re-sync Availability
```bash
# Manual availability sync
curl -X POST "https://your-domain.com/api/v1/ids/sync-availability"
```

#### Fix Missing IDS References
```python
# scripts/fix_missing_ids_references.py
async def fix_missing_references():
    # Find bookings without IDS references
    # Attempt to create IDS bookings for them
    # Update database with references
    pass
```

## Production Checklist

### Pre-deployment
- [ ] IDS API credentials configured
- [ ] Database connection tested
- [ ] Room codes verified against IDS specification
- [ ] SSL certificate installed
- [ ] Nginx configuration tested
- [ ] Systemd service configured
- [ ] Log rotation configured

### IDS Integration
- [ ] Test connection endpoint works
- [ ] Availability check returns expected results
- [ ] Booking creation includes IDS operations
- [ ] Cancellation propagates to IDS
- [ ] Background sync enabled and running
- [ ] Error handling tested

### Monitoring
- [ ] Application logs configured
- [ ] Database monitoring in place
- [ ] IDS API response monitoring
- [ ] Alert system for failures
- [ ] Backup procedures documented

### Security
- [ ] API keys stored securely
- [ ] Database credentials encrypted
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Input validation active

### Performance
- [ ] Database indexes optimized
- [ ] Caching configured for static data
- [ ] Background jobs not blocking requests
- [ ] Memory usage monitored
- [ ] Response times within acceptable limits

---

**Contact:** For IDS integration support, refer to IDS Next ARI 2.4 specification or contact IDS support team.

**Last Updated:** December 2024
**Version:** 1.0
