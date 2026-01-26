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
    ctaText: 'Contact us ',
    ctaLink: '/contact-us',
  },
  {
    id: 2,
    question: "What's the best way to reach Pema?",
    hasCTA: true,
    ctaText: 'Check flight from your location',
    ctaLink: '/#maps',
    answer:
      "Fly or train into Visakhapatnam we'll handle the rest. Luxury transfers are available from airport or station to our doors.",
  },
  {
    id: 3,
    question: 'What if I want to come for just a few days?',
    answer: 'Book Pema lite a short wellness reset perfect for weekends or exploration.',
    hasCTA: true,
    ctaText: 'Pema lite',
    ctaLink: '/pema-lite',
  },
  {
    id: 4,
    question: 'Do I need to prep for my stay?',
    hasCTA: true,
    ctaText: 'Pre-Arrival Guide',
    ctaLink:
      'https://drive.google.com/file/d/1Zi1wbxbwhoqL8PPqzo_ouj1m6fFczsMP/view?usp=drive_link',
    answer:
      'A little. Our Pre-Arrival Guide helps you with everything else from food prep to what to expect emotionally.',
  },
  {
    id: 5,
    question: 'Is there a fixed intake day or can I come anytime?',
    answer:
      'You can arrive on any day - just check the availability here. Your program begins the morning after you check in.',
    hasCTA: true,
    ctaText: 'Check availability',
    ctaLink: '#contact-us',
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
