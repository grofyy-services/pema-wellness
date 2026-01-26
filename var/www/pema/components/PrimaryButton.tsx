import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?:boolean
}

const PrimaryButton: React.FC<ButtonProps> = ({ children, onClick, className = '' ,disabled=false}) => {
  return (
    <button
    disabled={disabled}
      onClick={onClick}
      className={`text-base md:text-xl cursor-pointer h-fit text-softSand px-8 py-4 bg-pemaBlue transition-colors duration-200 hover:bg-pemaBlue/80 active:scale-95 ${className}`}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
