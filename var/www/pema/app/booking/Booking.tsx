'use client'
import PrimaryButton from '@/components/PrimaryButton'
import { MoveRight, ChevronDown, Check } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'

import 'react-multi-carousel/lib/styles.css'

import { addDays, differenceInCalendarDays } from 'date-fns'
import DatePickerModal from '@/components/DatePicker'
import RoomGuestPicker from '@/components/RoomGuestPicker'
import Breadcrumbs from '@/components/BreadCrumbs'
import { useSearchParams } from 'next/navigation'

import WhatsappStickyButton from '@/components/WhatsappButtonSticky'

import Carousel from 'react-multi-carousel'
import { PemaInstance } from '@/api/api'
import { enqueueSnackbar } from 'notistack'
import { Room } from '@/utils/types'
import { isRoomSoldOut, roomData } from './utils'
import ComingSoon from '../coming-soon/page'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { useAtomValue } from 'jotai'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import { EXTERNAL_LINKS, ROUTES, zohoForms, formatDateToLocalString } from '@/utils/utils'
import Link from 'next/link'
import ImageWithShimmer from '@/components/ImageWithShimmer'
import { useRouter } from 'next/navigation'
import Marquee from 'react-fast-marquee'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 664 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,

    slidesToSlide: 1, // optional, default to 1.
  },
}

const faqs = [
  {
    id: 1,
    question: 'Do I need to choose a wellness program now?',
    answer: `No. All programs are customised after a medical assessment when you arrive. Nothing is pre-fixed, your body tells us what it needs.`,
  },
  {
    id: 2,
    question: 'What if I’m unsure how long to stay?',
    answer: `We recommend starting with 8 nights. That’s the sweet spot for visible results. For chronic issues, many guests stay 15+ nights and often extend once they feel the shift.`,
  },
  {
    id: 3,
    question: 'Can I come just to rest and reset without a medical detox?',
    answer: `Absolutely. Whether you're healing, reflecting, or just seeking stillness your program will be adapted to your needs. There’s no pressure, only guidance.`,
  },
  {
    id: 4,
    question: 'I’m not plant-based. Will I adjust to the food?',
    answer: `Yes. Most guests aren’t and many leave craving our food long after. It’s nourishing, satisfying, and deeply healing without ever feeling restrictive.`,
  },
]

const whatsIncluded = [
  'Daily doctor consultations',
  '3 personalised plant-based meals/day',
  '55+ hydrotherapy and manipulative treatments',
  'Acupuncture, physiotherapy & ozone therapy (in select rooms)',
  'Private yoga sessions (in select rooms)',
  'Daily guided movement, yoga, and meditation',
  'Full access to the Healing Hub, reflexology tracks & trail',
  'Pre-arrival lifestyle prep + airport transfer support',
]

const afterYouBook = [
  "You'll fill out a secure medical intake form",
  'Our team will call you within 24 hours',
  'You’ll receive pre-arrival dietary guidelines',
  'Travel arrangements can be seamlessly supported upon request',
  'Your personalised healing plan begins the moment you arrive',
]

// ✅ Validate and parse number safely
const parseNumber = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currency = useAtomValue(selectedCurrencyAtom)

  const [roomList, setRoomList] = useState<Room[] | []>()
  const [isOpen, setIsOpen] = useState(false)
  const parseDate = (value: string | null, fallback: Date) => {
    if (!value) return fallback
    const d = new Date(value)
    return isNaN(d.getTime()) ? fallback : d
  }

  const [startDate, setStartDate] = useState(parseDate(searchParams.get('startDate'), new Date()))
  const [endDate, setEndDate] = useState(
    parseDate(searchParams.get('endDate'), addDays(new Date(), 3))
  )
  const [rooms, setRooms] = useState(parseNumber(searchParams.get('rooms'), 1))
  const [children, setChildren] = useState(parseNumber(searchParams.get('children'), 0))
  const [openIndex, setOpenIndex] = useState(0)

  const [adults, setAdults] = useState(parseNumber(searchParams.get('adults'), 1))
  // const [children, setChildren] = useState(1)
  const [isRoomPickerOpen, setIsRoomPickerOpen] = useState(false)
  const handleChange = (type: 'rooms' | 'adults' | 'children', value: number) => {
    if (type === 'rooms') setRooms(value)
    if (type === 'adults') {
      setAdults(value)
    }
    if (type === 'children') setChildren(value)
  }
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Booking page' },
    // { label: 'Room details' }, // current page (no href)
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

  const clickKnowMoreonRooms = (id: string, category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('roomID', id.toString())
    params.set('room_pricing_category', category)

    router.push(`/booking/room-details?${params.toString()}`)
  }

  const checkAvailability = async () => {
    try {
      const res = await PemaInstance.get('room-types')
      if (res.data) {
        const filteredList: Room[] = res.data
          .filter(
            (item: Room, index: number, self: Room[]) =>
              index === self.findIndex((obj) => obj.category === item.category)
          )
          .sort((a: Room, b: Room) => a.price_per_night_single - b.price_per_night_single)
        setRoomList(filteredList)
      }
      // navigate('/profile')
    } catch (error: unknown) {
      console.error(error)
      enqueueSnackbar('Something went wrong! Please try again!', {
        variant: 'error',
      })
    }
  }

  useEffect(() => {
    if (searchParams) checkAvailability()
  }, [searchParams])

  const handleCheck = () => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      rooms: rooms.toString(),
      children: children.toString(),
      adults: adults.toString(),
    })

    router.push(`/booking?${params.toString()}#availability`)
  }

  // return <ComingSoon />
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='flex-1 relative bg-white'>
        {/* hero section */}
        <div className=' w-full h-full bg-no-repeat text-pemaBlue '>
          <div className='max-w-[1360px] m-auto py-6 px-4'>
            {/* availability check section */}
            <Breadcrumbs items={crumbs} separator={' / '} />
            <div className=' text-base md:text-xl text-slateGray font-crimson text-center mb-2 mt-9'>
              Booking page
            </div>
            <div className='px-12 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center leading-none'>
              We look forward to hosting you at Pema.{' '}
            </div>

            {/* check availability section */}
            <div className='md:sticky md:top-[78px] bg-white z-100 flex-col md:flex-row flex items-center md:items-end justify-between gap-6 md:gap-8 py-6'>
              <div className=' max-w-[550px] w-full'>
                <div className='text-2xl text-slateGray '>Dates</div>
                <div
                  onClick={() => setIsOpen(true)}
                  className='border text-pemaBlue font-crimson text-xl border-pemaBlue h-[58px] w-full mt-2 flex flex-row justify-between items-center py-[20px] px-8'
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
                <div className='text-2xl text-slateGray'>Rooms & guests</div>
                <div
                  onClick={() => setIsRoomPickerOpen(true)}
                  className='border text-pemaBlue font-crimson text-xl border-pemaBlue h-[58px] w-full mt-2 flex flex-row justify-between items-center py-[20px] px-8'
                >
                  <div>
                    {rooms} {rooms === 1 ? 'Room' : 'Rooms'} & {adults}{' '}
                    {adults === 1 ? 'Adult' : 'Adults'}
                  </div>
                  <ChevronDown />
                </div>
              </div>

              <PrimaryButton
                onClick={handleCheck}
                className='w-full max-w-[550px] md:w-[200px] whitespace-nowrap'
              >
                Check availability
              </PrimaryButton>
            </div>
            <div className='text-lg md:text-2xl text-slateGray mb-6'>
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
            <div className=' md:hidden block'>
              <Marquee className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12'>
                <Check /> World-class experts in gut, skin & longevity health
              </Marquee>
            </div>
            <div className='mt-12 m-auto'>
              <div className=' text-[32px] md:text-[40px] text-pemaBlue  font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
                You’ve said yes to healing. <br /> We’ll take care of everything else.{' '}
              </div>
              {/* recommended duration web */}
              <div className='bg-softSand w-full px-20 py-6 mt-6 md:block hidden'>
                <div className='text-2xl font-ivyOra text-center text-slateGray'>
                  Recommended durations
                </div>
                <div className='flex text-slateGray flex-row justify-center items-end py-3 text-center gap-4'>
                  <div className='px-10 py-4 bg-pemaBlue text-softSand w-1/3'>
                    <div className='text-base mb-3'>★ Most chosen</div>
                    <div className='text-xl mb-3'>8 Nights</div>
                    <div className='text-xl'>
                      Gives your system time <br /> to reset and respond
                    </div>
                  </div>
                  <div className='px-10 py-4 w-1/3 border-b border-[#3233331A]'>
                    <div className='text-base'></div>
                    <div className='text-xl mb-3'>15 Nights</div>
                    <div className='text-xl mb-3'>
                      Ideal for chronic conditions, <br />
                      visible weight loss, sleep issues
                    </div>
                  </div>
                  <div className='px-10 py-4 w-1/3 border-b border-[#3233331A]'>
                    <div className='text-base'></div>
                    <div className='text-xl mb-3'>30 Nights+</div>
                    <div className='text-xl mb-3'>
                      Full metabolic and emotional <br />
                      rebalancing over time
                    </div>
                  </div>
                </div>
                <div className='text-xl text-center text-slateGray'>
                  Your program is never pre-decided. It’s personalised after you arrive.
                </div>
              </div>

              {/* recommended duration mobile */}
              <div className='bg-softSand w-full p-4 mt-6 md:hidden block'>
                <div className='text-2xl font-ivyOra text-left pb-4 text-slateGray'>
                  Recommended durations
                </div>
                <div className='flex text-slateGray flex-col justify-center items-end py-3 text-center gap-4'>
                  <div className=' p-4 bg-pemaBlue text-softSand w-full grid grid-cols-2 grid-rows-1 text-left'>
                    <div className='text-base mb-3'>8 Nights</div>
                    <div>
                      <div className='text-base mb-3'>★ Most chosen</div>
                      <div className='text-base'>Gives your system time to reset and respond</div>
                    </div>
                  </div>
                  <div className=' p-4  border-b border-[#3233331A] w-full grid grid-cols-2 grid-rows-1 text-left'>
                    <div className='text-base mb-3'>15 Nights</div>
                    <div className='text-base mb-3'>
                      Ideal for chronic conditions, <br />
                      visible weight loss, sleep issues
                    </div>
                  </div>
                  <div className=' p-4  border-b border-[#3233331A] w-full grid grid-cols-2 grid-rows-1 text-left'>
                    <div className='text-base mb-3'>30 Nights+</div>
                    <div className='text-base mb-3'>
                      Full metabolic and emotional <br />
                      rebalancing over time
                    </div>
                  </div>
                </div>
                <div className='text-base text-left text-pemaBlue'>
                  Your program is never pre-decided. It’s personalised after you arrive.
                </div>
              </div>
            </div>

            <div
              id='availability'
              className='text-slateGray mb-0 md:mb-6 mt-12 md:scroll-mt-60 scroll-mt-20'
            >
              <div className='font-ivyOra text-2xl text-left'>Choose your room</div>
              <div className='font-crimson text-xl text-left'>
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
                })}{' '}
                ( {differenceInCalendarDays(endDate, startDate)} nights)
              </div>
            </div>
            {roomList &&
              roomList?.map((item) => {
                return (
                  <div
                    key={item.category}
                    className='grid md:grid-cols-[65%_35%] md:grid-rows-1 md:gap-5 mb-4'
                  >
                    <div>
                      <div className='font-ivyOra text-slateGray text-2xl text-left block md:hidden mt-5 mb-2'>
                        {roomData[item.category].category}
                      </div>
                      <div className='md:block hidden'>
                        <Carousel
                          responsive={responsive}
                          ssr={true}
                          infinite={false}
                          // autoPlay={true}
                          autoPlaySpeed={3000}
                          arrows={roomData[item.category].images.length > 1}
                          showDots={false}
                          keyBoardControl={roomData[item.category].images.length > 1}
                          containerClass='carousel-container w-[calc(100vw-32px)] md:w-auto'
                          itemClass='carousel-item'
                        >
                          {roomData[item.category].images.map((img) => {
                            return (
                              <ImageWithShimmer
                                key={img}
                                src={img}
                                alt='rooom iamge'
                                className='h-[500px] w-full object-cover'
                                width={750}
                                height={500}
                              />
                            )
                          })}
                        </Carousel>
                      </div>
                      <div className='md:hidden block'>
                        <Carousel
                          responsive={responsive}
                          ssr={true}
                          infinite={false}
                          autoPlay={roomData[item.category].images.length > 1}
                          autoPlaySpeed={3000}
                          arrows={roomData[item.category].images.length > 1}
                          showDots={false}
                          keyBoardControl={roomData[item.category].images.length > 1}
                          containerClass='carousel-container w-[calc(100vw-32px)] md:w-auto'
                          itemClass='carousel-item'
                        >
                          {roomData[item.category].images.map((img) => {
                            return (
                              <ImageWithShimmer
                                src={img}
                                key={img}
                                alt='rooom iamge'
                                className=' h-[350px] w-full object-cover'
                                width={750}
                                height={350}
                              />
                            )
                          })}
                        </Carousel>
                      </div>
                    </div>
                    <div className='md:p-4'>
                      <div className='text-pemaBlue hidden md:block font-ivyOra text-base md:text-[32px] mb-2 '>
                        {roomData[item.category].category}
                      </div>

                      <div className='text-pemaBlue font-crimson text-base md:text-[20px] mt-2'>
                        {roomData[item.category].area} <br /> {roomData[item.category].view}{' '}
                      </div>

                      <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                        {roomData[item.category].description}{' '}
                      </div>

                      <div className='mt-3 md:mt-6'>
                        <div className='text-pemaBlue font-ivyOra text-base md:text-[20px]'>
                          starts from{' '}
                        </div>
                        <div className='text-slateGray font-ivyOra text-2xl md:text-[32px]'>
                          {convertINRUsingGlobalRates(calculateRoomPrice(item), currency)}
                          /night{' '}
                        </div>
                      </div>

                      {isRoomSoldOut(item.category, startDate) ? (
                        <div
                          className={`mt-3 md:my-9 w-full md:w-fit cursor-not-allowed text-base md:text-xl h-fit text-softSand px-8 py-4 bg-pemaBlue transition-colors duration-200 `}
                        >
                          Sold out
                        </div>
                      ) : (
                        <PrimaryButton
                          onClick={() => clickKnowMoreonRooms(item.code, item.category)}
                          className='mt-3 md:my-9 w-full md:w-fit'
                        >
                          Know more
                        </PrimaryButton>
                      )}
                    </div>
                  </div>
                )
              })}

            {/* Need a shorter stay?
             */}
            <div className='mt-12 md:mt-20 m-auto'>
              <div className='flex flex-col-reverse lg:grid grid-cols-[65%_35%] grid-rows-1'>
                <div className='relative w-full hidden lg:block h-[490] overflow-hidden'>
                  <ImageWithShimmer
                    src={'/images/booking/booking-header-image-web.webp'}
                    alt={'wellbeing-banner-home'}
                    fill
                    className={`object-cover absolute top-0 left-0 `}
                  />
                </div>
                <div className='flex flex-col md:mx-8 mb-3'>
                  <div className='md:mt-9'>
                    <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                      Need a shorter stay?
                    </div>
                    <div className='text-base md:text-xl text-slateGray mt-3'>
                      Choose Pema lite to experience the sanctuary, therapies, and cuisine all in a
                      shorter, more flexible format. No diagnostics. No pressure. Just wellness,
                      gently introduced. Book your stay now.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
            <div className='mt-12 md:mt-20 m-auto'>
              <div className='grid md:grid-cols-[65%_35%] md:grid-rows-1 md:gap-5 h-max'>
                <div className='h-max'>
                  <div className='text-pemaBlue font-ivyOra block text-[28px] md:hidden mt-5 mb-2'>
                    What’s included in every stay{' '}
                  </div>{' '}
                  <div className='hidden md:flex flex-row gap-4 w-full overflow-hidden'>
                    <ImageWithShimmer
                      // priority
                      // preload={true}
                      src='/images/booking/included-in-booking-2.webp'
                      alt='room image'
                      className='max-h-[545px]  object-cover'
                      width={750}
                      height={500}
                    />
                    <ImageWithShimmer
                      src='/images/booking/included-in-booking-1.webp'
                      alt='room image'
                      className='max-h-[545px]  object-cover'
                      width={750}
                      height={500}
                    />
                  </div>
                  <ImageWithShimmer
                    src={'/images/booking/included-in-booking-horizontal.webp'}
                    alt='rooom iamge'
                    className='max-h-[550px] w-full mt-4'
                    width={750}
                    height={500}
                  />
                </div>
                <div className='flex flex-col md:mx-5 mb-3 h-fit md:sticky md:top-54'>
                  <div className='md:mt-9'>
                    <div className='text-[28px] hidden md:block md:text-[40px] text-pemaBlue font-ivyOra'>
                      What’s included in every stay{' '}
                    </div>
                    {whatsIncluded.map((item) => {
                      return (
                        <div
                          key={item}
                          className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'
                        >
                          <Image
                            alt='icon'
                            src={'/images/kosha-pointer-icon.svg'}
                            width={28}
                            height={23}
                          />{' '}
                          {item}
                        </div>
                      )
                    })}
                    <Link
                      href={zohoForms.familyInquiry}
                      className='font-crimson mt-6 md:mt-9 w-fit text-pemaBlue text-xl flex flex-row  gap-2 border-b border-pemaBlue'
                    >
                      Inquire about visiting with the family <MoveRight />
                    </Link>{' '}
                  </div>
                </div>
              </div>
            </div>

            {/* private tranfer */}
            {/* <div className='mt-12 md:mt-20 m-auto'>
              <div className='grid md:grid-cols-[65%_35%] md:grid-rows-1 md:gap-5 h-max'>
                <div className='h-max'>
                  <div className='md:hidden mt-5 mb-2'>
                    <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                      Add private transfer{' '}
                    </div>
                    <div className=' text-xl md:text-2xl items-start font-ivyOra text-slateGray mt-3'>
                      Arrive effortlessly.
                    </div>
                    <div className=' text-base md:text-xl items-start text-pemaBlue mt-1'>
                      Let us handle your journey from the moment you land. For a seamless start to
                      your stay, opt for our private chauffeured transfer from Visakhapatnam Airport
                      or Railway Station straight to Pema.
                    </div>
                  </div>{' '}
                  <ImageWithShimmer
                    src={'/images/booking/booking-private-transfer.webp'}
                    alt='rooom iamge'
                    className='h-[350px] md:h-[760px] w-full'
                    width={750}
                    height={760}
                  />
                </div>
                <div className='flex flex-col md:mx-5 mb-3'>
                  <div className='md:mt-9'>
                    <div className='hidden md:block'>
                      <div className='text-[28px] hidden md:block md:text-[40px] text-pemaBlue font-ivyOra'>
                        Add private transfer{' '}
                      </div>
                      <div className=' text-base md:text-2xl items-start font-ivyOra text-slateGray mt-3'>
                        Arrive effortlessly.
                      </div>
                      <div className=' text-base md:text-xl items-start text-slateGray mt-3'>
                        Let us handle your journey from the moment you land. For a seamless start to
                        your stay, opt for our private chauffeured transfer from Visakhapatnam
                        Airport or Railway Station straight to Pema.
                      </div>
                    </div>
                    <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                      <Image
                        alt='icon'
                        src={'/images/kosha-pointer-icon.svg'}
                        width={28}
                        height={23}
                      />{' '}
                      Luxury vehicle with professional driver{' '}
                    </div>
                    <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                      <Image
                        alt='icon'
                        src={'/images/kosha-pointer-icon.svg'}
                        width={28}
                        height={23}
                      />{' '}
                      Smooth pickup experience no waiting, no coordination stress{' '}
                    </div>
                    <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                      <Image
                        alt='icon'
                        src={'/images/kosha-pointer-icon.svg'}
                        width={28}
                        height={23}
                      />{' '}
                      Available for all arrival and departure timings{' '}
                    </div>
                    <div className=' text-base md:hidden block items-start text-pemaBlue mt-3'>
                      We recommend booking your transfer at least 48 hours in advance.
                    </div>
                    <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6'>
                      <input
                        disabled
                        type='checkbox'
                        className='accent-pemaBlue w-6 h-6 cursor-pointer'
                      />{' '}
                      Add Private Transfer to My Booking{' '}
                    </div>
                    <div className=' text-base md:text-xl items-start text-pemaBlue md:text-slateGray mt-3'>
                      (Exact details will be confirmed by our concierge after your reservation.)
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* what happens after you book */}
            <div className='mt-12 md:mt-20 m-auto text-left'>
              <div className='flex md:justify-center  justify-start md:mx-5 mx-0 mb-3 md:text-center'>
                <div className=' m-auto'>
                  <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                    What happens after you book{' '}
                  </div>

                  {afterYouBook.map((item) => {
                    return (
                      <div
                        key={item}
                        className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'
                      >
                        <Image
                          alt='icon'
                          src={'/images/kosha-pointer-icon.svg'}
                          width={28}
                          height={23}
                        />{' '}
                        {item}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* faq */}
            <div className='mt-12 md:mt-20 m-auto text-left'>
              <div className='flex md:justify-center  justify-start md:mx-5 mx-0 mb-3 md:text-center'>
                <div className=' w-full max-w-[750px]'>
                  <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                    Frequently asked questions{' '}
                  </div>

                  {faqs.map((item) => {
                    return (
                      <div key={item.id} className='border-b border-[#3233331A] px-4 py-2'>
                        <div
                          onClick={() => setOpenIndex(item.id === openIndex ? 0 : item.id)}
                          key={item.question}
                          className='cursor-pointer flex flex-row gap-2 text-base md:text-lg items-start justify-between text-slateGray mt-3 pb-2'
                        >
                          {item.question}
                          <ChevronDown
                            className={`${item.id === openIndex ? 'rotate-180' : ''} transition-all duration-150`}
                          />
                        </div>
                        {openIndex === item.id && (
                          <div>
                            <div className='text-slateGray text-left font-crimson text-base md:text-lg mt-2'>
                              {item.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className=' md:hidden block'>
              <Marquee className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
                <Check /> World-class experts in gut, skin & longevity health
              </Marquee>
            </div>

            {/*Who comes to Pema?
             */}
            <div className='mt-12 md:mt-20 m-auto'>
              <div className='flex flex-col-reverse lg:grid grid-cols-[65%_35%] grid-rows-1'>
                <div className='relative w-full hidden lg:block h-[760px] overflow-hidden'>
                  <ImageWithShimmer
                    src={'/images/booking/who-comes-to-pema.webp'}
                    alt={'wellbeing-banner-home'}
                    fill
                    className={`object-cover absolute top-0 left-0 `}
                  />
                </div>
                <div className='flex flex-col md:mx-8 mb-3 h-fit md:sticky md:top-54'>
                  <div className='md:mt-9'>
                    <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                      Who comes to Pema?{' '}
                    </div>
                    <div className='text-base md:text-xl text-slateGray mt-3'>
                      From global founders to new mothers, solo seekers to couples, our guests come
                      for one reason: to restore what’s been lost in the noise.
                    </div>
                    <Link
                      href={ROUTES.successStories}
                      className='font-crimson mt-6 md:mt-9 w-fit text-pemaBlue text-xl flex flex-row  gap-2 border-b border-pemaBlue'
                    >
                      Hear from our guests <MoveRight />
                    </Link>{' '}
                  </div>
                </div>
              </div>
            </div>

            {/* Want to know what to pack, expect, or prepare? web+mobile */}
            <div className='md:mt-20 my-12 max-w-[1360px] m-auto'>
              <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
                Want to know what to pack, expect, or prepare?{' '}
              </div>
              <div className='relative md:mb-0 mb-4 mt-4 w-full h-[350px] overflow-hidden block md:hidden'>
                <ImageWithShimmer
                  src={'/images/booking/plan-your-visit-mobile.webp'}
                  alt={'plan-your-visit-mobile'}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
              <div className=' text-lg md:text-xl text-pemaBlue md:text-slateGray font-crimson text-left md:text-center mb-4 md:mb-6'>
                Your detailed guide to everything from what to wear to how to arrive.
              </div>

              <Link
                href={ROUTES.planYourVisit}
                className='font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit md:m-auto'
              >
                Plan your visit
                <MoveRight />
              </Link>
              <div className='relative mt-6 w-full h-[374px] overflow-hidden hidden md:block'>
                <ImageWithShimmer
                  src={'/images/booking/plan-your-visit-web.webp'}
                  alt={'plan-your-visit-mobile'}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
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
            onClose={() => setIsRoomPickerOpen(false)}
          />
        )}

        <WhatsappStickyButton />
      </div>
    </Suspense>
  )
}

export default function Booking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  )
}
