'use client'

import { useEffect, useState } from 'react'
import { DateRange, Range, RangeKeyDict } from 'react-date-range'
import { addDays, differenceInCalendarDays } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { useDeviceType } from '@/hooks/useDeviceType'
import PrimaryButton from './PrimaryButton'

interface DatePickerModalProps {
  isOpen: boolean
  startDate: Date
  setStartDate: (date: Date) => void
  endDate: Date
  setEndDate: (date: Date) => void
  onClose: () => void
}

export default function DatePickerModal({
  isOpen,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClose,
}: DatePickerModalProps) {
  const today = new Date()
  const device = useDeviceType()
  const maxDate = new Date('2026-08-31')
  const [range, setRange] = useState<Range[]>([
    {
      startDate,
      endDate,
      key: 'selection',
    },
  ])

  useEffect(() => {
    setRange([{ startDate, endDate, key: 'selection' }])
  }, [startDate, endDate])

  const handleSelect = (ranges: RangeKeyDict) => {
    const selected = ranges.selection
    if (!selected.startDate || !selected.endDate) return

    const start = selected.startDate
    const end = selected.endDate
    const diff = differenceInCalendarDays(end, start)

    if (diff < 3) {
      // Ensure auto-selected end date does not exceed maxDate
      const proposedEnd = addDays(start, 3)
      if (proposedEnd > maxDate) {
        // Shift selection to maintain 3-night minimum within bounds
        const adjustedStart = addDays(maxDate, -3)
        setStartDate(adjustedStart)
        setEndDate(maxDate)
        setRange([{ startDate: adjustedStart, endDate: maxDate, key: 'selection' }])
      } else {
        const newEnd = proposedEnd
        setStartDate(start)
        setEndDate(newEnd)
        setRange([{ startDate: start, endDate: newEnd, key: 'selection' }])
      }
    } else {
      setStartDate(start)
      setEndDate(end)
      setRange([selected])
    }
  }

  // 🛑 Disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-5000 flex items-center justify-center bg-black/50'>
      <div className='bg-white p-4  shadow-xl max-w-full h-max'>
        <DateRange
          startDatePlaceholder='Check in'
          endDatePlaceholder='Check out'
          ranges={range}
          showPreview
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          minDate={today}
          months={device === 'mobile' ? 1 : 2}
          direction={device === 'mobile' ? 'vertical' : 'horizontal'}
          maxDate={maxDate}
        />

        <div className='text-center'>Minimum length of stay : 3 nights</div>
        <div className='flex justify-center mt-4 gap-2'>
          <PrimaryButton onClick={onClose} className='w-[180px]'>
            Done
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
