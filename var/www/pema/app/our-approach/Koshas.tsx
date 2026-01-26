import Image from 'next/image'

export default function Koshas() {
  const items = [
    {
      title: 'Physical body: Annamaya',
      subtitle: 'Where presence begins',
      description:
        'We honour your physical body as the sacred home of your life force. Through personalised nutrition sourced from our-',
      activities: ['Healing gardens', 'Therapeutic yoga', 'Fomentations'],
      img: '/annamaya.webp',
    },
    {
      title: 'Energy body: Pranamaya',
      subtitle: 'Where life flows',
      description:
        'When prana flows freely, you feel alive. Breathwork fuels oxygen, calms, and restores.',
      activities: ['Vital energy', 'Mindful movement', 'Acupuncture'],
      img: '/pranamaya.webp',
    },
    {
      title: 'Mental body: Manomaya',
      subtitle: 'Where the inner landscape softens',
      description:
        'A calm emotional body brings lightness to the mind and ease to the physical form. You arrive here through-',
      activities: ['Healing conversations', 'Intentional silence', 'Reflection practices'],
      img: '/manomaya.webp',
    },
    {
      title: 'Wisdom body: Vijnanamaya',
      subtitle: 'Where clarity begins to speak',
      description:
        'When this layer is nourished, decisions feel aligned and life gains deeper meaning. We support this through-',
      activities: ['Doctors consultation', 'Nature walks', 'Silence practices'],
      img: '/vijnanamaya.webp',
    },
    {
      title: 'Bliss body: Anandamaya',
      subtitle: 'Where joy arises quietly, naturally',
      description:
        'This is the subtle essence beneath all else not sought, but felt. A simple miracle, nurtured by being fully present.',
      activities: ['Sacred rituals', 'Deep rest', 'Moments of lightness and play'],
      img: '/anandamaya.webp',
    },
  ]

  return (
    <div className='w-full mx-auto px-4 md:pt-16'>
      {/* First row: 2 items */}
      <div className='grid md:grid-cols-2 gap-6 md:gap-12 text-center mb-12'>
        {items.slice(0, 2).map((item, i) => (
          <div key={i} className='flex flex-col items-center'>
            <Image
              src={item.img}
              alt={item.title}
              width={212}
              height={178}
              className='w-[212px] h-[178px] max-w-full mb-4'
            />
            <div className='flex md:block flex-row gap-2'>
              <h3 className='text-lg md:hidden font-ivyOra mb-2 text-slateGray'>{i + 1}. </h3>

              <div>
                <h3 className='text-lg md:text-2xl text-left md:text-center font-ivyOra mb-2 text-slateGray md:text-pemaBlue'>
                  {' '}
                  <span className='hidden md:inline'>{i + 1}. </span> {item.title}
                </h3>
                <p className='text-base md:text-xl  leading-[110%] md:leading-normal  text-left md:text-center md:font-ivyOra mb-3 md:mb-2 text-slateGray'>
                  {item.subtitle}
                </p>
                <p className='text-base mx-auto md:text-xl text-left md:text-center md:leading-normal leading-[110%] font-crimson text-slateGray mb-3 md:mb-4 md:w-[80%]'>
                  {item.description}
                </p>
                <div className='gap-3 md:flex flex-row items-center justify-center'>
                  {item.activities.map((activity, idx) => (
                    <div key={idx} className='flex items-center md:justify-center gap-2'>
                      <Image
                        alt='icon'
                        src={'/images/kosha-pointer-icon.svg'}
                        width={28}
                        height={23}
                      />{' '}
                      <div className='text-slateGray font-crimson text-base md:text-xl'>
                        {activity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Second row: 2 items */}
      <div className='grid md:grid-cols-2 gap-6 md:gap-12 text-center mb-12'>
        {items.slice(2, 4).map((item, i) => (
          <div key={i} className='flex flex-col items-center'>
            <Image
              src={item.img}
              alt={item.title}
              width={212}
              height={178}
              className='w-[212px] h-[178px] max-w-full mb-4'
            />
            <div className='flex md:block flex-row gap-2'>
              <h3 className='text-lg md:hidden font-ivyOra mb-2 text-slateGray'>{i + 3}. </h3>

              <div>
                <h3 className='text-lg md:text-2xl text-left md:text-center font-ivyOra mb-2 text-slateGray md:text-pemaBlue'>
                  {' '}
                  <span className='hidden md:inline'>{i + 3}. </span> {item.title}
                </h3>
                <p className='text-base md:text-xl  leading-[110%] md:leading-normal  text-left md:text-center md:font-ivyOra mb-3 md:mb-2 text-slateGray'>
                  {item.subtitle}
                </p>
                <p className='text-base mx-auto md:text-xl text-left md:text-center md:leading-normal leading-[110%] font-crimson text-slateGray mb-3 md:mb-4 md:w-[80%]'>
                  {item.description}
                </p>
                <div className='gap-3 md:flex flex-row items-center justify-center'>
                  {item.activities.map((activity, idx) => (
                    <div key={idx} className='flex items-center md:justify-center gap-2'>
                      <Image
                        alt='icon'
                        src={'/images/kosha-pointer-icon.svg'}
                        width={28}
                        height={23}
                      />{' '}
                      <div className='text-slateGray font-crimson text-base md:text-xl'>
                        {activity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Third row: 1 centered item */}
      <div className='flex flex-col items-center'>
        <Image
          src={items[4].img}
          alt={items[4].title}
          width={212}
          height={178}
          className='w-[212px] h-[178px] max-w-full mb-4'
        />
        <div className='flex md:block flex-row gap-2'>
          <h3 className='text-lg md:hidden font-ivyOra mb-2 text-slateGray'>5. </h3>

          <div>
            <h3 className='text-lg md:text-2xl text-left md:text-center font-ivyOra mb-2 text-slateGray md:text-pemaBlue'>
              {' '}
              <span className='hidden md:inline'>5. </span> {items[4].title}
            </h3>
            <p className='text-base md:text-xl  leading-[110%] md:leading-normal  text-left md:text-center md:font-ivyOra mb-3 md:mb-2 text-slateGray'>
              {items[4].subtitle}
            </p>
            <p className='text-base mx-auto md:text-xl text-left md:text-center md:leading-normal leading-[110%] font-crimson text-slateGray mb-3 md:mb-4 md:w-[80%]'>
              {items[4].description}
            </p>
            <div className='gap-3 md:flex flex-row items-center justify-center'>
              {items[4].activities.map((activity, idx) => (
                <div key={idx} className='flex items-center md:justify-center gap-2'>
                  <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />{' '}
                  <div className='text-slateGray font-crimson text-base md:text-xl'>{activity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
