'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, Mail, MapPin, MoveRight, Phone } from 'lucide-react'
import Image from 'next/image'
import TestimonialCard from './Testimonials'
import ArticlesShowcase from './Article'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { goToPemaMaps, ROUTES, zohoForms } from '@/utils/utils'
import ImageWithShimmer from '@/components/ImageWithShimmer'
const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'About us' }, // current page (no href)
]
export default function AboutUs() {
  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center mb-2 mt-9'>
        About us
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center leading-none'>
        Welcome to The Universe of You{' '}
      </div>
      <div className='px-4'>
        <div className='relative mt-6 w-full h-[630px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/about/about-header-image-web.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className='object-cover'
          />
        </div>
      </div>
      <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
        <Check /> World-class experts in gut, skin & longevity health
      </div>
      <div className='px-4 lg:grid grid-cols-[65%_35%] grid-rows-1'>
        <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra md:hidden block mt-12'>
          A healing destination for every path: Medical or Wellness{' '}
        </div>
        <div className='relative mt-6 w-full h-[350px] md:h-[700px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/about/about-header-image-web-2.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='flex flex-col justify-around md:mx-8'>
          <div className='md:mt-9'>
            <div className='hidden md:block text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
              A healing destination for every path: Medical or Wellness{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-3'>
              Between The Bay of Bengal and The Eastern Ghats, Pema Wellness is where science,
              spirit, and nature meet. Whether you’re here for a medically guided recovery or a
              soul-deep wellness retreat, your experience is personal, powerful, and rooted in
              India’s most respected naturopathic legacy.{' '}
            </div>
            <PrimaryButton onClick={goToPemaMaps} className='w-full mt-9'>
              Find us on maps
            </PrimaryButton>
          </div>
        </div>
      </div>
      {/* contactus us and whatsapp button */}
      <Link href={ROUTES.contactUs}>
        <PrimaryButton className='hidden lg:flex rotate-270 fixed right-[-52px] z-11 top-1/2'>
          Get in touch
        </PrimaryButton>
      </Link>
      <WhatsappStickyButton />
      {/* our story */}
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          Our story{' '}
        </div>
        <div
          className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6
        md:w-[60%] m-auto w-full'
        >
          Founded by Mrs. Meena Mulpuri, Pema Wellness was created to make natural healing deeply
          human. Guided today by a next-gen leadership team, Pema blends clinical integrity with
          emotional clarity building a wellness experience that adapts to your needs.
        </div>

        <div className='relative mt-6 w-full h-[430px] md:h-[552px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/about/about-our-story.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
      </div>
      {/* our mission */}
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          Our mission{' '}
        </div>
        <div
          className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6
        md:w-[60%] m-auto w-full'
        >
          To offer personalised healing journeys that span both the medical and wellness pathways
          whether you come for chronic care, rejuvenation, or simply to pause and listen to yourself
          again.{' '}
        </div>

        <div className='relative mt-6 w-full h-[552px] overflow-hidden hidden md:block'>
          <ImageWithShimmer
            src={'/images/home/naturopathy-hero-image-web.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='relative mt-6 w-full h-[430px] overflow-hidden block md:hidden '>
          <ImageWithShimmer
            src={'/images/home/naturopathy-hero-image-mobile.webp'}
            alt={'naturopathy-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
      </div>{' '}
      {/* founders note web + mobile */}
      <div className='mt-12 md:mt-20 m-auto px-4 md:px-0'>
        <div className='text-[28px] block md:hidden text-pemaBlue font-ivyOra'>
          {' '}
          A note from our founder{' '}
        </div>

        <div className='flex flex-col-reverse md:grid grid-cols-[40%_60%] grid-rows-1'>
          <div className='mt-1 md:mx-8'>
            <div className='text-[40px] text-pemaBlue hidden md:block font-ivyOra mt-10 mb-2'>
              A note from our founder{' '}
            </div>

            <div className='text-base md:text-xl text-slateGray'>
              ‘I created Pema not as a resort, but as a quiet act of love. For anyone seeking rest,
              recovery, or reconnection with themselves or their loved ones. My family and I welcome
              you to find your own rhythm here, in your own way.’
            </div>
            <div className='text-lg md:text-xl text-slateGray md:mt-9 mt-4'>
              Mrs. Meena Mulpuri,
              <br />
              Founder, Pema Wellness
            </div>
          </div>
          <div className='my-2 md:my-0 relative w-full max-h-full h-[350px] lg:h-[750px] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/about/founders-note-about.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
            <div className='bg-[#32333380] font-ivyOra text-xl md:text-2xl text-center text-softSand flex justify-center items-center absolute bottom-0 w-full h-[56px] md:h-[79px] backdrop-blur-[15px]'>
              Founder Mrs. Meena Mulpuri{' '}
            </div>
          </div>
        </div>
      </div>
      {/* two journey */}
      <div className=' mt-12 mb-6 md:mt-20 text-[28px] text-left md:text-center leading-[120%] md:leading-normal  md:text-[40px] text-pemaBlue font-ivyOra px-4'>
        Two pathways.
        <br className='md:hidden inline' /> One philosophy.{' '}
      </div>
      <div className='flex flex-col-reverse px-4 lg:grid grid-cols-[65%_35%] grid-rows-1'>
        <div className='relative w-full h-[350px] md:h-[700px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/about/two-path-1.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='flex flex-col md:mx-8 mb-3'>
          <div className='md:mt-9'>
            <div className='text-[20px] md:text-[24px] text-slateGray font-ivyOra'>
              The medical pathway{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-3 '>
              For those managing conditions like diabetes, hormonal imbalance, gut health, sleep
              disorders, or post-COVID recovery. Every protocol is led by experienced doctors,
              naturopaths, physiotherapists, and nutrition experts.
            </div>
            <Link
              href={ROUTES.medicalHealthProgram}
              className='font-crimson text-base mt-3 md:mt-9 w-fit text-pemaBlue md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              Learn more about medical
              <MoveRight />
            </Link>{' '}
          </div>
        </div>
      </div>
      <div className='flex flex-col-reverse px-4 lg:grid grid-cols-[65%_35%] grid-rows-1 mt-9 md:mt-6'>
        <div className='relative w-full h-[350px] md:h-[700px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/about/two-path-2.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='flex flex-col md:mx-8 mb-3'>
          <div className='md:mt-9'>
            <div className='text-[28px] md:text-[24px] text-slateGray font-ivyOra'>
              The wellness pathway{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-3'>
              Designed for emotional reset, mindful living, and soul-deep rejuvenation through yoga,
              clean eating, nature, and cultural immersion.
            </div>
            <Link
              href={'/wellness-program'}
              className='font-crimson mt-3 md:mt-9 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              Learn more about wellness <MoveRight />
            </Link>{' '}
          </div>
        </div>
      </div>
      {/*
       Wellness for 
      the whole family 
      */}
      <div className='mt-12 md:mt-20 flex flex-col-reverse px-4 lg:grid grid-cols-[40%_60%] grid-rows-1'>
        <div className='flex flex-col md:mx-8 mb-3'>
          <div className='md:mt-9'>
            <div className='text-[28px] hidden md:block md:text-[40px] text-pemaBlue font-ivyOra'>
              Wellness for the whole family{' '}
            </div>
            <div className='text-lg hidden md:block md:text-2xl font-ivyOra text-slateGray mt-3 md:mt-6'>
              Pema is uniquely designed for multi-generational wellness.
            </div>
            <div className='text-base md:text-xl text-slateGray mt-3 md:mt-6'>
              Each person in your family from children to grandparents is offered a personalised
              pathway, supported by experts in age-appropriate therapies, cuisine, fitness, and
              emotional care.
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Children learn food awareness, yoga, and storytelling
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Couples experience reconnection through shared therapies{' '}
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Parents & elders receive specialised clinical support{' '}
            </div>
            <div className='text-base md:text-xl text-slateGray mt-3 md:mt-6'>
              “You come together. You heal individually. That’s the Pema way.”
            </div>
            <Link
              href={zohoForms.familyInquiry}
              className='font-crimson mt-3 md:mt-9 w-fit text-pemaBlue text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              Inquire about visiting with the family
              <MoveRight />
            </Link>{' '}
          </div>
        </div>

        <div className='relative w-full h-[350px] md:h-[700px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/about/about-family-iamge.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute top-0 left-0 `}
          />
        </div>
        <div className='text-base  text-slateGray mb-3 md:hidden block'>
          Pema is uniquely designed for multi-generational wellness.
        </div>
        <div className='text-[28px]  text-pemaBlue font-ivyOra md:hidden block'>
          Wellness for the whole family{' '}
        </div>
      </div>
      {/* 
      
      */}
      <div className=' mt-12 mb-6 md:mt-20 text-[28px] text-left md:text-center  md:text-[40px] text-pemaBlue font-ivyOra px-4'>
        Leadership team
      </div>
      <div className='mt-6 px-4 flex flex-col md:flex-row gap-5'>
        <div className=' w-full'>
          <div className='md:font-ivyOra md:text-2xl text-pemaBlue md:text-slateGray mb-3'>
            Dr. S.N. Murthy <br />
            <span className='text-slateGray'>Founder emeritus, Father of Naturopathy in India</span>
          </div>
          <div className='relative w-full h-[350px] md:h-[700px] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/about/founder-2-image.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
        </div>
        <div className=' w-full'>
          <div className='md:font-ivyOra md:text-2xl text-pemaBlue md:text-slateGray mb-3'>
            Mrs. Meena Mulpuri
            <br />
            <span className='text-slateGray'> Founder, Pema Wellness </span>
          </div>
          <div className='relative w-full h-[350px] md:h-[700px] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/about/founders-note-about.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
        </div>
      </div>
      {/* Our circle of care */}
      <div className=' mt-12 mb-6 md:mt-20'>
        <div className='flex flex-col-reverse px-4 lg:grid grid-cols-[65%_35%] grid-rows-1 mt-6'>
          <div className='relative hidden md:block w-full h-[350px] md:h-[550px] overflow-hidden'>
            <ImageWithShimmer
              src={'/images/about/circle-care-image.webp'}
              alt={'wellbeing-banner-home'}
              fill
              className={`object-cover absolute top-0 left-0 `}
            />
          </div>
          <div className='flex flex-col md:mx-8 mb-3'>
            <div className='md:mt-9'>
              <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra'>
                Our circle of care{' '}
              </div>
              <div className='text-base md:text-xl text-slateGray mt-3'>
                Each guest is surrounded by a multi-disciplinary team working in harmony across
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Clinical naturopathy & physiotherapy
              </div>
              <div className='my-2 md:my-0 relative w-full max-h-full h-[350px] md:hidden overflow-hidden'>
                <ImageWithShimmer
                  src={'/images/about/circle-care-mobile-1.webp'}
                  alt={'wellbeing-banner-home'}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 md:mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                Acupuncture & Detox specialisations
              </div>
              <div className='my-2 md:my-0 relative w-full max-h-full h-[350px] md:hidden overflow-hidden'>
                <ImageWithShimmer
                  src={'/images/about/circle-care-mobile-2.webp'}
                  alt={'wellbeing-banner-home'}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
              <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-6 md:mt-3'>
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
                Yoga therapy, culinary nutrition, and emotional wellness
              </div>
              <div className='my-2 md:my-0 relative w-full max-h-full h-[350px] md:hidden overflow-hidden'>
                <ImageWithShimmer
                  src={'/images/about/circle-care-mobile-3.webp'}
                  alt={'wellbeing-banner-home'}
                  fill
                  className={`object-cover absolute top-0 left-0 `}
                />
              </div>
              <div className='text-base md:text-xl text-slateGray mt-3'>
                At Pema, no two journeys are the same. But every one is deeply cared for.{' '}
              </div>
              <Link
                href={`${ROUTES.ourApproach}#experts`}
                className='font-crimson mt-3 md:mt-9 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
              >
                Meet the wellness and medical team <MoveRight />
              </Link>{' '}
            </div>
          </div>
        </div>
      </div>
      {/* awards */}
      <div className='mt-12 md:mt-20 m-auto px-4'>
        <div className=' text-[32px] md:text-[40px] text-pemaBlue font-ivyOra pb-2 text-left md:text-center leading-none m-auto'>
          Awards & Recognition{' '}
        </div>
        <div
          className=' text-lg md:text-xl text-slateGray font-crimson text-left md:text-center mb-6
        md:w-[60%] m-auto w-full'
        >
          Each guest is surrounded by a multidisciplinary team working in harmony across.
        </div>

        <div className='flex flex-col md:flex-row items-center justify-center gap-3 md:gap-9 max-w-[1000px] m-auto'>
          {[
            {
              img: '/images/about/global-spa-award-icon.svg',
              title: 'Best Wellness Cuisine & Naturopathy Retreat - 2025',
            },
            {
              img: '/images/about/south-traval-award-icon.svg',
              title: 'Leading Holistic Wellness Brand - 2019',
            },
            {
              img: '/images/about/global-spa-award-icon.svg',
              title: 'Best Holistic Retreat - 2018',
            },
          ].map((item) => {
            return (
              <div
                key={item.title}
                className='w-full md:w-1/3 flex flex-row md:flex-col justify-center gap-4 md:gap-0 items-center'
              >
                <Image
                  alt={item.title}
                  src={item.img}
                  width={169}
                  height={169}
                  className='h-[130px] w-[130px] md:h-[169px] md:w-[169px]'
                />
                <div className='w-[60%] text-left md:text-center'>{item.title}</div>
              </div>
            )
          })}
        </div>

        <div className='mt-12 md:mt-20'>
          <TestimonialCard />
        </div>
      </div>{' '}
      {/* iin press */}
      <div className=' mt-12 mb-6 md:mt-20 text-[28px] text-left md:text-center  md:text-[40px] text-pemaBlue font-ivyOra px-4'>
        Press{' '}
      </div>
      <div>
        <ArticlesShowcase />
      </div>
      {/* slides */}
      <div className='mt-12 md:mt-20'>
        <div className='px-4 text-base md:text-xl text-left md:text-center leading-[110%] text-slateGray mt-3'>
          Celebrity guests include wellness seekers from Dubai, Singapore, Europe, and beyond.
        </div>
        <div className='mt-3 md:mt-6 px-4 flex flex-col md:flex-row gap-6 md:gap-5'>
          <div className=' w-full'>
            <div className='text-base md:text-xl  md:text-slateGray mb-2 md:mb-3 leading-[110%]'>
              Chiranjeevi Konidela{' '}
            </div>
            <div className='relative w-full h-[350px] md:h-[515px] overflow-hidden'>
              <ImageWithShimmer
                src={'/images/about/celebrity-cheeranjivi.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0 `}
              />
            </div>
          </div>

          <div className=' w-full'>
            <div className='text-base md:text-xl  md:text-slateGray mb-2 md:mb-3 leading-[110%]'>
              Sanne Vloet
            </div>
            <div className='relative w-full md:block hidden md:h-[515px] overflow-hidden'>
              <ImageWithShimmer
                src={'/sanne-vloet.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0 `}
              />
            </div>
            <div className='relative w-full h-[360px] md:hidden overflow-hidden'>
              <ImageWithShimmer
                src={'/sanne-vloet.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover object-top absolute top-0 left-0 `}
              />
            </div>
          </div>

          <div className=' w-full'>
            <div className='text-base md:text-xl  md:text-slateGray mb-2 md:mb-3 leading-[110%]'>
              Naomie Harris
            </div>
            <div className='relative w-full h-[350px] md:h-[515px] overflow-hidden'>
              <ImageWithShimmer
                src={'/images/about/celebrity-naomie.webp'}
                alt={'wellbeing-banner-home'}
                fill
                className={`object-cover absolute top-0 left-0 `}
              />
            </div>
          </div>
        </div>
      </div>
      {/* career at pema */}
      <div id='career' className='mt-12 md:mt-20 m-auto px-4 scroll-m-20'>
        <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          Careers at Pema{' '}
        </div>
        <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3   md:w-[60%] m-auto w-full'>
          Join a wellness movement grounded in science and guided by soul.{' '}
        </div>
        <div className=' text-base md:text-xl text-slateGray font-crimson text-left md:text-center mb-3 md:w-[60%] m-auto w-full'>
          Roles across wellness therapy, hospitality, clinical care, and guest experience.{' '}
        </div>
        <div className='grid grid-cols-2 max-w-sm m-auto grid-rows-1'>
          <div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
              Wellness therapy
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
              Hospitality
            </div>
          </div>
          <div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
              Clinical care
            </div>
            <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-3'>
              <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
              Guest experience
            </div>
          </div>
        </div>
        <Link
          href={'mailto:hr@pemawellness.com'}
          className='font-crimson text-left md:text-center md:m-auto mt-4 md:mt-9 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
        >
          Apply here <MoveRight />
        </Link>{' '}
      </div>
      {/* contact infp */}
      <div className='mt-12 m-auto px-4 block md:hidden'>
        <div className=' text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
          Contact us{' '}
        </div>
        <div className='border-b border-slateGray w-fit text-base gap-2 flex flex-row items-center text-slateGray font-crimson text-left  mb-3 '>
          <MapPin className='h-5 w-5' />
          Healing Hills, Visakhapatnam, India
        </div>
        <div className=' text-base gap-2 flex flex-row items-center text-slateGray font-crimson text-left md:text-center mb-3  w-full'>
          <Mail className='h-5 w-5' />
          enquiry@pemawellness.com
        </div>
        <div className=' text-base gap-2 flex flex-row items-center text-slateGray font-crimson text-left md:text-center mb-3  w-full'>
          <Phone className='h-5 w-5' />
          +91 95777 09494
        </div>
      </div>
    </div>
  )
}
