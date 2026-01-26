# Pema Wellness Website

A comprehensive wellness retreat website built with Next.js 15, featuring luxury accommodations, wellness programs, and booking functionality for the Pema Wellness sanctuary.

## 🌟 Overview

Pema Wellness is a luxury wellness retreat offering comprehensive health programs, naturopathic treatments, and transformative experiences in a serene sanctuary setting. This website provides visitors with information about programs, accommodations, expert practitioners, and seamless booking capabilities.

## 🚀 Features

- **Modern Web Experience**: Built with Next.js 15 and React 19
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Wellness Programs**: Comprehensive information about various wellness and medical programs
- **Booking System**: Integrated room selection and reservation functionality
- **Expert Profiles**: Detailed information about naturopathic practitioners and wellness experts
- **Virtual Tours**: Interactive carousels showcasing the sanctuary and accommodations
- **Multi-language Support**: Country-specific content and currency selection
- **Performance Optimized**: Fast loading with image optimization and caching

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **State Management**: Jotai
- **UI Components**: Custom components with Lucide React icons
- **Carousels**: Swiper.js for interactive content
- **Forms**: Custom form components with validation
- **Fonts**: Custom Ivy Ora Display font family
- **Build Tool**: Turbopack for faster development

## 📁 Project Structure

```
pema/
├── app/                    # Next.js App Router pages
│   ├── homepage/          # Homepage components
│   ├── about-us/          # About section
│   ├── the-sanctuary/     # Accommodation details
│   ├── wellness-program/  # Main wellness program
│   ├── medical-health-program/ # Medical wellness program
│   ├── pema-lite/         # Short-term wellness program
│   ├── plan-your-visit/   # Travel and preparation info
│   ├── booking/           # Booking system
│   ├── contact-us/        # Contact forms
│   └── resources/         # FAQs and support
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── api/                   # API utilities
├── public/               # Static assets (images, videos)
└── docs/                 # Project documentation
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pema-wellness/pema
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run deploy` - Deploy script (pulls latest, installs, builds, and restarts PM2)

## 🎨 Key Features

### Wellness Programs
- **Main Wellness Program**: Comprehensive wellness retreat experience
- **Medical Health Program**: Medical-focused wellness treatments
- **Pema Lite**: Short-term wellness reset program

### Accommodations
- **The Sanctuary**: Luxury accommodation showcase
- **Virtual Tours**: Interactive carousel tours
- **Room Details**: Detailed information about rooms and amenities

### Booking System
- **Room Selection**: Interactive room and guest picker
- **Date Selection**: Custom date picker with availability
- **Confirmation**: Booking confirmation and details

### Expert Profiles
- **Naturopathic Practitioners**: Detailed expert profiles
- **Testimonials**: Client success stories and reviews
- **Video Content**: Expert interviews and program introductions

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=your_api_url
# Add other environment variables as needed
```

### Custom Fonts

The project uses the custom Ivy Ora Display font family. Font files are located in `app/fonts/` and configured in `app/globals.css`.

## 📱 Responsive Design

The website is built with a mobile-first approach using Tailwind CSS:

- **Mobile**: Optimized for mobile devices with touch-friendly interfaces
- **Tablet**: Enhanced layouts for tablet viewing
- **Desktop**: Full-featured experience for desktop users

## 🚀 Deployment

The application can be deployed to various platforms:

### Production Deployment
```bash
npm run build
npm run start
```

### PM2 Deployment
```bash
npm run deploy
```

### Docker Deployment
```bash
docker build -t pema-website .
docker run -p 3000:3000 pema-website
```

For detailed deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 📚 Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed project organization
- [Components](docs/COMPONENTS.md) - Component documentation
- [API Documentation](docs/API.md) - API endpoints and usage
- [Styling Guide](docs/STYLING.md) - Styling conventions and guidelines
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For support or questions about the Pema Wellness website:
- Contact the development team
- Check the documentation in the `docs/` folder
- Review the project structure documentation

---

Built with ❤️ for Pema Wellness - Transforming lives through holistic wellness experiences.
