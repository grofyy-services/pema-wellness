'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import Marquee from 'react-fast-marquee'
import PemaTabsWeb from './Slides'
import { useRef } from 'react'

const crumbs = [{ label: 'Home', href: '/' }, { label: 'The sanctuary ' }]
import CountryDropdown from '@/components/CountryDropDown'
import FAQs from './FAQs'
import TextTestimonialCard from '@/components/TextTestimonials'
import { textTestData } from './Testimonials2'
import ImageCarousel from './Carousel'
import { ROUTES, takeOurHealthQuiz } from '@/utils/utils'
import { useAtomValue } from 'jotai'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { useRouter } from 'next/navigation'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import ImageWithShimmer from '@/components/ImageWithShimmer'
import { roomDataPlanVisit } from '../booking/utils'

export default function TheSanctury() {
  const router = useRouter()
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const currency = useAtomValue(selectedCurrencyAtom)

  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center md:mb-2 mt-4 md:mt-9'>
        The sanctuary
      </div>
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra py-2 text-center'>
        Where healing begins with remembering{' '}
      </div>

      <div className='px-4'>
        <div className='relative mt-4 md:mt-6 w-full max-h-[470px] aspect-358/470 md:aspect-630/1360 md:max-h-[630px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/sanctury/hero-mobile.webp'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover block md:hidden absolute top-0 left-0 `}
          />
          <ImageWithShimmer
            src={'/images/sanctury/hero-web.webp'}
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

      <div className='mt-12 md:mt-20 m-auto md:px-4 px-0'>
        <div className='md:px-0 px-4 text-[32px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
          Wherever you are in life, Pema meets you there{' '}
        </div>
        <div className='md:px-0 px-4  text-lg md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[65%] m-auto w-full'>
          {`Not just as a place for healing but as a companion for the journey. Perched on The
            Healing Hills of Visakhapatnam, revered by locals for centuries, every element of our
            sanctuary has been designed to help you remember your body's natural rhythm, your inner
            intelligence, your deep connection to nature.`}{' '}
        </div>
        <ImageCarousel />
      </div>
      <div className='mt-12 md:mt-20 m-auto px-4'>
        {/* The Healing Hills Section */}
        <div className=''>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            The Healing Hills
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
            For thousands of years, these hills have been known for their healing magnetism. Today,
            Pema honors this ancient wisdom while creating spaces where your five koshas body,
            breath, emotion, thought, and presence can find their natural balance.
          </div>

          <div className='lg:grid grid-cols-[66%_33%] grid-rows-1 mt-6 gap-5'>
            <div className='relative w-full h-[245] md:h-[530px] overflow-hidden'>
              <ImageWithShimmer
                src={'/images/sanctury/dr-murthy.webp'}
                alt={'Dr. S.N. Murthy, Father of Naturopathy'}
                fill
                className='object-cover absolute top-0 left-0'
              />
            </div>
            <div className='flex flex-col md:justify-center '>
              <div className='md:mt-9 mt-6'>
                <div className='text-[20px] md:text-[24px] text-center md:text-left text-slateGray font-ivyOra leading-[140%] mb-4'>
                  {`"When we live in tune with nature,`} <br /> {`the body begins to heal itself."`}
                </div>
                <div className='text-base text-center md:text-left md:text-xl text-slateGray font-crimson'>
                  Dr. S.N. Murthy, <br /> Father of Naturopathy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 28 Hillside acres Section */}
        <div className='mt-12 md:mt-20 m-auto'>
          <div className='grid md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-5 h-max'>
            <div className='h-max'>
              <div className='md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* First image - aerial view */}
                <ImageWithShimmer
                  src='/images/sanctury/healinghills-1.webp'
                  alt='28 Hillside acres aerial view'
                  className='h-[350] md:h-[545px]  object-cover'
                  width={750}
                  height={500}
                />

                {/* Second image - resort buildings */}
                <ImageWithShimmer
                  src='/images/sanctury/healinghills-2.webp'
                  alt='Resort buildings with infinity pool'
                  className='h-[545px]  object-cover md:block hidden'
                  width={750}
                  height={500}
                />
              </div>
            </div>

            <div className='flex flex-col  mb-3'>
              <div className='md:mt-9 mt-6'>
                <div className='text-[20px] block md:text-[24px] text-slateGray font-ivyOra'>
                  28 Hillside acres
                </div>
                <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-2 md:mt-3'>
                  Wake up to The Bay of Bengal, wander through medicinal groves and organic gardens,
                  and return to your private beach as the sun sets all within your sanctuary.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your healing spaces Section */}
        <div className='mt-12 md:mt-20 m-auto px-4 bg-softSand p-4 md:p-10'>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            Your healing spaces
          </div>

          {/* Desktop Layout - 3 cards */}
          <div className='hidden md:grid md:grid-cols-3 md:gap-5 mt-8 md:mt-12'>
            {Object.values(roomDataPlanVisit).map((item) => {
              return (
                <div key={item.area} className=' rounded-lg overflow-visible'>
                  <div className='relative w-full h-[450px] overflow-hidden'>
                    <ImageWithShimmer
                      src={item.coverImageWeb}
                      alt={item.category}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='mt-3'>
                    <h3 className='text-[20px] md:text-[24px] text-slateGray font-ivyOra mb-3'>
                      {item.category}
                    </h3>
                    <p className='text-base md:text-xl text-slateGray font-crimson mb-4 '>
                      {item.description}
                    </p>
                    <div className='mb-4 flex flex-row items-center justify-between'>
                      <div className='text-slateGray  text-xl mb-2'>
                        Investment starts from <br />{' '}
                        {convertINRUsingGlobalRates(item.price, currency)}
                        /night
                      </div>
                      <CountryDropdown />
                    </div>
                    <Link
                      href={'#contact-us'}
                      className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                    >
                      Book now <MoveRight />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile Layout - Single column */}
          <div className='grid md:hidden gap-6 mt-8'>
            {Object.values(roomDataPlanVisit).map((item) => {
              return (
                <div key={item.area} className=' rounded-lg overflow-visible'>
                  <div className='relative w-full mb-3 h-[350px] overflow-hidden'>
                    <ImageWithShimmer
                      src={item.coverImageMobile}
                      alt={item.category}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className=''>
                    <h3 className='text-xl text-slateGray font-ivyOra mb-3'>{item.category}</h3>
                    <p className='text-base text-slateGray font-crimson mb-4 leading-[110%]'>
                      {item.description}
                    </p>
                    <div className='mb-4 flex flex-row items-center justify-between'>
                      <div className='text-slateGray  text-base mb-2'>
                        Investment starts from <br />{' '}
                        {convertINRUsingGlobalRates(item.price, currency)}
                        /night
                      </div>
                      <CountryDropdown />
                    </div>
                    <Link
                      href={'#contact-us'}
                      className='font-crimson text-base text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                    >
                      Book now <MoveRight />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* koshash section */}
        <div className='mt-12 md:mt-20 m-auto '>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            The healing hub{' '}
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
            100,000 square feet designed for the 5 Koshas of your being
          </div>
          <ImageWithShimmer
            src={'/images/sanctury/5-koshas.svg'}
            alt='koshas'
            className='h-[235] md-h-[492] mx-auto my-6'
            width={1000}
            height={1000}
          />{' '}
          <div className='flex flex-row mt-9 md:mt-10 gap-y-[2px] gap-x-6 md:gap-6 items-center justify-center flex-wrap'>
            <div className='flex flex-row items-center gap-1'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='font-crimson  text-slateGray text-base md:text-xl  '>Annamaya</div>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='font-crimson  text-slateGray text-base md:text-xl  '>Pranamaya</div>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='font-crimson  text-slateGray text-base md:text-xl  '>Manomaya</div>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='font-crimson  text-slateGray text-base md:text-xl  '>Vijnanamaya</div>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <Image
                src={'/images/kosha-pointer-icon.svg'}
                alt={'/images/kosha-pointer-icon.svg'}
                width={31}
                height={24}
              />
              <div className='font-crimson  text-slateGray text-base md:text-xl  '>Anandamaya</div>
            </div>
          </div>
          <div className='flex justify-center '>
            <PrimaryButton
              onClick={() => router.push(ROUTES.medicalHealthAssessment)}
              className='mt-6 w-full max-w-[360px] mx-auto'
            >
              Take a quiz
            </PrimaryButton>
          </div>
        </div>

        {/* Healing cuisine Section */}
        <div className='mt-12 md:mt-20 m-auto '>
          <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-[120%] m-auto'>
            Healing cuisine
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full'>
            Where medicine becomes nourishment
          </div>
          <div className='text-base md:text-xl text-slateGray font-crimson text-left md:text-center md:w-[60%] m-auto w-full mt-2'>
            In the healing kitchen Chef Rajiv Kumar Bali creates more than meals, he crafts healing
            experiences. Every dish is prepared in consultation with your naturopathic team, using
            ingredients grown in our mineral-rich soil.
          </div>

          {/* 2 Image Row - Desktop */}
          <div className=' md:grid md:grid-cols-[66%_33%] gap-4 w-full mt-8 md:mt-12'>
            <div className='flex flex-col-reverse md:block'>
              <div className='relative w-full md:h-[550] h-[350] overflow-hidden md:mb-3 mb-6'>
                <ImageWithShimmer
                  src='/images/sanctury/healing-kitchen-web.webp'
                  alt='Chef and team in healing kitchen'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='text-left'>
                <h3 className='text-[20px] md:text-[24px] text-slateGray font-ivyOra mb-2'>
                  The healing kitchen
                </h3>
                <p className='text-base md:text-xl text-slateGray font-crimson mb-3 leading-relaxed md:w-[60%]'>
                  Step into an open-air culinary space where the breeze meets tradition. From a
                  spice library of rare herbs to gut-nourishing fermentation, every dish is crafted
                  as medicine rooted in nature, guided by ancient wisdom.
                </p>
                {/* <Link
                  href={`${ROUTES.ourApproach}#cuisine`}
                  className='font-crimson text-base md:text-xl text-pemaBlue hidden md:flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                >
                  Learn more about our approach <MoveRight />
                </Link> */}
              </div>
            </div>
            <div className='flex flex-col-reverse md:block'>
              <div className='relative w-full md:h-[550px] h-[350px] overflow-hidden  md:mb-3 mb-6'>
                <ImageWithShimmer
                  src='/images/sanctury/nutrition-web.webp'
                  alt='Guest enjoying healing meal'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='text-left'>
                <h3 className='text-[20px] md:text-[24px] text-slateGray font-ivyOra mb-2'>
                  Your therapeutic nutrition
                </h3>
                <p className='text-base md:text-xl text-slateGray font-crimson mb-3 leading-relaxed'>
                  Healing begins on your plate. Your meals are personalised in consultation with
                  experts, prepared using pranic* techniques, and timed with your body natural
                  rhythms.
                </p>
                <Link
                  href={`${ROUTES.ourApproach}#cuisine`}
                  className='font-crimson text-base md:text-xl text-pemaBlue mb-3 flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                >
                  Learn more about our cuisine <MoveRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Your private beach Section */}
        <div className='mt-0 md:mt-20 m-auto'>
          <div className='md:grid grid-cols-[66%_33%] grid-rows-1 gap-3 md:gap-4 flex flex-col-reverse'>
            <div className='relative w-full h-[350px] md:h-[550px] overflow-hidden'>
              <ImageWithShimmer
                src='/images/sanctury/beach-web.webp'
                alt='Private beach with couple walking'
                fill
                className='object-cover'
              />
            </div>
            <div className='flex flex-col justify-start md:mt-9'>
              <div className='text-[20px] md:text-[24px] text-slateGray font-ivyOra py-2 text-left leading-[120%]'>
                Your private beach
              </div>
              <div className='text-base md:text-xl text-slateGray font-crimson text-left'>
                Let the ocean become your guide. With 1,000 meters of untouched coastline,
                mineral-rich sands, and therapeutic waves, each moment here restores you. From dawn
                meditations to sunset rituals, this sacred shoreline invites stillness, clarity, and
                deep inner renewal.
              </div>
            </div>
          </div>
        </div>

        {/*
         */}

        <div
          ref={(el: HTMLDivElement | null): void => {
            sectionRefs.current[1] = el
          }}
          className='mt-12 md:mt-20 p-5 md:p-10 bg-softSand'
        >
          <div className=' text-[28px]  md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left md:text-center leading-none m-auto'>
            The Pema promise{' '}
          </div>

          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full'>
            {` From the moment you arrive, a circle of experts each attuned to the layers of you comes
            together to guide your journey. This isn't one-size-fits-all wellness. It's a rare
            sanctuary where every program is crafted by your dedicated team of specialists.`}
          </div>
          <PemaTabsWeb />

          <div className='text-base md:text-xl text-slateGray text-center md:w-[60%] m-auto w-full mt-6 leading-[110%] md:leading-[100%]'>
            And around this circle, an entire ecosystem of care flows hospitality professionals,
            wellness attendants, and mindful staff all quietly tending to your comfort and peace of
            mind.
          </div>

          <div className='text-base md:text-xl text-slateGray text-center md:w-[60%] m-auto w-full mt-3 md:mt-6 mb-3'>
            Choose the journey crafted for you
          </div>
          <div className='flex md:flex-row flex-col gap-3 items-center  md:justify-center'>
            <Link
              href={ROUTES.wellnessProgram}
              className=' font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Explore holistic wellness journey <MoveRight />
            </Link>
            <Link
              href={ROUTES.medicalHealthProgram}
              className=' font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
            >
              Explore medical healing journey <MoveRight />
            </Link>
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
            A day in your sanctuary{' '}
          </div>

          <div className='text-base md:text-xl text-slateGray md:text-center text-left md:w-[60%] m-auto w-full mb-6'>
            The rhythm of healing.
          </div>
          <div className=' md:grid md:grid-cols-[66%_33%] md:grid-rows-1 md:gap-0 h-max'>
            <div className='h-max'>
              {/* third image horizontal*/}
              <ImageWithShimmer
                src='/images/sanctury/sanctury-1.webp'
                alt='rooom iamge'
                className='md:h-[550px] h-[350] w-full hidden md:block mb-4'
                width={750}
                height={500}
              />
              <ImageWithShimmer
                src='/images/sanctury/sanctury-mobile.webp'
                alt='rooom iamge'
                className='md:h-[550px] h-[350] md:hidden block w-full mb-4'
                width={750}
                height={500}
              />
              <div className='hidden md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* first image w-1/2*/}
                <ImageWithShimmer
                  src='/images/sanctury/sanctury-2.webp'
                  alt='room image'
                  className='h-[545px] object-cover'
                  width={750}
                  height={500}
                />

                {/* second image w-1/2*/}
                <ImageWithShimmer
                  src='/images/sanctury/sanctury-3.webp'
                  alt='room image'
                  className='h-[545px] object-cover'
                  width={750}
                  height={500}
                />
              </div>
            </div>

            <div className='flex flex-col md:mx-5 mb-3'>
              <div className='md:mt-9'>
                <div className='mb-3 scroll-mt-[140px] md:scroll-mt-40'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div>
                      <div className='font-crimson md:font-ivyOra items-center w-fit text-slateGray text-base md:text-2xl flex flex-row gap-2 '>
                        Dawn
                      </div>
                    </div>
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-0 md:mt-3 pl-10'>
                    Kriyas in our Domiziani art room. A therapeutic mud walk or Ocean meditation as
                    the sun rises over The Bay of Bengal{' '}
                  </div>
                </div>
                <div className='mb-[18px] md:mb-6'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div>
                      <div className='font-crimson md:font-ivyOra items-center w-fit text-slateGray text-base md:text-2xl flex flex-row gap-2 '>
                        Morning
                      </div>
                    </div>
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-0 md:mt-3 pl-10'>
                    Pranayama on your private terrace, massages as per custom schedule therapeutic
                    breakfast/ drink by The Healing Hills
                  </div>
                </div>
                <div className='mb-[18px] md:mb-6'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div>
                      <div className='font-crimson md:font-ivyOra items-center w-fit text-slateGray text-base md:text-2xl flex flex-row gap-2 '>
                        Midday
                      </div>
                    </div>
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-0 md:mt-3 pl-10'>
                    Personalised treatments with your healing team nourishing lunch crafted for your
                    needs
                  </div>
                </div>
                <div className='mb-[18px] md:mb-6'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div>
                      <div className='font-crimson md:font-ivyOra items-center w-fit text-slateGray text-base md:text-2xl flex flex-row gap-2 '>
                        Afternoon
                      </div>
                    </div>
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-0 md:mt-3 pl-10'>
                    Gentle movement, therapeutic treatments, time for reflection{' '}
                  </div>
                </div>
                <div className='mb-[18px] md:mb-6'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div>
                      <div className='font-crimson md:font-ivyOra items-center w-fit text-slateGray text-base md:text-2xl flex flex-row gap-2 '>
                        Evening
                      </div>
                    </div>
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-0 md:mt-3 pl-10'>
                    Sunset yoga, interactive expert talks , healing dinner. Evening entertainment-
                    slew of performances and engaging group activities{' '}
                  </div>
                </div>
                <div className='mb-[18px] md:mb-6'>
                  <div className='flex flex-row items-center gap-2'>
                    <Image
                      src={'/images/kosha-pointer-icon.svg'}
                      alt={'/images/kosha-pointer-icon.svg'}
                      width={31}
                      height={24}
                    />
                    <div>
                      <div className='font-crimson md:font-ivyOra items-center w-fit text-slateGray text-base md:text-2xl flex flex-row gap-2 '>
                        Night
                      </div>
                    </div>
                  </div>
                  <div className='text-base md:text-xl text-slateGray mt-0 md:mt-3 pl-10'>
                    Deep rest in spaces designed for cellular renewal{' '}
                  </div>
                </div>
                <Link
                  href={'#contact-us'}
                  className='mt-6 mx-auto font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
                >
                  Book now <MoveRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* 
      testimonials 2
       */}
        <div className='mt-12 md:mt-20 max-w-[1360px] m-auto'>
          <TextTestimonialCard
            data={textTestData}
            bgMobile='/images/sanctury/test-bg-mobile.webp'
            bgWeb='/images/sanctury/test-bg.webp'
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
          <div className=' mb-4 w-full flex '>
            <div className=' md:px-0 md:mt-9 mx-auto  max-w-full w-[620px] '>
              <div
                className='text-pemaBlue md:text-center text-left
               font-ivyOra text-[28px] md:text-[32px] mb-2 '
              >
                Your investment to limitlessness{' '}
              </div>
              <div className='text-slateGray font-crimson text-base md:text-[20px] md:mt-3 md:text-center text-left mb-6'>
                Programs designed for your unique needs.{' '}
              </div>
              <div className='border-b md:border-[#0000001F] border-transparent pb-3 w-full mt-3'>
                <div className='text-slateGray  font-ivyOra text-[20px] md:text-[24px] '>
                  Wellness journeys{' '}
                </div>
                <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                  Starting at{' '}
                </div>
                <div className=' flex flex-row justify-between items-center'>
                  <div className='text-slateGray font-ivyOra text-2xl md:text-[32px]'>
                    {convertINRUsingGlobalRates(45000, currency)} onwards
                  </div>
                  <CountryDropdown />
                </div>
              </div>
              <div className='border-b md:border-[#0000001F] border-transparent pb-3 w-full mt-3 md:mt-6'>
                <div className='text-slateGray  font-ivyOra text-[20px] md:text-[24px] '>
                  Medical programs{' '}
                </div>
                <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                  Starting at{' '}
                </div>
                <div className=' flex flex-row justify-between items-center'>
                  <div className='text-slateGray font-ivyOra text-2xl md:text-[32px]'>
                    {convertINRUsingGlobalRates(45000, currency)} onwards
                  </div>
                  <CountryDropdown />
                </div>
              </div>
              <div className='border-b md:border-[#0000001F] border-transparent pb-3 w-full mt-3 md:mt-6'>
                <div className='text-slateGray  font-ivyOra text-[20px] md:text-[24px] '>
                  Pema lite{' '}
                </div>
                <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                  Starting at{' '}
                </div>
                <div className=' flex flex-row justify-between items-center'>
                  <div className='text-slateGray font-ivyOra text-2xl md:text-[32px]'>
                    {convertINRUsingGlobalRates(47000, currency)} onwards
                  </div>
                  <CountryDropdown />
                </div>
              </div>
              <div className='text-slateGray text-center font-crimson text-base md:text-[20px] mt-3 md:w-[70%] w-full m-auto'>
                (Includes all consultations, daily therapies, premium healing cuisine, and post-stay
                guidance)
              </div>
              <PrimaryButton className='w-full mt-4'>
                <Link href={'#contact-us'}>Book your detox consultation</Link>{' '}
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div className='lg:grid grid-cols-[70%_30%] grid-rows-1 mt-12 md:mt-20 md:gap-5 max-w-[1360px] px-4 m-auto'>
          {/* Right column (60%) */}
          <div className='relative w-full h-[350] md:h-[550] overflow-hidden'>
            <ImageWithShimmer
              src='/images/sanctury/bottom-hero.webp'
              alt='wellbeing-banner-home'
              fill
              className='object-cover absolute top-0 left-0 md:block hidden'
            />
            <ImageWithShimmer
              src='/images/sanctury/bottom-hero-mobile.webp'
              alt='wellbeing-banner-home'
              fill
              className='object-cover absolute top-0 left-0 md:hidden block'
            />
          </div>
          {/* Left column (40%) */}
          <div className='flex flex-col justify-start mb-6'>
            <div className='md:mt-9'>
              <div className='text-xl md:text-2xl text-slateGray font-ivyOra'>
                Enter your healing universe
              </div>
              <div className='text-base md:text-xl text-slateGray mt-2'>
                {`Every stone placed, every room designed, every meal prepared all in service of your
                return to wholeness. This is where healing doesn't just happen it's inevitable.`}
              </div>
            </div>
            <div className='flex flex-col gap-6 md:mt-9'>
              <div className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'>
                Begin your journey <MoveRight />
              </div>

              <Link
                href={ROUTES.contactUs}
                className='font-crimson text-base md:text-xl text-pemaBlue flex flex-row items-center gap-2 border-b border-pemaBlue w-fit'
              >
                Connect with our team <MoveRight />
              </Link>
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

        {/*












       */}

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
