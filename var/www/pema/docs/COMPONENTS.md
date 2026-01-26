# Component Documentation

This document provides detailed information about the reusable components in the Pema Wellness website.

## 🧩 Core Components

### Navigation Components

#### NavBar.tsx
Main navigation component with responsive design and mobile menu.

**Features:**
- Responsive navigation with mobile hamburger menu
- Active page highlighting
- Smooth scroll behavior
- Logo integration

**Props:** None (uses Next.js router for navigation)

#### InfoHeader.tsx
Top information bar with contact details and announcements.

**Features:**
- Contact information display
- Responsive text sizing
- Optional announcement banner

### Form Components

#### ContactUsFormFooter.tsx
Footer contact form with validation and submission handling.

**Features:**
- Form validation
- Success/error messaging
- Responsive design
- Integration with notification system

#### DatePicker.tsx
Custom date range picker component.

**Features:**
- Date range selection
- Custom styling to match brand
- Validation and error handling
- Mobile-optimized interface

#### CountryDropDown.tsx
Country and currency selection dropdown with flags.

**Features:**
- Country flag integration
- Currency conversion support
- Search functionality
- Responsive design

#### RoomGuestPicker.tsx
Room and guest count selection component.

**Features:**
- Room type selection
- Guest count controls
- Price calculation
- Validation

### UI Components

#### PrimaryButton.tsx
Styled button component with consistent branding.

**Props:**
- `children`: Button content
- `onClick`: Click handler
- `disabled`: Disabled state
- `variant`: Button style variant
- `size`: Button size

#### Modal.tsx
Reusable modal dialog component.

**Props:**
- `isOpen`: Modal visibility state
- `onClose`: Close handler
- `children`: Modal content
- `title`: Modal title (optional)

#### DropDown.tsx
Generic dropdown component for various selection needs.

**Props:**
- `options`: Array of options
- `value`: Selected value
- `onChange`: Change handler
- `placeholder`: Placeholder text
- `disabled`: Disabled state

### Display Components

#### SwiperWrapper.tsx
Wrapper component for Swiper carousels with custom configuration.

**Features:**
- Custom scrollbar implementation
- Loop mode support
- Responsive breakpoints
- Touch and mouse interaction

#### TextTestimonials.tsx
Testimonial display component with formatting.

**Features:**
- Quote formatting
- Author attribution
- Responsive text sizing
- Styling consistency

#### BreadCrumbs.tsx
Navigation breadcrumb component.

**Features:**
- Dynamic breadcrumb generation
- Link navigation
- Responsive design
- Home link integration

### Utility Components

#### WhatsappButtonSticky.tsx
Sticky WhatsApp contact button.

**Features:**
- Fixed positioning
- WhatsApp integration
- Responsive visibility
- Contact number configuration

## 🎨 Styling Guidelines

### Component Styling
- Use Tailwind CSS utility classes
- Follow the established color palette
- Implement responsive design patterns
- Maintain consistent spacing and typography

### Color Usage
- **Primary**: `text-pemaBlue` for headings and CTAs
- **Secondary**: `text-slateGray` for body text
- **Background**: `bg-softSand` for section backgrounds
- **Accent**: `text-sunkbakedShell` for highlights

### Typography
- **Headings**: `font-ivyOra` for titles and headings
- **Body Text**: `font-crimson` for descriptions and content
- **UI Elements**: Default font for buttons and form elements

### Responsive Patterns
- Mobile-first approach
- Use `md:` prefix for tablet and up
- Use `lg:` prefix for desktop and up
- Implement proper touch targets for mobile

## 🔧 Component Development

### Creating New Components

1. **File Structure**
   ```
   components/
   └── NewComponent.tsx
   ```

2. **TypeScript Interface**
   ```typescript
   interface NewComponentProps {
     // Define props with proper types
   }
   ```

3. **Component Structure**
   ```typescript
   const NewComponent: React.FC<NewComponentProps> = ({ prop1, prop2 }) => {
     // Component logic
     return (
       <div className="tailwind-classes">
         {/* Component JSX */}
       </div>
     )
   }
   ```

4. **Export**
   ```typescript
   export default NewComponent
   ```

### Best Practices

- **Props Validation**: Use TypeScript interfaces for all props
- **Responsive Design**: Always implement mobile-first responsive design
- **Accessibility**: Include proper ARIA labels and semantic HTML
- **Performance**: Use React.memo for expensive components
- **Testing**: Write unit tests for complex components

### Common Patterns

#### Conditional Rendering
```typescript
{condition && <Component />}
```

#### Responsive Classes
```typescript
className="text-sm md:text-base lg:text-lg"
```

#### Event Handlers
```typescript
const handleClick = (e: React.MouseEvent) => {
  e.preventDefault()
  // Handler logic
}
```

## 📱 Mobile Considerations

### Touch Targets
- Minimum 44px touch target size
- Adequate spacing between interactive elements
- Clear visual feedback for touch interactions

### Performance
- Optimize images for mobile
- Use lazy loading where appropriate
- Minimize JavaScript bundle size

### Navigation
- Implement mobile-friendly navigation patterns
- Use hamburger menus for complex navigation
- Ensure easy thumb navigation

## 🎯 Integration Guidelines

### Next.js Integration
- Use Next.js Image component for images
- Implement proper SEO with metadata
- Use Next.js routing for navigation

### State Management
- Use React hooks for local state
- Implement proper state lifting when needed
- Use context for global state

### API Integration
- Use the centralized API client
- Implement proper error handling
- Use loading states for async operations
