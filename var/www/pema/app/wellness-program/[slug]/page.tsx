import { Metadata } from 'next'
import Wellness from './Wellness'
import { programDetails } from './program'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const programData = programDetails.find((item) => item.id === params.slug)

  return {
    title: programData?.program_name,
    description: programData?.header_text,
  }
}

export default function ProgramPage({ params }: { params: { slug: string } }) {
  return <Wellness />
}
