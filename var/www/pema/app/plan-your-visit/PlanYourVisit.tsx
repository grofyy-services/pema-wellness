'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import Marquee from 'react-fast-marquee'
import { useRef } from 'react'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Plan your visit  ' }]
import FAQs from './FAQs'

import { roomDataPlanVisit } from '../booking/utils'
import GoingToHillsFAQs from './GoingToHillsFaq'
import PaymentFAQs from './PaymentFaq'
import VisaFAQs from './VisaFaq'
import PreparationFAQs from './PreparationFaq'
import CluturalFAQs from './CulturalFAQ'
import HealthSafetyFAQ from './HealthSafetyFAQ'
import SupportFAQs from './SupportFAQ'
import { ROUTES } from '@/utils/utils'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { useAtomValue } from 'jotai'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import MapsSection from '../homepage/Maps'
import ImageWithShimmer from '@/components/ImageWithShimmer'

export default function PlanYourVisit() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const currency = useAtomValue(selectedCurrencyAtom)

  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center md:mb-2 mt-4 md:mt-9'>
        Plan your visit
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center'>
        Your journey to The Healing Hills begins here{' '}
      </div>

      <div className='px-4'>
        <div className='relative mt-4 md:mt-6 w-full h-[470px] md:h-[630px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/visit/hero-mobile.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover block md:hidden absolute top-0 left-0 `}
          />
          <ImageWithShimmer
            src={'/images/visit/hero-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover hidden md:block absolute top-0 left-0 `}
          />
        </div>
      </div>

      {/* contactus us and whatsapp button */}

      <div className='px-4'>
        <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
          <Marquee className='mr-4'>
            {' '}
            <Check className='ml-4' /> 20,000+ chronic conditions reversed on the Healing Hills
          </Marquee>
        </div>
      </div>

      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='text-[28px] whitespace-pre-line md:whitespace-normal md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
          Your guide to arriving,{'\n'} the Pema way{' '}
        </div>
        <div className='whitespace-pre-line md:whitespace-normal text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
          From the moment you decide to heal,{'\n'} every detail is taken care of.{' '}
        </div>
        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full mt-2'>
          Your transformation begins not when you arrive at Pema, but when you first envision
          yourself on The Healing Hills. We understand that planning a healing journey especially to
          a sacred place thousands of miles away requires trust, clarity, and seamless support.This
          is your comprehensive guide to arriving with ease and leaving transformed.
        </div>
        <div className=''>
          <div className='relative mt-4 md:mt-6 w-full h-[350]  md:h-[517] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/visit/hero-2-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover block md:hidden absolute top-0 left-0 `}
            />
            <ImageWithShimmer
              src={'/images/visit/hero-2-web.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover hidden md:block absolute top-0 left-0 `}
            />
          </div>
        </div>
      </div>
      <div className='mt-12 md:mt-20 px-4'>
        <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          Getting to the healing hills{' '}
        </div>
        <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
          Your gateway to transformation{' '}
        </div>
        <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
          Pema sits on the sacred Healing Hills of Visakhapatnam, easily accessible yet beautifully
          secluded. The journey to healing has never been more effortless.{' '}
        </div>
        <GoingToHillsFAQs />
      </div>

      {/* from to map lcoation section web+mobile */}
      <div id='maps' className='mt-10 md:mt-20 max-w-[1360px] m-auto scroll-m-[100px]'>
        <div className='hidden md:block text-[40px] text-pemaBlue font-ivyOra px-4 text-center mb-2'>
          Arrive unseen. Heal undisturbed.
          <br /> Privacy uncompromised.{' '}
        </div>{' '}
        <div className='block md:hidden text-[32px] text-pemaBlue font-ivyOra px-4 text-center mb-4 leading-[120%]'>
          Arrive unseen.
          <br /> <span className='italic'>Heal undisturbed.</span>
        </div>{' '}
        <div className='px-4  text-lg leading-[110%] md:leading-[1.1] md:text-xl text-slateGray font-crimson text-center mb-4 md:mb-6 md:w-[80%] w-full m-auto'>
          {` Our remote location atop a hill coupled with the proximity of Visakhapatnam's commercial
          and private airports offers anonymous access to anyone wishing to slip in and out under
          the radar. The privacy continues on site.`}
        </div>
        <div>
          <MapsSection />
        </div>
        <Link
          href={'#contact-us'}
          className='md:hidden mt-8 font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
        >
          Book now
          <MoveRight />
        </Link>
      </div>
      <div className='mt-12 md:mt-20 m-auto p-4 md:p-10 bg-softSand'>
        <div className='text-[28px] md:text-[40px] md:w-full w-[80%] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] md:m-auto'>
          Accommodation & investments{' '}
        </div>
        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
          {`Every suite at Pema is positioned to harness The Healing Hills' natural energy while
          providing luxury comfort for your transformation.`}{' '}
        </div>
        <div className='text-[20px] md:text-[32px] mt-6 md:mt-0 text-slateGray font-ivyOra md:py-6 text-left md:text-center leading-[120%] m-auto'>
          Accommodation options{' '}
        </div>
        <div className='mt-3 md:mt-0'>
          {Object.values(roomDataPlanVisit).map((item) => {
            return (
              <div
                key={item.category}
                className=' md:grid md:grid-cols-[66%_33%] gap-5 w-full mb-6'
              >
                <div className='block md:hidden'>
                  <div className='text-base text-slateGray mb-3'>
                    {item.category}
                    {' ('}
                    {item.area}
                    {')'}
                  </div>
                </div>
                <div className='relative w-full md:h-[730] h-[350] overflow-hidden mb-3'>
                  <ImageWithShimmer
                    src={item.coverImageWeb}
                    alt='Chef and team in healing kitchen'
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='text-left flex flex-col justify-center'>
                  <div className='text-slateGray hidden md:block  font-ivyOra text-[24px] md:text-[32px] '>
                    {item.category}
                  </div>
                  <div className='hidden md:block text-base md:text-xl text-slateGray mb-6'>
                    {item.area}
                  </div>
                  {item.inclusions.map((pointer) => {
                    return (
                      <div key={pointer} className='flex flex-row items-start gap-2 mt-3'>
                        <Image
                          src={'/images/kosha-pointer-icon.svg'}
                          alt={'/images/kosha-pointer-icon.svg'}
                          width={31}
                          height={24}
                        />
                        <div className='text-base md:text-xl text-slateGray mt-0'>{pointer}</div>
                      </div>
                    )
                  })}

                  <div className=' pb-3 w-full mt-3'>
                    <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                      Investment starts from:{' '}
                    </div>
                    <div className=' flex flex-row justify-between items-center'>
                      <div className='text-slateGray text-base md:text-[20px]'>
                        {convertINRUsingGlobalRates(item.price, currency)}/ night
                      </div>
                      {/* <CountryDropdown /> */}
                    </div>
                  </div>
                  <PrimaryButton className='w-full md:mt-3'>
                    <Link href={'#contact-us'}>Book now</Link>
                  </PrimaryButton>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className='mt-12 md:mt-20 m-auto px-4'>
        {/* Healing cuisine Section */}
        <div className='mt-12 md:mt-20 m-auto '>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            Program duration
          </div>

          {/* 2 Image Row - Desktop */}
          <div className=' md:grid md:grid-cols-[66%_33%] gap-4 w-full mt-6'>
            <div className='flex flex-col-reverse md:block'>
              <div className='relative w-full md:h-[550] h-[350] overflow-hidden md:mb-3 mb-6'>
                <ImageWithShimmer
                  src='/images/visit/duration-1-web.webp'
                  alt='Chef and team in healing kitchen'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='text-left'>
                <h3 className='text-[20px] md:text-[24px] text-slateGray font-ivyOra mb-2'>
                  Medical programs (8-30 days){' '}
                </h3>
                <p className='text-base md:text-xl text-slateGray font-crimson mb-3 md:w-[60%] leading-tight'>
                  Focused healing plans tailored to address specific health conditions through
                  proven therapeutic protocols.
                </p>
                <Link
                  href='/medical-health-program'
                  className='font-crimson text-base md:text-lg text-pemaBlue mb-3 md:mb-0 flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                >
                  View program details
                  <MoveRight />
                </Link>
              </div>
            </div>
            <div className='flex flex-col-reverse md:block'>
              <div className='relative w-full md:h-[550px] h-[350px] overflow-hidden  md:mb-3 mb-6'>
                <ImageWithShimmer
                  src='/images/visit/duration-web-2.webp'
                  alt='Guest enjoying healing meal'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='text-left'>
                <h3 className='text-[20px] md:text-[24px] text-slateGray font-ivyOra mb-2'>
                  Wellness journeys (8-30 days){' '}
                </h3>
                <p className='text-base md:text-xl text-slateGray font-crimson mb-3 leading-tight'>
                  Immersive experiences for renewal and balance, including oceanfront detox,
                  rejuvenation, and couples retreats.
                </p>
                <Link
                  href='/wellness-program'
                  className='font-crimson text-base md:text-lg text-pemaBlue mb-3 flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                >
                  View program details
                  <MoveRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Your private beach Section */}
        <div className='mt-0 md:mt-9 m-auto'>
          <div className='md:grid grid-cols-[66%_33%] grid-rows-1 gap-3 md:gap-4 flex flex-col-reverse'>
            <div className='relative w-full h-[350px] md:h-[550px] overflow-hidden'>
              <ImageWithShimmer
                src='/images/visit/pema-lite-web.webp'
                alt='Private beach with couple walking'
                fill
                className='object-cover hidden md:block'
              />
              <ImageWithShimmer
                src='/images/visit/pema-lite-mobile.webp'
                alt='Private beach with couple walking'
                fill
                className='object-cover md:hidden block'
              />
            </div>
            <div className='flex flex-col justify-start md:mt-9'>
              <div className='text-[20px] md:text-[24px] text-slateGray font-ivyOra py-2 text-left leading-[120%]'>
                Pema lite (3 days){' '}
              </div>
              <div className='text-base md:text-xl text-slateGray font-crimson leading-tight text-left'>
                Pema lite is a curated 3-day reset designed for guests who want a taste of healing
                without the commitment of a full retreat.
              </div>
              <Link
                href='/pema-lite'
                className='font-crimson text-base md:text-lg text-pemaBlue my-3 flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                View program details
                <MoveRight />
              </Link>
            </div>
          </div>
        </div>

        {/* 
          
          
          
          
          
          3 image view - 1 
          
          
          
          
          
          */}

        <div
          ref={(el: HTMLDivElement | null): void => {
            sectionRefs.current[1] = el
          }}
          className='mt-12 md:mt-20'
        >
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Family & companion travel{' '}
          </div>

          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full '>
            Healing together{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full md:mb-6 mb-3'>
            The journey to wellness is often more meaningful when shared with loved ones.{' '}
          </div>
          <div className=' md:grid md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-0 h-max'>
            <div className='h-fit'>
              <div className='hidden md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* first image w-1/2*/}
                <ImageWithShimmer
                  src='/images/visit/slide-1.webp'
                  alt='room image'
                  className='h-[545px] object-cover mb-4'
                  width={750}
                  height={500}
                />

                {/* second image w-1/2*/}
                <ImageWithShimmer
                  src='/images/visit/slide-2.webp'
                  alt='room image'
                  className='h-[545px] object-cover mb-4'
                  width={750}
                  height={500}
                />
              </div>
              {/* third image horizontal*/}
              <ImageWithShimmer
                src='/images/sanctury/beach-web.webp'
                alt='rooom iamge'
                className='md:h-[550px] h-[350] w-full hidden md:block '
                width={750}
                height={500}
              />
              <ImageWithShimmer
                src='/images/visit/slide-mobile.webp'
                alt='rooom iamge'
                className='md:h-[550px] h-[350] md:hidden block w-full '
                width={750}
                height={500}
              />
            </div>

            <div className='flex flex-col md:mx-5 mb-3 h-fit md:sticky md:top-24'>
              <div className='md:mt-9 mt-6'>
                <div className='font-ivyOra items-center w-fit text-slateGray text-xl md:text-2xl flex flex-row gap-2 '>
                  Family programs
                </div>
                <div className='mt-3 md:mt-9 '>
                  <div className='text-base md:text-xl text-slateGray mt-0'>
                    Multi-generational healing{' '}
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-2'>
                    Tailored experiences for all ages playful activities for kids, gentle therapies
                    for grandparents, and shared healing moments for the whole family.{' '}
                  </div>
                  <div className='flex flex-row items-start gap-2 mt-3'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div className='text-base md:text-xl text-slateGray mt-0'>
                      Customised programs for family groups{' '}
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
                      {`Children's wellness activities (age-appropriate)`}{' '}
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
                      Grandparent-friendly gentle programs{' '}
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
                      Family bonding through healing experiences{' '}
                    </div>
                  </div>
                </div>

                <div className='mt-3 md:mt-6 '>
                  <div className='text-base md:text-xl text-slateGray mt-0'>Companion support </div>
                  <div className='text-base md:text-xl text-slateGray mt-2'>
                    Dedicated programs for companions, including cultural trips, spa sessions, and
                    independent wellness journeys.
                  </div>
                  <div className='flex flex-row items-start gap-2 mt-3'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div className='text-base md:text-xl text-slateGray mt-0'>
                      Partner programs for non-participating companions{' '}
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
                      Cultural excursions and local experiences{' '}
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
                      Holistic treatments and relaxation programs{' '}
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
                      Independent healing journeys within the same visit{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=' md:grid md:grid-cols-[33%_66%] md:grid-rows-1 md:mt-9 md:gap-0 h-max'>
            <div className='flex flex-col md:mx-5 mb-3 h-fit md:sticky md:top-24'>
              <div className='md:mt-9'>
                <div className='font-ivyOra items-center w-fit text-slateGray text-xl md:text-2xl flex flex-row gap-2 '>
                  Special considerations{' '}
                </div>
                <div className='mt-3 md:mt-9 '>
                  <div className='text-base md:text-xl text-slateGray mt-0'>
                    Dietary accommodations
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-2'>
                    We cater to diverse dietary needs with thoughtful meal options that are
                    nutritious, inclusive, and mindful of personal, cultural, and religious
                    preferences.
                  </div>
                  <div className='flex flex-row items-start gap-2 mt-3'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div className='text-base md:text-xl text-slateGray mt-0'>
                      Vegetarian, vegan, and Jain meal options{' '}
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
                      Allergy-sensitive menu modifications{' '}
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
                      Cultural and religious dietary requirements{' '}
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
                      {`Children's nutritious meal programs`}{' '}
                    </div>
                  </div>
                </div>

                <div className='mt-3 md:mt-6 '>
                  <div className='text-base md:text-xl text-slateGray mt-0'>Accessibility</div>
                  <div className='text-base md:text-xl text-slateGray mt-2'>
                    Our facilities cater to guests with mobility and special needs through
                    accessible suites, adapted wellness programs, and personalised assistance.
                  </div>
                  <div className='flex flex-row items-start gap-2 mt-3'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div className='text-base md:text-xl text-slateGray mt-0'>
                      Wheelchair accessible suites and facilities{' '}
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
                      Modified yoga and movement programs{' '}
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
                      Assisted therapy sessions{' '}
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
                      Special needs accommodation support{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='h-max md:block hidden'>
              <div className='hidden md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* first image w-1/2*/}
                <ImageWithShimmer
                  src='/images/visit/slide-4.webp'
                  alt='room image'
                  className='h-[545px] object-cover mb-4'
                  width={750}
                  height={500}
                />

                {/* second image w-1/2*/}
                <ImageWithShimmer
                  src='/images/visit/slide-5.webp'
                  alt='room image'
                  className='h-[545px] object-cover mb-4'
                  width={750}
                  height={500}
                />
              </div>
              {/* third image horizontal*/}
              <ImageWithShimmer
                src='/images/visit/slide-6.webp'
                alt='rooom iamge'
                className='md:h-[550px] h-[350] w-full hidden md:block '
                width={750}
                height={500}
              />
              <ImageWithShimmer
                src='/images/sanctury/sanctury-mobile.webp'
                alt='rooom iamge'
                className='md:h-[550px] h-[350] md:hidden block w-full '
                width={750}
                height={500}
              />
            </div>
          </div>
        </div>

        <div className=''>
          <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
            <Marquee className='mr-4'>
              {' '}
              <Check className='ml-4' /> 20,000+ chronic conditions reversed on the Healing Hills
            </Marquee>
          </div>
        </div>

        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra pt-2 md:mb-6 mb-3 text-left md:text-center leading-none m-auto'>
            Private airport transfers{' '}
          </div>

          <div className='grid md:grid-cols-[66%_33%] grid-rows-1 gap-6 md:gap-4'>
            <div className='flex flex-col text-base md:text-xl '>
              <span className='block md:hidden mb-3'>Luxury vehicle service</span>

              <div className='relative w-full h-[350] overflow-hidden md:h-[517] md:mb-6'>
                <ImageWithShimmer
                  src='/images/medical-health-program/ground-transport.webp'
                  alt='medical-health-program-banner-home'
                  fill
                  className='object-cover absolute top-0 left-0'
                />
              </div>
              <span className='hidden md:inline-block'>Luxury vehicle service</span>
              <div className='mt-2 md:block hidden w-[70%]'>
                Travel in comfort with premium cars and SUVs, driven by professionals familiar with
                The Healing Hills route. Enjoy complimentary WiFi, refreshments, and strict vehicle
                sanitisation for your safety.{' '}
              </div>
              <div className='md:hidden block'>
                <div className='flex flex-row items-start gap-2 mt-3'>
                  <Image
                    src={'/images/kosha-pointer-icon.svg'}
                    alt={'/images/kosha-pointer-icon.svg'}
                    width={31}
                    height={24}
                  />
                  <div className='text-base md:text-xl text-slateGray mt-0'>
                    Premium cars and SUVs for comfortable transfers{' '}
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
                    Professional drivers familiar with The Healing Hills route{' '}
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
                    Complimentary WiFi and refreshments{' '}
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
                    Vehicle sanitisation protocols for your safety{' '}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col text-base md:text-xl'>
              <span className='block md:hidden mb-3'>
                {' '}
                Helicopter transfer (available on request)
              </span>
              <div className='relative w-full h-[350] overflow-hidden md:h-[517] md:mb-6'>
                <ImageWithShimmer
                  src='/images/medical-health-program/air-transport.webp'
                  alt='medical-health-program-banner-home'
                  fill
                  className='object-cover absolute top-0 left-0'
                />
              </div>
              <span className='hidden md:inline-block'>
                {' '}
                Helicopter transfer (available on request)
              </span>
              <div className='mt-2 md:block hidden'>
                Experience a 15-minute scenic flight over the Eastern Ghats with private
                heli-transfers, offering ultimate luxury and privacy for discerning guests.
              </div>
              <div className='md:hidden block'>
                <div className='flex flex-row items-start gap-2 mt-3'>
                  <Image
                    src={'/images/kosha-pointer-icon.svg'}
                    alt={'/images/kosha-pointer-icon.svg'}
                    width={31}
                    height={24}
                  />
                  <div className='text-base md:text-xl text-slateGray mt-0'>
                    15-minute scenic flight over the Eastern Ghats
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
                    Private heli-transfer available on request{' '}
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
                    Ultimate luxury and privacy for discerning guests{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Payment & booking{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Transparent investment in your transformation{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            We believe in complete transparency when it comes to investment in your healing journey.
          </div>
          <PaymentFAQs />
        </div>

        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Visa and travel support{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Seamless entry to India{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            We make your visa process effortless so you can focus on preparing for your healing
            journey.{' '}
          </div>
          <VisaFAQs />
        </div>

        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Preparing for your journey{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            What to expect & what to bring{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Your healing journey is unique, and preparation sets the foundation for transformation.
          </div>
          <PreparationFAQs />
        </div>

        <div className='mt-6 md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
          <div className='relative w-full md:h-[700] h-[350] overflow-hidden md:mb-3 mb-6'>
            <ImageWithShimmer
              src='/images/visit/prepare-mobile.webp'
              alt='prepare'
              fill
              className='object-cover md:hidden block'
            />
            <ImageWithShimmer
              src='/images/visit/prepare-web.webp'
              alt='prepare'
              fill
              className='object-cover hidden md:block'
            />
          </div>
          <div className='md:mt-9'>
            {' '}
            <div className='text-base md:text-[24px] text-slateGray md:font-ivyOra md:mb-6'>
              Preparing the body, mind & spirit{' '}
            </div>
            <div className='flex flex-row items-start gap-2 mt-3'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                {'Begin tapering tea, coffee, and alcohol intake'}
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
                Transition to a plant-based diet 72 hours prior
              </div>
            </div>
            <div className='flex flex-row items-start gap-2 mt-3'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>Finish dinner by 8 PM </div>
            </div>
            <div className='flex flex-row items-start gap-2 mt-3'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='text-base md:text-xl text-slateGray mt-0'>
                Begin winding down by 10:30 PM{' '}
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
                Aim for 6–7 hours of restorative sleep{' '}
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
                Hydrate with at least 3 litres of water daily{' '}
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
                Focus on fresh produce; reduce oily or processed foods{' '}
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
                Avoid carbonated and energy beverages{' '}
              </div>
            </div>
            <div className='text-base md:text-xl text-slateGray mt-3 md:mt-6'>
              International Guests: Begin adjusting your sleep schedule to Indian Standard Time for
              a smoother transition. These gentle shifts will help align your system to the healing
              rhythm of the retreat.{' '}
            </div>
          </div>
        </div>

        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Cultural preparation{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Honouring sacred traditions{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            {`Your time on The Healing Hills is an opportunity to connect with India's ancient healing
            wisdom.`}
          </div>
          <CluturalFAQs />
        </div>

        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Health and safety{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Your wellbeing is our priority{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Every aspect of Pema is designed with your health and safety in mind.
          </div>
          <HealthSafetyFAQ />
        </div>

        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Post-visit support{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Your transformation continues{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            {`Your healing journey doesn't end when you leave The Healing Hills it evolves.`}{' '}
          </div>
          <SupportFAQs />
        </div>
      </div>
      <div className='mt-12 md:mt-20'>
        <div className=' w-full max-w-[750px] mx-auto'>
          <div className='text-[28px] md:text-center md:text-[40px] text-pemaBlue font-ivyOra px-4'>
            Still have questions?{' '}
          </div>

          <FAQs />
        </div>
        <Link
          href={'/resources'}
          className='font-crimson w-fit text-pemaBlue text-base md:text-xl flex flex-row gap-2 border-b justify-center border-pemaBlue mx-auto'
        >
          See all FAQs <MoveRight className='text-pemaBlue' />
        </Link>
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
