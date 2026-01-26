'use client'
import { ChevronDown, MoveLeft, MoveRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const testimonialsData = [
  {
    review: `‘I needed to get away. I needed to lose weight. I’ve been to retreats before this was something else. I followed the program. I lost more than weight I found stillness. I left cleaner, clearer, more aligned. I’m planning to come back every year.’`,
    name: `Tarun Tahiliani, Bridal Couture & Fashion Designer`,
    id: 3,
    imgWeb: '/images/success-stories/tarun-tahiliani-testimonial.webp',
  },
  {
    review: `‘After the COVID vaccine, I had a heart attack, severe asthma, and was put on steroids. I spiraled  mentally and physically. I went from 86 to 118 kg. One day, I just couldn’t get out of bed. At Pema, I healed from the inside out. I lost 27 kgs over two visits, halved my statins, rebuilt my health, and reclaimed control of my life. What Pema gives you isn’t just treatment, it’s understanding, rhythm, and the power to reset your entire system.’`,
    name: `Anurag Kashyap, Bollywood Director and Actor`,
    id: 4,
    imgWeb: '/images/success-stories/anurag-kashyap-testimonial.webp',
  },
  {
    review: `‘I came in exhausted, overworked, and bloated. I lost over 4 kg in 10 days. But more than that I felt lighter, clearer, and finally in sync with myself again. My BP dropped for the first time in decades. I’ve tried everything. Nothing’s worked like this.’`,
    name: ` Vivekanand, Scientist`,
    id: 1,
    imgWeb: '/images/success-stories/vivekanand-testimonial.webp',
  },
]

export default function TestimonialCardList() {
  const testData = testimonialsData

  return (
    <div className='mt-6 flex flex-col gap-6 md:gap-9'>
      {testData.map((item) => {
        return (
          <div key={item.id} data-id={item.id}>
            <div className='  lg:grid grid-cols-[65%_35%] grid-rows-1'>
              <div className='relative w-full h-[350px] md:h-[694px] overflow-hidden'>
              <ImageWithShimmer
                  src={item.imgWeb}
                  alt={item.name}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
              <div className='flex flex-col justify-start md:px-4'>
                <div className='md:mt-9'>
                  <div className='text-[20px] md:mt-0 md:mb-0 mt-3 mb-3 md:text-[24px] text-slateGray font-ivyOra md:my-8'>
                    {item.review}
                  </div>
                  <div className='text-base md:text-xl text-slateGray md:mt-8'>{item.name} </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <div className=''>
        <Link
          href={ROUTES.theSanctuary}
          className='font-crimson mt-6 md:mt-9 text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start md:m-auto gap-2 border-b border-pemaBlue w-fit'
        >
          Begin your healing now <MoveRight />
        </Link>
      </div>
    </div>
  )
}

import { FC } from 'react'
import { ButtonGroupProps } from 'react-multi-carousel'
import Link from 'next/link'
import { ROUTES } from '@/utils/utils'
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
