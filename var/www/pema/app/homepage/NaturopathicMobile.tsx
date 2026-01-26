import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { useSwiperAutoplayOnView } from '@/lib/useSwiperOnAutoPlay'
import { SwiperAutoplayWrapper } from '@/components/SwiperWrapper'
import ImageWithShimmer from '@/components/ImageWithShimmer'

export default function NaturopathicSectionMobile() {
  const items = [
    {
      img: '/images/home/naturopathic-web-slide-1.webp',
      icon: '/lotus-pointer-1.svg',
      line1: 'Identifies root causes',
      line2: 'through comprehensive testing ',
    },
    {
      img: '/images/home/naturopathic-web-slide-2.webp',
      line1: 'Provides lasting results',
      icon: '/lotus-pointer-2.svg',
      line2: 'with sustainable lifestyle protocols ',
    },
    {
      img: '/images/home/naturopathic-web-slide-3.webp',
      line1: 'Uses natural therapies that',
      icon: '/lotus-pointer-3.svg',
      line2: 'work with your body, not against it',
    },
    {
      img: '/images/home/naturopathic-web-slide-4.webp',
      line1: 'Restores natural function',
      icon: '/lotus-pointer-4.svg',
      line2: `using the body's innate healing ability`,
    },
    {
      img: '/images/home/naturopathic-web-slide-5.webp',
      line1: 'Addresses the whole person:',
      icon: '/lotus-pointer-5.svg',
      line2: 'physical, mental, and emotional health ',
    },
  ]

  return (
    <SwiperAutoplayWrapper>
      {(onSwiper) => (
        <Swiper
          onSwiper={onSwiper}
          style={{
            padding: 16,
          }}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2000, // 3 seconds per slide
            disableOnInteraction: false, // keeps autoplay even after user interaction
          }}
          loop={true}
          centeredSlides
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1.1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {items.map((item, i) => (
            <SwiperSlide key={item.line1}>
              <div
                key={i}
                className='w-full md:w-1/3 flex flex-col-reverse md:flex-col md:px-2 pb-2 md:pb-8'
              >
                <div className='relative w-full h-[350px] max-w-full mb-2 overflow-hidden'>
                  <ImageWithShimmer
                    src={item.img}
                    alt={item.line1}
                    fill
                    className={`object-cover w-full absolute top-0 left-0 `}
                  />
                </div>
                <div className='flex flex-row gap-2 pb-2 md:pb-0'>
                  <Image
                    src={item.icon}
                    width={26}
                    height={20}
                    className='h-5 w-[24px'
                    alt='Pointer'
                  />
                  <div>
                    <p className='text-slateGray text-left text-base font-crimson whitespace-break-spaces leading-[110%]'>
                      {item.line1}
                      <br />
                      {item.line2}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </SwiperAutoplayWrapper>
  )
}
