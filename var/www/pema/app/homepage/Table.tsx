import React from 'react'
import { Check, X } from 'lucide-react'

export default function ComparisonTable() {
  const rows = [
    {
      label: 'Clinical proof',
      pema: 'Evidence-backed naturopathy',
      hospitals: 'High diagnostics & emergency care',
      spa: 'Focus on pampering. Not outcomes',
      ayurveda: 'Rooted in tradition',
    },
    {
      label: 'Holistic healing',
      pema: 'Integrates yoga, nutrition, therapies',
      hospitals: 'Symptom-first approach',
      spa: 'Massages, wellness rituals',
      ayurveda: 'Herbal and detox-based',
    },
    {
      label: 'Customisation',
      pema: 'Tracks for solo, couples, families',
      hospitals: 'One-size-fits-all',
      spa: 'Generic offerings',
      ayurveda: 'Less flexible for modern guests',
    },
    {
      label: 'Cultural warmth',
      pema: 'Rooted in Indian hospitality',
      hospitals: 'Institutional tone',
      spa: 'Ambience-led warmth',
      ayurveda: 'Deeply Indian',
    },
    {
      label: 'Cost transparency',
      pema: 'All-inclusive transparent pricing',
      hospitals: 'Hidden & unpredictable',
      spa: 'Priced for ambience, not impact',
      ayurveda: 'Varies by practitioner',
    },
  ]

  return (
    <div className='overflow-x-auto font-crimson text-slateGray text-xl'>
      <div className='grid grid-cols-5 border border-[#32333310]'>
        {/* header */}
        <div className='bg-white'></div>
        <div className='bg-pemaBlue text-2xl text-softSand text-center py-4 font-ivyOra'>Pema</div>
        <div className='text-center text-2xl py-4 font-ivyOra'>Hospitals</div>
        <div className='text-center text-2xl py-4 font-ivyOra'>Spa retreats</div>
        <div className='text-center text-2xl py-4 font-ivyOra'>Ayurveda centers</div>

        {rows.map((r, i) => (
          <React.Fragment key={i}>
            {/* feature label */}
            <div className='border-t border-[#3233331A] px-4 py-6 text-gray-700 flex items-center'>
              {r.label}
            </div>

            {/* Pema column */}
            <div className='border-t border-[#3233331A] bg-pemaBlue text-softSand px-4 py-6'>
              <div className='flex flex-col gap-2 items-center'>
                <Check size={28} className='text-softSand' />
                <span className='text-center'>{r.pema}</span>
              </div>
            </div>

            {/* Hospitals */}
            <div className='border-t border-[#3233331A] px-4 py-6'>
              <div className='flex flex-col gap-2 items-center'>
                {i === 0 || i === 4 ? (
                  <Check size={28} className='text-[#CEA17A]' />
                ) : (
                  <X size={28} className='text-slateGray' />
                )}
                <span className='text-center'>{r.hospitals}</span>
              </div>
            </div>

            {/* Spa */}
            <div className='border-t border-[#3233331A] px-4 py-6'>
              <div className='flex flex-col gap-2 items-center'>
                {i === 1 || i === 3 ? (
                  <Check size={28} className='text-[#CEA17A]' />
                ) : (
                  <X size={28} className='text-slateGray' />
                )}
                <span className='text-center'>{r.spa}</span>
              </div>
            </div>

            {/* Ayurveda */}
            <div className='border-t border-[#3233331A] px-4 py-6'>
              <div className='flex flex-col gap-2 items-center'>
                {i === 0 || i === 1 || i === 3 ? (
                  <Check size={28} className='text-[#CEA17A]' />
                ) : (
                  <X size={28} className='text-slateGray' />
                )}

                <span className='text-center'>{r.ayurveda}</span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
