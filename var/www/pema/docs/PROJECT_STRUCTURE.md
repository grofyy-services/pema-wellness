# Project Structure Documentation

This document provides a comprehensive overview of the Pema Wellness website project structure and organization.

## 📁 Directory Structure

```
pema-wellness/
└── pema/                                    # Main project directory
    ├── app/                                # Next.js App Router pages
    │   ├── about-us/                       # About Us section
    │   │   ├── AboutUs.tsx                # Main about component
    │   │   ├── Article.tsx                # Article display component
    │   │   ├── Testimonials.tsx           # Testimonials component
    │   │   └── page.tsx                   # About Us page route
    │   │
    │   ├── booking/                        # Booking system
    │   │   ├── Booking.tsx                # Main booking component
    │   │   ├── utils.ts                   # Booking utility functions
    │   │   ├── page.tsx                   # Booking page route
    │   │   ├── confirmation/              # Booking confirmation
    │   │   │   └── page.tsx               # Confirmation page
    │   │   └── room-details/              # Room details and reservation
    │   │       ├── page.tsx               # Room details page
    │   │       └── reservation/           # Reservation flow
    │   │           └── page.tsx           # Reservation page
    │   │
    │   ├── coming-soon/                   # Coming soon page
    │   │   └── page.tsx                   # Coming soon route
    │   │
    │   ├── contact-us/                    # Contact section
    │   │   ├── ContactUs.tsx              # Contact form component
    │   │   └── page.tsx                   # Contact page route
    │   │
    │   ├── homepage/                      # Homepage components
    │   │   ├── Gift.tsx                   # Gift section component
    │   │   ├── Koshas.tsx                 # Koshas (wellness layers) component
    │   │   ├── Maps.tsx                   # Location map component
    │   │   ├── Naturopathic.tsx           # Naturopathic approach component
    │   │   ├── SwiperExperts.tsx          # Experts carousel component
    │   │   ├── Table.tsx                  # Pricing table component
    │   │   ├── TableMobile.tsx            # Mobile pricing table
    │   │   ├── Testimonials.tsx           # Homepage testimonials
    │   │   └── page.tsx                   # Homepage route
    │   │
    │   ├── medical-health-program/        # Medical program section
    │   │   ├── FAQs.tsx                   # Medical program FAQs
    │   │   ├── MedicalHealthProgram.tsx   # Main program component
    │   │   ├── SlideData.ts              # Carousel slide data
    │   │   ├── Slides.tsx                # Carousel slides component
    │   │   ├── Testimonials.tsx          # Program testimonials
    │   │   ├── Testimonials2.tsx         # Additional testimonials
    │   │   └── page.tsx                  # Medical program page route
    │   │
    │   ├── our-approach/                  # Wellness approach section
    │   │   ├── FAQs.tsx                  # Approach FAQs
    │   │   ├── Koshas.tsx                # Koshas component
    │   │   ├── Naturopathic.tsx          # Naturopathic approach
    │   │   ├── SwiperExperts.tsx         # Experts carousel
    │   │   ├── Testimonials.tsx          # Approach testimonials
    │   │   └── page.tsx                  # Our approach page route
    │   │
    │   ├── pema-lite/                    # Pema Lite program
    │   │   ├── PemaLite.tsx              # Main Pema Lite component
    │   │   ├── SlideData.ts             # Carousel slide data
    │   │   ├── Slides.tsx               # Carousel slides
    │   │   ├── Testimonials.tsx         # Pema Lite testimonials
    │   │   └── page.tsx                 # Pema Lite page route
    │   │
    │   ├── plan-your-visit/              # Travel and preparation section
    │   │   ├── Carousel.tsx              # Image carousel component
    │   │   ├── CulturalFAQ.tsx           # Cultural FAQs
    │   │   ├── FAQs.tsx                  # General visit FAQs
    │   │   ├── GoingToHillsFaq.tsx       # Hills-specific FAQs
    │   │   ├── HealthSafetyFAQ.tsx       # Health and safety FAQs
    │   │   ├── PaymentFaq.tsx            # Payment FAQs
    │   │   ├── PlanYourVisit.tsx         # Main visit planning component
    │   │   ├── PreparationFaq.tsx        # Preparation FAQs
    │   │   ├── SlideData.ts             # Carousel slide data
    │   │   ├── Slides.tsx               # Carousel slides
    │   │   ├── SupportFAQ.tsx           # Support FAQs
    │   │   ├── Testimonials.tsx         # Visit testimonials
    │   │   ├── Testimonials2.tsx        # Additional testimonials
    │   │   ├── VisaFaq.tsx              # Visa FAQs
    │   │   └── page.tsx                 # Plan your visit page route
    │   │
    │   ├── resources/                    # Resources and FAQs section
    │   │   ├── ApproachFaq.tsx          # Approach FAQs
    │   │   ├── FAQs.tsx                 # General resources FAQs
    │   │   ├── MedicalFaq.tsx           # Medical program FAQs
    │   │   ├── Resources.tsx            # Main resources component
    │   │   ├── SancturyFaq.tsx          # Sanctuary FAQs
    │   │   ├── VisitFaq.tsx             # Visit planning FAQs
    │   │   ├── WellnessFaq.tsx          # Wellness program FAQs
    │   │   └── page.tsx                 # Resources page route
    │   │
    │   ├── success-stories/              # Success stories section
    │   │   ├── SuccessStories.tsx       # Main success stories component
    │   │   ├── Testimonials.tsx         # Success story testimonials
    │   │   ├── Testimonials2.tsx        # Additional testimonials
    │   │   ├── Testimonials3.tsx        # More testimonials
    │   │   └── page.tsx                 # Success stories page route
    │   │
    │   ├── the-sanctuary/                # The Sanctuary section
    │   │   ├── Carousel.tsx             # Custom carousel with scrollbar
    │   │   ├── FAQs.tsx                 # Sanctuary FAQs
    │   │   ├── SlideData.ts            # Carousel slide data
    │   │   ├── Slides.tsx              # Carousel slides
    │   │   ├── Testimonials.tsx        # Sanctuary testimonials
    │   │   ├── Testimonials2.tsx       # Additional testimonials
    │   │   ├── TheSanctury.tsx         # Main sanctuary component
    │   │   └── page.tsx                # The sanctuary page route
    │   │
    │   ├── wellness-program/             # Main wellness program
    │   │   ├── FAQs.tsx                # Wellness program FAQs
    │   │   ├── SlideData.ts            # Carousel slide data
    │   │   ├── Slides.tsx              # Carousel slides
    │   │   ├── Testimonials.tsx        # Program testimonials
    │   │   ├── Testimonials2.tsx       # Additional testimonials
    │   │   ├── WellnessProgram.tsx     # Main program component
    │   │   └── page.tsx                # Wellness program page route
    │   │
    │   ├── fonts/                       # Custom font files
    │   │   ├── IvyOraDisplay-*.ttf     # Custom brand fonts
    │   │   └── ...                     # Various font weights and styles
    │   │
    │   ├── globals.css                  # Global styles and Tailwind config
    │   ├── layout.tsx                   # Root layout component
    │   ├── page.tsx                     # Homepage route
    │   └── favicon.ico                  # Site favicon
    │
    ├── components/                       # Reusable UI components
    │   ├── BreadCrumbs.tsx             # Navigation breadcrumbs
    │   ├── ContactUsFormFooter.tsx     # Footer contact form
    │   ├── CountryDropDown.tsx         # Country/currency selector
    │   ├── DatePicker.tsx              # Date selection component
    │   ├── DropDown.tsx                # Generic dropdown component
    │   ├── Footer.tsx                  # Site footer
    │   ├── InfoHeader.tsx              # Top information bar
    │   ├── Modal.tsx                   # Modal dialog component
    │   ├── NavBar.tsx                  # Main navigation
    │   ├── PrimaryButton.tsx           # Styled button component
    │   ├── RoomGuestPicker.tsx         # Room and guest selection
    │   ├── SwiperWrapper.tsx           # Swiper carousel wrapper
    │   ├── TextTestimonials.tsx        # Testimonial display
    │   └── WhatsappButtonSticky.tsx    # WhatsApp contact button
    │
    ├── hooks/                           # Custom React hooks
    │   └── useDeviceType.ts            # Device detection hook
    │
    ├── lib/                             # Utility libraries
    │   └── useSwiperOnAutoPlay.ts      # Swiper autoplay hook
    │
    ├── utils/                           # Utility functions
    │   ├── types.ts                    # TypeScript type definitions
    │   └── utils.ts                    # Helper functions
    │
    ├── api/                             # API utilities
    │   ├── api.ts                      # API client configuration
    │   └── apiError.ts                 # Error handling
    │
    ├── public/                          # Static assets
    │   ├── images/                     # Image assets
    │   │   ├── sanctury/               # Sanctuary images
    │   │   ├── experts/                # Expert profile images
    │   │   ├── testimonials/           # Testimonial images
    │   │   └── ...                     # Various image categories
    │   ├── videos/                     # Video assets
    │   │   └── home/                   # Homepage videos
    │   └── *.svg                       # SVG icons and graphics
    │
    ├── docs/                            # Project documentation
    │   ├── COMPONENTS.md               # Component documentation
    │   ├── API.md                      # API documentation
    │   ├── DEPLOYMENT.md               # Deployment guide
    │   ├── STYLING.md                  # Styling guide
    │   └── PROJECT_STRUCTURE.md        # This file
    │
    ├── package.json                    # Project dependencies and scripts
    ├── package-lock.json              # Dependency lock file
    ├── next.config.ts                  # Next.js configuration
    ├── tsconfig.json                   # TypeScript configuration
    ├── eslint.config.mjs               # ESLint configuration
    ├── postcss.config.mjs              # PostCSS configuration
    ├── next-env.d.ts                   # Next.js type definitions
    └── README.md                       # Main project documentation
```

## 🏗️ Architecture Overview

### Next.js App Router Structure
The project uses Next.js 15 with the App Router, which provides:
- File-based routing system
- Server and client components
- Built-in optimization features
- TypeScript support

### Component Organization
Components are organized by functionality:
- **Page Components**: Located in `/app/[page-name]/`
- **Reusable Components**: Located in `/components/`
- **Custom Hooks**: Located in `/hooks/`
- **Utilities**: Located in `/utils/` and `/lib/`

### Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Global styles in `globals.css`
- **Component Styles**: Scoped to individual components
- **Responsive Design**: Mobile-first approach

## 📱 Page Structure

### Homepage (`/`)
- Hero section with video background
- Program overview cards
- Expert testimonials
- Wellness approach introduction
- Location and contact information

### About Us (`/about-us`)
- Company story and mission
- Team member profiles
- Company values and approach
- Client testimonials

### The Sanctuary (`/the-sanctuary`)
- Luxury accommodation showcase
- Virtual tour carousel
- Room details and pricing
- Amenities and services
- Booking integration

### Wellness Programs
- **Main Program** (`/wellness-program`): Comprehensive wellness program
- **Medical Program** (`/medical-health-program`): Medical-focused wellness
- **Pema Lite** (`/pema-lite`): Short-term wellness reset

### Plan Your Visit (`/plan-your-visit`)
- Travel information and guides
- Preparation checklists
- FAQ sections by category
- Booking assistance

### Resources (`/resources`)
- Comprehensive FAQ sections
- Support information
- Contact forms
- Additional resources

### Success Stories (`/success-stories`)
- Client transformation stories
- Video testimonials
- Before/after experiences
- Program outcomes

## 🧩 Component Architecture

### Reusable Components
- **Navigation**: NavBar, BreadCrumbs, InfoHeader
- **Forms**: ContactUsFormFooter, DatePicker, CountryDropDown
- **UI Elements**: PrimaryButton, Modal, DropDown
- **Content**: SwiperWrapper, TextTestimonials
- **Interactive**: RoomGuestPicker, WhatsappButtonSticky

### Page-Specific Components
- **Homepage**: Gift, Koshas, Maps, Naturopathic, SwiperExperts
- **Booking**: Booking, RoomGuestPicker
- **Programs**: Various program-specific components
- **FAQs**: Multiple FAQ components for different sections

## 🔧 Configuration Files

### Package Management
- `package.json`: Dependencies and scripts
- `package-lock.json`: Dependency versions lock

### Build Configuration
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `postcss.config.mjs`: PostCSS configuration

### Code Quality
- `eslint.config.mjs`: ESLint rules and configuration
- `.prettierrc`: Code formatting rules

### Styling
- `globals.css`: Global styles and Tailwind configuration
- Custom font files in `/app/fonts/`

## 📊 Asset Organization

### Images
- **Sanctuary**: Accommodation and facility images
- **Experts**: Team member profile photos
- **Testimonials**: Client photos and quotes
- **General**: Icons, backgrounds, and UI elements

### Videos
- **Homepage**: Hero videos and promotional content
- **Programs**: Program introduction videos

### Fonts
- **Ivy Ora Display**: Custom brand font family
- **Crimson Text**: Serif font for body text
- **Geist**: Sans-serif font for UI elements

## 🚀 Development Workflow

### File Naming Conventions
- **Components**: PascalCase (e.g., `PrimaryButton.tsx`)
- **Pages**: lowercase with hyphens (e.g., `page.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: camelCase with `.ts` extension (e.g., `types.ts`)

### Import Organization
- React and Next.js imports first
- Third-party library imports
- Internal component imports
- Utility and type imports
- Relative imports last

### Component Structure
```typescript
// Imports
import React from 'react'
import { ComponentProps } from './types'

// Interface definition
interface ComponentProps {
  // Props definition
}

// Component implementation
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div>
      {/* JSX content */}
    </div>
  )
}

// Export
export default Component
```

This project structure ensures maintainability, scalability, and clear organization for the Pema Wellness website development and maintenance.
