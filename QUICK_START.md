# Quick Start Guide - Pema Wellness Website

## 🚀 How to Run the Website

### Step 1: Navigate to the Frontend Directory
```bash
cd /Users/aravindsiruvuru/Downloads/website-booking-complete-20251221-1234/var/www/pema
```

### Step 2: Install Dependencies (if needed)
```bash
npm install
```
*Note: Dependencies appear to already be installed, but run this if you encounter any issues.*

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Open the Website
Once the server starts, you'll see output like:
```
  ▲ Next.js 15.5.7
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**Open your browser and go to:** [http://localhost:3000](http://localhost:3000)

---

## 🚀 How to Run the Backend (API)

### Method 1: Using Docker Compose (Recommended)

```bash
cd /Users/aravindsiruvuru/Downloads/website-booking-complete-20251221-1234/opt/apps/Pema_BE
docker-compose up -d
```

This starts:
- **API** on port 8000
- **Redis** for caching
- **Nginx** (optional) on port 8080

**View logs:**
```bash
docker-compose logs -f api
```

**Stop services:**
```bash
docker-compose down
```

### Method 2: Using Makefile (Simplest)

```bash
cd /Users/aravindsiruvuru/Downloads/website-booking-complete-20251221-1234/opt/apps/Pema_BE

# First time setup (creates venv and installs dependencies)
make setup

# For development (runs uvicorn with auto-reload)
make dev

# Or using Docker
make docker-up
```

**Available Make commands:**
- `make setup` - Setup development environment (creates venv, installs deps, creates .env)
- `make venv` - Create virtual environment
- `make install` - Install dependencies
- `make dev` - Start development server (uvicorn) - automatically uses venv
- `make docker-up` - Start with Docker Compose
- `make docker-logs` - View logs
- `make docker-down` - Stop services

### Method 3: Manual Setup (Without Docker)

```bash
cd /Users/aravindsiruvuru/Downloads/website-booking-complete-20251221-1234/opt/apps/Pema_BE

# 1. Create virtual environment (if not already created)
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Make sure you have a .env file with your configuration
# (Copy from env.example if needed)

# 4. Run the application
uvicorn app.main:app --reload --port 8000
```

### Backend Access Points

Once started, the backend will be available at:
- **API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

**Note:** Ensure your `.env` file is configured with database credentials and other settings before starting.

---

## 📋 Available Commands

- `npm run dev` - Start development server (with Turbopack for faster builds)
- `npm run build` - Build for production
- `npm run start` - Start production server (after building)
- `npm run lint` - Run code linting

---

## 🔧 Configuration

### API Configuration
The frontend is currently configured to use the development API at:
- **API URL**: `https://dev.pemawellness.com/api/v1/`

This is set in `/var/www/pema/api/api.ts`. If you need to change it for local development, you can modify the `baseURL` in that file.

### Environment Variables (Optional)
If you need to configure environment variables, create a `.env.local` file in the `pema` directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://dev.pemawellness.com/api/v1
```

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, Next.js will automatically try the next available port (3001, 3002, etc.). Check the terminal output for the actual port.

### Dependencies Issues
If you encounter module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
If you see TypeScript or build errors:
```bash
npm run lint
```

---

## 📚 Additional Information

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript
- **Location**: `/var/www/pema/`

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Payment Gateway**: PayU
- **Location**: `/opt/apps/Pema_BE/`
- **Production**: https://dev.pemawellness.com/api/v1/

For more details:
- Frontend: See README.md in `/var/www/pema/` directory
- Backend: See README.md in `/opt/apps/Pema_BE/` directory

