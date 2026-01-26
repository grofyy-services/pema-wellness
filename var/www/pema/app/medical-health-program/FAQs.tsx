'use client'
import { ChevronDown, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'I’ve tried everything diets, retreats, supplements. How is this different?',
    answer:
      'Most systems treat symptoms. Pema’s medical model is built to reverse root imbalances. This isn’t surface-level it’s a complete physiological and emotional rewire, guided by top naturopaths.',
  },
  {
    id: 2,
    question: 'Can this actually work for chronic, long-standing issues?',
    answer:
      'Yes. From PCOS to fatty liver to thyroid disorders we don’t manage symptoms, we correct root causes. The longer the issue, the more powerful the shift.',
  },
  {
    id: 3,
    question: 'Will I know what to do once I’m back home?',
    answer:
      'Yes. You’ll leave with a personalised 90-day protocol crafted by your lead doctor including food, movement, and lifestyle guidance.',
  },
  {
    id: 4,
    question: 'Can I stay connected to work while doing a medical program?',
    answer:
      'You can, but we don’t recommend it. Medical programs involve therapies, rest, and rhythm. True results come from presence.',
  },
  {
    id: 5,
    question: 'What if I want to try something shorter before committing?',
    answer:
      'You can explore Pema lite a 3-day wellness reset with no diagnostics or consultations. It’s designed for those who want to transition into a long-term wellness journey in a supportive environment.',
  },
  {
    id: 6,
    hasCTA: true,
    ctaText: 'Wellness journey',
    ctaLink: '/wellness-program',
    question: 'What if my issue isn’t medical but I just feel drained or off-balance?',
    answer:
      'Then a Wellness journey might be more aligned. These programs are designed to help your system reset even when there’s no diagnosed condition from energy dips to sleep disruption to stress. Explore what your body needs most.',
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
