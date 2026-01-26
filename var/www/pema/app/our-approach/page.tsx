'use client'
import PrimaryButton from '@/components/PrimaryButton'
import { MoveRight, Check } from 'lucide-react'
import Image from 'next/image'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Our approach ' }]

import 'react-multi-carousel/lib/styles.css'

import Koshas from './Koshas'
import TestimonialCard from './Testimonials'
import NaturopathicSection from './Naturopathic'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'

import Breadcrumbs from '@/components/BreadCrumbs'
import DoctorsCarousel from './SwiperExperts'
import Marquee from 'react-fast-marquee'
import FAQs from './FAQs'
import TextTestimonialCard from '@/components/TextTestimonials'
import { EXTERNAL_LINKS, ROUTES, takeOurHealthQuiz, zohoForms } from '@/utils/utils'
import ImageWithShimmer from '@/components/ImageWithShimmer'

const testimonialsData = [
  {
    name: 'Chukka Srinivas & Chukka Dhanalakshmi ',
    id: 3,
    review: `‘It’s very unique experience and health wise everyone should go through all the treatments . We had a memorable experiences all together.’`,
  },
  {
    name: 'James Dunlop ',
    id: 4,
    review: `‘Amazing place.  Preethi was great, as was Arik & his lovely colleagues. Healers were brilliant.  Doctors were super helpful. Acupuncture and physiotherapy was great.  Puneet’s melodic voice in yoga was very calming, and the cuisine was a revelation. Thank you.’`,
  },
  {
    name: 'Mahesh Kumar',
    id: 1,
    review: `‘It was an amazing experience in Pema. Staff is courteous. Would like to mention that the chef is phenomenal. Also yogic and yoga staff is excellent. Keep it up.
I highly recommend to experience Pema way of life.’`,
  },
  {
    name: 'Shivaprasad Shetty',
    id: 2,
    review: `‘We had a great time . The ambience was very good . Whole place was sparkling clean. The staff were extremely courteous and very efficient . The food was outstanding.’`,
  },
]

export default function OurApproach() {
  const router = useRouter()

  return (
    <div className=' max-w-[1440] m-auto py-6 '>
      {/* hero section */}
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center md:mb-2 mt-4 md:mt-9'>
        Our approach{' '}
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray leading-[120%] font-ivyOra py-2 text-center'>
        There is a science to healing.
        <br /> And a system behind that science.{' '}
      </div>
      <div className='px-4'>
        <div className='relative mt-4 md:mt-6 w-full max-h-[470px] aspect-358/470 md:aspect-630/1360 md:max-h-[630px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/approach/hero-mobile.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover block md:hidden absolute top-0 left-0 `}
          />
          <ImageWithShimmer
            src={'/images/approach/hero-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover hidden md:block absolute top-0 left-0 `}
          />
        </div>
      </div>
      <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
        <Marquee className='mr-4'>
          {' '}
          <Check className='ml-4 mr-2' /> 5 Kosha healing framework
          <Check className='ml-4 mr-2' /> 5 Kosha healing framework
        </Marquee>
      </div>
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
          {` At Pema, your treatment doesn't begin with symptoms.`} <br />
          It begins with the truth beneath them.{' '}
        </div>
        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[70%] m-auto w-full'>
          {`   Perched on the Healing Hills of Visakhapatnam, sacred ground revered for centuries, we've
          created something rare a place where ancient wisdom meets modern precision, where healing
          becomes inevitable rather than hoped for.`}
        </div>
        <div className='md:hidden mt-12 block text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          The 5 Koshas{' '}
        </div>
        <div className='md:hidden block  text-base md:text-xl  text-slateGray font-crimson text-left md:text-center mb-2'>
          {` We don't treat what the body shows.`} <br /> We treat what the being stores.
        </div>
        <Image
          src={'/images/sanctury/5-koshas.svg'}
          alt='koshas'
          className='h-[350] md:h-[290] mx-auto md:mt-6'
          width={1000}
          height={1000}
        />{' '}
      </div>
      {/* koshas section web */}
      <div className='md:mt-9 max-w-[1360px] m-auto md:bg-softSand md:p-9'>
        <div className='px-4 hidden md:block  text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          The 5 Koshas{' '}
        </div>
        <div className='px-4 hidden md:block  text-base md:text-xl  text-slateGray font-crimson text-left md:text-center mb-2'>
          {`We don't treat what the body shows.`} <br className='md:hidden inline' /> We treat what
          the being stores.
        </div>
        <div className='px-4 text-base md:text-xl  text-slateGray font-crimson text-left md:text-center mb-4 md:mb-6 md:w-[70%] w-full mx-auto'>
          Healing at Pema is structured across five layers of human consciousness from physical to
          bliss. This is our Kosha Framework, rooted in 5,000 years of yogic understanding and
          validated by modern science.{' '}
        </div>
        <div className='px-4 md:hidden block text-base md:text-lg  text-pemaBlue font-crimson text-left md:text-center mb-4 md:mb-6 md:w-[70%] w-full mx-auto'>
          You are body. breath. emotion. thought. presence.
        </div>
        <div className='px-4  md:hidden block text-base md:text-lg  text-pemaBlue font-crimson text-left md:text-center mb-6 md:w-[70%] w-full mx-auto'>
          True wellness begins when all five layers speak to one another in harmony.
        </div>

        <Koshas />

        <div className='mx-4 font-crimson mt-6 md:mt-9 text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit md:mx-auto'>
          Begin your healing now <MoveRight />
        </div>
      </div>
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='lg:grid grid-cols-[66%_33%] grid-rows-1 mt-8 md:mt-12 gap-5'>
          <div>
            <div className='text-[20px] md:hidden block md:text-[40px]  text-pemaBlue font-ivyOra leading-[140%] mb-2'>
              Dr. Murthy’s legacy{' '}
            </div>
            <div className='text-base  md:hidden block md:text-xl text-slateGray font-crimson mb-6'>
              {`He didn't start a retreat. He rewrote how India heals.
`}{' '}
            </div>
            <div className='relative w-full h-[245] md:h-[530px] overflow-hidden md:mb-4'>
              <ImageWithShimmer
                src={'/images/sanctury/dr-murthy.webp'}
                alt={'Dr. S.N. Murthy, Father of Naturopathy'}
                fill
                className='object-cover absolute top-0 left-0'
              />
            </div>
            <div className='md:flex hidden md:flex-row gap-4 w-full overflow-hidden'>
              {/* First image - aerial view */}
              <ImageWithShimmer
                src='/images/approach/legacy-1.webp'
                alt='28 Hillside acres aerial view'
                className='h-[350] md:h-[545px]  object-cover'
                width={750}
                height={500}
              />

              {/* Second image - resort buildings */}
              <ImageWithShimmer
                src='/images/approach/legacy-2.webp'
                alt='Resort buildings with infinity pool'
                className='h-[545px]  object-cover md:block hidden'
                width={750}
                height={500}
              />
            </div>
          </div>

          <div className='flex flex-col  '>
            <div className='md:mt-9 mt-6'>
              <div className='text-[20px] md:text-[40px] md:block hidden text-pemaBlue font-ivyOra leading-[140%] mb-2'>
                {`Dr. Murthy’s legacy
`}{' '}
              </div>
              <div className='text-base  md:text-xl md:block hidden text-slateGray font-crimson mb-3'>
                {`He didn't start a retreat. He rewrote how India heals.
`}{' '}
              </div>
              <div className='text-base  md:text-xl text-slateGray font-crimson mb-3'>
                {`‘When we live in tune with nature,`}
                <br />
                {` the body begins to heal itself.’`}
              </div>
              <div className='text-base  md:text-xl text-slateGray font-crimson mb-3 md:w-[97%]'>
                {` Dr. S.N. Murthy is known as the Father of Naturopathy 
                in India. For over 40 years,
                he studied how natural healing laws and medical-grade protocols could work in
                harmony. His revolutionary approach proved that the body's innate intelligence, when
                properly supported, surpasses any external intervention.`}
              </div>
              <div className='text-[20px] md:text-[24px]  text-slateGray font-ivyOra leading-[140%] mt-6 md:mt-9 mb-2'>
                His revolutionary discoveries{' '}
              </div>
              <div className='text-base  md:text-xl text-slateGray font-crimson mb-3'>
                {`Dr. Murthy's legacy lives on in every protocol at Pema, every consultation with our
                physicians, and every guest who experiences what seemed impossible: complete healing
                through natural means.`}{' '}
              </div>

              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Natural healing methods can reverse chronic conditions{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                {`The body's intelligence knows how to heal when obstacles are removed
`}{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Lifestyle medicine creates lasting transformation, not temporary relief{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Healing happens in layers addressing root causes, not just symptoms{' '}
              </div>
              <div className='text-base md:hidden block md:text-xl text-slateGray font-crimson mt-6'>
                {`   Dr. Murthy's legacy lives on in every protocol at Pema, every consultation with our
                physicians, and every guest who experiences what seemed impossible: complete healing
                through natural means.`}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
        <Marquee className='mr-4'>
          {' '}
          <Check className='mx-2' /> Clinical results: 94% long-term success
        </Marquee>
      </div>
      {/* weelbeing section web+mobile */}
      <div id='experts' className='md:mt-20 mt-12 m-auto px-4 scroll-m-20'>
        <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          The circle of experts{' '}
        </div>
        <div className='text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-2'>
          Healing guided by the very best
        </div>
        <div className='text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-2 md:w-[70%] mx-auto md:leading-normal leading-[110%]'>
          {` At Pema, each guest is supported by a core team of specialists: naturopaths, therapeutic
          chefs, physiotherapists, and mind-body practitioners working in complete synergy. You're
          not seeing multiple people scattered across different appointments.`}{' '}
          <br className='md:inline hidden' />
          {`You're receiving unified care from a circle of experts who communicate, collaborate, and
          care together.`}
        </div>
        <div className='text-xl md:hidden text-slateGray font-ivyOra  text-left mt-4 leading-none'>
          Your healing team{' '}
        </div>
        <div className='mt-4'>
          <DoctorsCarousel />
        </div>
      </div>
      {/* Naturopathy section web + mobile */}
      <div className='px-4'>
        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto px-4 py-6 md:px-10 md:py-10 bg-softSand'>
          <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Why Naturopathy{' '}
          </div>
          <div className=' text-base mt-2 md:text-xl leading-[110%] text-slateGray font-crimson text-left md:text-center mb-2 md:w-[60%] mx-auto w-full'>
            Every symptom has a pattern. <br className='inline md:hidden' /> Every pattern has a
            source.{' '}
          </div>
          <div className=' text-base mt-2 md:text-xl leading-[110%] text-slateGray font-crimson text-left md:text-center mb-6 md:w-[70%] mx-auto w-full'>
            {`  Naturopathy connects the dots that conventional medicine often misses. Whether you're
            dealing with bloating, burnout, or blood pressure, the root cause often lies deeper than
            the symptom suggests.`}{' '}
          </div>

          <div className='relative mt-6 w-full h-[552px] overflow-hidden hidden md:block'>
            <ImageWithShimmer
              src={'/images/home/naturopathy-hero-image-web.webp'}
              alt={'naturopathy-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
          <div className='relative mt-6 w-full h-[300] overflow-hidden block md:hidden '>
            <ImageWithShimmer
              src={'/images/home/naturopathy-hero-image-mobile.webp'}
              alt={'naturopathy-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
          <div className='text-xl font-ivyOra mt-6 md:text-2xl text-left mb-3 md:mb-6 md:text-center'>
            The Naturopathic advantage{' '}
          </div>
          <div className='max-w-5xl mx-auto md:grid flex flex-col grid-cols-2 grid-rows-1 '>
            <div className='py-5 md:py-9 px-3 md:px-6 border border-[#32333333] grid grid-cols-[40%_60%] md:flex flex-row md:flex-col gap-1 md:gap-9'>
              <div className='text-base md:text-xl text-left'>Conventional medicine </div>
              <div className='flex flex-col gap-3 md:gap-4 '>
                <div className='flex flex-row items-start gap-2'>
                  <Image
                    src={'/lotus-pointer-1.svg'}
                    width={31}
                    height={24}
                    alt='Pointer'
                    className='hidden md:block mt-1'
                  />
                  <div className='text-base md:text-xl text-left '>
                    Manages symptoms, creates dependencies, treats parts in isolation.{' '}
                  </div>
                </div>
              </div>
            </div>
            <div className='py-5 md:py-9 relative bg-pemaBlue text-softSand px-3 md:px-6 grid grid-cols-[40%_60%] md:flex flex-row md:flex-col gap-1 md:gap-9'>
              <div className='text-base md:text-xl text-left'>Naturopathy </div>
              <div className='flex flex-col gap-3 md:gap-4 '>
                <div className='flex flex-row items-start gap-2 '>
                  <Image
                    src={'/lotus-pointer-light-1.svg'}
                    width={31}
                    height={24}
                    alt='Pointer'
                    className='hidden md:block  mt-1'
                  />
                  <div className='text-base md:text-xl text-left '>
                    Eliminates root causes, restores natural function, treats the whole being
                  </div>
                </div>
              </div>
              <Image
                alt='Bg image'
                width={270}
                height={130}
                className='absolute right-0 bottom-0 md:w-[240] aspect-auto w-[150px]'
                src={'/images/medical-health-program/lotus-gray-bg-image.svg'}
              />
            </div>
          </div>
          <div>
            <div className='grid md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max mt-6'>
              <div className='h-max'>
                <div className='md:flex md:flex-row hidden gap-4 w-full overflow-hidden'>
                  {/* First image - aerial view */}
                  <ImageWithShimmer
                    src='/images/approach/naturopathy-web-1.webp'
                    alt='28 Hillside acres aerial view'
                    className='h-[350] md:h-[545px]  object-cover'
                    width={750}
                    height={500}
                  />

                  {/* Second image - resort buildings */}
                  <ImageWithShimmer
                    src='/images/approach/naturopathy-web-2.webp'
                    alt='Resort buildings with infinity pool'
                    className='h-[545px]  object-cover '
                    width={750}
                    height={500}
                  />
                </div>
              </div>

              <div className='md:flex flex-col hidden mb-3'>
                <div className='md:mt-9 mt-6'>
                  <div className='text-[20px] block md:text-[24px] text-slateGray font-ivyOra'>
                    How we practise Naturopathy{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-2 md:mt-3'>
                    A rare union of ocean, hills, and healing energy, this sanctuary offers an
                    immersive environment designed to restore balance, peace, and vitality.
                  </div>

                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      src={'/lotus-pointer-1.svg'}
                      width={28}
                      height={23}
                      className='h-[31px] w-6'
                      alt='Pointer'
                    />{' '}
                    Root cause identification
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      src={'/lotus-pointer-2.svg'}
                      width={28}
                      height={23}
                      className='h-[31px] w-6'
                      alt='Pointer'
                    />{' '}
                    Natural protocols{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      src={'/lotus-pointer-3.svg'}
                      width={28}
                      height={23}
                      className='h-[31px] w-6'
                      alt='Pointer'
                    />{' '}
                    Lifestyle integration{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      src={'/lotus-pointer-4.svg'}
                      width={28}
                      height={23}
                      className='h-[31px] w-6'
                      alt='Pointer'
                    />{' '}
                    Whole-being approach{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      src={'/lotus-pointer-5.svg'}
                      width={28}
                      height={23}
                      className='h-[31px] w-6'
                      alt='Pointer'
                    />{' '}
                    Results that last{' '}
                  </div>
                </div>
              </div>
            </div>
            <div className='md:hidden'>
              <div className=' mb-6 md:mt-20 text-[20px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
                How we practise Naturopathy{' '}
              </div>

              <NaturopathicSection />
              <div className=' text-base  text-slateGray'>
                {` At Pema, we identify the root with diagnostic precision and build treatment plans
                that align with your body's natural rhythm. Not just masking symptoms eliminating
                their source.`}
              </div>
            </div>

            <Link
              href={ROUTES.theSanctuary}
              className='font-crimson w-fit text-pemaBlue mt-6 text-base md:text-xl flex flex-row items-center gap-2 border-b border-pemaBlue md:mx-auto'
            >
              Explore the healing hub
              <MoveRight className='text-pemaBlue' />
            </Link>
          </div>
        </div>
      </div>
      {/* two journeys section web */}
      <div className='mt-20 max-w-[1360px] m-auto px-4'>
        <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          Science & methodology{' '}
        </div>
        <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-2 md:leading-normal leading-[110%]  md:w-full'>
          {`This isn't holistic guesswork. 
`}{' '}
          <br className='md:hidden ' /> {`It's structured protocol.`}
        </div>
        <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-2 md:w-[80%] w-full mx-auto md:leading-normal leading-[110%]'>
          Every program at Pema is built on a foundation of rigorous testing, precise protocols, and
          measurable outcomes. We blend ancient wisdom with modern diagnostic precision to create
          treatment plans that are both scientifically sound and deeply healing.{' '}
        </div>
        <div className='relative mt-6 w-full h-[350] md:h-[580px] overflow-hidden '>
          <ImageWithShimmer
            src={'/images/approach/approach-section-hero-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute hidden md:block top-0 left-0 `}
          />

          <ImageWithShimmer
            src={'/images/approach/approach-section-hero-mobile.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover md:hidden block absolute top-0 left-0 `}
          />
        </div>
        {/* Our scientific approach WEB */}
        <div className='text-xl md:text-2xl text-slateGray font-ivyOra py-2 text-left md:text-center leading-none mt-9'>
          Our scientific approach{' '}
        </div>
        <div className='flex flex-col md:flex-row gap-6 md:mt-6'>
          <div className='w-full md:w-1/3'>
            {' '}
            <div className='text-lg md:text-xl text-slateGray font-crimson text-left  mb-3'>
              Advanced diagnostics{' '}
            </div>{' '}
            <div className='relative w-full h-[350] md:h-[252px] overflow-hidden '>
              <ImageWithShimmer
                src={'/images/approach/approach-slide-1-web.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0  md:block hidden`}
              />
              <ImageWithShimmer
                src={'/images/approach/approach-slide-1-mobile.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0 md:hidden block`}
              />
            </div>
            <div className='md:block hidden text-lg md:text-xl text-slateGray font-crimson text-left  mt-3'>
              We go far beyond basic check-ups. From in-depth blood chemistry and microbiome
              analysis to hormonal and metabolic assessments, our diagnostics reveal the complete
              picture of your health.
            </div>
            <div className='md:hidden block'>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Comprehensive blood chemistry analysis
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Gut microbiome testing and mapping
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Body composition and metabolic analysis{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Hormonal balance evaluation{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Stress response measurements{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Nutritional deficiency detection{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Bioenergy scans{' '}
              </div>
            </div>
          </div>

          <div className='w-full md:w-1/3'>
            {' '}
            <div className='text-lg md:text-xl text-slateGray font-crimson text-left  mb-3'>
              Precision protocols{' '}
            </div>{' '}
            <div className='relative w-full h-[350] md:h-[252px] overflow-hidden '>
              <ImageWithShimmer
                src={'/images/approach/approach-slide-2-web.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0  md:block hidden`}
              />
              <ImageWithShimmer
                src={'/images/approach/approach-slide-2-mobile.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0 md:hidden block`}
              />
            </div>
            <div className='md:block hidden text-lg md:text-xl text-slateGray font-crimson text-left  mt-3'>
              Your treatment plan is built around you, your biochemistry, your pace, your needs.
              Nutrition, therapies, and movement are calibrated daily, ensuring each step moves you
              closer to lasting wellness.
            </div>
            <div className='md:hidden block'>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Personalised treatment plans based on your unique biochemistry{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Daily progress tracking and plan adjustments{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Therapeutic nutrition tailored to your healing needs{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Movement and therapy schedules optimised for your condition{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Sleep and stress management protocols{' '}
              </div>
            </div>
          </div>

          <div className='w-full md:w-1/3'>
            {' '}
            <div className='text-lg md:text-xl text-slateGray font-crimson text-left  mb-3'>
              Measurable outcomes{' '}
            </div>{' '}
            <div className='relative w-full h-[350] md:h-[252px] overflow-hidden '>
              <ImageWithShimmer
                src={'/images/approach/approach-slide-3-web.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0  md:block hidden`}
              />
              <ImageWithShimmer
                src={'/images/approach/approach-slide-3-mobile.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0 md:hidden block`}
              />
            </div>
            <div className='md:block hidden text-lg md:text-xl text-slateGray font-crimson text-left  mt-3'>
              We track progress you can see and feel. Biomarker comparisons, symptom resolution
              mapping, and long-term follow-up give you the confidence that your transformation is
              both real and sustainable.
            </div>
            <div className='md:hidden block'>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Before and after biomarker comparison{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Symptom tracking and resolution mapping{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Energy and vitality assessments{' '}
              </div>

              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Quality of life measurements{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Long-term follow-up and maintenance protocols{' '}
              </div>
            </div>
            <div className='md:hidden block text-base mt-9 md:text-xl leading-[110%] text-slateGray font-crimson text-left '>
              From diagnostics to daily therapies, everything at Pema is tracked, tailored, and
              scientifically structured. Ancient wisdom guided by modern precision.
            </div>
          </div>
        </div>
      </div>
      <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
        <Marquee className='mr-4'>
          {' '}
          <Check className='ml-4 mr-2' /> Science-backed, root cause healing
          <Check className='ml-4 mr-2' /> Science-backed, root cause healing
        </Marquee>
      </div>
      {/*  */}
      <div className='lg:grid grid-cols-[35%_65%] grid-rows-1 md:mt-20 mt-12 hidden max-w-[1360px] m-auto'>
        {/* Left column (40%) */}
        <div className='flex flex-col justify-start ml-5 mr-5'>
          <div className='mt-9'>
            <div className='text-[40px] text-pemaBlue font-ivyOra md:w-[70%] w-full'>
              Just want to feel better fast?{' '}
            </div>
            <div className='text-xl text-slateGray mt-2'>
              {`Pema lite offers a restorative 3-day experience without heavy protocols or
              diagnostics. For those recovering, transitioning, or simply seeking rest,`}
              <br />
              {` it’s a
              perfect first step.`}
            </div>
          </div>
          <div>
            <Link
              href={'/pema-lite'}
              className='mt-8 font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Start with Pema lite
              <MoveRight />
            </Link>
          </div>
        </div>

        {/* Right column (60%) */}
        <div className='relative w-full h-[620] overflow-hidden hidden lg:block'>
          <ImageWithShimmer
            src='/images/home/pema-lite-home-web.webp'
            alt='wellbeing-banner-home'
            fill
            className='object-cover absolute top-0 left-0'
          />
        </div>
      </div>
      <div className='px-4'>
        <div className='mt-12 md:mt-20 max-w-[1360px] block m-auto bg-softSand md:p-10 p-4'>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%]'>
            Clinical proof{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:mb-6 md:w-[60%] w-full mx-auto'>
            Thousands healed. Tracked. Verified.
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:mb-6 md:w-[80%] w-full mx-auto'>
            {`Our results speak louder than our promises. Every guest's journey is documented, every
            improvement measured, every transformation verified. This isn't hope, it's evidence-based
            healing.`}
          </div>

          <Link
            href={'/medical-health-program'}
            className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start md:m-auto gap-2 border-b border-pemaBlue w-fit'
          >
            Explore medical healing <MoveRight />
          </Link>
          <div className='relative mt-6 w-full h-[350] md:h-[517] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/wellness-program/healing-web.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 hidden md:block `}
            />
            <ImageWithShimmer
              src={'/images/wellness-program/healing-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 md:hidden block`}
            />
          </div>
          <div className='text-base md:text-xl md:text-center text-slateGray font-ivyOra mt-3 md:mt-6 '>
            Documented results
          </div>

          <div className='grid md:grid-cols-3 grid-cols-2 md:grid-rows-1  md:mt-6 max-w-[900px] mx-auto gap-4 md:gap-10'>
            <div>
              <div className='text-[28px] md:text-center md:text-[40px] text-pemaBlue font-ivyOra'>
                6,000+{' '}
              </div>

              <div className='text-base md:text-xl md:text-center text-slateGray md:mt-2'>
                diseases reversed through <br /> natural healing.
              </div>
            </div>{' '}
            <div>
              <div className='text-[28px] md:text-center md:text-[40px] text-pemaBlue font-ivyOra'>
                85%{' '}
              </div>

              <div className='text-base md:text-xl md:text-center text-slateGray md:mt-2'>
                show measurable improvements in their primary condition.
              </div>
            </div>
            <div>
              <div className='text-[28px] md:text-center md:text-[40px] text-pemaBlue font-ivyOra'>
                10,000+
              </div>

              <div className='text-base md:text-xl md:text-center text-slateGray md:mt-2'>
                guests have experienced <br />
                {`Pema’s care. You're next. `}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* testimonials web + mobile */}
      <div className='mt-20 max-w-[1360px] m-auto'>
        <TextTestimonialCard
          bgMobile='/images/approach/test-bg-mobile.webp'
          bgWeb='/images/approach/test-bg-web.webp'
          data={testimonialsData}
        />
      </div>

      <div id={'cuisine'} className='mt-20 max-w-[1360px] m-auto px-4 scroll-m-30'>
        <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          Healing through food{' '}
        </div>

        <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center whitespace-pre-line md:whitespace-normal md:w-[80%] w-full mx-auto md:leading-normal leading-[111%]'>
          {` Food this good shouldn’t be this functional, and food this functional shouldn’t be this good. \nThat’s the Pema paradox.`}
        </div>
        <div className='lg:grid grid-cols-[66%_33%] grid-rows-1 gap-5 mt-6'>
          <div className='relative w-full h-[350] md:h-[580px] overflow-hidden '>
            <ImageWithShimmer
              src={'/images/approach/healing-food.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left whitespace-pre-line mt-3 md:mt-9'>
            {`At Pema, food isn't just nourishment.It's medicine, rooted in naturopathic science, powered by therapeutic ingredients, and elevated by culinary mastery.

Every meal is handcrafted by doctors and nutritionists using pranic* cooking methods that activate the body's natural healing response. The result? Dishes that restore hormonal balance, reduce inflammation, and heal the gut, without ever tasting medicinal.

No pills. No crash diets. No tasteless compromises.Just food that feels indulgent and heals at the cellular level.

Guests often say, “I don't want the meals to end.”Because for many, it's the first time food makes them feel safe, full, and free.`}
          </div>
        </div>
      </div>

      {/* consultation section */}
      <div className='mt-20 max-w-[1360px] m-auto px-4'>
        <div className='text-[28px] md:w-[50%] m-auto md:text-[40px] text-pemaBlue font-ivyOra text-left md:text-center mb-2'>
          Your healing begins here
        </div>
        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-4 md:mb-6 md:w-[60%] w-full m-auto'>
          {`You don't need to start with certainty. You just need to start.`}
        </div>

        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:w-[60%] w-full m-auto'>
          Every healing journey begins with a single step. <br />{' '}
          {` 
At Pema, we meet you wherever you are whether you're seeking luxury wellness or serious medical intervention and guide you toward the transformation you never thought possible.`}{' '}
        </div>

        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:mb-9 mb-4 md:w-[60%] w-full m-auto'>
          {`Begin with a simple 3-minute health assessment. We'll help you understand your unique needs and design a program that serves your deepest healing.`}{' '}
        </div>
        <div className='flex flex-col-reverse md:flex-col gap-4 mt-4'>
          <Link
            href={zohoForms.bookConsultaion}
            className='font-crimson w-fit text-pemaBlue text-base md:text-xl flex flex-row gap-2 border-b justify-center border-pemaBlue mx-auto'
          >
            Book your medical consultation <MoveRight className='text-pemaBlue' />
          </Link>
          <PrimaryButton
            onClick={() => router.push(ROUTES.medicalHealthAssessment)}
            className='max-w-[420px] w-full mx-auto'
          >
            Take the health quiz{' '}
          </PrimaryButton>
        </div>
        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mt-6 md:mt-9 md:w-[60%] w-full m-auto'>
          On the Healing Hills of Visakhapatnam, where ancient wisdom meets modern precision, your
          transformation becomes not just possible but inevitable.
        </div>
      </div>

      <div className='mt-12 md:mt-20'>
        <div className='text-[28px] md:text-[40px] md:text-center text-pemaBlue font-ivyOra px-4'>
          Still have questions?{' '}
        </div>
        <FAQs />
        <Link
          href={'/resources'}
          className='font-crimson w-fit text-pemaBlue text-base md:text-xl flex flex-row gap-2 border-b justify-center border-pemaBlue mx-auto'
        >
          See all FAQs <MoveRight className='text-pemaBlue' />
        </Link>
      </div>
      {/* whatsapp icon */}
      <WhatsappStickyButton />
    </div>
  )
}
