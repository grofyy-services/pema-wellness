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
    review: `‘What I find very special about Pema is that it's the perfect blend of the East and West. So they have taken the best of the Indian pranayama healing techniques, food, ingredients, a menu...’`,
    name: `Payal Jain, Luxury Designer`,
    id: 3,
    imgWeb: '/images/wellness-program/payal-jain.webp',
    imgMobile: '/images/wellness-program/payal-jain-mobile.webp',
  },
  {
    review: `‘I feel that Pema is the best wellness center in the world, that I have been to.’`,
    name: `Amit Bansal`,
    id: 4,
    imgWeb: '/images/wellness-program/amit-bansal.webp',
    imgMobile: '/images/wellness-program/amit-bansal-mobile.webp',
  },
  {
    review: `‘I was there for nearly a month and so I was having like 3 massages a day and they were all exceptional.’`,
    name: `Naomie Harris , Hollywood Actor`,
    id: 1,
    imgWeb: '/images/wellness-program/naomie-harris.webp',
    imgMobile: '/images/wellness-program/naomie-harris-mobile.webp',
  },
  {
    review: `I choose India’s #1 clinical wellness sanctuary for their annual reset. Daily yoga & meditation overlooking the sea`,
    name: `Sanne Vloet, Victoria’s Secret model`,
    id: 2,
    imgWeb: '/images/wellness-program/sanne-vloet.webp',
    imgMobile: '/images/wellness-program/sanne-vloet-mobile.webp',
  },
]

export default function TestimonialCard() {
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
    <div>
      <Carousel
        ref={carouselRef}
        responsive={responsive}
        arrows={false}
        renderButtonGroupOutside
        infinite
        // customButtonGroup={<CustomButtonGroup />}
        customButtonGroup={<CustomButtonGroup itemsCount={testData.length} />}
      >
        {testData.map((item) => {
          return (
            <div key={item.id} data-id={item.id}>
              <div className='mt-12 md:mt-20 px-4 lg:grid grid-cols-[65%_35%] grid-rows-1'>
                <div className='relative w-full h-[350px] md:h-[530px] overflow-hidden'>
                  <Image
                    src={item.imgWeb}
                    alt={item.name}
                    fill
                    className={`object-cover absolute top-0 left-0 `}
                  />
                </div>
                <div className='flex flex-col justify-start md:px-4'>
                  <div className='md:mt-9'>
                    <div className='text-[20px] md:mt-0 md:mb-0 mt-6 mb-5 md:text-[24px] text-slateGray font-ivyOra md:my-8'>
                      {item.review}
                    </div>
                    <div className='text-lg md:text-2xl text-slateGray md:mt-8'>{item.name} </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </Carousel>
    </div>
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
