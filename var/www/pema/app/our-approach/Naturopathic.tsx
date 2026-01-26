import Image from 'next/image'
import ImageWithShimmer from '@/components/ImageWithShimmer'

export default function NaturopathicSection() {
  const items = [
    {
      img: '/images/home/naturopathic-web-slide-1.webp',
      icon: '/lotus-pointer-1.svg',
      line1: 'Root cause identification',
      line2: `Advanced diagnostics reveal what's really happening beneath the surface`,
    },
    {
      img: '/images/home/naturopathic-web-slide-3.webp',
      line1: 'Natural protocols',
      icon: '/lotus-pointer-2.svg',
      line2: `Treatments that work with your body's intelligence, not against it`,
    },
    {
      img: '/images/home/naturopathic-web-slide-2.webp',
      line1: 'Lifestyle integration',
      icon: '/lotus-pointer-3.svg',
      line2: `Sustainable practices that become your new way of living`,
    },
    {
      img: '/images/approach/naturopathy-web-2.webp',
      line1: 'Whole-being approach',
      icon: '/lotus-pointer-4.svg',
      line2: `Addressing physical, mental, emotional, and spiritual layers simultaneously`,
    },
    {
      img: '/images/wellness-program/slide-4-web.webp',
      line1: 'Results that last',
      icon: '/lotus-pointer-5.svg',
      line2: 'Healing that transforms rather than temporarily relieves',
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
            <div className='relative w-full h-[350] max-w-full mb-4 overflow-hidden'>
              <ImageWithShimmer
                src={item.img}
                alt={item.line1}
                fill
                className={`object-cover w-full absolute top-0 left-0 `}
              />
            </div>
            <div className='pb-2 md:pb-0'>
              <div className='flex flex-row gap-2 md:pb-0 items-center'>
                <Image
                  src={item.icon}
                  width={31}
                  height={24}
                  className='h-[31px] w-6'
                  alt='Pointer'
                />
                <div>
                  <p className='text-slateGray text-left text-base font-crimson whitespace-break-spaces'>
                    {item.line1}
                  </p>
                </div>
              </div>
              <p className='text-slateGray ml-8 text-left text-base font-crimson leading-[110.00%]'>
                {item.line2}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
