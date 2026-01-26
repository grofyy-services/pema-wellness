'use client'
import { MoveLeft, MoveRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const testimonialsData = [
  {
    review: `‘The location is something you cannot recreate anywhere in the world. It has a beautiful hill overlooking the Indian Ocean. All the holistic treatments and other therapies are so good.’`,
    name: `Praful Patel, Member of Rajya Sabha`,
    id: 1,
  },
  {
    review: `‘I came to Pema with huge problems related to my foot & knee. Going back healed. Thank you Dr Syed & Dr Hemalatha for the excellent treatment!’’`,
    name: `Radika Hoon`,
    id: 2,
  },
  {
    review: `‘Just expectational. What my physiotherapist can not diagnose in a year. Dr. Hemalatha did in single session. Exceptionally talented and genuinely interested in customer well-being’`,
    name: `Yogesh Agarwal`,
    id: 3,
  },
  {
    review: `‘It's been a very rewarding treatment as felt much better, pain is less and have been advised five more sessions which I will continue in Bombay, really helpful and polite doctors’`,
    name: `Namita Godha`,
    id: 4,
  },
]
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

export default function TestimonialCard() {
  const carouselRef = useRef<Carousel | null>(null)

  // 👇 Force start at first real slide after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.goToSlide(0, false)
    }, 0)
    return () => clearTimeout(timer)
  }, [])
  const testData = testimonialsData
  return (
    <div
      className='relative flex items-center justify-center h-[550px] w-full '
      //   style={{ backgroundImage: "url('/testimonials-bg-image.webp')" }} // replace with your image path
    >
      <Image
        src={'/testimonials-bg-image.webp'}
        alt={'/testimonials-bg-image.webp'}
        fill
        className={`hidden md:block object-cover absolute top-0 left-0 `}
      />
      <Image
        src={'/testimonials-bg-image-mobile.webp'}
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
import Link from 'next/link'
import { ROUTES } from '@/utils/utils'
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
