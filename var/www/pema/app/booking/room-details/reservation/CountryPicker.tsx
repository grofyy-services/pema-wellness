import { useEffect, useMemo, useRef, useState } from 'react'
import countryList from 'react-select-country-list'

type CountryPickerProps = {
  value: string | null
  onChange: (option: { label: string; value: string }) => void
}

export default function CountryPicker({ value, onChange }: CountryPickerProps) {
  const options = useMemo(() => countryList().getData(), [])
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Add priority countries, then rest in alphabetical order
  const priorityCountries = [
    { label: 'India', value: 'IN' },
    { label: 'United States', value: 'US' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'Singapore', value: 'SG' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Russia', value: 'RU' },
  ]

  // Remove duplicates and sort remaining countries
  const isPriority = new Set(priorityCountries.map((c) => c.value))
  const remainingOptions = options
    .filter((option) => !isPriority.has(option.value))
    .sort((a, b) => a.label.localeCompare(b.label))

  // Merge with priority at start
  const orderedOptions = [...priorityCountries, ...remainingOptions]

  const filteredOptions = orderedOptions.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [options])

  function handleSelect(label: { label: string; value: string }) {
    onChange(label)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <button
        type='button'
        className='border border-[#32333366] h-[62px] text-xl px-3 py-2 w-full text-left flex justify-between items-center gap-2'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{value || 'Select country*'}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M5 7.5l5 5 5-5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-10 mt-1 w-full border rounded bg-white shadow-lg'>
          <div className='p-2 border-b'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search country'
              className='border rounded px-3 py-2 w-full'
              autoFocus
            />
          </div>
          <ul className='max-h-56 overflow-y-auto'>
            {filteredOptions.length === 0 && (
              <li className='px-3 py-2 text-sm text-gray-500'>No matches</li>
            )}
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type='button'
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    value === option.label ? 'bg-gray-50 font-medium' : ''
                  }`}
                  onClick={() => {
                    handleSelect(option)
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
