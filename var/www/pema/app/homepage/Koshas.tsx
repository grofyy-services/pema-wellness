export default function Koshas() {
  const items = [
    {
      title: 'Physical body: Annamaya',
      desc: 'Personalised nutrition, holistic massages, fomentations, hydrotherapy, barefoot walking.',
      img: '/annamaya.webp',
      line1: 'Personalised nutrition, holistic massages,',
      line2: 'fomentations, hydrotherapy, barefoot walking.',
    },
    {
      title: 'Energy body: Pranamaya',
      desc: 'Breath work, acupuncture, energy-balancing.',
      img: '/pranamaya.webp',
      line1: 'Breath work, acupuncture, energy-',
      line2: 'balancing.',
    },
    {
      title: 'Mental body: Manomaya',
      desc: 'Meditation, silence, therapeutic dialogue.',
      img: '/manomaya.webp',
      line1: 'Meditation, silence, therapeutic',
      line2: 'dialogue',
    },
    {
      title: 'Wisdom body: Vijnanamaya',
      desc: 'Nature walks, doctor consults, health talks.',
      img: '/vijnanamaya.webp',
      line1: 'Nature walks, doctor consults, health talks.',
      line2: '',
    },
    {
      title: 'Bliss body: Anandamaya',
      desc: 'Stillness, joy, rest, ritual.',
      img: '/anandamaya.webp',
      line1: 'Stillness, joy, rest, ritual.',
      line2: '',
    },
  ]

  return (
    <div className='w-full mx-auto px-6 py-16'>
      <div className='grid md:grid-cols-3 gap-12 text-center'>
        {/* First row: 3 items */}
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className='flex flex-col items-center '>
            <img
              src={item.img}
              alt={item.title}
              className='w-[212px] h-[178px] max-w-full max-w-full mb-4'
            />
            <h3 className='text-2xl font-ivyOra mb-2'>{item.title}</h3>
            <p className='text-slateGray text-xl font-crimson whitespace-break-spaces'>
              {item.line1}
            </p>
            <p className='text-slateGray text-xl font-crimson whitespace-break-spaces'>
              {item.line2}
            </p>
          </div>
        ))}
      </div>

      <div className='grid md:grid-cols-2 gap-12 mt-12 text-center max-w-[800px] m-auto'>
        {/* Second row: 2 items */}

        {items.slice(3).map((item, i) => (
          <div key={i} className='flex flex-col m-auto items-center'>
            <img
              src={item.img}
              alt={item.title}
              className='w-[212px] h-[178px] max-w-full max-w-full mb-4'
            />
            <h3 className='text-2xl font-ivyOra mb-2'>{item.title}</h3>
            <p className='text-slateGray text-xl font-crimson'>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
