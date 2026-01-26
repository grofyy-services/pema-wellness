'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import { Check, MoveLeft, MoveRight } from 'lucide-react'
import ImageWithShimmer from '@/components/ImageWithShimmer'
interface Doctor {
  name: string
  title: string
  mobileImage: string
  image: string
  id: number
  about: string
  specialities: string[]
  quote: string
}

export default function DoctorsCarousel({ doctors }: { doctors: Doctor[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div className='h-full w-full'>
      <Swiper
        modules={[Navigation]}
        centeredSlides={true}
        spaceBetween={12}
        loop={true} // ✅ enable loop
        initialSlide={0} // ✅ start from first slide
        breakpoints={{
          0: { slidesPerView: 1.5 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 3 },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // ✅ use realIndex
        className='w-full items-center h-max max-h-[900px]'
      >
        {doctors.map((doc, i) => {
          const isActive = i === activeIndex
          return (
            <SwiperSlide key={i} className='flex justify-center items-center '>
              <div
                data-id={doc.id}
                className={`w-full max-w-[700px] h-full overflow-x-hidden overflow-y-visible transition-transform duration-300
                  ${isActive ? 'scale-100 h-full' : ''}`}
              >
                <div className='border-[0.5px] border-[#39798FB2]'>
                  <ImageWithShimmer
                    height={300}
                    width={550}
                    onClick={() => swiperRef.current?.slideTo(i)}
                    src={doc.image}
                    alt={doc.name}
                    className={`w-full ${isActive ? 'hidden' : 'block'} h-[355px] md:h-[528px] object-cover`}
                  />
                  <ImageWithShimmer
                    height={300}
                    width={308}
                    src={doc.mobileImage}
                    alt={doc.name}
                    className={`w-full ${isActive ? 'block' : 'hidden'} h-[250px] md:h-[250px] object-cover`}
                  />
                  <div className='px-2 py-3 md:py-4 md:px-4'>
                    <h3 className='text-base md:text-2xl text-pemaBlue font-ivyOra leading-[100%]'>
                      {doc.name}
                    </h3>
                    <p className='text-sm md:text-xl text-pemaBlue mb-2'>{doc.title}</p>

                    {isActive && (
                      <>
                        <p className='hidden md:block  md:text-xl text-slateGray my-3 leading-[100%]'>
                          {doc.about}
                        </p>

                        <div className='text-sm md:text-xl text-slateGray my-2 md:my-6 '>
                          <p className='font-medium mb-1'>Specialises in</p>
                          <ul className='flex flex-row flex-wrap gap-x-2 md:grid grid-cols-2 grid-rows-2 text-pemaBlue'>
                            {doc.specialities.map((s, j) => (
                              <div key={j} className='flex flex-row items-center gap-1'>
                                <Check className='h-[14px] w-[14px] md:h-6 md:w-6' />
                                {s}
                              </div>
                            ))}
                          </ul>
                        </div>
                        <p className='md:bg-[#F7F2EE] leading-[110%] text-slateGray text-sm md:text-xl md:p-3 w-full whitespace-break-spaces'>
                          {doc.quote}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <div className='flex justify-center items-center mt-4 px-4 text-slateGray text-lg md:text-xl font-crimson'>
        <div
          className='p-2 mr-6 cursor-pointer'
          // onClick={() => {
          //   if (activeIndex === 0) {
          //     swiperRef.current?.slideTo(6)
          //   } else {
          //     swiperRef.current?.slidePrev()
          //   }
          // }}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <MoveLeft />
        </div>
        {activeIndex + 1} of {doctors.length}
        <div
          className='p-2 ml-6 cursor-pointer'
          //
          onClick={() => swiperRef.current?.slideNext()}
        >
          <MoveRight />
        </div>
      </div>
    </div>
  )
}
export const doctorSarath: Doctor = {
  name: 'Dr. Sarath Kumar Damuluri',
  title: 'Chief Medical Officer ',
  about: `A pioneer in naturopathic medicine with 30+ years of experience across India and the US. Trained under Dr. SN Murthy, he's led integrative care programs and  co-authored landmark research on heart disease.`,
  specialities: [
    'Lifestyle wellness',
    'Cardiac health',
    'Metabolic disorders',
    'Gut healing',
    'Respiratory care',
    'Diabetes care',
    'Endocrine balance',
  ],
  quote: `‘Take care of your body,  it’s the only place you have to live.’`,
  image: '/expert-dr-Sarath.jpg',
  mobileImage: '/images/experts/expert-dr-Sarath-mobile.jpg',
  id: 7,
}

export const doctorSangeetha: Doctor = {
  name: 'Dr. Sangeetha Dellikar',
  about: `With 24 years of clinical experience, Dr. Sangeetha combines fasting, hydrotherapy, yoga, and acupuncture into personalised, drug-free care. Her approach blends ancient wisdom with modern outcomes.`,
  title: 'Senior Naturopathy Physician',
  specialities: [`Women's health`, 'Menopause', 'Women’s fertility', 'Hormonal balance'],
  quote: `‘In food, we find our medicine; in nature, our healing.’`,
  image: '/expert-dr-Sangeetha.webp',
  mobileImage: '/images/experts/expert-dr-Sangeetha-mobile.webp',
  id: 1,
}

export const doctorMuthu: Doctor = {
  name: 'Dr. Muthu Murugan',
  title: 'Chief Acupuncturist',
  about: `With 23 years in Traditional Chinese Medicine, Dr. Muthu integrates acupuncture, psychology, and natural aesthetic protocols. His practice is rooted in non-invasive healing and energetic balance.`,
  specialities: ['Fertility & hormonal balance', 'Cardiac health', 'Hair growth', 'Anti-ageing'],
  quote: `‘It is through the mind’s energy that the true power of healing emerges.’`,
  image: '/expert-dr-muthu.webp',
  mobileImage: '/images/experts/expert-dr-muthu-mobile.webp',
  id: 2,
}

export const doctorNaveed: Doctor = {
  name: 'Dr. Syed Naveed Ahmad Kamili',
  id: 3,
  title: 'Chief Physiotherapist',
  specialities: ['Sports injuries', 'Arthritis', 'Post-operative rehab', 'Pain management'],
  about: `With 20 years of experience across India and Dubai, Dr. Syed combines manual therapy with advanced electro-therapeutic techniques for pain relief and rehabilitation.`,
  quote: `‘There is art to medicine as well as science and warmth may outweigh the surgeon’s knife.’`,
  image: '/expert-dr-naveed.webp',
  mobileImage: '/images/experts/expert-dr-naveed-mobile.webp',
}

export const professorPrahalad: Doctor = {
  name: 'Professor Prahalad Singh Chahar',
  title: 'Head, Yoga & Meditation',
  mobileImage: '/images/experts/expert-prof-prahalad-mobile.webp',
  image: '/expert-prof-prahalad.webp',
  id: 4,
  about: `With 27 years of experience across India, Europe, and Latin America, Prof. Prahalad blends traditional yogic practice with breath science and energy alignment.`,
  specialities: ['Therapeutic breathing', 'Chakra balancing', 'Meditation', 'Diabetes care'],
  quote: 'The breath is the bridge between body and mind and the beginning of deep healing.',
}

export const chefRajiv: Doctor = {
  name: 'Chef Rajiv Kumar Bali',
  image: '/expert-chef-rajiv.webp',
  mobileImage: '/images/experts/expert-chef-rajiv-mobile.webp',
  id: 5,
  title: 'Head, Culinary and Food & Beverage',
  about: `With 24 years across India, Bahrain, and Dubai, Chef Bali merges naturopathic principles with global technique. Every dish is designed to nourish both body and soul.`,
  specialities: ['Therapeutic cuisine', 'Culinary wellness', 'Detoxification', 'Gut healing'],
  quote: 'Food is memory, medicine, and ritual, served with intention.',
}

export const doctorRamya: Doctor = {
  name: 'Dr. Ramya Sathish',
  title: 'Resident Medical Officer',
  image: '/expert-dr-ramya.webp',
  mobileImage: '/images/experts/expert-dr-ramya-mobile.webp',
  id: 6,
  about: `8+ years of experience in naturopathy and integrative healing. A certified ozone therapy expert and published researcher, she blends clinical care with deep attention to women’s health, adolescent wellness, and gut healing.`,
  specialities: ['Lifestyle medicine', 'Ozone therapy', 'Hormonal health', 'Gut healing'],
  quote: 'Healing begins when we listen to the body not override it.',
}
