import Image from 'next/image'
import { CustomButtonGroup } from './Testimonials'
import Carousel from 'react-multi-carousel'
import Dropdown from '@/components/DropDown'
import { useEffect, useRef, useState } from 'react'
import ImageWithShimmer from '@/components/ImageWithShimmer'
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 664 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,

    slidesToSlide: 1, // optional, default to 1.
  },
}
export default function MapsSection() {
  const items = [
    {
      img: '/images/maps/mumbai-map.png',
      title: 'Mumbai to Pema',
      flightType: 'Direct flights available',
      icon: '/lotus-pointer-2.svg',
      time: '2 hr',
      city: 'Mumbai',
    },
    {
      img: '/images/maps/delhi-map.png',
      flightType: 'Direct flights available',
      title: 'Delhi to Pema',
      icon: '/lotus-pointer-3.svg',
      time: '2 hr 05 min',
      city: 'Delhi',
    },
    {
      img: '/images/maps/abu-dhabi-map.png',
      icon: '/lotus-pointer-1.svg',
      title: 'Abu Dhabi to Pema',
      flightType: 'Direct flights available',
      time: '4 hr 15 min',
      city: 'Abu Dhabi',
    },
    {
      img: '/images/maps/london-map.png',
      icon: '/lotus-pointer-3.svg',
      title: 'London to Pema',
      flightType: 'via Delhi/Mumbai or any major Indian airport to Vizag',
      time: '13 hr 50 min',
      city: 'London',
    },
    {
      img: '/images/maps/singapore-map.png',
      flightType: 'Direct flights available',
      title: 'Singapore to Pema',
      icon: '/lotus-pointer-3.svg',
      time: '4 hr 05 min',
      city: 'Singapore',
    },
    {
      img: '/images/maps/paris-map.png',
      icon: '/lotus-pointer-1.svg',
      flightType: 'via Delhi/Mumbai or any major Indian airport to Vizag',
      title: 'Paris to Pema',
      time: '14 hr 25 min',
      city: 'Paris',
    },
    {
      img: '/images/maps/munich-map.png',
      icon: '/lotus-pointer-3.svg',
      title: 'Munich to Pema',
      time: '14 hr',
      city: 'Munich',

      flightType: 'via Delhi/Mumbai or any major Indian airport to Vizag',
    },
    {
      img: '/images/maps/hyderabad-map.png',
      flightType: 'Direct flights available',
      icon: '/lotus-pointer-1.svg',
      title: 'Hyderabad to Pema',
      time: '1 hr 10 min',
      city: 'Hyderabad',
    },
    {
      img: '/images/maps/bangalore-map.png',
      flightType: 'Direct flights available',
      icon: '/lotus-pointer-3.svg',
      title: 'Bengaluru to Pema',
      time: '1 hr 40 min',
      city: 'Bengaluru',
    },
    {
      img: '/images/maps/frankfurt-map.png',
      icon: '/lotus-pointer-1.svg',
      flightType: 'via Delhi/Mumbai or any major Indian airport to Vizag',
      title: 'Frankfurt to Pema',
      city: 'Frankfurt',

      time: '13 hr 40 min',
    },
  ]

  const [selectedCity, setSelectedCity] = useState<null | string>('')
  const goFromToPemaMaps = (city: string) => {
    window.open(
      `https://www.google.com/maps/dir/${city}/Pema+Wellness+Resort,+Sagarnagar,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh+530045`
    )
  }

  const carouselRef = useRef<Carousel | null>(null)

  // 👇 Force start at first real slide after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current?.goToSlide(0, false)
    }, 0)
    return () => clearTimeout(timer)
  }, [])
  const filteredItems = items.filter((item) => item.city.includes(selectedCity!))
  return (
    <div className='w-full mx-auto'>
      <div className='flex justify-center px-4 md:max-w-sm m-auto '>
        <Dropdown
          placeholder='Select your location'
          onSelect={setSelectedCity}
          options={[
            'Abu Dhabi',
            'Bengaluru',
            'Delhi',
            'Frankfurt',
            'Hyderabad',
            'London',
            'Singapore',
            'Paris',
            'Munich',
            'Mumbai',
          ]}
          selectedValue={selectedCity ?? ''}
        />
      </div>
      <div className='mt-10 px-4'>
        {/* First row: 3 items */}
        {!selectedCity ? (
          <Carousel
            ref={carouselRef}
            responsive={responsive}
            arrows={false}
            renderButtonGroupOutside
            infinite
            // customButtonGroup={<CustomButtonGroup />}
            customButtonGroup={<CustomButtonGroup itemsCount={filteredItems.length} />}
          >
            {filteredItems.map((item, i) => (
              <div
                key={i}
                onClick={() => goFromToPemaMaps(item.city)}
                className='cursor-pointer w-full h-full flex flex-col md:px-2 pb-2 md:pb-8'
              >
                <div className='relative w-full h-[198px] mb-4'>
                  <ImageWithShimmer src={item.img} alt={item.title} fill className='object-cover' />
                </div>

                <div className='flex flex-row gap-2 pb-2 md:pb-0'>
                  <div>
                    <div className='bg-softSand p-2 w-fit text-xl text-slateGray mb-4'>
                      {item.time}
                    </div>
                    <p className='text-slateGray mb-2 text-left text-2xl font-ivyOra whitespace-break-spaces'>
                      {item.title}
                    </p>
                    <p className='text-slateGray text-left text-lg md:text-xl font-crimson whitespace-break-spaces'>
                      {item.flightType}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <>
            {filteredItems.map((item, i) => (
              <div
                key={i}
                onClick={() => goFromToPemaMaps(item.city)}
                className='cursor-pointer w-full md:w-1/2 lg:w-1/3 mx-auto h-full flex flex-col md:px-2 pb-2 md:pb-8'
              >
                <div className='relative w-full h-[198px] mb-4'>
                  <Image src={item.img} alt={item.title} fill className='object-cover' />
                </div>

                <div className='flex flex-row gap-2 pb-2 md:pb-0'>
                  <div>
                    <div className='bg-softSand p-2 w-fit text-xl text-slateGray mb-4'>
                      {item.time}
                    </div>
                    <p className='text-slateGray mb-2 text-left text-2xl font-ivyOra whitespace-break-spaces'>
                      {item.title}
                    </p>
                    <p className='text-slateGray text-left text-lg md:text-xl font-crimson whitespace-break-spaces'>
                      {item.flightType}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div
              onClick={() => setSelectedCity('')}
              className='text-center text-lg md:text-xl my-2 w-fit mx-auto text-pemaBlue border-b border-pemaBlue'
            >
              Refresh
            </div>
          </>
        )}
      </div>
    </div>
  )
}
