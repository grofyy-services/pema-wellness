'use client'
import { useState, useEffect } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'laptop'

const breakpoints = {
  mobile: 768, // <768px → mobile
  tablet: 1024, // 768px–1023px → tablet
}

export const useDeviceType = (): DeviceType => {
  const getDevice = (): DeviceType => {
    if (typeof window === 'undefined') return 'laptop' // SSR fallback

    const width = window.innerWidth
    if (width < breakpoints.mobile) return 'mobile'
    if (width < breakpoints.tablet) return 'tablet'
    return 'laptop'
  }

  const [device, setDevice] = useState<DeviceType>(getDevice())

  useEffect(() => {
    const handleResize = () => setDevice(getDevice())
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return device
}
