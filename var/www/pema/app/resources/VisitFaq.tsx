import FAQs from '../plan-your-visit/FAQs'

const VisitFAQs = () => {
  return (
    <div className=' m-auto text-left'>
      <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:text-center'>
        <div className=' w-full max-w-[750px]'>
          <div className='px-4 text-[20px] md:text-[24px] text-pemaBlue md:text-slateGray font-ivyOra py-2 text-left leading-[120%] m-auto'>
            Plan your visit{' '}
          </div>
          <FAQs />
        </div>
      </div>
    </div>
  )
}

export default VisitFAQs
