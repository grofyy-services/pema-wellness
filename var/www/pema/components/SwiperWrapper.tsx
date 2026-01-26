'use client'
import { useSwiperAutoplayOnView } from '@/lib/useSwiperOnAutoPlay'
import { ReactNode, useRef } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'

type SwiperAutoplayWrapperProps = {
  children: (onSwiper: (s: SwiperInstance) => void) => ReactNode
}

export function SwiperAutoplayWrapper({ children }: SwiperAutoplayWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const swiperRef = useRef<SwiperInstance | null>(null)

  useSwiperAutoplayOnView(containerRef, swiperRef)

  return <div ref={containerRef}>{children((swiper) => (swiperRef.current = swiper))}</div>
}
