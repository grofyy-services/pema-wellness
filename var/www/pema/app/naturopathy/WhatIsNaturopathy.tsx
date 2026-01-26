import ImageWithShimmer from '@/components/ImageWithShimmer'
import Image from 'next/image'

export default function WhatIsNaturopathy() {
  const items = [
    {
      title: 'Air',
      img: '/images/naturopathy/air.png',
      line1: 'Fresh air and breathing exercises for vitality and mental clarity.',
    },
    {
      title: 'Water',
      img: '/images/naturopathy/water.png',
      line1: 'Hydrotherapy and proper hydration for purification and healing.',
    },
    {
      title: 'Earth',
      img: '/images/naturopathy/earth.png',
      line1: 'Natural foods, herbs, and grounding practices for nourishment.',
    },
    {
      title: 'Fire',
      img: '/images/naturopathy/fire.png',
      line1: 'Sunlight therapy and metabolic balance for energy and warmth.',
    },
    {
      title: 'Space',
      img: '/images/naturopathy/space.png',
      line1: 'Meditation and mental space for spiritual well-being and peace.',
    },
  ]

  return (
    <div className='w-full mx-auto  py-6 md:py-9'>
      <div className='grid md:grid-cols-3 gap-6 md:gap-20 text-center'>
        {/* First row: 3 items */}
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className='flex flex-col items-center '>
            <Image
              src={item.img}
              alt={item.title}
              width={212}
              height={178}
              className='w-[212px] h-[178px] max-w-full mb-4'
            />
            <div>
              <h3 className='text-left md:text-center text-xl md:text-2xl font-ivyOra mb-3 md:mb-2'>
                {item.title}
              </h3>
              <p className='text-left md:text-center text-slateGray text-base md:text-xl font-crimson whitespace-break-spaces'>
                {item.line1}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid md:grid-cols-2 gap-6 md:gap-20 mt-12 text-center max-w-[800px] m-auto'>
        {/* Second row: 2 items */}

        {items.slice(3).map((item, i) => (
          <div key={i} className='flex flex-col items-center '>
            <Image
              src={item.img}
              alt={item.title}
              width={212}
              height={178}
              className='w-[212px] h-[178px] max-w-full mb-4'
            />
            <div>
              <h3 className='text-left md:text-center text-xl md:text-2xl font-ivyOra mb-3 md:mb-2'>
                {item.title}
              </h3>
              <p className='text-left md:text-center text-slateGray text-base md:text-xl font-crimson whitespace-break-spaces'>
                {item.line1}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
