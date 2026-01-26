import ImageWithShimmer from '@/components/ImageWithShimmer'
import PrimaryButton from '@/components/PrimaryButton'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const faqs2 = [
  {
    id: 1,
    question: 'Multilingual team',
    answer: [
      'English (primary communication language)',
      'Hindi, Telugu, Tamil (local languages)',
      'Basic French, German, Spanish support available',
      'Translation services for complex medical discussions',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
]

const faqs1 = [
  {
    id: 1,
    question: 'Respectful practices',
    answer: [
      'Removal of shoes in meditation and yoga spaces',
      'Quiet conversation and mindful presence',
      'Respect for local customs and traditions',
    ],
    hasCTA: false,
  },
  {
    id: 2,
    question: 'Sacred rituals',
    answer: [
      'Optional participation in traditional healing ceremonies',
      'Sunrise and sunset ritual practices',
      'New moon and full moon observances',
      'Seasonal celebration ceremonies',
    ],
    hasCTA: false,
  },
]

const PreparationFAQs = () => {
  const [openIndex1, setOpenIndex1] = useState(0)
  const [openIndex2, setOpenIndex2] = useState(0)
  return (
    <div className='mt-6 m-auto text-left'>
      <div className='md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
        <div className='relative w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
          <ImageWithShimmer
            src='/images/visit/culture-faq-mobile.webp'
            alt='culture-faq'
            fill
            className='object-cover md:hidden block'
          />
          <ImageWithShimmer
            src='/images/visit/culture-faq-web.webp'
            alt='culture-faq'
            fill
            className='object-cover hidden md:block'
          />
        </div>
        <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:mt-9'>
          <div className=' w-full max-w-[750px]'>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6'>
              Cultural sensitivity{' '}
            </div>

            {faqs1.map((item) => {
              return (
                <div key={item.id} className='border-b border-[#3233331A]  py-2'>
                  <div
                    onClick={() => setOpenIndex1(item.id === openIndex1 ? 0 : item.id)}
                    key={item.question}
                    className='cursor-pointer flex flex-row gap-2 text-base md:text-xl items-start justify-between text-slateGray mt-3 pb-2'
                  >
                    <div>
                      <div>{item.question}</div>
                    </div>
                    <ChevronDown
                      className={`${item.id === openIndex1 ? 'rotate-180' : ''} transition-all duration-150`}
                    />
                  </div>
                  {openIndex1 === item.id && (
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
                    </div>
                  )}
                </div>
              )
            })}

            <div
              className='text-xl md:text-[24px] text-slateGray 
            font-ivyOra md:mb-6 mt-6 md:mt-9'
            >
              Language support{' '}
            </div>

            {faqs2.map((item) => {
              return (
                <div key={item.id} className='border-b border-[#3233331A]  py-2'>
                  <div
                    onClick={() => setOpenIndex2(item.id === openIndex2 ? 0 : item.id)}
                    key={item.question}
                    className='cursor-pointer flex flex-row gap-2 text-base md:text-xl items-start justify-between text-slateGray mt-3 pb-2'
                  >
                    {item.question}
                    <ChevronDown
                      className={`${item.id === openIndex2 ? 'rotate-180' : ''} transition-all duration-150`}
                    />
                  </div>
                  {openIndex2 === item.id && (
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
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreparationFAQs
