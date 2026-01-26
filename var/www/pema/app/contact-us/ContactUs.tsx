'use client'
import Breadcrumbs from '@/components/BreadCrumbs'
import PrimaryButton from '@/components/PrimaryButton'
import { Check, Mail, MapPin, MoveRight, Phone } from 'lucide-react'
import Image from 'next/image'
import TestimonialCard from '../homepage/Testimonials'
import Link from 'next/link'
import WhatsappStickyButton from '@/components/WhatsappButtonSticky'
import { openWhatsApp } from '@/utils/utils'
import ImageWithShimmer from '@/components/ImageWithShimmer'
const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Contact us' }, // current page (no href)
]
export default function Contact() {
  const goToPemaMaps = () => {
    window.open(
      'https://www.google.com/maps/dir//Pema+Wellness+Resort,+Sagarnagar,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh+530045'
    )
  }

  return (
    <div className=' max-w-[1360px] m-auto py-6 '>
      <div className='md:px-4'>
        <Breadcrumbs items={crumbs} separator={' / '} className='px-4' />
      </div>

      {/* two journey */}
      <div className=' mt-4 md:mb-6 text-[28px] text-left md:text-center  md:text-[40px] text-slateGray font-ivyOra px-4'>
        Contact
      </div>

      <div className='flex flex-col-reverse px-4 lg:grid grid-cols-[65%_35%] grid-rows-1 mt-6'>
        <div className='relative w-full h-[350px] md:h-[700px] overflow-hidden'>
          <ImageWithShimmer
            src={'/images/contact-us-web.png'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover absolute hidden md:block top-0 left-0 `}
          />
          <ImageWithShimmer
            src={'/images/contact-us-mobile.png'}
            alt={'wellbeing-banner-home'}
            fill
            className={`object-cover md:hidden block absolute top-0 left-0 `}
          />
        </div>
        <div className='flex flex-col md:mx-8 mb-3'>
          <div className='md:mt-9'>
            <div className='text-[20px] md:text-[24px] text-slateGray font-ivyOra'>Call us </div>
            <a
              href='tel:+919577709494'
              className='cursor-pointer font-crimson mt-2 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              +919577709494{' '}
            </a>
            <div
              onClick={openWhatsApp}
              className='cursor-pointer font-crimson mt-2 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              Message us on WhatsApp <MoveRight />
            </div>{' '}
          </div>
          <div className='mt-6 md:mt-9'>
            <div className='text-[20px] md:text-[24px] text-slateGray font-ivyOra'>Email </div>
            <a
              href='mailto:enquiry@pemawellness.com'
              className='cursor-pointer font-crimson mt-2 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              enquiry@pemawellness.com{' '}
            </a>
            <a
              href='mailto:enquiry@pemawellness.com'
              className='cursor-pointer font-crimson mt-2 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              sales@pemawellness.com{' '}
            </a>{' '}
          </div>
          <div className='mt-6 md:mt-9'>
            <div className='text-[20px] md:text-[24px] text-slateGray font-ivyOra'>Address </div>
            <div
              onClick={goToPemaMaps}
              className='cursor-pointer font-crimson mt-2 w-fit text-pemaBlue text-base md:text-xl flex flex-row  gap-2 border-b border-pemaBlue'
            >
              Pema Wellness Resort, Rushikonda, Sagarnagar, Gitam Post, Visakhapatnam - 530045
              Andhra Pradesh{' '}
            </div>{' '}
          </div>
        </div>
      </div>
    </div>
  )
}
