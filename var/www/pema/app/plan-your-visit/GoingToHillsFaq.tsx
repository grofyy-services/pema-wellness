import ImageWithShimmer from '@/components/ImageWithShimmer'
import { ChevronDown, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'Visakhapatnam airport (VTZ)',
    answer: [
      'Direct flights from major Indian cities: Delhi, Mumbai, Bangalore, Hyderabad, Chennai',
      'International connections through Dubai, Singapore, and Kuala Lumpur',
      'Just 45 minutes from the airport to The Healing Hills',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
  {
    id: 2,
    question: 'International flight times to Visakhapatnam',
    answer: [
      'Dubai: 4 hours 30 minutes (direct flights available)',
      'Singapore: 4 hours (direct flights available)',
      'London: 13 hours 50 minutes (via Dubai or Singapore)',
      'New York: 18 hours (via Dubai or Singapore)',
      'Bangkok: 3 hours 15 minutes (direct flights available)',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
]

const GoingToHillsFAQs = () => {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className='mt-6 m-auto text-left'>
      <div className='md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
        <div className='relative w-full md:h-[550] h-[350] overflow-hidden md:mb-3 mb-6'>
          <ImageWithShimmer
            src='/images/visit/healing-faq-web.webp'
            alt='Chef and team in healing kitchen'
            fill
            className='object-cover block md:hidden'
          />
          <ImageWithShimmer
            src='/images/visit/healing-faq-web.webp'
            alt='Chef and team in healing kitchen'
            fill
            className='object-cover hidden md:block'
          />
        </div>
        <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:mt-9'>
          <div className=' w-full max-w-[750px]'>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6'>
              Flying to Visakhapatnam{' '}
            </div>

            {faqs.map((item) => {
              return (
                <div key={item.id} className='border-b border-[#3233331A]  py-2'>
                  <div
                    onClick={() => setOpenIndex(item.id === openIndex ? 0 : item.id)}
                    key={item.question}
                    className='cursor-pointer flex flex-row gap-2 text-base md:text-xl items-start justify-between text-slateGray mt-3 pb-2'
                  >
                    {item.question}
                    <ChevronDown
                      className={`${item.id === openIndex ? 'rotate-180' : ''} transition-all duration-150`}
                    />
                  </div>
                  {openIndex === item.id && (
                    <div>
                      {item.answer.map((pointer) => {
                        return (
                          <div key={pointer} className='flex flex-row items-start gap-2 mt-3'>
                            <Image
                              src={'/images/kosha-pointer-icon.svg'}
                              alt={'/images/kosha-pointer-icon.svg'}
                              width={31}
                              height={24}
                            />
                            <div className='text-base md:text-xl text-slateGray mt-0'>
                              {pointer}
                            </div>
                          </div>
                        )
                      })}

                      {item.hasCTA && (
                        <div>
                          <Link
                            href={item.ctaLink!}
                            className='mt-3 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                          >
                            {item.ctaText} <MoveRight />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            <Link
              href={'/#maps'}
              className='mt-3  md:mt-6 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Check flight from your location
              <MoveRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoingToHillsFAQs
