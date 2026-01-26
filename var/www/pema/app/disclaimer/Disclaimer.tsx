import Image from 'next/image'
import MedicalFAQs from '../resources/MedicalFaq'
import WellnessFAQs from '../resources/WellnessFaq'
import SanctuaryFAQs from '../resources/SancturyFaq'
import ApproachFAQs from '../resources/ApproachFaq'
import VisitFAQs from '../resources/VisitFaq'

const Disclaimer = () => {
  const admissionCriteria: string[] = [
    'Guests above 70 years of age are requested to undergo prior consultation with a Pema doctor before booking.',
    'Guests with cardiac, liver, kidney, or lung conditions are requested to undergo prior consultation with a Pema doctor before booking.',
    'Pregnant women are requested to undergo prior consultation with a Pema doctor before booking.',
    'As naturopathy treatments are most effective when uninterrupted, guests are encouraged to plan their stay outside their menstrual cycle, as many therapies cannot be performed during this time.',
    'Guests with active carcinomas, infectious or communicable conditions, tuberculosis, or severe skin disorders may not be suitable for admission. Our doctors will guide you and suggest alternatives if needed.',
    'Guests with a history of carcinoma, or who have recently undergone surgery, experienced fractures, or acute injuries, are requested to undergo prior consultation with a Pema doctor before booking.',
    'All guests are invited to share their most recent medical reports and current medications in advance, allowing our doctors to personalise therapies for the best outcomes.',
    'To ensure your comfort and safety, please share any known allergies (foods, oils, or substances) prior to arrival so treatments as well as diet plans can be adapted accordingly.',
  ]

  const lifestyleGuidelines: string[] = [
    'To preserve the healing environment at Pema Wellness, the consumption of tea, coffee, sugar, aerated drinks, alcohol, cigarettes, tobacco products, gutka, paan, recreational drugs, non-vegetarian food, packed or processed foods, and outside food or beverages are not permitted during your stay.',
    'Observing these guidelines helps protect both your wellbeing and the collective healing environment.',
    'If these guidelines are not observed, our doctors may advise modifications to your stay or, if necessary, bring your program to a close.',
  ]

  const declarationOfUnderstanding: string[] = [
    'Treatment durations recommended prior to admission are indicative. The final program length may vary after detailed consultation, depending on individual health conditions, medication use, or overall vitality. In some cases, an extension or a return visit may be advised.',
    'I acknowledge that Pema Wellness does not admit guests on life support systems.',
    'I accept full responsibility for the outcomes of my treatment program, and I agree not to hold Pema Wellness, its doctors, or medical staff liable for conditions that may arise during or after treatment.',
    'I further accept responsibility should I deviate from prescribed guidelines, including consuming food or drinks outside the permissible plan.',
    'I consent to Pema Wellness maintaining my medical data for treatment and research purposes, with full confidentiality assured.',
  ]

  return (
    <div className=' m-auto'>
      {/* header */}
      <div className='bg-softSand py-[70px]'>
        <div className=' max-w-[900px] mx-auto'>
          <div className='text-pemaBlue font-ivyOra text-[28px] md:text-left text-center md:text-[40px] px-12 md:px-0'>
            Guest disclaimer & admission criteria
          </div>
        </div>
      </div>
      {/* section */}
      <div className='mx-auto max-w-[900px] px-4 my-12 md:my-10'>
        {/* sub section 1 */}
        <div>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Consent & acknowledgement
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            I hereby consent to my stay and participation in the programs and therapies offered at
            Pema Wellness, a unit of HEI Hospitalities, Visakhapatnam.
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            I understand that all treatments and therapies — including massages, hydrotherapy,
            enemas, colon treatments, nutritional programs, and other doctor-prescribed services —
            are provided under the guidance of qualified medical professionals at Pema Wellness.
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            I confirm that I will truthfully disclose all relevant health details, including medical
            history, allergies, past or ongoing treatments, surgeries, medications and / or
            addictions.
          </div>
        </div>

        {/* sub section 2 */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Medical & therapeutic care{' '}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            During my stay, I consent to:
          </div>
          <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-4'>
            <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />

            <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] '>
              Diagnostic assessments, medical investigations, and prescribed therapies.
            </div>
          </div>
          <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-4'>
            <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />

            <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] '>
              Administration of medications and tests (oral, injectable, radiological, or other as
              deemed necessary by medical partners of Pema Wellness).{' '}
            </div>
          </div>
          <div className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-4'>
            <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />

            <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] '>
              Following all medical guidance and institute guidelines for my safety and
              wellbeing.{' '}
            </div>
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            Should my application not be approved by Pema’s doctors, the advance deposit paid
            towards reserving my stay will be fully refunded.
          </div>
        </div>

        {/* sub section 3
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Admission criteria{' '}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            To ensure safe participation in our programs, we kindly request:{' '}
          </div>
          {admissionCriteria.map((item) => {
            return (
              <div
                key={item}
                className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-4'
              >
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
                <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] '>
                  {item}{' '}
                </div>
              </div>
            )
          })}
        </div>

        {/* sub section 4
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Lifestyle & nourishment guidelines{' '}
          </div>
          {lifestyleGuidelines.map((item) => {
            return (
              <div
                key={item}
                className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-4'
              >
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
                <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] '>
                  {item}{' '}
                </div>
              </div>
            )
          })}
        </div>

        {/* sub section 5
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Declaration of understanding{' '}
          </div>
          {declarationOfUnderstanding.map((item) => {
            return (
              <div
                key={item}
                className='flex flex-row gap-2 text-base md:text-xl items-start text-slateGray mt-4'
              >
                <Image alt='icon' src={'/images/kosha-pointer-icon.svg'} width={28} height={23} />
                <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] '>
                  {item}{' '}
                </div>
              </div>
            )
          })}
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            I confirm that I have read, understood, and agreed to the above. I provide my consent
            freely and in full awareness.
          </div>
        </div>

        {/* faqs */}
        <div className='mt-6 md:mt-10 m-auto max-w-[750px]'>
          <div className='px-4 text-[28px] md:text-[32px] text-slateGray font-ivyOra py-2 text-left  leading-[120%] m-auto'>
            Frequently asked questions{' '}
          </div>
          <div className='mt-6'>
            <MedicalFAQs />
          </div>
          <div className='mt-6'>
            <WellnessFAQs />
          </div>

          <div className='mt-6'>
            <SanctuaryFAQs />
          </div>
          <div className='mt-6'>
            <ApproachFAQs />
          </div>

          <div className='mt-6'>
            <VisitFAQs />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Disclaimer
