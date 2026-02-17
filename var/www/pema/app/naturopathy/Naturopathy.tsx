'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import ImageWithShimmer from '@/components/ImageWithShimmer'
import PrimaryButton from '@/components/PrimaryButton'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { ROUTES } from '@/utils/utils'
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import NaturopathicSection from './NaturopathicSection'
import TestimonialCard from './Testimonials'
import WhatIsNaturopathy from './WhatIsNaturopathy'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Naturopathy ' }]

export default function Naturopathy() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <h1 className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center'>
        Leading Naturopathy Centre in India for Complete Wellness{' '}
      </h1>

      <div className='px-4'>
        <div className='relative mt-4 md:mt-6 w-full h-[470px] md:h-[630px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/naturopathy/hero-mobile.webp'}
            alt={'best naturopathy centre in india'}
            fill
            className={`object-cover block md:hidden absolute top-0 left-0 `}
          />
          <ImageWithShimmer
            src={'/images/naturopathy/hero-web.webp'}
            alt={'best naturopathy centre in india'}
            fill
            className={`object-cover hidden md:block absolute top-0 left-0 `}
          />
        </div>
      </div>
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='w-full md:w-[90%] text-[24px] md:text-[32px] text-pemaBlue font-ivyOra py-2 text-left md:text-center m-auto'>
          Naturopathy centers on the principle of living in harmony with nature and harnessing the
          five forces of nature for healing and well-being. We emphasise treating the body, mind,
          and spirit using natural remedies and lifestyle modifications.
        </div>
      </div>

      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className='text-[28px] whitespace-pre-line md:whitespace-normal md:text-[40px] text-pemaBlue font-ivyOra  text-left md:text-center leading-[120%] m-auto'>
          The five forces of nature{' '}
        </div>
        <div className='flex relative flex-row md:flex-nowrap flex-wrap  justify-between items-center mx-auto max-w-[750px] mt-6 mb-3 md:mb-9'>
          <div className='w-1/2 md:w-1/5 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
            <Image
              src={'/pema-icon.svg'}
              className='w-[30px] h-7'
              alt='pema'
              width={30}
              height={28}
            />
            <div className='text-pemaBlue text-base md:text-xl text-center'>Water (Jal)</div>
          </div>{' '}
          <div className='w-1/2 md:w-1/5 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
            <Image
              src={'/pema-icon.svg'}
              className='w-[30px] h-7'
              alt='pema'
              width={30}
              height={28}
            />
            <div className='text-pemaBlue text-base md:text-xl text-center'>Air (Vayu)</div>
          </div>{' '}
          <div className='w-1/2 md:w-1/5 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
            <Image
              src={'/pema-icon.svg'}
              className='w-[30px] h-7'
              alt='pema'
              width={30}
              height={28}
            />
            <div className='text-pemaBlue text-base md:text-xl text-center'>Earth (Prithvi)</div>
          </div>{' '}
          <div className='w-1/2 md:w-1/5 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
            <Image
              src={'/pema-icon.svg'}
              className='w-[30px] h-7'
              alt='pema'
              width={30}
              height={28}
            />
            <div className='text-pemaBlue text-base md:text-xl text-center'>Fire (Agni)</div>
          </div>{' '}
          <div className='w-1/2 md:w-1/5 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
            <Image
              src={'/pema-icon.svg'}
              className='w-[30px] h-7'
              alt='pema'
              width={30}
              height={28}
            />
            <div className='text-pemaBlue text-base md:text-xl text-center'>Space (Akash)</div>
          </div>{' '}
          <div className='md:block hidden bg-pemaBlue h-[2px] absolute bottom-[32px] left-17 right-17'></div>
        </div>
        <div className='whitespace-pre-line md:whitespace-normal text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
          Your body can heal itself if you let it!{' '}
        </div>
        <div className='flex flex-col md:flex-row md:items-center md:justify-center gap-4 mt-6'>
          <Link
            href={ROUTES.contactUs}
            className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start  gap-2 border-b border-pemaBlue w-fit'
          >
            Inquire now <MoveRight />
          </Link>
          <div
            // href={ROUTES.medicalHealthProgram}
            className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start  gap-2 border-b border-pemaBlue w-fit'
          >
            Experience healing with naturopathy <MoveRight />
          </div>
        </div>
      </div>

      {/* Naturopathy section  */}
      <div className='mt-20 max-w-[1360px] m-auto px-4'>
        <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none'>
          What is Naturopathy?{' '}
        </div>
        <div className=' text-lg  text-slateGray font-crimson text-left md:text-center  md:w-[45%] w-full md:mx-auto'>
          Naturopathy is an applied science that utilises the forces of nature such as air, water,
          earth, fire, and space to both prevent and treat diseases.
        </div>
        <WhatIsNaturopathy />
        <div className='flex flex-col md:flex-row md:items-center md:justify-center gap-4 '>
          <div
            // href={ROUTES.medicalHealthProgram}
            className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start  gap-2 border-b border-pemaBlue w-fit'
          >
            Begin your healing <MoveRight />
          </div>
          <div
            // href={ROUTES.medicalHealthProgram}
            className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start  gap-2 border-b border-pemaBlue w-fit'
          >
            Learn about our approach <MoveRight />
          </div>
        </div>
        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mt-6 md:mt-14 mb-3 md:mb-6 md:w-[70%] w-full mx-auto'>
          At Pema, we follow a holistic approach, encouraging individuals to align their diet,
          lifestyle, and mental well-being with natural principles to promote self-healing and
          long-term wellness.
        </div>
      </div>

      <div className=' m-auto px-4'>
        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Core principles of naturopathy at Pema{' '}
          </div>

          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            Preferred healing approaches include diet, hydrotherapy, lifestyle counseling, yoga, and
            mindfulness - gentle methods that align with the body’s natural rhythm.
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[70%] m-auto w-full'>
            We have worked to heal all sorts of diseases, at their various stages, at Pema. Of
            course, we always hope that people would take out 8 days for preventive care instead of
            a lifetime of symptomatic treatment.
          </div>
          <div className=' md:grid lg:grid-cols-[66%_33%] md:grid-rows-1 md:gap-0 h-max mt-6'>
            <div className='h-max'>
              <div className='hidden md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* first image w-1/2*/}
                <ImageWithShimmer
                  src='/images/naturopathy/slide-1.webp'
                  alt={'best naturopathy centre in india'}
                  className='h-[545px]  object-cover mb-4'
                  width={750}
                  height={500}
                />

                {/* second image w-1/2*/}
                <ImageWithShimmer
                  src='/images/naturopathy/slide-2.webp'
                  alt={'best naturopathy centre in india'}
                  className='h-[545px]  object-cover mb-4'
                  width={750}
                  height={500}
                />
              </div>
              {/* third image horizontal*/}
              <ImageWithShimmer
                src='/images/naturopathy/slide-3.webp'
                alt={'best naturopathy centre in india'}
                className='md:h-[550px] h-[350] w-full hidden md:block '
                width={750}
                height={500}
              />
            </div>

            <div className='flex flex-col md:mx-5 mb-3'>
              <div className='md:mt-9 mt-6'>
                <div className='font-ivyOra items-center w-fit text-slateGray text-xl md:text-2xl flex flex-row gap-2 '>
                  Art of living in tune with nature{' '}
                </div>
                <div className='mt-2 '>
                  <div className='text-base md:text-xl text-slateGray mt-0'>
                    Focus on daily habits that respect the balance of natural elements. This
                    involves aligning your lifestyle choices with the rhythms of nature, from sleep
                    patterns to seasonal eating.
                  </div>
                  <Image
                    src='/images/naturopathy/slide-1.webp'
                    alt={'best naturopathy centre in india'}
                    className='md:h-[550px] h-[350] md:hidden block object-cover w-full my-3'
                    width={750}
                    height={500}
                  />
                  <div className='text-base md:text-xl text-slateGray md:mt-2'>
                    <div className='text-base md:text-xl text-slateGray mt-2 md:mt-6'>
                      Key practices
                    </div>
                    <div className='flex flex-row items-start gap-2 mt-3'>
                      <Image
                        src={'/images/kosha-pointer-icon.svg'}
                        alt={'/images/kosha-pointer-icon.svg'}
                        width={31}
                        height={24}
                      />
                      <div className='text-base md:text-xl text-slateGray mt-0'>
                        Wake up with the sunrise and sleep early{' '}
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
                        Eat seasonal, locally grown foods{' '}
                      </div>
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
                      Practice grounding by connecting with the earth{' '}
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
                      Maintain regular exercise in natural settings{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=' md:grid flex flex-col-reverse lg:grid-cols-[33%_66%] md:grid-rows-1 md:gap-0 h-max mt-6 md:mt-20'>
            <div className='flex flex-col md:mx-5 mb-3'>
              <div className='md:mt-9'>
                <div className='font-ivyOra items-center w-fit text-slateGray text-xl md:text-2xl flex flex-row gap-2 '>
                  Non-invasive therapies
                </div>
                <div className='mt-2 '>
                  <div className='text-base md:text-xl text-slateGray mt-0'>
                    {`Preference for diet, hydrotherapy, lifestyle counseling, yoga, and mindfulness
                    as therapies. These gentle approaches work with the body's natural healing
                    mechanisms.`}
                  </div>
                  <Image
                    src='/images/naturopathy/slide-4.webp'
                    alt={'best naturopathy centre in india'}
                    className='md:h-[550px] h-[350] md:hidden object-cover block w-full my-3'
                    width={750}
                    height={500}
                  />
                  <div className='text-base md:text-xl text-slateGray mt-2 md:mt-6'>
                    Key practices
                  </div>
                  <div className='flex flex-row items-start gap-2 mt-3'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div className='text-base md:text-xl text-slateGray mt-0'>
                      Therapeutic yoga and breathing exercises{' '}
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
                      Hydrotherapy using water at different temperatures{' '}
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
                      Nutritional therapy with whole foods{' '}
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
                      Mindfulness and meditation practices{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='h-max hidden md:block md:mb-0 mb-6'>
              <div className='hidden md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* first image w-1/2*/}
                <ImageWithShimmer
                  src='/images/naturopathy/slide-4.webp'
                  alt={'best naturopathy centre in india'}
                  className='h-[545px]  object-cover mb-4'
                  width={750}
                  height={500}
                />

                {/* second image w-1/2*/}
                <ImageWithShimmer
                  src='/images/naturopathy/slide-5.webp'
                  alt={'best naturopathy centre in india'}
                  className='h-[545px] object-cover mb-4'
                  width={750}
                  height={500}
                />
              </div>
              {/* third image horizontal*/}
              <ImageWithShimmer
                src='/images/naturopathy/slide-6.webp'
                alt={'best naturopathy centre in india'}
                className='md:h-[550px] h-[350] w-full hidden md:block '
                width={750}
                height={500}
              />
              <ImageWithShimmer
                src='/images/naturopathy/slide-4.webp'
                alt={'best naturopathy centre in india'}
                className='md:h-[550px] h-[350] md:hidden block object-cover w-full '
                width={750}
                height={500}
              />
            </div>
          </div>

          <div className=' md:grid lg:grid-cols-[66%_33%] md:grid-rows-1 md:gap-0 h-max mt-6 md:mt-20'>
            <div className='h-max md:block hidden'>
              <div className='hidden md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* first image w-1/2*/}
                <ImageWithShimmer
                  src='/images/naturopathy/slide-7.webp'
                  alt={'best naturopathy centre in india'}
                  className='h-[545px] object-cover mb-4'
                  width={750}
                  height={500}
                />

                {/* second image w-1/2*/}
                <ImageWithShimmer
                  src='/images/naturopathy/slide-8.webp'
                  alt={'best naturopathy centre in india'}
                  className='h-[545px] object-cover mb-4'
                  width={750}
                  height={500}
                />
              </div>
              {/* third image horizontal*/}
              <ImageWithShimmer
                src='/images/naturopathy/slide-9.webp'
                alt={'best naturopathy centre in india'}
                className='md:h-[550px] h-[350] w-full hidden md:block '
                width={750}
                height={500}
              />
              <ImageWithShimmer
                src='/images/naturopathy/slide-7.webp'
                alt={'best naturopathy centre in india'}
                className='md:h-[550px] h-[350] md:hidden block object-cover w-full '
                width={750}
                height={500}
              />
            </div>

            <div className='flex flex-col md:mx-5 mb-3'>
              <div className='md:mt-9 mt-6'>
                <div className='font-ivyOra items-center w-fit text-slateGray text-xl md:text-2xl flex flex-row gap-2 '>
                  Self-healing and prevention{' '}
                </div>
                <div className='mt-2 '>
                  <div className='text-base md:text-xl text-slateGray mt-0'>
                    {`Removing obstacles to health and fostering the body's inherent ability to heal,
                    rather than just addressing symptoms. Prevention is prioritized over treatment.`}
                  </div>
                  <ImageWithShimmer
                    src='/images/naturopathy/slide-7.webp'
                    alt={'best naturopathy centre in india'}
                    className='md:h-[550px] h-[350] md:hidden object-cover block w-full my-3'
                    width={750}
                    height={500}
                  />
                  <div className='text-base md:text-xl text-slateGray md:mt-2'>
                    <div className='text-base md:text-xl text-slateGray mt-2 md:mt-6'>
                      Key practices
                    </div>
                    <div className='flex flex-row items-start gap-2 mt-3'>
                      <Image
                        src={'/images/kosha-pointer-icon.svg'}
                        alt={'/images/kosha-pointer-icon.svg'}
                        width={31}
                        height={24}
                      />
                      <div className='text-base md:text-xl text-slateGray mt-0'>
                        Identify and remove toxins from environment{' '}
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
                        {` Support the body's natural detoxification`}
                      </div>
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
                      Build strong immunity through natural means{' '}
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
                      Focus on root causes, not just symptoms{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Testimonials{' '}
          </div>

          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-6'>
            Thank you for trusting us with your most precious asset : your health{' '}
          </div>
          <TestimonialCard />
        </div>
        <div className='mt-12 md:mt-20'>
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            Summary of our naturopathic approach{' '}
          </div>

          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-2'>
            A concise overview of the key principles in naturopathic healing at Pema.
          </div>
          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mt-4 mb-3'>
            Naturopathy principles overview{' '}
          </div>
          <NaturopathicSection />
        </div>
      </div>

      <div className='mt-12 md:mt-20 max-w-[1360px] block m-auto px-4 md:px-0'>
        <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%]'>
          Our philosophy at Pema{' '}
        </div>
        <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:mb-6 md:w-[65%] w-full mx-auto'>
          ‘Naturopathy is an evidence-based hyper-personalised approach to wellness, focused on
          helping the body heal itself by following natural laws and lifestyle discipline.’
        </div>

        <Link
          href={'#contact-us'}
          className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center justify-start md:m-auto gap-2 border-b border-pemaBlue w-fit'
        >
          Book now <MoveRight />
        </Link>
        <div className='relative mt-6 w-full h-[350] md:h-[517] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/naturopathy/footer-web.webp'}
            alt={'best naturopathy centre in india'}
            fill
            className={`object-cover absolute top-0 left-0 hidden md:block `}
          />
          <ImageWithShimmer
            src={'/images/naturopathy/footer-mobile.webp'}
            alt={'best naturopathy centre in india'}
            fill
            className={`object-cover absolute top-0 left-0 md:hidden block`}
          />
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
