'use client'
import { ChevronDown, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'Can I book a stay without doing a program?',
    answer:
      'Yes. You can enjoy an open stay oceanfront luxury, spa therapies, and healing cuisine, without any schedule or consultation.',
    hasCTA: true,
    ctaText: 'Come visit Pema now',
    ctaLink: '/pema-lite',
  },
  {
    id: 2,
    question: 'I want a short luxury wellness weekend. Do you offer that?',
    answer:
      "Yes. Try Pema lite a 3-day reset with daily therapies and movement. It's perfect for a long weekend escape.",
    hasCTA: true,
    ctaText: 'Pema lite',
    ctaLink: '/pema-lite',
  },
  {
    id: 3,
    question: 'Is the property safe for solo travellers?',
    answer:
      'Very. We host guests from around the world, many of whom travel solo. The environment is secure, serene, and deeply cared for.',
  },
  {
    id: 4,
    question: 'Do I need to bring anything special for my stay?',
    answer:
      'Just your intention to rest. Our Pre-Arrival Guide helps you with everything else from what to pack to how to prep your body.',
    hasCTA: true,
    ctaText: 'Pre-Arrival Guide',
    ctaLink:
      'https://drive.google.com/file/d/1Zi1wbxbwhoqL8PPqzo_ouj1m6fFczsMP/view?usp=drive_link',
  },
  {
    id: 5,
    question: 'Can I book airport pickup from Visakhapatnam?',
    answer:
      'Yes. We offer smooth, luxury airport and railway transfers directly to Pema. zero stress, all comfort.',
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
                    <div>
                      <Link
                        target={item.ctaLink.includes('https') ? '_blank' : '_self'}
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
  )
}

export default FAQs
