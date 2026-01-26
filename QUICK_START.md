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

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript
- **Backend**: FastAPI (running at dev.pemawellness.com)

For more details, see the README.md in the `/var/www/pema/` directory.

