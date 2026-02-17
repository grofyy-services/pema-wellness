'use client'
import PrimaryButton from '@/components/PrimaryButton'
import { ChevronDown, MoveRight } from 'lucide-react'
import Image from 'next/image'
import { memo, useEffect, useRef, useState } from 'react'
import Carousel from 'react-multi-carousel'
import ReactPlayer from 'react-player'

import DatePickerModal from '@/components/DatePicker'
import RoomGuestPicker from '@/components/RoomGuestPicker'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { addDays } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import 'react-multi-carousel/lib/styles.css'
import GiftSection from './Gift'
import Koshas from './Koshas'
import MapsSection from './Maps'
import NaturopathicSection from './Naturopathic'
import DoctorsCarouselSwiper from './SwiperExperts'
import ComparisonTable from './Table'
import ComparisonTableMobile from './TableMobile'
import TestimonialCard from './Testimonials'

import ImageWithShimmer from '@/components/ImageWithShimmer'
import { useDeviceType } from '@/hooks/useDeviceType'
import { openWhatsApp, ROUTES, zohoForms } from '@/utils/utils'
import MobileSlides from './MobileSlides'
import NaturopathicSectionMobile from './NaturopathicMobile'
import TestimonialMobile from './TestimonialsMobile'
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 664 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1.2,

    slidesToSlide: 1, // optional, default to 1.
  },
}

const healthSacnturySlides = [
  {
    text: 'Luxurious rooms overlooking the Indian Ocean',
    img: '/images/home/healing-sanctury-home-slider-1.webp',
  },
  {
    text: 'Naturopathic cuisine designed for your specific condition',
    img: '/images/home/healing-sanctury-home-slider-2.webp',
  },
  {
    text: 'Hyper-personalised care with dedicated medical team',
    img: '/images/home/healing-sanctury-home-slider-3.webp',
  },
]
const healthSacnturySlides2 = [
  {
    text: `100,000 square feet healing hub 
    with state-of-the-art facilities`,
    img: '/images/home/healing-sanctury-home-slider-4.webp',
  },
  {
    text: `An oceanfront sanctuary on 28 acres, 
    where healing begins the moment you arrive`,
    img: '/images/home/healing-sanctury-home-slider-5.webp',
  },
  {
    text: `Private beach access for
ocean therapy and reflection`,
    img: '/images/home/healing-sanctury-home-slider-6.webp',
  },
]

// Memoized slide image component to prevent reloading
const SlideImage = memo(
  ({
    src,
    alt,
    index,
    activeIndex,
    priority,
    loading,
    onLoad,
  }: {
    src: string
    alt: string
    index: number
    activeIndex: number
    priority: boolean
    loading: 'eager' | 'lazy'
    onLoad?: () => void
  }) => {
    const isActive = index === activeIndex
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={loading}
        onLoad={onLoad}
        className={`object-cover absolute top-0 left-0 transition-opacity duration-700 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
    )
  },
  (prevProps, nextProps) => {
    // Don't re-render if:
    // 1. src, index, priority, loading haven't changed AND
    // 2. The active state of this image hasn't changed
    const prevIsActive = prevProps.index === prevProps.activeIndex
    const nextIsActive = nextProps.index === nextProps.activeIndex

    return (
      prevProps.src === nextProps.src &&
      prevProps.index === nextProps.index &&
      prevProps.priority === nextProps.priority &&
      prevProps.loading === nextProps.loading &&
      prevIsActive === nextIsActive
    )
  }
)
SlideImage.displayName = 'SlideImage'

const koshasMobile = [
  {
    title: 'Physical body: Annamaya',
    description: 'Personalised nutrition, hydrotherapy, fomentations, barefoot walking.',
  },
  {
    title: 'Energy body: Pranamaya',
    description: 'Breathwork, acupuncture, energy-balancing.',
  },
  {
    title: 'Mental body: Manomaya',
    description: 'Meditation, silence, therapeutic dialogue.',
  },
  {
    title: 'Wisdom body: Vijnanamaya',
    description: 'Nature walks, doctor consults, health talks.',
  },
  {
    title: 'Bliss body: Anandamaya',
    description: 'Stillness, joy, rest, ritual.',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeIndex2, setActiveIndex2] = useState(0)
  const [paused2, setPaused2] = useState(false)
  const [paused, setPaused] = useState(false)
  const [playingMobileVideo1, setPlayingMobileVideo1] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 3))
  const [rooms, setRooms] = useState(1)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [isRoomPickerOpen, setIsRoomPickerOpen] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('Medical-programs')

  // Track loaded images to prevent reloading
  const loadedImagesRef = useRef(new Set<string>())

  // Video refs for iOS autoplay
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const heroVideoRef2 = useRef<HTMLVideoElement>(null)

  const handleChange = (type: 'rooms' | 'adults' | 'children', value: number) => {
    if (type === 'rooms') setRooms(value)
    if (type === 'adults') setAdults(value)
    if (type === 'children') setChildren(value)
  }
  // auto-rotate every 4s unless paused by manual click
  const deviceType = useDeviceType()

  useEffect(() => {
    if (deviceType === 'mobile') return

    if (paused) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % healthSacnturySlides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [paused, deviceType])

  useEffect(() => {
    if (deviceType === 'mobile') return
    if (paused2) return
    const interval = setInterval(() => {
      setActiveIndex2((prev) => (prev + 1) % healthSacnturySlides2.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [paused2, deviceType])

  // Handle iOS video autoplay
  useEffect(() => {
    const video = heroVideoRef.current
    if (video) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay was prevented, but that's okay
          console.log('Video autoplay prevented:', error)
        })
      }
    }
  }, [])

  useEffect(() => {
    const video = heroVideoRef2.current
    if (video) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay was prevented, but that's okay
          console.log('Video autoplay prevented:', error)
        })
      }
    }
  }, [])

  const handleClick = (index: number) => {
    setActiveIndex(index)
    setPaused(true)
    // resume auto after 6s
    setTimeout(() => setPaused(false), 6000)
  }

  const handleClick2 = (index: number) => {
    setActiveIndex2(index)
    setPaused2(true)
    // resume auto after 6s
    setTimeout(() => setPaused2(false), 6000)
  }

  const goToPemaMaps = () => {
    window.open(
      'https://www.google.com/maps/dir//Pema+Wellness+Resort,+Sagarnagar,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh+530045'
    )
  }

  const handleSubmit = () => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      rooms: rooms.toString(),
      children: children.toString(),
      adults: adults.toString(),
    })

    router.push(`/booking?${params.toString()}#availability`)
  }
  return (
    <div className='flex-1 relative bg-softSand md:bg-white'>
      <h1 className='sr-only'>Restore Your Energy at the Best Wellness Retreats in India</h1>
      {/* hero section */}
      <div
        className={`lg:bg-[url('/home-hero-bg-image.png')] bg-center bg-cover w-full h-full 
          bg-no-repeat text-softSand lg:mt-[-78px] relative hidden lg:block`}
      >
        {/* Mobile video background - replaces hero-bg-mobile.webp */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className='absolute inset-0 w-full h-full object-cover'
          style={{ zIndex: 0 }}
        >
          <source src='/images/home/pema-brand-film-horizontal.mp4' type='video/mp4' />
        </video>
        <div className=' pt-30 lg:pb-20 pb-0 relative z-10'>
          <div className='max-w-[1360px] m-auto md:text-left text-center  text-softSand md:pt-40 md:ml-[15%]  relative'>
            <div className='text-base md:text-xl'>Welcome to the</div>
            <div className='lg:text-[64px] text-[32px] leading-[0.75] font-ivyOra font-thin'>
              UNIVERSE{' '}
              <span className='italic xs:mr-2 sm:mr-2 md:mr-2 mr-2 2xl:mr-4 xl:mr-4'>of </span>{' '}
              <span></span>
              YOU
            </div>
            {/* {deviceType === 'laptop' && ( */}
            <Link href={ROUTES.contactUs}>
              <PrimaryButton className='hidden lg:flex rotate-270 fixed right-[-52px] z-11 top-1/2'>
                Get in touch
              </PrimaryButton>
            </Link>
            {/* )} */}
          </div>
          <div className='mt-13 xl:ml-[40%] lg:ml-[30%] md:ml-[15%] hidden md:block'>
            <div className='font-ivyOra text-softSand text-2xl'>
              Two journeys. One sanctuary. Infinite you.
            </div>
            <div className='flex flex-row gap-13 mt-4'>
              <div className='flex flex-col'>
                <Link
                  href={ROUTES.medicalHealthProgram}
                  className='font-crimson text-softSand text-xl flex flex-row items-center gap-2 border-b border-softSand'
                >
                  Explore your healing universe <MoveRight />
                </Link>
                <div className='font-crimson text-softSand text-xl'>Medical reversal & healing</div>
              </div>
              <div className='flex flex-col'>
                <Link
                  href={ROUTES.wellnessProgram}
                  className='font-crimson text-softSand text-xl flex flex-row items-center gap-2 border-b border-softSand w-fit'
                >
                  Explore your wellness universe <MoveRight />
                </Link>
                <div className='font-crimson text-softSand text-xl'>
                  An exclusive sanctuary for rejuvenation
                </div>
              </div>
            </div>
          </div>

          {/* availability check section */}
          <div className='bg-[#32333312] backdrop-blur-[24px] w-full h-full md:mt-7 mt-20 lg:hidden block'>
            <div className='hidden lg:block '>
              <div className='flex-row flex items-baseline justify-center gap-8 px-6'>
                <div className='py-6 max-w-[550px] w-full'>
                  <div className='text-2xl text-softSand ml-[10px]'>Dates</div>
                  <div
                    onClick={() => setIsOpen(true)}
                    className='border text-softSand font-crimson text-xl border-softSand h-[66px] w-full mt-2 flex flex-row justify-between items-center py-[20px] px-8'
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
                  <div className='flex flex-row pb-8 pt-6'>
                    <div className='text-xl font-crimson mr-2'>Healing feels better together.</div>
                    <Link
                      href={zohoForms.familyInquiry}
                      className='font-crimson text-xl flex flex-row items-center gap-2 border-b border-softSand'
                    >
                      Bring your family to Pema <MoveRight />
                    </Link>
                  </div>
                </div>
                <div className='py-6 max-w-[550px] w-full'>
                  <div className='text-2xl text-softSand ml-[10px]'>Rooms & guests</div>
                  <div
                    onClick={() => setIsRoomPickerOpen(true)}
                    className='border text-softSand font-crimson text-xl border-softSand h-[66px] w-full mt-2 flex flex-row justify-between items-center py-[20px] px-8'
                  >
                    <div>
                      {rooms} Room & {adults} Adult{' '}
                    </div>
                    <ChevronDown />
                  </div>
                </div>
                <div className='self-center'>
                  <PrimaryButton
                    // onClick={handleSubmit}
                    className='mb-8 whitespace-nowrap'
                  >
                    Check availability
                  </PrimaryButton>
                </div>
              </div>
            </div>
            <div className='flex lg:hidden flex-col items-center justify-center pt-4'>
              <div className='flex flex-row items-center justify-center'>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Image
                    key={item}
                    src='/star-rating-icon.svg'
                    height={14}
                    width={14}
                    alt='Rating'
                  />
                ))}
              </div>
              <div className='text-softSand text-base pt-1'>Rated 4.9 by 2,000+ Guests </div>
            </div>
            <div className='lg:hidden grid grid-cols-3  w-full px-4 mt-[10px] pb-4'>
              <div className='flex flex-col items-center gap-2'>
                <Image
                  src='/images/home/award-symbol-white.png'
                  className='w-8 h-8'
                  height={32}
                  width={32}
                  alt='Award Icon'
                />
                <div className='text-softsand text-center text-[11px] leading-[110%]'>
                  Spa & Wellness <br /> Awards 2025
                </div>
              </div>
              <div className='flex flex-col items-center gap-2'>
                <Image
                  src='/images/home/award-symbol-white.png'
                  className='w-8 h-8'
                  height={32}
                  width={32}
                  alt='Award Icon'
                />
                <div className='text-softsand  text-center text-[11px] leading-[110%]'>
                  Best Naturopathy <br /> Retreat
                </div>
              </div>
              <div className='flex flex-col items-center gap-2'>
                <Image
                  src='/images/home/award-symbol-white.png'
                  className='w-8 h-8'
                  height={32}
                  width={32}
                  alt='Award Icon'
                />
                <div className='text-softsand text-[11px]  text-center leading-[110%]'>
                  Best Wellness <br /> Cuisine
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`lg:bg-[url('/home-hero-bg-image.png')] bg-center bg-cover w-full h-full 
          bg-no-repeat text-softSand lg:mt-[-78px] relative lg:hidden`}
      >
        {/* Mobile video background - replaces hero-bg-mobile.webp */}
        <video
          ref={heroVideoRef2}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline={true}
          preload='auto'
          className='absolute inset-0 w-full h-full object-cover'
          style={{ zIndex: 0 }}
          onLoadedData={(e) => {
            // Ensure play on iOS after video loads
            const video = e.currentTarget
            video.play().catch(() => {
              // Ignore autoplay errors
            })
          }}
        >
          <source src='/images/home/pema-brand-film-horizontal.mp4' type='video/mp4' />
        </video>
        <div className='max-w-[1360px] m-auto md:text-left text-center  text-softSand py-20 md:pt-40 md:ml-[15%]  relative'>
          <div className='text-base md:text-xl'>Welcome to the</div>
          <div className='lg:text-[64px] text-[32px] leading-[0.75] font-ivyOra font-thin'>
            UNIVERSE{' '}
            <span className='italic xs:mr-2 sm:mr-2 md:mr-2 mr-2 2xl:mr-4 xl:mr-4'>of </span>{' '}
            <span></span>
            YOU
          </div>
        </div>
      </div>
      <div className='lg:hidden bg-[#322a2a] backdrop-blur-[24px]'>
        <div className='  w-full h-full md:mt-7  block'>
          <div className='flex lg:hidden flex-col items-center justify-center pt-4'>
            <div className='flex flex-row items-center justify-center'>
              {[1, 2, 3, 4, 5].map((item) => (
                <Image key={item} src='/star-rating-icon.svg' height={14} width={14} alt='Rating' />
              ))}
            </div>
            <div className='text-softSand text-base pt-1'>Rated 4.9 by 2,000+ Guests </div>
          </div>
        </div>
        <div className='lg:hidden grid grid-cols-3  w-full px-4 mt-[10px] pb-4'>
          <div className='flex flex-col items-center gap-2'>
            <Image
              src='/images/home/award-symbol-white.png'
              className='w-8 h-8'
              height={32}
              width={32}
              alt='Award Icon'
            />
            <div className='text-white text-center text-[11px] leading-[110%]'>
              Spa & Wellness <br /> Awards 2025
            </div>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <Image
              src='/images/home/award-symbol-white.png'
              className='w-8 h-8'
              height={32}
              width={32}
              alt='Award Icon'
            />
            <div className='text-white  text-center text-[11px] leading-[110%]'>
              Best Naturopathy <br /> Retreat
            </div>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <Image
              src='/images/home/award-symbol-white.png'
              className='w-8 h-8'
              height={32}
              width={32}
              alt='Award Icon'
            />
            <div className='text-white text-[11px]  text-center leading-[110%]'>
              Best Wellness <br /> Cuisine
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
      {/* rating section web*/}
      <div className='lg:py-8 lg:px-10 lg:flex hidden flex-row items-center justify-between max-w-[1360px] m-auto'>
        <div className='hidden lg:block md:basis-[50%]'>
          <div className='hidden lg:flex flex-row items-center'>
            {[1, 2, 3, 4, 5].map((item) => (
              <Image key={item} src='/star-rating-icon.svg' height={20} width={20} alt='Rating' />
            ))}
          </div>
          <div className='text-pemaBlue text-xl pt-2'>Rated 4.9 by 2,000+ Guests </div>
          <div className='text-slateGray text-xl my-3'>
            Medical protocols backed by clinical results{' '}
          </div>
          <div className='text-slateGray text-xl'>
            Luxury wellness backed by ritual and science{' '}
          </div>
        </div>

        {/* < > */}
        <Carousel
          responsive={responsive}
          arrows={false}
          className='flex flex-row items-center gap-4 overflow-scroll w-full py-4 px-4'
        >
          <div className='flex md:justify-center flex-row md:flex-col items-center gap-2'>
            <Image
              src='/award-symbol.svg'
              className='w-full md:max-w-[78px] max-w-[52px]'
              height={78}
              width={78}
              alt='Award Icon'
            />
            <div className='text-slateGray text-lg md:text-xl mt-2 leading-5'>
              Spa & Wellness Awards 2025
            </div>
          </div>
          <div className='flex md:justify-center flex-row md:flex-col items-center gap-2'>
            <Image
              src='/award-symbol.svg'
              className='w-full md:max-w-[78px] max-w-[52px]'
              height={78}
              width={78}
              alt='Award Icon'
            />
            <div className='text-slateGray text-lg md:text-xl mt-2 leading-5'>
              Best Naturopathy Retreat
            </div>
          </div>
          <div className='flex md:justify-center flex-row md:flex-col items-center gap-2'>
            <Image
              src='/award-symbol.svg'
              className='w-full md:max-w-[78px] max-w-[52px]'
              height={78}
              width={78}
              alt='Award Icon'
            />
            <div className='text-slateGray text-lg md:text-xl mt-2 leading-5 mr-4'>
              Best Wellness Cuisine
            </div>
          </div>
        </Carousel>
        {/* </> */}
      </div>

      {/* two journeys section mobile */}
      <div id='programs' className='mt-8 max-w-[1360px] m-auto block md:hidden scroll-m-20'>
        <div className='px-4 text-[28px]  text-pemaBlue font-ivyOra  text-center leading-[120%]'>
          <span className='italic'>Two journeys. One sanctuary.</span> <br />
          Infinite you.{' '}
        </div>
        <nav
          className=' flex flex-row justify-center mt-5  select-none  z-2'
          role='tablist'
          aria-label='Swiper tabs'
        >
          <button
            role='tab'
            onClick={() => {
              setCurrentTrack('Medical-programs')
            }}
            className={`px-3 py-2 cursor-pointer border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
              currentTrack === 'Medical-programs'
                ? 'text-slateGray border-pemaBlue'
                : 'border-transparent text-slateGray '
            }`}
          >
            Medical programs
          </button>
          <button
            role='tab'
            onClick={() => {
              setCurrentTrack('Wellness-programs')
            }}
            className={`px-3 py-2 cursor-pointer border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
              currentTrack === 'Wellness-programs'
                ? 'text-slateGray border-pemaBlue'
                : 'border-transparent text-slateGray '
            }`}
          >
            Wellness programs
          </button>
        </nav>

        {currentTrack === 'Medical-programs' ? (
          <div className='flex flex-col justify-around mx-4'>
            <div>
              <div className='text-base leading-[110%] text-center text-slateGray my-3'>
                Personalised, doctor-led naturopathy programs designed for the management and
                reversal of chronic conditions.
              </div>
              <div className='relative  w-full h-[350px] overflow-hidden '>
                <ImageWithShimmer
                  priority
                  preload={true}
                  src={'/images/home/journey-1-home-web.webp'}
                  alt={'wellbeing-banner-home'}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
            </div>
            <div>
              <Link
                href={ROUTES.medicalHealthProgram}
                className='my-[18px] font-crimson mx-auto text-lg md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                Begin the path to healing <MoveRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className='flex flex-col justify-around mx-4'>
            <div>
              <div className='text-base leading-[110%] text-center text-slateGray my-3'>
                Personalised naturopathy-based retreats focused on prevention, restoration, and
                long-term vitality from sleep and stress to hormonal balance.
              </div>
              <div className='relative  w-full h-[350px] overflow-hidden '>
                <ImageWithShimmer
                  src={'/images/home/journey-2-home-web.webp'}
                  alt={'wellbeing-banner-home'}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
            </div>
            <div>
              <Link
                href={ROUTES.wellnessProgram}
                className='my-[18px] font-crimson mx-auto text-lg md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                Begin the path to wellness <MoveRight />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* lcoation image  */}
      <div className='relative w-full h-[360px] md:h-[550px] '>
        <div
          onClick={goToPemaMaps}
          className='cursor-pointer flex flex-row items-center gap-2 text-base md:text-xl text-softSand
           md:text-pemaBlue border-b-2 border-softSand md:border-pemaBlue font-crimson absolute top-7 left-0 right-0 w-fit m-auto md:m-0 md:left-10 z-11'
        >
          <Image
            src={'/slategray-pin-icon.svg'}
            alt='location'
            className='h-5 w-5 md:inline hidden'
            height={20}
            width={20}
          />
          <Image
            src={'/softsand-pin-icon.svg'}
            alt='location'
            className='h-4 w-4 md:hidden inline'
            height={20}
            width={20}
          />
          Healing hills, Visakhapatnam, India
        </div>
        <Image
          src='/pema-location-image-home.webp'
          alt='Pema Location'
          fill
          className='object-cover p-4 md:p-0'
        />
      </div>

      {/* Your healing sanctuary web section */}
      <div className='mt-15 max-w-[1360px] mx-auto hidden md:block'>
        <div className='text-[40px] text-pemaBlue font-ivyOra py-2 text-center leading-none'>
          Your healing sanctuary
        </div>
        <div className='text-xl text-slateGray font-crimson text-center'>
          Everything around you here is intentionally designed to be a part of your healing journey.
        </div>
        <div className='p-10'>
          <div className='text-xl font-crimson grid grid-cols-3 gap-2 mb-3'>
            {healthSacnturySlides.map((slide, i) => (
              <button
                key={i}
                onClick={() => handleClick(i)}
                className={`pb-4 pl-2 border-b transition-colors duration-500 text-left w-full ${
                  i === activeIndex
                    ? 'border-pemaBlue text-pemaBlue'
                    : 'border-transparent text-slateGray hover:text-pemaBlue'
                }`}
              >
                <div className='lg:w-[70%] w-[90%]'>{slide.text}</div>
              </button>
            ))}
          </div>
          <div className='relative w-full h-[540px] overflow-hidden'>
            {healthSacnturySlides.map((slide, i) => (
              <SlideImage
                key={`${slide.img}-${i}`}
                src={slide.img}
                alt={slide.text}
                index={i}
                activeIndex={activeIndex}
                priority={i === 0}
                loading={i <= 1 ? 'eager' : 'lazy'}
                onLoad={() => loadedImagesRef.current?.add(slide.img)}
              />
            ))}
          </div>
        </div>
        <div className='p-10'>
          <div className='text-xl font-crimson grid grid-cols-3 gap-2 mb-3'>
            {healthSacnturySlides2.map((slide, i) => (
              <button
                key={i}
                onClick={() => handleClick2(i)}
                className={`pb-4 pl-2 border-b transition-colors duration-500 text-left w-full ${
                  i === activeIndex2
                    ? 'border-pemaBlue text-pemaBlue'
                    : 'border-transparent text-slateGray hover:text-pemaBlue'
                }`}
              >
                <div className='w-[90%]'>{slide.text}</div>
              </button>
            ))}
          </div>
          <div className='relative w-full h-[540px] overflow-hidden'>
            {healthSacnturySlides2.map((slide, i) => (
              <SlideImage
                key={`${slide.img}-${i}`}
                src={slide.img}
                alt={slide.text}
                index={i}
                activeIndex={activeIndex2}
                priority={i === 0}
                loading={i <= 1 ? 'eager' : 'lazy'}
                onLoad={() => loadedImagesRef.current?.add(slide.img)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Your healing sanctuary mobile section*/}
      <MobileSlides />

      {/* comparison table web */}
      <div className='md:pt-20 pt-10 max-w-[1280px] m-auto md:bg-transparent bg-softSand'>
        <div className='hidden md:block'>
          <div className='px-4 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
            Why Pema{' '}
          </div>
          <div className='px-4 text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6 md:mb-10'>
            Pema is the only place that delivers all of it clinically, emotionally,
            energetically.{' '}
          </div>
          <ComparisonTable />
        </div>
        <div className='block md:hidden bg-softSand'>
          <div className='px-4 text-[28px]  text-pemaBlue font-ivyOra py-2 text-center leading-none'>
            How Pema <span className='italic'>differs</span>
          </div>
          <div className='px-4 text-lg md:text-xl text-slateGray font-crimson text-center mb-3'>
            Pema is the only place that delivers all of it clinically, emotionally,
            energetically.{' '}
          </div>
          <ComparisonTableMobile />
        </div>
      </div>

      <div className='px-4 md:hidden block pt-10 bg-softSand pb-10'>
        <div className='flex flex-col justify-start mb-6'>
          <div>
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra text-center'>
              A lighter way to <span className='italic'>experience Pema.</span>{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2 text-center'>
              Start with 3 days of gentle therapies, healing cuisine, and restorative calm. Come for
              the pause, stay for the feeling.
            </div>
          </div>
          <div>
            <Link
              href={'/pema-lite'}
              className='mt-3  font-crimson text-base text-pemaBlue flex flex-row items-center justify-center mx-auto gap-2 border-b border-pemaBlue w-fit'
            >
              Start with Pema lite <MoveRight />
            </Link>
          </div>
        </div>

        {/* Right column (60%) */}
        <div className='relative w-full h-[350] overflow-hidden'>
          <Image
            src='/images/home/pema-lite-home-web.webp'
            alt='wellbeing-banner-home'
            fill
            className='object-cover absolute top-0 left-0'
          />
        </div>
      </div>

      {/* weelbeing section web */}
      <div className='mt-20 max-w-[1360px] m-auto md:block hidden'>
        <div className='px-4 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          Ready to embrace limitlessness and remember true wellbeing?{' '}
        </div>
        <div className='px-4 text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6'>
          Step into a future where you can do more, feel more, and become the version of yourself
          you truly deserve.
        </div>
        <div className='md:hidden h-100 justify-center items-center flex mb-6'>
          <ReactPlayer
            preload='true'
            controls
            width='100%'
            height='100%'
            light='/images/home/home-mobile-video-1-thumbnail.png'
            src='https://www.youtube.com/watch?v=PdcJxXKf7Og'
            // height={410}
            // width={'100%'}
            className='w-[100vw] h-75 aspect-video'
            playing={playingMobileVideo1}
            onPause={() => setPlayingMobileVideo1(false)}
            onPlay={() => setPlayingMobileVideo1(true)}
            muted
            onClickPreview={() => setPlayingMobileVideo1(true)}
            playIcon={
              <Image
                width={80}
                height={80}
                className='h-20 w-20 aspect-square'
                src={'/play-button.svg'}
                alt='play button'
              />
            }
          />
        </div>
        <Link
          href={'#contact-us'}
          className='font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          Book now
          <MoveRight />
        </Link>
        <div className='relative mt-6 w-full h-[374px] overflow-hidden hidden md:block'>
          <Image
            src={'/images/home/wellbeing-banner-home.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
      </div>

      {/* two journeys section web */}
      <div id='programs' className='mt-20 max-w-[1360px] m-auto hidden md:block scroll-m-30 '>
        <div className='px-4 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          Two journeys. One sanctuary. Infinite you.{' '}
        </div>
        <div className='px-4 text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6'>
          Whether you seek chronic healing or deep renewal, begin where science meets serenity. you
          truly deserve.
        </div>
        <div className='lg:grid grid-cols-2 grid-rows-1 hidden'>
          <div className='relative mt-6 w-full h-[750px] overflow-hidden hidden lg:block'>
            <Image
              src={'/images/home/journey-1-home-web.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
          <div className='flex flex-col justify-around mx-8'>
            <div>
              <div className='text-[32px] text-slateGray font-ivyOra'>
                1. Begin your healing universe
              </div>
              <div className='text-xl text-slateGray mt-3'>
                Expert-led care with proven protocols to reverse chronic conditions
              </div>
            </div>
            <div>
              <div className='text-xl text-slateGray'>
                One of the few places in the world where chronic conditions get reversed naturally.
                Clinically proven. Doctor-led. Outcome-tracked.
              </div>
              <Link
                href={ROUTES.medicalHealthProgram}
                className='mt-8 font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                Begin the path to healing <MoveRight />
              </Link>
            </div>
          </div>
        </div>
        <div className='lg:grid grid-cols-2 grid-rows-1 mt-9 hidden'>
          <div className='flex flex-col justify-around ml-16 mr-8'>
            <div>
              <div className='text-[32px] text-slateGray font-ivyOra'>
                2. Explore your wellness universe{' '}
              </div>
              <div className='text-xl text-slateGray mt-3'>
                Step into luxury and return to yourself{' '}
              </div>
            </div>
            <div>
              <div className='text-xl text-slateGray'>
                Luxury wellness designed for emotional clarity, physical reset, and deep personal
                renewal. Silent mornings. Ocean rituals. Healing cuisine that honours both science
                and palate.
              </div>
              <Link
                href={ROUTES.wellnessProgram}
                className='mt-8 font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                Start your wellness reset <MoveRight />
              </Link>
            </div>
          </div>
          <div className='relative w-full h-[750px] overflow-hidden hidden lg:block'>
            <Image
              src={'/images/home/journey-2-home-web.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
        </div>
      </div>

      {/* leaders section */}
      <div className='md:pt-[50px] pt-6 max-w-[1360px] m-auto md:bg-transparent bg-softSand'>
        <div className='md:block hidden px-4 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          Global medical leaders{' '}
        </div>
        <div className='md:hidden block px-4 text-[28px] text-pemaBlue font-ivyOra py-2 text-center leading-none'>
          Your circle of <span className='italic'>healing experts </span>
        </div>
        <div className='md:block hidden px-4 text-lg md:text-xl text-slateGray font-crimson text-left md:text-center my-2'>
          Your circle of healing experts truly deserve.
        </div>
        <div className='md:block hidden px-4 text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6'>
          {`India's leading wellness experts delivering measurable health outcomes 
         through clinically proven naturopathic medicine.`}
        </div>
        <div className='block md:hidden px-4 text-base text-slateGray font-crimson text-center mt-2 leading-[110%]'>
          {`India's leading wellness experts delivering measurable health outcomes through clinically
          proven naturopathic medicine.`}
        </div>
        <Link
          href={`${ROUTES.ourApproach}#experts`}
          className='my-4 md:hidden font-crimson text-lg text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          Meet our experts <MoveRight />
        </Link>
        <DoctorsCarouselSwiper />
        <Link
          href={`${ROUTES.ourApproach}#experts`}
          className='my-6 font-crimson text-lg md:text-xl text-pemaBlue hidden md:flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          Meet our experts <MoveRight />
        </Link>
      </div>

      {/*  */}
      <div className='lg:grid grid-cols-[35%_65%] grid-rows-1 mt-9 hidden max-w-[1360px] m-auto'>
        {/* Left column (40%) */}
        <div className='flex flex-col justify-start ml-5 mr-5'>
          <div className='mt-9'>
            <div className='text-[40px] text-pemaBlue font-ivyOra'>
              Luxury reset, designed to fit your Rhythm{' '}
            </div>
            <div className='text-xl text-slateGray mt-2'>
              Designed for modern lives, Pema Lite offers the freedom to pause without the
              commitment of a long retreat. Stay a minimum of three nights or as long as you choose.
              Ocean-front suites, curated therapies, and cuisine crafted for restoration. No rigid
              program. Just the space to rest, recharge, and breathe.{' '}
            </div>
            <div className='text-xl text-slateGray mt-2'>
              Whether you’re flying in from Dubai, London, or New York or simply two hours away Pema
              Lite is your first step into the Pema way of living.{' '}
            </div>
            <div className='text-slateGray font-ivyOra text-2xl mt-6'>
              ‘In just a few days, I felt lighter, clearer, and completely reset.’
            </div>
            <div className='text-slateGray text-xl'>Naomie Harris, Hollywood actor</div>
          </div>
          <div>
            <Link
              href={'/pema-lite'}
              className='mt-8 font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Discover Pema Lite <MoveRight />
            </Link>
          </div>
        </div>

        {/* Right column (60%) */}
        <div className='relative w-full h-[700px] overflow-hidden hidden lg:block'>
          <Image
            src='/images/home/pema-lite-home-web.webp'
            alt='wellbeing-banner-home'
            fill
            className='object-cover absolute top-0 left-0'
          />
        </div>
      </div>
      {/* hospitality section web */}
      <div className='mt-20 max-w-[1360px] m-auto hidden md:block'>
        <div className='px-4 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          ‘The precision of Europe and the hospitality of Asia’{' '}
        </div>

        <div className='font-crimson mt-6 text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'>
          View exclusive availability <MoveRight />
        </div>
        <div className='relative mt-6 w-full h-[580px] overflow-hidden '>
          <Image
            src={'/images/home/home-banner-web-2.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
      </div>

      {/* koshas section web */}
      <div className='mt-20 max-w-[1360px] m-auto hidden md:block'>
        <div className='px-4 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          The pulse of Pema: The 5 Koshas{' '}
        </div>
        <div className='px-4 text-lg  text-slateGray font-crimson text-center mb-6'>
          Everything we do at Pema is rooted in the 5 koshas an ancient yogic way of understanding
          the human experience as five layers.{' '}
        </div>

        <Koshas />
        <h3 className='text-2xl font-ivyOra text-center'>
          True wellness begins when all five layers begin to speak to one another.
        </h3>
        <Link
          href={'/our-approach'}
          className='font-crimson mt-10 text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          Our approach <MoveRight />
        </Link>
      </div>

      {/* koshas section mobile */}
      <div
        className={`mt-10 pt-6  bg-[url('/bg-koshas-mobile.webp')] bg-center bg-cover max-w-[1360px] m-auto block md:hidden px-4`}
      >
        <div className=' text-[28px] text-pemaBlue font-ivyOra py-2 text-center leading-none'>
          The 5 Koshas{' '}
        </div>
        <div className=' text-[28px] text-pemaBlue font-ivyOra text-center italic leading-none'>
          The pulse of Pema
        </div>
        <div className='text-center text-lg text-slateGray font-crimson mt-4 mb-2 leading-none'>
          Everything we do at Pema is rooted in the 5 koshas an ancient yogic way of understanding
          the human experience as five layers.
        </div>
        <div className='relative md:block hidden max-w-[360px] mt-6 w-full max-h-full h-[260px] overflow-hidden m-auto'>
          <Image
            src={'/kosha-mobile.svg'}
            alt={'koshas-mobile-home'}
            fill
            className={`object-cover absolute top-0 left-0 m-auto`}
          />
        </div>

        <Link
          href={'/our-approach'}
          className='font-crimson mx-auto mt-3 text-lg text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
        >
          Our approach <MoveRight />
        </Link>

        <div className='py-4'>
          <Image
            src={'/5-koshas-mobile.png'}
            alt='5 koshas'
            className='w-full max-h-[350px] aspect-auto object-contain'
            height={350}
            width={500}
          />
        </div>
      </div>
      {/* founders note web  */}
      <div className='mt-[50px] max-w-[1360px] m-auto px-4 md:px-0 hidden md:block'>
        <div className='text-[32px] block md:hidden text-pemaBlue font-ivyOra'>Founder’s note </div>

        <div className=' lg:grid grid-cols-2 grid-rows-1'>
          <div className='relative mt-6 w-full max-h-full h-[350px] lg:h-[750px] overflow-hidden'>
            <Image
              src={'/founder-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
            <div className='bg-[#32333380] font-ivyOra text-xl md:text-2xl text-center text-softSand flex justify-center items-center absolute bottom-0 w-full h-[56px] md:h-[79px] backdrop-blur-[15px]'>
              Founder Mrs. Meena Mulpuri{' '}
            </div>
          </div>
          <div className='flex flex-col justify-around md:mx-8'>
            <div className='my-6 md:mb-0'>
              <div className='text-[40px] text-pemaBlue hidden md:block font-ivyOra'>
                Founder’s note{' '}
              </div>
              <div className='text-xl md:text-2xl text-slateGray font-ivyOra mt-2'>
                Pema wasn’t created to follow trends.{' '}
              </div>
              <div className='text-xl md:text-2xl text-slateGray font-ivyOra'>
                It was built to raise the standard for care.{' '}
              </div>
            </div>

            <div className='text-lg md:text-xl text-slateGray leading-none'>
              For our founder, Mrs. Meena Mulpuri, wellness was always personal. After years of
              seeing surface-level solutions passed off as healing, she envisioned something quieter
              and far more lasting. A space where people could feel held, without ever feeling
              managed. Her touch is in everything: how guests are received, how programs are
              crafted, how silence here feels generous, not empty.
              <br /> <br />
              Still family-led, Pema reflects her belief that care, when done right, becomes an
              experience you never have to second-guess.
            </div>
          </div>
        </div>
      </div>
      {/* founders note  mobile */}
      <div className='mt-[50px] max-w-[1360px] m-auto px-4 md:px-0 md:hidden block text-center'>
        <div className=''>
          <div className='flex flex-col justify-around md:mx-8'>
            <div className='text-[40px] text-pemaBlue italic font-ivyOra'>Founder’s note </div>

            <div className='text-lg md:text-xl text-slateGray leading-[110%] mt-2'>
              For our founder, Mrs. Meena Mulpuri, wellness was always personal. After years of
              seeing surface-level solutions passed off as healing, she envisioned something quieter
              and far more lasting. A space where people could feel held, without ever feeling
              managed. Her touch is in everything: how guests are received, how programs are
              crafted, how silence here feels generous, not empty.
              <br /> <br />
              Still family-led, Pema reflects her belief that care, when done right, becomes an
              experience you never have to second-guess.
            </div>
          </div>
          <div className='relative mt-3 w-full max-h-full h-[420px] overflow-hidden'>
            <div
              className='top-[-2px] z-2 h-[200px] absolute w-full bg-[linear-gradient(to_bottom,#F4EFEB_36%,transparent_100%)] 
            flex items-start mx-auto right-0 left-0'
            >
              <div className='text-xl text-slateGray font-ivyOra mt-2 mx-auto'>
                Pema wasn’t created to follow trends. <br />
                It was built to raise the standard for care.{' '}
              </div>
            </div>
            <Image
              src={'/founder-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover object-center absolute top-0 left-0 `}
            />
          </div>
        </div>
      </div>

      {/* testimonials web */}
      <div className='mt-20 max-w-[1360px] m-auto md:block hidden'>
        <TestimonialCard />
      </div>
      {/* testimonials  mobile */}

      <div className='mt-10 max-w-[1360px] m-auto block md:hidden '>
        <div className='text-[28px] px-4 text-pemaBlue font-ivyOra  text-center leading-[120%]'>
          Stories of <span className='italic'>renewal and rejuvenation</span>
        </div>
        <TestimonialMobile />
        <div className='px-4'>
          <PrimaryButton onClick={() => router.push('#contact-us')} className='w-full mt-3'>
            Book now
          </PrimaryButton>
        </div>
      </div>

      {/* video section web */}
      <div className='mt-20 max-w-[1360px] m-auto hidden md:block'>
        <div className='text-[40px] text-pemaBlue font-ivyOra px-4 text-center mb-9'>
          Preview the Pema experience{' '}
        </div>
        <div className='hidden md:flex h-[600px] justify-center items-center mb-6'>
          <ReactPlayer
            preload='true'
            controls
            width='100%'
            height='100%'
            light='/images/home/home-web-video-1-thumbnail.webp'
            src='https://www.youtube.com/watch?v=PdcJxXKf7Og'
            // height={410}
            // width={'100%'}
            className='w-[100vw] h-75 aspect-video'
            playing={playingMobileVideo1}
            muted
            onPause={() => setPlayingMobileVideo1(false)}
            onPlay={() => setPlayingMobileVideo1(true)}
            onClickPreview={() => setPlayingMobileVideo1(true)}
            playIcon={
              <Image
                width={80}
                height={80}
                className='h-20 w-20 aspect-square'
                src={'/play-button.svg'}
                alt='play button'
              />
            }
          />
        </div>
        <Link
          href={'#contact-us'}
          className='font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          Book now
          <MoveRight />
        </Link>
      </div>

      {/* Naturopathy section web */}
      <div className='mt-20 max-w-[1360px] m-auto px-4 md:block hidden'>
        <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          At the heart of it all is Naturopathy{' '}
        </div>
        <div
          className=' text-lg mt-2 md:text-xl leading-none text-slateGray font-crimson text-left md:text-center mb-6
        w-[60%] md:w-full'
        >
          Not just a system of medicine, but the foundation of Pema.
        </div>

        <div className='relative mt-6 w-full h-[552px] overflow-hidden hidden md:block'>
          <Image
            src={'/images/home/naturopathy-hero-image-web.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='relative mt-6 w-full h-[430px] overflow-hidden block md:hidden '>
          <Image
            src={'/images/home/naturopathy-hero-image-mobile.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div>
          <div className='mt-6 md:mt-20 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
            Why Naturopathic medicine?{' '}
          </div>
          <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6 md:w-[60%] w-full m-auto'>
            {` Unlike conventional medicine that treats symptoms, or wellness retreats that offer
            temporary relief, Pema's naturopathic approach`}{' '}
          </div>
          <NaturopathicSection />
          <Link
            href={'/the-sanctuary'}
            className='font-crimson w-fit text-pemaBlue text-lg md:text-xl flex flex-row items-center gap-2 border-b border-pemaBlue md:m-auto'
          >
            Know more about our methods
            <MoveRight className='text-pemaBlue' />
          </Link>
        </div>
      </div>

      {/* Naturopathy section  mobile */}
      <div className='mt-10 max-w-[1360px] m-auto px-4 block md:hidden'>
        <div className=' text-[28px]  text-pemaBlue font-ivyOra  text-center leading-[120%] m-auto'>
          <span className='italic'>At the heart of it all is</span> <br /> Naturopathy{' '}
        </div>
        <div
          className=' text-base mt-3 md:text-xl leading-none text-slateGray font-crimson text-center mb-6
        \'
        >
          Not just a system of medicine, but <br /> the foundation of Pema.
        </div>

        <div className='relative mt-6 w-full h-[552px] overflow-hidden hidden md:block'>
          <Image
            src={'/images/home/naturopathy-hero-image-web.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='relative mt-6 w-full h-[430px] overflow-hidden block md:hidden '>
          <Image
            src={'/images/home/naturopathy-hero-image-mobile.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div>
          <div className='mt-6 text-[28px]  text-pemaBlue font-ivyOra py-2 text-center leading-none'>
            <span className='italic'>Why</span> Naturopathic medicine?{' '}
          </div>
          <div className=' text-base text-slateGray font-crimson text-center leading-[110%] mt-2 mb-2  m-auto'>
            {` Unlike conventional medicine that treats symptoms, or wellness retreats that offer
            temporary relief, Pema's naturopathic approach`}{' '}
          </div>
          <NaturopathicSectionMobile />
          <Link
            href={'/the-sanctuary'}
            className='font-crimson w-fit mx-auto text-pemaBlue text-lg  flex flex-row items-center gap-2 border-b border-pemaBlue '
          >
            Know more about our methods
            <MoveRight className='text-pemaBlue' />
          </Link>
        </div>
      </div>

      {/* from to map lcoation section web+mobile */}
      <div id='maps' className='mt-10 md:mt-20 max-w-[1360px] m-auto scroll-m-[100px]'>
        <div className='hidden md:block text-[40px] text-pemaBlue font-ivyOra px-4 text-center mb-2'>
          Arrive unseen. Heal undisturbed.
          <br /> Privacy uncompromised.{' '}
        </div>{' '}
        <div className='block md:hidden text-[32px] text-pemaBlue font-ivyOra px-4 text-center mb-4 leading-[120%]'>
          Arrive unseen.
          <br /> <span className='italic'>Heal undisturbed.</span>
        </div>{' '}
        <div className='px-4  text-lg leading-[110%] md:leading-[1.1] md:text-xl text-slateGray font-crimson text-center mb-4 md:mb-6 md:w-[80%] w-full m-auto'>
          {` Our remote location atop a hill coupled with the proximity of Visakhapatnam's commercial
          and private airports offers anonymous access to anyone wishing to slip in and out under
          the radar. The privacy continues on site.`}
        </div>
        <div>
          <MapsSection />
        </div>
        <Link
          href={'#contact-us'}
          className='md:hidden mt-8 font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          Book now
          <MoveRight />
        </Link>
      </div>

      {/* whatsapp section */}
      <div className='mt-10 md:mt-20 max-w-[1360px] m-auto px-4'>
        <div className='text-[32px] md:block hidden leading-none md:text-[40px] text-pemaBlue font-ivyOra text-center mb-2 '>
          Your healing can start with one message.{' '}
        </div>{' '}
        <div className='text-[28px] block md:hidden leading-[120%]  text-pemaBlue font-ivyOra text-center mb-3 '>
          <span className='italic'> Your healing can start</span> <br />
          with one message.{' '}
        </div>{' '}
        <div className='text-lg md:text-xl md:mt-4 text-slateGray font-crimson text-center mb-6 md:w-[60%] w-full m-auto'>
          We always respond within 2 hours.
        </div>
        <div
          onClick={openWhatsApp}
          className='text-softSand cursor-pointer h-11 w-full md:w-fit md:h-[62px] text-lg md:text-xl bg-pemaBlue flex flex-row items-center gap-2 justify-center m-auto px-6'
        >
          {' '}
          <Image alt='Whatsapp Icon' src='/whatsapp-icon.svg' width={20} height={20} />
          Message us on WhatsApp
        </div>
      </div>

      {/* gift section */}
      <div className='mt-20 max-w-[1360px] m-auto px-4'>
        <GiftSection />
      </div>

      {/* consultation section */}
      <div className='mt-20 max-w-[1360px] m-auto px-4'>
        <div className='text-[32px] md:w-[50%] leading-[120%] md:leading-normal m-auto md:text-[40px] text-pemaBlue font-ivyOra text-center mb-2'>
          The universe of you is waiting.{' '}
          <span className='hidden md:inline'>
            <br />
          </span>{' '}
          <span className='italic md:hidden inline'>Begin your journey back to balance. </span>
          <span className=' hidden md:inline'>Begin your journey back to balance. </span>
        </div>{' '}
        <div className='text-lg md:text-xl text-slateGray font-crimson text-center mb-6 md:w-[60%] w-full m-auto'>
          Take the first step toward the universe within.{' '}
        </div>
        <div className=' hidden md:flex flex-col gap-6 md:gap-0 md:flex-row justify-between max-w-[420px] m-auto'>
          <Link
            href={'#programs'}
            className='font-crimson w-fit text-pemaBlue text-xl flex flex-row gap-2 border-b border-pemaBlue'
          >
            View program options <MoveRight className='text-pemaBlue' />
          </Link>
          <Link
            href={ROUTES.medicalHealthAssessment}
            className='cursor-pointer font-crimson w-fit text-pemaBlue text-xl flex flex-row  gap-2 border-b border-pemaBlue'
          >
            Take our health quiz <MoveRight className='text-pemaBlue' />
          </Link>
        </div>
        <div className='flex md:hidden text-center items-center flex-col gap-6  justify-between max-w-[420px] m-auto'>
          <Link
            href={'#contact-us'}
            className='font-crimson w-fit text-pemaBlue text-xl flex flex-row gap-2 border-b border-pemaBlue'
          >
            View availability <MoveRight className='text-pemaBlue' />
          </Link>
          <Link
            href={ROUTES.medicalHealthAssessment}
            className='cursor-pointer font-crimson w-fit text-pemaBlue text-xl flex flex-row  gap-2 border-b border-pemaBlue'
          >
            Or take our health quiz
            <MoveRight className='text-pemaBlue' />
          </Link>
        </div>
        <div className='flex justify-center mt-4 pb-[50px]'>
          <PrimaryButton className='max-w-[420px] w-full '>
            <Link href={zohoForms.bookConsultaion}> Book consultation</Link>
          </PrimaryButton>
        </div>
      </div>

      {/* whatsapp icon */}
      <WhatsappStickyButton />
    </div>
  )
}
