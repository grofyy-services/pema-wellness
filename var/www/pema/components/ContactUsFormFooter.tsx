import { usePathname } from 'next/navigation'
import Script from 'next/script'

const ContactUsFormFooter = () => {
  const pathName = usePathname()
  const isContactUsScreen = pathName.includes('contact-us')
  return (
    <div
      id='contact-us'
      className='bg-softSand md:bg-white max-w-[1360px] m-auto pt-9 scroll-m-20 md:pt-12'
    >
      <Script src='https://forms.zohopublic.com/js/iframeResizer.js' strategy='lazyOnload' />
      <div
        className={`flex flex-col ${isContactUsScreen ? 'flex max-w-[900px] m-auto' : ''}  px-4`}
      >
        {isContactUsScreen ? (
          <div className='text-[28px] mb-7 md:text-[40px] text-slateGray text-center font-ivyOra'>
            Share your details and our team will be in touch.
          </div>
        ) : (
          <div>
            <div className='md:block hidden text-[28px] text-center md:text-[40px] text-pemaBlue font-ivyOra'>
              Prefer to talk it through?
            </div>

            <div className='text-[28px] md:hidden block text-center md:text-[40px] text-pemaBlue font-ivyOra'>
              Prefer to <span className='italic'>talk it through?</span>
            </div>
            <div className='text-base text-center md:text-xl text-slateGray mt-2 mb-3 md:mb-6 leading-[110%] md:leading-normal'>
              No question is too small. No need is minor. <br /> If it&apos;s on your mind,
              we&apos;re here to help you out.
            </div>
          </div>
        )}
      </div>
      <iframe
        src='https://forms.zohopublic.in/pemawellness5391/form/Contact/formperma/Jv2eG5Z0ESRYBKCgIsi8MB_PsWuJ9fRzmRuj7TMNJv4'
        className='min-h-[900px] h-max w-full'
        loading='lazy'
      />
    </div>
  )
}

export default ContactUsFormFooter
