import ImageWithShimmer from '@/components/ImageWithShimmer'
import PrimaryButton from '@/components/PrimaryButton'
import { ChevronDown, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const faqs2 = [
  {
    id: 1,
    question: 'Highly recommended coverage',
    answer: [
      'Medical emergency and evacuation',
      'Trip cancellation and interruption',
      'Lost or delayed baggage',
      'Travel delay compensation',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
]

const faqs1 = [
  {
    id: 1,
    question: '24/7 Medical care:',
    answer: [
      'Qualified naturopathic physicians on-site',
      'Emergency medical protocols in place',
      'Nearby hospital partnerships for serious emergencies',
      'Telemedicine consultations with international specialists',
    ],
    hasCTA: false,
  },
  {
    id: 2,
    question: 'Health protocols:',
    answer: [
      'Comprehensive health screening upon arrival',
      'Daily wellness monitoring throughout your stay',
      'Personalised nutrition and activity modifications',
      'Gentle detox support and guidance',
    ],
    hasCTA: false,
  },
]

const HealthSafetyFAQ = () => {
  const [openIndex1, setOpenIndex1] = useState(0)
  const [openIndex2, setOpenIndex2] = useState(0)
  return (
    <div className='mt-6 m-auto text-left'>
      <div className='md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
        <div className='relative w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
          <ImageWithShimmer
            src='/images/visit/health-faq-mobile.webp'
            alt='health'
            fill
            className='object-cover md:hidden block'
          />
          <ImageWithShimmer
            src='/images/visit/health-faq-web.webp'
            alt='health'
            fill
            className='object-cover hidden md:block'
          />
        </div>
        <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:mt-9'>
          <div className=' w-full max-w-[750px]'>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6'>
              Medical support{' '}
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
              Travel insurance{' '}
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
            <div className='text-base md:text-xl text-slateGray mt-3 md:mt-6'>
              {
                'We can recommend trusted travel insurance providers familiar with wellness travel to India.'
              }
            </div>
            <Link
              href={'#contact-us'}
              className='mt-3  font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Get insurance recommendations
              <MoveRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthSafetyFAQ
