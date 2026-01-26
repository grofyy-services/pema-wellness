import { inquireAboutGifting, ROUTES, zohoForms } from '@/utils/utils'
import { Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const goToPemaMaps = () => {
    window.open(
      'https://www.google.com/maps/dir//Pema+Wellness+Resort,+Sagarnagar,+Rushikonda,+Visakhapatnam,+Andhra+Pradesh+530045'
    )
  }

  const goToInstagram = () => {
    const url = 'https://www.instagram.com/pemawellnessretreat'
    window.open(url)
  }

  const goToFB = () => {
    const url = 'https://www.facebook.com/pemawellnessresort/'
    window.open(url)
  }

  const goToPR = () => {
    const url = 'https://in.pinterest.com/pemawellnessretreat/'
    window.open(url)
  }

  return (
    <footer className=' bg-pemaBlue mt-20'>
      <div className='bg-pemaBlue text-softSand text-xl font-crimson max-w-[1360px] m-auto p-4 md:pt-10 md:pb-5'>
        <div className='max-w-7xl mx-auto pt-12 md:pb-12 pb-0 md:flex flex-row justify-between grid grid-cols-1 lg:grid-cols-[35%_40%_25%] gap-4'>
          {/* Logo and location */}
          <div className='mb-4'>
            <div className='flex items-center'>
              <Image
                src='/pema-logo-white.svg'
                height={8}
                width={100}
                alt='Pema Wellness'
                className='h-9 aspect-auto'
              />
            </div>

            <div className='hidden md:flex flex-row my-4 items-center gap-2'>
              <Image
                onClick={goToInstagram}
                src={'/instagram-icon.svg'}
                alt='Instagram'
                className='cursor-pointer h-6 w-6'
                height={24}
                width={24}
              />

              <Image
                onClick={goToFB}
                src={'/facebook-icon.svg'}
                alt='Instagram'
                className='cursor-pointer h-6 w-6'
                height={24}
                width={24}
              />
              <Image
                onClick={goToPR}
                src={'/pinterst.svg'}
                alt='pinterest'
                className='cursor-pointer h-8 w-8'
                height={24}
                width={24}
              />
            </div>
            <p className='text-lg mt-4 mb-2'>{`Continuing Dr. S.N. Murthy's Legacy`}</p>

            <div
              onClick={goToPemaMaps}
              className='text-lg cursor-pointer flex felx-row items-center gap-1'
            >
              <Image
                src={'/softsand-pin-icon.svg'}
                alt='Instagram'
                className='h-5 w-5'
                height={24}
                width={24}
              />
              <p className='border-b-2 border-softSand'>{`Healing Hills, Visakhapatnam, India`}</p>
            </div>
          </div>
          <div className='w-fit md:hidden block'>
            <h3 className='mb-4 '>Reach out to us at</h3>
            <div className='flex felx-row items-center gap-2'>
              <Mail className='h-5 w-5' />
              <a href='mailto:enquiry@pemawellness.com' className=''>
                enquiry@pemawellness.com
              </a>{' '}
            </div>

            <div className='flex felx-row items-center gap-2'>
              <Image
                src={'/phone-icon.svg'}
                alt='phone'
                className='h-5 w-5'
                height={20}
                width={20}
              />
              <a href='tel:+919577709494' className=''>
                +91 95777 09494
              </a>{' '}
            </div>

            <div className='flex felx-row text-base items-center gap-2 mt-5 border border-softSand p-2 w-fit'>
              <a href='https://zfrmz.in/lTuQko2CTsis6AS0x6Gt' target='_blank' className=''>
                Fill Medical Application form
              </a>
            </div>
          </div>
          <div className='grid grid-cols-[50%_50%] md:gap-12 text-lg'>
            {/* Column 2 */}
            <div className='text-lg md:text-xl w-fit'>
              <h3 className='mb-4 cursor-pointer text-xl md:font-crimson font-ivyOra'>
                Team excellence
              </h3>
              <ul className=''>
                <li>
                  <Link href={'/our-approach'} className='hover:underline cursor-pointer mb-1'>
                    Our approach
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${ROUTES.ourApproach}#experts`}
                    className='hover:underline cursor-pointer mb-1'
                  >
                    Meet our doctors
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.successStories}
                    className='hover:underline cursor-pointer mb-1'
                  >
                    Success stories
                  </Link>
                </li>
                <li>
                  <Link href={'/plan-your-visit'} className='hover:underline cursor-pointer mb-1'>
                    Plan your visit
                  </Link>
                </li>
                <li>
                  <Link href={'/resources'} className='hover:underline cursor-pointer mb-1'>
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href={'/contact-us'} className='hover:underline cursor-pointer mb-1'>
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.privacyPolicy} className='hover:underline cursor-pointer mb-1'>
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className='text-lg md:text-xl w-fit'>
              <h3 className='mb-4 cursor-pointer text-xl md:font-crimson font-ivyOra'>
                Your journey
              </h3>
              <ul className=''>
                <li>
                  <Link href={'/wellness-program'} className='hover:underline cursor-pointer mb-1'>
                    Wellness journey
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/medical-health-program'}
                    className='hover:underline cursor-pointer mb-1'
                  >
                    Medical programs
                  </Link>
                </li>
                <li>
                  <Link href={'/pema-lite'} className='hover:underline cursor-pointer mb-1'>
                    Pema lite
                  </Link>
                </li>
                <li>
                  <Link href={'/the-sanctuary'} className='hover:underline cursor-pointer mb-1'>
                    The sanctuary
                  </Link>
                </li>
                <li>
                  <Link
                    href={zohoForms.giftInquiry}
                    className='hover:underline cursor-pointer mb-1'
                  >
                    Gift Pema
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='md:hidden flex flex-row  my-4 items-center gap-2'>
            <Image
              onClick={goToInstagram}
              src={'/instagram-icon.svg'}
              alt='Instagram'
              className='h-6 w-6'
              height={24}
              width={24}
            />

            <Image
              onClick={goToFB}
              src={'/facebook-icon.svg'}
              alt='Instagram'
              className='h-6 w-6'
              height={24}
              width={24}
            />
            <Image
              onClick={goToPR}
              src={'/pinterst.svg'}
              alt='pinterest'
              className='cursor-pointer h-8 w-8'
              height={24}
              width={24}
            />
          </div>
          {/* Contact */}
          <div className='w-fit hidden md:block'>
            <h3 className='mb-4 '>Reach out to us at</h3>
            <div className='flex felx-row items-center gap-2'>
              <Mail className='h-5 w-5' />
              <a
                href='mailto:enquiry@pemawellness.com'
                className='hover:border-b-softSand border-b border-transparent'
              >
                enquiry@pemawellness.com
              </a>
            </div>

            <div className='flex felx-row items-center gap-2'>
              <Image
                src={'/phone-icon.svg'}
                alt='Instagram'
                className='h-5 w-5'
                height={20}
                width={20}
              />
              <a
                href='tel:+919577709494'
                className='hover:border-b-softSand border-b border-transparent'
              >
                +91 95777 09494
              </a>
            </div>

            <div className='flex felx-row transition-all duration-200 hover:bg-softSand hover:text-pemaBlue items-center gap-2 mt-5 border border-softSand p-2 w-fit'>
              <a href='https://zfrmz.in/lTuQko2CTsis6AS0x6Gt' target='_blank' className=''>
                Fill Medical Application form
              </a>
            </div>
          </div>
        </div>
        {/* Bottom line */}
        <div className='border-t border-softSand/30 mt-8'>
          <p className='text-center pt-3 text-base md:text-xl'>
            Built on proven naturopathic foundations, delivered through modern excellence
          </p>
        </div>{' '}
      </div>
    </footer>
  )
}
