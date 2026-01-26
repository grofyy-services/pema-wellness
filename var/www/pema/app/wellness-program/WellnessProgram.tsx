'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, Mail, MapPin, MoveRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { EXTERNAL_LINKS, goToPemaMaps, ROUTES, zohoForms } from '@/utils/utils'
import Marquee from 'react-fast-marquee'
import TestimonialCard from './Testimonials'
import PemaTabsWeb from './Slides'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Wellness journey' }]
import CountryDropdown from '@/components/CountryDropDown'
import FAQs from './FAQs'
import TextTestimonialCard from '@/components/TextTestimonials'
import { textTestData } from './Testimonials2'
import { useAtomValue } from 'jotai'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import ImageWithShimmer from '@/components/ImageWithShimmer'

export default function WellnessProgram() {
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

  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center mb-2 mt-4 md:mt-9'>
        Track 2 - Wellness journey{' '}
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center'>
        The ultimate reset. Where luxury meets cellular renewal.{' '}
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
              setCurrentTrack('wellness-programs')
              router.push('#wellness-programs')
            }}
            className={`px-3 py-2 cursor-pointer border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
              currentTrack === 'wellness-programs'
                ? 'text-pemaBlue border-pemaBlue'
                : 'border-[#32333333] text-slateGray '
            }`}
          >
            Wellness journey{' '}
          </button>
        </nav>

        <div className='px-4'>
          <div className='relative mt-6 w-full max-h-[470px] aspect-358/470 md:aspect-630/1360 md:max-h-[630px] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/wellness-program/wellness-header-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover block md:hidden absolute top-0 left-0 `}
            />
            <ImageWithShimmer
              src={'/images/wellness-program/wellness-header-web.webp'}
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

        <TestimonialCard />
        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[24px] md:text-[40px] text-slateGray font-ivyOra text-center leading-[120%] m-auto'>
            To explore our wellness experience in depth, you can{' '}
          </div>

          <a
            href='https://drive.google.com/file/d/1mjSWibB1iLWUCnldRRbHstzkCZFj46eL/view?usp=sharing'
            target='_blank'
            className='font-crimson flex text-center mt-3 w-fit text-pemaBlue text-base md:text-xl  
            flex-row justify-center gap-2 border-b border-pemaBlue mx-auto'
          >
            Download the Pema brochure here
          </a>
        </div>
        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            The pinnacle of luxury wellness{' '}
          </div>
          <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
            Welcome to your wellness universe on The Healing Hills.{' '}
          </div>
          <div className='lg:grid grid-cols-[65%_35%] grid-rows-1 mt-6'>
            <div className='relative w-full h-[350px] md:h-[530px] overflow-hidden'>
              <ImageWithShimmer
                src={'/images/wellness-program/pinnacle-web.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0 `}
              />
            </div>
            <div className='flex flex-col justify-start md:mx-8'>
              <div className='md:mt-9'>
                <div className='text-base md:text-xl text-slateGray mt-3 leading-[110%]'>
                  {`You've experienced premium wellness retreats around the world, including five-star spas in Thailand, luxury detoxes in Costa Rica, and the celebrated sanctuaries of India. Now, discover the wellness universe that transcends them all, perched on sacred hills known for their healing magnetism for thousands of years, where every element of your being finds its perfect harmony.`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            What makes Pema different{' '}
          </div>
          <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
            The Healing Hills advantage{' '}
          </div>
          <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
            For thousands of years, locals have known these hills possess unique healing properties.
            Modern energy mapping confirms what ancient wisdom always knew this land pulses with
            therapeutic magnetism that enhances every treatment, every meal, every moment of
            rest.{' '}
          </div>

          {/* 
          
          
          
          
          
          3 image view - 1 
          
          
          
          
          
          */}
          <div className='mt-9 md:mt-6 m-auto '>
            <div className='hidden md:grid md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max'>
              <div className='h-max'>
                <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
                  {/* first image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-1-web.webp'
                    alt='room image'
                    className='h-[545px] object-cover'
                    width={750}
                    height={500}
                  />

                  {/* second image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-2-web.webp'
                    alt='room image'
                    className='h-[545px] object-cover'
                    width={750}
                    height={500}
                  />
                </div>

                {/* third image horizontal*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-3-web.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
              </div>

              <div className='flex flex-col md:mx-5 mb-3'>
                <div className='md:mt-9'>
                  <div className='text-[20px] block md:text-[24px] text-slateGray font-ivyOra'>
                    Sacred healing sanctuary{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    A rare union of ocean, hills, and healing energy, this sanctuary offers an
                    immersive environment designed to restore balance, peace, and vitality.
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    28 acres of clifftop sanctuary overlooking the Bay of Bengal.
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Private beach access for morning walks and sunset meditation.{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Luxurious suites positioned to harness natural healing energy.{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Infinity pool that merges with both ocean and hill magnetism.{' '}
                  </div>
                </div>
              </div>
            </div>

            <div className='grid md:hidden md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max'>
              <div className='h-max'>
                <div className='block '>
                  <div className='text-pemaBlue font-ivyOra text-xl mt-5 mb-2'>
                    Sacred healing sanctuary{' '}
                  </div>{' '}
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray'>
                    A rare union of ocean, hills, and healing energy, this sanctuary offers an
                    immersive environment designed to restore balance, peace, and vitality.
                  </div>
                </div>
                <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
                  <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3 mb-2'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    28 acres of clifftop sanctuary overlooking the Bay of Bengal.
                  </div>
                  {/* first image w-1/2 */}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-1-mobile.webp'
                    alt='room image'
                    className='max-h-[545px] object-cover'
                    width={750}
                    height={500}
                  />
                  <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Private beach access for morning walks and sunset meditation.{' '}
                  </div>
                  {/* second image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-2-mobile.webp'
                    alt='room image'
                    className='max-h-[545px] object-cover'
                    width={750}
                    height={500}
                  />
                </div>
                <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                  <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                  Luxurious suites positioned to harness natural healing energy.{' '}
                </div>
                {/* third image*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-3-mobile.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
                <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                  <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                  Infinity pool that merges with both ocean and hill magnetism.{' '}
                </div>
                {/* third image*/}
                <Image
                  src='/images/wellness-program/img-4-mobile.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
              </div>
            </div>
          </div>
          {/*
          
          
          
          3 image view - 2 
          
          
          
          
          */}
          <div className='mt-12 md:mt-20 m-auto '>
            <div className='hidden m-auto md:grid md:grid-cols-[33%_66%] md:grid-rows-1 h-max px-4'>
              <div className='flex flex-col md:mx-5 mb-3'>
                <div className='md:mt-9'>
                  <div className='text-[20px] block md:text-[24px] text-slateGray font-ivyOra'>
                    Spa mastery that redefines luxury{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    Experience therapies rooted in centuries-old traditions, delivered by expert
                    hands in serene, private settings infused with the ocean’s energy.
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Treatments sourced from 5,000-year-old healing traditions.
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Therapists trained in ancient Ayurvedic and modern techniques.{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Private treatment pavilions with ocean breezes.{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Signature rituals you won’t find anywhere else.{' '}
                  </div>
                </div>
                <Link
                  href={ROUTES.theSanctuary}
                  className='font-crimson md:flex text-center mt-9 w-fit text-pemaBlue text-base md:text-xl hidden flex-row justify-center gap-2 border-b border-pemaBlue'
                >
                  Explore the healing hub <MoveRight />
                </Link>{' '}
              </div>
              <div className='h-max'>
                <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
                  {/* first image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-4-web.webp'
                    alt='room image'
                    className='h-[545px] object-cover'
                    width={750}
                    height={500}
                  />

                  {/* second image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-5-web.webp'
                    alt='room image'
                    className='h-[545px] object-cover'
                    width={750}
                    height={500}
                  />
                </div>

                {/* third image horizontal*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-6-web.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
              </div>
            </div>

            <div className=' grid md:hidden md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max'>
              <div className='h-max'>
                <div className='block '>
                  <div className='text-pemaBlue font-ivyOra text-xl mt-5 mb-2'>
                    Spa mastery that redefines luxury{' '}
                  </div>{' '}
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray'>
                    Experience therapies rooted in centuries-old traditions, delivered by expert
                    hands in serene, private settings infused with the ocean’s energy.
                  </div>
                </div>
                <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
                  <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3 mb-2'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Treatments sourced from 5,000-year-old healing traditions.
                  </div>
                  {/* first image w-1/2 */}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-5-mobile.webp'
                    alt='room image'
                    className='max-h-[545px] object-cover'
                    width={750}
                    height={500}
                  />
                  <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Therapists trained in ancient Ayurvedic and modern techniques.
                  </div>
                  {/* second image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-6-mobile.webp'
                    alt='room image'
                    className='max-h-[545px] object-cover'
                    width={750}
                    height={500}
                  />
                </div>
                <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                  <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                  Private treatment pavilions with ocean breezes.{' '}
                </div>
                {/* third image*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-7-mobile.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
                <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                  <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                  Signature rituals you won’t find anywhere else.{' '}
                </div>
                {/* third image*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-8-mobile.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
                <Link
                  href={ROUTES.theSanctuary}
                  className='font-crimson md:hidden text-center mt-6 w-fit text-pemaBlue text-base md:text-xl flex flex-row justify-center gap-2 border-b border-pemaBlue'
                >
                  Explore the healing hub <MoveRight />
                </Link>{' '}
              </div>
            </div>
          </div>
          {/* 
          
          
          
          
          3 image view - 3 
          
          
          
          */}
          <div className='mt-12 md:mt-20 m-auto '>
            <div className='hidden md:grid md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max'>
              <div className='h-max'>
                <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
                  {/* first image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-7-web.webp'
                    alt='room image'
                    className='h-[545px]  object-cover'
                    width={750}
                    height={500}
                  />

                  {/* second image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-8-web.webp'
                    alt='room image'
                    className='h-[545px]  object-cover'
                    width={750}
                    height={500}
                  />
                </div>

                {/* third image horizontal*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-9-web.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
              </div>

              <div className='flex flex-col md:mx-5 mb-3'>
                <div className='md:mt-9'>
                  <div className='text-[20px] block md:text-[24px] text-slateGray font-ivyOra'>
                    Culinary excellence meets wellness{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    Savour meals that nourish the body and delight the senses, crafted from organic,
                    mineral-rich ingredients and prepared with healing-focused techniques.
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Ingredients sourced from our organic gardens grown in mineral-rich soil.{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Meals that nourish without compromising on taste.{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Private dining experiences by the ocean.{' '}
                  </div>
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Pranic* cooking methods that enhance food’s healing properties.{' '}
                  </div>
                </div>
                <Link
                  href={ROUTES.ourApproach}
                  className='font-crimson md:flex text-center mt-9 w-fit text-pemaBlue text-base md:text-xl hidden flex-row justify-center gap-2 border-b border-pemaBlue'
                >
                  Know more about our cuisine <MoveRight />
                </Link>{' '}
              </div>
            </div>

            <div className=' grid md:hidden md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max'>
              <div className='h-max'>
                <div className='block '>
                  <div className='text-pemaBlue font-ivyOra text-xl mt-5 mb-2'>
                    Culinary excellence meets wellness{' '}
                  </div>{' '}
                  <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray'>
                    Ingredients sourced from our organic gardens grown in mineral-rich soil.{' '}
                  </div>
                </div>
                <div className=' md:flex md:flex-row gap-4 w-full overflow-hidden'>
                  <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3 mb-2'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Ingredients sourced from our organic gardens grown in mineral-rich soil.
                  </div>
                  {/* first image w-1/2 */}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-9-mobile.webp'
                    alt='room image'
                    className='max-h-[545px] md:w-1/2 object-cover'
                    width={750}
                    height={500}
                  />
                  <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                    <Image
                      alt='icon'
                      src={'/images/kosha-pointer-icon.svg'}
                      width={28}
                      height={23}
                    />{' '}
                    Meals that nourish without compromising on taste.
                  </div>
                  {/* second image w-1/2*/}
                  <ImageWithShimmer
                    src='/images/wellness-program/img-10-mobile.webp'
                    alt='room image'
                    className='max-h-[545px] md:w-1/2 object-cover'
                    width={750}
                    height={500}
                  />
                </div>
                <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                  <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                  Private dining experiences by the ocean.
                </div>
                {/* third image*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-11-mobile.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
                <div className=' flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 mb-2'>
                  <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                  Pranic* cooking methods that enhance food’s healing properties.
                </div>
                {/* third image*/}
                <ImageWithShimmer
                  src='/images/wellness-program/img-12-mobile.webp'
                  alt='rooom iamge'
                  className='md:h-[550px] h-[350] w-full md:mt-4'
                  width={750}
                  height={500}
                />
              </div>
              <Link
                href={ROUTES.ourApproach}
                className='font-crimson md:hidden text-center mt-6 w-fit text-pemaBlue text-base md:text-xl flex flex-row justify-center gap-2 border-b border-pemaBlue'
              >
                Know more about our cuisine <MoveRight />
              </Link>{' '}
            </div>
          </div>
        </div>
        <div className='mt-12 md:mt-20 m-auto px-4 bg-softSand p-4 md:p-10'>
          <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            Beyond wellness{' '}
          </div>
          <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
            Discover your complete universe{' '}
          </div>
          <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[70%] m-auto w-full'>
            Most retreats focus on treatments. Pema focuses on systems. We combine naturopathy with
            modern science, layering therapies, diagnostics, cuisine, and rest into one integrated
            whole. The result is hyper-personalised care that adapts to you, not the other way
            around. This isn’t wellness as an activity. It’s wellness as a way of being.
          </div>
          <div className='relative mt-6 w-full md:h-[517px] h-[350px] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/wellness-program/beyond-mobile.webp'}
              alt={'beyond-banner-home'}
              fill
              className={`object-cover block md:hidden absolute top-0 left-0 `}
            />
            <ImageWithShimmer
              src={'/images/wellness-program/beyond-web.webp'}
              alt={'beyond-banner-home'}
              fill
              className={`object-cover hidden md:block absolute top-0 left-0 `}
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
          id='wellness-programs'
          ref={(el: HTMLDivElement | null): void => {
            sectionRefs.current[1] = el
          }}
          className='mt-12 md:mt-20 mx-4 scroll-mt-[140px] md:scroll-mt-0'
        >
          <div className=' text-[28px] mb-6 md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Signature wellness experiences{' '}
          </div>

          <PemaTabsWeb />
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
                Not ready for 8 days? <br />
                Start with 3{' '}
              </div>
              <div className='text-base md:text-xl text-slateGray mt-2'>
                Pema lite is the ideal entry point. 3 days of personalised care, breathwork, healing
                food, and introductory therapies. Perfect for those exploring wellness for the first
                time.
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

        {/* 
      testimonials 2
       */}
        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto'>
          <TextTestimonialCard
            data={textTestData}
            bgMobile='/images/wellness-program/testimonial-bg-mobile.webp'
            bgWeb='/images/wellness-program/testimonial-bg-web.webp'
          />
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
                Your luxury wellness investment{' '}
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
                All-inclusive luxury accommodation, spa treatments, gourmet healing cuisine, and
                wellness consultations.
              </div>
              <PrimaryButton
                onClick={() => router.push(ROUTES.medicalHealthAssessment)}
                className='w-full mt-4 md:mt-9'
              >
                Take health assessment
              </PrimaryButton>
              <Link
                href={zohoForms.bookConsultaion}
                className='font-crimson text-center mt-6 w-fit mx-auto text-pemaBlue text-base md:text-xl flex flex-row justify-center gap-2 border-b border-pemaBlue'
              >
                Book consultation <MoveRight />
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

        <div className='lg:grid grid-cols-[33%_66%] gap-5 grid-rows-1 mx-5 mt-12 md:mt-20  max-w-[1360px] md:p-10 p-4 bg-softSand m-auto'>
          {/* Left column (40%) */}
          <div className='flex flex-col justify-start mb-3 md:mb-6'>
            <div className='md:mt-9'>
              <div className='text-[28px] md:text-[40px] text-pemaBlue leading-[120%] font-ivyOra'>
                A sanctuary on sacred ground{' '}
              </div>
              <div className='text-base md:text-xl text-slateGray mt-2'>
                28 acres of clifftop land in Visakhapatnam, where the Bay of Bengal meets the
                Healing Hills.
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
        <div className='mt-12 md:mt-20 max-w-[1360px] block m-auto px-4 md:px-0'>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%]'>
            Healing that goes beyond wellness{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:mb-6 md:w-[60%] w-full mx-auto'>
            If full-body renewal isn’t what brought you here and you’re navigating a specific health
            concern our medical team will guide you from root cause to recovery.
          </div>

          <Link
            href={ROUTES.medicalHealthProgram}
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
