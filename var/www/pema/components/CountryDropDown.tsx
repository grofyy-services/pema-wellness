'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'
import { usePathname } from 'next/navigation'
import { useAtom } from 'jotai'
import { selectedCurrencyAtom, type CurrencyCode } from '@/lib/atoms'

interface DropdownProps {
  onSelect?: (value: string) => void
  selectedValue?: string
  className?: string
}

const currencies = [
  { code: 'IN', label: 'INR (₹)' },
  { code: 'US', label: 'USD ($)' },
  { code: 'AE', label: 'AED (د.إ)' },
  { code: 'SG', label: 'SGD (S$)' },
  { code: 'GB', label: 'GBP (£)' },
  { code: 'EU', label: 'EUR (€)' },
  { code: 'RU', label: 'RUB (₽)' },
]

export default function CountryDropdown({
  onSelect,
  selectedValue,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Use atom as single source of truth
  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom)

  // Initialize with prop value if provided (for external control)
  useEffect(() => {
    if (selectedValue && selectedValue !== selectedCurrency) {
      setSelectedCurrency(selectedValue as CurrencyCode)
    }
  }, [selectedValue, selectedCurrency, setSelectedCurrency])

  // Debug: Log when selectedCurrency changes
  useEffect(() => {}, [selectedCurrency])

  const handleSelect = (code: string) => {
    setSelectedCurrency(code as CurrencyCode)
    setIsOpen(false)
    onSelect?.(code)
  }

  const selectedLabel = useMemo(() => {
    return currencies.find((o) => o.code === selectedCurrency)?.label || selectedCurrency
  }, [currencies, selectedCurrency])
  const pathName = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathName])
  // 📌 Click outside to close
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative text-base w-fit ${className}`}>
      {/* Button */}
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='flex w-fit items-center justify-between px-2 h-[38px] bg-transparent border border-inherit'
      >
        <div className='flex items-center gap-2'>
          <ReactCountryFlag
            countryCode={selectedCurrency}
            svg
            className='rounded-full'
            style={{ width: '18px', height: '18px', objectFit: 'cover' }}
          />
          <span className='whitespace-nowrap text-base'>{selectedLabel}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className='absolute z-10 mt-1 w-full max-h-[400px] overflow-auto rounded-md bg-white shadow-lg'>
          {currencies.map((option) => (
            <li
              key={option.code}
              onClick={() => handleSelect(option.code)}
              className='flex whitespace-nowrap items-center gap-2 px-4 py-3 text-pemaBlue cursor-pointer hover:bg-teal-100 border-b border-gray-200'
            >
              <ReactCountryFlag
                countryCode={option.code}
                svg
                className='rounded-full'
                style={{ width: '20px', height: '20px', objectFit: 'cover' }}
              />
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
