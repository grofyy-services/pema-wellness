import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
  options: string[]
  placeholder?: string
  onSelect?: (value: string | null) => void
  light?: boolean
  selectedValue?: string
  className?: string
  isSmall?: boolean
}

export default function Dropdown({
  options,
  placeholder = 'Select an option',
  onSelect,
  selectedValue,
  className,
  isSmall,
  light,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState(selectedValue || '')

  const handleSelect = (option: string) => {
    setSelected(option)
    setIsOpen(false)
    if (onSelect) onSelect(option)
  }

  useEffect(() => {
    setSelected(selectedValue!)
  }, [selectedValue])

  return (
    <div className={`relative w-full font-crimson ${className}`}>
      {/* Dropdown Button */}
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className={` cursor-pointer flex w-full items-center justify-between py-[0.5px] text-left text-lg ${light ? ' text-slateGray bg-white border border-[#32333366]' : ' text-softSand bg-pemaBlue'} `}
      >
        <div
          className={`${isSmall ? 'py-2 px-2 ' : 'py-4 px-6  '} text-lg flex w-full items-center justify-between  text-left border-b-1 border-softSand`}
        >
          <span>{selected || placeholder}</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul className='absolute z-10 mt-1 w-full overflow-auto max-h-[300px] rounded-md bg-white shadow-lg transition-all duration-200'>
          {/* Placeholder item (reset selection) */}
          <li
            onClick={() => handleSelect('')}
            className={`cursor-pointer px-6 py-3 ${light ? 'text-slateGray' : 'text-pemaBlue'} hover:bg-teal-100 border-b-1 border-[#32333333]`}
          >
            {placeholder}
          </li>

          {/* Actual options */}
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer px-6 py-3 ${light ? 'text-slateGray' : 'text-[#32333333]'} hover:bg-teal-100 border-b-1 border-[#32333333]`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
