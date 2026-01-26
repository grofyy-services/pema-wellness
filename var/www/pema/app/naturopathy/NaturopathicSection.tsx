import ImageWithShimmer from '@/components/ImageWithShimmer'
import Image from 'next/image'

export default function NaturopathicSection() {
  const items = [
    {
      img: '/images/naturopathy/section-1.webp',
      icon: '/lotus-pointer-1.svg',
      line1: 'Harmony with nature',
      line2: 'Align habits and health practices with natural laws',
    },
    {
      img: '/images/naturopathy/section-2.webp',
      line1: 'Non-chemical remedies',
      icon: '/lotus-pointer-2.svg',
      line2: 'Use of natural elements like water, yoga, and diet',
    },
    {
      img: '/images/naturopathy/section-3.webp',
      line1: 'Prevention & self-healing',
      icon: '/lotus-pointer-3.svg',
      line2: `Emphasis on prevention and the body's own healing`,
    },
  ]

  return (
    <div className='w-full mx-auto'>
      <div className='flex flex-col lg:flex-row justify-center text-center flex-wrap'>
        {/* First row: 3 items */}
        {items.map((item, i) => (
          <div
            key={i}
            className='w-full lg:w-1/3 flex flex-col-reverse lg:flex-col md:px-2 pb-2 lg:pb-8'
          >
            <div className='relative w-full h-[350px] max-w-full mb-4 overflow-hidden'>
              <ImageWithShimmer
                src={item.img}
                alt={item.line1}
                fill
                className={`object-cover w-full absolute top-0 left-0 right-0 bottom-0`}
              />
            </div>
            <div>
              <div className='flex flex-row gap-2  pb-2 items-center'>
                <Image
                  src={item.icon}
                  width={31}
                  height={24}
                  className='h-5 w-[26px]'
                  alt='Pointer'
                />
                <div>
                  <p className='text-slateGray text-left text-xl md:text-2xl font-ivyOra whitespace-break-spaces'>
                    {item.line1}
                  </p>
                </div>
              </div>
              <p className='text-slateGray mb-3 lg:mb-0 text-left text-base md:text-xl font-crimson whitespace-break-spaces'>
                {item.line2}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
