import Image from 'next/image'

const Privacy = () => {
  const doubleclickDartCookie: string[] = [
    `Google, as a third-party vendor, uses cookies to serve ads on www.pemawellness.com`,
    `Google’s use of the DART cookie enables it to serve ads to our site’s visitors based upon their visit to www.pemawellness.com and other sites on the Internet`,
    `Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at the following URL – http://www.google.com/privacy_ads.html  ]
`,
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
            Privacy Policy for Pema{' '}
          </div>
        </div>
      </div>
      {/* section */}
      <div className='mx-auto max-w-[900px] px-4 my-12 md:my-10'>
        {/* sub section 1 */}
        <div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            If you require any more information or have any questions about our privacy policy,
            please feel free to contact us by email at info@pemawellness.com
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            At, www.pemawellness.com we consider the privacy of our visitors to be extremely
            important. This privacy policy document describes in detail the types of personal
            information collected and recorded by www.pemawellness.com and how we use it.
          </div>
        </div>

        {/* sub section 2 */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>Log files </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            {`Like many other Web sites, www.pemawellness.com makes use of log files. These files
            merely log visitors to the site – usually a standard procedure for hosting companies and
            a part of hosting services’ analytics. The information inside the log files includes
            internet protocol (IP) addresses, browser type, Internet Service Provider (ISP),
            date/time stamp, referring/exit pages, and possibly the number of clicks. This
            information is used to analyze trends, administer the site, track users’ movement around
            the site, and gather demographic information. IP addresses and other such information
            are not linked to any information that is personally identifiable.`}{' '}
          </div>
        </div>

        {/* sub section 3
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Cookies and web beacons{' '}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-4 '>
            {`www.pemawellness.com use cookies to store information about visitors' preferences, to
            record user-specific information on which pages the site visitor accesses or visits, and
            to personalize or customize our web page content based upon visitors’ browser type or
            other information that the visitor sends via their browser.`}{' '}
          </div>
        </div>

        {/* sub section 4
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Doubleclick dart cookie{' '}
          </div>
          {doubleclickDartCookie.map((item) => {
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

        {/* sub section 6
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Our advertising partners{' '}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            Some of our advertising partners may use cookies and web beacons on our site. Our
            advertising partners include Meta and Google.
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            While each of these advertising partners has its own Privacy Policy for its site, an
            updated and hyperlinked resource is maintained here: Privacy Policies. You may consult
            this listing to find the privacy policy for each of the advertising partners of
            http://www.pemawellness.com.
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            {`These third-party ad servers or ad networks use technology in their respective
            advertisements and links that appear on http://www.pemawellness.com and are sent
            directly to your browser. They automatically receive your IP address when this occurs.
            Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by our
            site’s third-party ad networks to measure the effectiveness of their advertising
            campaigns and/or to personalize the advertising content that you see on the site.`}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            www.pemawellness.com have no access to or control over these cookies that are used by
            third-party advertisers.
          </div>
        </div>

        {/* sub section 7
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Third-party privacy policies{' '}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            {`You should consult the respective privacy policies of these third-party ad servers for
            more detailed information on their practices as well as for instructions about how to
            opt out of certain practices. www.pemawellness.com privacy policies do not apply to, and
            we cannot control the activities of, such other advertisers or websites. You may find a
            comprehensive listing of these privacy policies and their links here: Privacy Policy
            Links. If you wish to disable cookies, you may do so through your individual browser
            options. More detailed information about cookie management with specific web browsers
            can be found at the browsers’ respective websites. What Are Cookies?`}
          </div>
        </div>

        {/* sub section 8
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            {`Children’s information`}{' '}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            {`We believe it is important to provide added protection for children online. We encourage parents and guardians to spend time online with their children to observe, participate in and/or monitor and guide their online activity. www.pemawellness.com do not knowingly collect any personally identifiable information from children under the age of 13. If a parent or guardian believes that www.pemawellness.com have in their database the personally-identifiable information of a child under the age of 13, please contact us immediately (using the contact in the first paragraph) and we will use our best efforts to promptly remove such information from our records.`}
          </div>
        </div>

        {/* sub section 9
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>
            Online privacy policy only{' '}
          </div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            {`This privacy policy applies only to our online activities and is valid for visitors to
            our website and regarding information shared and/or collected there. This policy does
            not apply to any information collected offline or via channels other than this website.`}
          </div>
        </div>

        {/* sub section 10
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>Consent</div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            {`By using our website, you hereby consent to our privacy policy and agree to its terms.`}
          </div>
        </div>

        {/* sub section 11
         */}
        <div className='mt-6 md:mt-10'>
          <div className='text-slateGray text-2xl font-ivyOra md:text-[32px]'>Update</div>
          <div className='text-slateGray font-crimson text-base md:text-xl md:leading-[100%] leading-[110%] mt-2 '>
            {`This Privacy Policy was last updated on: Monday, August 5th, 2016. Should we update,
            amend or make any changes to our privacy policy, those changes will be posted here.`}
            <br />
            {`Always be wary when submitting data to websites. Read the site’s data protection
            and privacy policies fully.This privacy statement is provided for informational purposes
            only. It is not meant to be a contract type. PEMA Wellness Resort may change its
            privacy statement at any time without prior notice`}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Privacy
