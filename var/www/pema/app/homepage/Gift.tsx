'use client'
import PrimaryButton from '@/components/PrimaryButton'
import { inquireAboutGifting, zohoForms } from '@/utils/utils'
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function GiftSection() {
  const router = useRouter()
  return (
    <div className='relative flex  items-center justify-center h-[540px] md:h-[670px] w-full '>
      <Image
        src={'/images/home/gift-section-bg-home.webp'}
        alt={'/testimonials-bg-image.webp'}
        fill
        className={`object-cover absolute top-0 left-0 `}
      />
      <div
        className=' mx-0 md:mx-4 px-4 py-11 md:py-[70px] text-center absolute 
      md:h-[86%] md:top-[7%]
      h-[80%] top-[10%]

       w-[460px] md:max-w-full max-w-[90%] flex flex-row justify-center'
      >
        <Image
          alt={'/images/home/gift-bg-softsand.png'}
          fill
          className={`object-cover absolute top-0 left-0 `}
          src={'/images/home/gift-bg-softsand.png'}
        />
        <Image
          width={200}
          height={100}
          alt=''
          className='aspect-auto absolute z-2 w-[200px] top-[-51px] right-[-14px]'
          src={'/images/home/gift-ribbon.png'}
        />
        <div className='relative z-11'>
          <Image
            alt=''
            className='aspect-auto w-[77px] h-[58px] m-auto'
            width={77}
            height={58}
            src={'/images/home/gift-icon.svg'}
          />
          <div className='hidden md:block text-2xl md:text-[40px] text-pemaBlue font-ivyOra text-center mb-2'>
            Some gifts are opened. <br /> Pema is felt.{' '}
          </div>{' '}
          <div className='block md:hidden text-2xl md:text-[40px] text-pemaBlue font-ivyOra text-center mb-2'>
            Some gifts are opened. <br /> <span className='italic'>Pema is felt. </span>
          </div>{' '}
          <div className='text-lg md:text-xl text-slateGray leading-[110%] md:leading-normal font-crimson text-center mt-4 mb-10  w-full m-auto'>
            {`It isn’t just rest, it’s renewal, at the root. Give them space to breathe, reset, and
            return home to themselves.`}{' '}
          </div>
          <PrimaryButton
            onClick={() => router.push('#contact-us')}
            className='max-h-[42px] md:max-h-fit md:w-fit m-auto flex justify-center items-center w-full text-base'
          >
            Gift the universe of you
          </PrimaryButton>
          <div
            onClick={() => router.push(zohoForms.giftInquiry)}
            className='cursor-pointer mt-4 md:mt-8 font-crimson text-lg md:text-xl text-pemaBlue flex flex-row items-center justify-center gap-2 border-b border-pemaBlue w-fit m-auto'
          >
            Inquire about the gifting experience <MoveRight />
          </div>
        </div>
      </div>
    </div>
  )
}
