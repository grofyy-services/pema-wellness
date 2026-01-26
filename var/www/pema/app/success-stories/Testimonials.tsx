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
    review: `‘I was able to make a huge difference and I feel that I am going back as a rejuvenated person.’`,
    name: `Praful Patel, Member of Rajya Sabha`,
    id: 3,
    imgWeb: '/images/wellness-program/payal-jain.webp',
    imgMobile: '/images/wellness-program/payal-jain-mobile.webp',
    videoURL: 'https://youtu.be/U4A3BWj4ddU',
  },
  {
    review: `‘A naturopathic doctor reviewed my health history, actually listened to me.’`,
    name: `Anita Jain, Life coach & Yoga teacher`,
    id: 4,
    imgWeb: '/images/wellness-program/amit-bansal.webp',
    imgMobile: '/images/wellness-program/amit-bansal-mobile.webp',
    videoURL: 'https://youtu.be/6eyI2zOFdV0',
  },
  {
    review: `‘I've lost 27 kgs since then.’`,
    name: `Anurag Kashyap , Bollywood director and actor`,
    id: 1,
    imgWeb: '/images/wellness-program/naomie-harris.webp',
    imgMobile: '/images/wellness-program/naomie-harris-mobile.webp',
    videoURL: 'https://youtu.be/lQiML-o4eVc',
  },
  {
    review: `‘I would love to go back again and each one of you should try it I feel.’`,
    name: `Rakul Preet Singh,  Indian actress`,
    id: 2,
    imgWeb: '/images/wellness-program/sanne-vloet.webp',
    imgMobile: '/images/wellness-program/sanne-vloet-mobile.webp',
    videoURL: 'https://youtu.be/b7weagfrSdU',
  },
]
export default function TestimonialCard() {
  const carouselRef = useRef<Carousel | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.goToSlide(0, false)
      setActiveIndex(0)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={containerRef}>
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
        customButtonGroup={<CustomButtonGroup itemsCount={testimonialsData.length} />}
      >
        {testimonialsData.map((item, index) => (
          <div key={item.id} data-id={item.id}>
            <div className='mt-6 lg:flex flex-col'>
              <div className='flex flex-col justify-start md:px-4'>
                <div className=''>
                  <div className='text-[20px] md:text-[32px] md:text-center text-left text-slateGray font-ivyOra'>
                    {item.review}
                  </div>
                  <div className='text-base md:text-center text-left text-slateGray mb-3 md:mb-6 mt-3'>
                    {item.name}
                  </div>
                </div>
              </div>
              <div className='relative w-full h-[350px] md:h-[530px] overflow-hidden'>
                <div className='h-[350px] md:h-[530px] flex justify-center items-center mb-6'>
                  <ReactPlayer
                    // onClick={() => setIsPlaying(true)}
                    width='100%'
                    controls
                    autoPlay={false}
                    height='100%'
                    src={item.videoURL}
                    className='w-[100vw] aspect-video'
                    playing={false && index === activeIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
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
