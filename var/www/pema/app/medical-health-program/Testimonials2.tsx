'use client'
import { MoveLeft, MoveRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
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
    name: `Vivekanand S.`,
    review: `‘After decades of struggling with high BP, it’s finally under control. I also lost over 4 kg in just 10 days - and felt a renewed sense of well-being I hadn’t experienced in years.’`,
    id: 2,
  },
  {
    name: `Era Sabharwal`,
    review: `‘Great team of healers, front office staff, doctors and yoga instructors. Everyone is very helpful, also all your staff is very kind and service oriented. Great team.’`,
    id: 4,
  },
  {
    name: `Mercedes Jahanzedeh`,
    review: `‘After a year on 12 pills a day for chronic pain, anxiety, depression, and insomnia - I’ve now gone 3 weeks without a single medication. My stomach pain is gone, my anxiety has eased, I sleep better, and I finally feel like myself again.’`,
    id: 3,
  },
  {
    name: ` Pharmaceutical Industry Leader`,
    review: `‘After years of hospital visits, Pema felt like entering a healing universe. World-class medical care wrapped in resort luxury, all on land that's been healing people for thousands of years. Every element supports your transformation.’`,
    id: 1,
  },
]

export default function TestimonialCard2() {
  const testData = testimonialsData
  const carouselRef = useRef<Carousel | null>(null)

  // 👇 Force start at first real slide after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.goToSlide(0, false)
    }, 0)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div
      className='relative flex items-center justify-center h-[550px] w-full '
      //   style={{ backgroundImage: "url('/testimonials-bg-image.webp')" }} // replace with your image path
    >
      <Image
        src={'/images/medical-health-program/medical-testimonials-bg-web.webp'}
        alt={'/testimonials-bg-image.webp'}
        fill
        className={`hidden md:block object-cover absolute top-0 left-0 `}
      />
      <Image
        src={'/images/medical-health-program/medical-testimonials-bg-mobile.webp'}
        alt={'/testimonials-bg-image.webp'}
        fill
        className={`object-cover block md:hidden absolute top-0 left-0 `}
      />
      <div
        className='bg-softSand mx-0 md:mx-4 p-4 md:-8 lg:p-12 text-center 
      absolute h-auto md:h-[80%] max-h-[440 top-auto md:top-[10%] left-4 right-4 md:left-[100px] md:right-[100px]'
      >
        <h2 className='text-[28px] text-left md:text-center md:text-[40px] font-ivyOra text-gray-800 mb-6 md:mb-9'>
          In your own words
        </h2>
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
                <p className='text-left md:text-center text-xl md:text-2xl text-slateGray font-ivyOra  md:w-[80%] m-auto'>
                  {item.review}
                </p>
                <p className='text-slateGray text-left md:text-center text-lg md:text-2xl font-crimson mt-2 mb-6'>
                  {item.name}
                </p>
              </div>
            )
          })}
        </Carousel>

        <Link
          href={ROUTES.successStories}
          className='flex my-6 font-crimson text-lg md:text-xl text-pemaBlue flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          See all <span className='hidden md:inline-block'>testimonials</span>
          <MoveRight />
        </Link>
      </div>
    </div>
  )
}

import { FC } from 'react'
import { ButtonGroupProps } from 'react-multi-carousel'
import { ROUTES } from '@/utils/utils'
import Link from 'next/link'
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
