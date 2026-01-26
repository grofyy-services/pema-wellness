import { Metadata } from 'next'
import { programDetails } from './program'
import Medical from './Medical'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const programData = programDetails.find((item) => item.id === slug)

  return {
    title: programData?.program_name,
    description: programData?.header_text,
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  await params
  return <Medical />
}
