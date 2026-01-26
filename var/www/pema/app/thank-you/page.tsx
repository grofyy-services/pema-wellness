import Script from 'next/script'
import ThankYou from './ThankYou'

export const metadata = {
  title: 'Gift Inquiry | Pema Wellness',
  description:
    'A wellness resort curated with programs that are customized to heal the harmony between the body, mind, and spirit, Pema Wellness is a purpose-driven resort that restores your holistic healing and enlightened wisdom. Get away from the stresses and strains of everyday life on one of our healing packages and improve your life.',
  openGraph: {
    title: 'Thank you  | Pema Wellness',
    description:
      'A wellness resort curated with programs that are customized to heal the harmony between the body, mind, and spirit, Pema Wellness is a purpose-driven resort that restores your holistic healing and enlightened wisdom. Get away from the stresses and strains of everyday life on one of our healing packages and improve your life.',
    url: 'https://pemawellness.com',
  },
}

export default function Home() {
  return (
    <>
      <Script id='gtm-11427236555' strategy='afterInteractive'>
        {` gtag('event', 'conversion', {
      'send_to': 'AW-11427236555/rRbMCNmuirYbEMuV98gq',
      'value': 1.0,
      'currency': 'INR'
  });`}
      </Script>
      <ThankYou />
    </>
  )
}
