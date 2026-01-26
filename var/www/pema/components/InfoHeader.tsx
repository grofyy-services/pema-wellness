'use client'
import { Check } from 'lucide-react'
import Marquee from 'react-fast-marquee'
export default function InfoHeader() {
  return (
    <div className='h-[38px] lg:h-13 overflow-hidden w-full bg-sunkbakedShell text-lg  text-slateGray'>
      <Marquee>
        <div
          className={`flex h-[38px] lg:h-13 flex-row items-center justify-center gap-8 whitespace-nowrap`}
        >
          <div className='flex flex-row items-center gap-1'>
            <Check />
            10,000 + Guests
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            250+ Years of Experience{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            100+ Disease Interventions{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            1,000+ Nutrition Plans{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            100+ Therapies{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            Fertility restored naturally{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            10,000 + Guests
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            250+ Years of Experience{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            100+ Disease Interventions{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            1,000+ Nutrition Plans{' '}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Check />
            100+ Therapies{' '}
          </div>
          <div className='flex flex-row items-center gap-1 mr-8'>
            <Check />
            Fertility restored naturally{' '}
          </div>
        </div>
      </Marquee>
    </div>
  )
}
