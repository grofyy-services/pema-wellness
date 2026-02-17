import PemaLite from './WellnessProgram'

export const metadata = {
  title: 'Wellness Resort in India for Stress Relief | Pema Wellness',
  description:
    'Choose Pema Wellness, a wellness resort in India for stress relief, featuring restorative yoga, Ayurveda therapies, and serene retreat experiences.',
  keywords: ['wellness resort in india', 'best health resorts in india'],
  alternates: {
    canonical: 'https://www.pemawellness.com/wellness-program',
  },
  openGraph: {
    title: 'Wellness Resort in India for Stress Relief | Pema Wellness',
    description:
      'Choose Pema Wellness, a wellness resort in India for stress relief, featuring restorative yoga, Ayurveda therapies, and serene retreat experiences.',
    url: 'https://www.pemawellness.com/wellness-program',
  },
}

export default function Home() {
  return <PemaLite />
}
