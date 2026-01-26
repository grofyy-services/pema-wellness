'use client'
import React, { useEffect, useRef, useState } from 'react'
import { slidesData } from './SlideData'
import Image from 'next/image'

import { SwiperAutoplayWrapper } from '@/components/SwiperWrapper'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'
import { Autoplay } from 'swiper/modules'
import ImageWithShimmer from '@/components/ImageWithShimmer'

type Tab = {
  id: string
  title: string
  content: React.ReactNode
}

type SwiperTabsProps = {
  tabs?: Tab[]
  autoplayDelay?: number
  /** allow touch/swipe gestures */
  allowTouchMove?: boolean
}
export default function SwiperTabs({
  autoplayDelay = 3500,
  allowTouchMove = false,
}: SwiperTabsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((ref) => ref?.id === entry.target.id)
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      },
      {
        threshold: 0.25, // trigger earlier
      }
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const swiperRef = useRef<SwiperClass | null>(null)
  const handleTabClick = (index: number) => {
    setActiveIndex(index)
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  return (
    <section className='w-full mx-auto relative'>
      {/* Tab Navigation */}
      <nav
        className='mt-6 md:mt-2  z-11 flex flex-row gap-3 md:gap-0 justify-start md:justify-center md:p-4 select-none overflow-scroll'
        role='tablist'
        aria-label='Swiper tabs'
      >
        {slidesData.map((item, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={item.id}
              role='tab'
              aria-selected={isActive}
              onClick={() => handleTabClick(i)}
              className={`px-7 py-2 cursor-pointer border-b-[#323333] border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
                isActive
                  ? '  text-pemaBlue border-b-pemaBlue'
                  : 'border-b-[#32333333] text-slateGray'
              }`}
            >
              {item.tab}
            </button>
          )
        })}
      </nav>

      {/* Sections */}
      <div className='mt-3 md:mt-0 relative flex flex-col gap-6 md:gap-10'>
        <SwiperAutoplayWrapper>
          {() => (
            <Swiper
              modules={[Autoplay]}
              autoHeight={true}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              autoplay={{
                delay: autoplayDelay,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              slidesPerView={1}
              allowTouchMove={allowTouchMove}
              className='mt-3 md:mt-0 relative'
            >
              {slidesData.map((item) => (
                <SwiperSlide key={item.id}>
                  <div
                    key={item.id} // 🔑 important
                    id={item.hashId}
                    className='md:grid flex  md:scroll-m-40'
                  >
                    <div className='h-fit'>
                      <ImageWithShimmer
                        width={900}
                        height={550}
                        src={item.imgWebURL}
                        alt={item.tab}
                        className='h-[350px] md:h-[550] w-full object-cover'
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </SwiperAutoplayWrapper>
      </div>
    </section>
  )
}
