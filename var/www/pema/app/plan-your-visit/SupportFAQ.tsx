import ImageWithShimmer from '@/components/ImageWithShimmer'
import { ChevronDown, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: '90-day integration period',
    answer: [
      'Weekly virtual consultations with your healing team',
      'Personalised protocol adjustments',
      'Nutrition and lifestyle guidance',
      'Herbal medicine and supplement support',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
  {
    id: 2,
    question: 'Lifetime connection',
    answer: [
      'Annual health check-in consultations',
      'Return visit planning and priority booking',
      'Alumni community access and events',
      'Seasonal wellness guidance and tips',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
]

const SupportFAQs = () => {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className='mt-6 m-auto text-left'>
      <div className='md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
        <div className='relative w-full md:h-[550] h-[350] overflow-hidden md:mb-3 mb-6'>
          <ImageWithShimmer
            src='/images/visit/visit-faq-web-new.webp'
            alt='visit'
            fill
            className='object-cover md:hidden block'
          />
          <ImageWithShimmer
            src='/images/visit/visit-faq-web-new.webp'
            alt='visit'
            fill
            className='object-cover hidden md:block'
          />
        </div>
        <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:mt-9'>
          <div className=' w-full max-w-[750px]'>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6'>
              Ongoing support program{' '}
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
              href={'#contact-us'}
              className='mt-3  md:mt-6 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Learn about aftercare <MoveRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportFAQs
