# API Documentation

This document outlines the API structure and integration patterns used in the Pema Wellness website.

## 🌐 API Architecture

### Base Configuration
The API client is configured in `/api/api.ts` with centralized error handling and request/response interceptors.

### Error Handling
All API errors are handled through `/api/apiError.ts` with consistent error formatting and user feedback.

## 📡 API Endpoints

### Booking System

#### Room Availability
```typescript
GET /api/rooms/availability
```
**Parameters:**
- `checkIn`: Date string (YYYY-MM-DD)
- `checkOut`: Date string (YYYY-MM-DD)
- `guests`: Number of guests

**Response:**
```typescript
{
  available: boolean,
  rooms: Room[],
  pricing: {
    base: number,
    taxes: number,
    total: number
  }
}
```

#### Room Details
```typescript
GET /api/rooms/:id
```
**Response:**
```typescript
{
  id: string,
  name: string,
  description: string,
  images: string[],
  amenities: string[],
  pricing: {
    base: number,
    currency: string
  },
  capacity: {
    adults: number,
    children: number
  }
}
```

#### Create Reservation
```typescript
POST /api/reservations
```
**Body:**
```typescript
{
  roomId: string,
  checkIn: string,
  checkOut: string,
  guests: {
    adults: number,
    children: number
  },
  guestInfo: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string
  },
  specialRequests?: string
}
```

**Response:**
```typescript
{
  reservationId: string,
  confirmationNumber: string,
  status: 'confirmed' | 'pending' | 'cancelled',
  total: number,
  currency: string
}
```

### Contact Forms

#### Contact Us Form
```typescript
POST /api/contact
```
**Body:**
```typescript
{
  name: string,
  email: string,
  phone?: string,
  subject: string,
  message: string,
  programInterest?: string
}
```

#### Newsletter Subscription
```typescript
POST /api/newsletter
```
**Body:**
```typescript
{
  email: string,
  interests: string[]
}
```

### Content Management

#### FAQ Data
```typescript
GET /api/faqs/:category
```
**Categories:**
- `general` - General questions
- `booking` - Booking and reservations
- `programs` - Wellness programs
- `accommodation` - The Sanctuary
- `travel` - Travel and preparation

**Response:**
```typescript
{
  category: string,
  faqs: FAQ[]
}

interface FAQ {
  id: number,
  question: string,
  answer: string,
  hasCTA?: boolean,
  ctaText?: string,
  ctaLink?: string,
  note?: string
}
```

#### Program Information
```typescript
GET /api/programs/:type
```
**Types:**
- `wellness` - Main wellness program
- `medical` - Medical health program
- `lite` - Pema Lite program

**Response:**
```typescript
{
  id: string,
  name: string,
  description: string,
  duration: number,
  pricing: {
    base: number,
    currency: string,
    includes: string[]
  },
  schedule: {
    daily: string[],
    weekly: string[]
  },
  requirements: string[]
}
```

## 🔧 API Client Usage

### Basic Request
```typescript
import { apiClient } from '@/api/api'

// GET request
const response = await apiClient.get('/api/rooms/availability', {
  params: { checkIn: '2024-01-01', checkOut: '2024-01-07', guests: 2 }
})

// POST request
const response = await apiClient.post('/api/contact', {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Inquiry',
  message: 'Hello, I have a question...'
})
```

### Error Handling
```typescript
import { ApiError } from '@/api/apiError'

try {
  const response = await apiClient.get('/api/rooms/availability')
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message)
    // Handle specific error types
  }
}
```

## 🔐 Authentication

### API Keys
API keys are managed through environment variables:
```env
NEXT_PUBLIC_API_KEY=your_api_key_here
API_SECRET_KEY=your_secret_key_here
```

### Request Headers
All requests include standard headers:
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  'X-Requested-With': 'XMLHttpRequest'
}
```

## 📊 Data Models

### Room Model
```typescript
interface Room {
  id: string
  name: string
  type: 'executive' | 'suite' | 'pema-suite'
  description: string
  images: {
    desktop: string[]
    mobile: string[]
  }
  amenities: string[]
  pricing: {
    base: number
    currency: string
    seasonal?: {
      peak: number
      off: number
    }
  }
  capacity: {
    adults: number
    children: number
    maxOccupancy: number
  }
  availability: {
    available: boolean
    checkIn: string
    checkOut: string
  }
}
```

### Reservation Model
```typescript
interface Reservation {
  id: string
  confirmationNumber: string
  roomId: string
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    nationality?: string
  }
  dates: {
    checkIn: string
    checkOut: string
    nights: number
  }
  guests: {
    adults: number
    children: number
  }
  pricing: {
    base: number
    taxes: number
    total: number
    currency: string
  }
  status: 'confirmed' | 'pending' | 'cancelled'
  specialRequests?: string
  createdAt: string
  updatedAt: string
}
```

### Program Model
```typescript
interface Program {
  id: string
  name: string
  type: 'wellness' | 'medical' | 'lite'
  description: string
  shortDescription: string
  duration: {
    days: number
    nights: number
  }
  pricing: {
    base: number
    currency: string
    includes: string[]
    excludes: string[]
  }
  schedule: {
    daily: string[]
    weekly: string[]
    special: string[]
  }
  requirements: {
    medical: string[]
    preparation: string[]
    documents: string[]
  }
  benefits: string[]
  testimonials: Testimonial[]
}
```

## 🚀 Integration Patterns

### React Query Integration
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Fetch room availability
const { data: availability, isLoading } = useQuery({
  queryKey: ['rooms', 'availability', checkIn, checkOut, guests],
  queryFn: () => apiClient.get('/api/rooms/availability', {
    params: { checkIn, checkOut, guests }
  })
})

// Create reservation
const createReservation = useMutation({
  mutationFn: (reservationData) => 
    apiClient.post('/api/reservations', reservationData),
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  }
})
```

### Form Integration
```typescript
import { useForm } from 'react-hook-form'

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = async (data) => {
    try {
      await apiClient.post('/api/contact', data)
      // Show success message
    } catch (error) {
      // Handle error
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## 🔄 Caching Strategy

### Static Data
- FAQ data cached for 24 hours
- Program information cached for 1 hour
- Room details cached for 30 minutes

### Dynamic Data
- Room availability cached for 5 minutes
- Pricing data cached for 15 minutes
- User-specific data not cached

## 📈 Performance Optimization

### Request Optimization
- Implement request debouncing for search
- Use pagination for large datasets
- Compress response data
- Implement request cancellation

### Caching
- Use React Query for client-side caching
- Implement service worker for offline support
- Cache static assets with long TTL

## 🛡️ Security

### Input Validation
- Validate all input data on both client and server
- Sanitize user inputs
- Implement rate limiting

### Data Protection
- Encrypt sensitive data in transit
- Use HTTPS for all API calls
- Implement proper CORS policies

## 📝 Error Codes

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Custom Error Codes
- `ROOM_UNAVAILABLE` - Room not available for selected dates
- `INVALID_DATES` - Invalid check-in/check-out dates
- `PAYMENT_FAILED` - Payment processing failed
- `RESERVATION_EXPIRED` - Reservation session expired
