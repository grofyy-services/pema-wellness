import Image from 'next/image'
import { useEffect, useRef, useState, useMemo, type ComponentPropsWithoutRef } from 'react'

type ImageProps = ComponentPropsWithoutRef<typeof Image>

type ImageWithShimmerProps = ImageProps & {
  preload?: boolean
}

const ImageWithShimmer = ({
  src,
  alt,
  className,
  style,
  preload,
  fill,
  ...imageProps
}: ImageWithShimmerProps) => {
  const [loaded, setLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(preload ?? false)
  const imgRef = useRef<HTMLDivElement | null>(null)

  // Memoize src to prevent unnecessary re-renders
  const memoizedSrc = useMemo(() => src, [src])

  useEffect(() => {
    if (preload) {
      setIsVisible(true)
      return
    }

    // Don't create observer if already visible
    if (isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [preload, isVisible])

  // If using fill, use absolute positioning
  if (fill) {
    // Remove absolute positioning classes from className since wrapper handles it
    const positioningClasses = ['absolute', 'top-0', 'left-0', 'right-0', 'bottom-0', 'inset-0']
    const cleanClassName = className
      ?.split(/\s+/)
      .filter((cls) => !positioningClasses.includes(cls))
      .join(' ')
      .trim()

    return (
      <div className='absolute inset-0 overflow-hidden' ref={imgRef}>
        <Image
          {...imageProps}
          fill
          src={memoizedSrc}
          alt={alt}
          loading={preload ? 'eager' : 'lazy'}
          onLoad={(e) => {
            setLoaded(true)
            imageProps.onLoad?.(e)
          }}
          onError={() => {
            setLoaded(true) // Remove blur even on error
          }}
          className={`transition-all duration-700 ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-70 blur-md scale-105'
          } ${!isVisible ? 'opacity-0' : ''} ${cleanClassName ?? ''}`}
          style={style}
        />
        {!isVisible && <div className='w-full h-full bg-softSand absolute inset-0' />}
      </div>
    )
  }

  // If using width/height, use relative positioning
  return (
    <div ref={imgRef} className='relative w-full overflow-hidden'>
      <Image
        {...imageProps}
        src={memoizedSrc}
        alt={alt}
        loading={preload ? 'eager' : 'lazy'}
        onLoad={(e) => {
          setLoaded(true)
          imageProps.onLoad?.(e)
        }}
        onError={() => {
          setLoaded(true) // Remove blur even on error
        }}
        className={`transition-all duration-700 ${
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-70 blur-md scale-105'
        } ${!isVisible ? 'opacity-0' : ''} ${className ?? ''}`}
        style={style}
      />
      {!isVisible && (
        <div
          className={`bg-softSand absolute inset-0 ${className ?? ''}`}
          style={{
            width:
              typeof imageProps.width === 'number'
                ? `${imageProps.width}px`
                : imageProps.width || '100%',
            height:
              typeof imageProps.height === 'number'
                ? `${imageProps.height}px`
                : imageProps.height || 'auto',
          }}
        />
      )}
    </div>
  )
}

export default ImageWithShimmer
