import Booking from './Booking'

export const metadata = {
  title: 'Book | Pema Wellness',
  description:
    'A wellness resort curated with programs that are customized to heal the harmony between the body, mind, and spirit, Pema Wellness is a purpose-driven resort that restores your holistic healing and enlightened wisdom. Get away from the stresses and strains of everyday life on one of our healing packages and improve your life.',
  openGraph: {
    title: 'Book | Pema Wellness',
    description:
      'A wellness resort curated with programs that are customized to heal the harmony between the body, mind, and spirit, Pema Wellness is a purpose-driven resort that restores your holistic healing and enlightened wisdom. Get away from the stresses and strains of everyday life on one of our healing packages and improve your life.',
    url: 'https://pemawellness.com',
  },
}

export default function Page() {
  return <Booking />
}
