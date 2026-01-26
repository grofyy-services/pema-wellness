type Item = {
  title: string
  id: number
  subtitle: string
  hashId?: string
  path?: string
}

type DataItem = {
  id: number
  imgWebURL: string
  hashId?: string

  tab: string
}

export const slidesData: DataItem[] = [
  {
    id: 1,
    tab: 'Naturopathy Doctor',
    imgWebURL: '/images/sanctury/slide-1.webp',
    hashId: 'experiential-programs',
  },
  {
    id: 2,
    tab: 'Acupuncturist',
    imgWebURL: '/images/sanctury/slide-2.webp',
    hashId: 'detox-cleansing',
  },
  {
    id: 3,
    tab: 'Physiotherapist',
    imgWebURL: '/images/sanctury/slide-3.webp',
    hashId: 'mind-body-health',
  },
  {
    id: 4,
    tab: 'Healer',
    imgWebURL: '/images/sanctury/slide-4.webp',
    hashId: 'anti-ageing-retreats',
  },
  {
    id: 5,
    tab: 'Ozone Specialist',
    imgWebURL: '/images/sanctury/slide-5.webp',
    hashId: 'anti-ageing-retreats',
  },
  {
    id: 6,
    tab: 'Culinary Nutritionist',
    imgWebURL: '/images/sanctury/slide-6.webp',
    hashId: 'anti-ageing-retreats',
  },
  {
    id: 7,
    tab: 'Yoga Expert',
    imgWebURL: '/images/sanctury/slide-7.webp',
    hashId: 'anti-ageing-retreats',
  },
]
