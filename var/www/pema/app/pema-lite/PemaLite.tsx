'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, Mail, MapPin, MoveRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { goToPemaMaps, openWhatsApp, ROUTES } from '@/utils/utils'
import Marquee from 'react-fast-marquee'
import TestimonialCard from './Testimonials'
import PemaTabsWeb from './Slides'
import { useRouter } from 'next/navigation'
import ImageWithShimmer from '@/components/ImageWithShimmer'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Pema lite' }]

export default function PemaLite() {
  const router = useRouter()
  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center mb-2 mt-9'>
        Pema lite
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center '>
        The gold standard in light, luxurious healing.{' '}
      </div>
      <div className='px-4'>
        <div className='relative mt-6 w-full max-h-[470px] aspect-358/470 md:aspect-630/1360 md:max-h-[630px] overflow-hidden'>
          <Image
            src={'/images/pema-lite/pema-lite-hero-image-mobile.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover block md:hidden absolute top-0 left-0 `}
          />
          <Image
            src={'/images/pema-lite/pema-lite-hero-image-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover hidden md:block absolute top-0 left-0 `}
          />
        </div>
      </div>
      {/* contactus us and whatsapp button */}
      <Link href={ROUTES.contactUs}>
        <PrimaryButton className='hidden lg:flex rotate-270 fixed right-[-52px] z-11 top-1/2'>
          Get in touch
        </PrimaryButton>
      </Link>
      <WhatsappStickyButton />
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
          Come as you are. <br className='md:hidden inline-block' /> Stay as long as you need.{' '}
        </div>
        <div
          className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6
        md:w-[60%] m-auto w-full'
        >
          {`Whether you're here to simply relax in nature or dip into gentle wellness, Pema meets you exactly where you are.`}
        </div>

        <div className='relative mt-6 w-full h-[430px] md:h-[552px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/pema-lite/pema-lite-hero-image-2-web.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute hidden md:block top-0 left-0 `}
          />
          <ImageWithShimmer
            src={'/images/pema-lite/pema-lite-hero-image-2-mobile.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute block md:hidden top-0 left-0 `}
          />
        </div>
      </div>
      {/*
       Wellness for 
      the whole family 
      */}
      <div className='mt-12 md:mt-20 flex flex-col-reverse px-4 lg:grid grid-cols-[60%_40%] grid-rows-1'>
        <div className='relative hidden md:block w-full h-[350px] md:h-[700px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/pema-lite/stay-your-way-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='flex flex-col md:mx-8 mb-0 md:mb-3'>
          <div className='md:mt-9'>
            <div className='text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra'>
              Stay your way{' '}
            </div>

            <div className='text-base md:text-xl text-slateGray mt-4 md:mt-3 '>
              Two ways to experience the sanctuary both designed with intention, neither bound by
              structure.{' '}
            </div>

            <div className='flex flex-row gap-2 text-lg  md:text-2xl font-ivyOra text-slateGray items-center md:mt-3 mt-4'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Open stays{' '}
            </div>

            <div className='text-base md:text-xl text-slateGray mt-2 md:mt-3 ml-9'>
              Arrive with ease. Our team will create a tailored schedule for you, balancing
              consultations, therapies, spa time, nature walks, and nourishing cuisine.
            </div>
            <div className='flex flex-row gap-2 text-lg  md:text-2xl font-ivyOra text-slateGray items-center md:mt-3 mt-4'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} /> 3
              day reset{' '}
            </div>

            <div className='text-base md:text-xl text-slateGray mt-2 md:mt-3  ml-9'>
              A gentle, guided introduction to wellness. Includes daily therapies, healing cuisine,
              and restorative movement, with experiential diagnostics.
            </div>
          </div>
        </div>
      </div>
      <div className='mt-12 md:mt-20 flex flex-col-reverse px-4 lg:grid grid-cols-[60%_40%] grid-rows-1'>
        <div className='relative w-full h-[350px] md:h-[700px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/pema-lite/choose-your-rythm-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='flex flex-col md:mx-8 mb-3'>
          <div className='md:mt-9'>
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
              Choose your own rhythm{' '}
            </div>

            <div className='text-base md:text-xl text-slateGray mt-2 md:mt-6'>
              {`Whether you’re here for a night or more, move at your own pace. There's space to feel better. And yes everything’s included:`}
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} /> A
              sea-facing room designed for rest
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Daily therapies at the spa
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Yoga by the water{' '}
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Healing meals, prepared with care
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              You don’t have to decide now. Just arrive.{' '}
            </div>
          </div>
        </div>
      </div>
      {/*
       */}
      <div className='md:mt-20 mt-12 text-lg  md:text-2xl font-ivyOra text-pemaBlue md:text-center text-left px-4'>
        These experiences can be curated if requested at least 10 days before your stay.{' '}
      </div>
      <div className='mt-12 md:mt-20 mx-4'>
        <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center m-auto'>
          Wake slowly or wander far{' '}
        </div>
        <div
          className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center mt-0 md:mt-4 mb-6
        md:w-[70%] m-auto w-full'
        >
          Step into sacred temples, coastal cafés, quiet caves, or hillside ruins. Everything’s
          nearby and nothing’s required. Whether you’re drawn to stillness, story, or sea, we’ll
          help shape a day that moves at your pace.
        </div>
        <PemaTabsWeb />
      </div>
      {/*












       */}
      <div className='mt-6 md:mt-20 m-auto px-4'>
        <div className='text-xl md:text-[24px]  text-slateGray font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          Want to explore while you’re here?{' '}
        </div>
        <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 mt-3  md:w-[60%] m-auto w-full'>
          To integrate these visits into your Pema experience, reach our to us here we’ll handle the
          details.{' '}
        </div>
        <Link
          href={'/contact-us'}
          className='font-crimson text-left md:text-center md:m-auto mt-3 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
        >
          Connect with our team <MoveRight />
        </Link>{' '}
      </div>
      <div className='mt-12 md:mt-20'>
        <TestimonialCard />
      </div>
      {/* career at pema */}
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          What you’ll find here{' '}
        </div>
        <div className='md:grid flex flex-col grid-cols-2 justify-items-center m-auto grid-rows-1'>
          <div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-pemaBlue mt-3'>
              <Check /> Warm, professional service
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-pemaBlue mt-3'>
              <Check /> Therapeutic rituals if you choose to try
            </div>
          </div>
          <div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-pemaBlue mt-3'>
              <Check /> A calming, natural environment
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-pemaBlue mt-3'>
              <Check /> Space for quiet reflection, or gentle exploration as you prefer
            </div>
          </div>
        </div>
        <div className='mt-6 text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:w-[55%] m-auto w-full'>
          Still unsure if you want structure? That’s the beauty of Pema lite. You decide. And if
          your body begins to ask for more… we’re here to guide you gently toward it.{' '}
        </div>
      </div>
      <div className='mt-10 md:mt-20 max-w-[1360px] m-auto px-4 mb-6'>
        <div className='text-[32px] leading-none md:text-[40px] text-pemaBlue font-ivyOra text-left md:text-center mb-6 md:mb-2'>
          Ready to come home to yourself?{' '}
        </div>{' '}
        <div className='relative md:hidden block w-full h-[300px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/pema-lite/pema-bottom-image.webp'}
            alt={'slide.text'}
            fill
            className={`object-cover absolute top-0 left-0 transition-opacity duration-700`}
          />
        </div>
        <div
          onClick={openWhatsApp}
          className='md:text-softSand text-pemaBlue border md:border-transparent border-pemaBlue mt-6 
          cursor-pointer h-[54px] w-full md:w-fit md:h-[62px] text-lg md:text-xl md:bg-pemaBlue flex 
          flex-row items-center gap-2 justify-center m-auto px-6'
        >
          {' '}
          <Image alt='Whatsapp Icon' src='/whatsapp-icon.svg' width={20} height={20} />
          Message us on WhatsApp
        </div>
      </div>
      <div className='mb-10 hidden md:block'>
        <div className='relative w-full h-[540px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/home/healing-sanctury-home-slider-6.webp'}
            alt={'slide.text'}
            fill
            className={`object-cover absolute top-0 left-0 transition-opacity duration-700`}
          />
        </div>
        <div className='font-crimson text-left md:text-center md:mx-auto mt-6 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'>
          Book your stay <MoveRight />
        </div>{' '}
      </div>
    </div>
  )
}
