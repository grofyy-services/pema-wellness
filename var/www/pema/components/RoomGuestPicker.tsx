import React from 'react'
import PrimaryButton from './PrimaryButton'

interface RoomGuestPickerProps {
  rooms: number
  adults: number
  childrens: number
  onChange: (type: 'rooms' | 'adults' | 'children', value: number) => void
  onClose: () => void
}

export default function RoomGuestPicker({
  rooms,
  adults,
  onChange,
  onClose,
}: RoomGuestPickerProps) {
  const handleDecrease = (type: 'rooms' | 'adults' | 'children', value: number) => {
    if (type === 'children' && value > 0) {
      onChange(type, value - 1)
    }
    if (value > 1) {
      onChange(type, value - 1)
      if (type === 'rooms') {
        const maxGuests = (value - 1) * 2
        if (adults > maxGuests) {
          onChange('adults', maxGuests)
          onChange('children', maxGuests)
        }
      }
    }
  }

  const handleIncrease = (type: 'rooms' | 'adults' | 'children', value: number) => {
    if (type === 'rooms') {
      if (value < 7) {
        onChange(type, value + 1)
      }
    } else if (type === 'adults') {
      const maxGuests = rooms * 2
      if (value < maxGuests) onChange(type, value + 1)
    } else if (type === 'children') {
      const maxGuests = rooms * 2
      if (value < maxGuests) onChange(type, value + 1)
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-5000'>
      <div className='bg-white w-full max-w-md shadow-lg p-10 text-pemaBlue mx-4 max-h-[80%] overflow-scroll '>
        <h2 className='text-xl font-ivyOra mb-6'>Maximum 2 adults per room</h2>

        <div className='space-y-6 '>
          {/* Rooms */}
          <div className='flex justify-between items-center border-b border-[#3233334D] py-4'>
            <div>
              <div className='text-lg'>Rooms</div>
              {/* <div className='text-sm text-gray-500'>(Max: 3 Rooms/person)</div> */}
            </div>
            <div className='flex items-center border justify-around border-pemaBlue w-[92px]'>
              <button
                className='cursor-pointer py-1 text-lg'
                onClick={() => handleDecrease('rooms', rooms)}
              >
                -
              </button>
              <span className='text-base'>{rooms}</span>
              <button
                className='cursor-pointer py-1 text-lg'
                // onClick={() => handleIncrease('rooms', rooms)}
              >
                +
              </button>
            </div>
          </div>

          {/* children */}
          <div className='flex justify-between items-center border-b border-[#3233334D] py-4'>
            <div>
              <div className='text-lg'>Adults</div>
              <div className='text-sm text-gray-500'>(Max: {rooms * 2} Total adults)</div>
              <div className='text-sm text-gray-500'>Travelling with children?</div>{' '}
              <div className='text-sm text-gray-500'>Fill the enquiry form in the next screen.</div>
            </div>
            <div className='flex items-center justify-around border border-pemaBlue w-[92px]'>
              <button
                className='cursor-pointer py-1 text-lg'
                onClick={() => handleDecrease('adults', adults)}
              >
                -
              </button>
              <span>{adults}</span>
              <button
                className='cursor-pointer py-1 text-lg'
                onClick={() => handleIncrease('adults', adults)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <PrimaryButton onClick={onClose} className='w-full mt-11'>
          Done
        </PrimaryButton>
      </div>
    </div>
  )
}
