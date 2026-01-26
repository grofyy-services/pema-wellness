'use client'
import { MoveLeft, MoveRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import ReactPlayer from 'react-player'

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
    review: `‘What makes Pema special is the people, the wonderful therapists, the amazing staff who looks after you. And everything is so aesthetically beautiful. ‘`,
    name: `Poonam Dhillon, Bollywood Actor`,
    id: 3,
    url: 'https://youtu.be/28tW2-zW2S0',
  },
  {
    review: `‘You get up in the morning, the evenings and mornings are awesome. Infinity pool, it's just like out in the sea.’`,
    name: `Jagapati Babu, Tollywood Actor`,
    id: 4,
    url: 'https://youtu.be/aAGR_kf1RTk',
  },
  {
    review: `‘I lost 27 kgs over two visits, halved my statins, rebuilt my health, and reclaimed control of my life. What Pema gives you isn’t just treatment—it’s understanding, routine, and the power to reset your mind and body.’`,
    name: `Anurag Kashyap , Bollywood Director And Actor`,
    id: 1,
    url: 'https://youtu.be/lQiML-o4eVc',
  },
  {
    review: `‘A naturopathic doctor reviewed my health history, actually listened to me. Together we set our health goals, not just for the time at Pema, but also beyond.’`,
    name: `Anita Jain, Life Coach & Yoga Teacher`,
    id: 2,
    url: 'https://youtu.be/6eyI2zOFdV0',
  },
]

export default function TestimonialCard() {
  const testData = testimonialsData
  const carouselRef = useRef<Carousel | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

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
        beforeChange={(nextSlide) => {
          const normalizedIndex =
            ((nextSlide % testimonialsData.length) + testimonialsData.length) %
            testimonialsData.length

          setActiveIndex(normalizedIndex)
        }}
        // customButtonGroup={<CustomButtonGroup />}
        customButtonGroup={<CustomButtonGroup itemsCount={testData.length} />}
      >
        {testData.map((item, index) => {
          return (
            <div key={item.id} data-id={item.id}>
              <div className='mt-12 md:mt-20 px-4 lg:grid grid-cols-[65%_35%] grid-rows-1'>
                <div className='relative w-full h-[350px] md:h-[530px] overflow-hidden'>
                  <ReactPlayer
                    width='100%'
                    autoPlay={false}
                    height='100%'
                    controls
                    src={item.url}
                    playing={false && index === activeIndex}
                    className='w-[100vw] aspect-video'
                  />
                </div>
                <div className='flex flex-col justify-start md:px-4'>
                  <div className='md:mt-9'>
                    <div className='text-[20px] md:mt-0 md:mb-0 mt-6 mb-5 md:text-[24px] text-slateGray font-ivyOra md:my-8'>
                      {item.review}
                    </div>
                    <div className='text-base md:text-xl text-slateGray md:mt-8'>{item.name} </div>
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
