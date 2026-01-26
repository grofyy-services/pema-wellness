import ImageWithShimmer from '@/components/ImageWithShimmer'
import PrimaryButton from '@/components/PrimaryButton'
import { ROUTES, takeOurHealthQuiz } from '@/utils/utils'
import { ChevronDown, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const faqs2 = [
  {
    id: 1,
    question: 'Climate & weather',
    answer: [
      'Tropical coastal climate with ocean breezes',
      'Average temperature: 24-32°C (75-90°F)',
      'Light, breathable fabrics recommended',
      'Gentle rain possible during monsoon season (June-September)',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
  {
    id: 2,
    question: 'What to pack',
    answer: [
      'Comfortable, loose-fitting clothing for yoga and movement',
      'Swimwear for hydrotherapy and ocean activities',
      'Light cotton clothing in white and natural colors',
      'Comfortable walking shoes for nature trails',
      'Sun protection (hat, sunglasses, natural sunscreen)',
      'Personal meditation cushion or yoga mat (optional)',
      'Journal for reflection and insights',
      'Any special items that bring you comfort',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
  {
    id: 3,
    question: 'What we provide',
    answer: [
      'Organic cotton robes and comfortable wear',
      'Yoga mats and meditation cushions',
      'Beach towels and swimming gear',
      'All therapeutic and spa amenities',
      'Healing herbal preparations',
    ],
    hasCTA: false,
    ctaText: 'Come visit pema now',
    ctaLink: '/pema-lite',
  },
]

const faqs1 = [
  {
    id: 1,
    question: 'Comprehensive health evaluation (Completed 2 weeks before arrival)',
    answer: [
      'Detailed health history questionnaire',
      'Current medication and supplement review',
      'Healing goals and expectations discussion',
      'Customised program recommendations',
    ],
    hasCTA: false,
  },
  {
    id: 2,
    question: 'Medical records mandatory to bring',
    answer: [
      'Recent blood test results (within 6 months)',
      'Imaging reports (X-rays, MRIs, CT scans)',
      'Current prescription medications',
      'Previous medical consultation notes',
    ],
    hasCTA: false,
  },
]

const PreparationFAQs = () => {
  const router = useRouter()
  const [openIndex1, setOpenIndex1] = useState(0)
  const [openIndex2, setOpenIndex2] = useState(0)
  return (
    <div className='mt-6 m-auto text-left'>
      <div className='md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
        <div className='relative w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
          <ImageWithShimmer
            src='/images/visit/prepare-faq-web.webp'
            alt='prepare'
            fill
            className='object-cover block md:hidden'
          />
          <ImageWithShimmer
            src='/images/visit/prepare-faq-web.webp'
            alt='prepare'
            fill
            className='object-cover hidden md:block'
          />
        </div>
        <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:mt-9'>
          <div className=' w-full max-w-[750px]'>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6'>
              Pre-arrival health assessment{' '}
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

            <PrimaryButton
              onClick={() => router.push(ROUTES.medicalHealthAssessment)}
              className='w-full mt-4'
            >
              Take the quiz now
            </PrimaryButton>
            <div className='text-xl md:text-[24px] text-slateGray font-ivyOra md:mb-6 mt-6 md:mt-9'>
              Packing for The Healing Hills{' '}
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
            <div className='mt-3  md:mt-6 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'>
              Secure your booking <MoveRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreparationFAQs
