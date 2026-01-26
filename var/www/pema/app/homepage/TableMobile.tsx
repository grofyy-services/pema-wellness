'use client'

import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Check, MoveRight, X } from 'lucide-react'

const tabs = [
  { key: 'spa_retreats', label: 'Spa retreats' },
  { key: 'ayurveda_centers', label: 'Ayurveda centers' },
  { key: 'hospitals', label: 'Hospitals' },
]

export default function ComparisonTable() {
  type ComparisonKey = keyof TableData['comparisons']
  // "spa_retreats" | "ayurveda_centers" | "hospitals"

  const [activeTab, setActiveTab] = useState<ComparisonKey>('spa_retreats')

  // ✅ now works perfectly
  const sections = tableData.comparisons[activeTab].sections
  const currentTab = tableData.comparisons[activeTab].title
  const [activeSlide, setActiveSlide] = useState(0)

  const currentSection = sections[activeSlide]

  return (
    <div className='pb-4 text-slateGray '>
      {/* Tabs */}
      <div className='flex justify-center font-ivyOra pt-6'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as ComparisonKey)
              setActiveSlide(0)
            }}
            className={`pb-2 transition-colors px-4 text-base ${
              activeTab === tab.key
                ? 'border-b border-gray-800 text-slateGray'
                : ' border-b border-gray-300 text-slateGray'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className='flex justify-center mt-6 px-4'>
        <div className='grid grid-cols-[40%_10%_40%] py-3 bg-sunkbakedShell text-slateGray  text-lg w-full'>
          <div className='text-center'>Pema</div>
          <div className='text-center'>Vs</div>
          <div className='text-center'>{tabs.find((t) => t.key === activeTab)?.label}</div>
        </div>
      </div>

      {/* Swiper Slides */}
      <div className='max-w-xl mx-auto mt-2 px-4'>
        {sections.map((section, idx) => (
          <div key={section.category}>
            <h2 className='text-center text-base  text-slateGray my-2 '>{section.category}</h2>
            <div className='grid grid-cols-2 gap-4 border border-[#CEA17980] py-3 px-4 '>
              {/* Pema Column */}
              <div>
                <h3 className={` text-pemaBlue flex items-center text-lg gap-[10px]`}>
                  Pema <Check className='h-4 w-4' />
                </h3>
                <p className={`text-sm ${section.pema.highlight ? 'text-pemaBlue ' : ''}`}>
                  {section.pema.text}
                </p>
              </div>

              {/* Other Column */}
              <div>
                <h3 className={`text-lg flex items-center gap-[10px]`}>
                  {currentTab}
                  {section.other.highlight ? (
                    <Check className='h-4 w-4' />
                  ) : (
                    <X className='h-4 w-4' />
                  )}
                </h3>
                <p className='text-sm'>{section.other.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
// Define reusable subtypes
interface ComparisonItem {
  highlight: boolean
  text: string
}

interface ComparisonSection {
  category: string
  pema: ComparisonItem
  other: ComparisonItem
}

interface ComparisonCategory {
  title: string
  sections: ComparisonSection[]
}

// Define the top-level type
interface TableData {
  comparisons: {
    spa_retreats: ComparisonCategory
    ayurveda_centers: ComparisonCategory
    hospitals: ComparisonCategory
  }
}

// Use the type
const tableData: TableData = {
  comparisons: {
    spa_retreats: {
      title: 'Spa retreats',
      sections: [
        {
          category: 'Clinical proof',
          pema: {
            highlight: true,
            text: 'Evidence-backed naturopathy',
          },
          other: {
            highlight: false,
            text: 'Focus on pampering, not outcomes',
          },
        },
        {
          category: 'Holistic healing',
          pema: {
            highlight: true,
            text: 'Yoga, nutrition, therapies',
          },
          other: {
            highlight: true,
            text: 'Massages, wellness rituals',
          },
        },
        {
          category: 'Customisation',
          pema: {
            highlight: true,
            text: 'Hyper personalised journeys for you and your family',
          },
          other: {
            highlight: false,
            text: 'Generic offerings',
          },
        },
        {
          category: 'Cultural warmth',
          pema: {
            highlight: true,
            text: 'Rooted in Indian hospitality',
          },
          other: {
            highlight: true,
            text: 'Ambience-led warmth',
          },
        },
        {
          category: 'Cost transparency',
          pema: {
            highlight: true,
            text: 'All-inclusive transparent pricing',
          },
          other: {
            highlight: false,
            text: 'Priced for ambience, not impact',
          },
        },
      ],
    },
    ayurveda_centers: {
      title: 'Ayurveda centers',
      sections: [
        {
          category: 'Clinical proof',
          pema: {
            highlight: true,
            text: 'Evidence-backed naturopathy',
          },
          other: {
            highlight: true,
            text: 'Rooted in tradition',
          },
        },
        {
          category: 'Holistic healing',
          pema: {
            highlight: true,
            text: 'Yoga, nutrition, therapies',
          },
          other: {
            highlight: true,
            text: 'Herbal and detox-based',
          },
        },
        {
          category: 'Customisation',
          pema: {
            highlight: true,
            text: 'Tracks for solo, couples, families',
          },
          other: {
            highlight: false,
            text: 'Less flexible for modern guests',
          },
        },
        {
          category: 'Cultural warmth',
          pema: {
            highlight: true,
            text: 'Rooted in Indian hospitality',
          },
          other: {
            highlight: true,
            text: 'Deeply Indian',
          },
        },
        {
          category: 'Cost transparency',
          pema: {
            highlight: true,
            text: 'All-inclusive transparent pricing',
          },
          other: {
            highlight: false,
            text: 'Varies by practitioner',
          },
        },
      ],
    },
    hospitals: {
      title: 'Hospitals',

      sections: [
        {
          category: 'Clinical proof',
          pema: {
            highlight: true,
            text: 'Evidence-backed naturopathy',
          },
          other: {
            highlight: true,
            text: 'High diagnostics & emergency care',
          },
        },
        {
          category: 'Holistic healing',
          pema: {
            highlight: true,
            text: 'Yoga, nutrition, therapies',
          },
          other: {
            highlight: true,
            text: 'Symptom- first approach',
          },
        },
        {
          category: 'Customisation',
          pema: {
            highlight: true,
            text: 'Tracks for solo, couples, families',
          },
          other: {
            highlight: false,
            text: 'One-size-fits-all',
          },
        },
        {
          category: 'Cultural warmth',
          pema: {
            highlight: true,
            text: 'Rooted in Indian hospitality',
          },
          other: {
            highlight: true,
            text: 'Institutional tone',
          },
        },
        {
          category: 'Cost transparency',
          pema: {
            highlight: true,
            text: 'All-inclusive transparent pricing',
          },
          other: {
            highlight: false,
            text: 'Hidden & unpredictable',
          },
        },
      ],
    },
  },
}
