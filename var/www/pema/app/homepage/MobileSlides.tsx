'use client'
import { MoveRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { ROUTES } from '@/utils/utils'
import { useRef, useEffect } from 'react'
import ImageWithShimmer from '@/components/ImageWithShimmer'
import type { Swiper as SwiperType } from 'swiper'

const slides = [
  {
    title: 'Luxurious rooms \n overlooking the Indian Ocean',
    imgURL: '/images/home/healing-sanctury-home-mobile-slider-1.webp',

    ctaText: 'Discover the sanctuary',
    ctaLink: ROUTES.theSanctuary,
  },
  {
    title: 'Naturopathic cuisine\n designed for your specific condition',
    imgURL: '/images/home/our-approach-home-mobile-slider-1.webp',
    ctaText: 'Explore our philosophy',
    ctaLink: ROUTES.ourApproach,
  },
  {
    title: 'Hyper-personalised care\n with dedicated medical team',
    imgURL: '/images/home/medical-health-home-mobile-slider-1.webp',
    ctaText: 'Start your healing plan',
    ctaLink: ROUTES.medicalHealthProgram,
  },
  {
    title: '100,000 square feet healing hub\n with state-of-the-art facilities',
    imgURL: '/images/home/wellness-journey-home-mobile-slider-1.webp',
    ctaText: 'Explore the heart of wellness',
    ctaLink: ROUTES.wellnessProgram,
  },
  {
    title: 'An oceanfront sanctuary on 28 acres,\n where healing begins the moment you arrive',
    imgURL: '/images/home/slide-5.webp',
    ctaText: 'Discover the sanctuary',
    ctaLink: ROUTES.theSanctuary,
  },
  {
    title: 'Private beach access for\n ocean therapy and reflection',
    imgURL: '/images/home/visit-home-mobile-slider-1.webp',
    ctaText: 'Plan your stay by the sea',
    ctaLink: ROUTES.planYourVisit,
  },
]

export default function MobileSlides() {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      // Update navigation after component mounts
      swiperRef.current.navigation.init()
      swiperRef.current.navigation.update()
    }
  }, [])

  return (
    <div className='relative w-full block md:hidden'>
      <div className='px-4'>
        <div className='text-[28px] text-pemaBlue text-center font-ivyOra py-2 leading-none'>
          <span className='italic mr-2'>Your</span>
          healing sanctuary
        </div>
        <div className='text-lg text-slateGray font-crimson text-center leading-[110%]'>
          Everything around you here is intentionally designed to be a part of your healing journey.
        </div>
      </div>

      <div className='relative'>
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          loop={true}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            // Update navigation after Swiper is initialized
            setTimeout(() => {
              if (prevRef.current && nextRef.current) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current
                swiper.navigation.init()
                swiper.navigation.update()
              }
            }, 100)
          }}
        >
          {slides.map((item) => {
            return (
              <SwiperSlide key={item.title}>
                <div className='h-max'>
                  <div className={` border-b w-fit border-pemaBlue mx-4 my-4`}>
                    <div className='text-base text-pemaBlue font-ivyOra px-3 py-2 leading-[120%] whitespace-pre-line'>
                      {item.title}
                    </div>
                  </div>
                  <div className='w-full h-[500px] md:mx-4 relative'>
                    <ImageWithShimmer
                      key={item.title}
                      src={item.imgURL}
                      alt='item'
                      fill
                      className='object-cover'
                    />
                    <div className='bottom-[-2px] h-[174px] absolute w-full bg-[linear-gradient(to_top,#F4EFEB_36%,transparent_100%)] flex items-end'>
                      <Link
                        href={item.ctaLink}
                        className='font-crimson ml-8 mb-6 text-pemaBlue text-lg flex flex-row items-center gap-2 border-b border-pemaBlue w-fit mt-2'
                      >
                        {item.ctaText}
                        <MoveRight />
                      </Link>
                    </div>
                  </div>{' '}
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
        {/* Custom Arrows */}
        <button
          ref={prevRef}
          onClick={() => swiperRef.current?.slidePrev()}
          className='absolute left-2 top-[60%] -translate-y-1/2 bg-[#D9D9D9] rounded-full shadow h-6 w-6 z-10 flex justify-center items-center cursor-pointer hover:bg-[#C0C0C0] transition-colors'
          aria-label='Previous slide'
        >
          <ChevronLeft className='w-5 h-5 text-slateGray' />
        </button>

        <button
          ref={nextRef}
          onClick={() => swiperRef.current?.slideNext()}
          className='absolute right-2 top-[60%] -translate-y-1/2 bg-[#D9D9D9] rounded-full shadow h-6 w-6 z-10 flex justify-center items-center cursor-pointer hover:bg-[#C0C0C0] transition-colors'
          aria-label='Next slide'
        >
          <ChevronRight className='w-5 h-5 text-slateGray' />
        </button>
      </div>
    </div>
  )
}
