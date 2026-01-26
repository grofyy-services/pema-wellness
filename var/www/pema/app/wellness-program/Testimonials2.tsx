'use client'
import { MoveLeft, MoveRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 664 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,

    slidesToSlide: 1, // optional, default to 1.
  },
}
export const textTestData = [
  {
    review: `‘Overall a very nice experience would definitely recommend
to my friends and relatives.’`,
    name: 'Karina Sharma ',
    id: 3,
  },
  {
    name: 'Barinov Oleksii',
    id: 4,
    review: `‘Overall we had a great time and experience. Everyone was very helpful and kind at all times. Your staff members are doing a great job.’`,
  },
  {
    name: `Devi Prasad`,
    review: `‘Everything is perfectly planned and implemented. Salon services are excellent. Food provided is fabulous and yummy. I really appreciate the service provided by every team member to make our stay pleasant.’`,
    id: 1,
  },
  {
    name: 'Vivek and Meeta Jain',
    review: `‘Excellent stay, the food by chef Bali was super. Swimming pool is a great facility. Healers and yoga was excellent. Shubham the hotel manager and Priti from the front desk, were friendly and helpful. Dr. Murthy attended to all queries. In the healing staff Ashish, Rajat, Sarina and Monica were very good. All restaurants servers were execellent.’`,
    id: 2,
  },
]
