'use client'
import { MoveLeft, MoveRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

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
const testimonialsData = [
  {
    review: `I choose India’s #1 clinical wellness sanctuary for their annual reset. Daily yoga & meditation overlooking the sea`,
    name: `Sanne Vloet, Victoria’s Secret Model`,
    id: 3,
    imgWeb: '/sanne-vloet.webp',
    videoURL: 'https://youtube.com/shorts/WykV5bjOjko',
  },
  {
    review: `‘A naturopathic doctor reviewed my health history, actually listened to me. Together we set our health goals, not just for the time at Pema, but also beyond.’`,
    name: `Anita Jain, Life Coach & Yoga Teacher`,
    id: 4,
    imgWeb: '/images/medical-health-program/anita-jain-web.webp',
  },
  {
    review: `‘I was there for nearly a month and so I was having like 3 massages a day and they were all exceptional.’`,
    name: `Naomie Harris , Hollywood Actor`,
    id: 1,
    imgWeb: '/images/wellness-program/naomie-harris.webp',
    imgMobile: '/images/wellness-program/naomie-harris-mobile.webp',
  },
  {
    review: `‘I lost 27 kgs over two visits, halved my statins, rebuilt my health, and reclaimed control of my life. What Pema gives you isn’t just treatment—it’s understanding, routine, and the power to reset your mind and body.’`,
    name: `Anurag Kashyap , Bollywood Director And Actor`,
    id: 2,
    imgWeb: '/images/medical-health-program/anurag-kashyap-web.webp',
  },
]

export default function TestimonialMobile() {
  const testData = testimonialsData
  const carouselRef = useRef<Carousel | null>(null)

  // // 👇 Force start at first real slide after mount
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     carouselRef.current?.goToSlide(0, false)
  //   }, 0)
  //   return () => clearTimeout(timer)
  // }, [])
  // 👇 Force start at first real slide after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.goToSlide(0, false)
    }, 0)
    return () => clearTimeout(timer)
  }, [])
  return (
    <Carousel
      ref={carouselRef}
      responsive={responsive}
      arrows={false}
      renderButtonGroupOutside
      infinite
      // customButtonGroup={<CustomButtonGroup />}
      className='h-full'
      customButtonGroup={<CustomButtonGroup itemsCount={testData.length} />}
    >
      {testData.map((item) => {
        return (
          <div key={item.id} data-id={item.id}>
            <div className='mt-3 mx-4'>
              <div className='relative w-full h-[350px] overflow-hidden'>
                <Image
                  src={item.imgWeb}
                  alt={item.name}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
              <div className='flex flex-col justify-start md:px-4'>
                <div className=''>
                  <div className='text-[20px] md:mt-0 md:mb-0 mt-6 mb-3 md:text-[24px] text-slateGray font-ivyOra md:my-8'>
                    {item.review}
                  </div>
                  <div className='text-base  text-slateGray '>{item.name} </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </Carousel>
  )
}

import { FC } from 'react'
import { ButtonGroupProps } from 'react-multi-carousel'
type MyButtonGroupProps = ButtonGroupProps & { itemsCount: number }

export const CustomButtonGroup: FC<MyButtonGroupProps> = ({
  previous,
  next,
  carouselState,
  itemsCount,
}) => {
  if (!carouselState) return null

  const rawIndex = carouselState.currentSlide ?? 0
  const normalizedIndex = ((rawIndex % itemsCount) + itemsCount) % itemsCount
  const currentPage = normalizedIndex + 1

  return (
    <div className='flex justify-center items-center mt-2 px-4 text-slateGray text-base md:text-xl font-crimson'>
      <div onClick={previous} className='p-2 mr-6 cursor-pointer'>
        <MoveLeft />
      </div>
      {currentPage} of {itemsCount}
      <div onClick={next} className='p-2 ml-6 cursor-pointer'>
        <MoveRight />
      </div>
    </div>
  )
}
