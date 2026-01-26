import HomePage from './homepage/page'

export const metadata = {
  title: 'Home | Pema Wellness',
  description:
    'A wellness resort curated with programs that are customized to heal the harmony between the body, mind, and spirit, Pema Wellness is a purpose-driven resort that restores your holistic healing and enlightened wisdom. Get away from the stresses and strains of everyday life on one of our healing packages and improve your life.',
  openGraph: {
    title: 'Pema Wellness',
    description:
      'A wellness resort curated with programs that are customized to heal the harmony between the body, mind, and spirit, Pema Wellness is a purpose-driven resort that restores your holistic healing and enlightened wisdom. Get away from the stresses and strains of everyday life on one of our healing packages and improve your life.',
    url: 'https://pemawellness.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.pemawellness.com/#website',
      url: 'https://www.pemawellness.com/',
      name: 'Pema Wellness Retreat',
      publisher: { '@id': 'https://www.pemawellness.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.pemawellness.com/?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.pemawellness.com/#organization',
      name: 'Pema Wellness Retreat',
      url: 'https://www.pemawellness.com/',
      logo: 'https://www.pemawellness.com/wp-content/uploads/2023/06/logo.png',
      email: 'enquiry@pemawellness.com',
      telephone: '+91 95777 09494',
      image: [
        'https://www.pemawellness.com/wp-content/uploads/2023/06/slider1.jpg',
        'https://www.pemawellness.com/wp-content/uploads/2023/06/slider2.jpg',
        'https://www.pemawellness.com/wp-content/uploads/2023/06/slider3.jpg',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Healing Hills, Rushikonda',
        addressLocality: 'Visakhapatnam',
        addressRegion: 'Andhra Pradesh',
        postalCode: '530045',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://www.facebook.com/pemawellness',
        'https://www.instagram.com/pemawellness/',
        'https://www.youtube.com/@PemaWellnessRetreat',
      ],
    },
    {
      '@type': ['HealthAndBeautyBusiness', 'LodgingBusiness'],
      '@id': 'https://www.pemawellness.com/#localbusiness',
      name: 'Pema Wellness Retreat',
      url: 'https://www.pemawellness.com/',
      description:
        'A premium naturopathy and wellness retreat offering holistic detox programs, weight-loss plans, spa therapies, yoga, meditation and luxury beachfront accommodation.',
      priceRange: '₹₹₹',
      telephone: '+91 95777 09494',
      email: 'enquiry@pemawellness.com',
      image: [
        'https://www.pemawellness.com/wp-content/uploads/2023/06/slider1.jpg',
        'https://www.pemawellness.com/wp-content/uploads/2023/06/slider2.jpg',
        'https://www.pemawellness.com/wp-content/uploads/2023/06/slider3.jpg',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Healing Hills, Rushikonda',
        addressLocality: 'Visakhapatnam',
        addressRegion: 'Andhra Pradesh',
        postalCode: '530045',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '17.7555',
        longitude: '83.3656',
      },
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Detox Therapies',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Yoga & Meditation',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Spa & Wellness Treatments',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Luxury Accommodation',
          value: true,
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Beachfront Location',
          value: true,
        },
      ],
      openingHours: 'Mo-Su 08:00-20:00',
      parentOrganization: {
        '@id': 'https://www.pemawellness.com/#organization',
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  )
}
