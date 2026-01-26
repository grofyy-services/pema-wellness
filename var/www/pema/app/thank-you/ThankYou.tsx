'use client'
import PrimaryButton from '@/components/PrimaryButton'
import { navigateTo, ROUTES } from '@/utils/utils'
import { MoveRight } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'

const ThankYou = () => {
  return (
    <>
      <Script id='meta-track' strategy='afterInteractive'>
        {`
fbq('track', 'Lead');
`}
      </Script>
      <div className='w-full m-auto h-dvh'>
        <div className='mt-20 max-w-5xl mx-auto px-4'>
          <h2 className='text-center text-xl md:text-2xl'>
            Thank you for reaching out. <br />
            Your message has been received, and our team will connect with you soon.
          </h2>
          <br />
          <h2 className='text-center text-xl md:text-2xl'>
            At Pema, every conversation begins with listening, to your story, your goals, and the
            healing you seek. <br /> Our wellness concierge will be in touch within 24 hours to
            guide you toward the experience that best serves your needs.
          </h2>
          <br />
          <h2 className='text-center text-xl md:text-2xl'>
            Until then, take a slow breath. You’ve already begun your journey.
          </h2>
          <div className='mx-auto flex flex-col w-fit justify-center mt-6'>
            {/* <PrimaryButton disabled={false}>
            <Link href={'/#programs'}>Explore Our Programs </Link>
          </PrimaryButton> */}
            <Link
              href={'/'}
              className='font-crimson mt-3 w-fit text-pemaBlue text-base md:text-xl flex flex-row justify-center mx-auto gap-2 border-b border-pemaBlue'
            >
              Return to Homepage <MoveRight />
            </Link>{' '}
          </div>
        </div>
      </div>
    </>
  )
}

export default ThankYou
