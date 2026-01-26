export const getFormattedAmount = (amount: number | undefined) => {
  if (amount === undefined) return ''
  return `₹ ${amount.toLocaleString('en-IN')}`
}

// Hardcoded exchange rates
const exchangeRates: Record<string, number> = {
  IN: 1, // INR -> INR
  US: 0.012, // INR -> USD
  AE: 0.044, // INR -> AED
  SG: 0.016, // INR -> SGD
  GB: 0.0097, // INR -> GBP
  EU: 0.011, // INR -> EUR
  RU: 1.1, // INR -> RUB
}

// Currency symbols
const currencySymbols: Record<string, string> = {
  IN: '₹',
  US: '$',
  AE: 'د.إ',
  SG: 'S$',
  GB: '£',
  EU: '€',
  RU: '₽',
}

// Import the currency type and atom
import type { CurrencyCode } from '@/lib/atoms'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { getDefaultStore, useAtom, useAtomValue } from 'jotai'
import { atom } from 'jotai'

export function convertINRToCurrency(amountInINR: number, currency: CurrencyCode): string {
  const rate = exchangeRates[currency]
  const symbol = currencySymbols[currency] || ''
  if (!rate) throw new Error('Currency not supported')

  // Convert amount
  const converted = amountInINR * rate

  // Format number based on currency
  const formattedAmount =
    currency === 'IN'
      ? converted.toLocaleString('en-IN', { maximumFractionDigits: 2 })
      : converted.toLocaleString('en-US', { maximumFractionDigits: 2 }) // western style for other currencies

  return `${symbol} ${formattedAmount}`
}

export function convertINRUsingSavedCurrency(amountInINR: number): string {
  // Get currency from atom (works on both client and server)
  const store = getDefaultStore()
  const savedCurrency = store.get(selectedCurrencyAtom)

  return convertINRToCurrency(amountInINR, savedCurrency)
}

export const takeOurHealthQuiz = () => {
  window.open('https://zfrmz.in/dQxCWy2g1RpNOAtDi6Wj')
}

export const inquireAboutGifting = () => {
  const url =
    'https://forms.zohopublic.in/pemawellness5391/form/GiftaStayatPema/formperma/rMXPSe_BjSk9WoMsVgDahtjtDsMw8XwUUey4xxj9fXA'
  window.open(url)
}

export const goToPemaMaps = () => {
  window.open(
    'https://www.google.com/maps/dir//Pema+Wellness+Resort,+Sagarnagar,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh+530045'
  )
}

// export const openWhatsApp = () => {
//   const message =
//     'Hello, I’m interested in planning a visit to Pema Wellness. Could you share details?'
//   const url = `https://wa.me/916303199494?text=${encodeURIComponent(message)}`
//   window.open(url, '_self')
// }

export const openWhatsApp = () => {
  const message =
    'Hello, I’m interested in planning a visit to Pema Wellness. Could you share details?'
  const phone = '916303199494'

  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isAndroid) {
    window.location.href = `intent://send?phone=${phone}&text=${encodeURIComponent(
      message
    )}#Intent;scheme=whatsapp;package=com.whatsapp;end`
  } else {
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }
}

export const openPreArrivalGuide = () => {
  const url =
    'https://drive.google.com/file/d/1Zi1wbxbwhoqL8PPqzo_ouj1m6fFczsMP/view?usp=drive_link'
  window.open(url)
}
export const openPemaPrograms = () => {
  const url = 'https://drive.google.com/file/d/1_T_EP7sT6HKdLGWgpUGy65bPR3T4eIlL/view?usp=sharing'
  window.open(url)
}

export const ROUTES = {
  // Main pages
  home: '/',
  homepage: '/homepage',
  aboutUs: '/about-us',
  contactUs: '/contact-us',
  comingSoon: '/coming-soon',
  // Programs
  wellnessProgram: '/wellness-program',
  medicalHealthProgram: '/medical-health-program',
  pemaLite: '/pema-lite',

  // The Sanctuary
  theSanctuary: '/the-sanctuary',

  // Planning
  planYourVisit: '/plan-your-visit',

  // Resources
  resources: '/resources',

  // Success Stories
  successStories: '/success-stories',

  // Our Approach
  ourApproach: '/our-approach',

  // Medical Health Assessment
  medicalHealthAssessment: '/medical-health-assessment',

  // Booking system
  booking: '#',
  bookingConfirmation: '/booking/confirmation',
  roomDetails: '/booking/room-details',
  reservation: '/booking/room-details/reservation',
  programsSection: '/homepage',
  privacyPolicy: '/privacy-policy',
  disclaimer: '/disclaimer',
  thankYou: '/thank-you',
  paymentReturn: '/payment/return',
} as const

// Route type for TypeScript
export type Route = (typeof ROUTES)[keyof typeof ROUTES]

// Navigation utilities
export const navigateTo = (route: Route) => {
  if (typeof window !== 'undefined') {
    window.location.href = route
  }
}

// Program-specific routes
export const PROGRAM_ROUTES = {
  wellness: ROUTES.wellnessProgram,
  medical: ROUTES.medicalHealthProgram,
  lite: ROUTES.pemaLite,
} as const

// FAQ section routes
export const FAQ_ROUTES = {
  general: ROUTES.resources,
  approach: ROUTES.resources,
  medical: ROUTES.resources,
  wellness: ROUTES.resources,
  sanctuary: ROUTES.resources,
  visit: ROUTES.resources,
} as const

// External links
export const EXTERNAL_LINKS = {
  whatsapp: 'https://wa.me/916303199494',
  googleMaps:
    'https://www.google.com/maps/dir//Pema+Wellness+Resort,+Sagarnagar,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh+530045',
  healthQuiz: 'https://zfrmz.in/dQxCWy2g1RpNOAtDi6Wj',
  giftingForm:
    'https://forms.zohopublic.in/pemawellness5391/form/GiftaStayatPema/formperma/rMXPSe_BjSk9WoMsVgDahtjtDsMw8XwUUey4xxj9fXA',
  preArrivalGuide:
    'https://drive.google.com/file/d/1Zi1wbxbwhoqL8PPqzo_ouj1m6fFczsMP/view?usp=drive_link',
  bookConsultaion:
    'https://forms.zohopublic.in/pemawellness5391/form/Bookaconsultationwithourmedicalexperts/formperma/DsdULdUQ2X2c5Q23_FnifGc6FR-i9ZZSwQG8Ip-FXtY',
  groupBookingInquiryForm:
    'https://forms.zohopublic.in/pemawellness5391/form/HotelBookingRequestForm/formperma/0Hkv2ems33UEOySOAuxE_Rkh1jUCfMLYxGXSfqh0TOA',
  termsConditionDrive: 'https://drive.google.com/file/d/1VAoC46RZpeI71hTzHFM0-fDzwcmPBk2h/view',
} as const

// Route validation
export const isValidRoute = (path: string): path is Route => {
  return Object.values(ROUTES).includes(path as Route)
}

// Get route by key
export const getRoute = (key: keyof typeof ROUTES): Route => {
  return ROUTES[key]
}

// Check if current path matches route
export const isCurrentRoute = (route: Route): boolean => {
  if (typeof window === 'undefined') return false
  return window.location.pathname === route
}

// Get breadcrumb data for a route
export const getBreadcrumbs = (route: Route) => {
  const breadcrumbMap: Record<any, Array<{ label: string; href: Route }>> = {
    [ROUTES.home]: [{ label: 'Home', href: ROUTES.home }],
    [ROUTES.homepage]: [{ label: 'Home', href: ROUTES.home }],

    [ROUTES.aboutUs]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'About Us', href: ROUTES.aboutUs },
    ],
    [ROUTES.contactUs]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Contact Us', href: ROUTES.contactUs },
    ],
    [ROUTES.wellnessProgram]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Wellness Program', href: ROUTES.wellnessProgram },
    ],
    [ROUTES.medicalHealthProgram]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Medical Health Program', href: ROUTES.medicalHealthProgram },
    ],
    [ROUTES.pemaLite]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Pema Lite', href: ROUTES.pemaLite },
    ],
    [ROUTES.theSanctuary]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'The Sanctuary', href: ROUTES.theSanctuary },
    ],
    [ROUTES.planYourVisit]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Plan Your Visit', href: ROUTES.planYourVisit },
    ],
    [ROUTES.resources]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Resources', href: ROUTES.resources },
    ],
    [ROUTES.successStories]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Success Stories', href: ROUTES.successStories },
    ],
    [ROUTES.ourApproach]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Our Approach', href: ROUTES.ourApproach },
    ],
    [ROUTES.booking]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Booking', href: ROUTES.booking },
    ],
    [ROUTES.bookingConfirmation]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Booking', href: ROUTES.booking },
      { label: 'Confirmation', href: ROUTES.bookingConfirmation },
    ],
    [ROUTES.roomDetails]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Booking', href: ROUTES.booking },
      { label: 'Room Details', href: ROUTES.roomDetails },
    ],
    [ROUTES.reservation]: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Booking', href: ROUTES.booking },
      { label: 'Room Details', href: ROUTES.roomDetails },
      { label: 'Reservation', href: ROUTES.reservation },
    ],
    [ROUTES.medicalHealthAssessment]: [],
  }

  return breadcrumbMap[route] || [{ label: 'Home', href: ROUTES.home }]
}

export const wellnessSubProgramsRoutes = {
  pemaSignature: '/wellness-program/pema-signature-detox',
  test: '/wellness-program/wellness-test-program',
  gentleDetox: '/wellness-program/gentle-detox',
  strengthAndStaminaReboot: '/wellness-program/strength-and-stamina-reboot',
  calmAndClarity: '/wellness-program/calm-and-clarity',
  deepSleepSanctuary: '/wellness-program/deep-sleep-sanctuary',
  ageWell: '/wellness-program/age-well',
  hairVitalityBoost: '/wellness-program/hair-vitality-boost',
  facialSkinRenewal: '/wellness-program/facial-skin-renewal',
  resetRelax: '/wellness-program/reset-relax',
  breatheEasy: '/wellness-program/breathe-easy',
}

export const videoURLS = {
  anuragKashyap: 'https://youtu.be/lQiML-o4eVc',
  amitBansal: 'https://youtu.be/68g3b2pirPw',
  anitaJain: 'https://youtu.be/6eyI2zOFdV0',
  jagapatiBabu: 'https://youtu.be/aAGR_kf1RTk',
  naiomeHarris: 'https://youtu.be/Xn2Lbl_Rf-A',
  payalJain: 'https://youtu.be/ikEzUdAxaug',
  poonamDhillon: 'https://youtu.be/28tW2-zW2S0',
  prafulPatel: 'https://youtu.be/U4A3BWj4ddU',
  prakashRaj: 'https://youtu.be/rBRK1jJMX-k',
  rakulPreetSingh: 'https://youtu.be/b7weagfrSdU',
  colleenWashnuk: 'https://youtu.be/sLaIITdbO5M',
  roseminMadhaviManji: 'https://youtu.be/wz5oDbQWAOw',
  megastarChiranjeeviKonidela: 'https://youtu.be/PyN5fxDhZrY',
  seemaSanghai: 'https://youtu.be/tD8dzzDBBIk',
  qamarZafeer: 'https://youtu.be/MxxrHlGETZc',
  seshadriSekharRayAndRakhiRay: 'https://youtu.be/yD5SunPT5Oo',
  janananSriskanthan: 'https://youtu.be/BEEcOET-skQ',
}

export const medicalSubProgramsRoutes = {
  pemaSignature: '/medical-health-program/pema-signature-detox',
  wellnessTestProgram: '/medical-health-program/wellness-test-program',
  gentleDetox: '/medical-health-program/gentle-detox',
  strengthAndStaminaReboot: '/medical-health-program/strength-and-stamina-reboot',
  calmAndClarity: '/medical-health-program/calm-and-clarity',
  deepSleepSanctuary: '/medical-health-program/deep-sleep-sanctuary',
  breatheEasy: '/medical-health-program/breathe-easy',
  metabolicBalance: '/medical-health-program/metabolic-balance',
  liverVitalityCleanse: '/medical-health-program/liver-vitality-cleanse',
  sportsSurgicalRehabilitation: '/medical-health-program/sports-surgical-rehabilitation',
  nerveHealingHaven: '/medical-health-program/nerve-healing-haven',
  painFreeLiving: '/medical-health-program/pain-free-living',
  cardiacHealthReset: '/medical-health-program/cardiac-health-reset',
  diabetesCare: '/medical-health-program/diabetes-care',
  womensHealth: '/medical-health-program/womens-health',
  womensFertility: '/medical-health-program/womens-fertility',
  preInVitroFertilizationIvf: '/medical-health-program/pre-in-vitro-fertilization-ivf',
  mensFertility: '/medical-health-program/mens-fertility',
  gutBiomeReset: '/medical-health-program/gut-biome-reset',
} as const

export const zohoForms = {
  bookConsultaion: '/book-a-consultation',
  giftInquiry: '/gift-inquiry',
  familyInquiry: '/family-stay-inquiry',
  medicalHealthAssessment: '/medical-health-assessment',
}

/**
 * Formats a Date object to YYYY-MM-DD string in local timezone.
 * This prevents timezone issues where toISOString() converts to UTC
 * and can shift the date by one day.
 * @param date - The Date object to format
 * @returns A string in YYYY-MM-DD format in local timezone
 */
export const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
