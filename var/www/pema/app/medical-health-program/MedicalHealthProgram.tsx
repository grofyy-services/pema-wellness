'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, Mail, MapPin, MoveRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { goToPemaMaps, ROUTES } from '@/utils/utils'
import Marquee from 'react-fast-marquee'
import TestimonialCard from './Testimonials'
import PemaTabsWeb from './Slides'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import TestimonialCard2 from './Testimonials2'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Medical programs' }]
import ReactPlayer from 'react-player'
import CountryDropdown from '@/components/CountryDropDown'
import FAQs from './FAQs'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { useAtomValue } from 'jotai'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import ImageWithShimmer from '@/components/ImageWithShimmer'
import DoctorsCarousel, {
  chefRajiv,
  doctorMuthu,
  doctorNaveed,
  doctorRamya,
  doctorSangeetha,
  doctorSarath,
  professorPrahalad,
} from './[slug]/ExpertsTeam'

export default function MedicalHealthProgram() {
  const router = useRouter()
  const [currentTrack, setCurrentTrack] = useState('overview')
  const [playingMobileVideo1, setPlayingMobileVideo1] = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const currency = useAtomValue(selectedCurrencyAtom)

  // const handleScroll = () => {
  //   sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentTrack(entry.target.id)
          }
        })
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.25, // fire when 25% visible
      }
    )

    // Only observe refs that exist right now
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    // Cleanup
    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [sectionRefs.current]) // <- important: run effect after refs are populated

  // const params = useSearchParams()
  // useEffect(() => {
  //   if (params.get('tab') === 'medical-programs') {
  //     setCurrentTrack(1)
  //   }
  // }, [])
  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center mb-2 mt-4 md:mt-9'>
        Track 1 - Medical programs{' '}
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center'>
        Where your healing universe unfolds on sacred ground{' '}
      </div>
      <div
        className='relative'
        id='overview'
        ref={(el: HTMLDivElement | null): void => {
          sectionRefs.current[0] = el
        }}
      >
        <nav
          className='sticky top-[77px] flex flex-row justify-center md:pt-4 pb-4 select-none bg-white z-2'
          role='tablist'
          aria-label='Swiper tabs'
        >
          <button
            role='tab'
            onClick={() => {
              setCurrentTrack('overview')
              router.push('#')
            }}
            className={`px-3 py-2 cursor-pointer border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
              currentTrack === 'overview'
                ? 'text-pemaBlue border-pemaBlue'
                : 'border-[#32333333] text-slateGray '
            }`}
          >
            Overview
          </button>
          <button
            role='tab'
            onClick={() => {
              setCurrentTrack('medical-programs')
              router.push('#medical-programs')
            }}
            className={`px-3 py-2 cursor-pointer border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
              currentTrack === 'medical-programs'
                ? 'text-pemaBlue border-pemaBlue'
                : 'border-[#32333333] text-slateGray '
            }`}
          >
            Medical programs
          </button>
        </nav>
        <div className='px-4'>
          <div className='relative mt-6 w-full max-h-[470px] aspect-358/470 md:aspect-630/1360 md:max-h-[630px] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/medical-health-program/hero-image-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover block md:hidden absolute top-0 left-0 `}
            />
            <ImageWithShimmer
              src={'/images/medical-health-program/hero-image.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover hidden md:block absolute top-0 left-0 `}
            />
          </div>
        </div>
        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className='w-full md:w-[80%] text-[24px] md:text-[32px] text-pemaBlue font-ivyOra py-2 text-left md:text-center m-auto'>
            From stubborn weight and diabetes to fertility challenges, fatty liver, and high blood
            pressure we’ve helped thousands reverse what once felt irreversible. <br /> All on land
            long known as The Healing Hills, where science meets stillness and your body learns to
            heal for good.{' '}
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
        {/*Come as you are. Stay as long as you need. */}
        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            You’ve explored alternative therapies
          </div>
          <div
            className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mt-4 mb-6
        md:w-[60%] m-auto w-full'
          >
            {`Now discover what happens when India’s most advanced naturopathic protocols meet clinical precision and sacred coastal energy.`}
          </div>

          <div className='relative mt-6 w-full h-[430px] md:h-[552px] overflow-hidden'>
            <ImageWithShimmer
              src={'/pema-location-image-home.webp'}
              alt={'naturopathy-banner-home'}
              fill
              className={`object-cover absolute hidden md:block top-0 left-0 `}
            />
            <ImageWithShimmer
              src={'/images/medical-health-program/pema-location-mobile.webp'}
              alt={'naturopathy-banner-home'}
              fill
              className={`object-cover absolute block md:hidden top-0 left-0 `}
            />
          </div>
        </div>

        <TestimonialCard />
        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[24px] md:text-[40px] text-slateGray font-ivyOra text-center leading-[120%] m-auto'>
            To explore our medical programs in depth, you can{' '}
          </div>

          <a
            href='https://drive.google.com/file/d/1_T_EP7sT6HKdLGWgpUGy65bPR3T4eIlL/view?usp=drive_link'
            target='_blank'
            className='font-crimson flex text-center mt-3 w-fit text-pemaBlue text-base md:text-xl  
            flex-row justify-center gap-2 border-b border-pemaBlue mx-auto'
          >
            Download the brochure here{' '}
          </a>
        </div>
        <div className='mt-12 md:mt-20 m-auto px-4 py-4 bg-softSand md:py-10'>
          <div className='text-[28px] md:text-center md:text-[40px] text-pemaBlue font-ivyOra'>
            The Pema <br className='md:hidden' /> medical advantage{' '}
          </div>

          <div className='text-base md:text-xl md:text-center text-slateGray font-ivyOra md:mt-6 '>
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

        <div className='lg:grid grid-cols-[33%_66%] grid-rows-1 mt-12 md:mt-20 md:gap-5 m-auto  px-4'>
          {/* Left column (40%) */}
          <div className='flex flex-col justify-start '>
            <div className='mt-0 md:mt-9'>
              <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                The Healing Hills phenomenon{' '}
              </div>
              <div className='text-base md:text-xl text-slateGray mt-2'>
                {`The unique magnetic properties of these hills create an environment where the body's natural healing mechanisms are amplified. The earth's healing energy enhances every treatment, therapeutic meal, and moment of rest. Modern science is beginning to understand what our ancestors knew intuitively.`}
              </div>
            </div>
          </div>

          {/* Right column (60%) */}
          <div className='relative w-full h-[350] overflow-hidden md:h-[517] md:mt-0 mt-6'>
            <ImageWithShimmer
              src='/images/medical-health-program/healing-hill-web.webp'
              alt='medical-health-program-banner-home'
              fill
              className='object-cover absolute top-0 left-0'
            />
          </div>
        </div>

        <div className='mt-12 md:mt-20 m-auto grid md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max px-4'>
          <div className='h-max'>
            <div className='block md:hidden'>
              <div className='text-pemaBlue font-ivyOra text-xl mt-5 mb-2'>
                India’s most renowned <br /> naturopathic physicians{' '}
              </div>{' '}
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                India’s leading naturopathic physicians combine decades of expertise with
                nature-inspired healing, using advanced diagnostics and time-tested methods for
                lasting wellness.
              </div>
            </div>
            <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
              <div className='md:hidden  flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Protocols enhanced by the natural healing magnetism of ancient hills.
              </div>

              <ImageWithShimmer
                src='/images/medical-health-program/iamge-1.webp'
                alt='room image'
                className='max-h-[545px]  object-cover'
                width={750}
                height={500}
              />
              <div className='md:hidden flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Comprehensive diagnostics that reveal root causes.{' '}
              </div>

              <ImageWithShimmer
                src='/images/medical-health-program/image-2.webp'
                alt='room image'
                className='max-h-[545px] object-cover'
                width={750}
                height={500}
              />
            </div>
            <div className='md:hidden flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} /> 30+
              years of collective experience in naturopathic medicine.{' '}
            </div>
            <ImageWithShimmer
              src='/images/medical-health-program/image-3.webp'
              alt='rooom iamge'
              className='md:h-[550px] h-[350] w-full md:mt-4'
              width={750}
              height={500}
            />
          </div>
          <div className='hidden md:flex flex-col md:mx-5 mb-3'>
            <div className='md:mt-9'>
              <div className='text-[20px] hidden md:block md:text-[24px] text-slateGray font-ivyOra'>
                India’s most renowned <br /> naturopathic physicians{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                India’s leading naturopathic physicians combine decades of expertise with
                nature-inspired healing, using advanced diagnostics and time-tested methods for
                lasting wellness.
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Protocols enhanced by the natural healing magnetism of ancient hills.
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Comprehensive diagnostics that reveal root causes.{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                250+ years of collective experience in naturopathic medicine.{' '}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-12 md:mt-20 m-auto grid md:grid-cols-[33%_66%] md:grid-rows-1 h-max px-4'>
          <div className='hidden md:flex flex-col md:mx-5 mb-3'>
            <div className='md:mt-9'>
              <div className='text-[20px] hidden md:block md:text-[24px] text-slateGray font-ivyOra'>
                Unmatched comfort & <br />
                wellness experience{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                Indulge in world-class healing surrounded by the ocean’s tranquility, gourmet
                therapeutic cuisine, and rejuvenating spa care crafted for complete mind-body
                restoration.
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Medical treatment in luxury oceanfront suites.{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Therapeutic cuisine that looks and tastes like fine dining.{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Private beach access for healing walks.{' '}
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Holistic treatments that accelerate recovery.{' '}
              </div>
            </div>
          </div>
          <div className='h-max'>
            <div className='block md:hidden'>
              <div className='text-pemaBlue font-ivyOra text-xl mt-5 mb-2'>
                Unmatched comfort & <br />
                wellness experience{' '}
              </div>{' '}
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                Indulge in world-class healing surrounded by the ocean’s tranquility, gourmet
                therapeutic cuisine, and rejuvenating spa care crafted for complete mind-body
                restoration.
              </div>
            </div>
            <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
              <div className='md:hidden  flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Medical treatment in luxury oceanfront suites.{' '}
              </div>

              <ImageWithShimmer
                src='/images/medical-health-program/image-4.webp'
                alt='room image'
                className='max-h-[545px] object-cover'
                width={750}
                height={500}
              />
              <div className='md:hidden flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Therapeutic cuisine that looks and tastes like fine dining.{' '}
              </div>

              <ImageWithShimmer
                src='/images/medical-health-program/image-5.webp'
                alt='room image'
                className='max-h-[545px] object-cover'
                width={750}
                height={500}
              />
            </div>
            <div className='md:hidden flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
              Private beach access for healing walks.{' '}
            </div>
            <ImageWithShimmer
              src='/images/medical-health-program/image-7.webp'
              alt='rooom iamge'
              className='md:max-h-[550px] h-[350] w-full md:hidden'
              width={750}
              height={500}
            />
            <div className='md:hidden flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
              Holistic treatments that accelerate recovery.{' '}
            </div>
            <ImageWithShimmer
              src='/images/medical-health-program/image-6.webp'
              alt='rooom iamge'
              className='md:h-[550px] h-[350] w-full  md:mt-4'
              width={750}
              height={500}
            />
          </div>
        </div>

        <div className='mt-12 md:mt-20 mx-4'>
          <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Luxury ground & air transfers{' '}
          </div>
          <div
            className='hidden md:block text-base leading-none md:text-xl text-slateGray font-crimson text-left md:text-center mt-0 md:mt-4 mb-6
        md:w-[70%] m-auto w-full'
          >
            Private and seamless arrivals.
          </div>
          <div className='grid md:grid-cols-[66%_33%] grid-rows-1 gap-6 md:gap-4'>
            <div className='flex flex-col-reverse md:flex-col gap-3 text-base md:text-xl'>
              <div className='relative w-full h-[350] overflow-hidden md:h-[517]'>
                <ImageWithShimmer
                  src='/images/medical-health-program/ground-transport.webp'
                  alt='medical-health-program-banner-home'
                  fill
                  className='object-cover absolute top-0 left-0'
                />
              </div>
              Luxury vehicle service
            </div>
            <div className='flex flex-col-reverse md:flex-col gap-3 text-base md:text-xl'>
              <div className='relative w-full h-[350] overflow-hidden md:h-[517]'>
                <ImageWithShimmer
                  src='/images/medical-health-program/air-transport.webp'
                  alt='medical-health-program-banner-home'
                  fill
                  className='object-cover absolute top-0 left-0'
                />
              </div>
              Helicopter transfer (available on request)
            </div>
          </div>
        </div>

        {/*
         */}

        <div
          id='medical-programs'
          ref={(el: HTMLDivElement | null): void => {
            sectionRefs.current[1] = el
          }}
          className='mt-12 md:mt-20 mx-4 scroll-mt-[140px] md:scroll-mt-0'
        >
          {/* <Element name='medical-programs'> */}
          <div className=' text-[28px] mb-6 md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Medical programs by condition{' '}
          </div>

          <PemaTabsWeb />
          {/* </Element> */}
        </div>
        <div className='flex justify-center px-4'>
          <PrimaryButton
            onClick={() => router.push(ROUTES.medicalHealthAssessment)}
            className='mt-4 md:mt-9 mx-auto w-full md:w-fit'
          >
            Take health assessment
          </PrimaryButton>
        </div>

        <div className='lg:grid grid-cols-[35%_65%] grid-rows-1 mt-12 md:mt-20 md:gap-5 max-w-[1360px] px-4 m-auto'>
          {/* Left column (40%) */}
          <div className='flex flex-col justify-start mb-6'>
            <div className='md:mt-9'>
              <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                Eight days feels like too much?{' '}
              </div>
              <div className='text-base md:text-xl text-slateGray mt-2'>
                Start with just three. Experience gentle therapies, ocean-view calm, and clean
                cuisine. No pressure, just a reset.{' '}
              </div>
            </div>
            <div>
              <Link
                href={'/pema-lite'}
                className='mt-3 md:mt-8 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                Start with Pema lite <MoveRight />
              </Link>
            </div>
          </div>

          {/* Right column (60%) */}
          <div className='relative w-full h-[350] md:h-[700px] overflow-hidden'>
            <ImageWithShimmer
              src='/images/home/pema-lite-home-web.webp'
              alt='wellbeing-banner-home'
              fill
              className='object-cover absolute top-0 left-0'
            />
          </div>
        </div>

        <div className='md:grid hidden grid-cols-[35%_65%] md:gap-5 grid-rows-1 mt-12 md:mt-20  max-w-[1360px] px-4 m-auto'>
          {/* Left column (40%) */}
          <div className='flex flex-col justify-start mb-6'>
            <div className='md:mt-9'>
              <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                Looking to relax?{' '}
              </div>
              <div className='text-base md:text-xl text-slateGray mt-2'>
                If you’re here for medical healing, you’re in the right place. If you’re here to
                restore energy and radiance, explore our luxury wellness journeys instead.
              </div>
            </div>
            <div>
              <Link
                href={ROUTES.wellnessProgram}
                className='mt-3 md:mt-8 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                Explore wellness journey <MoveRight />
              </Link>
            </div>
          </div>

          {/* Right column (60%) */}
          <div className='relative w-full h-[350] md:h-[700px] overflow-hidden'>
            <ImageWithShimmer
              src='/images/medical-health-program/wellness-journey-web.webp'
              alt='wellbeing-banner-home'
              fill
              className='object-cover absolute top-0 left-0'
            />
          </div>
        </div>

        {/* leaders section */}
        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto'>
          <div className='px-4 mb-6 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
            Our medical team{' '}
          </div>

          <DoctorsCarousel
            doctors={[
              doctorSarath,
              doctorSangeetha,
              doctorRamya,
              professorPrahalad,
              doctorMuthu,
              doctorNaveed,
              chefRajiv,
            ]}
          />
        </div>

        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto px-4'>
          <div className=' bg-softSand py-5 px-5 md:px-0 md:py-10'>
            <div className='mb-1 md:mb-3 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center'>
              Why choose Pema for medical care{' '}
            </div>
            <div className='text-base md:text-xl text-left mb-3 md:mb-6 md:text-center'>
              Pema vs Traditional hospitals
            </div>
            <div className='max-w-5xl mx-auto md:grid flex flex-col-reverse grid-cols-2 grid-rows-1 '>
              <div className='py-5 md:py-9 relative bg-pemaBlue text-softSand px-3 md:px-6 grid grid-cols-[30%_70%] md:flex flex-row md:flex-col gap-1 md:gap-9'>
                <div className='text-base md:text-xl text-left'>Pema </div>
                <div className='flex flex-col gap-3 md:gap-4 '>
                  <div className='flex flex-row items-center gap-2 '>
                    <Image
                      src={'/lotus-pointer-light-1.svg'}
                      width={31}
                      height={24}
                      alt='Pointer'
                      className='hidden md:block'
                    />
                    <div className='text-base md:text-xl text-left '>Root cause reversal </div>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/lotus-pointer-light-2.svg'}
                      width={31}
                      height={24}
                      alt='Pointer'
                      className='hidden md:block'
                    />
                    <div className='text-base md:text-xl text-left '>
                      Luxury on sacred healing ground{' '}
                    </div>
                  </div>{' '}
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/lotus-pointer-light-3.svg'}
                      width={31}
                      height={24}
                      alt='Pointer'
                      className='hidden md:block'
                    />
                    <div className='text-base md:text-xl text-left '>
                      Natural healing amplified by earth energy{' '}
                    </div>
                  </div>
                </div>
                <Image
                  alt='Bg image'
                  width={270}
                  height={130}
                  className='absolute right-0 bottom-0 md:w-[270px] aspect-auto w-[150px]'
                  src={'/images/medical-health-program/lotus-gray-bg-image.svg'}
                />
              </div>
              <div className='py-5 md:py-9 px-3 md:px-6 border border-[#32333333] grid grid-cols-[30%_70%] md:flex flex-row md:flex-col gap-1 md:gap-9'>
                <div className='text-base md:text-xl text-left'>Traditional hospital </div>
                <div className='flex flex-col gap-3 md:gap-4 '>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/lotus-pointer-1.svg'}
                      width={31}
                      height={24}
                      alt='Pointer'
                      className='hidden md:block'
                    />
                    <div className='text-base md:text-xl text-left '>Symptom management </div>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/lotus-pointer-2.svg'}
                      width={31}
                      height={24}
                      alt='Pointer'
                      className='hidden md:block'
                    />
                    <div className='text-base md:text-xl text-left '>Sterile environment </div>
                  </div>{' '}
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/lotus-pointer-3.svg'}
                      width={31}
                      height={24}
                      alt='Pointer'
                      className='hidden md:block'
                    />
                    <div className='text-base md:text-xl text-left '>Side effects </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 
      testimonials 2
       */}
        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto'>
          <TestimonialCard2 />
        </div>
        {/* video section web */}
        <div className='mt-20 max-w-[1360px] m-auto'>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra px-4 text-left md:text-center mb-6'>
            The luxury healing experience{' '}
          </div>
          <div className='flex h-[350] md:h-[744px] justify-center items-center mb-6'>
            <ReactPlayer
              preload='true'
              controls
              width='100%'
              height='100%'
              light='/images/home/home-web-video-1-thumbnail.webp'
              src='https://www.youtube.com/watch?v=PdcJxXKf7Og'
              // height={410}
              // width={'100%'}
              className='w-[100vw] h-75 aspect-video'
              playing={playingMobileVideo1}
              muted
              onClickPreview={() => setPlayingMobileVideo1(true)}
              playIcon={
                <Image
                  width={80}
                  height={80}
                  className='h-20 w-20 aspect-square'
                  src={'/play-button.svg'}
                  alt='play button'
                />
              }
            />
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

        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto'>
          <div className='grid md:grid-cols-[65%_35%] md:grid-rows-1 md:gap-5 mb-4'>
            <div>
              <div className='md:block hidden'>
                <ImageWithShimmer
                  src={'/images/medical-health-program/medical-investment.webp'}
                  alt='rooom iamge'
                  className='h-[700px] w-full'
                  width={750}
                  height={500}
                />
              </div>
            </div>
            <div className='px-4 md:px-0 md:mt-9'>
              <div className='text-pemaBlue  font-ivyOra text-[28px] md:text-[32px] mb-2 '>
                Your medical investment
              </div>
              <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                Your Pema experience starts from{' '}
              </div>
              <div className='mt-3 md:mt-6 flex flex-row justify-between items-center'>
                <div className='text-slateGray font-ivyOra text-2xl md:text-[32px]'>
                  {convertINRUsingGlobalRates(45000, currency)} onwards
                </div>
                <CountryDropdown />
              </div>
              <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                Comprehensive healing protocols, luxury accommodation, therapeutic cuisine, and
                lifetime support.{' '}
              </div>
              <Link
                href={'#contact-us'}
                className='font-crimson text-left mt-6 w-fit text-pemaBlue text-base md:text-xl flex flex-row justify-start gap-2 border-b border-pemaBlue'
              >
                Book now <MoveRight />
              </Link>{' '}
            </div>
          </div>
        </div>
        {/*












       */}

        <div className='mt-12 md:mt-20'>
          <div className=' w-full max-w-[750px] mx-auto md:text-center'>
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra px-4'>
              Still have questions before you begin?{' '}
            </div>
            <div className='text-slateGray font-crimson text-base md:text-[20px] md:mb-6 mt-2 px-4'>
              We’ve helped thousands heal conditions they were told were irreversible. Here are the
              questions people ask most before they take the first step.
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

        <div className='lg:grid grid-cols-[33%_66%] grid-rows-1 mt-12 md:mt-20  max-w-[1360px] px-4 m-auto'>
          {/* Left column (40%) */}
          <div className='flex flex-col justify-start mb-3 md:mb-6 md:px-5'>
            <div className='md:mt-9'>
              <div className='text-[28px] md:text-[40px] text-pemaBlue leading-[120%] font-ivyOra'>
                Where medical care meets sacred land{' '}
              </div>
              <div className='text-base md:text-xl text-slateGray'>
                Located on The Healing Hills of Visakhapatnam, 28 acres of ocean-facing land where
                energy, medicine, and recovery align.
              </div>
            </div>
            <div>
              <PrimaryButton onClick={goToPemaMaps} className='w-full mt-9 md:block hidden'>
                Open in maps
              </PrimaryButton>
            </div>
          </div>

          {/* Right column (60%) */}
          <div className='relative w-full h-[350] md:h-[700px] overflow-hidden'>
            <ImageWithShimmer
              src='/images/medical-health-program/scared-land-web.webp'
              alt='wellbeing-banner-home'
              fill
              className='object-cover absolute top-0 left-0'
            />
          </div>
          <PrimaryButton onClick={goToPemaMaps} className='w-full mt-3 block md:hidden'>
            Open in maps
          </PrimaryButton>
        </div>

        {/* weelbeing section web+mobile */}
        <div className='mt-12 md:mt-20 max-w-[1360px] md:hidden block m-auto px-4 md:px-0'>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%]'>
            Not sure if you need medical healing or wellness?{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:mb-6 md:w-[60%] w-full mx-auto'>
            If you’re here for medical healing, you’re in the right place. If you’re here to restore
            energy and radiance, explore our luxury wellness journeys instead.
          </div>

          <Link
            href={ROUTES.wellnessProgram}
            className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start md:m-auto gap-2 border-b border-pemaBlue w-fit'
          >
            Explore wellness journey
            <MoveRight />
          </Link>
          <div className='relative mt-6 w-full h-[350] md:h-[517] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/medical-health-program/bottom-hero-image.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 hidden md:block `}
            />
            <ImageWithShimmer
              src={'/images/medical-health-program/bottom-hero-image-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 md:hidden block`}
            />
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
