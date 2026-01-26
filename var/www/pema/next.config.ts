import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/book-a-room',
        destination: '/contact-us',
        permanent: true, // 301 redirect
      },
      {
        source: '/wellnessatpema',
        destination: '/#programs',
        permanent: true,
      },
      {
        source: '/careers',
        destination: '/about-us#career',
        permanent: true,
      },
      {
        source: '/copy-of-facilities',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/faq-s',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/griffin',
        destination: '/wellness-journey',
        permanent: true,
      },
      {
        source: '/august2025/thankyou',
        destination: '/', // assuming redirect to homepage
        permanent: true,
      },
      {
        source: '/physio-therapy',
        destination: '/our-approach',
        permanent: true,
      },
      {
        source: '/hydrotherapies-our-approach',
        destination: '/our-approach',
        permanent: true,
      },
      {
        source: '/naturopathytherapies',
        destination: '/our-approach',
        permanent: true,
      },
      {
        source: '/service-page/hot-stone-massage',
        destination: '/our-approach',
        permanent: true,
      },
      {
        source: '/acupunture',
        destination: '/our-approach',
        permanent: true,
      },
      {
        source: '/medical-application-form',
        destination: '/medical-health-assessment',
        permanent: true,
      },
      {
        source: '/cancellationandrefundpolicy',
        destination: '/plan-your-visit',
        permanent: true,
      },
      {
        source: '/privacypolicy',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
