import { medicalSubProgramsRoutes } from '@/utils/utils'

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
    tab: 'Specialised health retreats',
    imgWebURL: '/images/medical-health-program/medical-slide-1.webp',
    hashId: 'specialised-health',
    pointers: [
      {
        id: 1,
        title: 'Cardiac health reset',
        subtitle:
          'Strengthens cardiovascular function and reduces hypertension risk through lifestyle medicine and doctor-led, non-invasive therapies.',
        path: medicalSubProgramsRoutes.cardiacHealthReset,
        hashId: 'cardiac-health',
      },
      {
        id: 2,
        title: 'Diabetes care',
        subtitle:
          'Reduces blood sugar levels and insulin dependence through naturopathic protocols, diet correction, and root-cause healing.',
        path: medicalSubProgramsRoutes.diabetesCare,
        hashId: 'diabetes-care',
      },
      {
        id: 3,
        title: `Women's health`,
        subtitle:
          'A deeply supportive program for hormonal balance, menstrual health, and life-stage transitions, drug-free and clinically effective.',
        path: medicalSubProgramsRoutes.womensHealth,
        hashId: 'womens-health',
      },
      {
        id: 4,
        title: `Women's fertility`,
        subtitle:
          'Improves ovulatory function and reproductive vitality through detox, acupuncture, nutrition, and hormone realignment.',
        path: medicalSubProgramsRoutes.womensFertility,
        hashId: 'fertility',
      },
      {
        id: 5,
        title: 'Pre In vitro fertilisation (IVF)',
        subtitle:
          'Optimises IVF outcomes by priming the body, clearing toxins, regulating cycles, and enhancing uterine receptivity.',
        path: medicalSubProgramsRoutes.preInVitroFertilizationIvf,
      },
      {
        id: 6,
        title: 'Men’s fertility',
        subtitle:
          'Enhances male reproductive health through targeted detox, sperm quality improvement, and endocrine system restoration.',
        path: medicalSubProgramsRoutes.mensFertility,
      },
    ],
  },
  {
    id: 2,
    tab: 'Detox & cleansing',
    imgWebURL: '/images/medical-health-program/medical-slide-2.webp',
    hashId: 'detox',
    pointers: [
      {
        id: 1,
        title: 'Pema signature detox',
        subtitle:
          'Our most advanced, all-systems cleanse, crafted to eliminate deep-rooted toxins, reset organ health, and renew your body’s innate vitality.',
        path: medicalSubProgramsRoutes.pemaSignature,
      },
      {
        id: 2,
        title: 'Gentle detox',
        subtitle:
          'A nurturing, full-body purification that supports natural detox pathways through hydrotherapy, nutrition, and subtle healing therapies.',
        path: medicalSubProgramsRoutes.gentleDetox,
      },
      {
        id: 3,
        title: 'Breathe easy',
        subtitle:
          'A focused respiratory renewal, clearing inflammation, deepening breath capacity, and restoring calm through yogic kriyas and naturopathic medicine.',
        path: medicalSubProgramsRoutes.breatheEasy,
      },
    ],
  },
  {
    id: 3,
    tab: 'Metabolic health',
    imgWebURL: '/images/medical-health-program/medical-slide-3.webp',
    hashId: 'metabolic-health',
    pointers: [
      {
        id: 1,
        title: 'Metabolic balance',
        subtitle:
          'Designed for hormonal and metabolic rebalancing this protocol restores energy, regulates weight, and stabilises insulin and cortisol levels.',
        path: medicalSubProgramsRoutes.metabolicBalance,
        hashId: 'metabolic-balance',
      },
      {
        id: 2,
        title: 'Liver vitality cleanse',
        subtitle:
          'An intensive cleanse to revive liver function, improve digestion, and flush metabolic waste with targeted acupuncture and herbal therapies.',
        path: medicalSubProgramsRoutes.liverVitalityCleanse,
        hashId: 'liver-vitality',
      },
      {
        id: 3,
        title: 'Gut biome reset',
        subtitle:
          'A complete digestive reset, eliminating irritants, restoring microbial balance, and strengthening gut-brain harmony.',
        path: medicalSubProgramsRoutes.gutBiomeReset,
        hashId: 'gut-biome',
      },
    ],
  },
  {
    id: 4,
    tab: 'Stress & lifestyle management',
    imgWebURL: '/images/medical-health-program/medical-slide-4.webp',
    hashId: 'stress-managament',
    pointers: [
      {
        id: 1,
        title: 'Calm & clarity',
        subtitle:
          'Engineered for modern burnout, this protocol soothes the nervous system, calms inflammation, and restores emotional equilibrium.',
        path: medicalSubProgramsRoutes.calmAndClarity,
      },
      {
        id: 2,
        title: 'Deep sleep sanctuary',
        subtitle:
          'A Neurological reset to regulate your circadian rhythm, relieve anxiety, and restore the body’s most critical healing process: sleep.',
        path: medicalSubProgramsRoutes.deepSleepSanctuary,
      },
    ],
  },
  {
    id: 5,
    tab: 'Pain & injury recovery',
    imgWebURL: '/images/medical-health-program/medical-slide-5.webp',
    hashId: 'pain-recovery',
    pointers: [
      {
        id: 1,
        title: 'Strength and stamina reboot',
        subtitle:
          'Rebuild post-illness strength, immunity, and energy with therapeutic movement, restorative nutrition, and medical oversight.',
        path: medicalSubProgramsRoutes.strengthAndStaminaReboot,
      },
      {
        id: 2,
        title: 'Sports & surgical rehabilitation',
        subtitle:
          'Precision recovery for injury and post-op healing, integrating physiotherapy, pain relief therapies, and physical reconditioning.',
        path: medicalSubProgramsRoutes.sportsSurgicalRehabilitation,
        hashId: 'sports-rehabilitation',
      },
      {
        id: 3,
        title: 'Nerve healing haven',
        subtitle:
          'Dedicated to neural repair, supporting recovery from nerve damage, muscular weakness, and chronic discomfort.',
        path: medicalSubProgramsRoutes.nerveHealingHaven,
        hashId: 'nerve-healing',
      },
      {
        id: 4,
        title: 'Pain-free living',
        subtitle:
          'A complete pain relief system using naturopathic, physical, and Chinese medicine therapies to return your body to comfort and flow.',
        path: medicalSubProgramsRoutes.painFreeLiving,
        hashId: 'pain-management',
      },
    ],
  },
]
