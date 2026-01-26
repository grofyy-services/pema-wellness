export type Room = {
  code: string
  name: string
  category:
    | 'Standard'
    | 'Premium Garden'
    | 'Premium Balcony'
    | 'Executive'
    | 'Pema Suite'
    | 'Elemental Villa'
    | 'Executive Junior Suite'
    | 'Garden Executive Suite'
  description: string | null
  occupancy_max_adults: number
  occupancy_max_children: number
  price_per_night_single: number
  price_per_night_double: number
  price_per_night_single_upto_7_nights: number
  price_per_night_double_upto_7_nights: number
  per_night_charges: number
  featured_image: string | null
  amenities: string[]
  total_inventory: number
}

export type PriceLine = {
  description: string
  amount: number
  nights: number | null
  quantity: number | null
}

export type PriceBreakdown = {
  lines: PriceLine[]
  subtotal: number
  taxes: number
  discount: number
  total: number
}

export type StructuredLine = {
  description: string
  amount: number
  nights: number
  quantity: number | null
  room_type?: string
  meal_type?: string
}

export type StructuredBreakdown = {
  room_total: StructuredLine
  child_meal: StructuredLine
  caregiver_room_total: StructuredLine
  caregiver_meal: StructuredLine
}

export type BookingEstimateType = {
  nights: number
  min_stay_ok: boolean
  min_stay_required: number
  per_night_charges: number
  subtotal: number
  taxes: number
  discount: number
  total: number
  structured_breakdown: StructuredBreakdown
  deposit_required: string
  full_payment_required: boolean
  warnings: string[]
  recommendations: string[]
  price_breakdown: PriceBreakdown
  room_available: boolean
  alternative_rooms: unknown[] // you can replace `any` with your Room[] type
}

export type SingleRoom = {
  id: number
  name: string
  code: string
  category: 'Standard' | 'Premium Garden' | 'Premium Balcony' | 'Executive' | 'Executive Suite'
  description: string | null
  occupancy_max_adults: number
  occupancy_max_children: number
  occupancy_max_total: number
  price_per_night_single: number
  price_per_night_double: number
  price_per_night_extra_adult: number
  price_per_night_child: number
  inventory_count: number
  refundable_full_payment_required: boolean
  deposit_amount: number | null
  effective_deposit_amount: number
  amenities: string[]
  features: string | null
  featured_image: string | null
  gallery_images: string[]
  floor_plan_image: string | null
  bed_configuration: string
  room_size_sqft: number | null
  max_extra_beds: number
  medical_equipment_compatible: boolean
  wheelchair_accessible: boolean
  is_active: boolean
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}

// Program Types
export type Doctor = {
  name: string
  title: string
  mobileImage: string
  image: string
  id: number
  about: string
  specialities: string[]
  quote: string
}

export type VideoTestimonial = {
  heading: string
  video_url: string | null
  testimonial_text: string
  user_name: string
}

export type KeyConcern = {
  heading: string
  imgWeb: string
  imgMobile: string
  pointers: string[]
}

export type WhatBringsYouHere = {
  heading: string
  imgWeb: string
  imgMobile: string
  pointers: string[]
}

export type ThreeImgSection = {
  img1: string
  img2: string
  img3: string
  imgMobile: string
  heading: string
  sub_text?: string
  sub_text_1?: string
  sub_text_2?: string
  sub_text_3?: string
}

export type HealingTable = {
  heading: string
  subText1: string
  subText2: string
  problems: string[]
  solutions: string[]
}

export type Phase = {
  id: number
  title: string
  imgWeb: string
  imgMobile: string
  pointers: string[]
  note?: string | null
  phase_label?: string
}

export type InsideProgram = {
  title: string
  sub_title: string
  required_days_text: string
  note: string
  phase1?: string
  phase2?: string
  phase3?: string
  phase1_label?: string
  phase2_label?: string
  phase3_label?: string
  phases: Phase[]
}

export type Experts = {
  heading: string
  doctors: Doctor[]
}

export type WhatsIncludedPointer = {
  id: number
  title: string
  points: string[]
}

export type WhatsIncluded = {
  title: string
  imgWeb: string
  imgMobile: string
  pointers: WhatsIncludedPointer[]
}

export type ProgramEnhancements = {
  img: string
  title: string
  sub_title: string
  pointers: string[]
}

export type TestimonialData = {
  name: string
  id: number
  review: string
}

export type TestimonialsData = {
  bgImgWeb: string
  bgImgMobile: string
  data: TestimonialData[]
}

export type InvestmentProgram = {
  id: number
  program_name: string
  starting_at: number
}

export type InvestmentBooking = {
  title: string
  programs: InvestmentProgram[]
  note: string
}

export type ProgramDetail = {
  id: string
  program_name: string
  header_text: string
  hero_img_web: string
  hero_img_mobile: string
  video_testimonial: VideoTestimonial | null
  program_quote: string
  key_concern?: KeyConcern
  what_brings_you_here?: WhatBringsYouHere
  three_img_section: ThreeImgSection
  healingTable?: HealingTable
  inside_program: InsideProgram
  experts: Experts
  whats_included: WhatsIncluded
  program_enhancements: ProgramEnhancements
  testimonials_data: TestimonialsData
  investment_booking: InvestmentBooking
}
