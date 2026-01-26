'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ImageWithShimmer from '@/components/ImageWithShimmer'

const articles = [
  {
    agencyName1: 'Outlook Traveller',
    title1: '‘A holistic luxury destination for modern families’',
    date1: 'July 29, 2025',
    img1: '/images/about/article-1-web-image.webp',
    mobileImg1: '/images/about/article-1-mobile-image.webp',
    agencyName2: 'Outlook Traveller',
    title2: '‘Where healing meets heritage’',
    date2: 'June 26, 2025',
    img2: '/images/about/article-2-web-image.webp',
    mobileImg2: '/images/about/article-2-mobile-image.webp',
    link1: 'https://www.outlooktraveller.com/stay/hotel-review-pema-wellness-andhra-pradesh ',
    link2:
      'https://www.outlooktraveller.com/celebrating-people/a-sanctuary-of-stillness-inside-pema-wellness-where-nature-and-inner-healing-come-together',
  },

  {
    agencyName1: 'Hindustan Times',
    title1: '‘A holistic luxury destination for modern families’',
    date1: 'July 11, 2021',
    img1: '/images/about/article-3-web-image.webp',
    mobileImg1: '/images/about/article-3-mobile-image.webp',
    agencyName2: 'Curly tales',
    title2: '‘Where healing meets heritage’',
    date2: 'December 16, 2022',
    img2: '/images/about/article-4-web-image.webp',
    mobileImg2: '/images/about/article-4-mobile-image.webp',
    link2:
      'https://curlytales.com/pema-wellness-resort-in-vishakhapatnam-with-an-infinity-pool-overlooking-the-sea-can-be-your-ultimate-luxury-escape/',
    link1:
      'https://www.hindustantimes.com/lifestyle/brunch/wellness-five-holidays-for-good-health-101625973416826.html',
  },
  {
    agencyName1: 'The Hindu',
    title1: '‘To cleanse the mind and body is the real luxury these days.’',
    date1: 'December 28, 2018',
    img1: '/images/about/article-5-web-image.webp',
    mobileImg1: '/images/about/article-5-mobile-image.webp',
    agencyName2: 'South China Morning Post',
    title2: '‘Yoga, I believed, could be a lifeline.’',
    date2: 'April 28, 2019',
    img2: '/images/about/article-6-web-image.webp',
    mobileImg2: '/images/about/article-6-mobile-image.webp',
    link2:
      'https://www.scmp.com/lifestyle/health-wellness/article/3007861/pancreatic-cancer-survivor-tells-how-wellness-therapy',
    link1:
      'https://www.thehindu.com/life-and-style/luxury/detox-and-seek-solace/article25849850.ece',
  },
]

export default function ArticlesShowcase() {
  const [showAll, setShowAll] = useState(false)

  const visibleArticles = showAll ? articles : articles.slice(0, 1)

  return (
    <div className='w-full'>
      <div className='md:mt-6 px-4 flex flex-col gap-5'>
        {visibleArticles.map((item, idx) => (
          <React.Fragment key={item.date1}>
            <div key={idx} className='md:mt-6 md:px-4 flex flex-col md:flex-row gap-6 md:gap-5'>
              <div className=' w-full'>
                <div className='font-crimson md:font-ivyOra md:text-2xl text-slateGray mb-0 md:mb-3'>
                  {item.agencyName1}{' '}
                </div>
                <div className='text-base md:text-2xl text-slateGray mb-3'>
                  {item.title1} <br />
                  <span className='text-slateGray'>{item.date1}</span>
                </div>
                <div
                  onClick={() => {
                    window.open(item.link1, '_blank')
                  }}
                  className='cursor-pointer relative w-full h-[300px] md:aspect-517/670 md:max-h-[517px] md:h-full overflow-hidden '
                >
                  <ImageWithShimmer
                    src={item.img1}
                    alt={'wellbeing-banner-home'}
                    fill
                    className={`object-contain absolute top-0 left-0 hidden md:block`}
                  />
                  <ImageWithShimmer
                    src={item.mobileImg1}
                    alt={'wellbeing-banner-home'}
                    fill
                    className={`object-cover object-top absolute top-0 left-0 md:hidden block`}
                  />
                </div>
              </div>
              <div className=' w-full'>
                <div className='font-crimson md:font-ivyOra md:text-2xl text-slateGray mb-0 md:mb-3'>
                  {item.agencyName2}{' '}
                </div>
                <div className=' md:text-2xl text-slateGray mb-3'>
                  {item.title2} <br />
                  <span className='text-slateGray'>{item.date2}</span>
                </div>
                <div
                  onClick={() => {
                    window.open(item.link2, '_blank')
                  }}
                  className='cursor-pointer relative w-full h-[300px] md:aspect-517/670 md:h-[517px] overflow-hidden '
                >
                  <ImageWithShimmer
                    src={item.img2}
                    alt={'wellbeing-banner-home'}
                    fill
                    className={`object-contain absolute top-0 left-0 hidden md:block`}
                  />
                  <ImageWithShimmer
                    src={item.mobileImg2}
                    alt={'wellbeing-banner-home'}
                    fill
                    className={`object-cover object-top absolute top-0 left-0 md:hidden block`}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {
        <div
          onClick={() => setShowAll(!showAll)}
          className='font-crimson m-auto mt-9 w-fit text-pemaBlue text-base md:text-xl flex flex-row gap-2 border-b border-pemaBlue cursor-pointer'
        >
          See {!showAll ? 'more' : 'less'} {showAll ? <ChevronUp /> : <ChevronDown />}
        </div>
      }
    </div>
  )
}
