import FAQs from '../medical-health-program/FAQs'

const MedicalFAQs = () => {
  return (
    <div className=' m-auto text-left max-w-[750px]'>
      <div className='flex md:justify-center  justify-start  mx-0 mb-3 md:text-center'>
        <div className=' w-full max-w-[750px]'>
          <div
            className='text-[20px] px-4 md:text-[24px] text-pemaBlue md:text-slateGray font-ivyOra py-2 
          text-left leading-[120%] m-auto'
          >
            Medical programs{' '}
          </div>
          <FAQs />
        </div>
      </div>
    </div>
  )
}

export default MedicalFAQs
