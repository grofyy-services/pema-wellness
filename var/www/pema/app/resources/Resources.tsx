'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import Marquee from 'react-fast-marquee'
import { useRef } from 'react'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Resources  ' }]
import CountryDropdown from '@/components/CountryDropDown'
import FAQs from './FAQs'
import TextTestimonialCard from '@/components/TextTestimonials'
import MedicalFAQs from './MedicalFaq'
import WellnessFAQs from './WellnessFaq'
import SanctuaryFAQs from './SancturyFaq'
import ApproachFAQs from './ApproachFaq'
import VisitFAQs from './VisitFaq'
import { openPemaPrograms, openPreArrivalGuide, ROUTES } from '@/utils/utils'
import ImageWithShimmer from '@/components/ImageWithShimmer'

const testData = [
  {
    name: `R.R.`,
    review: `‘I’ve been to every luxury retreat from Bali to Portugal. Nothing came close to the depth of healing I experienced here.’`,
    id: 1,
  },
  {
    name: 'Manju Malpani',
    review: `‘Everything at Pema is very good, including the food, healers, pool, and staff discipline. We received more than we expected and are very satisfied with our experience. It didn’t feel like our first time at Pema. The front office staff is excellent, and the pool is wonderful.’`,
    id: 2,
  },
  {
    name: 'Priya Kapadia',
    review: `‘Everything is good, keep it up. All the staff across all departments are very efficient, caring, and polite, and they have made me feel very comfortable. Thank you.’`,
    id: 3,
  },
  {
    name: 'Madhuri Kela',
    review: `‘Absolutely amazing place the services are amazing specially the staff is brilliant.’`,
    id: 4,
  },
]
export default function Resources() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center md:mb-2 mt-4 md:mt-9'>
        Resources{' '}
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center'>
        Everything you need before, during, and after your journey.{' '}
      </div>

      <div className='px-4'>
        <div className='relative mt-4 md:mt-6 w-full h-[470px] md:h-[630px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/resources/hero-mobile.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover block md:hidden absolute top-0 left-0 `}
          />
          <ImageWithShimmer
            src={'/images/resources/hero-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover hidden md:block absolute top-0 left-0 `}
          />
        </div>
      </div>

      <div className='mt-12 md:mt-20 m-auto'>
        <div className='px-4 text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
          Frequently asked questions{' '}
        </div>
        <div className='mt-6 md:t-9 md:grid md:grid-cols-2 gap-5 w-full'>
          <div>
            <MedicalFAQs />
          </div>
          <div className='md:mt-0 mt-9'>
            <WellnessFAQs />
          </div>
        </div>
        <div className='mt-6 md:t-9 md:grid md:grid-cols-2 gap-5 w-full'>
          <div>
            <SanctuaryFAQs />
          </div>
          <div className='md:mt-0 mt-9'>
            <ApproachFAQs />
          </div>
        </div>
        <div className='mt-6 md:t-9 md:grid md:grid-cols-2 gap-5 w-full'>
          <div>
            <VisitFAQs />
          </div>
          <div className='md:mt-0 mt-9'></div>
        </div>
      </div>

      {/* 
      
      */}
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='mt-6 md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
          <div className='relative hidden md:block w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
            <ImageWithShimmer
              src='/images/resources/resources-1.webp'
              alt='prepare'
              fill
              className='object-cover'
            />
          </div>
          <div className='md:mt-9'>
            {' '}
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra md:mb-2'>
              Pre-arrival guide{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-0 md:mb-2'>
              Prepare your body. Prepare your mind.{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-0'>
              Your journey begins before you arrive. The pre-arrival guide outlines everything from
              what to pack to how to slowly adjust your routines so your system is ready to
              receive.{' '}
            </div>
            <div className='flex flex-row items-start gap-2 mt-3'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                Adjusting sleep and meal timing{' '}
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
                Pre-cleanse food suggestions{' '}
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
                Medications, supplements, and what to bring{' '}
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
                What not to bring so your body can truly rest{' '}
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
                What to expect emotionally as you begin releasing{' '}
              </div>
            </div>
            <PrimaryButton onClick={openPreArrivalGuide} className='w-full md:mt-6 mt-3'>
              Download pre-arrival guide
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='mt-6 md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
          <div className='relative hidden md:block w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
            <ImageWithShimmer
              src='/images/visit/visit-faq-web-new.webp'
              alt='prepare'
              fill
              className='object-cover'
            />
          </div>
          <div className='md:mt-9'>
            {' '}
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra md:mb-2'>
              Post-program support
            </div>
            <div className='text-base md:text-xl text-slateGray mt-0 md:mb-2'>
              {`Healing doesn’t end when you leave it expands.`}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2'>
              {`After your program, we offer structured post-care support to help integrate everything
              you’ve gained.`}
            </div>
            <div className='flex flex-row items-start gap-2 mt-3'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                90-day home protocol designed by your lead doctor{' '}
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
                Email check-ins and progress assessments{' '}
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
                Nutrition, movement, and breathwork reminders{' '}
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
                Access to curated rituals and recipe guides{' '}
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
                Connection with our practitioner network, if needed{' '}
              </div>
            </div>
            <PrimaryButton className='w-full md:mt-6 mt-3'>
              Download sample post-program plan{' '}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='mt-6 md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
          <div className='relative hidden md:block w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
            <ImageWithShimmer
              src='/images/resources/resources-3.webp'
              alt='prepare'
              fill
              className='object-cover'
            />
          </div>
          <div className=''>
            {' '}
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra md:mb-5'>
              What to expect in your first 24 hours{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-0'>
              We pay close attention to your first few hours, gently settling your mind, body, and
              nervous system so you can fully receive the healing ahead.{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2'>
              Our guest team will greet you and take you through a private check-in and baseline
              diagnostic session. There are no forms, and there is no rush, just space to
              arrive.{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2 md:mt-4'>
              From there, your first 24 hours include
            </div>
            <div className='flex flex-row items-start gap-2 mt-2'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                A gentle detox meal based on your dosha and energy state{' '}
              </div>
            </div>
            <div className='flex flex-row items-start gap-2 mt-2'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                Your first breath-led therapy or movement session{' '}
              </div>
            </div>
            <div className='flex flex-row items-start gap-2 mt-2'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                Time to rest, walk, or simply be{' '}
              </div>
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2 md:mt-8'>
              Most guests say the same thing{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2'>
              {`‘It took just one day to realise how far from myself I had been.’`}{' '}
            </div>
            <Link
              href={'#contact-us'}
              className='mt-8 font-crimson text-base md:text-lg text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Book your stay with Pema now
              <MoveRight />
            </Link>
          </div>
        </div>
      </div>

      {/* test */}
      <div className='mt-20 max-w-[1360px] m-auto'>
        <TextTestimonialCard
          bgMobile='/images/resources/test-bg-mobile.webp'
          bgWeb='/images/resources/test-bg-web.webp'
          data={testData}
        />
      </div>

      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='mt-6 md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
          <div className='relative hidden md:block w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
            <ImageWithShimmer
              src='/images/resources/resources-4.webp'
              alt='prepare'
              fill
              className='object-cover'
            />
          </div>
          <div className='md:mt-9'>
            {' '}
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra md:mb-6'>
              {`              Still deciding? Here’s what we recommend
`}{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-0'>
              A gentle guide to help guests self-select their next step.
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2'>
              {`If you're feeling pulled to Pema but aren't sure where to begin, you're not alone.
              Most of our guests feel that way before their first visit.`}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2 md:mt-8'>
              {`Here's what we suggest`}
            </div>
            <div className='flex flex-row items-start gap-2 mt-2'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                Read the{' '}
                <span
                  onClick={openPreArrivalGuide}
                  className='text-pemaBlue border-b border-pemaBlue cursor-pointer'
                >
                  Pre-Arrival Guide{' '}
                </span>{' '}
                to understand how the journey works{' '}
              </div>
            </div>
            <div className='flex flex-row items-start gap-2 mt-2'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                <span
                  onClick={openPemaPrograms}
                  className='text-pemaBlue border-b border-pemaBlue cursor-pointer'
                >
                  {' '}
                  Browse Programs{' '}
                </span>
                and see what resonates with your current phase{' '}
              </div>
            </div>
            <div className='flex flex-row items-start gap-2 mt-2'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                <a
                  href='#contact-us'
                  className='text-pemaBlue border-b border-pemaBlue cursor-pointer'
                >
                  Book a Free discovery call{' '}
                </a>
                with our wellness advisor{' '}
              </div>
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2 md:mt-8'>
              Most guests say the same thing{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-2'>
              Healing is personal. We’ll help you find the entry point that’s right for you.{' '}
            </div>
          </div>
        </div>
      </div>

      {/* sticky section */}
      <Link href={ROUTES.contactUs}>
        <PrimaryButton className='hidden lg:flex rotate-270 fixed right-[-52px] z-11 top-1/2'>
          Get in touch
        </PrimaryButton>
      </Link>
      <WhatsappStickyButton />
    </div>
  )
}
