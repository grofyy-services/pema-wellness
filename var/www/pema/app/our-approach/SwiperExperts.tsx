import { useRef, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import { Check, MoveLeft, MoveRight } from 'lucide-react'
import ImageWithShimmer from '@/components/ImageWithShimmer'

export default function DoctorsCarousel() {
  const [expandedId, setExpandedId] = useState<number | null>(null) // Track the currently expanded doctor

  const toggleReadMore = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id)) // If same ID, collapse; else expand new
  }
  return (
    <div className='h-full w-full  grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>
      {doctors.map((doc, i) => {
        const isExpanded = expandedId === doc.id

        return (
          <div key={i} className='border-[0.5px] border-[#39798FB2]'>
            <ImageWithShimmer
              height={300}
              width={308}
              src={doc.mobileImage}
              alt={doc.name}
              className={`w-full h-[308px] object-cover`}
            />
            <div className='p-4'>
              <h3 className='text-xl md:text-2xl text-pemaBlue font-ivyOra'>{doc.name}</h3>
              <p className='text-base md:text-xl text-pemaBlue mb-2'>{doc.title}</p>

              <div>
                <p
                  className={`text-base md:text-xl text-slateGray mt-3 mb-0 md:mt-3 md:mb-3 md:w-[95%] overflow-hidden
                    ${!isExpanded ? 'line-clamp-2 md:line-clamp-none' : ''}`}
                >
                  {doc.about}
                </p>

                {/* Read More / Read Less toggle for mobile */}
                <p
                  className='text-base md:hidden border-b border-pemaBlue w-fit text-pemaBlue cursor-pointer mt-1'
                  onClick={() => toggleReadMore(doc.id)}
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </p>

                <div className='text-base md:text-xl text-slateGray my-6 '>
                  <p className=' mb-1'>Specialises in</p>
                  <ul className='grid grid-cols-2 grid-rows-2 text-pemaBlue'>
                    {doc.specialities.map((s, j) => (
                      <div key={j} className='flex flex-row items-center gap-2'>
                        <Check />
                        {s}
                      </div>
                    ))}
                  </ul>
                </div>
                <p className='bg-[#F7F2EE] text-slateGray text-base md:text-xl p-3 w-full whitespace-break-spaces'>
                  {doc.quote}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const doctors = [
  {
    name: 'Dr. Sarath Kumar Damuluri',
    title: 'Chief Medical Officer ',
    about: `A pioneer in naturopathic medicine with 30+ years of experience across India and the US. Trained under Dr. SN Murthy, he's led integrative care programs and  co-authored landmark research on heart disease.`,
    specialities: ['Metabolic disorders', 'Cardiac health', 'Lifestyle medicine'],
    quote: `‘Take care of your body,  it’s the only place you have to live.’`,
    image: '/expert-dr-Sarath.jpg',
    mobileImage: '/images/experts/expert-dr-Sarath-mobile.jpg',

    id: 7,
  },
  {
    name: 'Dr. Sangeetha Dellikar',
    about: `With 24 years of clinical experience, Dr. Sangeetha combines fasting, hydrotherapy, yoga, and acupuncture into personalised, drug-free care. Her approach blends ancient wisdom with modern outcomes.`,
    title: 'Senior Naturopathy Physician',
    specialities: [`Women's health`, 'Menopause', 'Hormonal balance', 'Diabetes care'],
    quote: `‘In food, we find our medicine; in nature, our healing.’`,

    image: '/expert-dr-Sangeetha.webp',
    mobileImage: '/images/experts/expert-dr-Sangeetha-mobile.webp',
    id: 1,
  },
  {
    name: 'Dr. Muthu Murugan',
    title: 'Chief Acupuncturist',
    about: `With 23 years in Traditional Chinese Medicine, Dr. Muthu integrates acupuncture, psychology, and natural aesthetic protocols. His practice is rooted in non-invasive healing and energetic balance.`,
    specialities: ['Pain management', 'Hair growth', 'Fertility', 'Anti-ageing'],
    quote: `‘It is through the mind’s energy that the true power of healing emerges.’`,
    image: '/expert-dr-muthu.webp',
    mobileImage: '/images/experts/expert-dr-muthu-mobile.webp',

    id: 2,
  },
  {
    name: 'Dr. Syed Naveed Ahmad Kamili',
    id: 3,
    title: 'Chief Physiotherapist',
    specialities: ['Sports injuries', 'Arthritis', 'Post-operative rehab', 'Fascia release'],
    about: `With 20 years of experience across India and Dubai, Dr. Syed combines manual therapy with advanced electro-therapeutic techniques for pain relief and rehabilitation.`,
    quote: `‘There is art to medicine as well as science and warmth may outweigh the surgeon’s knife.’`,
    image: '/expert-dr-naveed.webp',
    mobileImage: '/images/experts/expert-dr-naveed-mobile.webp',
  },

  {
    name: 'Professor Prahalad Singh Chahar',
    title: 'Head, Yoga & Meditation',
    mobileImage: '/images/experts/expert-prof-prahalad-mobile.webp',
    image: '/expert-prof-prahalad.webp',
    id: 4,
    about: `With 27 years of experience across India, Europe, and Latin America, Prof. Prahalad blends traditional yogic practice with breath science and energy alignment.`,
    specialities: ['Therapeutic breathing', 'Chakra balancing', 'Meditation', 'Diabetes care'],
    quote: 'The breath is the bridge between body and mind and the beginning of deep healing.',
  },
  {
    name: 'Chef Rajiv Kumar Bali',
    image: '/expert-chef-rajiv.webp',
    mobileImage: '/images/experts/expert-chef-rajiv-mobile.webp',

    id: 5,
    title: 'Head, Culinary and Food & Beverage',
    about: `With 24 years across India, Bahrain, and Dubai, Chef Bali merges naturopathic principles with global technique. Every dish is designed to nourish both body and soul.`,
    specialities: ['Therapeutic cuisine', 'Culinary wellness'],
    quote: 'Food is memory, medicine, and ritual, served with intention.',
  },
  {
    name: 'Dr. Ramya Sathish',
    title: 'Resident Medical Officer',
    image: '/expert-dr-ramya.webp',
    mobileImage: '/images/experts/expert-dr-ramya-mobile.webp',

    id: 6,
    about: `8+ years of experience in naturopathy and integrative healing. A certified ozone therapy expert and published researcher, she blends clinical care with deep attention to women’s health, adolescent wellness, and gut healing.`,
    specialities: ['Ozone therapy', 'Hormonal health', 'Gut healing'],
    quote: 'Healing begins when we listen to the body not override it.',
  },
]
