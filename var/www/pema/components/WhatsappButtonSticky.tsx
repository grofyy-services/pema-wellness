'use client'
import { openWhatsApp } from '@/utils/utils'
import Image from 'next/image'
import React from 'react'

const WhatsappStickyButton = () => {
  return (
    <div className='flex flex-row justify-end fixed right-0 z-100'>
      <div
        onClick={openWhatsApp}
        className='flex  cursor-pointer flex-row justify-center fixed bottom-8 right-0 h-[58px] w-[58px] item-center bg-[#25D366]'
      >
        <Image alt='Whatsapp Icon' src='/whatsapp-icon.svg' width={34} height={34} />
      </div>
    </div>
  )
}

export default WhatsappStickyButton
