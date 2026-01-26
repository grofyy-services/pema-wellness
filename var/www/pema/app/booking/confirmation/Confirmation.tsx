'use client'
import { PemaInstance } from '@/api/api'
import { Check, Mail, Phone } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import ImageWithShimmer from '@/components/ImageWithShimmer'
import { roomData } from '../utils'
import { differenceInCalendarDays } from 'date-fns'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import { useAtomValue } from 'jotai'
import { selectedCurrencyAtom } from '@/lib/atoms'
import Image from 'next/image'
import { Room } from '@/utils/types'
import { zohoForms } from '@/utils/utils'

interface BookingData {
  id?: number
  confirmation_number?: string
  guest_first_name?: string
  guest_last_name?: string
  guest_email?: string
  guest_phone?: string
  check_in_date?: string
  check_out_date?: string
  room_category?: string
  occupancy_details?: {
    adults?: number
    children?: number
  }
  deposit_received?: number
  balance_payable?: number
  total_amount?: number
  selected_program?: string
  estimate_response?: {
    deposit_required?: string
    total?: number
  }
}

interface ApiBookingResponse {
  check_in_date?: string
  check_out_date?: string
  nights?: number
  occupancy_details?: {
    adults_total?: number
    teens_13to18?: number
    ids_room_code?: string
    number_of_rooms?: number
    ids_rate_plan_code?: string
    children_total_5to12?: number
    children_total_under_4?: number
  }
  status?: string
  total_amount?: number
  deposit_amount?: number
  paid_amount?: number
  balance_amount?: number
  special_requests?: string | null
  guest_notes?: string | null
  guest_first_name?: string
  guest_last_name?: string
  guest_email?: string
  guest_phone?: string
  guest_country?: string
  number_of_rooms?: number
  caregiver_required?: boolean
  caregiver_stay_with_guest?: boolean
  caregiver_meal?: string | null
  private_transfer?: boolean
  confirmation_number?: string
  invoice_id?: string | null
  cancelled_at?: string | null
  cancellation_reason?: string | null
  refund_amount?: number
  ids_booking_reference?: string
  other_guests?: unknown
  estimate_details?: unknown
}

const ConfirmationScreen = () => {
  const searchParams = useSearchParams()
  const currency = useAtomValue(selectedCurrencyAtom)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to map API booking response to component's expected structure
  const mapApiBookingToBookingData = async (
    apiBooking: ApiBookingResponse
  ): Promise<BookingData> => {
    const mappedBooking: BookingData = {
      confirmation_number: apiBooking.confirmation_number,
      guest_first_name: apiBooking.guest_first_name,
      guest_last_name: apiBooking.guest_last_name,
      guest_email: apiBooking.guest_email,
      guest_phone: apiBooking.guest_phone,
      check_in_date: apiBooking.check_in_date,
      check_out_date: apiBooking.check_out_date,
      total_amount: apiBooking.total_amount,
      deposit_received: apiBooking.deposit_amount,
      balance_payable: apiBooking.balance_amount,
      occupancy_details: {
        adults: apiBooking.occupancy_details?.adults_total || 0,
        children:
          (apiBooking.occupancy_details?.children_total_5to12 || 0) +
          (apiBooking.occupancy_details?.children_total_under_4 || 0),
      },
    }

    // Fetch room category if room code is available
    if (apiBooking.occupancy_details?.ids_room_code) {
      try {
        const roomRes = await PemaInstance.get('room-types')
        if (roomRes.data && Array.isArray(roomRes.data)) {
          const room = roomRes.data.find(
            (r: Room) => r.code === apiBooking.occupancy_details?.ids_room_code
          )
          if (room?.category) {
            mappedBooking.room_category = room.category
          }
        }
      } catch (roomError) {
        console.error('Error fetching room details:', roomError)
        // Continue without room category - component has fallback
      }
    }

    return mappedBooking
  }

  useEffect(() => {
    const txnid = searchParams.get('txnid')
    const status = searchParams.get('status')

    const fetchBookingData = async () => {
      if (!txnid) {
        setLoading(false)
        return
      }

      try {
        const res = await PemaInstance.get(`/bookings/search?q=${txnid}`)
        let apiBooking: ApiBookingResponse | null = null

        // Handle array response (most common case based on your example)
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          apiBooking = res.data[0]
        } else if (res.data && !Array.isArray(res.data)) {
          // Handle single object response
          apiBooking = res.data as ApiBookingResponse
        }

        if (apiBooking) {
          const mappedBooking = await mapApiBookingToBookingData(apiBooking)
          setBookingData(mappedBooking)
          if (status === 'success') {
            enqueueSnackbar('Booking successful!', {
              variant: 'success',
            })
          }
        }
      } catch (error: unknown) {
        console.error(error)
        enqueueSnackbar('Something went wrong! Please try again!', {
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    if (status && txnid) {
      if (status === 'success') {
        fetchBookingData()
      } else {
        enqueueSnackbar('Payment failed! Please try again!', {
          variant: 'error',
        })
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className='max-w-[1360px] m-auto py-6 min-h-dvh flex items-center justify-center'>
        <div className='text-slateGray font-crimson text-xl'>Loading...</div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className='max-w-[1360px] m-auto py-6 min-h-dvh flex items-center justify-center'>
        <div className='text-slateGray font-crimson text-xl'>
          No booking data found / booking failed!
        </div>
      </div>
    )
  }

  const checkInDate = bookingData.check_in_date ? new Date(bookingData.check_in_date) : null
  const checkOutDate = bookingData.check_out_date ? new Date(bookingData.check_out_date) : null
  const nights =
    checkInDate && checkOutDate ? differenceInCalendarDays(checkOutDate, checkInDate) : 0

  const roomCategory = bookingData.room_category || ''
  const roomImage =
    roomData[roomCategory as keyof typeof roomData]?.images?.[0] ||
    roomData[roomCategory as keyof typeof roomData]?.mobileImages?.[0] ||
    '/images/rooms/premium-balcony/1.webp'

  const depositAmount = bookingData.deposit_received || 0
  const totalAmount = bookingData.total_amount || bookingData.estimate_response?.total || 0
  const balanceAmount = totalAmount - depositAmount

  const guestName =
    `${bookingData.guest_first_name || ''} ${bookingData.guest_last_name || ''}`.trim() || 'Guest'

  const totalGuests =
    (bookingData.occupancy_details?.adults || 0) + (bookingData.occupancy_details?.children || 0)

  return (
    <div className='max-w-[830px] m-auto py-6 min-h-dvh'>
      {/* Header Section */}
      <div className='flex flex-col items-center mt-6 md:mt-12 mb-8 px-4'>
        <div className='bg-pemaBlue rounded-full h-[100px] w-[100px] md:h-[120px] md:w-[120px] flex items-center justify-center mb-6'>
          <Check className='text-white h-12 w-12 md:h-16 md:w-16' />
        </div>
        <h1 className='text-slateGray text-[28px] md:text-[40px] font-ivyOra text-center mb-3'>
          Your wellness retreat is confirmed.
        </h1>
        <p className='text-slateGray text-base md:text-xl font-crimson text-center'>
          We look forward to welcoming you to Pema.
        </p>
      </div>

      <h2 className='text-slateGray text-2xl md:text-3xl font-ivyOra text-center mb-4 px-4'>
        Booking details
      </h2>
      <p className='text-slateGray text-base md:text-lg font-crimson text-center mb-8 px-4'>
        Your reservation has been received and a confirmation has been sent to your email.
      </p>
      {/* Booking Details Section */}
      <div className='max-w-4xl m-auto mb-12 bg-softSand p-9'>
        {/* Room Category Section */}
        <div className='mb-8'>
          <h3 className='text-slateGray text-xl mb-2'>Room category:</h3>
          <div className='flex flex-col-reverse md:flex-row md:gap-6 items-start'>
            <div className='w-full max-w-[425px]'>
              <ImageWithShimmer
                src={roomImage}
                alt={roomCategory}
                className='w-full h-[200px]  md:h-[225px] object-cover '
                width={440}
                height={250}
              />
            </div>
            <div>
              <p className='text-pemaBlue md:mt-6 text-lg md:text-2xl font-ivyOra mb-4'>
                {roomData[roomCategory as keyof typeof roomData]?.category || roomCategory}
              </p>
            </div>
          </div>
        </div>
        <div className='space-y-2 text-slateGray font-crimson text-base md:text-lg grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <p className='text-xl text-slateGray'>Guest name:</p>
            <p className='text-2xl font-ivyOra text-pemaBlue'>{guestName}</p>
          </div>

          <div>
            <p className='text-xl text-slateGray'>Number of guests:</p>
            <p className='text-2xl font-ivyOra text-pemaBlue'>{totalGuests}</p>
          </div>
          <div>
            <p className='text-xl text-slateGray'>Dates of stay:</p>
            <p className='text-2xl font-ivyOra text-pemaBlue'>
              {nights} {nights === 1 ? 'night' : 'nights'} <br />
              {checkInDate && checkOutDate && (
                <span className=''>
                  (
                  {checkInDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  -{' '}
                  {checkOutDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  )
                </span>
              )}
            </p>
          </div>
        </div>
        {/* Financial Information */}
        <h3 className='text-slateGray text-xl mb-3 mt-11'>Your total wellness investment:</h3>

        <div className='space-y-2 text-slateGray font-crimson text-base md:text-lg grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <p className='text-xl text-slateGray'>Deposit received:</p>
            <p className='text-2xl font-ivyOra text-pemaBlue'>
              {convertINRUsingGlobalRates(depositAmount, currency)}
            </p>
          </div>

          <div>
            <p className='text-xl text-slateGray'>Balance payable before check-in:</p>
            <p className='text-2xl font-ivyOra text-pemaBlue'>
              {' '}
              {convertINRUsingGlobalRates(balanceAmount, currency)}
              <br />
            </p>
          </div>
          <div>
            <p className='text-xl text-slateGray'>Confirmation number:</p>
            <p className='text-2xl font-ivyOra text-pemaBlue'>#{bookingData.confirmation_number}</p>
          </div>
        </div>

        {/* Selected Program
        {bookingData.selected_program && (
          <div className='mb-8'>
            <p className='text-slateGray font-crimson text-base md:text-lg'>
              <span className=''>Selected program (if any):</span> {bookingData.selected_program}
            </p>
          </div>
        )} */}
        {/* Next Steps */}
        <div className=''>
          <h3 className='text-slateGray text-xl mb-3 mt-11'>Next steps:</h3>
          <div className='space-y-4'>
            <div className='flex gap-1 md:gap-4 items-start'>
              <div className='flex-shrink-0 mt-1 text-pemaBlue'>
                <Image
                  src={'/lotus-pointer-1.svg'}
                  width={31}
                  height={24}
                  alt='Pointer'
                  className='md:h-6 md:w-[31px] h-5 w-[26px]'
                />
              </div>
              <p className='text-slateGray font-crimson text-base md:text-lg flex-1'>
                The payment that’s pending will be completed in two phases. Details have already
                been shared with you over email.
              </p>
            </div>
            <div className='flex gap-1 md:gap-4 items-start'>
              <div className='flex-shrink-0 mt-1 text-pemaBlue'>
                <Image
                  src={'/lotus-pointer-2.svg'}
                  width={31}
                  height={24}
                  alt='Pointer'
                  className='md:h-6 md:w-[31px] h-5 w-[26px]'
                />
              </div>
              <p className='text-slateGray font-crimson text-base md:text-lg flex-1'>
                Please complete your{' '}
                <a
                  href={
                    'https://forms.zohopublic.in/pemawellness5391/form/SpaClientIntakeForm/formperma/qBEhhGBbbmMe0HyXDNlyWrx9Fnmuq9lWa9HcGd7GhAY'
                  }
                  className='text-pemaBlue underline'
                >
                  pre-arrival medical form
                </a>
                . This allows our doctors to personalise your retreat with care.
              </p>
            </div>
            <div className='flex gap-1 md:gap-4 items-start'>
              <div className='flex-shrink-0 mt-1 text-pemaBlue'>
                <Image
                  src={'/lotus-pointer-3.svg'}
                  width={31}
                  height={24}
                  alt='Pointer'
                  className='md:h-6 md:w-[31px] h-5 w-[26px]'
                />
              </div>
              <p className='text-slateGray font-crimson text-base md:text-lg flex-1'>
                Once your form is reviewed, you&apos;ll hear back from us with the next update on
                your program and arrival details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Need Any Help Section */}
      <div className=' m-auto mt-11 mb-12 text-center px-4'>
        <h2 className='text-slateGray text-xl md:text-2xl font-ivyOra mb-2'>Need any help?</h2>
        <p className='text-slateGray text-base md:text-lg font-crimson mb-2 max-w-2xl mx-auto'>
          Our wellness concierge is here to assist with anything you may need before your stay.
        </p>

        {/* Contact Information */}
        <div className='flex flex-col md:flex-row items-center justify-center gap-6 mb-3'>
          <div className='flex items-center gap-2 text-slateGray font-crimson text-base md:text-lg'>
            <Mail className='h-5 w-5 text-slateGray' />
            <a href='mailto:enquiry@pemawellness.com' className='hover:border-b border-slateGray'>
              enquiry@pemawellness.com
            </a>
          </div>
          <div className='flex items-center gap-2 text-slateGray font-crimson text-base md:text-lg'>
            <Phone className='h-5 w-5' height={20} width={20} />
            <a href='tel:+919577709494' className='hover:border-b border-slateGray'>
              +91 95777 09494
            </a>
          </div>
        </div>

        {/* Closing Statement */}
        <p className='text-pemaBlue text-[28px] md:text-[32px] font-ivyOra'>
          We look forward to welcoming you into the Universe of You.
        </p>
      </div>
    </div>
  )
}
export default ConfirmationScreen
