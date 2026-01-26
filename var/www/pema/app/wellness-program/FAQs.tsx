'use client'
import { ROUTES } from '@/utils/utils'
import { ChevronDown, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: `What if I’m healthy but just feel… off?`,
    answer: `Then you’re in the right place. Most imbalances don’t show up on tests. If you feel like your energy or clarity has dropped  it’s time to reset.`,
  },
  {
    id: 2,
    question: 'Can I come with my partner or family?',
    hasCTA: true,
    ctaText: 'Inquire here ',
    ctaLink: 'https://zfrmz.in/BV6GDJEKhWpr1RX4a6lF',
    answer: `Couples can join programs together, and families are welcome with dedicated caregiver support for kids under 18. We offer thoughtfully adapted programs for children and teens, from creative and nature-based activities to gentle wellness resets. Toddlers and younger children are also cared for with customised meals and supervised spaces. Many guests return with loved ones after experiencing the shift themselves.`,
  },
  {
    id: 3,
    question: 'What if I choose the wrong program?',
    answer: `You won’t. Our team does a full diagnostic before anything begins. If another path suits you better, we’ll switch it without stress.`,
  },
  {
    id: 4,
    hasCTA: true,
    ctaText: 'Check it out here ',
    ctaLink: ROUTES.pemaLite,
    question: 'I only have a few days. Is that enough?',
    answer: `You can begin with Pema lite, a 3-day reset that introduces you to our approach without requiring a full commitment.`,
  },
  {
    id: 5,
    question: 'Is this about yoga and spirituality? I just want to feel better.',
    answer: `No beliefs required. At Pema, our programs are grounded in naturopathy and clinical science. Food, rest, breath, and movement are structured to restore balance, with yoga and meditation offered as practical tools for resilience, not as rituals you must follow.`,
  },
  {
    id: 6,
    hasCTA: true,
    ctaText: 'Medical Programs ',
    ctaLink: ROUTES.medicalHealthProgram,
    question:
      'What if I have a diagnosed issue like PCOS or thyroid? Should I still do a wellness program?',
    answer: `We recommend exploring our Medical Programs instead — especially if you're dealing with hormonal, metabolic, or chronic conditions. These are designed with diagnostics, physician-led protocols, and targeted therapies. Learn more about them on the`,
  },
]

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className='flex md:justify-center  justify-start text-left  mx-0 mb-3 md:text-center'>
      <div className=' w-full max-w-[750px]'>
        {faqs.map((item) => {
          return (
            <div key={item.id} className='border-b border-[#3233331A] px-4 py-2'>
              <div
                onClick={() => setOpenIndex(item.id === openIndex ? 0 : item.id)}
                key={item.question}
                className='cursor-pointer text-left flex flex-row gap-2 text-base md:text-lg items-start justify-between text-slateGray mt-3 pb-2'
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
                      target={item.ctaLink.includes('https') ? '_blank' : '_self'}
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
