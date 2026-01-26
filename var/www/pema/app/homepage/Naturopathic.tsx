import ImageWithShimmer from '@/components/ImageWithShimmer'
import Image from 'next/image'

export default function NaturopathicSection() {
  const items = [
    {
      img: '/images/home/naturopathic-web-slide-1.webp',
      icon: '/lotus-pointer-1.svg',
      line1: 'Identifies root causes',
      line2: 'through comprehensive testing ',
    },
    {
      img: '/images/home/naturopathic-web-slide-2.webp',
      line1: 'Provides lasting results',
      icon: '/lotus-pointer-2.svg',
      line2: 'with sustainable lifestyle protocols ',
    },
    {
      img: '/images/home/naturopathic-web-slide-3.webp',
      line1: 'Uses natural therapies that',
      icon: '/lotus-pointer-3.svg',
      line2: 'work with your body, not against it',
    },
    {
      img: '/images/home/naturopathic-web-slide-4.webp',
      line1: 'Restores natural function',
      icon: '/lotus-pointer-4.svg',
      line2: `using the body's innate healing ability`,
    },
    {
      img: '/images/home/naturopathic-web-slide-5.webp',
      line1: 'Addresses the whole person:',
      icon: '/lotus-pointer-5.svg',
      line2: 'physical, mental, and emotional health ',
    },
  ]

  return (
    <div className='w-full mx-auto'>
      <div className='flex flex-row justify-center text-center flex-wrap'>
        {/* First row: 3 items */}
        {items.map((item, i) => (
          <div
            key={i}
            className='w-full md:w-1/3 flex flex-col-reverse md:flex-col md:px-2 pb-2 md:pb-8'
          >
            <div className='relative w-full h-[198px] max-w-full mb-4 overflow-hidden'>
              <ImageWithShimmer
                src={item.img}
                alt={item.line1}
                width={440}
                height={198}
                className={`object-cover w-full absolute top-0 left-0 `}
              />
            </div>
            <div className='flex flex-row gap-2 pb-2 md:pb-0'>
              <Image
                src={item.icon}
                width={31}
                height={24}
                className='h-[31px] w-6'
                alt='Pointer'
              />
              <div>
                <p className='text-slateGray text-left text-xl font-crimson whitespace-break-spaces'>
                  {item.line1}
                </p>
                <p className='text-slateGray text-left text-xl font-crimson whitespace-break-spaces'>
                  {item.line2}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
