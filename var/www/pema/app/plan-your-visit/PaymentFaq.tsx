import ImageWithShimmer from '@/components/ImageWithShimmer'
import { ChevronDown, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const faqs2 = [
  {
    id: 1,
    question: 'Payment & booking policy',
    answer: [
      `To reserve your stay, we request a refundable deposit of ₹50,000. This allows us to share a short medical form with you and begin preparing your personalised program.`,
      `Once our doctors have reviewed and approved your form, 50% of the package value (less the deposit) will be collected to confirm your journey.`,
      `The final 50% is settled with ease upon arrival at Pema.`,
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
  {
    id: 2,
    question: 'Accepted payment methods',
    answer: [
      'International wire transfers',
      'Major credit cards (Visa, Mastercard, Amex)',
      'Bank drafts and certified checks',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
  {
    id: 3,
    question: 'Currency & pricing',
    answer: [
      'All prices quoted in Indian Rupees (₹)',
      // 'US Dollar and Euro pricing available upon request',
      'Exchange rate protection for advance bookings',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
]

const faqs1 = [
  {
    id: 1,
    question: 'Every program includes',
    answer: [
      'Luxury accommodation in your chosen suite',
      'All therapeutic meals crafted by Chef Rajiv',
      'Daily consultations with your healing team',
      'Personalized treatment protocols',
      'Spa and wellness facility access',
      'Private beach and healing grounds access',
      '24/7 guest services and medical support',
      'Post-program follow-up consultations (90 days)',
    ],
    hasCTA: false,
  },
  {
    id: 2,
    question: 'Not included',
    answer: [
      'International flights and travel insurance',
      'Visa fees and travel documentation',
      'Personal shopping and off-site excursions',
      'Additional spa treatments beyond your program',
    ],
    hasCTA: false,
  },
]

const PaymentFAQs = () => {
  const [openIndex1, setOpenIndex1] = useState(0)
  const [openIndex2, setOpenIndex2] = useState(0)
  return (
    <div className='mt-6 m-auto text-left'>
      <div className='md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
        <div className='relative w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
          <ImageWithShimmer
            src='/images/visit/payment-faq-web.webp'
            alt='payment'
            fill
            className='object-cover block md:hidden'
          />
          <ImageWithShimmer
            src='/images/visit/payment-faq-web.webp'
            alt='payment'
            fill
            className='object-cover hidden md:block'
          />
        </div>
        <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:mt-9'>
          <div className=' w-full max-w-[750px]'>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6'>
              {`What's included`}
            </div>

            {faqs1.map((item) => {
              return (
                <div key={item.id} className='border-b border-[#3233331A]  py-2'>
                  <div
                    onClick={() => setOpenIndex1(item.id === openIndex1 ? 0 : item.id)}
                    key={item.question}
                    className='cursor-pointer flex flex-row gap-2 text-base md:text-xl items-start justify-between text-slateGray mt-3 pb-2'
                  >
                    {item.question}
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

            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6 mt-6 md:mt-9'>
              Payment options{' '}
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
                      {item.id === 1 && (
                        <>
                          <div className='mt-3'>
                            <div className='text-base md:text-xl text-slateGray mt-0'>{`(Points mentioned above only apply to the non suite rooms)`}</div>
                          </div>
                          <div className='flex flex-row items-start gap-2 mt-3'>
                            <Image
                              src={'/images/kosha-pointer-icon.svg'}
                              alt={'/images/kosha-pointer-icon.svg'}
                              width={31}
                              height={24}
                            />
                            <div className='text-base md:text-xl text-slateGray mt-0'>
                              {
                                'Should our medical team feel the program is not suitable for you, your deposit will be refunded in full.'
                              }
                            </div>
                          </div>
                          <div className='flex flex-row items-start gap-2 mt-3'>
                            <Image
                              src={'/images/kosha-pointer-icon.svg'}
                              alt={'/images/kosha-pointer-icon.svg'}
                              width={31}
                              height={24}
                            />
                            <div className='text-base md:text-xl text-slateGray mt-0'>
                              {'For all the suites full payment is to be done while booking'}
                            </div>
                          </div>
                        </>
                      )}
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
            <div className='mt-3  md:mt-6 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'>
              Secure your booking <MoveRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFAQs
