# Pema Wellness Booking Platform - Backend API

A comprehensive FastAPI-based backend for the Pema Wellness booking and management platform, featuring authentication, booking management, payment processing, and medical form workflows.

## 🏗️ Architecture

- **FastAPI** (async) for HTTP API and webhooks
- **PostgreSQL** for primary relational data storage
- **Redis** for caching, rate limiting, and session management
- **Payu** for payment processing
- **JWT** authentication with role-based access control
- **SQLAlchemy** with async support for database operations
- **Pydantic** for request/response validation

##  Features

### Core Functionality
-  User authentication and authorization (JWT + RBAC)
-  Program and room management
-  Booking estimation and creation
-  Payment processing with Payu integration
-  Medical form submission and doctor review workflow
-  Admin/staff management APIs
-  Comprehensive audit logging
-  **IDS MakeMyTrip Integration** - Real-time booking sync with IDS PMS 

### Business Rules Implementation
-  Minimum stay enforcement (3 nights)
-  Pricing bands and dynamic pricing
-  Occupancy validation
-  Suite full payment requirements
-  Refund policies and automation

### Security & Performance
-  Rate limiting and security headers
-  Input validation and sanitization
-  Structured logging and error handling
-  Redis caching for performance

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (recommended)

### Docker Setup (Recommended)

1. **Clone and setup**:
```bash
git clone <repository>
cd Pema_BE
cp env.example .env
# Edit .env with your configuration
```

2. **Start services**:
```bash
docker-compose up -d
```

3. **Access the application**:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database: localhost:5432
- Redis: localhost:6379

### Manual Setup

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Setup environment**:
```bash
cp env.example .env
# Edit .env with your database and service configurations
```

3. **Initialize database**:
```bash
# Create database
createdb pema_wellness

# Run schema
psql pema_wellness < scripts/schema.sql
```

4. **Start the application**:
```bash
uvicorn app.main:app --reload --port 8000
```

## 📊 Database Schema

The application uses 15 core tables:

- **users** - User accounts and profiles
- **programs** - Wellness/medical programs
- **rooms** - Accommodation inventory
- **pricing_bands** - Flexible pricing rules
- **bookings** - Reservation management
- **payments** - Transaction processing
- **medical_forms** - Patient medical information
- **doctor_reviews** - Medical assessments
- **refunds** - Refund processing
- **cms_pages** - Content management
- **articles** - Resource articles
- **notifications** - Communication tracking
- **audit_logs** - System audit trail
- **integrations** - External service configs

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/me` - Get user profile

### Public APIs
- `GET /api/v1/programs` - List published programs
- `GET /api/v1/programs/{slug}` - Get program details
- `GET /api/v1/rooms` - List available rooms
- `GET /api/v1/room-types` - List brochure/pricing room types with total inventory
- `GET /api/v1/room-availability?check_in_date=YYYY-MM-DDTHH:MM:SS&check_out_date=YYYY-MM-DDTHH:MM:SS` - Availability by category for a date range (checkout day is free for next check-in)

### Booking Flow
- `POST /api/v1/bookings/estimate` - Get booking estimate
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - List user bookings
- `PATCH /api/v1/bookings/{id}/cancel` - Cancel booking

### Payments
- `POST /api/v1/payments/initiate` - Initiate payment
- `POST /api/v1/payments/webhook` - Payment webhooks
- `GET /api/v1/payments` - List payments

### Admin APIs
- `GET /api/v1/admin/bookings` - Manage all bookings
- `POST /api/v1/admin/programs` - Create programs
- `PUT /api/v1/admin/programs/{id}` - Update programs
- `POST /api/v1/admin/rooms` - Create rooms
- `GET /api/v1/admin/dashboard` - Dashboard stats

### IDS MakeMyTrip Integration
- `GET /api/v1/ids/status` - Integration health check
- `POST /api/v1/ids/bookings/create` - Create booking in IDS (JSON)
- `GET /api/v1/ids/bookings/create` - Create booking in IDS (Query params)
- `POST /api/v1/ids/bookings/{id}/cancel` - Cancel booking
- `GET /api/v1/ids/bookings/{id}/status` - Check booking status
- `POST /api/v1/ids/availability/update` - Update availability
- `POST /api/v1/ids/rates/update` - Update rates
- `GET /api/v1/ids/room-types` - Get room types from IDS

### 📋 IDS Integration Documentation

For comprehensive IDS MakeMyTrip integration details, see:
- **[IDS_MAKE_MY_TRIP_INTEGRATION_GUIDE.md](IDS_MAKE_MY_TRIP_INTEGRATION_GUIDE.md)** - Complete integration guide with XML formats, testing procedures, and troubleshooting

**Integration Status:**  **FULLY OPERATIONAL**
- **Latest Booking:** `FR77WDF890-KUNDAN` (October 25, 2025)
- **Reference:** FX#-5194

## 🏢 Business Rules

### Booking Rules
- **Minimum Stay**: 3 nights required
- **Occupancy Limits**: Max 2 adults + 2 children per room
- **Advance Booking**: Up to 365 days in advance

### Payment Policy
- **Standard Rooms**: ₹50,000 refundable deposit → medical form → doctor approval → 50% payment → remaining at check-in
- **Suites**: Full payment required upfront
- **Refunds**: Automated based on cancellation timing

### Medical Workflow
1. Payment received → Medical form unlocked
2. Form submission → Doctor assignment
3. Doctor review → Approval/rejection decision
4. If rejected → Automatic refund processing

## 🛠️ Development

### Code Structure
```
app/
├── main.py              # FastAPI application
├── core/                # Core configuration and utilities
│   ├── config.py        # Settings management
│   ├── security.py      # Authentication & authorization
│   ├── exceptions.py    # Custom exceptions
│   └── logging.py       # Structured logging
├── db/                  # Database configuration
│   ├── postgresql.py    # Database connection
│   └── redis.py         # Redis client and caching
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
├── api/v1/              # API endpoints
├── services/            # Business logic services
└── utils/               # Utility functions
```

### Testing
```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

### Code Quality
```bash
# Format code
black app/
isort app/

# Lint
flake8 app/
mypy app/
```

## 🚀 Deployment

### VPS Deployment (dev.pemawellness.com)

1. **Server Setup**:
```bash
# Connect to VPS
ssh root@82.25.104.195

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

2. **Deploy Application**:
```bash
# Clone repository
git clone <repository> /opt/pema-backend
cd /opt/pema-backend

# Setup environment
cp env.example .env
# Edit .env with production values

# Start services
docker-compose -f docker-compose.yml up -d
```

3. **SSL Setup**:
```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d dev.pemawellness.com
```

### Production Checklist
- [ ] Set DEBUG=false
- [ ] Configure strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Setup production database with backups
- [ ] Configure Redis persistence
- [ ] Setup monitoring (Sentry)
- [ ] Configure email service
- [ ] Setup Payu production keys
- [ ] Configure S3 storage
- [ ] Setup log aggregation
- [ ] Configure rate limiting
- [ ] Setup SSL certificates

## 🔧 Configuration

Key environment variables:

```bash
# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Database
POSTGRES_SERVER=localhost
POSTGRES_USER=pema_user
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=pema_wellness

# Payment (PayU Hosted)
# Required
PAYU_MERCHANT_KEY=your_merchant_key
PAYU_MERCHANT_SALT=your_salt_v1
# Optional: if PayU has provided secondary salt for v2 hashing
PAYU_SALT_256=your_salt_v2
# Optional explicit return URLs (else built from PUBLIC_BASE_URL)
PAYU_SURL=https://yourdomain.com/api/v1/payments/webhook
PAYU_FURL=https://yourdomain.com/api/v1/payments/webhook

# Business Rules
MINIMUM_STAY_NIGHTS=3
DEPOSIT_AMOUNT_INR=50000  # ₹50,000 in rupees
```

## 📝 API Documentation

Once the application is running, comprehensive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:8000/health
```

### Logs
```bash
# View application logs
docker-compose logs -f api

# View all service logs
docker-compose logs -f
```

### Database Monitoring
```bash
# Connect to database
docker-compose exec db psql -U pema_user -d pema_wellness

# Check active connections
SELECT count(*) FROM pg_stat_activity;
```

##  License

This project is proprietary and confidential.

## 📞 Support

For technical support or questions:
- Remember almighty, say all is well God and Create an issue in the repository
- Take name of God and Contact the development team

---

**Note**: This is a production-ready FastAPI application implementing the complete Pema Wellness booking platform backend with all business rules, security measures, and integration points.
