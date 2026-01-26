import { useEffect, RefObject } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'

export function useSwiperAutoplayOnView(
  containerRef: RefObject<HTMLDivElement | null>,
  swiperRef: RefObject<SwiperInstance | null>
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const swiper = swiperRef.current
        if (!swiper) return

        if (entry.isIntersecting && entry.intersectionRatio === 1) {
          swiper.autoplay.start()
        } else {
          swiper.autoplay.stop()
        }
      },
      { threshold: 1.0 }
    )

    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [containerRef, swiperRef])
}
