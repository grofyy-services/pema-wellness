'use client'
import { ChevronDown, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'What makes your approach different from other retreats?',
    answer:
      "We don't treat symptoms, we treat systems. Our method blends diagnostics, movement, stillness, and nutrition to reset your root imbalances.",
  },
  {
    id: 2,
    question: 'Why do you recommend a minimum of 8 days?',
    answer:
      "Because that's how long it takes for the body to settle, release, and begin to rebuild. Anything shorter usually doesn't unlock deeper shifts.",
  },
  {
    id: 3,
    question: "What if I want to explore Pema but can't commit to 8 days?",
    hasCTA: true,
    ctaText: 'Pema lite',
    ctaLink: '/pema-lite',
    answer:
      'We now offer Pema lite a 3-day wellness reset that lets you experience our methods in a lighter, more flexible format.',
  },
  {
    id: 4,
    question: 'Do I have to follow strict routines or fast?',
    answer:
      'Not unless your doctor recommends it. Our protocols are personalized; we meet you where you are and build from there.',
  },
  {
    id: 5,
    question: 'What happens after I leave Pema?',
    answer:
      "You'll receive a detailed home protocol with diet, rituals, and check-ins to support long-term healing.",
  },
]

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className='flex md:justify-center  justify-start mx-0 mb-3 md:text-center'>
      <div className=' w-full max-w-[750px]'>
        {faqs.map((item) => {
          return (
            <div key={item.id} className='border-b border-[#3233331A] px-4 py-2'>
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
                    <Link
                      href={item.ctaLink!}
                      className='mt-3 font-crimson text-base md:text-lg text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                    >
                      {item.ctaText} <MoveRight />
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FAQs
