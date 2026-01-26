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
    review: `‘I’ve tried every juice cleanse and crash detox there is they always left me depleted. At Pema, it was the first time I felt my body letting go without punishing me. The therapies, the food, even the breath work… it all felt designed for me. I came home lighter, yes, but more importantly, I came home with energy that lasted.’`,
    name: ` Nisha`,
    id: 1,
  },
  {
    review: ` ‘I was nervous about spending so much on something that might feel like a spa holiday. But this wasn’t that at all. The doctors were deeply involved, the food was therapeutic, and I actually understood what my body was doing at every step of the way. The clarity I feel now is priceless. I’d recommend Pema to anyone who’s on the fence.’`,
    name: `Raj`,
    id: 2,
  },
  {
    review: `‘This may sound dramatic, but in just three weeks here I feel like I reset ten years of bad habits. The bloating I’d lived with for years vanished, my skin looked brighter, and I was finally sleeping through the night. The biggest change, though? I now feel at peace with my body instead of constantly fighting it.’`,
    name: `Aditi`,
    id: 3,
  },
  {
    review: `‘This is my first experience at Pema Wellness, and I came here because of the legend, Dr. Murthy, who leads the entire journey for guests. His treatments and wellness practices, refined over nearly half a century, are well known not only across India but also around the world.’`,
    name: `Jagapati Babu, Tollywood Actor`,
    id: 4,
  },
]

export default function TestimonialCard() {
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
      className='relative flex items-center justify-center h-[650px] w-full '
      //   style={{ backgroundImage: "url('/testimonials-bg-image.webp')" }} // replace with your image path
    >
      <Image
        src={'/images/pema-lite/pema-lite-testimonials-bg-web.webp'}
        alt={'/testimonials-bg-image.webp'}
        fill
        className={`hidden md:block object-cover absolute top-0 left-0 `}
      />
      <Image
        src={'/images/pema-lite/pema-lite-testimonials-bg-mobile.webp'}
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
