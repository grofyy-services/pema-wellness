import ImageWithShimmer from '@/components/ImageWithShimmer'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const faqs1 = [
  {
    id: 1,
    question: 'Tourist visa',
    answer: [
      'Required for most international visitors',
      'Valid for 30-365 days depending on your nationality',
      'E-visa available for 171+ countries (processed in 2-4 business days)',
    ],
  },
  {
    id: 2,
    question: 'Medical visa',
    answer: [
      'Specifically for guests coming for medical programs',
      'Valid for up to 1 year with multiple entries',
      'Allows companion/attendant visas for family members',
    ],
  },
]

const faqs2 = [
  {
    id: 1,
    question: 'Complimentary assistance includes',
    answer: [
      'Personalised visa guidance based on your nationality',
      'Document preparation checklists',
      'Medical invitation letters for medical visa applications',
      'Embassy contact information and appointment scheduling support',
      '24/7 assistance for urgent visa matters',
    ],
  },
  {
    id: 2,
    question: 'Medical letter (support for medical visa applications, we provide)',
    answer: [
      'Official invitation from our Chief Medical Officer',
      'Detailed treatment plan overview',
      'Hospital registration certificates',
      'All documentation required by Indian consulates',
    ],
  },
]

const VisaFAQs = () => {
  const [openIndex1, setOpenIndex1] = useState(0)
  const [openIndex2, setOpenIndex2] = useState(0)
  return (
    <div className='mt-6 m-auto text-left'>
      <div className='md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
        <div className='relative w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
          <ImageWithShimmer
            src='/images/visit/visa-faq-web.webp'
            alt='visa'
            fill
            className='object-cover block md:hidden'
          />
          <ImageWithShimmer
            src='/images/visit/visa-faq-web.webp'
            alt='visa'
            fill
            className='object-cover hidden md:block'
          />
        </div>
        <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:mt-9'>
          <div className=' w-full max-w-[750px]'>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6'>
              Visa requirements{' '}
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
              Our visa support service{' '}
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

export default VisaFAQs
