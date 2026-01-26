'use client'
import { ChevronDown, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'Do you offer help with visa or travel planning?',
    answer:
      'Yes. We provide visa support letters and guidance on planning your route. You can find it here',
    hasCTA: true,
    ctaText: 'here',
    ctaLink: '/plan-your-visit',
  },
  {
    id: 2,
    question: "What's the best way to reach Pema?",
    answer:
      "Fly or train into Visakhapatnam we'll handle the rest. Luxury transfers are available from airport or station to our doors.",
  },
  {
    id: 3,
    question: 'What if I want to come for just a few days?',
    answer: 'Book Pema lite a short wellness reset perfect for weekends or exploration.',
  },
  {
    id: 4,
    question: 'Do I need to prep for my stay?',
    answer:
      "A little. You'll get a full Pre-Arrival Guide once you book with everything from food prep to what to expect emotionally.",
  },
  {
    id: 5,
    question: 'Is there a fixed intake day or can I come anytime?',
    answer:
      'You can arrive on any day - just check the availability here Your program begins the morning after you check in.',
  },
]

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className=' m-auto text-left'>
      <div className='flex md:justify-center  justify-start md:mx-5 mx-0 mb-3 md:text-center'>
        <div className=' w-full max-w-[750px]'>
          <div className='text-[20px] md:text-[24px] text-pemaBlue md:text-slateGray font-ivyOra py-2 text-left leading-[120%] m-auto'>
            Medical programs{' '}
          </div>
          {faqs.map((item) => {
            return (
              <div key={item.id} className='border-b border-[#3233331A]  py-2'>
                <div
                  onClick={() => setOpenIndex(item.id === openIndex ? 0 : item.id)}
                  key={item.question}
                  className='cursor-pointer flex flex-row gap-2 text-base md:text-lg items-start justify-between text-slateGray mt-3 pb-2'
                >
                  {item.question}
                  <ChevronDown
                    className={`${item.id === openIndex ? 'rotate-180' : ''} transition-all duration-150`}
                  />
                </div>
                {openIndex === item.id && (
                  <div>
                    <div className='text-slateGray text-left font-crimson text-base md:text-lg mt-2'>
                      {item.answer}
                    </div>
                    {item.hasCTA && (
                      <div>
                        <Link
                          href={item.ctaLink!}
                          className='mt-3 font-crimson text-base md:text-lg text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
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
        </div>
      </div>
    </div>
  )
}

export default FAQs
