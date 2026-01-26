'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, Mail, MapPin, MoveRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { ROUTES } from '@/utils/utils'
import Marquee from 'react-fast-marquee'
import TestimonialCard from './Testimonials'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Success stories' }]
import ReactPlayer from 'react-player'
import TextTestimonialCard from '@/components/TextTestimonials'
import { textTestData } from './Testimonials2'
import TestimonialCardList from './Testimonials3'
import ImageWithShimmer from '@/components/ImageWithShimmer'

export default function SuccessStories() {
  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center mb-2 mt-4 md:mt-9'>
        Success stories
      </div>

      <div className='relative' id='overview'>
        {/* contactus us and whatsapp button */}
        <div className='px-4'>
          <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
            <Marquee className='mr-4'>
              {' '}
              <Check className='ml-4' /> World-class experts in gut, skin & longevity health
            </Marquee>
          </div>
        </div>

        <div className=' m-auto px-4'>
          <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra pt-2 text-left md:text-center leading-[130%] m-auto'>
            India’s most loved faces choose Pema{' '}
          </div>
          <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mt-2 md:w-[60%] m-auto w-full'>
            From creative icons to industry legends, these individuals turned to Pema for deep
            healing, clarity, and reset.{' '}
          </div>
          <TestimonialCard />
        </div>

        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra pt-2 text-left md:text-center leading-[130%] m-auto'>
            Healing beyond borders{' '}
          </div>
          <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mt-2 md:w-[60%] m-auto w-full'>
            Guests from over 30 countries trust Pema for chronic recovery, clarity, and emotional
            rebalancing.
          </div>

          <div className='mt-6 md:grid  flex flex-col-reverse grid-cols-[50%_50%] grid-rows-1'>
            <div className='h-[350px] md:h-[740px] flex justify-center items-center mb-6'>
              <ReactPlayer
                width='100%'
                autoPlay={false}
                height='100%'
                controls
                src={'https://youtube.com/shorts/WykV5bjOjko'}
                className='w-[100vw] aspect-video'
              />
            </div>
            <div className='flex flex-col justify-center md:px-4 mb-3'>
              <div className='md:mt-9'>
                <div className='text-[20px] md:mb-0  mb-5 md:text-[32px] text-slateGray font-ivyOra '>
                  I choose India’s #1 clinical wellness sanctuary for their annual reset. Daily yoga
                  & meditation overlooking the sea
                </div>
                <div className='text-base md:text-xl text-slateGray mt-3'>
                  Sanne Vloet, Victoria’s Secret model{' '}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra pt-2 text-left md:text-center leading-[130%] m-auto'>
            Wellness transformation{' '}
          </div>
          <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mt-2 md:w-[60%] m-auto w-full'>
            Powerful reversals of health conditions once considered lifelong.{' '}
          </div>

          <div className='relative mt-6 w-full h-[350] md:h-[517] overflow-hidden'>
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

          <div>
            <div className=' text-xl md:text-2xl text-slateGray font-ivyOra mt-[18px] md:mt-9 mb-4 text-left md:text-center leading-[130%] m-auto md:w-1/2'>
              ‘Pema is the perfect blend of East and West, where holistic healing, balance, and
              warmth make you feel truly at home.’
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 border-b md:border-transparent border-[#3233331A]'>
              Payal Jain <br />
              Pema signature detox
            </div>
            <div className=' text-xl md:text-2xl text-slateGray font-ivyOra md:mt-6 mt-9 mb-4 text-left md:text-center leading-[130%] m-auto md:w-1/2'>
              ‘Pema was the best gift I gave myself a world-class detox with amazing doctors,
              delicious food, and an experience so good I had to bring my whole family.’
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 border-b md:border-transparent border-[#3233331A]'>
              Rakul Preet Singh <br />
              Detox & cleansing
            </div>
            <div className=' text-xl md:text-2xl text-slateGray font-ivyOra md:mt-6 mt-9 mb-4 text-left md:text-center leading-[130%] m-auto md:w-1/2'>
              ‘At Pema, the body feels lighter, the mind calmer, and the soul truly nourished all in
              a setting of world-class luxury and care.’
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 border-b md:border-transparent border-[#3233331A]'>
              Chiranjeevi Konidela <br />
              Pain & injury recovery
            </div>

            <div className=' text-xl md:text-2xl text-slateGray font-ivyOra md:mt-6 mt-9 mb-4 text-left md:text-center leading-[130%] m-auto md:w-1/2'>
              ‘From drinking and steroids to clarity and control. Pema helped me return to life.’
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-6'>
              Mumbai CEO <br />
              Mind-body wellness
            </div>
            <Link
              href={ROUTES.wellnessProgram}
              className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start md:m-auto gap-2 border-b border-pemaBlue w-fit'
            >
              Discover more about our wellness journey <MoveRight />
            </Link>
          </div>
        </div>
        <div className='mt-12 md:mt-20 m-auto px-4 md:grid  flex flex-col-reverse grid-cols-[50%_50%] grid-rows-1'>
          <div className='h-[350px] md:h-[740px] flex justify-center items-center mb-6'>
            <ReactPlayer
              controls
              width='100%'
              autoPlay={false}
              height='100%'
              src={'https://youtu.be/Xn2Lbl_Rf-A'}
              className='w-[100vw] aspect-video'
              // playing={false && index === activeIndex}
            />
          </div>
          <div className='flex flex-col justify-center md:px-4 mb-3'>
            <div className='md:mt-9'>
              <div className='text-[20px] md:mb-0  mb-5 md:text-[32px] text-slateGray font-ivyOra '>
                ‘I walked in bloated, fatigued, and mentally foggy. I walked out 6 kilos lighter,
                with radiant skin and the deepest sleep I’ve had in years.’ 
              </div>
              <div className='text-base md:text-xl text-slateGray mt-3'>
                Naomie Harris , Hollywood Actor{' '}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra pt-2 text-left md:text-center leading-[130%] m-auto'>
            Medical reversals by condition{' '}
          </div>
          <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mt-2 md:w-[60%] m-auto w-full'>
            Powerful reversals of health conditions once considered lifelong.{' '}
          </div>

          <div className='relative mt-6 w-full h-[350] md:h-[517] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/success-stories/medical-reversal-mobile.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover block md:hidden absolute top-0 left-0 `}
            />
            <ImageWithShimmer
              src={'/images/success-stories/medical-reversal-web.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover hidden md:block absolute top-0 left-0 `}
            />
          </div>

          <div>
            <div className='md:mt-9 mt-6 mb-2 text-base md:text-xl text-pemaBlue font-crimson text-left md:text-center m-auto w-full '>
              Condition{' '}
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 '>
              Post-COVID cardio-metabolic
            </div>
            <div className='md:mt-0 mb-2 md:mb-3 text-base md:text-xl text-pemaBlue font-crimson text-left md:text-center m-auto w-full '>
              Result
            </div>
            <div className=' text-xl md:text-2xl text-slateGray font-ivyOra mb-2 md:mb-4 text-left md:text-center leading-[130%] m-auto md:w-1/2'>
              ‘Heart attack, asthma, 118 kg. Today, I’m 27 kg lighter and free from steroids.’
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 border-b md:border-transparent border-[#3233331A]'>
              Anurag Kashyap.
            </div>

            <div className='md:mt-9 mt-6 mb-2 text-base md:text-xl text-pemaBlue font-crimson text-left md:text-center m-auto w-full '>
              Condition{' '}
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 '>
              Hypertension & weight{' '}
            </div>
            <div className='md:mt-0 mb-2 md:mb-3 text-base md:text-xl text-pemaBlue font-crimson text-left md:text-center m-auto w-full '>
              Result
            </div>
            <div className=' text-xl md:text-2xl text-slateGray font-ivyOra mb-2 md:mb-4 text-left md:text-center leading-[130%] m-auto md:w-1/2'>
              ‘BP under control. Lost over 4 kg. I finally feel well again.’{' '}
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 border-b md:border-transparent border-[#3233331A]'>
              Vivekanand S.{' '}
            </div>

            <div className='md:mt-9 mt-6 mb-2 text-base md:text-xl text-pemaBlue font-crimson text-left md:text-center m-auto w-full '>
              Condition{' '}
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 '>
              Chronic pain & insomnia{' '}
            </div>
            <div className='md:mt-0 mb-2 md:mb-3 text-base md:text-xl text-pemaBlue font-crimson text-left md:text-center m-auto w-full '>
              Result
            </div>
            <div
              className=' text-xl md:text-2xl text-slateGray font-ivyOra mb-2
             md:mb-4 text-left md:text-center leading-[130%] m-auto '
            >
              ‘12 pills a day. Now, 3 weeks without a single one and better than ever.’{' '}
            </div>
            <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center m-auto w-full pb-4 border-b md:border-transparent border-[#3233331A]'>
              Mrecedes Jahanzedeh{' '}
            </div>

            <Link
              href={ROUTES.medicalHealthProgram}
              className='mt-6 md:mt-2 font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start md:m-auto gap-2 border-b border-pemaBlue w-fit'
            >
              Discover more about our medical programs <MoveRight />
            </Link>
          </div>
        </div>

        {/* 
      testimonials 2
       */}
        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto'>
          <TextTestimonialCard
            hideCTA
            data={textTestData}
            bgMobile='/images/success-stories/test-bg-mobile.webp'
            bgWeb='/images/success-stories/test-bg-web.webp'
          />
        </div>

        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto px-4'>
          <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra pt-2 text-left md:text-center leading-[130%] m-auto'>
            Before and after stories{' '}
          </div>
          <div className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mt-2 md:w-[60%] m-auto w-full'>
            Powerful reversals of health conditions once considered lifelong.{' '}
          </div>
          <TestimonialCardList />
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
