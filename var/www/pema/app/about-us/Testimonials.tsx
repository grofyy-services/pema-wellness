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
const testimonialsData2 = [
  {
    review: `‘I lost 27 kg over two visits, halved my statins, rebuilt my health, and reclaimed control of my life.’`,
    name: ` Ayesha N.`,
    id: 1,
  },
  {
    review: `‘All the staff and healers were very friendly and helpful, especially at the reception, where Morgana was exceptionally efficient. Thank you so much for this wonderful experience. The kitchen staff were also very kind and humble. I am still waiting for a few recipes from the chef, and I’m sure I’ll soon enjoy following the Pema routine back home.’`,
    name: `Anushree`,
    id: 2,
  },
  {
    review: `‘Had a great experience at PEMA! The staff therapists and everyone around is very friendly and supportive! Thank you.’`,
    name: `Rashmi golechha`,
    id: 3,
  },
  {
    review: `‘Everything was so excellent…with such familiar and helpful staff..especially healers Frankie and Hiranmayi. We will definitely practice to come every year.’`,
    name: `Kusum Bangar`,
    id: 4,
  },
]

export default function TestimonialCard() {
  const carouselRef = useRef<Carousel | null>(null)

  // 👇 Force start at first real slide after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.goToSlide(0, false)
    }, 0)
    return () => clearTimeout(timer)
  }, [])
  const testData = testimonialsData2
  return (
    <div
      className='relative flex items-center justify-center h-[650px] w-full '
      //   style={{ backgroundImage: "url('/testimonials-bg-image.webp')" }} // replace with your image path
    >
      <ImageWithShimmer
        src={'/testimonials-bg-image.webp'}
        alt={'/testimonials-bg-image.webp'}
        fill
        className={`hidden md:block object-cover absolute top-0 left-0 `}
      />
      <ImageWithShimmer
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

        <div className='flex my-6 font-crimson text-lg md:text-xl text-pemaBlue flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'>
          See all <span className='hidden md:inline-block'>testimonials</span>
          <MoveRight />
        </div>
      </div>
    </div>
  )
}

import { FC } from 'react'
import { ButtonGroupProps } from 'react-multi-carousel'
import ImageWithShimmer from '@/components/ImageWithShimmer'
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
