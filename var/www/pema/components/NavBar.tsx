'use client'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Menu, MoveRight, X } from 'lucide-react'
import Link from 'next/link'

export const mainNavOptions = [
  {
    title: 'Medical programs',
    subTitle: 'Medical reversal & healing',
    path: '/medical-health-program',
    subNavMenu: [
      {
        title: 'Medical programs',
        path: '/medical-health-program',
      },
      {
        title: 'Specialised health retreats',
        path: '#',
        subNavMenu: [
          {
            title: 'Cardiac health',
            path: medicalSubProgramsRoutes.cardiacHealthReset,
          },
          {
            title: 'Diabetes care',
            path: medicalSubProgramsRoutes.diabetesCare,
          },
          {
            title: 'Women’s health',
            path: medicalSubProgramsRoutes.womensHealth,
          },
          {
            title: 'Women’s fertility',
            path: medicalSubProgramsRoutes.womensFertility,
          },
          {
            title: 'Pre In vitro fertilisation',
            path: medicalSubProgramsRoutes.preInVitroFertilizationIvf,
          },
          {
            title: 'Men’s fertility',
            path: medicalSubProgramsRoutes.mensFertility,
          },
        ],
      },
      {
        title: 'Detox & cleansing',
        path: '/medical-health-program?tab=medical-programs#fertility',
        subNavMenu: [
          {
            title: 'Pema signature detox',
            path: medicalSubProgramsRoutes.pemaSignature,
          },
          {
            title: 'Gentle detox',
            path: medicalSubProgramsRoutes.gentleDetox,
          },
          {
            title: 'Breathe easy',
            path: medicalSubProgramsRoutes.breatheEasy,
          },
        ],
      },
      {
        title: 'Metabolic health',
        path: '/medical-health-program?tab=medical-programs#fertility',
        subNavMenu: [
          {
            title: 'Metabolic balance ',
            path: medicalSubProgramsRoutes.metabolicBalance,
          },
          {
            title: 'Liver vitality cleanse',
            path: medicalSubProgramsRoutes.liverVitalityCleanse,
          },
          {
            title: 'Gut biome reset',
            path: medicalSubProgramsRoutes.gutBiomeReset,
          },
        ],
      },
      {
        title: 'Stress & lifestyle management',
        path: '#',
        subNavMenu: [
          {
            title: 'Calm & clarityg',
            path: medicalSubProgramsRoutes.calmAndClarity,
          },
          {
            title: 'Deep sleep sanctuary',
            path: medicalSubProgramsRoutes.deepSleepSanctuary,
          },
        ],
      },
      {
        title: 'Pain & injury recovery',
        path: '/medical-health-program?tab=medical-programs#fertility',
        subNavMenu: [
          {
            title: `Strength and stamina reboot`,
            path: medicalSubProgramsRoutes.strengthAndStaminaReboot,
          },
          {
            title: `Sports & surgical rehabilitation`,
            path: medicalSubProgramsRoutes.sportsSurgicalRehabilitation,
          },
          {
            title: `Nerve healing haven`,
            path: medicalSubProgramsRoutes.nerveHealingHaven,
          },
          {
            title: `Pain-free living`,
            path: medicalSubProgramsRoutes.painFreeLiving,
          },
        ],
      },
    ],
  },
  {
    title: 'Wellness journey',
    subTitle: 'An exclusive sanctuary for rejuvenation',
    path: '/wellness-program',
    subNavMenu: [
      {
        title: 'Wellness programs',
        path: '/wellness-program',
      },
      {
        title: 'Experiential programs',
        path: '#',
        subNavMenu: [
          {
            title: 'Reset & relax',
            path: wellnessSubProgramsRoutes.resetRelax,
          },
          {
            title: 'Wellness celebrations',
            path: '#contact-us',
          },
        ],
      },
      {
        title: 'Detox & cleansing',
        path: '/medical-health-program?tab=medical-programs#fertility',
        subNavMenu: [
          {
            title: 'Pema signature detox',
            path: wellnessSubProgramsRoutes.pemaSignature,
          },
          {
            title: 'Gentle detox',
            path: wellnessSubProgramsRoutes.gentleDetox,
          },
          {
            title: 'Breathe easy',
            path: wellnessSubProgramsRoutes.breatheEasy,
          },
        ],
      },
      {
        title: 'Mind-body wellness',
        // path: '/medical-health-program?tab=medical-programs#fertility',
        subNavMenu: [
          {
            title: 'Strength and stamina reboot',
            path: wellnessSubProgramsRoutes.strengthAndStaminaReboot,
          },
          {
            title: 'Calm & clarity',
            path: wellnessSubProgramsRoutes.calmAndClarity,
          },
          {
            title: 'Deep sleep sanctuary',
            path: wellnessSubProgramsRoutes.deepSleepSanctuary,
          },
        ],
      },

      {
        title: 'Anti-ageing & longevity retreats',
        subNavMenu: [
          {
            title: `Age well`,
            path: wellnessSubProgramsRoutes.ageWell,
          },
          {
            title: `Hair vitality boost`,
            path: wellnessSubProgramsRoutes.hairVitalityBoost,
          },
          {
            title: `Facial skin renewal`,
            path: wellnessSubProgramsRoutes.facialSkinRenewal,
          },
        ],
      },
    ],
  },
  {
    title: 'Pema lite',
    subTitle: 'Your gentle entry into healing.',
    path: '/pema-lite',
  },
  {
    title: 'The sanctuary',
    subTitle: 'Resort/property info',
    path: '/the-sanctuary',
  },
  {
    title: 'Inside Pema',
    subTitle: 'Philosophy/methodology',
    path: '#',
    subNavMenu: [
      {
        title: 'Our approach',
        path: '/our-approach',
      },
      {
        title: 'About us',
        path: '/about-us',
      },
      {
        title: 'Resources',
        path: '/resources',
      },
      {
        title: 'Contact us',
        path: '/contact-us',
      },
    ],
  },
  {
    title: 'Success stories',
    subTitle: 'Testimonials',
    path: ROUTES.successStories,
  },
  {
    title: 'Plan your visit',
    subTitle: 'Logistics',
    path: '/plan-your-visit',
  },
  {
    title: 'Naturopathy',
    subTitle: 'We’re just a message away.',
    path: '/naturopathy',
  },
]

export const mobileNavOptions = [
  {
    title: 'Wellness journey',
    subTitle: 'An exclusive sanctuary for rejuvenation',
    path: '/wellness-program',
  },
  {
    title: 'Medical programs',
    subTitle: 'Medical reversal & healing',
    path: '/medical-health-program',
  },
  {
    title: 'Pema lite',
    subTitle: 'Your gentle entry into healing.',
    path: '/pema-lite',
  },
  {
    title: 'The sanctuary',
    subTitle: 'Resort/property info',
    path: '/the-sanctuary',
  },
  {
    title: 'Our approach',
    subTitle: 'Philosophy/methodology',
    path: '/our-approach',
  },
  {
    title: 'Success stories',
    subTitle: 'Testimonials',
    path: ROUTES.successStories,
  },
  {
    title: 'Plan your visit',
    subTitle: 'Logistics',
    path: '/plan-your-visit',
  },
  {
    title: 'Naturopathy',
    subTitle: 'We’re just a message away.',
    path: '/naturopathy',
  },
  {
    title: 'About us ',
    subTitle: 'The vision and people behind Pema.',
    path: '/about-us',
  },
  {
    title: 'Resources',
    subTitle: 'Guides and insights for everyday wellness.',
    path: '/resources',
  },
  {
    title: 'Contact us',
    subTitle: 'We’re just a message away.',
    path: '/contact-us',
  },
]
import CountryDropdown from './CountryDropDown'
import { useDeviceType } from '@/hooks/useDeviceType'
import {
  medicalSubProgramsRoutes,
  ROUTES,
  wellnessSubProgramsRoutes,
  zohoForms,
} from '@/utils/utils'

export default function NavBar() {
  const router = useRouter()

  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 52)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goToHome = () => {
    router.push('/')
    setShowMenu(false)
    setprimarySubMenu('')
  }

  const [showMenu, setShowMenu] = useState(false)
  const [primarySubMenu, setprimarySubMenu] = useState('')
  const [secondarySubMenu, setsecondarySubMenu] = useState('')

  const navRef = useRef<HTMLDivElement>(null)

  const device = useDeviceType()

  // 📌 Click outside to closes
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        device === 'laptop' && setprimarySubMenu('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [device])

  const navigateTo = (path: string) => {
    router.push(path)
    setprimarySubMenu('')
    setShowMenu(false)
  }

  return (
    <>
      {/* web navbar */}
      <div
        ref={navRef}
        className={`hidden transition-all duration-200 xl:flex h-[78px] gap-9 w-full text-lg border-b border-[#32333333]
           ${isHomePage ? (scrolled ? 'bg-white text-slateGray' : 'bg-transparent text-softSand') : 'text-slateGray bg-white'}
            flex-row items-center justify-center`}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 111,
        }}
      >
        <div
          className={`hidden max-w-[1440px] px-4 transition-all duration-200 xl:flex h-[78px] gap-5 w-full text-lg border-b border-[#32333333]
         
            flex-row items-center justify-between`}
        >
          <div>
            <Image
              onClick={goToHome}
              src={
                isHomePage
                  ? scrolled
                    ? '/pema-logo-pink.svg'
                    : '/pema-logo-white.svg'
                  : '/pema-logo-pink.svg'
              }
              width={96}
              height={30}
              alt='Pema Logo Pink'
              className='cursor-pointer h-[30px] aspect-auto'
            />
          </div>
          {/* 
        
        */}
          {mainNavOptions.map((item) => {
            return (
              <div key={item.title} className='relative cursor-pointer text-center'>
                <div
                  onClick={() => {
                    if (item.subNavMenu) {
                      setprimarySubMenu(primarySubMenu === item.title ? '' : item.title)
                    } else {
                      navigateTo(item.path)
                    }
                  }}
                  className='flex cursor-pointer text-center gap-1 items-center flex-row leading-4'
                >
                  {item.title}
                  {item.subNavMenu && (
                    <ChevronDown
                      className={`transition-all duration-200 ${primarySubMenu === item.title ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>
                {primarySubMenu === item.title && item.subNavMenu && (
                  <div className='bg-white absolute top-12 w-[220px] text-slateGray'>
                    {item.subNavMenu.map((subItem) => {
                      return (
                        <div key={subItem.title} className='relative cursor-pointer text-center'>
                          <div
                            onClick={() => {
                              if (subItem.subNavMenu) {
                                setsecondarySubMenu(
                                  secondarySubMenu === subItem.title ? '' : subItem.title
                                )
                              } else {
                                navigateTo(subItem.path)
                              }
                            }}
                            className={`justify-between hover:bg-pemaBlue transition-all duration-200 hover:text-softSand py-4 px-[10px] border-b border-[#D6D6D6] flex cursor-pointer text-left gap-1 items-center flex-row leading-5`}
                          >
                            {subItem.title}
                            {subItem.subNavMenu && (
                              <ChevronDown
                                className={`transition-all duration-200 ${secondarySubMenu === subItem.title ? 'rotate-180' : ''}`}
                              />
                            )}
                          </div>
                          {secondarySubMenu === subItem.title && subItem.subNavMenu && (
                            <div className=' w-full'>
                              {subItem.subNavMenu.map((subChildItem) => {
                                return (
                                  <div
                                    onClick={() => navigateTo(subChildItem.path)}
                                    key={subChildItem.title}
                                    className=' pl-4 relative cursor-pointer text-left border-b border-[#D6D6D6] hover:bg-pemaBlue transition-all duration-200 hover:text-softSand'
                                  >
                                    <div className='p-4 flex cursor-pointer text-left gap-1 items-center flex-row leading-4'>
                                      {subChildItem.title}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          {/* 

        
        */}
          <div className='flex flex-row items-center justify-end gap-3'>
            <div onClick={() => setprimarySubMenu('')}>
              <CountryDropdown
                className={`${isHomePage ? (scrolled ? 'bg-white text-slateGray border-slateGray' : 'bg-transparent text-softSand border-softSand') : 'text-slateGray bg-white'}`}
              />{' '}
            </div>
            <Link
              href={'/booking'}
              onClick={() => setprimarySubMenu('')}
              className={` px-4 py-2 border transition-colors duration-300 cursor-pointer ${
                isHomePage && !scrolled
                  ? 'border-softSand text-softSand hover:bg-white hover:text-pemaBlue'
                  : 'border-pemaBlue text-pemaBlue hover:bg-pemaBlue hover:text-softSand'
              }`}
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
      {/* mobile navbar */}
      <div
        // ref={navRef}
        className={`xl:hidden sticky h-[78px] bg-white w-full text-lg flex flex-row items-center justify-between px-6`}
        style={{
          position: scrolled ? 'sticky' : 'static',
          top: 0,
          zIndex: 111,
        }}
      >
        <div onClick={() => setShowMenu(!showMenu)} className='cursor-pointer'>
          {showMenu ? <X className='text-pemaBlue' /> : <Menu className='text-pemaBlue' />}
        </div>
        <div>
          <Image
            onClick={goToHome}
            src={'/pema-logo-pink.svg'}
            width={96}
            height={30}
            alt='Pema Logo Pink'
            className='cursor-pointer h-[30px] aspect-auto'
          />
        </div>
        {showMenu ? (
          <CountryDropdown className={`bg-white text-slateGray border-[#32333333] z-[111]`} />
        ) : (
          <Link
            href={'/booking'}
            className={`flex justify-center items-center border-b-2  transition-all duration-200 border-pemaBlue text-pemaBlue cursor-pointer`}
          >
            Reserve
          </Link>
        )}

        <div
          style={{
            height: '85vh',
            overflow: showMenu ? 'scroll' : 'hidden',
            top: scrolled ? '78px' : '110px',
            display: showMenu ? 'block' : 'none',
          }}
          className='absolute transition-all duration-[500ms] right-0 left-0 bg-white h-ful w-full border-y border-[#32333333] z-11'
        >
          {' '}
          <div className='mx-4 border-b border-[#32333333] py-3 px-4' onClick={goToHome}>
            <div className='font-crimson text-pemaBlue text-base flex flex-row items-center justify-between'>
              Home
              <MoveRight className='text-pemaBlue' />
            </div>
            <div className='font-crimson text-slateGray text-base'>
              Welcome to the universe of you{' '}
            </div>
          </div>
          {mainNavOptions.map((item) => {
            return (
              <div key={item.title}>
                <div
                  key={item.title}
                  className='mx-4 border-b border-[#32333333] py-3 px-4'
                  onClick={() => {
                    if (item.subNavMenu) {
                      setprimarySubMenu(primarySubMenu === item.title ? '' : item.title)
                    } else {
                      router.push(item.path)
                      setShowMenu(false)
                    }
                  }}
                >
                  <div className='font-crimson text-pemaBlue text-base flex flex-row items-center justify-between'>
                    {item.title}
                    {item.subNavMenu ? (
                      <ChevronDown
                        className={`${primarySubMenu === item.title ? 'rotate-180' : ''} text-pemaBlue`}
                      />
                    ) : (
                      <MoveRight className='text-pemaBlue' />
                    )}
                  </div>
                  <div className='font-crimson text-slateGray text-base'>{item.subTitle} </div>
                </div>
                {primarySubMenu === item.title && item.subNavMenu && (
                  <div className='bg-white '>
                    {item.subNavMenu.map((subItem) => {
                      return (
                        <div
                          key={subItem.title}
                          // onClick={() => router.push(subItem.path)}
                          className='relative  pl-8 pr-4 cursor-pointer text-center'
                        >
                          <div
                            onClick={() => {
                              if (subItem.subNavMenu) {
                                setsecondarySubMenu(
                                  secondarySubMenu === subItem.title ? '' : subItem.title
                                )
                              } else {
                                navigateTo(subItem.path)
                                setShowMenu(false)
                              }
                            }}
                            className={` hover:bg-pemaBlue  text-pemaBlue transition-all duration-200 hover:text-softSand py-4 border-b border-[#32333333] 
                            cursor-pointer text-left gap-1 leading-5`}
                          >
                            <div className='transition-all px-4 duration-200 font-crimson text-base flex flex-row items-center justify-between'>
                              {subItem.title}
                              {subItem.subNavMenu ? (
                                <ChevronDown />
                              ) : (
                                <MoveRight className='text-pemaBlue' />
                              )}
                            </div>
                          </div>
                          {secondarySubMenu === subItem.title && subItem.subNavMenu && (
                            <div className=' w-full'>
                              {subItem.subNavMenu.map((subChildItem) => {
                                return (
                                  <div
                                    onClick={() => {
                                      navigateTo(subChildItem.path)
                                      setShowMenu(false)
                                    }}
                                    key={subChildItem.title}
                                    className=' pl-8 relative cursor-pointer text-center border-b border-[#32333333] hover:bg-pemaBlue transition-all duration-200 hover:text-softSand'
                                  >
                                    <div className='p-4 flex justify-between cursor-pointer text-base text-center gap-1 items-center flex-row leading-4'>
                                      {subChildItem.title} <MoveRight className='text-pemaBlue' />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          <div className='py-3 mx-4 lg:hidden'>
            <div className='font-crimson text-slateGray text-base'>
              Healing feels better together.{' '}
            </div>
            <Link
              href={zohoForms.familyInquiry}
              className='font-crimson w-fit text-pemaBlue text-base flex flex-row items-center gap-2 border-b border-pemaBlue'
            >
              Bring your family to Pema
              <MoveRight className='text-pemaBlue' />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
