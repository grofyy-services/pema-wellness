'use client'
import PrimaryButton from '@/components/PrimaryButton'
import { MoveRight, ChevronDown, X, Check, Info } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'

import 'react-multi-carousel/lib/styles.css'

import { addDays, differenceInCalendarDays } from 'date-fns'
import DatePickerModal from '@/components/DatePicker'
import RoomGuestPicker from '@/components/RoomGuestPicker'
import Breadcrumbs from '@/components/BreadCrumbs'
import { useRouter, useSearchParams } from 'next/navigation'

import { PemaInstance } from '@/api/api'
import { enqueueSnackbar } from 'notistack'
import { BookingEstimateType, Room, SingleRoom } from '@/utils/types'
import Dropdown from '@/components/DropDown'
import { isRoomSoldOut, roomData } from '../utils'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { useAtomValue } from 'jotai'
import SpinningLoader from '@/components/Loader'
import { roomInclusions } from './utils'
import { EXTERNAL_LINKS, formatDateToLocalString } from '@/utils/utils'
import { getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input'
import Input from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'
import CountryPicker from './reservation/CountryPicker'
import { CountryCode } from 'libphonenumber-js'
import ImageWithShimmer from '@/components/ImageWithShimmer'
import Carousel from 'react-multi-carousel'

// ✅ Validate and parse number safely
const parseNumber = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const currency = useAtomValue(selectedCurrencyAtom)
  const childrenKeyNotes = [
    {
      line1: 'Toddlers under 4:',
      line2: 'Stay and meals are complimentary.',
    },
    {
      line1: 'Children 5–12:',
      line2: `Stay is complimentary, with meals charged at ${convertINRUsingGlobalRates(7000, currency)} per day. We've arranged exciting activities for your children which are available at ${convertINRUsingGlobalRates(4000, currency)} per session.`,
    },
    {
      line1: 'Teens 13–17:',
      line2: 'Join our Adolescent Wellness path, charged as per adult programming.',
    },
    {
      line1: 'Each room accommodates up to 2 adults + 2 children (under 12)',
      line2: '',
    },
    {
      line1: 'For larger families, we recommend booking two rooms for comfort and space.',
      line2: '',
    },
    {
      line1:
        'A full-time caregiver is required for all guests under 18. This caregiver cannot be a parent or family member enrolled in a wellness program.',
      line2: '',
    },
    {
      line1:
        'Caregivers may either share the guest room or have a separate room. Charges vary by room type.',
      line2: '',
    },
    {
      line1:
        'Children are welcome in designated family spaces such as guest rooms, the library, gardens, lawns, pool area, and walking trails.',
      line2: '',
    },
  ]

  const parseDate = (value: string | null, fallback: Date) => {
    if (!value) return fallback
    const d = new Date(value)
    return isNaN(d.getTime()) ? fallback : d
  }
  const [caregiverStayType, setCaregiverStayType] = useState<'same' | 'separate'>('same')
  const [caregiverMealType, setCaregiverMealType] = useState<'simple' | 'restaurant'>('simple')
  const [caregiverSeparateRoomType, setCaregiverSeparateRoomType] = useState<
    'Standard' | 'Premium Balcony' | 'Premium Garden'
  >('Standard')

  const [startDate, setStartDate] = useState(parseDate(searchParams.get('startDate'), new Date()))
  const [endDate, setEndDate] = useState(
    parseDate(searchParams.get('endDate'), addDays(new Date(), 3))
  )
  const [rooms, setRooms] = useState(parseNumber(searchParams.get('rooms'), 1))
  const [careGiverAdded, setCareGiverAdded] = useState(
    Boolean(searchParams.get('caregiver')) || false
  )

  const [transportAdded, setTransportAdded] = useState(
    Boolean(searchParams.get('transport')) || false
  )
  const [bookingEstimate, setBookingEstimate] = useState<BookingEstimateType>()
  const [adults, setAdults] = useState(parseNumber(searchParams.get('adults'), 1))
  const [children, setChildren] = useState(0)
  const [loading, setLoading] = useState(true)

  const [isRoomPickerOpen, setIsRoomPickerOpen] = useState(false)
  const handleChange = (type: 'rooms' | 'adults' | 'children', value: number) => {
    if (type === 'rooms') setRooms(value)
    if (type === 'adults') {
      setAdults(value)
      if (value === 2) {
        setCaregiverStayType('separate')
        setCaregiverMealType('restaurant')
      }
    }
  }
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Booking page', href: `/booking?${searchParams}` },
    { label: 'Room details' }, // current page (no href)
  ]

  const calculateRoomPrice = (room: Room): number => {
    const nights = differenceInCalendarDays(endDate, startDate)
    const isSingleOccupancy = adults === 1

    if (nights <= 7) {
      return isSingleOccupancy
        ? room.price_per_night_single_upto_7_nights
        : room.price_per_night_double_upto_7_nights
    } else {
      return isSingleOccupancy ? room.price_per_night_single : room.price_per_night_double
    }
  }

  const fillDates = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsOpen(true)
  }
  const editRooms = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsRoomPickerOpen(true)
  }

  const clickContinue = () => {
    if (step === 0) {
      setStep(1)
      scrollUp()
      // window.scrollTo(0, 0)
      getEstimate()
      const params = new URLSearchParams(searchParams.toString())
      params.set('step', '2') // ✅ add or update param

      return
    } else {
      getEstimate()
      const params = new URLSearchParams(searchParams.toString())
      params.set('caregiver_required', String(careGiverAdded))
      params.set('caregiver_stay_with_guest', caregiverStayType === 'same' ? 'true' : 'false')
      params.set('caregiver_room_pricing_category', String(caregiverSeparateRoomType))

      params.set(
        'caregiver_meal',
        caregiverMealType === 'restaurant' ? 'restaurant_dining' : 'simple'
      )
      router.push(`/booking/room-details/reservation?${params.toString()}`)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    // Format dates in local timezone to avoid timezone shift issues
    params.set('startDate', startDate.toISOString()) // Keep ISO for URL params to maintain compatibility
    if (params.get('adults') === '2') {
      setCaregiverStayType('separate')
      setCaregiverMealType('restaurant')
    }
    params.set('endDate', endDate.toISOString()) // Keep ISO for URL params to maintain compatibility

    router.push(`/booking/room-details/?${params.toString()}`)
  }, [endDate, searchParams, router, startDate])

  useEffect(() => {
    if (!careGiverAdded) {
      getEstimate()
    }
  }, [careGiverAdded])

  // Keep childrenAges array in sync with children count
  useEffect(() => {
    setChildrenAges((prevAges) => {
      if (prevAges.length !== children) {
        if (prevAges.length < children) {
          // Add empty strings for new children
          return [...prevAges, ...Array(children - prevAges.length).fill('')]
        } else {
          // Remove excess entries
          return prevAges.slice(0, children)
        }
      }
      return prevAges
    })
  }, [children])
  const addCareGiverBox = () => {
    const isSameRoom = caregiverStayType === 'same'
    return (
      <div className='text-base md:text-xl transition-all duration-300 text-slateGray mt-6 p-4 border border-[#32333366]'>
        <div className='flex flex-row gap-2 items-start '>
          <input
            checked={careGiverAdded}
            onChange={() => {
              setCareGiverAdded(!careGiverAdded)
            }}
            // readOnly={}
            type='checkbox'
            className='accent-pemaBlue w-6 h-6 cursor-pointer'
          />{' '}
          Add travelling with a caregiver? <br className='md:hidden inline' /> We’ve got you
          covered.{' '}
        </div>
        {careGiverAdded && (
          <div className='mt-6'>
            <div>Caregiver stay options</div>
            <div className='grid grid-cols-2 gap-4 mt-2'>
              {/* Hide "Stay with guest in same room" option if adults === 2 */}
              {adults !== 2 && (
                <div>
                  <div
                    onClick={() => {
                      setCaregiverStayType('same')
                      setCaregiverMealType('simple')
                    }}
                    className={`flex flex-row items-center justify-between p-[6px]  rounded-lg cursor-pointer border ${
                      isSameRoom
                        ? 'border-pemaBlue bg-pemaBlue/10 text-pemaBlue'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    Stay with guest in same room
                  </div>
                </div>
              )}
              <div>
                <div
                  onClick={() => {
                    setCaregiverStayType('separate')
                    setCaregiverMealType('restaurant')
                  }}
                  className={`flex flex-row items-center justify-between p-[6px]  rounded-lg cursor-pointer border  ${
                    !isSameRoom
                      ? 'border-pemaBlue bg-pemaBlue/10 text-pemaBlue'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  Stay in a separate room
                </div>
              </div>
            </div>
            {/* Prevent selecting 'same room' option if adults === 2 */}
            {isSameRoom && adults !== 2 ? (
              <div className='mt-3 '>
                <div>Per day costing</div>
                <div
                  className={`flex w-1/2 flex-row justify-between items-center text-pemaBlue gap-2`}
                >
                  <div className={`flex flex-row items-center text-pemaBlue gap-2`}>
                    <input
                      checked
                      readOnly
                      className='cursor-pointer w-5 h-5 accent-pemaBlue'
                      type='radio'
                    />
                    Shared Room
                  </div>
                  <div>{convertINRUsingGlobalRates(8000, currency)}</div>
                </div>
                <div className='text-sm text-gray-500'>
                  This charge is waived for all suite bookings.
                </div>
                <div className='mt-6 mb-1'>Caregiver meal options</div>
                <div className='grid md:grid-cols-2 gap-4 mt-2'>
                  <div className={`flex flex-row justify-between items-center text-pemaBlue gap-2`}>
                    <div className={`flex flex-row  text-pemaBlue gap-2`}>
                      <input
                        name='caregiverMeal'
                        value='simple'
                        checked={caregiverMealType === 'simple'}
                        onChange={() => setCaregiverMealType('simple')}
                        className='cursor-pointer w-5 h-5 accent-pemaBlue mt-1'
                        type='radio'
                      />
                      <div className='text-slateGray'>
                        Simple meal <br />
                        <span className='text-pemaBlue'>
                          +{convertINRUsingGlobalRates(0, currency)} (included)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex  flex-row justify-between items-center text-pemaBlue gap-2`}
                  >
                    <div className={`flex flex-row  text-pemaBlue gap-2`}>
                      <input
                        name='caregiverMeal'
                        value='restaurant'
                        checked={caregiverMealType === 'restaurant'}
                        onChange={() => setCaregiverMealType('restaurant')}
                        className='cursor-pointer w-5 h-5 accent-pemaBlue mt-1'
                        type='radio'
                      />
                      <div className='text-slateGray'>
                        Restaurant dining <br />
                        <span className='text-pemaBlue'>
                          +{convertINRUsingGlobalRates(8000, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : !isSameRoom || adults === 2 ? (
              <div className='mt-3 '>
                <div>Per day costing</div>
                <div className='flex flex-col gap-2 mt-2'>
                  <div
                    className={`flex w-1/2 flex-row justify-between items-center text-pemaBlue gap-2`}
                  >
                    <div className={`flex flex-row items-center text-pemaBlue gap-2`}>
                      <input
                        name='caregiverSeparateRoom'
                        value='standard'
                        checked={caregiverSeparateRoomType === 'Standard'}
                        onChange={() => setCaregiverSeparateRoomType('Standard')}
                        className='cursor-pointer w-5 h-5 accent-pemaBlue'
                        type='radio'
                      />
                      Standard
                    </div>
                    <div>{convertINRUsingGlobalRates(20000, currency)}</div>
                  </div>
                  <div
                    className={`flex w-1/2 flex-row justify-between items-center text-pemaBlue gap-2`}
                  >
                    <div className={`flex flex-row items-center text-pemaBlue gap-2`}>
                      <input
                        name='caregiverSeparateRoom'
                        value='Premium Balcony'
                        checked={caregiverSeparateRoomType === 'Premium Balcony'}
                        onChange={() => setCaregiverSeparateRoomType('Premium Balcony')}
                        className='cursor-pointer w-5 h-5 accent-pemaBlue'
                        type='radio'
                      />
                      Premium Balcony
                    </div>
                    <div>{convertINRUsingGlobalRates(25000, currency)}</div>
                  </div>
                  <div
                    className={`flex w-1/2 flex-row justify-between items-center text-pemaBlue gap-2`}
                  >
                    <div className={`flex flex-row items-center text-pemaBlue gap-2`}>
                      <input
                        name='caregiverSeparateRoom'
                        value='Premium Garden'
                        checked={caregiverSeparateRoomType === 'Premium Garden'}
                        onChange={() => setCaregiverSeparateRoomType('Premium Garden')}
                        className='cursor-pointer w-5 h-5 accent-pemaBlue'
                        type='radio'
                      />
                      Premium Garden{' '}
                    </div>
                    <div>{convertINRUsingGlobalRates(28000, currency)}</div>
                  </div>
                </div>
                <div className='mt-6 mb-1'>Caregiver meal options</div>
                <div className='grid md:grid-cols-2 gap-4 mt-2'>
                  {/* <div
                    className={`flex flex-row justify-between items-baseline  text-pemaBlue gap-2`}
                  >
                    <div className={`flex flex-row  text-pemaBlue gap-2 mt-1`}>
                      <input
                        name='caregiverMeal'
                        value='simple'
                        checked={caregiverMealType === 'simple'}
                        onChange={() => setCaregiverMealType('simple')}
                        className='cursor-pointer w-5 h-5 accent-pemaBlue mt-1'
                        type='radio'
                      />
                      <div className='text-slateGray'>
                        Simple meal <br />
                      </div>
                    </div>{' '}
                  </div> */}
                  <div
                    className={`flex  flex-row justify-between items-center text-pemaBlue gap-2`}
                  >
                    <div className={`flex flex-row  text-pemaBlue gap-2`}>
                      <input
                        name='caregiverMeal'
                        value='restaurant'
                        checked={caregiverMealType === 'restaurant'}
                        onChange={() => setCaregiverMealType('restaurant')}
                        className='cursor-pointer w-5 h-5 accent-pemaBlue mt-1'
                        type='radio'
                      />
                      <div className='text-slateGray'>
                        Restaurant dining <br />
                        <span className='text-pemaBlue'>*included</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* If adults === 2 and user previously had "same room" selected, force to "separate" option */}
                {isSameRoom && adults === 2 && (
                  <div className='text-red-500 text-sm mt-2'>
                    The guest room is already full. The caregiver will need a separate room.
                  </div>
                )}
              </div>
            ) : null}
            <PrimaryButton
              onClick={() => {
                getEstimate()
                setStep(1)
                scrollToEstimate()
              }}
              className='mt-6 w-full'
            >
              Done
            </PrimaryButton>
          </div>
        )}
      </div>
    )
  }

  const addPrivateTransferBox = () => {
    return (
      <div className='text-base md:text-xl transition-all duration-300 text-slateGray mt-6 p-4 border border-[#32333366]'>
        <div className='flex flex-row gap-2 items-start '>
          <input
            checked={transportAdded}
            onChange={() => {
              setTransportAdded(!transportAdded)
            }}
            type='checkbox'
            className='accent-pemaBlue w-6 h-6 cursor-pointer'
          />{' '}
          Add private transfer to my booking
        </div>
        {transportAdded && (
          <div className='mt-6 w-full'>
            <div className='flex flex-col md:flex-row gap-3 items-start'>
              <ImageWithShimmer
                width={140}
                height={140}
                className='md:block hidden'
                src={'/images/innova-transport.png'}
                alt='innova-transport'
              />
              <ImageWithShimmer
                width={140}
                height={140}
                className='md:hidden w-full'
                src={'/images/innova-transport-mobile.png'}
                alt='innova-transport'
              />
              <div className='w-full'>
                <div className='flex items-center flex-row justify-between w-full'>
                  <div className='text-base md:text-xl '>Airport pickup</div>
                  <div className='text-base md:text-xl '>
                    {convertINRUsingGlobalRates(6300, currency)}
                  </div>
                </div>

                <div className='flex items-center flex-row justify-between w-full'>
                  <div className='text-base md:text-xl w-[70%]'>
                    Round trip Airport transfer in an Innova Hycross.
                  </div>
                </div>

                <div className='flex items-center flex-row justify-between w-full  mt-5'>
                  <div className='text-base md:text-xl '>Add quantity</div>
                  <div className='text-base flex h-11 items-center flex-row justify-around md:text-xl w-[100px] border border-slateGray'>
                    <div className='cursor-pointer'>-</div>
                    <div>1</div>
                    <div className='cursor-pointer'>+</div>
                  </div>
                </div>
              </div>
            </div>
            <PrimaryButton className='mt-6 w-full'>Done</PrimaryButton>
          </div>
        )}
      </div>
    )
  }

  const getEstimate = async () => {
    setLoading(true)
    setOpenChildrenInfoSection(false)
    if (!roomDetails?.category) return
    try {
      const data = {
        room_pricing_category: roomDetails?.category,
        check_in_date: formatDateToLocalString(startDate),
        check_out_date: formatDateToLocalString(endDate),
        occupancy: {
          adults: adults,
          children: 0,
          teens_13_18: 0,
          children_ages: [],
          caregiver_required: careGiverAdded,
        },
        caregiver_required: careGiverAdded,
        caregiver_stay_with_guest: caregiverStayType === 'same' ? true : false,
        caregiver_meal: caregiverMealType === 'restaurant' ? 'restaurant_dining' : 'simple',
        caregiver_room_pricing_category: caregiverSeparateRoomType,
        number_of_rooms: rooms,
        adults_total: adults,
        children_total_under_4: 0,
        children_total_5to12: 0,
        teens_13to18: 0,
      }
      const res = await PemaInstance.post('/bookings/estimate', data)

      if (res.data) setBookingEstimate(res.data)
    } catch (error: unknown) {
      console.error(error)
      enqueueSnackbar('Something went wrong! Please try again!', {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const [roomDetails, setRoomDetails] = useState<Room>()

  const getRoomDetails = async () => {
    try {
      const roomID = searchParams.get('roomID')
      const res: {
        data: Room[]
      } = await PemaInstance.get('room-types')
      if (res.data) setRoomDetails(res.data.filter((item) => item.code === roomID)[0])
    } catch (error: unknown) {
      console.error(error)
      enqueueSnackbar('Something went wrong! Please try again!', {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = () => {
    setLoading(true)
    const params = new URLSearchParams(searchParams.toString())

    params.set('adults', String(adults))

    router.push(`/booking/room-details?${params.toString()}`)
    setTimeout(() => {
      setLoading(false)
      if (step === 1) {
        getEstimate()
      }
    }, 200)
  }

  useEffect(() => {
    getRoomDetails()
  }, [])

  const [userName, setuserName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState<string>('India')
  const [countryCode, setCountryCode] = useState<CountryCode>('IN')
  const [openChildrenInfoSection, setOpenChildrenInfoSection] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [childrenAges, setChildrenAges] = useState<string[]>(Array(children).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAgeChange = (index: number, value: string) => {
    const updated = [...childrenAges]
    updated[index] = value
    setChildrenAges(updated)
  }

  const validateChildInquiry = () => {
    const newErrors: Record<string, string> = {}

    if (!userName.trim()) {
      newErrors.userName = 'Name is required'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Enter a valid email'
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!isValidPhoneNumber(phone)) {
      newErrors.phone = 'Enter a valid phone number'
    }
    if (!country) {
      newErrors.country = 'Country is required'
    }

    // Validate that at least 1 child is required
    if (children === 0) {
      newErrors.children = 'At least 1 child is required'
    }

    // Validate children ages
    if (children > 0) {
      const validAgeOptions = ['0-4', '5-12', '13-17']
      // Normalize the array to ensure it matches children count
      const normalizedAges = childrenAges || []
      const agesToCheck =
        normalizedAges.length < children
          ? [...normalizedAges, ...Array(children - normalizedAges.length).fill('')]
          : normalizedAges.slice(0, children)

      // Check each child's age
      const missingAgeIndices: number[] = []
      const invalidAgeIndices: number[] = []

      for (let i = 0; i < children; i++) {
        const age = typeof agesToCheck[i] === 'string' ? agesToCheck[i].trim() : agesToCheck[i]
        if (!age) {
          missingAgeIndices.push(i + 1)
        } else if (!validAgeOptions.includes(age)) {
          invalidAgeIndices.push(i + 1)
        }
      }

      if (missingAgeIndices.length > 0) {
        newErrors.childrenAges =
          missingAgeIndices.length === children
            ? 'Please select age for all children'
            : `Please select age for child ${missingAgeIndices.join(', ')}`
      } else if (invalidAgeIndices.length > 0) {
        newErrors.childrenAges = `Invalid age selected for child ${invalidAgeIndices.join(', ')}`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateInquiryEmail = (data: {
    guardian_info: {
      name: string
      email: string
      phone: string
      country: string
    }
    booking_details: {
      check_in_date: string
      check_out_date: string
      room_id: string | null
      room_category: string | undefined
    }
    children_info: {
      count: number
      ages: string[]
    }
    adults: number
    rooms: number
  }) => {
    const emailBody = `
Dear Guest,

Thank you for sharing your details with us. We have received your submission and our team will reach out shortly with the next steps.

We are always happy to welcome families at Pema. Children of all ages are invited to be part of the journey here, from toddlers who arrive with their caregivers to young guests discovering new activities and gentle rhythms. Our team will guide you through the options that help your child feel comfortable, engaged, and at ease.

For your reference, here is a summary of what you shared:

Guardian Details

 Name: ${data.guardian_info.name}

 Email: ${data.guardian_info.email}

 Phone: ${data.guardian_info.phone}

Children

 Number of children: ${data.children_info.count}

If you would like to update anything or share specific preferences for your child, simply reply to this email.

Warm regards,
Pema Wellness
Healing Hills, Visakhapatnam
+91 95777 09494
enquiry@pemawellness.com
    `.trim()

    return {
      subject: 'Thank you for your submission',
      body: emailBody,
    }
  }

  const submitChildInquiry = async () => {
    if (!validateChildInquiry()) {
      return
    }

    setIsSubmitting(true)
    try {
      setLoading(true)
      const roomID = searchParams.get('roomID')
      const data = {
        guardian_info: {
          name: userName,
          email: email,
          phone: phone,
          country: country,
        },
        booking_details: {
          check_in_date: startDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          check_out_date: endDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          room_id: roomID,
          room_category: roomDetails?.category,
        },
        children_info: {
          count: children,
          ages: childrenAges.filter((age) => age), // Filter out empty ages
        },
        adults: adults,
        rooms: rooms,
      }
      // Generate email template

      const emailTemplate = generateInquiryEmail(data)
      const httpBody = {
        to_email: email,
        subject: emailTemplate.subject,
        body_text: emailTemplate.body,
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        to_email: httpBody.to_email,
        subject: httpBody.subject,
        body_text: httpBody.body_text,
      })

      const res = await PemaInstance.post(`/bookings/email/send?${queryParams.toString()}`)

      if (res.data) {
        enqueueSnackbar(
          'Child inquiry submitted successfully! Our team will get back to you soon.',
          {
            variant: 'success',
          }
        )
        // Reset form
        setuserName('')
        setEmail('')
        setPhone('')
        setCountry('India')
        setCountryCode('IN')
        setChildren(0)
        setChildrenAges([])
        window.scrollTo(0, 0)
        setOpenChildrenInfoSection(false)
      }
    } catch (error: unknown) {
      console.error('Child inquiry submission error:', error)
      enqueueSnackbar('Something went wrong! Please try again.', {
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }
  const travellingWithChildren = () => {
    return (
      <div className='text-base md:text-xl transition-all duration-300 text-slateGray mt-6 border pt-4 border-[#32333366]'>
        <div
          onClick={() => setOpenChildrenInfoSection(!openChildrenInfoSection)}
          className='cursor-pointer flex flex-row gap-2 items-start justify-between border-b pb-4 px-4 border-[#32333366] '
        >
          Travelling with children
          <ChevronDown
            className={`h-5 w-5 transition-transform ${openChildrenInfoSection ? 'rotate-180' : ''}`}
          />
        </div>
        {openChildrenInfoSection && (
          <div className='p-4'>
            <div>
              We are proud to welcome children from 0 to 17 years at Pema Wellness. Families are
              part of the retreat’s rhythm, and we are happy to guide you in creating a stay that
              feels seamless.
            </div>
            <div className='text-center my-3'>Key Notes</div>
            <div>
              {childrenKeyNotes.map((item) => {
                return (
                  <div
                    key={item.line1}
                    className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'
                  >
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    {item.line1} <br /> {item.line2}
                  </div>
                )
              })}
            </div>
            <div className='my-3'>
              To receive the right rates for your children’s accommodation, please provide the
              details below. Our team will review your request and get back to you via email.
            </div>

            <div>
              <div className='flex justify-between items-center border-b border-[#3233334D] py-4'>
                <div>
                  <div className='text-xl'>Children </div>
                  <div className='text-base text-slateGray'>(Max: 2 Total guest/room)</div>
                </div>
                <div className='flex items-center justify-around border border-pemaBlue w-[92px]'>
                  <button
                    disabled={children === 0}
                    className='cursor-pointer py-1 text-lg'
                    onClick={() => {
                      setChildren((prev) => {
                        const newCount = prev - 1
                        // Update childrenAges array when count decreases
                        setChildrenAges((prevAges) => prevAges.slice(0, newCount))
                        return newCount
                      })
                      // Clear error when children count changes
                      if (errors.children) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors.children
                          return newErrors
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <span>{children}</span>
                  <button
                    className='cursor-pointer py-1 text-lg'
                    onClick={() => {
                      setChildren((prev) => {
                        const newCount = prev + 1
                        // Update childrenAges array when count increases
                        setChildrenAges((prevAges) => [...prevAges, ''])
                        return newCount
                      })
                      // Clear error when children count changes
                      if (errors.children) {
                        setErrors((prev) => {
                          const newErrors = { ...prev }
                          delete newErrors.children
                          return newErrors
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              {errors.children && (
                <p className='text-red-500 text-sm mb-2 mt-2'>{errors.children}</p>
              )}

              <div>
                {children > 0 && (
                  <div>
                    {Array.from({ length: children }).map((_, index) => (
                      <div key={index}>
                        <div className='flex w-full justify-between items-center border-b border-[#3233334D] py-4'>
                          <div>
                            <div className='text-lg text-slateGray'>Guest - {index + 1}</div>
                          </div>

                          <div className='flex flex-row items-center gap-2 min-w-[140px]'>
                            <div className='text-lg whitespace-nowrap text-slateGray'>Age - </div>
                            <Dropdown
                              isSmall
                              light
                              className={`max-w-[96px] text-pemaBlue border-pemaBlue max-h-[50px] ${
                                errors.childrenAges && !childrenAges[index] ? 'border-red-500' : ''
                              }`}
                              placeholder='age'
                              selectedValue={childrenAges[index]}
                              onSelect={(val) => {
                                if (val) {
                                  handleAgeChange(index, val?.toString())
                                  // Clear error when age is selected - validation will re-check on submit
                                  if (errors.childrenAges) {
                                    setErrors((prev) => {
                                      const newErrors = { ...prev }
                                      delete newErrors.childrenAges
                                      return newErrors
                                    })
                                  }
                                }
                              }}
                              options={['0-4', '5-12', '13-17']}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {errors.childrenAges && (
                      <p className='text-red-500 text-sm mb-2 mt-2'>{errors.childrenAges}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <>
              <div>
                <div className='my-3'>Kindly provide the guardian’s details.</div>
                <div className='border border-[#32333366] h-[62px] mb-3'>
                  <input
                    placeholder='Name*'
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    className='text-xl placeholder-[#32333380] h-[60px] w-full px-4 focus:outline-pemaBlue'
                  />
                </div>
                {errors.userName && <p className='text-red-500 text-sm mb-2'>{errors.userName}</p>}

                <div className='border border-[#32333366] h-[62px] mb-3'>
                  <input
                    placeholder='Email*'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='text-xl placeholder-[#32333380] h-[60px] w-full px-4 focus:outline-pemaBlue'
                  />
                </div>
                {errors.email && <p className='text-red-500 text-sm mb-2'>{errors.email}</p>}

                <div className='mb-2'>
                  <CountryPicker
                    onChange={(option) => {
                      setCountry(option.label)
                      setCountryCode(option.value as CountryCode)
                    }}
                    value={country}
                  />
                </div>
                {errors.country && <p className='text-red-500 text-sm mb-2'>{errors.country}</p>}

                <div className='border relative border-[#32333366] h-[62px] mb-3 flex flex-row items-center'>
                  <div className='left-2 absolute z-10'>+{getCountryCallingCode(countryCode)}</div>
                  <div className='w-full'>
                    <Input
                      placeholder='Phone number*'
                      value={phone}
                      onChange={(nextValue) => {
                        setPhone(nextValue || '')
                      }}
                      country={countryCode}
                      className='react-phone-input w-full'
                      inputClass='text-xl placeholder-[#32333380] h-[60px] w-full px-4 bg-transparent focus:outline-pemaBlue'
                      style={{ border: 'none', boxShadow: 'none', height: 60, paddingLeft: 44 }}
                      international
                    />
                  </div>
                </div>
                {errors.phone && <p className='text-red-500 text-sm mb-2'>{errors.phone}</p>}
              </div>
              <PrimaryButton
                disabled={isSubmitting}
                onClick={submitChildInquiry}
                className='w-full'
              >
                {isSubmitting ? 'Submitting...' : 'Submit inquiry'}
              </PrimaryButton>
            </>
          </div>
        )}
      </div>
    )
  }

  const scrollToEstimate = () => {
    const el = document.getElementById('estimate')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollUp = () => {
    const el = document.getElementById('room-details')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const selectedRoomInclusioin = roomDetails?.category
    ? roomInclusions[roomDetails?.category]
    : null
  const totalNights = differenceInCalendarDays(endDate, startDate)
  const inclusions = selectedRoomInclusioin
    ? totalNights >= 8
      ? selectedRoomInclusioin.eightPlusInclusions
      : selectedRoomInclusioin.threeto7Inclusions
    : []
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='flex-1 relative bg-white  min-h-dvh'>
        {/* hero section */}
        <div className=' w-full h-full bg-no-repeat text-pemaBlue '>
          <div className='max-w-[1360px] m-auto py-6 px-4'>
            {/* availability check section */}
            <Breadcrumbs items={crumbs} separator={' / '} />

            <div className='flex-col md:flex-row flex items-center md:items-end justify-between gap-4 lg:gap-8 my-6'>
              <div className=' max-w-[550px] w-full'>
                <div className='text-2xl text-pemaBlue '>Dates</div>
                <div
                  onClick={() => setIsOpen(true)}
                  className='border text-pemaBlue font-crimson text-lg lg:text-xl border-pemaBlue h-[58px] w-full mt-2 flex flex-row justify-between items-center py-[20px] px-8'
                >
                  <div>
                    {' '}
                    {startDate
                      ? startDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Check in'}
                  </div>
                  <MoveRight />
                  <div>
                    {' '}
                    {endDate
                      ? endDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Check out'}
                  </div>
                </div>
              </div>
              <div className=' max-w-[550px] w-full'>
                <div className='text-2xl text-pemaBlue'>Rooms & guests</div>
                <div
                  onClick={() => setIsRoomPickerOpen(true)}
                  className='border text-pemaBlue font-crimson text-lg lg:text-xl border-pemaBlue h-[58px] w-full mt-2 flex flex-row justify-between items-center py-[20px] px-8'
                >
                  <div>
                    {rooms} {rooms === 1 ? 'Room' : 'Rooms'} & {adults}{' '}
                    {adults === 1 ? 'Adult' : 'Adults'}{' '}
                  </div>
                  <ChevronDown />
                </div>
              </div>

              <PrimaryButton
                onClick={checkAvailability}
                className='w-full max-w-[550px] md:w-[200px] whitespace-nowrap'
              >
                Check availability
              </PrimaryButton>
            </div>
            <div className='text-lg md:text-xl text-slateGray mb-6'>
              Online bookings are limited to one room per person. For group or multi-room enquiries,
              <a
                href={EXTERNAL_LINKS.groupBookingInquiryForm}
                target='_blank'
                className='cursor-pointer text-pemaBlue'
              >
                {' '}
                click here.
              </a>{' '}
            </div>
            {/* room details sections */}
            <div className='grid relative md:grid-cols-[55%_45%] md:grid-rows-1 md:gap-5'>
              {roomDetails && (
                <div className='md:sticky md:top-24 h-fit'>
                  <div className='text-slateGray font-ivyOra block text-xl md:hidden mt-5 mb-2'>
                    {roomData[roomDetails?.category].category}
                  </div>
                  <ImageWithShimmer
                    src={roomData[roomDetails?.category].mobileImages[0]}
                    alt='rooom iamge'
                    className='max-h-[500px] w-full object-cover cursor-zoom-in'
                    width={750}
                    height={500}
                    onClick={() =>
                      setFullscreenImage(roomData[roomDetails?.category].mobileImages[0])
                    }
                  />
                  {roomData[roomDetails?.category].mobileImages.length >= 3 && (
                    <div className=' hidden md:grid grid-cols-2 gap-4 mt-4 w-full overflow-hidden'>
                      <ImageWithShimmer
                        src={roomData[roomDetails?.category].mobileImages[1]}
                        alt='rooom iamge'
                        className='max-h-[430px] h-full w-full object-cover cursor-zoom-in'
                        width={750}
                        height={500}
                        onClick={() =>
                          setFullscreenImage(roomData[roomDetails?.category].mobileImages[1])
                        }
                      />
                      <ImageWithShimmer
                        src={roomData[roomDetails?.category].mobileImages[2]}
                        alt='rooom iamge'
                        className='max-h-[430px]  h-full w-full object-cover cursor-zoom-in'
                        width={750}
                        height={500}
                        onClick={() =>
                          setFullscreenImage(roomData[roomDetails?.category].mobileImages[2])
                        }
                      />
                    </div>
                  )}
                  {roomData[roomDetails?.category].mobileImages.length >= 5 && (
                    <div className=' hidden md:flex flex-row gap-4 mt-4 w-full overflow-hidden'>
                      <ImageWithShimmer
                        src={roomData[roomDetails?.category].mobileImages[3]}
                        alt='rooom iamge'
                        className='max-h-[430px]  h-full w-full object-cover cursor-zoom-in'
                        width={750}
                        height={500}
                        onClick={() =>
                          setFullscreenImage(roomData[roomDetails?.category].mobileImages[3])
                        }
                      />
                      <ImageWithShimmer
                        src={roomData[roomDetails?.category].mobileImages[4]}
                        alt='rooom iamge'
                        className='max-h-[430px]  h-full w-full object-cover cursor-zoom-in'
                        width={750}
                        height={500}
                        onClick={() =>
                          setFullscreenImage(roomData[roomDetails?.category].mobileImages[4])
                        }
                      />
                    </div>
                  )}
                  <div className='flex md:hidden  my-2'>
                    <Carousel
                      ssr={true}
                      arrows={true}
                      showDots={false}
                      keyBoardControl={true}
                      containerClass='carousel-container w-[calc(100vw-32px)] md:w-auto gap-2'
                      itemClass='carousel-item pr-2'
                      responsive={{
                        mobile: {
                          breakpoint: { max: 464, min: 0 },
                          items: 4,

                          slidesToSlide: 1, // optional, default to 1.
                        },
                      }}
                    >
                      {roomData[roomDetails?.category].mobileImages.slice(1).map((img) => {
                        return (
                          <div
                            key={img}
                            className='h-[96px] w-full cursor-zoom-in'
                            onClick={() => setFullscreenImage(img)}
                          >
                            <ImageWithShimmer key={img} src={img} alt='room image' fill />
                          </div>
                        )
                      })}
                    </Carousel>
                  </div>
                </div>
              )}
              {roomDetails && (
                <div id='room-details' className='md:py-4 md:sticky md:top-24 md:h-fit'>
                  <div className='text-pemaBlue hidden md:block font-ivyOra text-base md:text-[32px] mb-2 '>
                    {roomData[roomDetails?.category].category}
                  </div>

                  <div className='text-pemaBlue font-crimson text-base md:text-[20px] mt-2'>
                    {roomData[roomDetails?.category].area} {' | '}
                    {roomData[roomDetails?.category].view}
                  </div>

                  <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                    {roomData[roomDetails?.category].description}{' '}
                  </div>

                  <div className='mt-6'>
                    {step === 0 && (
                      <div>
                        <div className='text-pemaBlue font-ivyOra text-base md:text-[20px]'>
                          starts from{' '}
                        </div>
                        <div className='text-slateGray font-ivyOra text-2xl md:text-[32px]'>
                          {convertINRUsingGlobalRates(calculateRoomPrice(roomDetails), currency)}
                          /night{' '}
                        </div>
                        {(!startDate || !endDate) && (
                          <div className='flex flex-row justify-between mt-6'>
                            <div className='text-slateGray font-crimson text-base md:text-[20px]'>
                              please enter your dates to know about the final cost{' '}
                            </div>
                            <div
                              onClick={fillDates}
                              className='cursor-pointer whitespace-nowrap h-fit text-pemaBlue border-b border-pemaBlue font-crimson text-base md:text-[20px]'
                            >
                              Fill in dates{' '}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {addCareGiverBox()}
                    {/* {addPrivateTransferBox()} */}
                    {travellingWithChildren()}
                    {step === 0 && (
                      <div>
                        <div id='estimate' className='text-pemaBlue font-ivyOra text-[20px] mt-9'>
                          Inclusions{' '}
                        </div>
                        <div>
                          {inclusions.map((item) => {
                            return (
                              <div
                                key={item.label}
                                className={`${item.available ? 'text-pemaBlue' : 'text-slateGray'} text-base md:text-xl flex flex-row items-center gap-2 py-[6px]`}
                              >
                                {item.available ? <Check /> : <X />}
                                {item.label}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {step === 1 && (
                    <div id='estimate' className='mt-9 scroll-m-20 md:scroll-mt-40'>
                      <div className='text-pemaBlue font-ivyOra text-base md:text-[20px]'>
                        Your trip{' '}
                      </div>
                      <div className='flex flex-row justify-between items-center my-3'>
                        <div className='text-slateGray  text-base md:text-[20px]'>Dates </div>
                        <div className='flex flex-row justify-between items-center gap-4'>
                          <div className='text-slateGray  text-base md:text-[20px] '>
                            {startDate.toLocaleDateString('en-US', {
                              // weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            -{' '}
                            {endDate.toLocaleDateString('en-US', {
                              // weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div
                            onClick={fillDates}
                            className='text-pemaBlue text-base md:text-[20px] border-b border-pemaBlue w-fit'
                          >
                            Edit{' '}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-row justify-between items-center my-3'>
                        <div className='text-slateGray  text-base md:text-[20px]'>Guests </div>
                        <div className='flex flex-row justify-between items-center gap-4'>
                          <div className='text-slateGray  text-base md:text-[20px] '>
                            {adults} {adults === 1 ? 'Adult' : 'Adults'}{' '}
                          </div>
                          <div
                            onClick={editRooms}
                            className='text-pemaBlue text-base md:text-[20px] border-b border-pemaBlue w-fit'
                          >
                            Edit{' '}
                          </div>
                        </div>
                      </div>

                      <div className='text-pemaBlue font-ivyOra text-base md:text-[20px] mt-9 '>
                        Pricing details{' '}
                      </div>

                      <div className='flex flex-row justify-between items-center my-3'>
                        <div className='text-slateGray  text-base md:text-[20px]'>
                          {differenceInCalendarDays(endDate, startDate)} nights x{' '}
                          {bookingEstimate?.per_night_charges &&
                            convertINRUsingGlobalRates(
                              bookingEstimate?.per_night_charges,
                              currency
                            )}
                        </div>
                        <div className='text-slateGray  text-base md:text-[20px] '>
                          {bookingEstimate?.structured_breakdown?.room_total?.amount &&
                            convertINRUsingGlobalRates(
                              bookingEstimate.structured_breakdown.room_total.amount,
                              currency
                            )}
                        </div>
                      </div>
                      {bookingEstimate?.structured_breakdown?.caregiver_room_total && (
                        <div className='flex flex-row justify-between items-center my-3 '>
                          <div className='text-slateGray  text-base md:text-[20px]'>
                            Caregiver stay{' '}
                          </div>
                          <div className='text-slateGray  text-base md:text-[20px] '>
                            {bookingEstimate?.structured_breakdown?.caregiver_room_total &&
                              convertINRUsingGlobalRates(
                                bookingEstimate?.structured_breakdown.caregiver_room_total.amount,
                                currency
                              )}
                          </div>
                        </div>
                      )}
                      {bookingEstimate?.structured_breakdown?.caregiver_meal &&
                        bookingEstimate?.structured_breakdown.caregiver_meal.amount > 0 && (
                          <div className='flex flex-row justify-between items-center my-3 '>
                            <div className='text-slateGray  text-base md:text-[20px]'>
                              Caregiver meal{' '}
                            </div>
                            <div className='text-slateGray  text-base md:text-[20px] '>
                              {bookingEstimate?.structured_breakdown?.caregiver_meal &&
                                convertINRUsingGlobalRates(
                                  bookingEstimate?.structured_breakdown.caregiver_meal.amount,
                                  currency
                                )}
                            </div>
                          </div>
                        )}
                      <div className='flex flex-row justify-between items-center my-3 pb-6 border-b-2 border-[#32333366]'>
                        <div className='text-slateGray  text-base md:text-[20px]'>Taxes </div>
                        <div className='text-slateGray  text-base md:text-[20px] '>Included</div>
                      </div>

                      <div className='flex flex-row justify-between items-center my-3 '>
                        <div className='text-slateGray  text-base md:text-[20px]'>Total </div>
                        <div className='text-slateGray font-ivyOra text-xl md:text-2xl '>
                          {bookingEstimate?.price_breakdown?.total &&
                            convertINRUsingGlobalRates(
                              bookingEstimate.price_breakdown.total,
                              currency
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                  {isRoomSoldOut(roomDetails.category, startDate) ? (
                    <div
                      className={`mt-3 md:my-9 w-full md:w-fit cursor-not-allowed text-base md:text-xl h-fit text-softSand px-8 py-4 bg-pemaBlue transition-colors duration-200 `}
                    >
                      Sold out
                    </div>
                  ) : (
                    <PrimaryButton onClick={clickContinue} className='w-full my-9'>
                      Continue
                    </PrimaryButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <DatePickerModal
          isOpen={isOpen}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onClose={() => setIsOpen(false)}
        />
        {isRoomPickerOpen && (
          <RoomGuestPicker
            rooms={rooms}
            adults={adults}
            childrens={children}
            onChange={handleChange}
            onClose={() => {
              setIsRoomPickerOpen(false)
              getEstimate()
            }}
          />
        )}
        <SpinningLoader isLoading={loading} />
        {/* Fullscreen Image Modal */}
        {fullscreenImage && (
          <div
            className='fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center p-4'
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className='absolute top-4 right-4 cursor-pointer z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all'
              aria-label='Close'
            >
              <X className='w-6 h-6 md:w-8 md:h-8 text-slateGray' />
            </button>
            <div
              className='relative w-full h-full flex items-center justify-center'
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithShimmer
                src={fullscreenImage}
                alt='Room image fullscreen'
                fill
                className='object-contain! '
              />
            </div>
          </div>
        )}
      </div>
    </Suspense>
  )
}

export default function RoomDetails() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  )
}
