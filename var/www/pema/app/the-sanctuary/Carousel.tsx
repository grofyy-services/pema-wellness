import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import Image from 'next/image'
import { Autoplay } from 'swiper/modules'
import ImageWithShimmer from '@/components/ImageWithShimmer'

const images = [
  '/images/sanctury/slide-img-1.webp',
  '/images/sanctury/slide-img-2.webp',
  '/images/sanctury/slide-img-3.webp',
  '/images/sanctury/slide-img-4.webp',
  '/images/sanctury/slide-img-5.webp',
  '/images/sanctury/slide-img-6.webp',
  '/images/sanctury/slide-img-7.webp',
  '/images/sanctury/slide-img-8.webp',
  '/images/sanctury/slide-img-9.webp',
  '/images/sanctury/slide-img-10.webp',
  '/images/sanctury/slide-img-11.webp',
  '/images/sanctury/slide-img-12.webp',
]

export default function ImageCarousel() {
  const gap = 36
  const peekPercent = 5
  const slideWidth = (100 - 2 * peekPercent) / 4
  const slideWidthMobile = 100 - 2 * peekPercent

  const swiperRefDesktop = useRef<SwiperType | null>(null)
  const swiperRefMobile = useRef<SwiperType | null>(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Handle scrollbar interactions
  const handleScrollbarAction = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    swiper: SwiperType | null
  ) => {
    if (!swiper) return
    const scrollbar = e.currentTarget as HTMLDivElement
    const rect = scrollbar.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clickX = clientX - rect.left
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width))

    const totalSlides = images.length
    const targetSlide = Math.floor(clickPercent * totalSlides)

    swiper.slideToLoop(targetSlide)
  }

  const handleSlideChange = (swiper: SwiperType) => {
    const { realIndex } = swiper
    const progress = realIndex / (images.length - 1)
    setScrollProgress(progress)
  }
  return (
    <>
      {/* Desktop */}
      <div className='w-full mt-6 hidden md:block'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000, // 3s per slide
            disableOnInteraction: false, // keep autoplay running after drag
          }}
          onSwiper={(swiper) => (swiperRefDesktop.current = swiper)}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
          slidesPerView='auto'
          spaceBetween={gap}
          loop
          initialSlide={3}
          style={{
            paddingLeft: `${peekPercent}%`,
            paddingRight: `${peekPercent}%`,
            paddingBottom: '40px',
          }}
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx} style={{ width: `${slideWidth}%` }}>
              <ImageWithShimmer
                width={300}
                height={350}
                src={src}
                alt={`slide-${idx}`}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className='mt-4 px-4 flex justify-center'>
          <div
            className='relative w-full max-w-[430px] h-1 bg-gray-200 rounded-full cursor-pointer select-none'
            onClick={(e) => handleScrollbarAction(e, swiperRefDesktop.current)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => isDragging && handleScrollbarAction(e, swiperRefDesktop.current)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={(e) => isDragging && handleScrollbarAction(e, swiperRefDesktop.current)}
          >
            {/* Thumb */}
            <div
              className='absolute top-0 h-full bg-slateGray rounded-full transition-transform duration-300 ease-out'
              style={{
                width: `${430 / images.length}px`, // 👈 dynamic thumb width
                transform: `translateX(${scrollProgress * (430 - 430 / images.length)}px)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className='w-full mt-6 md:hidden block'>
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000, // 3s per slide
            disableOnInteraction: false, // keep autoplay running after drag
          }}
          onSwiper={(swiper) => (swiperRefMobile.current = swiper)}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
          slidesPerView='auto'
          spaceBetween={16}
          loop
          initialSlide={3}
          style={{
            paddingLeft: `10%`,
            paddingRight: `5%`,
            paddingBottom: '40px',
          }}
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx} style={{ width: `${slideWidthMobile}%` }}>
              <Image
                width={300}
                height={350}
                src={src}
                alt={`slide-${idx}`}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className='mt-4 px-4 flex justify-center'>
          <div
            className='relative w-full max-w-[270] h-1 bg-gray-200 rounded-full cursor-pointer select-none'
            onClick={(e) => handleScrollbarAction(e, swiperRefDesktop.current)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => isDragging && handleScrollbarAction(e, swiperRefDesktop.current)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={(e) => isDragging && handleScrollbarAction(e, swiperRefDesktop.current)}
          >
            {/* Thumb */}
            <div
              className='absolute top-0 h-full bg-slateGray rounded-full transition-transform duration-300 ease-out'
              style={{
                width: `${270 / images.length}px`, // 👈 dynamic thumb width
                transform: `translateX(${scrollProgress * (430 - 430 / images.length)}px)`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
