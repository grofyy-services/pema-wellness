# Styling Guide

This document outlines the design system, styling patterns, and best practices for the Pema Wellness website.

## 🎨 Design System

### Color Palette

The Pema Wellness brand uses a carefully curated color palette that reflects the natural, healing environment of the resort.

#### Primary Colors
```css
/* Pema Blue - Primary brand color */
--color-pemaBlue: #4A778C;
/* Used for: Headings, CTAs, primary buttons, links */

/* Slate Gray - Text and UI elements */
--color-slateGray: #323333;
/* Used for: Body text, secondary text, form labels */

/* Soft Sand - Background accents */
--color-softSand: #F7F2EE;
/* Used for: Section backgrounds, card backgrounds, subtle highlights */

/* Sunbaked Shell - Secondary accent */
--color-sunkbakedShell: #CEA17A;
/* Used for: Highlights, secondary CTAs, decorative elements */
```

#### Usage Guidelines
- **Pema Blue**: Use for primary actions, headings, and important UI elements
- **Slate Gray**: Use for body text, descriptions, and secondary information
- **Soft Sand**: Use for section backgrounds and subtle UI elements
- **Sunbaked Shell**: Use sparingly for highlights and decorative accents

### Typography

The website uses a combination of custom and web fonts to create a sophisticated, readable experience.

#### Font Families

```css
/* Ivy Ora Display - Custom font for headings */
font-family: 'IvyOraDisplay', serif;
/* Weights: 100, 300, 400, 500, 700 */
/* Styles: normal, italic */

/* Crimson Text - Serif font for body text */
font-family: 'Crimson Text', serif;
/* Weights: 400, 600, 700 */
/* Styles: normal, italic */

/* Geist Sans - Modern sans-serif for UI */
font-family: 'Geist', sans-serif;
/* Used for: Buttons, form elements, UI components */
```

#### Typography Scale

```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px */
```

#### Font Usage Guidelines

- **Headings (H1-H6)**: Use Ivy Ora Display with appropriate weights
- **Body Text**: Use Crimson Text for paragraphs and descriptions
- **UI Elements**: Use Geist Sans for buttons, form inputs, and navigation
- **Quotes**: Use Crimson Text italic for testimonials and quotes

## 📱 Responsive Design

### Breakpoint System

The website uses a mobile-first approach with the following breakpoints:

```css
/* Mobile First - Default (320px+) */
/* No prefix needed */

/* Tablet - 768px+ */
@media (min-width: 768px) {
  /* Use md: prefix */
}

/* Desktop - 1024px+ */
@media (min-width: 1024px) {
  /* Use lg: prefix */
}

/* Large Desktop - 1280px+ */
@media (min-width: 1280px) {
  /* Use xl: prefix */
}
```

### Responsive Patterns

#### Grid Layouts
```css
/* Mobile: Single column */
.grid-cols-1

/* Tablet: Two columns */
.md:grid-cols-2

/* Desktop: Three columns */
.lg:grid-cols-3

/* Large Desktop: Four columns */
.xl:grid-cols-4
```

#### Spacing
```css
/* Mobile: Smaller spacing */
.p-4 .mt-8 .mb-6

/* Desktop: Larger spacing */
.md:p-8 .md:mt-12 .md:mb-10
```

#### Typography
```css
/* Mobile: Smaller text */
.text-lg .text-base

/* Desktop: Larger text */
.md:text-xl .md:text-lg
```

## 🧩 Component Styling

### Button Components

#### Primary Button
```css
.btn-primary {
  @apply bg-pemaBlue text-white px-6 py-3 rounded-lg font-medium;
  @apply hover:bg-pemaBlue/90 transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-pemaBlue/50;
}
```

#### Secondary Button
```css
.btn-secondary {
  @apply bg-softSand text-slateGray px-6 py-3 rounded-lg font-medium;
  @apply hover:bg-softSand/80 transition-colors duration-200;
  @apply border border-slateGray/20;
}
```

#### CTA Button
```css
.btn-cta {
  @apply text-pemaBlue font-medium flex items-center gap-2;
  @apply border-b border-pemaBlue hover:border-pemaBlue/70;
  @apply transition-colors duration-200;
}
```

### Card Components

#### Basic Card
```css
.card {
  @apply bg-white rounded-lg overflow-hidden;
  @apply border border-gray-200/50;
  @apply hover:shadow-lg transition-shadow duration-300;
}
```

#### Feature Card
```css
.card-feature {
  @apply bg-softSand rounded-lg p-6;
  @apply hover:bg-softSand/80 transition-colors duration-200;
}
```

### Form Components

#### Input Field
```css
.input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-pemaBlue/50;
  @apply focus:border-pemaBlue transition-colors duration-200;
  @apply placeholder:text-gray-400;
}
```

#### Select Dropdown
```css
.select {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-pemaBlue/50;
  @apply focus:border-pemaBlue transition-colors duration-200;
  @apply bg-white;
}
```

## 🎯 Layout Patterns

### Section Layouts

#### Hero Section
```css
.hero-section {
  @apply min-h-screen flex items-center justify-center;
  @apply bg-gradient-to-br from-softSand to-white;
  @apply px-4 md:px-8 lg:px-16;
}
```

#### Content Section
```css
.content-section {
  @apply py-12 md:py-20 px-4 md:px-8 lg:px-16;
  @apply max-w-7xl mx-auto;
}
```

#### Two Column Layout
```css
.two-column {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12;
  @apply items-center;
}
```

#### Three Column Layout
```css
.three-column {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8;
}
```

### Spacing System

#### Margin and Padding
```css
/* Spacing Scale */
.space-1 { margin: 0.25rem; }   /* 4px */
.space-2 { margin: 0.5rem; }    /* 8px */
.space-4 { margin: 1rem; }      /* 16px */
.space-6 { margin: 1.5rem; }    /* 24px */
.space-8 { margin: 2rem; }      /* 32px */
.space-12 { margin: 3rem; }     /* 48px */
.space-16 { margin: 4rem; }     /* 64px */
.space-20 { margin: 5rem; }     /* 80px */
```

#### Responsive Spacing
```css
/* Mobile: Smaller spacing */
.py-8 .px-4 .mt-6

/* Desktop: Larger spacing */
.md:py-20 .md:px-8 .md:mt-12
```

## 🎨 Visual Effects

### Animations

#### Hover Effects
```css
.hover-lift {
  @apply transition-transform duration-300 hover:-translate-y-1;
}

.hover-scale {
  @apply transition-transform duration-300 hover:scale-105;
}

.hover-fade {
  @apply transition-opacity duration-300 hover:opacity-80;
}
```

#### Loading Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}
```

#### Smooth Transitions
```css
.transition-smooth {
  @apply transition-all duration-300 ease-in-out;
}
```

### Shadows and Borders

#### Shadow System
```css
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
```

#### Border System
```css
.border-light { border: 1px solid rgb(229 231 235); }
.border-medium { border: 1px solid rgb(209 213 219); }
.border-strong { border: 1px solid rgb(156 163 175); }
```

## 📐 Layout Guidelines

### Container Widths
```css
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }
```

### Content Hierarchy
1. **Page Title**: `text-4xl md:text-5xl font-ivyOra text-pemaBlue`
2. **Section Title**: `text-2xl md:text-3xl font-ivyOra text-slateGray`
3. **Subsection Title**: `text-xl md:text-2xl font-ivyOra text-slateGray`
4. **Body Text**: `text-base md:text-lg font-crimson text-slateGray`
5. **Caption**: `text-sm font-crimson text-slateGray/70`

### Image Guidelines
- Use Next.js Image component for optimization
- Implement responsive image sizing
- Add proper alt text for accessibility
- Use WebP format when possible

## 🎯 Accessibility

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for normal text
- Ensure minimum 3:1 contrast ratio for large text
- Test with color blindness simulators

### Focus States
```css
.focus-visible {
  @apply focus:outline-none focus:ring-2 focus:ring-pemaBlue/50;
  @apply focus:ring-offset-2;
}
```

### Screen Reader Support
- Use semantic HTML elements
- Provide descriptive alt text for images
- Use proper heading hierarchy
- Implement ARIA labels where needed

## 🔧 Custom CSS Classes

### Utility Classes
```css
/* Text utilities */
.text-balance { text-wrap: balance; }
.text-pretty { text-wrap: pretty; }

/* Layout utilities */
.aspect-video { aspect-ratio: 16 / 9; }
.aspect-square { aspect-ratio: 1 / 1; }

/* Animation utilities */
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.animate-slide-up { animation: slideUp 0.6s ease-out; }
```

### Component Variants
```css
/* Button variants */
.btn-outline {
  @apply border-2 border-pemaBlue text-pemaBlue;
  @apply hover:bg-pemaBlue hover:text-white;
}

.btn-ghost {
  @apply text-pemaBlue hover:bg-pemaBlue/10;
}

/* Card variants */
.card-elevated {
  @apply shadow-lg hover:shadow-xl;
}

.card-flat {
  @apply shadow-none border border-gray-200;
}
```

## 📱 Mobile-First Approach

### Touch Targets
- Minimum 44px touch target size
- Adequate spacing between interactive elements
- Clear visual feedback for touch interactions

### Mobile Navigation
- Hamburger menu for complex navigation
- Sticky navigation for easy access
- Clear visual hierarchy

### Performance
- Optimize images for mobile
- Use lazy loading for below-the-fold content
- Minimize JavaScript bundle size

## 🎨 Brand Consistency

### Visual Identity
- Maintain consistent use of brand colors
- Use appropriate fonts for different content types
- Follow established spacing and layout patterns
- Ensure consistent visual hierarchy

### Content Guidelines
- Use clear, concise language
- Maintain consistent tone and voice
- Follow accessibility best practices
- Ensure mobile-friendly content

This styling guide ensures consistency across the entire Pema Wellness website while maintaining the brand's sophisticated and healing-focused aesthetic.
