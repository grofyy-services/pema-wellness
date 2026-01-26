import { videoURLS } from '@/utils/utils'
import type { ProgramDetail } from '@/utils/types'
import {
  chefRajiv,
  doctorMuthu,
  doctorNaveed,
  doctorRamya,
  doctorSangeetha,
  doctorSarath,
  professorPrahalad,
} from './ExpertsTeam'

export const programDetails: ProgramDetail[] = [
  //pema signature detox
  {
    id: 'pema-signature-detox',
    program_name: 'Pema Signature Detox',
    header_text: 'Finally, a Full-Body Detox That Works at the Root',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Pema Signature Detox',
      video_url: videoURLS.naiomeHarris,
      testimonial_text: `‘I was there for nearly a month and so I was having like 3 massages a day and they were all exceptional.’`,
      user_name: `'Bond Girl', Hollywood Actor`,
    },
    program_quote: `If you’re feeling bloated, inflamed, or low on energy, this medical-grade detox helps eliminate toxins, reset your digestion, and revive long-term vitality — naturally.`,
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        `Fatigue that doesn’t improve with rest`,
        `Bloating, sluggish digestion, or irregular metabolism`,
        `Frequent colds, skin issues, or inflammatory flare-ups`,
        `Feeling heavy, foggy, or stuck despite healthy efforts`,
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The guide',
      sub_text: `At Pema Wellness, our Signature Detox protocol has helped thousands eliminate deep-rooted toxicity and regain clarity, lightness, and internal balance. Guided by Pema’s philosophy, this program resets the body at a cellular level — without extreme fasting or strain.`,
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: `Why do most detoxes not work long-term?`,
      subText2: `They only address surface-level symptoms. Pema’s naturopathic detox corrects dysfunction at the source:`,
      problems: [
        'Toxic overload',
        'Sluggish liver ',
        'Digestive stagnation',
        'Inflammation',
        'Nervous system fatigue',
      ],
      solutions: [
        'Personalised elimination strategies',
        'Hydrotherapy and liver cleanses',
        'Fasting, mud packs, and abdominal therapy',
        'Anti-inflammatory naturopathic treatments',
        'Breathwork and energy alignment',
      ],
    },
    inside_program: {
      title: 'Your deep detox protocol',
      sub_title: 'Our Signature Detox program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Elimination',
      phase2: 'Deep Detox',
      phase3: 'Holistic Reset',
      phases: [
        {
          id: 1,
          title: 'Elimination',
          imgWeb: '/images/medical-health-program/sub-programs/phase-1-web.webp',
          imgMobile: '/images/medical-health-program/sub-programs/phase-1-mobile.webp',
          pointers: [
            `Transition to clean, nourishing foods`,
            `Mild withdrawal (sugar, processed foods)`,
            `Organs begin detox support`,
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Deep Detox',
          imgWeb: '/images/medical-health-program/sub-programs/phase-2-web.webp',
          imgMobile: '/images/medical-health-program/sub-programs/phase-2-mobile.webp',
          pointers: [
            `Peak detox symptoms: fatigue, headaches`,
            `Toxins release from deeper tissues`,
            `Energy dips as the body focuses on repair`,
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Holistic Reset',
          imgWeb: '/images/medical-health-program/sub-programs/phase-3-web.webp',
          imgMobile: '/images/medical-health-program/sub-programs/phase-3-mobile.webp',
          pointers: [
            `Lighter body, clearer skin, better digestion`,
            `Sharper focus, stable mood`,
            `Systems begin to rebalance`,
          ],
          note: '',
        },
      ],
    },
    experts: {
      heading: 'Your signature detox team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: `Kiran M., 30-day program`,
          id: 1,
          review: `"I came to reset, but I left with more than that. I left with new habits, new clarity, and a body that finally feels like mine again."`,
        },
        {
          name: 'Anita D., 3-month follow-up',
          id: 2,
          review: ` "I couldn’t believe how quickly my skin, digestion, and energy transformed. This isn’t a diet. It’s healing from the inside out."`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day program',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day comprehensive program',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // gentle detox
  {
    id: 'gentle-detox',
    program_name: 'Gentle Detox',
    header_text: 'The World’s Most Comfortable Detox, Designed for Sensitive Systems',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Gentle Detox',
      video_url: videoURLS.payalJain,
      testimonial_text:
        "‘What I find very special about Pema is that it's the perfect blend of the East and West. So they have taken the best of the Indian pranayama healing techniques, food, ingredients, a menu...' ",
      user_name: 'Payal Jain',
    },
    program_quote:
      "If your body feels inflamed, tired, or foggy, but you can't handle harsh cleanses, this is a clinically designed reset that heals gently, deeply, and without depletion.",
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'You feel bloated, foggy, or heavy, even when eating “healthy”',
        "You've tried detoxes that left you more drained than restored",
        'Your system is too sensitive for intense purging or colonics',
        'You live with autoimmunity, chronic stress, or post-illness fatigue',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The guide',
      sub_text:
        'At Pema Wellness, the Gentle Detox was created for those who need restoration without intensity. Unlike one-size-fits-all cleanses, this program is medically designed to help you reset your energy, gut, and hormones using food-based healing, hydrotherapy, and nervous system regulation — especially effective for guests with chronic conditions or post-treatment recovery.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Most cleanses only flush the body without fixing what caused the overload.',
      subText2:
        'At Pema, we help your system gently return to balance by addressing the underlying dysfunctions:',
      problems: ['Toxic buildup', 'Gut inflammation', 'Hormonal imbalances', 'Low metabolic fire'],
      solutions: [
        'Food-based detox and lymphatic drainage',
        'Wraps and packs, hydrotherapy, and fasting',
        'Nervous system restoration',
        'Gentle reactivation through movement, breath, and gut-healing meals',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Our Gentle Detox Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
  Our team will guide you after a personalised assessment.`,
      phase1: 'Gentle Preparation',
      phase2: 'Therapeutic Support',
      phase3: 'Integration and Ease',
      phases: [
        {
          id: 1,
          title: 'Gentle Preparation',
          imgWeb: '/images/medical-health-program/sub-programs/gentle-detox/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/gentle-detox/1.webp',
          pointers: [
            'Medical consultation and detox readiness assessment',
            'Clean eating, hydrotherapy, and minor manipulative sessions',
            'Breathwork and yoga for nervous system grounding',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Therapeutic Support',
          imgWeb: '/images/medical-health-program/sub-programs/gentle-detox/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/gentle-detox/2.webp',
          pointers: [
            'Wraps and packs, cleansing therapies, and digestive reset',
            'Plant-based detox meals tailored to your constitution',
            'Daily yoga, pranayama, and therapeutic movement',
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Integration and Ease',
          imgWeb: '/images/medical-health-program/sub-programs/gentle-detox/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/gentle-detox/3.webp',
          pointers: [
            'Food reintroduction and hormone-friendly nutrition',
            'Post-detox plan to maintain energy and immunity',
            'Take-home protocols and expert follow-up',
          ],
          note: '',
        },
      ],
    },
    experts: {
      heading: 'Your Gentle Detox Team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Isabelle L., wellness journalist, London',
          id: 1,
          review:
            '“I’ve done detox retreats in Spain and Bali, but nothing felt this safe, intelligent, or nourishing. I didn’t think deep healing could feel this easy.”',
        },
        {
          name: 'Nadine K., 20-day guest, UAE',
          id: 2,
          review:
            '“My chronic fatigue syndrome has kept me on edge for years. I came to Pema scared to try another cleanse — and left crying with relief.”',
        },
        {
          name: 'Samantha C., actress and producer, Los Angeles',
          id: 3,
          review:
            '“Unlike every other place I’ve been to, this detox didn’t push me. It understood me.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Detox Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Comprehensive Detox',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },

  // 'breathe-easy',

  {
    id: 'breathe-easy',
    program_name: 'Breathe Easy',
    header_text: '“I didn’t know how badly I was breathing — until I finally could.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Breathe Easy',
      video_url: videoURLS.amitBansal, // replace with actual link
      testimonial_text: `‘I feel that Pema is the best wellness center in the world that I have been to.’`,
      user_name: 'Amit Bansal',
    },
    program_quote: `If asthma, allergies, or laboured breathing have become part of your daily life, this program helps you breathe deeply, freely, and without medication dependency.`,
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        `Breathlessness with minimal exertion`,
        `Chronic sinus issues, wheezing, or asthma attacks`,
        `Constant congestion, tight chest, or shallow breathing`,
        `Reliance on inhalers or antihistamines`,
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The guide',
      sub_text: `At Pema Wellness, we treat the breath not as a symptom — but as a gateway. This program is built around naturopathic detox, energy alignment, and Traditional Chinese Medicine to clear the respiratory system, open energy channels, and restore full-body oxygenation.`,
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: `Most respiratory conditions are treated with suppressants, not solutions.`,
      subText2: `At Pema, we work at the physiological and energetic roots of breathing dysfunction:`,
      problems: [
        'Mucosal inflammation',
        'Lung qi stagnation',
        'Environmental toxicity',
        'Nervous system constriction',
      ],
      solutions: [
        'Naturopathy detox and hydrotherapy',
        'Acupuncture and breath alignment',
        'Ozone therapy and respiratory cleansing',
        'Yogic breathing and vagal regulation',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Breathe Easy Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
  Our team will guide you after a personalised assessment.`,
      phase1: 'Respiratory Detox & Opening',
      phase2: 'Lung Function & Energy Reset',
      phase3: 'Long-Term Respiratory Support',
      phases: [
        {
          id: 1,
          title: 'Respiratory Detox & Opening',
          imgWeb: '/images/medical-health-program/sub-programs/breathe-easy/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/breathe-easy/1.webp',
          pointers: [
            'Respiratory diagnostics and pulmonary assessment',
            'Hydrotherapy and naturopathy therapies to clear congestion',
            'Intro to guided breathwork and pranic grounding',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Lung Function & Energy Reset',
          imgWeb: '/images/medical-health-program/sub-programs/breathe-easy/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/breathe-easy/2.webp',
          pointers: [
            'Acupuncture, oxygen therapy, and lung-clearing cuisine',
            'Breath-led yoga, sinus therapies, and movement',
            'Emotional and energetic unblocking of the chest area',
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Long-Term Respiratory Support',
          imgWeb: '/images/medical-health-program/sub-programs/breathe-easy/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/breathe-easy/3.webp',
          pointers: [
            'Lifestyle plan for clean breathing and lung protection',
            'Techniques for stress-based breath pattern correction',
            'Home breath ritual and diet-based lung maintenance',
          ],
          note: '',
        },
      ],
    },
    experts: {
      heading: 'Your Respiratory Restoration Team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Andrea M., yoga teacher, Sydney',
          id: 1,
          review: `"I used to carry an inhaler everywhere. Now I carry none."`,
        },
        {
          name: 'Omar Z., visual artist, Dubai',
          id: 2,
          review: `"For the first time in years, I woke up and my chest didn’t feel tight. That freedom? You can’t explain it — only feel it."`,
        },
        {
          name: 'Kimiko T., fashion executive, Tokyo',
          id: 3,
          review: `"I came here scared I’d be on meds for life. I left with my breath back."`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Breath Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Lung Function Program',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },
  //metabolic balance
  {
    id: 'metabolic-balance',
    program_name: 'Metabolic Balance',
    header_text: '“My body isn’t working against me anymore — it’s finally working with me.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Metabolic Balance',
      video_url: videoURLS.anuragKashyap, // replace with actual link
      testimonial_text: `‘I lost 27 kgs over two visits, halved my statins, rebuilt my health, and reclaimed control of my life. What Pema gives you isn’t just treatment, it's understanding, routine, and the power to reset your mind and body.’`,
      user_name: 'Anurag Kashyap, Bollywood Director And Actor',
    },
    program_quote: `If you’re dealing with weight fluctuations, insulin resistance, thyroid concerns, or stubborn fatigue, this program helps restore your body’s metabolic rhythm — naturally.`,
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        `Unexplained weight gain or bloating, even with healthy habits`,
        `Constant fatigue or brain fog after meals`,
        `Sugar cravings, mood dips, or poor sleep`,
        `Diagnosed with thyroid issues, prediabetes, or PCOS but no lasting results`,
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The guide',
      sub_text: `At Pema Wellness, we treat metabolism as a system — not a symptom. This program is built around deep diagnostic mapping and Pema’s naturopathic protocols to restore metabolic function, balance hormones, and support long-term weight and energy regulation.`,
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: `Most weight or energy programs are built on calorie counts and willpower.`,
      subText2: `We work deeper — on the imbalances that disrupt metabolism:`,
      problems: [
        'Hormonal dysregulation',
        'Inflammation',
        'Insulin resistance',
        'Thyroid stagnation',
      ],
      solutions: [
        'Natural endocrine support, yoga, acupuncture',
        'Anti-inflammatory therapies, therapeutic fasting',
        'Targeted food protocols and glucose control',
        'Detox pathways, micronutrient therapy, breathwork',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Metabolic Balance Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
  Our team will guide you after a personalised assessment.`,
      phase1: 'Diagnostic Reset',
      phase2: 'Core Metabolic Activation',
      phase3: 'Sustainable Balance Integration',
      phases: [
        {
          id: 1,
          title: 'Diagnostic Reset',
          imgWeb: '/images/medical-health-program/sub-programs/metabolic-balance/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/metabolic-balance/1.webp',
          pointers: [
            'Full metabolic panel and constitutional assessment',
            'Elimination diet and mild detoxification',
            'Pranic grounding and sleep cycle mapping',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Core Metabolic Activation',
          imgWeb: '/images/medical-health-program/sub-programs/metabolic-balance/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/metabolic-balance/2.webp',
          pointers: [
            'Acupuncture, hydrotherapy, and oxygenation',
            'Therapeutic fasting and metabolic cuisine',
            'Hormonal rhythm realignment (adrenals, thyroid, insulin)',
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Sustainable Balance Integration',
          imgWeb: '/images/medical-health-program/sub-programs/metabolic-balance/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/metabolic-balance/3.webp',
          pointers: [
            'Personalised metabolic nutrition protocol',
            'Daily breathwork, movement, and rest rhythm planning',
            'Natural supplement* plan and at-home endocrine balance plan',
          ],
          note: `**At Pema, natural supplements refer to therapeutic food combinations, plant and herb based water infusions, different roots, leaves and pulses —designed to gently support nutrient absorption and bioavailability.`,
        },
      ],
    },
    experts: {
      heading: 'Your Metabolic Health Team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Eva M., health coach, London',
          id: 1,
          review: `"I came here at war with my body. Now, I understand it — and I’m finally at peace with it."`,
        },
        {
          name: 'Dr. Zoya Khan, endocrinologist, Abu Dhabi',
          id: 2,
          review: `"My thyroid, insulin, and gut were a mess. This wasn’t a weight loss retreat. It was a full-body correction."`,
        },
        {
          name: 'Kira L., art director, Berlin',
          id: 3,
          review: `"I haven’t craved sugar or caffeine since I left. I didn’t expect that. But my body just… recalibrated."`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Metabolic Kickstart',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Hormonal Reboot',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },
  //liver vitality cleanse
  {
    id: 'liver-vitality-cleanse',
    program_name: 'Liver Vitality Cleanse',
    header_text: '“My energy returned. My skin cleared. I didn’t know it was my liver all along.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Liver Vitality Cleanse',
      video_url: videoURLS.prafulPatel, // replace with actual link
      testimonial_text: `‘I am so happy that I came. Though I could come for a few days, I am sure I will be coming here again.’`,
      user_name: `Praful Patel, Member of Rajya Sabha`,
    },
    program_quote: `When your liver is overloaded, it impacts everything, from energy and digestion to skin, sleep, and hormonal balance. This program helps you reset from the inside out.`,
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Fatigue, brain fog, or heaviness after meals',
        'Breakouts, dull skin, or unexplained rashes',
        'Sluggish digestion or food sensitivities',
        'Hormonal imbalance, PMS, or irritability',
        'History of alcohol, medications, or toxin exposure',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The guide',
      sub_text: `At Pema Wellness, we don’t just support the liver, we help it regenerate. This cleanse is rooted in Pema’s naturopathic system, combining acupuncture, hydrotherapy, fasting, and food-based detox to restore liver function, clear toxins, and renew your body’s vitality.`,
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: `Conventional detoxes only flush the system.`,
      subText2: `We work on healing the organ itself, while protecting its energetic and hormonal pathways:`,
      problems: ['Liver congestion', 'Toxin accumulation', 'Hormonal overflow', 'Skin eruptions'],
      solutions: [
        'Hydrotherapy and naturopathy massages',
        'Fasting, oxygenation, lymphatic therapy',
        'Endocrine reset via liver cleansing',
        'Gut-liver axis support and anti-inflammatory cuisine',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Liver Vitality Cleanse Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Liver Assessment & Drainage',
      phase2: 'Liver Regeneration & Vitality Boost',
      phase3: 'Maintenance & Hormonal Integration',
      phases: [
        {
          id: 1,
          title: 'Liver Assessment & Drainage',
          imgWeb: '/images/medical-health-program/sub-programs/liver-vitality/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/liver-vitality/1.webp',
          pointers: [
            'Diagnostic analysis of liver stress and toxicity',
            'Mild detox with juices, hydrotherapy, wraps and packs',
            'Grounding therapies for cellular reset',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Liver Regeneration & Vitality Boost',
          imgWeb: '/images/medical-health-program/sub-programs/liver-vitality/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/liver-vitality/2.webp',
          pointers: [
            'Acupuncture and lymphatic stimulation',
            'Fasting therapy and natural diet supplementation* for liver support',
            'Deep detox meals with liver-cleansing ingredients',
          ],
          note: `**At Pema, natural supplements refer to therapeutic food combinations, plant and herb based water infusions, different roots, leaves and pulses —designed to gently support nutrient absorption and bioavailability.`,
        },
        {
          id: 3,
          title: 'Maintenance & Hormonal Integration',
          imgWeb: '/images/medical-health-program/sub-programs/liver-vitality/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/liver-vitality/3.webp',
          pointers: [
            'Endocrine support for hormonal balance',
            'Skin and gut restoration via the liver axis',
            'Personalised take-home plan for long-term liver health',
          ],
          note: '',
        },
      ],
    },
    experts: {
      heading: 'Your Liver Health Team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Amara S., stylist, Dubai',
          id: 1,
          review: `"I used to have breakouts and mood swings for weeks. After this, my skin and my cycle are both clear."`,
        },
        {
          name: 'Jonathan H., CFO, Hong Kong',
          id: 2,
          review: `"My liver tests showed improvement within 10 days. I haven’t touched coffee since — and I don’t need it."`,
        },
        {
          name: 'Lucie V., skincare founder, Paris',
          id: 3,
          review: `"Pema gave me back my glow. That’s not vanity — it’s my body finally functioning."`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Liver Cleanse',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Regenerative Detox',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  //gut biome reset
  {
    id: 'gut-biome-reset',
    program_name: 'Gut Biome Reset',
    header_text: 'Finally, relief from digestive issues that actually lasts.',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Gut Biome Reset',
      video_url: null, // replace with actual video path
      testimonial_text:
        '“After a year on 12 pills a day for chronic pain, anxiety, depression, and insomnia — I’ve now gone 3 weeks without a single medication. My stomach pain is gone, my anxiety has eased, I sleep better, and I finally feel like myself again.”',
      user_name: 'Ms. Mercedes Jahanzadeh',
    },
    program_quote:
      "If you're tired of bloating, IBS, acid reflux, and food sensitivities ruling your life, Pema’s protocols can restore your gut health naturally.",
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Avoiding foods you love because they trigger symptoms.',
        'Feeling bloated and uncomfortable after every meal.',
        'Trying endless supplements with no lasting relief.',
        'Missing social events because of unpredictable digestion.',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        "At Pema Wellness, we've helped over 2,000 guests overcome digestive disorders using Pema's proven naturopathic approach. Unlike temporary fixes, we address the root causes of gut dysfunction.",
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Why conventional treatments often fail',
      subText2:
        'Most digestive treatments only suppress symptoms. Pema’s approach identifies and corrects the underlying imbalances.',
      problems: [
        'Intestinal inflammation',
        'Bacterial overgrowth',
        'Compromised gut barrier',
        'Digestive enzyme deficiency',
        'Stress-gut connection',
      ],
      solutions: [
        'Anti-inflammatory protocols',
        'Targeted gut microbiome restoration',
        'Intestinal healing therapies',
        'Natural enzyme support',
        'Nervous system regulation',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Gut Biome Reset Program ',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Assessment & Cleansing',
      phase2: 'Healing & Restoration',
      phase3: 'Rebuilding & Maintenance',
      phases: [
        {
          id: 1,
          title: 'Assessment & Cleansing',
          imgWeb: '/images/medical-health-program/sub-programs/phase-1-web.webp',
          imgMobile: '/images/medical-health-program/sub-programs/phase-1-mobile.webp',
          pointers: [
            'Comprehensive digestive analysis',
            'Gentle detoxification to reduce toxic burden',
            'Elimination diet to identify triggers',
          ],
        },
        {
          id: 2,
          title: 'Healing & Restoration',
          imgWeb: '/images/medical-health-program/sub-programs/phase-2-web.webp',
          imgMobile: '/images/medical-health-program/sub-programs/phase-2-mobile.webp',
          pointers: [
            'Targeted therapies to heal intestinal lining',
            'Probiotic and prebiotic protocols',
            'Digestive enzyme optimisation',
            'Stress reduction techniques',
          ],
        },
        {
          id: 3,
          title: 'Rebuilding & Maintenance',
          imgWeb: '/images/medical-health-program/sub-programs/phase-3-web.webp',
          imgMobile: '/images/medical-health-program/sub-programs/phase-3-mobile.webp',
          pointers: [
            'Gradual food reintroduction',
            'Personalised nutrition plan',
            'Long-term gut health strategies',
            'Home protocol development',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Gut Reset Team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Arup Chauhan',
          review:
            '“I feel lighter, fresher, and more energized, with no inflammation or bloating thanks to eating right. I plan to maintain a diet of 50% vegetables, 25% natural proteins, and 25% healthy carbs and fats, while reducing coffee, alcohol, and discontinuing non-veg.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Program',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Comprehensive Program',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },
  //cardiac health reset
  {
    id: 'cardiac-health-reset',
    program_name: 'Cardiac Health Reset',
    header_text:
      '“I didn’t wait for a second scare. I came to Pema to understand what my heart actually needed — before it became urgent.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Cardiac Health Reset',
      video_url: videoURLS.anuragKashyap, // replace with actual video link
      testimonial_text:
        '“I lost 27 kgs over two visits, halved my statins, rebuilt my health, and reclaimed control of my life. What Pema gives you isn’t just treatment, it’s understanding, routine, and the power to reset your mind and body.”',
      user_name: 'Anurag Kashyap, Bollywood Director and Actor',
    },
    program_quote:
      'Whether you’re recovering from a heart event, living with hypertension, or aiming to prevent future risks, this program helps you reset cardiovascular health from the inside out.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Fluctuating or high blood pressure',
        'Post-angioplasty fatigue or stress',
        'Family history of heart disease',
        'Emotional weight or anxiety after a cardiac event',
        'Wanting to reduce dependence on medication',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema, we take a preventive and restorative approach to heart health. We look beyond test results — addressing inflammation, circulation, stress, and lifestyle patterns that silently affect the cardiovascular system.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Most cardiac care stops at medication.',
      subText2: 'We support the body in healing from within.',
      problems: [
        'Chronic inflammation',
        'Arterial stiffness',
        'Autonomic imbalance',
        'Lifestyle strain',
      ],
      solutions: [
        'Detox, hydrotherapy',
        'Yoga therapy, blood flow regulation',
        'Meditation, breathwork, acupuncture',
        'Naturopathic guidance, stress reset',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Cardiac Health Reset Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: `Cardiovascular Baseline 
      & Detox`,
      phase2: `Vascular Healing 
      & Nervous System Reset`,
      phase3: `Lifestyle integrations &
Long-term Strategy`,
      phases: [
        {
          id: 1,
          title: 'Cardiovascular Baseline & Detox',
          imgWeb: '/images/medical-health-program/sub-programs/cardiac-health-reset/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/cardiac-health-reset/1.webp',
          pointers: [
            'BP profiling, ECG, and stress diagnostics',
            'Mild detoxification and salt-balancing hydrotherapy',
            'Guided rest and heart-focused breathing techniques',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Vascular Healing & Nervous System Reset',
          imgWeb: '/images/medical-health-program/sub-programs/cardiac-health-reset/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/cardiac-health-reset/2.webp',
          pointers: [
            'Acupuncture and energy regulation',
            'Therapeutic yoga for circulation and cardiac strength',
            'Anti-inflammatory, heart-healthy cuisine',
          ],
        },
        {
          id: 3,
          title: 'Lifestyle Integration & Long-term Strategy',
          imgWeb: '/images/medical-health-program/sub-programs/cardiac-health-reset/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/cardiac-health-reset/3.webp',
          pointers: [
            'Sustainable diet and movement plan',
            'Breath and heart rate variability training',
            'Take-home roadmap for cardiac longevity',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Cardiac Recovery Team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Dev A., media executive, Dubai',
          review:
            '“I didn’t want to rely on pills forever. Pema helped me stabilise my pressure, clear my mind, and feel strong again.”',
        },
        {
          id: 2,
          name: 'Susan R., retired lawyer, Sydney',
          review:
            '“My doctors had done all they could. This was the piece they never offered — and it made all the difference.”',
        },
        {
          id: 3,
          name: 'Mukul S., investor, Singapore',
          review:
            '“I feel clearer, lighter, and more in control of my health than I have in years.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Cardiac Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Recovery Program',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },
  //diabetes care
  {
    id: 'diabetes-care',
    program_name: 'Diabetes Care',
    header_text:
      '“I came in with high blood glucose, low energy, and a long list of meds. I left with clarity, and a plan that finally works.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Diabetes Care',
      video_url: null, // replace with actual video
      testimonial_text:
        '“Feeling much better—pain down ~75%, and blood sugar improved from 140 to 124 today. Excellent care (Drs. Syed, Muthu, Shivaji—ozone, Akanksha, Chandini), plus a great diet and amazing food with zero discomfort. COMRA reduced my hair fall. It’s my 4th visit to PEMA because it genuinely makes me happy.”',
      user_name: 'Lakshmi Prasana Velluri',
    },
    program_quote:
      "Whether you're newly diagnosed, struggling to stabilise your blood glucose, or tired of managing diabetes without real progress, this program offers a full-body reset with long-term support.",
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Blood glucose levels that keep fluctuating despite medication',
        'Constant fatigue, brain fog, and blood glucose crashes',
        'Early signs of neuropathy, vision issues, or inflammation',
        'Weight gain or insulin resistance',
        'A desire to reverse prediabetes or prevent complications',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema, we help your body regain its natural rhythm using naturopathic interventions. This program integrates fasting science, anti-inflammatory cuisine, therapeutic movement, and root-cause diagnostics — to gently reverse insulin resistance and rewire the glucose-hormone cycle.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Conventional treatments manage diabetes.',
      subText2: 'We work to undo it at the source.',
      problems: [
        'Insulin resistance',
        'Chronic inflammation',
        'Hormonal imbalance',
        'Pancreatic stress',
      ],
      solutions: [
        'Fasting protocols and insulin-sensitive therapies',
        'Detox and anti-inflammatory cuisine',
        'Acupuncture and endocrine alignment',
        'Digestive restoration and nervous system support',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Diabetes Care Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: `Metabolic Reset 
      & Blood Glucose Profiling`,
      phase2: `Cellular Healing 
      & Lifestyle Correction`,
      phase3: `Stabilisation 
      & Home Strategy`,
      phases: [
        {
          id: 1,
          title: 'Metabolic Reset & Blood Glucose Profiling',
          imgWeb: '/images/medical-health-program/sub-programs/diabetes-care/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/diabetes-care/1.webp',
          pointers: [
            'Fasting bloodwork and hormonal diagnostics',
            'Personalised naturopathic plan and salt-balancing hydrotherapy',
            'Introduction to anti-inflammatory meals and intermittent fasting',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Cellular Healing & Lifestyle Correction',
          imgWeb: '/images/medical-health-program/sub-programs/diabetes-care/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/diabetes-care/2.webp',
          pointers: [
            'Acupuncture and targeted detox to improve insulin sensitivity',
            'Digestive healing and maintaining stable glucose levels',
            'Therapeutic movement and insulin tracking',
          ],
        },
        {
          id: 3,
          title: 'Stabilisation & Home Strategy',
          imgWeb: '/images/medical-health-program/sub-programs/diabetes-care/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/diabetes-care/3.webp',
          pointers: [
            'Long-term diet and fasting plan based on your condition',
            'Breathwork and emotional regulation to reduce glucose spikes',
            'Take-home protocol for sustained glucose stability',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Diabetes Reversal Team',
      doctors: [
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Naturopathy doctor',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            `Nutritionist guided detox meals crafted with naturopathic principles`,
            `Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more`,
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            `Breathwork tailored to your needs`,
            `Low intensity workouts`,
            `Therapeutic yoga`,
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Ramesh V., hotelier, Singapore',
          review:
            '“My fasting blood glucose dropped by 40 points in 10 days. No new medication. Just a protocol that actually works.”',
        },
        {
          id: 2,
          name: 'Ms. Rachna Mehta',
          review:
            '“Pema’s tranquil setting, world-class treatments, and delicious food made my experience incredibly fulfilling.”',
        },
        {
          id: 3,
          name: 'Jason T., tech consultant, San Francisco',
          review:
            '“I’ve tried managing diabetes for 14 years. Pema made more progress in two weeks than anything else ever has.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Insulin Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Stabilisation Program',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },

  ///////////////////////////////////////////////////////

  //sports and surgical rehabilitation
  {
    id: 'sports-surgical-rehabilitation',
    program_name: 'Sports & Surgical Rehabilitation',
    header_text:
      '“After the surgery, everyone helped me walk again. Only Pema taught my body how to trust itself again.”',
    hero_img_web: '/images/medical-health-program/sub-programs/strength-stamina/hero-web.webp',
    hero_img_mobile:
      '/images/medical-health-program/sub-programs/strength-stamina/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Sports & Surgical Rehabilitation',
      video_url: videoURLS.rakulPreetSingh, // replace with actual link
      testimonial_text: `‘The best thing about Pema I feel is that the doctors are really aware of what they're doing.’`,
      user_name: 'Rakul Preet',
    },
    program_quote: `Whether you’re healing from surgery, injury, or overtraining, this program is designed to restore strength, mobility, and full-body function, without shortcuts or setbacks.`,
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Post-surgical stiffness, pain, or slow recovery',
        'Sports injury that hasn’t fully healed or keeps flaring up',
        'Reduced strength, balance, or range of motion',
        'Frustration with generic physiotherapy or incomplete rehab plans',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-1.webp',
      img2: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-2.webp',
      img3: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/guide.webp',
      heading: 'The Guide',
      sub_text: `At Pema Wellness, we don’t just help you recover — we rebuild you from the inside out. Led by Physiotherapists, this program combines manual therapy, acupuncture, yoga, electro-therapy, and targeted nutrition to accelerate post-operative healing and athletic recovery.`,
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: `Standard rehab focuses only on the injured area.`,
      subText2: `Our approach restores whole-body balance, because true healing is systemic:`,
      problems: [
        'Localised inflammation',
        'Scar tissue or stiffness',
        'Energy depletion',
        'Nutritional gaps',
      ],
      solutions: [
        'Physiotherapy, hydrotherapy, acupuncture, lymphatic drainage',
        'Fascia release, electro-therapy, yoga therapy',
        'Mitochondrial support and adrenal regulation',
        'Collagen-rich, anti-inflammatory cuisine',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Sports & Surgical Rehabilitation Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Diagnostic Mapping & Pain Reduction',
      phase2: 'Functional Recovery & Strength Rebuild',
      phase3: 'Long-Term Performance Integration',

      phases: [
        {
          id: 1,
          title: 'Diagnostic Mapping & Pain Reduction',
          imgWeb:
            '/images/medical-health-program/sub-programs/sports-surgical-rehabilitation/web-1.webp',
          imgMobile:
            '/images/medical-health-program/sub-programs/sports-surgical-rehabilitation/1.webp',
          pointers: [
            'Musculoskeletal assessment and movement screening',
            'Gentle therapies for inflammation and pain relief',
            'Breath-led grounding and pranic restoration',
          ],
        },
        {
          id: 2,
          title: 'Functional Recovery & Strength Rebuild',
          imgWeb:
            '/images/medical-health-program/sub-programs/sports-surgical-rehabilitation/web-2.webp',
          imgMobile:
            '/images/medical-health-program/sub-programs/sports-surgical-rehabilitation/2.webp',
          pointers: [
            'Physiotherapy, fascia release, hydrotherapy',
            'Acupuncture and movement therapy for joint support',
            'Protein- and collagen-supportive cuisine',
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Long-Term Performance Integration',
          imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/3.webp',
          pointers: [
            'Stability, mobility, and postural re-education',
            'Lifestyle plan for ongoing strength and prevention',
            'Personalised take-home movement and recovery protocol',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Rehabilitation Team',
      doctors: [
        doctorNaveed,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What's Included`,
      imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for physiotherapy, acupuncture, yoga',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Physiotherapy treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture sessions', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Rafael A., Olympic hopeful, Barcelona',
          id: 1,
          review: `"I came after an ACL surgery that didn’t fully heal. What I got was beyond recovery — it was a full recalibration."`,
        },
        {
          name: 'Zara M., pilates instructor, Dubai',
          id: 2,
          review: `"I’d done every kind of physio and still had shoulder pain. After 15 days at Pema, I could lift again — pain-free."`,
        },
        {
          name: 'Jason T., startup CEO, Los Angeles',
          id: 3,
          review: `"This isn’t a spa rehab. This is elite recovery for people who need to function at 100% again."`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Recovery Kickstart',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Post-Surgical Program',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },
  //nerve healing haven
  {
    id: 'nerve-healing-haven',
    program_name: 'Nerve Healing Haven',
    header_text:
      "“I've seen every specialist, tried every clinic. Pema was the first place that actually helped my nerves heal.”",
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Nerve Healing Haven',
      video_url: 'https://www.youtube.com/watch?v=eRUQR3vnD7A', // replace with actual link
      testimonial_text:
        '‘The treatments, they are fantastic. Very well trained people. And I think they take a lot of effort on people getting trained.’',
      user_name: 'Jayashree Vivek',
    },
    program_quote:
      "If you're living with nerve pain, numbness, tingling, or post-stroke symptoms, this program is built to restore function gently and completely, using proven naturopathic tools.",
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Chronic tingling or burning in your hands, feet, or limbs',
        'Loss of sensation or strength',
        'Nerve damage from injury, diabetes, or post-surgery',
        'Muscle weakness, tremors, or reduced mobility',
        'Frustration with medications or therapies that haven’t worked',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema Wellness, we don’t treat nerves in isolation. We restore the entire system around them, using functional diagnostics, therapeutic physiotherapy, acupuncture, breathwork, muscle activation and targeted cuisine to help the body re-learn how to heal.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Conventional nerve care often focuses on suppressing symptoms.',
      subText2: 'At Pema, we rebuild what the body needs to function again.',
      problems: [
        'Nerve inflammation',
        'Blocked signals',
        'Weak muscular support',
        'Emotional holding',
      ],
      solutions: [
        'Physiotherapy, acupuncture, hydrotherapy, detox',
        'Fascia release and physiotherapy',
        'Mobility rehab and yoga-based movement',
        'Breath, meditation, and nervous system regulation',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Nerve Healing Haven Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Diagnostic Reset',
      phase2: 'Nervous System Repair',
      phase3: 'Long-Term Integration',
      phases: [
        {
          id: 1,
          title: 'Diagnostic Reset',
          imgWeb: '/images/medical-health-program/sub-programs/nerve-healing-haven/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/nerve-healing-haven/1.webp',
          pointers: [
            'Neurological and functional assessments',
            'Mild detox to reduce systemic inflammation',
            'Breath-led grounding and nervous system mapping',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Nervous System Repair',
          imgWeb: '/images/medical-health-program/sub-programs/nerve-healing-haven/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/nerve-healing-haven/2.webp',
          pointers: [
            'Fascia release and targeted physiotherapy',
            'Acupuncture and manipulative therapies',
            'Nerve-supportive cuisine rich in anti-inflammatory and regenerative nutrients',
          ],
        },
        {
          id: 3,
          title: 'Long-Term Integration',
          imgWeb: '/images/medical-health-program/sub-programs/nerve-healing-haven/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/nerve-healing-haven/3.webp',
          pointers: [
            'Personalised mobility plan and daily movement flow',
            'Meditation and breathwork to regulate vagal tone',
            'Take-home plan for continued nerve healing',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Nerve Healing Team',
      doctors: [
        doctorNaveed,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What's Included`,
      imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for physiotherapy, acupuncture, yoga',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Physiotherapy treatments',
            'Acupuncture sessions',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Victor D., former diplomat, Geneva',
          id: 1,
          review:
            '"I’d been told my symptoms were just part of aging. After 15 days here, I feel ten years younger — and I mean that."',
        },
        {
          name: 'Anjali M., entrepreneur, Singapore',
          id: 2,
          review:
            '"The tingling in my feet used to keep me awake at night. Now, it’s gone. So is the fear."',
        },
        {
          name: 'Sophie B., architect, London',
          id: 3,
          review:
            '"I came for my nerves. What I got back was confidence, clarity, and a kind of peace I forgot was possible."',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Nerve Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Nerve Restoration Program',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },

  //pain-free living
  {
    id: 'pain-free-living',
    program_name: 'Pain-free Living',
    header_text:
      '“For the first time in years, I wasn’t adjusting my day around what would hurt. I was just living. That’s the shift Pema gave me.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Pain-free Living',
      video_url: videoURLS.poonamDhillon, // replace with actual link
      testimonial_text:
        '“What makes Pema special is the people, the wonderful therapists, the amazing staff who look after you. And everything is so aesthetically beautiful.”',
      user_name: 'Poonam Dhillon',
    },
    program_quote:
      'If chronic pain is limiting your movement, sleep, or daily life, this program is designed to help you reset your body’s pain pathways, naturally and completely.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Recurring pain in your back, neck, joints, or muscles',
        'Pain that shifts or returns despite medication',
        'Inflammation or stiffness that limits movement',
        'Trouble sleeping or concentrating because of discomfort',
        'Anxiety around movement or fear of injury',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema, we believe pain is a signal, not a life sentence. This program blends medical diagnostics with physiotherapy, acupuncture, hydrotherapy, manipulative therapies, ozone and targeted nutrition to address the root causes of chronic pain and inflammation.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Conventional care often masks symptoms.',
      subText2:
        'Pema focuses on restoring alignment, reducing inflammation, and recalibrating the body’s pain memory.',
      problems: [
        'Localised inflammation',
        'Fascia tightness',
        'Postural imbalance',
        'Pain conditioning',
      ],
      solutions: [
        'Physiotherapy, acupuncture, wraps and packs, hydrotherapy',
        'Comprehensive physiotherapy and manipulative release techniques',
        'Yoga therapy and functional movement through physiotherapy',
        'Nervous system regulation and breath-led healing',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Pain-free Living Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Diagnostic Mapping & Inflammation Reduction',
      phase2: 'Deep Healing & Alignment',
      phase3: 'Pain Recalibration & Long-term Support',
      phases: [
        {
          id: 1,
          title: 'Diagnostic Mapping & Inflammation Reduction',
          imgWeb: '/images/medical-health-program/sub-programs/pain-free-living/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/pain-free-living/1.webp',
          pointers: [
            'Musculoskeletal assessment and posture scan',
            'Hydrotherapy, manipulative therapies, ozone, anti-inflammatory wraps and packs',
            'Breath and pranic grounding',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Deep Healing & Alignment',
          imgWeb: '/images/medical-health-program/sub-programs/pain-free-living/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/pain-free-living/2.webp',
          pointers: [
            'Physiotherapy, acupuncture, and fascia release',
            'Yoga therapy to improve flexibility and reduce holding',
            'Therapeutic cuisine to lower systemic inflammation',
          ],
        },
        {
          id: 3,
          title: 'Pain Recalibration & Long-term Support',
          imgWeb: '/images/medical-health-program/sub-programs/pain-free-living/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/pain-free-living/3.webp',
          pointers: [
            'Strength-building movement flow and breathwork',
            'Energy healing and nerve re-patterning',
            'Take-home protocol for pain management and prevention',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Pain Recovery Team',
      doctors: [
        doctorNaveed,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What's Included`,
      imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for physiotherapy, acupuncture, yoga',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Physiotherapy treatments',
            'Acupuncture sessions',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Elena C., designer, Florence',
          review:
            '“I thought I’d live with back pain forever. After 15 days at Pema, I forgot what it felt like.”',
        },
        {
          id: 2,
          name: 'Aarav T., banker, Singapore',
          review:
            '“The stiffness, the knots, the tension — gone. But the biggest change is how calm my body feels now.”',
        },
        {
          id: 3,
          name: 'Natalie R., creative director, LA',
          review: '“Pema gave me what medications never could — a quiet body and a clear mind.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Pain Relief Starter',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Full Reset',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },
  //////

  //strength and stamina reboot
  {
    id: 'strength-and-stamina-reboot',
    program_name: 'Strength and Stamina Reboot',
    header_text: 'Your comeback starts here: A clinically designed return to strength',
    hero_img_web: '/images/medical-health-program/sub-programs/strength-stamina/hero-web.webp',
    hero_img_mobile:
      '/images/medical-health-program/sub-programs/strength-stamina/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Strength and Stamina Reboot',
      video_url: videoURLS.megastarChiranjeeviKonidela,
      testimonial_text:
        "Blending naturopathy with yoga and modern technology and customizing it to suit each and every client's personal profile is the reason for the outstanding results here.",
      user_name: "'Megastar' Chiranjeevi Konidela, Tollywood actor",
    },
    program_quote:
      'Whether you’re rebuilding after illness, injury, or burnout, this program helps you regain physical power and endurance, the right way, from the inside out.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Your body feels weak, stiff, or depleted — even after rest',
        'You’ve lost stamina, flexibility, or movement confidence',
        'Exercise leaves you more tired than energised',
        'Recovery feels frustratingly slow, like your system won’t bounce back',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-1.webp',
      img2: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-2.webp',
      img3: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/guide.webp',
      heading: 'The guide',
      sub_text:
        'Strength isn’t built by pushing harder, it’s restored by treating the systems that power it. At Pema Wellness, this program blends physiotherapy, acupuncture, functional movement, and metabolic nutrition to help you recover energy, movement, and vitality. Designed for both post-illness recovery and performance rebuilding, it’s a medically guided return to your strongest self.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Most strength or fitness routines ignore the body’s internal state.',
      subText2: 'At Pema, we help you restore performance by healing the systems that enable it:',
      problems: [
        'Muscular stagnation',
        'Low energy metabolism',
        'Inflammation or injury',
        'Nervous system burnout',
      ],
      solutions: [
        'Fascia release, physiotherapy, guided movement',
        'Acupuncture, Nutrition',
        'Hydrotherapy and targeted healing protocols',
        'Breathwork and cellular energy restoration',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Strength and Stamina Reboot Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
        Our team will guide you after a personalised assessment.`,
      phase1: 'Clinical Assessment & Reset',
      phase2: 'Strength Rebuilding',
      phase3: 'Integration & Performance',
      phases: [
        {
          id: 1,
          title: 'Clinical Assessment & Reset',
          imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/1.webp',
          pointers: [
            'Physiotherapy evaluation & Strength assessment',
            'Dietician Consultation',
            'Mild cleansing and detox to reduce inflammation',
            'Functional movement diagnostics',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Strength Rebuilding',
          imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/2.webp',
          pointers: [
            'Progressive physiotherapy and strength training',
            'Yoga therapy, ozone therapy, and core activation work',
            'Strength building & Anti-inflammatory naturopathic cuisine',
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Integration & Performance',
          imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/3.webp',
          pointers: [
            'Endurance-focused movement and breathwork',
            'Long-term metabolic support through food and recovery rituals',
            'Home strength protocol with practitioner guidance',
          ],
          note: '',
        },
      ],
    },
    experts: {
      heading: 'Your Strength Recovery Team',
      doctors: [
        doctorNaveed,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorMuthu,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What's included`,
      imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for physiotherapy, acupuncture, yoga',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Physiotherapy treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Acupuncture sessions', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Sebastian L., Dubai-based consultant',
          id: 1,
          review:
            '“I came here after a long COVID recovery and hadn’t worked out in months. I’m leaving with a body I trust again.”',
        },
        {
          name: 'Jared Quinn, Sports Performance Coach, California',
          id: 2,
          review:
            '“I’ve trained at elite gyms, but this is the first place that healed me before rebuilding me. There’s nothing like it.”',
        },
        {
          name: 'Renée T., Canadian wellness entrepreneur',
          id: 3,
          review:
            '“This program reconnected me to my body. The strength came back — and so did my confidence.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day program',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day comprehensive program',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },

  //////////////
  //women's health
  {
    id: 'womens-health',
    program_name: 'Women’s Health',
    header_text:
      '“I’ve been told the fatigue, weight gain, and mood swings were just part of being a woman. Pema proved they’re not.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Women’s Health',
      video_url: videoURLS.anitaJain, // replace with actual video link
      testimonial_text:
        '“A naturopathic doctor reviewed my health history, actually listened to me. Together we set our health goals, not just for the time at Pema, but also beyond.”',
      user_name: 'Anita Jain, Life Coach & Yoga Teacher',
    },
    program_quote:
      'From irregular periods, PCOS, hormonal imbalances, peri menopause and post menopause, to thyroid concerns and unexplained fatigue — this program helps women rebalance their health from within.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Irregular periods, cramps, or PCOS symptoms',
        'Hormonal imbalances, pre, peri or post menopause',
        'Thyroid issues, weight fluctuations, or skin breakouts',
        'Mood swings, hot flush, night sweating, anxiety, or sleep disturbances',
        'Constant fatigue despite lab reports saying ‘normal’',
        'Feeling disconnected from your body’s signals and cycles',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema, we don’t treat symptoms, we restore systems. Our women’s health program is built on traditional Chinese Medicinal Diagnosis, naturopathic diagnostics, hormone-reset protocols, and decades of experience treating women across life stages, from reproductive to pre-menopausal.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Most solutions suppress or isolate symptoms.',
      subText2: 'We work to reset your hormonal rhythm.',
      problems: ['Hormonal imbalance', 'Strengthen liver', 'Stress overload', 'Gut-hormone link'],
      solutions: [
        'Acupuncture and nutrition-led support',
        'Acupuncture, nutrition, plant based food, and hydrotherapy',
        'Nervous system and cortisol rebalancing',
        'Digestive healing and personalised food plans',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Women’s Health Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Hormonal Assessment & Liver Detox',
      phase2: 'Rebalancing & Repair',
      phase3: 'Hormonal Rhythm Reset & Maintenance',
      phases: [
        {
          id: 1,
          title: 'Hormonal Assessment & Liver Detox',
          imgWeb: '/images/medical-health-program/sub-programs/womens-health/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/womens-health/1.webp',
          pointers: [
            'Diagnostic testing and fasting-supported cleansing',
            'Salt-balancing hydrotherapy and abdominal therapy',
            'Therapeutic meals focused on hormone health',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Rebalancing & Repair',
          imgWeb: '/images/medical-health-program/sub-programs/womens-health/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/womens-health/2.webp',
          pointers: [
            'Acupuncture for endocrine reset and cycle alignment',
            'Yoga and breathwork for nervous system regulation',
            'Gut-brain-hormone healing through targeted cuisine',
          ],
        },
        {
          id: 3,
          title: 'Hormonal Rhythm Reset & Maintenance',
          imgWeb: '/images/medical-health-program/sub-programs/womens-health/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/womens-health/3.webp',
          pointers: [
            'Personalised hormone-stabilising food and lifestyle plan',
            'Stress and sleep recalibration',
            'Take-home 90-day rhythm maintenance plan',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Hormonal Health Team',
      doctors: [
        doctorMuthu,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Acupuncture treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Ishita R., media executive, Mumbai',
          review:
            '“I hadn’t had a proper period in 6 months. By the end of week two, my body had reset — without any pills.”',
        },
        {
          id: 2,
          name: 'Maya K., visual artist, London',
          review:
            '“My thyroid symptoms kept getting dismissed. This was the first place that actually understood what I was going through.”',
        },
        {
          id: 3,
          name: 'Danielle F., mother and consultant, NYC',
          review:
            '“I feel lighter, clearer, and back in sync. Not just hormonally — emotionally too.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Hormonal Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Women’s Health Program',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },
  //
  //women's fertility
  {
    id: 'womens-fertility',
    program_name: 'Women’s Fertility',
    header_text:
      'The world’s first full-body fertility reset — designed to do what most programs can’t: restore your body’s natural ability to conceive.',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Women’s Fertility',
      video_url: null, // Written testimonial only
      testimonial_text:
        '"Had an amazing 8-day journey here which laid a strong foundation for my emotional and physical stability. Today as I head back home, I feel renewed and refreshed inside out."',
      user_name: '',
    },
    program_quote:
      'If you’re preparing to conceive, navigating unexplained infertility, or want to improve your chances naturally, this program brings your body back into balance, without invasive interventions.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Irregular cycles, PCOS, or ovulation challenges, endometrial thinning, poor egg quality',
        'Hormone fluctuations, weight gain, or fatigue',
        'High stress, repeated disappointments and emotional burnout',
        'Doctors saying “everything looks fine” when it doesn’t feel that way',
        'A deep desire to try again — but this time with full-body support',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema, fertility is not just a function, it’s a reflection of whole-body wellness. Our approach integrates Traditional Chinese Medicine, nutrition, naturopathy, gentle cleansing, and emotional regulation to help your body return to its natural, receptive state.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Most fertility protocols target one organ.',
      subText2: 'Ours strengthens the entire system.',
      problems: ['Hormonal imbalance', 'Uterine stagnation', 'Chronic stress', 'Gut-hormone link'],
      solutions: [
        'Acupuncture, cycle-syncing nutrition',
        'Cleansing therapies, abdominal massage',
        'Nervous system grounding and breath therapy',
        'Digestive restoration and food-as-medicine approach',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Women’s Fertility Program ',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1_label: '1st month - 15 nights',
      phase2_label: '2nd month - 8 nights',
      phase3_label: '3rd month - 8 nights',
      phase1: 'Nurture',
      phase2: 'Nourish',
      phase3: 'Flourish',
      phases: [
        {
          id: 1,
          phase_label: '1st month - 15 nights',
          title: 'Nurture',
          imgWeb: '/images/medical-health-program/sub-programs/womens-fertility/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/womens-fertility/1.webp',
          pointers: [
            `Stabilises hormones and calms internal inflammation`,
            `Strengthens ovarian function and supports egg quality`,
            `Improves uterine blood flow to create a steady foundation`,
          ],
          note: '',
        },
        {
          id: 2,
          phase_label: '2nd month - 8 nights',

          title: 'Nourish',
          imgWeb: '/images/medical-health-program/sub-programs/womens-fertility/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/womens-fertility/2.webp',
          pointers: [
            `Deepens detoxification and restores metabolic balance`,
            `Helps the cycle find rhythm through stress and sleep support`,
            `Enhances nutrient absorption to sustain ovarian health`,
          ],
        },
        {
          id: 3,
          phase_label: '3rd month - 8 nights',

          title: 'Flourish',
          imgWeb: '/images/medical-health-program/sub-programs/womens-fertility/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/womens-fertility/3.webp',
          pointers: [
            `Supports endometrial thickness and implantation potential`,
            `Refines hormonal timing for conception`,
            `Strengthens emotional steadiness and overall readiness`,
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Fertility Care Team',
      doctors: [
        doctorMuthu,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Acupuncture treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Priyanka R., lawyer, Bengaluru',
          review:
            '“After 2 years of trying, I came here with nothing left. I left feeling ready — and 4 months later, I was pregnant.”',
        },
        {
          id: 2,
          name: 'Anna B., writer, Melbourne',
          review:
            '“I thought I was doing everything right. But no one had shown me how to truly support my hormones — until now.”',
        },
        {
          id: 3,
          name: 'Fatima H., consultant, Abu Dhabi',
          review:
            '“This was the only place that helped me feel emotionally and physically safe enough to try again.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Fertility Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Reproductive Restoration',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },
  //pre in vitro fertilization (ivf)
  {
    id: 'pre-in-vitro-fertilization-ivf',
    program_name: 'Pre In Vitro Fertilization (IVF)',
    header_text:
      'The world’s first pre-IVF retreat that prepares your entire system, physically, emotionally, and hormonally, for what comes next.',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: null,
    program_quote:
      'Whether it’s your first IVF cycle or your third, this program helps your body enter the process stronger, calmer, and ready to respond.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Past IVF cycles that felt physically and emotionally draining',
        'Low AMH, high FSH, or poor ovarian response',
        'Endometrial lining issues or implantation challenges',
        'High stress, disrupted sleep, or fatigue before starting',
        'A desire to give your body its best possible shot',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema, we see IVF not just as a procedure, but a process. One that requires your entire system to be in sync. This program blends naturally enhancing reproductive ability therapies — acupuncture, nutrition, yoga, cleansing, naturopathy, and deep emotional grounding — to help you step into IVF with clarity and strength.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Most IVF prep focuses only on medication.',
      subText2: 'Ours prepares the body to receive it.',
      problems: [
        'Poor ovarian response',
        'Uterine inflammation',
        'Hormonal misalignment',
        'Nervous system dysregulation',
      ],
      solutions: [
        'Acupuncture, nutrition, circulation therapies',
        'Hydrotherapy, detox, anti-inflammatory meals',
        'Cycle-syncing, stress recalibration',
        'Breathwork and deep rest',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Pre-IVF Preparation Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Internal Cleansing & Hormone Reset',
      phase2: 'Ovarian Support & Emotional Grounding',
      phase3: 'IVF Synchronisation & Home Planning',
      phases: [
        {
          id: 1,
          title: 'Internal Cleansing & Hormone Reset',
          imgWeb:
            '/images/medical-health-program/sub-programs/pre-in-vitro-fertilization-ivf/web-1.webp',
          imgMobile:
            '/images/medical-health-program/sub-programs/pre-in-vitro-fertilization-ivf/1.webp',
          pointers: [
            'Salt-balancing hydrotherapy and uterine detox',
            'Personalised diagnostics and hormone profiling',
            'Anti-inflammatory, fertility-focused cuisine',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Ovarian Support & Emotional Grounding',
          imgWeb:
            '/images/medical-health-program/sub-programs/pre-in-vitro-fertilization-ivf/web-2.webp',
          imgMobile:
            '/images/medical-health-program/sub-programs/pre-in-vitro-fertilization-ivf/2.webp',
          pointers: [
            'Fertility acupuncture and cycle support',
            'Breathwork, movement, and stress regulation',
            'Gut and liver healing for hormone optimisation',
          ],
        },
        {
          id: 3,
          title: 'IVF Synchronisation & Home Planning',
          imgWeb:
            '/images/medical-health-program/sub-programs/pre-in-vitro-fertilization-ivf/web-3.webp',
          imgMobile:
            '/images/medical-health-program/sub-programs/pre-in-vitro-fertilization-ivf/3.webp',
          pointers: [
            'Endometrial lining support and ovulation rhythm planning',
            'Natural supplementation and sleep alignment',
            '90-day take-home plan to continue pre-IVF care',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your IVF Prep Team',
      doctors: [
        doctorMuthu,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Acupuncture treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Kavita D., Dubai',
          review:
            '“I came here before my second IVF cycle — this time my body responded beautifully. More eggs, less stress, and I felt in control.”',
        },
        {
          id: 2,
          name: 'Elena C., Amsterdam',
          review:
            '“My IVF doctor said my lining was stronger, and my bloodwork cleaner. All I did differently was come to Pema first.”',
        },
        {
          id: 3,
          name: 'Nisha A., Delhi',
          review:
            '“This wasn’t about outcomes. It was about preparing myself fully — and I’d do it again in a heartbeat.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day IVF Prep Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day IVF Prep & Hormone Rebalance',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },
  //mens fertility
  {
    id: 'mens-fertility',
    program_name: 'Men’s Fertility',
    header_text:
      'The world’s first fertility reset designed for men, because your health, stress, and lifestyle shape more than just sperm count.',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: null,
    program_quote:
      'Whether you’re planning to conceive, supporting a partner through IVF, or simply want to optimise reproductive health, this program strengthens what matters most.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Low sperm count, poor motility, or abnormal morphology',
        'Hormonal imbalance or reduced testosterone',
        'Stress, fatigue, or burnout affecting fertility markers',
        'Unhealthy lifestyle patterns (poor diet, alcohol, sleep disruption)',
        'Wanting to be more than just ‘support’ — to actively prepare',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The Guide',
      sub_text:
        'At Pema, male fertility isn’t an afterthought. It’s a full-body process. This program is built to reset the systems most responsible for male reproductive health — cleansing, hormonal balance, nervous system regulation, and circulation, all without medication.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'Most male fertility care focuses on sperm.',
      subText2: 'We focus on the system that creates it.',
      problems: [
        'Hormonal imbalance',
        'Oxidative stress',
        'Testicular circulation',
        'Lifestyle strain',
      ],
      solutions: [
        'Acupuncture, nutrition, cleansing, endocrine support',
        'Nutrient-rich cuisine, hydrotherapy, naturopathy support',
        'Acupuncture and abdominal therapy',
        'Nervous system reset, sleep and stress alignment',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Men’s Fertility Program ',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Boost',
      phase1_label: '1st month - 8 nights',
      phase2_label: '2nd month - 8 nights',
      phase2: 'Reignite',
      phases: [
        {
          id: 1,
          phase_label: '1st month - 8 nights',

          title: 'Boost',
          imgWeb: '/images/medical-health-program/sub-programs/mens-fertility/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/mens-fertility/1.webp',
          pointers: [
            `Restores hormonal balance and reproductive vitality`,
            `Improves sperm count, motility and morphology`,
            `Enhances circulation and reduces oxidative stress`,
          ],
        },
        {
          id: 2,
          phase_label: '2nd month - 8 nights',

          title: 'Reignite',
          imgWeb: '/images/medical-health-program/sub-programs/mens-fertility/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/mens-fertility/2.webp',
          pointers: [
            `Strengthens cellular repair and reproductive function`,
            `Deepens progress with acupuncture and detox therapies`,
            `Optimises semen quality for healthier conception outcomes`,
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Men’s Fertility Care Team',
      doctors: [
        doctorMuthu,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Acupuncture treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Ryan S., filmmaker, Los Angeles',
          review:
            '“My numbers were borderline and no one could tell me why. Two months after Pema, I had the highest sperm count of my life.”',
        },
        {
          id: 2,
          name: 'Naveen J., entrepreneur, Singapore',
          review:
            '“This wasn’t just about fertility — it was about energy, confidence, clarity. I walked away feeling 10 years younger.”',
        },
        {
          id: 3,
          name: 'Gautam M., architect, Bengaluru',
          review:
            '“My wife was prepping for IVF and I wanted to support her. Pema helped me take responsibility for my part of the journey.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Fertility Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Reproductive Optimisation',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },

  //calm and clarity
  {
    id: 'calm-and-clarity',
    program_name: 'Calm & Clarity',
    header_text: 'Clear the Fog. Calm the System. Return to Yourself.',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Calm & Clarity',
      video_url: videoURLS.colleenWashnuk,
      testimonial_text:
        'I just feel so much better. I’m sleeping better, I’m eating better, I’m exercising, and I feel better overall. I just can’t say enough good things about it.',
      user_name: 'Colleen Washnuk',
    },
    program_quote:
      'If stress, anxiety, or mental fatigue have taken over your days, this clinically guided reset helps restore emotional clarity, nervous system balance, and deep inner calm.',
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'You feel overstimulated, anxious, or mentally scattered',
        'You wake up tired and go to sleep wired',
        'Productivity is high, but peace feels out of reach',
        'Meditation and vacations aren’t enough anymore',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The guide',
      sub_text:
        'At Pema Wellness, we work at the nervous system level, not just the mind. The Calm & Clarity program is rooted in Pema’s naturopathic framework for emotional regulation, combining bio-energetic therapy, breath science, acupuncture, and food-based neurotransmitter support to bring you back into mental stillness and balance.',
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: 'You can’t fix burnout with willpower.',
      subText2:
        'We target the biological roots of emotional overwhelm, to restore calm from the inside:',
      problems: [
        'Nervous system overdrive',
        'Hormonal imbalances',
        'Brain fog and fatigue',
        'Emotional holding patterns',
      ],
      solutions: [
        'Acupuncture, breathwork, vagal nerve toning',
        'Natural endocrine and adrenal support',
        'Oxygenation, detox, and mental clarity therapies',
        'Yoga therapy and meditation',
      ],
    },
    inside_program: {
      title: 'The Pema Solution',
      sub_title: 'Calm & Clarity Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
      Our team will guide you after a personalised assessment.`,
      phase1: 'Nervous System Reset',
      phase2: `Mental Clarity & 
          Emotional Release`,
      phase3: `Repatterning &
          Integration`,
      phases: [
        {
          id: 1,
          title: 'Nervous System Reset',
          imgWeb: '/images/medical-health-program/sub-programs/calm-clarity/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/calm-clarity/1.webp',
          pointers: [
            'Medical diagnostics and energy assessment',
            'Food-based detox and elimination of overstimulating inputs',
            'Grounding breathwork and pranayama',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Mental Clarity & Emotional Release',
          imgWeb: '/images/medical-health-program/sub-programs/calm-clarity/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/calm-clarity/2.webp',
          pointers: [
            'Acupuncture, ozone therapy, and hydrotherapy',
            'Daily therapeutic yoga and movement',
            'Cognitive and emotional restoration protocols',
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Repatterning & Integration',
          imgWeb: '/images/medical-health-program/sub-programs/calm-clarity/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/calm-clarity/3.webp',
          pointers: [
            'Long-term nervous system care strategy',
            'Clarity-focused nutrition and adrenal balance',
            'Take-home rituals for emotional resilience',
          ],
          note: '',
        },
      ],
    },
    experts: {
      heading: 'Your Calm & Clarity Team',
      doctors: [
        doctorMuthu,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Acupuncture treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Elena G., tech founder, Berlin',
          id: 1,
          review:
            '“I went from waking up in panic to falling asleep in peace. I haven’t felt this steady in years.”',
        },
        {
          name: 'Dev Patel, speaker and author, Singapore',
          id: 2,
          review:
            '“I came for stress relief. I left with tools I now use every day — in meetings, on stage, and even with my kids.”',
        },
        {
          name: 'Rachel D., retired diplomat, New York',
          id: 3,
          review:
            '“This wasn’t a wellness break. It was an emotional rebalancing. I wish I had come here ten years ago.”',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Calm Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Nervous System Rebuild',
          starting_at: 45000,
        },
      ],
      note: '(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)',
    },
  },
  // id: 'deep-sleep-sanctuary',
  {
    id: 'deep-sleep-sanctuary',
    program_name: 'Deep Sleep Sanctuary',
    header_text: '“I didn’t realise how badly I was sleeping… until I finally slept well.”',
    hero_img_web: '/images/medical-health-program/sub-programs/hero-web.webp',
    hero_img_mobile: '/images/medical-health-program/sub-programs/hero-mobile.webp',

    video_testimonial: {
      heading: 'Stories of renewal with Deep Sleep Sanctuary',
      video_url: videoURLS.prakashRaj,
      testimonial_text: `‘I’m feeling very invigorated and very active now and this is something I was searching for and I'm sure I'm gonna keep coming here and this is going to be another holiday’`,
      user_name: 'Prakash Raj, Indian actor',
    },
    program_quote: `If you’ve been tossing, turning, or relying on pills to fall asleep, this program restores deep, natural sleep by healing the systems that regulate it.`,
    key_concern: {
      heading: 'Key concerns',
      imgWeb: '/images/medical-health-program/sub-programs/key-concern-web.webp',
      imgMobile: '/images/medical-health-program/sub-programs/key-concern-mobile.webp',
      pointers: [
        'Trouble falling or staying asleep',
        'Light, fragmented sleep that leaves you tired',
        'Reliance on melatonin or medication',
        'Brain fog, mood swings, or burnout from chronic sleep deprivation',
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/img-1.webp',
      img2: '/images/medical-health-program/sub-programs/img-2.webp',
      img3: '/images/medical-health-program/sub-programs/img-3.webp',
      imgMobile: '/images/medical-health-program/sub-programs/img-mobile.webp',
      heading: 'The guide',
      sub_text: `At Pema, sleep is not treated as a night-time issue, it’s treated as a full-system imbalance. This program rewires your internal rhythms using naturopathic therapies, acupuncture, breathwork, and calming cuisine to reset the body’s sleep-wake axis from the root.`,
    },
    healingTable: {
      heading: 'The science behind your healing',
      subText1: `Conventional sleep solutions sedate the brain, but they don’t fix why your body can’t rest.`,
      subText2: `At Pema, we work on the biological and energetic blocks to true sleep:`,
      problems: [
        'Cortisol spikes',
        'Melatonin disruption',
        'Gut-brain imbalances',
        'Nervous system overdrive',
      ],
      solutions: [
        'Breathwork, acupuncture, and vagal nerve activation',
        'Light therapy, circadian rhythm retraining',
        'Serotonin-boosting meals and digestive reset',
        'Pranic healing, yoga nidra, energy therapy',
      ],
    },
    inside_program: {
      title: 'Your Sleep Restoration Protocol',
      sub_title: 'Deep Sleep Sanctuary Program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
      Our team will guide you after a personalised assessment.`,
      phase1: 'Sleep Pattern Reset',
      phase2: 'Nervous System Recalibration',
      phase3: 'Long-Term Rhythm Integration',
      phases: [
        {
          id: 1,
          title: 'Sleep Pattern Reset',
          imgWeb: '/images/medical-health-program/sub-programs/deep-sleep/web-1.webp',
          imgMobile: '/images/medical-health-program/sub-programs/deep-sleep/1.webp',
          pointers: [
            'Sleep evaluation and energy diagnostics',
            'Natural calming therapies to ground the system',
            'Elimination of overstimulating foods and tech inputs',
          ],
          note: '',
        },
        {
          id: 2,
          title: 'Nervous System Recalibration',
          imgWeb: '/images/medical-health-program/sub-programs/deep-sleep/web-2.webp',
          imgMobile: '/images/medical-health-program/sub-programs/deep-sleep/2.webp',
          pointers: [
            'Acupuncture, ozone therapy, hydrotherapy, and Melatonin supportive therapies',
            'Restorative yoga, meditation, and guided movement',
            'Circadian-aligned meal plan and detox support',
          ],
          note: '',
        },
        {
          id: 3,
          title: 'Long-Term Rhythm Integration',
          imgWeb: '/images/medical-health-program/sub-programs/deep-sleep/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/deep-sleep/3.webp',
          pointers: [
            'Lifestyle rituals to sustain sleep quality',
            'Breath-led wind-down routines and stress mapping',
            'Personalised take-home sleep protocol',
          ],
          note: '',
        },
      ],
    },
    experts: {
      heading: 'Your Sleep Restoration Team',
      doctors: [
        doctorMuthu,
        doctorSarath,
        doctorSangeetha,
        doctorRamya,
        professorPrahalad,
        doctorNaveed,
        chefRajiv,
      ],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'Medical consultations',
          points: [
            'Acupuncture specialist, as a Naturopath',
            'Heads of departments for yoga, acupuncture, physiotherapy',
          ],
        },
        {
          id: 2,
          title: 'Specialised therapies',
          points: [
            'Acupuncture treatments',
            'Naturopathy treatments',
            'Manipulative Therapies & Massages',
            'Hydro-Therapies',
            'Fomentations, Wraps & Packs',
          ],
        },
        {
          id: 3,
          title: 'Healing cuisine',
          points: [
            'Nutritionist guided detox meals crafted with naturopathic principles',
            'Gourmet cuisine, tailored to your palate- Indian, Italian, Continental & more',
          ],
        },
        {
          id: 4,
          title: 'Guided wellness activities',
          points: [
            'Breathwork tailored to your needs',
            'Low intensity workouts',
            'Therapeutic yoga',
          ],
        },
        {
          id: 5,
          title: 'Take-home plan',
          points: ['Continued program protocol', 'Personalised diet plan'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable',
      pointers: ['Personal sessions', 'Physiotherapy', 'Private yoga'],
    },
    testimonials_data: {
      bgImgWeb: '/images/medical-health-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/medical-health-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          id: 1,
          name: 'Juliette R., former executive, Toronto',
          review: `"I tried every supplement and app out there. Nothing worked — until this. It felt like my nervous system finally exhaled."`,
        },
        {
          id: 2,
          name: 'Daniel K., crypto founder, Tel Aviv',
          review: `"This isn’t a sleep retreat. It’s a complete nervous system reset. I didn’t just sleep. I healed."`,
        },
        {
          id: 3,
          name: 'Rhea A., creative director, Mumbai & Milan',
          review: `"For the first time in years, I don’t fear going to bed. I know my body knows what to do now."`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & Booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Sleep Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Deep Sleep Recalibration',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  //
]
