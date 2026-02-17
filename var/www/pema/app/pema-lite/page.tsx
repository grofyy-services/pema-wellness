import PemaLite from './PemaLite'

export const metadata = {
  title: 'Luxury Wellness Resorts in India | Pema Wellness',
  description:
    'Experience refined relaxation at Pema Wellness, one of the luxury wellness resorts in India with holistic therapies and serene stays. Visit us now.',
  keywords: ['luxury wellness resorts in india', 'best spa resorts in india'],
  alternates: {
    canonical: 'https://www.pemawellness.com/pema-lite',
  },
  openGraph: {
    title: 'Luxury Wellness Resorts in India | Pema Wellness',
    description:
      'Experience refined relaxation at Pema Wellness, one of the luxury wellness resorts in India with holistic therapies and serene stays. Visit us now.',
    url: 'https://www.pemawellness.com/pema-lite',
  },
}

export default function Home() {
  return <PemaLite />
}
