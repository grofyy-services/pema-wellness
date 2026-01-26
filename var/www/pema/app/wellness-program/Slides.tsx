'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { slidesData } from './SlideData'
import Image from 'next/image'
import { ArrowUp, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageWithShimmer from '@/components/ImageWithShimmer'

function Tabs() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const router = useRouter()
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleTabClick = (index: number, id: string) => {
    setActiveIndex(index)
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    router.push(`#${id}`)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((ref) => ref?.id === entry.target.id)
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      },
      {
        threshold: 0.25, // trigger earlier
      }
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className='w-full mx-auto relative'>
      {/* Tab Navigation */}
      <nav
        className='md:sticky md:top-[78px] bg-white z-11 flex md:flex-row flex-col gap-3 md:gap-0 justify-center md:p-4 select-none'
        role='tablist'
        aria-label='Swiper tabs'
      >
        {slidesData.map((item, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={item.id}
              role='tab'
              aria-selected={isActive}
              onClick={() => handleTabClick(i, item.hashId!)}
              className={`px-7 py-2 border cursor-pointer border-[#323333] md:border-0 md:border-b text-base md:text-xl text-pemaBlue focus:outline-none transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-pemaBlue md:bg-white md:text-pemaBlue text-softSand border-pemaBlue'
                  : 'md:border-[#32333333] text-slateGray'
              }`}
            >
              {item.tab}
            </button>
          )
        })}
      </nav>

      {/* Mobile active tab */}
      <div className='text-lg md:hidden block font-ivyOra text-slateGray mt-6'>
        {activeIndex + 1}. {slidesData[activeIndex].tab}
      </div>

      {/* Sections */}
      <div className='mt-3 md:mt-0 relative flex flex-col gap-6 md:gap-10'>
        {slidesData.map((item, i) => (
          <div
            key={item.id} // 🔑 important
            id={item.hashId}
            ref={(el: HTMLDivElement | null) => {
              sectionRefs.current[i] = el
            }}
            className='md:grid flex flex-col gap-3 md:gap-0 grid-cols-[66%_33%] md:scroll-m-40'
          >
            <div className='h-fit'>
              <ImageWithShimmer
                width={900}
                height={787}
                src={item.imgWebURL}
                alt={item.tab}
                className='h-[350px] md:h-[787px] w-full'
              />
            </div>
            <div className='h-fit md:pl-5'>
              <div>
                <div className='text-base hidden md:block md:text-[24px] text-slateGray font-crimson md:font-ivyOra mb-6'>
                  {item.id}. {item.tab}
                </div>
                {item.pointers.map((pointer) => (
                  <div
                    id={pointer.hashId}
                    key={pointer.id}
                    className='mb-3 scroll-mt-[140px] md:scroll-mt-40'
                  >
                    <div className='flex flex-row items-center gap-2'>
                      <Image
                        src={`/lotus-pointer-${pointer.id}.svg`}
                        alt={pointer.title}
                        width={31}
                        height={24}
                      />
                      <div>
                        <Link
                          href={pointer.path}
                          className='font-crimson items-center w-fit text-pemaBlue text-base md:text-xl flex flex-row gap-2 border-b border-pemaBlue'
                        >
                          {pointer.title} <MoveRight />
                        </Link>
                      </div>
                    </div>
                    <div className='text-base md:text-xl text-slateGray mt-0 md:mt-2 pl-10'>
                      {pointer.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className='mt-4 pt-2 md:hidden block sticky bottom-0 bg-white'>
          <div
            onClick={() => router.push('#wellness-programs')}
            className='rounded-full border border-slateGray flex justify-center items-center w-10 h-10 mx-auto'
          >
            <ArrowUp />
          </div>
          <div className='text-center text-slateGray text-base pt-2'>Go back to program menu</div>
        </div>
      </div>
    </section>
  )
}

export default function SwiperTabs() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs />
    </Suspense>
  )
}
