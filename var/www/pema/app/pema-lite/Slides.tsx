import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { slidesData } from './SlideData'
import Image from 'next/image'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
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
  const swiperRef = useRef<SwiperClass | null>(null)
  const handleTabClick = (index: number) => {
    setActiveIndex(index)
    if (swiperRef.current) {
      swiperRef.current.slideTo(index)
    }
  }

  const openURL = (url: string) => {
    window.open(url)
  }
  return (
    <section className='w-full mx-auto'>
      <nav
        className='flex md:flex-row flex-col gap-3 md:gap-9 justify-center md:p-4 select-none'
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
              className={`px-3 py-2 border cursor-pointer text-left border-[#323333] md:border-0 md:border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-pemaBlue md:bg-white md:text-pemaBlue text-softSand border-pemaBlue'
                  : 'md:border-transparent text-slateGray md:text-pemaBlue '
              }`}
            >
              {item.tab}
            </button>
          )
        })}
      </nav>
      <div className=' text-lg  md:hidden block font-ivyOra text-slateGray mt-6'>
        {slidesData[activeIndex].tab}{' '}
      </div>

      <Swiper
        modules={[Autoplay]}
        autoHeight={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: true, pauseOnMouseEnter: true }}
        slidesPerView={1}
        allowTouchMove={allowTouchMove}
        className='mt-3 md:mt-0'
      >
        {slidesData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className='flex flex-col gap-9'>
              <div className='md:grid flex flex-col gap-6 md:gap-0 grid-cols-[65%_35%]'>
                <div className='h-fit'>
                  <ImageWithShimmer
                    width={900}
                    height={545}
                    src={item.images[0].imageUrl}
                    alt={item.images[0].title}
                    className='h-[350px] md:h-[545px] w-full'
                  />
                  <div>
                    <div className='text-base mt-3 md:text-[24px] text-slateGray font-crimson md:font-ivyOra'>
                      {item.images[0].title}
                    </div>
                    <div className='text-base md:text-xl text-slateGray mt-0 md:mt-2'>
                      {item.images[0].subtitle}
                    </div>
                    {item.images[0].locationUrl && (
                      <a
                        href={item.images[0].locationUrl}
                        target='_blank'
                        className='font-crimson items-center  w-fit text-pemaBlue text-base md:text-xl flex flex-row mt-3 gap-2 border-b border-pemaBlue'
                      >
                        Open in maps <MoveRight />
                      </a>
                    )}{' '}
                  </div>
                </div>
                <div className='h-fit md:pl-5'>
                  <ImageWithShimmer
                    width={440}
                    height={545}
                    src={item.images[1].imageUrl}
                    alt={item.images[1].title}
                    className='h-[350px] md:h-[545px] w-full'
                  />

                  <div>
                    <div className='text-base  md:text-[24px] text-slateGray  font-crimson md:font-ivyOra mt-3'>
                      {item.images[1].title}
                    </div>
                    <div className='text-base md:text-xl text-slateGray mt-0 md:mt-2'>
                      {item.images[1].subtitle}
                    </div>
                    {item.images[1].locationUrl && (
                      <a
                        target='_blank'
                        href={item.images[1].locationUrl}
                        className='font-crimson items-center  w-fit text-pemaBlue text-base md:text-xl flex flex-row  mt-3  gap-2 border-b border-pemaBlue'
                      >
                        Open in maps <MoveRight />
                      </a>
                    )}{' '}
                  </div>
                </div>
              </div>
              <div className='md:grid flex flex-col gap-0 grid-cols-[65%_35%]'>
                <div>
                  <ImageWithShimmer
                    width={900}
                    height={545}
                    src={item.images[2].imageUrl}
                    alt={item.images[2].title}
                    className='h-[350px] md:h-[545px] w-full object-cover'
                  />
                  {item.hasFourImages && (
                    <div>
                      <div className='text-base  md:text-[24px] text-slateGray  font-crimson md:font-ivyOra mt-3'>
                        {item.images[2].title}
                      </div>
                      <div className='text-base md:text-xl text-slateGray mt-0 md:mt-2'>
                        {item.images[2].subtitle}
                      </div>
                      {item.images[2].locationUrl && (
                        <a
                          target='_blank'
                          href={item.images[2].locationUrl}
                          className='font-crimson items-center  w-fit text-pemaBlue text-base md:text-xl mt-3 flex flex-row  gap-2 border-b border-pemaBlue'
                        >
                          Open in maps <MoveRight />
                        </a>
                      )}{' '}
                    </div>
                  )}
                </div>
                {item.hasFourImages ? (
                  <div className='md:pl-5'>
                    <ImageWithShimmer
                      width={440}
                      height={545}
                      src={item.images[3].imageUrl}
                      alt={item.images[3].title}
                      className='h-[350px] md:h-[545px] w-full object-cover'
                    />
                    <div>
                      <div className='text-base  md:text-[24px] text-slateGray  font-crimson md:font-ivyOra mt-3'>
                        {item.images[3].title}
                      </div>
                      <div className='text-base md:text-xl text-slateGray mt-0 md:mt-2'>
                        {item.images[3].subtitle}
                      </div>
                      {item.images[3].locationUrl && (
                        <a
                          target='_blank'
                          href={item.images[3].locationUrl}
                          className='font-crimson items-center  w-fit text-pemaBlue text-base md:text-xl flex flex-row  mt-3 gap-2 border-b border-pemaBlue'
                        >
                          Open in maps <MoveRight />
                        </a>
                      )}{' '}
                    </div>
                  </div>
                ) : (
                  <div className='h-fit md:pl-5'>
                    <div className='text-base  md:text-[24px] text-slateGray  font-crimson md:font-ivyOra mt-3'>
                      {item.images[2].title}
                    </div>
                    <div className='text-base md:text-xl text-slateGray mt-0 md:mt-2'>
                      {item.images[2].subtitle}
                    </div>
                    {item.images[2].locationUrl && (
                      <a
                        target='_blank'
                        href={item.images[2].locationUrl}
                        className='font-crimson items-center w-fit text-pemaBlue text-base md:text-xl flex flex-row mt-3 md:mt-9  gap-2 border-b border-pemaBlue'
                      >
                        Open in maps <MoveRight />
                      </a>
                    )}{' '}
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
