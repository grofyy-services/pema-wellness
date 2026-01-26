import React from 'react'

interface ModalProps {
  isOpen: boolean
  children: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, className, children }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-[600] overflow-hidden' aria-hidden='true'>
      <div className='absolute inset-0 bg-black opacity-80'></div>
      <div className='absolute inset-0 flex justify-center items-center overflow-hidden'>
        <div
          className={`${className} w-full max-w-lg rounded-t-2xl shadow-lg p-8 bg-white`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
