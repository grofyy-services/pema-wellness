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
    review: `‘I would love to go back again and each one of you should try it I feel.’`,
    name: `Rakul Preet Singh, Indian Actress`,
    id: 1,
    imgWeb: '/images/medical-health-program/anurag-kashyap-web.webp',
    videoURL: 'https://youtu.be/b7weagfrSdU',
  },
  {
    review: `‘I lost 27 kgs over two visits, halved my statins, rebuilt my health, and reclaimed control of my life. What Pema gives you isn’t just treatment—it’s understanding, routine, and the power to reset your mind and body.’`,
    name: `Anurag Kashyap , Bollywood Director and Actor`,
    id: 2,
    imgWeb: '/images/medical-health-program/anurag-kashyap-web.webp',
    videoURL: 'https://youtu.be/lQiML-o4eVc',
  },
  {
    review: `I choose India’s #1 clinical wellness sanctuary for their annual reset. Daily yoga & meditation overlooking the sea`,
    name: `Sanne Vloet, Victoria’s Secret Model`,
    id: 4,
    imgWeb: '/sanne-vloet.webp',
    videoURL: 'https://youtube.com/shorts/WykV5bjOjko',
  },
]

export default function TestimonialCard() {
  const testData = testimonialsData
  const carouselRef = useRef<Carousel | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
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
          setIsPlaying(false)
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
              <div className=' lg:grid grid-cols-[65%_35%] grid-rows-1'>
                <div className='relative w-full h-[350px] md:h-[530px] overflow-hidden'>
                  {/* <div className='h-[350px] md:h-[740px] flex justify-center items-center mb-6'> */}
                  <ReactPlayer
                    width='100%'
                    controls
                    autoPlay={false}
                    height='100%'
                    src={item.videoURL}
                    className='w-[100vw] aspect-video'
                    playing={false && index === activeIndex}
                  />
                  {/* </div> */}
                </div>
                <div className='flex flex-col justify-start md:px-4'>
                  <div className='md:mt-9'>
                    <div className='text-[20px] md:mt-0 mt-6 mb-3 md:mb-5 md:text-[24px] text-slateGray font-ivyOra md:my-8'>
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
