'use client'
import { PemaInstance } from '@/api/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { Suspense, useEffect } from 'react'

const ConfirmationScreen = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    const txnid = searchParams.get('txnid')
    const status = searchParams.get('status')
    const checkAvailability = async () => {
      try {
        const res = await PemaInstance.get(`/bookings/${txnid}`)
        if (res.data) {
          enqueueSnackbar('Payment Completed', {
            variant: 'success',
          })
        }
      } catch (error: unknown) {
        console.error(error)
        enqueueSnackbar('Something went wrong! Please try again!', {
          variant: 'error',
        })
      }
    }
    if (status && txnid) {
      if (status === 'success')
        enqueueSnackbar('Booking successful!', {
          variant: 'success',
        })
      else
        enqueueSnackbar('payment failed! Please try again!', {
          variant: 'error',
        })
    } else {
      router.push('/')
    }
  }, [searchParams])
  return (
    <div className=' max-w-[1360px] m-auto py-6 h-dvh '>
      <div className='px-4 text-base md:text-xl text-slateGray font-crimson text-center mb-2 mt-9'>
        Booking Status: {searchParams.get('status')}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationScreen />
    </Suspense>
  )
}
