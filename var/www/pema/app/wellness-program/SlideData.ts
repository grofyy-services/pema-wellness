import { wellnessSubProgramsRoutes } from '@/utils/utils'

type Item = {
  title: string
  id: number
  subtitle: string
  hashId?: string
  path: string
}

type DataItem = {
  id: number
  imgWebURL: string
  hashId?: string

  tab: string
  pointers: Item[]
}

export const slidesData: DataItem[] = [
  {
    id: 1,
    tab: 'Experiential programs',
    imgWebURL: '/images/wellness-program/slide-1-web.webp',
    hashId: 'experiential-programs',
    pointers: [
      {
        id: 1,
        title: 'Reset & relax',
        subtitle:
          'A light, personalised introduction to Pema’s healing therapies ideal for those beginning their wellness journey.',
        path: wellnessSubProgramsRoutes.resetRelax,
        hashId: 'reset-relax',
      },
      {
        id: 2,
        title: 'Wellness celebrations',
        subtitle:
          'A bespoke wellness experience designed for birthdays, milestones, or solo retreats blending healing, reflection, and joy.',
        path: '#contact-us',
        hashId: 'bespoke',
      },
    ],
  },
  {
    id: 2,
    tab: 'Detox & cleansing',
    imgWebURL: '/images/wellness-program/slide-2-web.webp',
    hashId: 'detox-cleansing',
    pointers: [
      {
        id: 1,
        title: 'Pema signature detox',
        subtitle:
          'A full-spectrum cellular cleanse that strengthens immunity, restores gut function, and resets your body’s natural rhythm.',
        path: wellnessSubProgramsRoutes.pemaSignature,
      },
      {
        id: 2,
        title: 'Gentle detox',
        subtitle:
          'A soft, food-based detox designed for sensitive systems, chronic conditions, or post-treatment recovery.',
        path: wellnessSubProgramsRoutes.gentleDetox,
      },
      {
        id: 3,
        title: 'Breathe easy',
        subtitle:
          'A respiratory healing protocol that clears inflammation, improves lung capacity, and enhances oxygen flow and energy.',
        path: wellnessSubProgramsRoutes.breatheEasy,
      },
    ],
  },
  {
    id: 3,
    tab: 'Mind-body wellness',
    imgWebURL: '/images/wellness-program/slide-3-web.webp',
    hashId: 'mind-body-health',
    pointers: [
      {
        id: 1,
        title: 'Strength and stamina reboot',
        subtitle:
          'A personalised fitness reset that rebuilds energy, flexibility, and strength through guided movement and restorative care.',
        path: wellnessSubProgramsRoutes.strengthAndStaminaReboot,
        hashId: 'stress-stamina',
      },
      {
        id: 2,
        title: 'Calm & clarity',
        subtitle:
          'A stress recovery protocol that calms the nervous system, eases anxiety, and restores emotional resilience.',
        path: wellnessSubProgramsRoutes.calmAndClarity,
        hashId: 'calm-clarity',
      },
      {
        id: 3,
        title: 'Deep sleep sanctuary',
        subtitle:
          'A neurological reset to regulate your sleep cycles, improve overnight recovery, and restore mental clarity.',
        path: wellnessSubProgramsRoutes.deepSleepSanctuary,
        hashId: 'deep-sleep',
      },
    ],
  },
  {
    id: 4,
    tab: 'Anti-ageing & longevity retreats',
    imgWebURL: '/images/wellness-program/slide-4-web.webp',
    hashId: 'anti-ageing-retreats',
    pointers: [
      {
        id: 1,
        title: 'Age well',
        subtitle:
          'A graceful ageing protocol to support skin elasticity, joint health, and cognitive clarity through cellular regeneration.',
        path: wellnessSubProgramsRoutes.ageWell,
        hashId: 'age-well',
      },
      {
        id: 2,
        title: 'Hair vitality boost',
        subtitle:
          'A targeted plan to reduce hair fall, improve scalp health, and stimulate healthy regrowth from root to follicle.',
        path: wellnessSubProgramsRoutes.hairVitalityBoost,
        hashId: 'hair-vitality',
      },
      {
        id: 3,
        title: 'Facial skin renewal',
        subtitle:
          'A skin rejuvenation journey designed to refine texture, even tone, and restore natural glow without harsh treatments.',
        path: wellnessSubProgramsRoutes.facialSkinRenewal,
        hashId: 'facial-renewal',
      },
    ],
  },
]
