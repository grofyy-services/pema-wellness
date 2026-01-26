'use client'
import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'

import 'react-multi-carousel/lib/styles.css'

import { addDays, differenceInCalendarDays } from 'date-fns'
import DatePickerModal from '@/components/DatePicker'
import RoomGuestPicker from '@/components/RoomGuestPicker'
import Breadcrumbs from '@/components/BreadCrumbs'
import { useRouter, useSearchParams } from 'next/navigation'
import { PemaInstance } from '@/api/api'
import 'react-phone-number-input/style.css'
import Input, { getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input/input'
import type { CountryCode } from 'libphonenumber-js'
import { enqueueSnackbar } from 'notistack'
import { BookingEstimateType, Room } from '@/utils/types'
import { roomData } from '../../utils'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { useAtomValue } from 'jotai'
import SpinningLoader from '@/components/Loader'
import { navigateTo, ROUTES, formatDateToLocalString } from '@/utils/utils'
import CountryPicker from './CountryPicker'

// ✅ Validate and parse number safely
const parseNumber = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const currency = useAtomValue(selectedCurrencyAtom)

  const [loading, setLoading] = useState(true)
  const parseDate = (value: string | null, fallback: Date) => {
    if (!value) return fallback
    const d = new Date(value)

    return isNaN(d.getTime()) ? fallback : d
  }
  const initialAdultsCount = parseNumber(searchParams.get('adults'), 1)
  const [adultNames, setAdultNames] = useState<Array<{ firstName: string; lastName: string }>>(
    Array.from({ length: initialAdultsCount }, () => ({ firstName: '', lastName: '' }))
  )
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState<string>('India')
  const [countryCode, setCountryCode] = useState<CountryCode>('IN')

  const [specialRequest, setSpecialRequest] = useState<string>('')

  const [errors, setErrors] = useState<Record<string, string>>({})

  const [startDate, setStartDate] = useState(parseDate(searchParams.get('startDate'), new Date()))

  const [endDate, setEndDate] = useState(
    parseDate(searchParams.get('endDate'), addDays(new Date(), 3))
  )

  const [rooms, setRooms] = useState(parseNumber(searchParams.get('rooms'), 1))
  const [adults, setAdults] = useState(parseNumber(searchParams.get('adults'), 1))
  const [children, setChildren] = useState(parseNumber(searchParams.get('children'), 0))

  // Update adultNames array when adults count changes
  useEffect(() => {
    setAdultNames((prev) => {
      const currentLength = prev.length
      if (adults > currentLength) {
        // Add new empty name objects
        return [
          ...prev,
          ...Array.from({ length: adults - currentLength }, () => ({
            firstName: '',
            lastName: '',
          })),
        ]
      } else if (adults < currentLength) {
        // Remove extra name objects
        return prev.slice(0, adults)
      }
      return prev
    })
  }, [adults])
  const [isRoomPickerOpen, setIsRoomPickerOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleChange = (type: 'rooms' | 'adults' | 'children', value: number) => {
    if (type === 'rooms') setRooms(value)
    if (type === 'adults') setAdults(value)
    if (type === 'children') setChildren(value)
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Booking page', href: `/booking?${searchParams}` },
    { label: 'Room details', href: `/booking/room-details?${searchParams}` },
    { label: 'Your reservation' }, // current page (no href)
  ]

  const editRooms = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('step', '0') // ✅ add or update param

    router.push(`/booking/room-details?${params.toString()}`)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Validate all adults' names
    adultNames.forEach((name, index) => {
      const isSingleGuest = adultNames.length === 1
      if (!name.firstName.trim()) {
        newErrors[`adult_${index}_firstName`] = isSingleGuest
          ? 'First name is required'
          : `First name is required for guest ${index + 1}`
      }
      if (!name.lastName.trim()) {
        newErrors[`adult_${index}_lastName`] = isSingleGuest
          ? 'Last name is required'
          : `Last name is required for guest ${index + 1}`
      }
    })
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Enter a valid email'
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      const valid = isValidPhoneNumber(phone) ? undefined : 'Enter a valid phone number'

      if (valid !== undefined) {
        newErrors.phone = valid
      }
    }
    if (!country) newErrors.country = 'Country is required'
    if (!termsAccepted) newErrors.termsAccepted = 'Please accept terms and conditions!'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      handlePayNow()
    }
  }

  const handlePayNow = async () => {
    setLoading(true)
    try {
      const newData = {
        amount: bookingEstimate?.deposit_required,
        payment_type: 'deposit',

        // Guest Information
        guest_first_name: adultNames[0]?.firstName || '',
        // guest_last_name: adultNames[0]?.lastName || '',
        guest_email: email,
        guest_phone: `${phone}`,

        // Booking Dates & Basic Info
        check_in_date: formatDateToLocalString(startDate),
        check_out_date: formatDateToLocalString(endDate),
        room_category: roomDetails?.category,
        occupancy_details: {
          adults: adults,
          children: children,
        },

        // --- NEW: IDS Parameters ---
        ids_room_code: roomDetails?.code, // From estimate response
        ids_rate_plan_code: 'RR0925', // From estimate response
        ids_guest_last_name: adultNames[0]?.lastName || '',
        ids_other_guests: adultNames.map((name) => name.firstName + ' ' + name.lastName), // Optional: List of other guests
        ids_special_requests: specialRequest, // Optional

        // --- NEW: Full Estimate Response ---
        estimate_response: bookingEstimate,
      }

      const payRes = await PemaInstance.post('/payments/initiate', newData)
      // return
      if (payRes.data) {
        const payuData = payRes.data
        const data = payuData.payment_options.fields

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = payRes.data.checkout_url // or test URL: https://test.payu.in/_payment

        // Append all fields as hidden inputs
        Object.entries(data).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(value)
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      }
    } catch (error) {
      console.error('Payment init error', error)
      setLoading(false)
    } finally {
    }
  }

  const caregiverRequired = searchParams.get('caregiver_required') === 'true'
  const caregiverStayWithGuest = searchParams.get('caregiver_stay_with_guest') === 'true'
  const caregiverRoomPricingCategory =
    searchParams.get('caregiver_room_pricing_category') || 'Separate'
  const caregiverMeal = searchParams.get('caregiver_meal')
  const [bookingEstimate, setBookingEstimate] = useState<BookingEstimateType>()
  const [roomDetails, setRoomDetails] = useState<Room>()

  useEffect(() => {
    const checkAvailability = async () => {
      setLoading(true)
      try {
        const roomID = searchParams.get('roomID')
        const res: { data: Room[] } = await PemaInstance.get('room-types')
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
    checkAvailability()
  }, [searchParams])

  useEffect(() => {
    const maxDate = new Date('2026-08-31')

    if (endDate === maxDate) {
      navigateTo(ROUTES.booking)
    }
    const getEstimate = async () => {
      setLoading(true)
      try {
        const data = {
          room_pricing_category: searchParams.get('room_pricing_category'),
          check_in_date: formatDateToLocalString(startDate),
          check_out_date: formatDateToLocalString(endDate),
          occupancy: {
            adults: adults,
            children: 0,
            teens_13_18: 0,
            children_ages: [],
            caregiver_required: caregiverRequired,
          },
          caregiver_required: caregiverRequired,
          caregiver_stay_with_guest: caregiverStayWithGuest,
          caregiver_room_pricing_category: searchParams.get('caregiver_room_pricing_category'),
          caregiver_meal: caregiverMeal,
          number_of_rooms: rooms,
          adults_total: adults,
          children_total_under_4: children,
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
        router.back()
      } finally {
        setLoading(false)
      }
    }
    getEstimate()
  }, [
    adults,
    caregiverMeal,
    caregiverRequired,
    caregiverStayWithGuest,
    children,
    endDate,
    rooms,
    startDate,
  ])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='flex-1 relative bg-white p-4 min-h-dvh'>
        {/* hero section */}
        <div className='bg-white max-w-[1360px] m-auto'>
          <Breadcrumbs items={crumbs} separator={' / '} />

          {roomDetails && (
            <div className='flex flex-col-reverse md:grid grid-cols-2 grid-rows-1'>
              <div className='relative mt-6 w-full p-3 md:p-0 md:border-0 border-1 border-slateGray '>
                {/* room details sections */}
                <div className=''>
                  <div className='flex flex-col-reverse md:flex-row gap-4'>
                    <Image
                      src={roomData[roomDetails?.category].images[0]}
                      alt='rooom iamge'
                      className='md:max-h-[135px] w-full md:max-w-[250px] object-cover'
                      width={750}
                      height={500}
                    />
                    <div>
                      <div className='text-slateGray font-ivyOra text-2xl md:text-[32px] mb-2 '>
                        {roomData[roomDetails?.category].category}
                      </div>

                      <div className='text-pemaBlue md:text-slateGray font-crimson text-base md:text-[20px] mt-2'>
                        {roomData[roomDetails?.category].area}
                        {' | '}
                        {roomData[roomDetails?.category].view}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='mt-9'>
                      <div className='flex flex-row justify-between items-center '>
                        <div className='text-pemaBlue font-ivyOra text-base md:text-[20px]'>
                          Your trip details{' '}
                        </div>
                        <div
                          onClick={editRooms}
                          className='text-pemaBlue cursor-pointer text-base md:text-[20px] border-b border-pemaBlue w-fit'
                        >
                          Edit{' '}
                        </div>
                      </div>
                      <div className='grid grid-cols-2 grid-rows-1 flex-row  my-3 w-full'>
                        <div>
                          <div className='grid grid-cols-[35%_65%] grid-rows-1 flex-row items-center my-3 justify-between w-full'>
                            <div className='text-slateGray  text-base md:text-[20px]'>Dates: </div>
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
                            </div>
                          </div>
                          <div className='grid grid-cols-[35%_65%] grid-rows-1 flex-row items-center my-3 justify-between w-full '>
                            <div className='text-slateGray  text-base md:text-[20px]'>Guests: </div>
                            <div className='flex flex-row justify-between items-center gap-4'>
                              <div className='text-slateGray  text-base md:text-[20px] '>
                                {adults} {adults === 1 ? 'Adult' : 'Adults'}
                              </div>
                            </div>
                          </div>
                          <div className='grid grid-cols-[35%_65%] grid-rows-1 flex-row items-center my-3 justify-between w-full '>
                            <div className='text-slateGray  text-base md:text-[20px]'>Rooms: </div>
                            <div className='flex flex-row justify-between items-center gap-4'>
                              <div className='text-slateGray  text-base md:text-[20px] '>
                                {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
                              </div>
                            </div>
                          </div>
                        </div>
                        {bookingEstimate &&
                          bookingEstimate.structured_breakdown?.caregiver_room_total && (
                            <div className='border-l border-pemaBlue pl-4'>
                              <div className='grid flex-row items-center my-3 justify-between w-full '>
                                <div className='text-slateGray  text-base md:text-[20px]'>
                                  {`Caregiver stay`}
                                </div>
                              </div>

                              <div className='grid grid-cols-2 grid-rows-1 flex-row items-center my-3 justify-between w-full '>
                                <div className='text-slateGray  text-base md:text-[20px]'>
                                  Room type:{' '}
                                </div>
                                <div className='flex flex-row justify-between items-center gap-4'>
                                  <div className='text-slateGray  text-base md:text-[20px] '>
                                    {bookingEstimate.structured_breakdown.caregiver_room_total
                                      .room_type === 'sharing_guest_room'
                                      ? 'Shared room'
                                      : caregiverRoomPricingCategory}
                                  </div>
                                </div>
                              </div>
                              <div className='grid grid-cols-2 grid-rows-1 flex-row items-center my-3 justify-between w-full '>
                                <div className='text-slateGray  text-base md:text-[20px]'>
                                  Meal:{' '}
                                </div>
                                <div className='flex flex-row justify-between items-center gap-4'>
                                  <div className='text-slateGray  text-base md:text-[20px] '>
                                    {bookingEstimate.structured_breakdown.caregiver_meal.meal_type
                                      ? bookingEstimate.structured_breakdown.caregiver_meal.meal_type
                                          .charAt(0)
                                          .toUpperCase() +
                                        bookingEstimate.structured_breakdown.caregiver_meal.meal_type
                                          .slice(1)
                                          .replace('_', ' ')
                                      : ''}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      <div className='text-pemaBlue font-ivyOra text-base md:text-[20px] mt-9'>
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
                          {bookingEstimate &&
                            convertINRUsingGlobalRates(
                              bookingEstimate.structured_breakdown.room_total.amount!,
                              currency
                            )}
                        </div>
                      </div>
                      {bookingEstimate &&
                        bookingEstimate.structured_breakdown.caregiver_room_total && (
                          <div className='flex flex-row justify-between items-center my-3'>
                            <div className='text-slateGray  text-base md:text-[20px]'>
                              Caregiver stay
                            </div>
                            <div className='text-slateGray  text-base md:text-[20px] '>
                              {convertINRUsingGlobalRates(
                                bookingEstimate.structured_breakdown.caregiver_room_total.amount,
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
                          {bookingEstimate &&
                            convertINRUsingGlobalRates(
                              bookingEstimate.price_breakdown.total!,
                              currency
                            )}
                        </div>
                      </div>
                      <div className='flex flex-row justify-between items-center my-6 '>
                        <div className='text-slateGray  text-base md:text-[20px]'>
                          {/* Payment due now (50% of the total amount){' '} */}
                          Deposit required
                        </div>
                        <div className='text-slateGray font-ivyOra text-xl md:text-2xl '>
                          {bookingEstimate &&
                            bookingEstimate.deposit_required &&
                            convertINRUsingGlobalRates(
                              parseInt(bookingEstimate.deposit_required),
                              currency
                            )}
                        </div>
                      </div>
                      <div className='p-4 bg-softSand w-full'>
                        <div className='text-black  text-base md:text-[20px]'>Note* </div>
                        <div className='text-black  text-base md:text-[20px]'>
                          To begin your booking, a refundable deposit of{' '}
                          {bookingEstimate?.deposit_required &&
                            convertINRUsingGlobalRates(
                              Number(bookingEstimate?.deposit_required),
                              currency
                            )}{' '}
                          is required. Once submitted, you will be asked to complete a medical form
                          for doctor approval. After approval, 50% of the total package value minus
                          the initial{' '}
                          {bookingEstimate?.deposit_required &&
                            convertINRUsingGlobalRates(
                              Number(bookingEstimate?.deposit_required),
                              currency
                            )}{' '}
                          must be paid to secure your stay. The balance 50% will be settled at the
                          time of check-in.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-start mx-0 md:mx-8'>
                <div>
                  <div className='text-[24px] md:text-[28px] text-slateGray font-ivyOra'>
                    Guest details{' '}
                  </div>
                  {adultNames.map((name, index) => (
                    <div key={index} className='mb-4'>
                      {adults > 1 && (
                        <div className='text-lg text-slateGray mb-2 mt-4'>Guest {index + 1}</div>
                      )}
                      <div className='grid grid-cols-2 grid-rows-1 flex-row gap-4'>
                        <div>
                          <div className='border border-[#32333366] h-[62px] mb-3'>
                            <input
                              placeholder='First Name*'
                              value={name.firstName}
                              onChange={(e) => {
                                const updated = [...adultNames]
                                updated[index] = { ...updated[index], firstName: e.target.value }
                                setAdultNames(updated)
                              }}
                              className='text-xl placeholder-[#32333380] h-[60px] w-full px-4 focus:outline-pemaBlue'
                            />
                          </div>
                          {errors[`adult_${index}_firstName`] && (
                            <p className='text-red-500 text-sm mb-2'>
                              {errors[`adult_${index}_firstName`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <div className='border border-[#32333366] h-[62px] mb-3'>
                            <input
                              placeholder='Last Name*'
                              value={name.lastName}
                              onChange={(e) => {
                                const updated = [...adultNames]
                                updated[index] = { ...updated[index], lastName: e.target.value }
                                setAdultNames(updated)
                              }}
                              className='text-xl placeholder-[#32333380] h-[60px] w-full px-4 focus:outline-pemaBlue'
                            />
                          </div>
                          {errors[`adult_${index}_lastName`] && (
                            <p className='text-red-500 text-sm mb-2'>
                              {errors[`adult_${index}_lastName`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

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

                  <div className='border border-[#32333366] h-[62px] mb-3'>
                    <input
                      placeholder='Email*'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='text-xl placeholder-[#32333380] h-[60px] w-full px-4 focus:outline-pemaBlue'
                    />
                  </div>
                  {errors.email && <p className='text-red-500 text-sm mb-2'>{errors.email}</p>}

                  <div className='border relative border-[#32333366] h-[62px] mb-3 flex flex-row items-center'>
                    <div className='left-2 absolute'>+{getCountryCallingCode(countryCode)}</div>
                    <div className='w-full'>
                      <Input
                        placeholder='Phone number*'
                        value={phone}
                        onChange={(nextValue) => {
                          setPhone(nextValue || '')
                        }}
                        country={countryCode}
                        // withCountryCallingCode
                        // defaultCountry={countryList().getData().find((c) => c.label === country)?.value?.toLowerCase() || "in"}
                        className='react-phone-input w-full'
                        inputClass='text-xl placeholder-[#32333380] h-[60px] w-full px-4 bg-transparent focus:outline-pemaBlue'
                        style={{ border: 'none', boxShadow: 'none', height: 60, paddingLeft: 44 }}
                        // countrySelectProps={{ unicodeFlags: true }}
                        international
                      />
                    </div>
                  </div>
                  {errors.phone && <p className='text-red-500 text-sm mb-2'>{errors.phone}</p>}

                  <div className='text-slateGray text-lg mt-4'>Special request</div>
                  <div className='border border-[#32333366] h-[62px] mt-4'>
                    <input
                      placeholder='Type here'
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      className='text-xl placeholder-[#32333380] h-[60px] w-full px-4 focus:outline-pemaBlue'
                    />
                  </div>
                  <div className='p-4 bg-softSand w-full my-5'>
                    <div className='text-black  text-base md:text-[20px]'>*T&C apply </div>
                    <div className='text-black  text-base md:text-[20px]'>
                      {`Please note: The  ${
                        bookingEstimate?.deposit_required &&
                        convertINRUsingGlobalRates(
                          Number(bookingEstimate?.deposit_required),
                          currency
                        )
                      } deposit does not confirm your booking. Your
                      booking is subject to doctor’s approval as well as room availability. Once the
                      entire booking payment is received, our team will confirm your stay. Retreat
                      terms and conditions apply.`}
                    </div>
                    <div className='text-black  text-base md:text-[20px]'>
                      If they feel the timing isn’t right, your payment will be returned in full,
                      with the same care with which it was entrusted to us.{' '}
                    </div>
                    <div className='text-black  text-base md:text-[20px] flex flex-row items-center gap-2 leading-none mt-2'>
                      <input
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        type='checkbox'
                        className='accent-pemaBlue w-6 h-6 cursor-pointer'
                      />{' '}
                      <div>
                        *I have read the{' '}
                        <a href={ROUTES.disclaimer} className='text-pemaBlue cursor-pointer'>
                          terms and conditions
                        </a>{' '}
                        and I agree to proceed
                      </div>
                    </div>
                  </div>
                  {errors.termsAccepted && (
                    <p className='text-red-500 text-sm mb-2'>{errors.termsAccepted}</p>
                  )}

                  <PrimaryButton onClick={handleSubmit} className='w-full'>
                    Submit and pay
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}
        </div>

        <SpinningLoader isLoading={loading} />

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
            onClose={() => setIsRoomPickerOpen(false)}
          />
        )}
      </div>
    </Suspense>
  )
}

export default function Reservation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  )
}
