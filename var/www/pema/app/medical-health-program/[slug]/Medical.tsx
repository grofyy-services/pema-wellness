'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { useEffect, useRef, useState } from 'react'
import { ROUTES } from '@/utils/utils'
import { useParams, useRouter } from 'next/navigation'
import { programDetails } from './program'
import ReactPlayer from 'react-player'
import DoctorsCarousel from './ExpertsTeam'
import TextTestimonialCard from '@/components/TextTestimonials'
import CountryDropdown from '@/components/CountryDropDown'
import { selectedCurrencyAtom } from '@/lib/atoms'
import { useAtomValue } from 'jotai'
import Marquee from 'react-fast-marquee'
import { convertINRUsingGlobalRates } from '@/lib/convertCurrency'
import ImageWithShimmer from '@/components/ImageWithShimmer'

export default function Medical() {
  const router = useRouter()
  const { slug } = useParams()
  const currency = useAtomValue(selectedCurrencyAtom)

  const programData = programDetails.filter((item) => item.id === slug)[0]

  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [currentTrack, setCurrentTrack] = useState('overview')

  if (!programData) {
    router.push(ROUTES.wellnessProgram)
  }
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Medical programs', href: ROUTES.medicalHealthProgram },
    {
      label: programData.program_name,
    },
  ]
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id === 'overview' || id === 'inside-program') {
              setCurrentTrack(id)
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // triggers when section is near middle of screen
        threshold: 0,
      }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      <div className='px-4 text-[28px] md:text-[40px] text-slateGray font-ivyOra text-center mb-2 mt-4 md:mt-10'>
        {programData.program_name}
      </div>
      <div className='px-4 text-[20px] md:text-[32px] text-slateGray font-ivyOra text-center'>
        {programData.header_text}{' '}
      </div>
      <nav
        className='sticky top-[77px] flex flex-row justify-center md:pt-2 pb-2 select-none bg-white z-2'
        role='tablist'
        aria-label='Swiper tabs'
      >
        <button
          role='tab'
          onClick={() => {
            setCurrentTrack('overview')
            window.scrollTo(0, 0)
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
            setCurrentTrack('inside-program')
            router.push('#inside-program')
          }}
          className={`px-3 py-2 cursor-pointer border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
            currentTrack === 'inside-program'
              ? 'text-pemaBlue border-pemaBlue'
              : 'border-[#32333333] text-slateGray '
          }`}
        >
          Inside program{' '}
        </button>
      </nav>
      <section id='overview'>
        <div
          className='relative'
          id='overview'
          ref={(el: HTMLDivElement | null): void => {
            sectionRefs.current[0] = el
          }}
        >
          {/* hero image */}
          <div className='md:px-0 px-4'>
            <div className='relative mt-6 w-full  h-[470px]  md:h-[630px] overflow-hidden'>
              <ImageWithShimmer
                src={programData.hero_img_mobile}
                alt={'wellbeing-banner-home'}
                fill
                priority
                preload={true}
                className={`object-cover block md:hidden absolute top-0 left-0 `}
              />
              <ImageWithShimmer
                src={programData.hero_img_web}
                alt={'wellbeing-banner-home'}
                fill
                priority
                preload={true}
                className={`object-cover hidden md:block absolute top-0 left-0 `}
              />
            </div>
          </div>
        </div>
        <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
          <Marquee>
            {' '}
            <Check className='ml-4 mr-2' />
            2,000+ Guests Have Successfully Reversed Digestive Disorders at Pema{' '}
          </Marquee>
        </div>
        {/* quote */}
        <div className='mt-12 md:mt-20 m-auto px-4'>
          <div className='w-full leading-[110%] md:w-[90%] text-[24px] md:text-[32px] text-pemaBlue font-ivyOra text-center m-auto'>
            {programData.program_quote}
          </div>
        </div>

        {/* video testimonials */}
        {programData.video_testimonial && (
          <div className='mt-12 md:mt-20 m-auto p-4 md:p-9 bg-softSand'>
            <div className='text-[24px] md:text-[32px] text-pemaBlue font-ivyOra text-center md:mb-9 mb-6'>
              {programData.video_testimonial.heading}{' '}
            </div>
            {programData.video_testimonial.video_url ? (
              <div className=' lg:grid grid-cols-[65%_35%] grid-rows-1'>
                <div className='relative w-full h-[350px] md:h-[530px] overflow-hidden'>
                  {/* <div className='h-[350px] md:h-[740px] flex justify-center items-center mb-6'> */}
                  <ReactPlayer
                    width='100%'
                    controls
                    autoPlay={false}
                    height='100%'
                    src={programData.video_testimonial.video_url}
                    className='w-[100vw] aspect-video'
                    // playing={false && index === activeIndex}
                  />
                  {/* </div> */}
                </div>
                <div className='flex flex-col md:text-left text-center justify-center md:px-4'>
                  <div className=''>
                    <div className='text-[20px] mb-3 md:text-[24px]  text-slateGray font-ivyOra mt-6 md:mt-0 leading-[120%]'>
                      {programData.video_testimonial.testimonial_text}
                    </div>
                    <div className='text-[24px] md:text-[32px] text-pemaBlue md:whitespace-pre-line md:leading-normal leading-[110%]'>
                      {programData.video_testimonial.user_name}{' '}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col text-center justify-center md:px-4'>
                <div className=''>
                  <div className='text-[20px] mb-3 md:text-[24px] md:max-w-[70%] mx-auto text-slateGray font-ivyOra mt-6 md:mt-0 leading-[120%]'>
                    {programData.video_testimonial.testimonial_text}
                  </div>
                  <div className='text-[24px] md:text-[32px] text-pemaBlue md:whitespace-pre-line md:leading-normal leading-[110%]'>
                    {programData.video_testimonial.user_name}{' '}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key concerns section */}
        {programData.key_concern && (
          <div className='mt-12 md:px-0 px-4 md:mt-20 w-full'>
            <div className='text-[28px] text-center md:hidden block text-pemaBlue font-ivyOra mb-3'>
              {programData.key_concern.heading}
            </div>

            <div className='md:mt-9'>
              {' '}
              <div className='text-[28px] text-center md:block hidden md:text-[40px] text-pemaBlue md:font-ivyOra md:mb-6'>
                {programData.key_concern.heading}
              </div>
              <div className='md:flex justify-center flex-row flex-wrap w-full md:px-10'>
                {programData.key_concern.pointers.map((item, index) => {
                  return (
                    <div
                      key={item}
                      className='flex md:w-1/3 lg:w-1/4 md:px-4 flex-row items-start gap-2 mt-3'
                    >
                      <Image
                        src={`/lotus-pointer-${index + 1}.svg`}
                        alt={'/lotus-pointer-icon.svg'}
                        width={31}
                        height={24}
                      />
                      <div className='text-base md:text-xl text-slateGray mt-0'>{item}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3 img section */}
        <div className='mt-12 md:mt-20 md:px-0 px-4'>
          <div className=' md:grid lg:grid-cols-[66%_33%] md:grid-rows-1 md:gap-0 h-max mt-6'>
            <div className='h-fit  '>
              <div className='hidden md:flex md:flex-row gap-4 w-full overflow-hidden'>
                {/* first image w-1/2*/}
                <ImageWithShimmer
                  src={programData.three_img_section.img1}
                  alt={programData.three_img_section.heading}
                  className='h-[545px]! md:w-full! object-cover mb-4'
                  width={750}
                  height={500}
                />

                {/* second image w-1/2*/}
                <ImageWithShimmer
                  src={programData.three_img_section.img2}
                  alt={programData.three_img_section.heading}
                  className='h-[545px] md:w-full object-cover mb-4'
                  width={750}
                  height={500}
                />
              </div>
              {/* third image horizontal*/}
              <ImageWithShimmer
                src={programData.three_img_section.img3}
                alt={programData.three_img_section.heading}
                className='md:h-[550px] h-[350] w-full hidden md:block '
                width={750}
                height={500}
              />
            </div>

            <div className='flex flex-col md:mx-5 mb-3 h-fit md:sticky md:top-24'>
              <div className='md:mt-9 mt-6'>
                <div className='text-center md:text-left font-ivyOra text-pemaBlue text-[28px] md:text-[40px]'>
                  {programData.three_img_section.heading}{' '}
                </div>
                <div className='mt-2 '>
                  <Image
                    src={programData.three_img_section.imgMobile}
                    alt={programData.three_img_section.heading}
                    className='md:h-[550px] h-[350] md:hidden block object-cover w-full my-3'
                    width={750}
                    height={500}
                  />
                  <div className=' text-base md:text-xl text-slateGray md:mt-2 leading-[120%]'>
                    {programData.three_img_section.sub_text} <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=' md:hidden bg-sunkbakedShell w-full flex items-center flex-row justify-center text-slateGray font-ivyOra h-12 mt-12'>
          <Marquee className='ml-4'>
            <Check className='mr-2' />
            30+ years of clinical expertise in Naturopathic gut health
          </Marquee>
        </div>
        {/* table */}
        <div className='mt-12 md:mt-20'>
          <div className='px-4 text-[28px]  whitespace-pre-line md:whitespace-normal md:text-[40px] text-pemaBlue font-ivyOra  text-center leading-[120%] m-auto'>
            {programData.healingTable?.heading}
          </div>
          <div className='px-4  text-base md:text-xl text-slateGray text-center md:mt-2 leading-[120%]'>
            {programData.healingTable?.subText1}
          </div>
          <div className='px-4  text-base md:text-xl text-slateGray text-center md:mt-2 leading-[120%] md:w-[60%] mx-auto w-full'>
            {programData.healingTable?.subText2}
          </div>
          {/* web */}
          <div className='hidden max-w-4xl mt-6 mx-auto md:grid  grid-cols-2 grid-rows-1 '>
            <div className='py-3 px-0 md:px-6 md:border md:border-[#32333333] '>
              <div className='flex flex-col gap-3  '>
                <div className='pl-4 md:pl-0 text-base md:text-2xl font-ivyOra bg-pemaBlue md:bg-transparent text-softSand md:text-slateGray py-3 '>
                  Problem
                </div>
                {programData.healingTable?.problems.map((item) => {
                  return (
                    <div
                      key={item}
                      className='text-base md:text-xl leading-[110%] text-left pl-4 md:pl-0 border-b border-[#3233331A] md:border-0 pb-3'
                    >
                      {item}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='py-3 relative md:bg-pemaBlue text-slateGray  md:text-softSand px-0 md:px-6 '>
              <div className='flex flex-col gap-3 md:gap-3 '>
                <div className='pl-4 md:pl-0 text-base md:text-2xl font-ivyOra bg-pemaBlue md:bg-transparent text-softSand py-3'>
                  Solution
                </div>

                {programData.healingTable?.solutions.map((item) => {
                  return (
                    <div
                      key={item}
                      className='text-base md:text-xl leading-[110%] text-left pl-4 md:pl-0 border-b border-[#3233331A] md:border-0 pb-3'
                    >
                      {item}
                    </div>
                  )
                })}
              </div>
              <Image
                alt='Bg image'
                width={270}
                height={130}
                className='absolute right-0 bottom-0 md:w-[270px] aspect-auto w-[150px]'
                src={'/images/medical-health-program/lotus-gray-bg-image.svg'}
              />
            </div>
          </div>
          {/* mobile */}
          <div className='w-full mt-6 mx-auto md:hidden grid grid-cols-1 md:grid-cols-2'>
            <div className='grid grid-cols-2 border-b border-[#3233331A]'>
              <div className='pl-4 md:pl-0 text-base md:text-2xl md:font-ivyOra bg-pemaBlue md:bg-transparent text-softSand md:text-slateGray py-4 '>
                Problem
              </div>
              <div className='relative pl-4 md:pl-0 text-base md:text-2xl md:font-ivyOra bg-pemaBlue md:bg-transparent text-softSand py-4'>
                Solution
                <ImageWithShimmer
                  alt='Bg image'
                  width={50}
                  height={130}
                  className='absolute right-5 bottom-0  aspect-auto w-fit h-full'
                  src={'/images/medical-health-program/lotus-gray-bg-image.svg'}
                />
              </div>
            </div>
            {programData.healingTable?.problems.map((problem, index) => {
              const solution = programData.healingTable?.solutions[index] || ''
              return (
                <div key={index} className='grid grid-cols-2 border-b border-[#3233331A]'>
                  <div className='py-3 pl-4 md:pl-0 text-base md:text-xl text-left leading-[110%]'>
                    {problem}
                  </div>
                  <div className='py-3 px-4 md:px-0 text-base md:text-xl text-left leading-[110%]'>
                    {solution}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* experts */}
        <div className=' mt-12 md:mt-20 m-auto '>
          <div className='text-[28px] mb-6 whitespace-pre-line md:whitespace-normal md:text-[40px] text-pemaBlue font-ivyOra  text-center leading-[120%] m-auto'>
            {programData.experts.heading}
          </div>
          <DoctorsCarousel doctors={programData.experts.doctors!} />
        </div>
      </section>
      {/* phases / inside program */}
      <section id='inside-program' className='scroll-m-40 mt-12 md:mt-20 m-auto px-4'>
        <div className='text-[28px] whitespace-pre-line md:whitespace-normal md:text-[40px] text-pemaBlue font-ivyOra  text-center leading-[120%] m-auto'>
          {programData.inside_program.title}{' '}
        </div>
        <div className='whitespace-pre-line md:whitespace-normal mt-2 text-base md:text-xl text-slateGray font-crimson text-center md:w-[60%] m-auto w-full'>
          {programData.inside_program.sub_title}{' '}
        </div>
        <div className='bg-softSand py-3 md:px-17 px-4 mx-auto w-fit mt-2'>
          <div className='mt-2 text-base md:text-xl text-pemaBlue font-crimson text-center  m-auto w-full'>
            {programData.inside_program.required_days_text}{' '}
          </div>
          <div className='mt-1 text-base md:text-xl text-slateGray md:whitespace-pre-line font-crimson text-center  m-auto w-full'>
            {programData.inside_program.note}{' '}
          </div>
        </div>
        {programData.inside_program.phases.length === 3 ? (
          <div className='hidden md:flex relative flex-row md:flex-nowrap flex-wrap  justify-between items-start mx-auto max-w-[850px] mt-6 mb-3 md:mb-9'>
            <div className='w-1/2 md:w-1/3 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
              <Image
                src={'/lotus-pointer-1.svg'}
                className='w-[30px] h-7'
                alt='pema'
                width={30}
                height={28}
              />
              <div className='text-pemaBlue text-base md:text-xl text-center'>
                {programData.inside_program.phase1_label ?? 'Phase 1'}
              </div>
              <div className='text-slateGray text-base md:text-2xl font-ivyOra text-center whitespace-pre-line'>
                {programData.inside_program.phase1}
              </div>
            </div>{' '}
            <div className='w-1/2 md:w-1/3 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
              <Image
                src={'/lotus-pointer-2.svg'}
                className='w-[30px] h-7'
                alt='pema'
                width={30}
                height={28}
              />
              <div className='text-pemaBlue text-base md:text-xl text-center'>
                {' '}
                {programData.inside_program.phase2_label ?? 'Phase 2'}
              </div>
              <div className='text-slateGray text-base md:text-2xl font-ivyOra text-center whitespace-pre-line'>
                {programData.inside_program.phase2}
              </div>
            </div>{' '}
            <div className='w-1/2 md:w-1/3 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
              <Image
                src={'/lotus-pointer-3.svg'}
                className='w-[30px] h-7'
                alt='pema'
                width={30}
                height={28}
              />
              <div className='text-pemaBlue text-base md:text-xl text-center'>
                {' '}
                {programData.inside_program.phase3_label ?? 'Phase 3'}
              </div>
              <div className='text-slateGray text-base md:text-2xl font-ivyOra text-center whitespace-pre-line'>
                {programData.inside_program.phase3}
              </div>
            </div>{' '}
            <div className='md:block hidden bg-pemaBlue h-[2px] absolute top-[26px] left-[140px] right-[140px]'></div>
          </div>
        ) : programData.inside_program.phases.length === 2 ? (
          <div className='hidden md:flex relative flex-row md:flex-nowrap flex-wrap  justify-between items-start mx-auto max-w-[850px] mt-6 mb-3 md:mb-9'>
            <div className='w-1/2 md:w-1/2 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
              <Image
                src={'/lotus-pointer-1.svg'}
                className='w-[30px] h-7'
                alt='pema'
                width={30}
                height={28}
              />
              <div className='text-pemaBlue text-base md:text-xl text-center'>
                {' '}
                {programData.inside_program.phase1_label ?? 'Phase 1'}
              </div>
              <div className='text-slateGray text-base md:text-2xl font-ivyOra text-center whitespace-pre-line'>
                {programData.inside_program.phase1}
              </div>
            </div>{' '}
            <div className='w-1/2 md:w-1/2 flex md:flex-col items-center md:justify-center gap-1 md:mb-0 mb-3'>
              <Image
                src={'/lotus-pointer-2.svg'}
                className='w-[30px] h-7'
                alt='pema'
                width={30}
                height={28}
              />
              <div className='text-pemaBlue text-base md:text-xl text-center'>
                {' '}
                {programData.inside_program.phase2_label ?? 'Phase 2'}
              </div>
              <div className='text-slateGray text-base md:text-2xl font-ivyOra text-center whitespace-pre-line'>
                {programData.inside_program.phase2}
              </div>
            </div>{' '}
            <div className='md:block hidden bg-pemaBlue h-[2px] absolute top-[26px] left-[200px] right-[200px]'></div>
          </div>
        ) : null}
        {/* phases */}
        <div className='flex flex-col'>
          {programData.inside_program.phases.map((phase) => {
            return (
              <div key={phase.id} className='mt-6'>
                <div className='flex flex-row items-center justify-start gap-2'>
                  <Image
                    src={`/lotus-pointer-${phase.id}.svg`}
                    className='w-[30px] h-7 md:inline hidden'
                    alt='pema'
                    width={30}
                    height={28}
                  />
                  <div className='text-pemaBlue text-base md:text-xl text-center'>
                    {phase.phase_label ? phase.phase_label : `Phase ${phase.id}`}
                  </div>
                </div>
                <div
                  className={`${phase.id !== 3 ? 'md:border-l-2' : ''} border-pemaBlue md:ml-4 md:pl-7 mt-2 md:mt-3 `}
                >
                  <div className='text-slateGray text-xl md:text-2xl leading-none font-ivyOra'>
                    {phase.title}
                  </div>
                  <div className='mt-3 md:mt-6 md:pb-3 md:grid md:grid-cols-[66%_33%] gap-5 w-full'>
                    <div className='relative w-full md:h-[500] h-[350] overflow-hidden md:mb-3 mb-3'>
                      <ImageWithShimmer
                        src={phase.imgMobile}
                        alt='prepare'
                        // priority
                        fill
                        className='object-cover md:hidden block'
                      />
                      <ImageWithShimmer
                        src={phase.imgWeb}
                        alt='prepare'
                        // priority
                        fill
                        className='object-cover hidden md:block'
                      />
                    </div>
                    <div className='md:mt-9 h-fit md:sticky md:top-34'>
                      {phase.pointers.map((item) => {
                        return (
                          <div key={item} className='flex flex-row items-start gap-1 md:gap-2 mt-3'>
                            <Image
                              src={`/images/kosha-pointer-icon.svg`}
                              alt={'/lotus-pointer-icon.svg'}
                              width={31}
                              height={24}
                              className='h-5 w-6 md:w-8 md:h-6'
                            />
                            <div className='text-base md:text-xl text-slateGray mt-0'>{item}</div>
                          </div>
                        )
                      })}
                      {phase.note && (
                        <div className='text-base md:text-xl text-slateGray mt-3'>{phase.note}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* What's included */}
      <div className='mt-12 md:mt-20 m-auto md:px-0 px-4 mx-auto'>
        <div className='p-4 md:p-9 bg-softSand'>
          <div className='flex flex-col-reverse md:grid md:grid-cols-[33%_66%] md:gap-5 w-full'>
            <div className='text-left'>
              <div className='text-[24px] hidden md:block md:text-[32px] text-pemaBlue font-ivyOra '>
                {programData.whats_included.title}{' '}
              </div>
              <div>
                {programData.whats_included.pointers.map((item) => {
                  return (
                    <div key={item.id}>
                      <div className='flex flex-row items-start gap-1 md:gap-2 mt-3 md:mt-6'>
                        <Image
                          src={`/images/kosha-pointer-icon.svg`}
                          alt={'/lotus-pointer-icon.svg'}
                          width={31}
                          height={24}
                          className='h-5 w-6 md:w-8 md:h-6'
                        />
                        <div className='text-base md:text-xl text-slateGray mt-0'>{item.title}</div>
                      </div>
                      {item.points.map((points) => {
                        return (
                          <div
                            key={points}
                            className='flex text-pemaBlue flex-row items-start gap-1 md:gap-2 mt-2 ml-6'
                          >
                            <Check width={31} height={24} className='h-5 w-5 md:w-6 md:h-6' />
                            <div className='text-base md:text-xl  mt-0'>{points}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='relative w-full md:h-[890] h-[350] overflow-hidden md:mb-3'>
              <ImageWithShimmer
                src={programData.whats_included.imgMobile}
                alt='prepare'
                fill
                priority
                preload={true}
                className='object-cover md:hidden block'
              />
              <ImageWithShimmer
                src={programData.whats_included.imgWeb}
                alt='prepare'
                fill
                priority
                preload={true}
                className='object-cover hidden md:block'
              />
            </div>
            <div className='text-[24px] md:text-[32px] text-pemaBlue md:hidden block font-ivyOra mb-3'>
              {programData.whats_included.title}{' '}
            </div>
          </div>
        </div>
      </div>

      {/* Program enhancements */}
      <div className='px-4 md:px-0  mt-3 md:mt-0'>
        <div className='bg-pemaBlue relative px-6 py-6 md:py-0 md:grid grid-cols-2'>
          <div className='md:h-full w-full max-w-[450] mx-auto md:static absolute right-0 left-0 bottom-0'>
            <ImageWithShimmer
              priority
              preload={true}
              alt='Pema Icon'
              className='h-full aspect-353/255 md:h-full w-full'
              src={programData.program_enhancements.img}
              width={450}
              height={325}
            />
          </div>
          <div className='bg-softSand md:my-6 p-6'>
            <div className='text-[28px] md:text-[40px] text-pemaBlue font-ivyOra py-2 text-left leading-[120%]'>
              {programData.program_enhancements.title}
            </div>
            <div className='text-base md:text-xl text-pemaBlue mt-2'>
              {programData.program_enhancements.sub_title}
            </div>
            {programData.program_enhancements.pointers.map((points) => {
              return (
                <div
                  key={points}
                  className='flex text-pemaBlue flex-row items-start gap-1 md:gap-2 mt-2 ml-6'
                >
                  <Check width={31} height={24} className='h-5 w-5 md:w-6 md:h-6' />
                  <div className='text-base md:text-xl  mt-0'>{points}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* testimonials web + mobile */}
      <div className='mt-20 max-w-[1360px] m-auto'>
        <TextTestimonialCard
          bgMobile={programData.testimonials_data.bgImgMobile}
          bgWeb={programData.testimonials_data.bgImgWeb}
          data={programData.testimonials_data.data}
        />
      </div>

      {/* Investment & booking */}
      <div className='mt-12 md:mt-20 max-w-[1360px] m-auto px-4'>
        <div className=' mb-4 w-full flex '>
          <div className=' mx-auto  max-w-full w-[620px] '>
            <div
              className='text-pemaBlue md:text-center text-left
               font-ivyOra text-[28px] md:text-[40px] '
            >
              {programData.investment_booking.title}
            </div>

            {programData.investment_booking.programs.map((item) => {
              return (
                <div
                  key={item.id}
                  className='border-b md:border-[#0000001F] border-transparent pb-3 w-full mt-3 md:mt-10'
                >
                  <div className='text-slateGray  font-ivyOra text-[20px] md:text-[24px] '>
                    {item.program_name}
                  </div>
                  <div className='text-slateGray font-crimson text-base md:text-[20px] mt-3'>
                    Starting at{' '}
                  </div>
                  <div className=' flex flex-row justify-between items-center'>
                    <div className='text-slateGray font-ivyOra text-xl md:text-[32px]'>
                      {convertINRUsingGlobalRates(item.starting_at, currency)}/night{' '}
                      <span className='font-crimson text-base md:text-xl'>all inclusive*</span>
                    </div>
                    <CountryDropdown />
                  </div>
                </div>
              )
            })}
            <div className='text-slateGray text-center font-crimson leading-[110%] text-base md:text-[20px] mt-3 md:mt-6 w-full m-auto'>
              {programData.investment_booking.note}
            </div>
            <PrimaryButton className='w-fit mx-auto mt-4 flex justify-center'>
              <Link href={'#contact-us'}>Book your consultation</Link>{' '}
            </PrimaryButton>
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
