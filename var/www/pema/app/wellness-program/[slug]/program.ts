import type { ProgramDetail } from '@/utils/types'
import {
  chefRajiv,
  doctorMuthu,
  doctorRamya,
  doctorSangeetha,
  doctorSarath,
  professorPrahalad,
  doctorNaveed,
} from './ExpertsTeam'

export const programDetails: ProgramDetail[] = [
  //pema signature detox
  {
    id: 'pema-signature-detox',
    program_name: 'Pema Signature Detox',
    header_text: 'The ultimate reset. Where luxury meets cellular renewal.',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Pema Signature Detox',
      video_url: 'https://youtu.be/b7weagfrSdU',
      testimonial_text: `‘The best thing about Pema I feel is that the doctors are really aware of what they're doing.’`,
      user_name: `Rakul Preet Singh,
Indian Actress`,
    },
    program_quote: `The Signature Detox is our most intensive cleanse designed for those who want to feel light, radiant, and completely reset. Using targeted therapies, fasting protocols, and therapeutic cuisine, we help your body return to what it was built for: balance.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to feel lighter in body, mind, and gut`,
        `You want a cleanse that feels sustainable`,
        `You want to wake up not feeling sluggish, bloated, or inflamed`,
        `You want clearer skin, deeper sleep, and sharper clarity`,
        `You want to feel at your prime`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: 'At Pema, detox doesn’t mean deprivation.',
      sub_text_2:
        'It means clarity. This program gently guides your body through cellular cleansing, liver and gut reset, and energy restoration using ancient science and modern diagnostics, guided by Naturopathic physicians with over 30 years of experience.',
      sub_text_3:
        'No extremes. No guesswork. Just the intelligence of nature, personalised for your system.',
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
          imgWeb: '/images/wellness-program/sub-programs/phase-1-web.webp',
          imgMobile: '/images/wellness-program/sub-programs/phase-1-mobile.webp',
          pointers: [
            `Transition to clean, nourishing foods`,
            `Mild withdrawal (sugar, processed foods)`,
            `Organs begin detox support`,
          ],
        },
        {
          id: 2,
          title: 'Deep Detox',
          imgWeb: '/images/wellness-program/sub-programs/phase-2-web.webp',
          imgMobile: '/images/wellness-program/sub-programs/phase-2-mobile.webp',
          pointers: [
            `Peak detox symptoms: fatigue, headaches`,
            `Toxins release from deeper tissues`,
            `Energy dips as the body focuses on repair`,
          ],
        },
        {
          id: 3,
          title: 'Holistic Reset',
          imgWeb: '/images/wellness-program/sub-programs/phase-3-web.webp',
          imgMobile: '/images/wellness-program/sub-programs/phase-3-mobile.webp',
          pointers: [
            `Lighter body, clearer skin, better digestion`,
            `Sharper focus, stable mood`,
            `Systems begin to rebalance`,
          ],
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Ayesha N.',
          id: 2,
          review: `This is not just a spa detox. This is transformation. My skin cleared up, my gut is silent, and I’ve never felt this light.`,
        },
        {
          name: `Meera Shah`,
          id: 1,
          review: `The structure, the food, the team — everything works together. I came for a reset. I left reborn.`,
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
  {
    id: 'wellness-test-program',
    program_name: 'Program Name program_name',
    header_text: 'Blah blah blah header_text',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'video_testimonial - heading',
      video_url: 'https://youtu.be/b7weagfrSdU',
      testimonial_text: `testimonial_text`,
      user_name: `user_name`,
    },
    program_quote: `lorem ispum fancy text for program info, key - program_quote `,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        ' what_brings_you_here - 1',
        ' what_brings_you_here - 2',
        ' what_brings_you_here - 3',
        ' what_brings_you_here - 4',
        ' what_brings_you_here - 5',
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: 'The Pema way sub_text_1',
      sub_text_2: 'The Pema way sub_text_2',
      sub_text_3: ' The Pema way sub_text_3',
    },
    inside_program: {
      title: 'inside_program - title',
      sub_title: 'inside_program - sub_title',
      required_days_text: 'required_days_text',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'phase1',
      phase2: 'phase2',
      phase3: 'phase3',
      phases: [
        {
          id: 1,
          title: 'phase1',
          imgWeb: '/images/wellness-program/sub-programs/phase-1-web.webp',
          imgMobile: '/images/wellness-program/sub-programs/phase-1-mobile.webp',
          pointers: [`pointers 1`, `pointers 2`, `pointers 3`],
        },
        {
          id: 2,
          title: 'phase2',
          imgWeb: '/images/wellness-program/sub-programs/phase-2-web.webp',
          imgMobile: '/images/wellness-program/sub-programs/phase-2-mobile.webp',
          pointers: [`pointers 1`, `pointers 2`, `pointers 3`],
        },
        {
          id: 3,
          title: 'phase3',
          imgWeb: '/images/wellness-program/sub-programs/phase-3-web.webp',
          imgMobile: '/images/wellness-program/sub-programs/phase-3-mobile.webp',
          pointers: [`pointers 1`, `pointers 2`, `pointers 3`],
        },
      ],
    },
    experts: {
      heading: 'experts - heading',
      doctors: [doctorSarath, doctorSangeetha, doctorRamya, professorPrahalad, chefRajiv],
    },
    whats_included: {
      title: `What’s included`,
      imgWeb: '/images/medical-health-program/sub-programs/whats-included.webp',
      imgMobile: '/images/medical-health-program/sub-programs/whats-included.webp',
      pointers: [
        {
          id: 1,
          title: 'title 1',
          points: ['pointers - 1', 'pointers -2'],
        },
        {
          id: 2,
          title: 'title 2',
          points: ['pointers - 1', 'pointers -2', 'pointers - 3', 'pointers - 4'],
        },
        {
          id: 3,
          title: 'title 3',
          points: ['pointers - 1', 'pointers -2', 'pointers - 3'],
        },
        {
          id: 4,
          title: 'title 4',
          points: ['pointers - 1', 'pointers -2'],
        },
        {
          id: 5,
          title: 'title 5',
          points: ['pointers - 1', 'pointers -2', 'pointers - 3'],
        },
      ],
    },
    program_enhancements: {
      img: '/images/medical-health-program/lotus-gray-bg-image.svg',
      title: 'Program enhancements',
      sub_title: 'Chargeable ',
      pointers: ['pointer 1', 'pointer - 2', 'pointer - 3', 'pointer - 4'],
    },
    testimonials_data: {
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'user name 3',
          id: 3,
          review: 'testimonials text',
        },
        {
          name: 'user name 4',
          id: 4,
          review: 'testimonials text',
        },
        {
          name: 'user name 1',
          id: 1,
          review: 'testimonials text',
        },
        {
          name: 'user name 2',
          id: 2,
          review: 'testimonials text',
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: 'program_name',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: 'program_name',
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
    header_text: 'A softer reset. For when your body needs healing, not pressure.',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Gentle Detox',
      video_url: 'https://youtu.be/ikEzUdAxaug',
      testimonial_text: `‘What I find very special about Pema is that it's the perfect blend of the East and West. So they have taken the best of the Indian pranayama healing techniques, food, ingredients, a menu...’`,
      user_name: 'Payal Jain',
    },
    program_quote: `Gentle Detox is designed for sensitive systems, chronic conditions, and post-treatment recovery. It skips the extremes, instead using food-based cleansing, anti-inflammatory therapies, and nervous system reset to help your body let go safely and sustainably.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to feel well, reduce inflammation, and complete your recovery.`,
        `You want to build steady energy and a healthy, regular digestion.`,
        `You want to follow a gentle, sustainable detox that supports your system.`,
        `You want to bring your hormones and immunity back into balance.`,
        `You want to choose a safe, nurturing space to heal and thrive.`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: 'Gentle Detox is rooted in nourishment, not deprivation.',
      sub_text_2:
        'Using functional nutrition, hydrotherapy, and breath-based recalibration, we guide your body to release toxins, reduce inflammation, and restore gut and mind balance, at your own pace.',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your gentle detox protocol',
      sub_title: 'Our Gentle Detox program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Preparation & Gut Reset',
      phase2: 'Deep Nourishment & Healing',
      phase3: 'Sustainable Rebuild',
      phases: [
        {
          id: 1,
          title: 'Preparation & Gut Reset',
          imgWeb: '/images/wellness-program/sub-programs/gentle-detox/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/gentle-detox/1.webp',
          pointers: [
            'Naturopathic and acupuncture diagnosis',
            'Anti-inflammatory diet using gentle, sattvic foods',
            'Light hydrotherapy to support elimination',
          ],
        },
        {
          id: 2,
          title: 'Deep Nourishment & Healing',
          imgWeb: '/images/wellness-program/sub-programs/gentle-detox/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/gentle-detox/2.webp',
          pointers: [
            'Liver and gut therapy through mild fasting or mono-diet',
            'Sleep and nervous system recovery through acupuncture and yoga nidra',
            'Herbal teas and infusions to reduce inflammation',
          ],
        },
        {
          id: 3,
          title: 'Sustainable Rebuild',
          imgWeb: '/images/wellness-program/sub-programs/gentle-detox/web-3.webp',
          imgMobile: '/images/wellness-program/sub-programs/gentle-detox/3.webp',
          pointers: [
            'Personalised nutrition to strengthen recovery',
            'Digestive fire optimisation',
            'Guided breathwork, mindfulness, and emotional release',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your gentle detox team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Vidya N.',
          id: 1,
          review: `Unlike juice cleanses or crash detoxes, this one met me where I was. I left with strength, calm, and a healthier gut.`,
        },
        {
          name: 'Priya S.',
          id: 2,
          review: `This wasn’t aggressive. It was kind. I needed that after what my body had been through.`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day foundation',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day core program',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },
  // strength and stamina reboot
  {
    id: 'strength-and-stamina-reboot',
    program_name: 'Strength and Stamina Reboot',
    header_text:
      'A personalised fitness reset that helps you feel strong, mobile, and in sync again.',
    hero_img_web: '/images/medical-health-program/sub-programs/strength-stamina/hero-web.webp',
    hero_img_mobile:
      '/images/medical-health-program/sub-programs/strength-stamina/hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Strength and Stamina Reboot',
      video_url: 'https://youtu.be/PyN5fxDhZrY',
      testimonial_text: `Blending naturopathy with yoga and modern technology and customising it to suit each and every client's personal profile is the reason for the outstanding results here.`,
      user_name: "'Megastar' Chiranjeevi Konidela",
    },
    program_quote: `This program is designed for those who want to rebuild their energy, flexibility, and strength,  not in a gym, but through guided, therapeutic movement and internal restoration. It’s not about pushing harder. It’s about resetting smarter.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to reconnect with your body after illness, burnout, or long sedentary spells.`,
        `You want to ease stiffness, feel lighter, and restore steady energy.`,
        `You want to build smart, sustainable momentum—not a bootcamp.`,
        `You want to rebuild metabolism, strength, and immunity from within.`,
        `You want to feel capable, grounded, and fully alive again.`,
      ],
    },
    three_img_section: {
      img1: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-1.webp',
      img2: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-2.webp',
      img3: '/images/medical-health-program/sub-programs/strength-stamina/guide-web-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: `We approach strength holistically — working not just on your muscles but your energy systems, nervous system, and gut. At Pema, we pair functional movement and breath-led training with naturopathic therapies, gut support, and deep rest to restore your body’s true stamina.`,
      sub_text_2: '',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Strength Reset Protocol',
      sub_title: 'Our Strength and Stamina program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Restore & Prime',
      phase2: 'Build & Activate',
      phase3: 'Sustain & Recalibrate',
      phases: [
        {
          id: 1,
          title: 'Restore & Prime',
          imgWeb: '/images/wellness-program/sub-programs/strength-stamina/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/strength-stamina/1.webp',
          pointers: [
            'Baseline energy diagnostics and breath-flow assessment',
            'Naturopathic gut detox and anti-inflammatory support',
            'Sleep recovery and joint release',
          ],
        },
        {
          id: 2,
          title: 'Build & Activate',
          imgWeb: '/images/wellness-program/sub-programs/strength-stamina/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/strength-stamina/2.webp',
          pointers: [
            'Guided strength and mobility training',
            'Therapeutic yoga and breath regulation',
            'Acupuncture and circulation support',
          ],
        },
        {
          id: 3,
          title: 'Sustain & Recalibrate',
          imgWeb: '/images/medical-health-program/sub-programs/strength-stamina/web-3.webp',
          imgMobile: '/images/medical-health-program/sub-programs/strength-stamina/3.webp',
          pointers: [
            'Nutrition for endurance and cellular oxygenation',
            'Lifestyle reset to sustain energy and movement',
            'Personalised at-home mobility and breathwork plan',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Strength Reboot Team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Raghav K.',
          id: 1,
          review: `This wasn’t about pushing hard. It was about reconnecting with my body from the inside out. I feel stronger and more present.`,
        },
        {
          name: 'Divya P.',
          id: 2,
          review: `I didn’t expect breathwork and movement to feel this powerful. I’ve got my energy back — and I’m not losing it to burnout again.`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day reboot',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // reset & relax
  {
    id: 'reset-relax',
    program_name: 'Reset & Relax',
    header_text: 'Ease Into Healing, Gently',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Reset & Relax',
      video_url: 'https://youtu.be/U4A3BWj4ddU',
      testimonial_text: `I was able to make a huge difference and I feel that I am going back as a rejuvenated person.`,
      user_name: `Praful Patel, Member of Rajya Sabha`,
    },
    program_quote: `Reset & Relax is Pema’s lightest and most flexible wellness journey, designed for those who are new to holistic health or simply seeking a break that heals. It’s not about doing more. It’s about slowing down with intention.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to lift mental and emotional fatigue.`,
        `You want to explore natural therapies, with clear guidance on where to begin.`,
        `You want restorative rest without a rigid schedule.`,
        `You want to feel balanced again even if nothing is “wrong.”`,
        `You want to try a gentle wellness retreat without the intensity.`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: `We meet you where you are. This program combines gentle therapies, mindful movement, and soothing cuisine — all curated after your initial consultation. You’ll feel seen, supported, and softly rebalanced without pressure.`,
      sub_text_2: '',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Reset & Relax Protocol',
      sub_title: 'Our gentle wellness journey',
      required_days_text: '*Minimum 3 days | Recommended 7 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Ground & Assess',
      phase2: 'Gentle Healing',
      phase3: 'Integration & Flow',
      phases: [
        {
          id: 1,
          title: 'Ground & Assess',
          imgWeb: '/images/wellness-program/sub-programs/reset-relax/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/reset-relax/1.webp',
          pointers: [
            'Personal consultation and intention mapping',
            'Vital signs and stress-level assessment',
            'Introduction to naturopathic care',
          ],
        },
        {
          id: 2,
          title: 'Gentle Healing',
          imgWeb: '/images/wellness-program/sub-programs/reset-relax/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/reset-relax/2.webp',
          pointers: [
            'Daily therapies for detox, sleep, and digestion',
            'Yoga and mindful movement',
            'Light fasting or pranic meals (optional)',
          ],
        },
        {
          id: 3,
          title: 'Integration & Flow',
          imgWeb: '/images/wellness-program/sub-programs/reset-relax/web-3.webp',
          imgMobile: '/images/wellness-program/sub-programs/reset-relax/3.webp',
          pointers: [
            'Restorative breathwork and meditative practices',
            'Nature-based reflection and journaling',
            'Lifestyle guidance to continue at home',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Care Team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Priya R.',
          id: 1,
          review: `“It was like exhaling after years of holding my breath.”`,
        },
        {
          name: 'Ms. Avantika Gupta',
          id: 2,
          review: `“Pema’s personalised wellness approach, combining naturopathy and beautiful landscapes, made my experience truly once in a lifetime.”`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '3-day Reset',
          starting_at: 47000,
        },
        {
          id: 2,
          program_name: '5-day Gentle Journey',
          starting_at: 47000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // breathe easy
  {
    id: 'breathe-easy',
    program_name: 'Breathe Easy',
    header_text: 'For Lungs, Life, and Lightness',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Breathe Easy',
      video_url: 'https://youtu.be/68g3b2pirPw',
      testimonial_text: `‘I feel that Pema is the best wellness center in the world that I have been to.’`,
      user_name: 'Amit Bansal',
    },
    program_quote: `This program is designed for those who feel breathless — not just in the lungs, but in life. Whether due to respiratory issues, chronic fatigue, or mental tension, we help you breathe with ease again.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        'You want to ease recurring breathlessness, sinus congestion, and allergies.',
        'You want to strengthen lungs after asthma or post-viral weakness.',
        'You want to deepen breathing and reduce anxiety-linked shallow breaths.',
        'You want to improve oxygen uptake and shake off fatigue.',
        'You want to proactively build resilient lung health.',
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: 'At Pema, we combine breath science with respiratory healing rooted in nature.',
      sub_text_2:
        'You’ll receive therapies that open the chest, calm the nervous system, and bring oxygen back to every cell.',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Breathe Easy Protocol',
      sub_title: 'Our guided respiratory reset',
      required_days_text: '*Minimum 15 days | Recommended 30 days',
      note: `Note: The ideal program length may vary based on your health profile. 
      Our team will guide you after a personalised assessment.`,
      phase1: 'Lung Cleanse',
      phase2: 'Breath Reboot',
      phase3: 'Breath Integration',
      phases: [
        {
          id: 1,
          title: 'Lung Cleanse',
          imgWeb: '/images/wellness-program/sub-programs/breathe-easy/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/breathe-easy/mobile-1.webp',
          pointers: [
            'Respiratory consultation and pulmonary check',
            'Steam, salt therapy, and nasal irrigation',
            'Cleansing food plan for inflammation and phlegm',
          ],
        },
        {
          id: 2,
          title: 'Breath Reboot',
          imgWeb: '/images/wellness-program/sub-programs/breathe-easy/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/breathe-easy/mobile-2.webp',
          pointers: [
            'Yoga for lung expansion and diaphragmatic strength',
            'Oxygenation therapy and guided breathing sessions',
            'Manual therapies to release chest tension',
          ],
        },
        {
          id: 3,
          title: 'Breath Integration',
          imgWeb: '/images/wellness-program/sub-programs/breathe-easy/web-3.webp',
          imgMobile: '/images/wellness-program/sub-programs/breathe-easy/mobile-3.webp',
          pointers: [
            'Daily breathwork rituals',
            'Nature walks and mindful movement',
            'Post-program plan for respiratory resilience',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Breath Restoration Team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Neha T.',
          id: 1,
          review: `“I had long Covid. This is the only place that treated my breath like sacred medicine.”`,
        },
        {
          name: 'Karan J.',
          id: 2,
          review: `“My allergies have vanished. I wake up and can breathe — really breathe — again.”`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Breath Reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '14-day Complete Program',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // calm & clarity
  {
    id: 'calm-and-clarity',
    program_name: 'Calm & Clarity',
    header_text:
      'A nervous system reset that restores balance, emotional resilience, and inner quiet.',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Calm & Clarity',
      video_url: 'https://youtu.be/tD8dzzDBBIk',
      testimonial_text: `So I really really have a lot of gratitude to the doctors over here for having healed me so well. Thank you so much.`,
      user_name: 'Seema Sanghai',
    },
    program_quote: `This program is designed for those who live life in overdrive — and are ready to reclaim their calm. Using integrative therapies rooted in mind-body science, we help your system regulate, recover, and rewire for peace.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to switch off, unwind, and feel truly rested.`,
        `You want to deepen your sleep so it’s consistently restorative.`,
        `You want to use practical, gentle tools to master stress—step by step.`,
        `You want to reclaim clarity, emotional steadiness, and self-connection.`,
        `You want to cultivate a calm mind, stable mood, and inner ease.`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: 'At Pema, we don’t just manage stress, we restore nervous system regulation.',
      sub_text_2:
        'Our team uses therapies backed by vagus nerve science, hydrotherapy, acupuncture, and breath-based yoga to calm your system from the inside out. The goal isn’t a temporary escape. It’s long-term internal calm.',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Nervous System Reset Protocol',
      sub_title: 'Our Calm & Clarity program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Regulate',
      phase2: 'Restore',
      phase3: 'Rewire',
      phases: [
        {
          id: 1,
          title: 'Regulate',
          imgWeb: '/images/wellness-program/sub-programs/calm-clarity/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/calm-clarity/1.webp',
          pointers: [
            'Vagal nerve activation through acupuncture and hydrotherapy',
            'Sleep reset and inflammation reduction',
            'Restorative diet for cortisol and blood sugar support',
          ],
        },
        {
          id: 2,
          title: 'Restore',
          imgWeb: '/images/wellness-program/sub-programs/calm-clarity/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/calm-clarity/2.webp',
          pointers: [
            'Yogic breathwork and nervous system retraining',
            'Herbal teas and gut-brain axis support',
            'Naturopathic therapies for emotional detox',
          ],
        },
        {
          id: 3,
          title: 'Rewire',
          imgWeb: '/images/wellness-program/sub-programs/calm-clarity/web-3.webp',
          imgMobile: '/images/wellness-program/sub-programs/calm-clarity/3.webp',
          pointers: [
            'Energy alignment and mindset integration',
            'Tools for boundary setting and emotional clarity',
            'Personalised stress-management protocol for home',
          ],
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Anika S.',
          id: 1,
          review: `I was living on caffeine and autopilot. This program felt like someone hit reset on my whole nervous system.`,
        },
        {
          name: 'Karun T.',
          id: 2,
          review: `My sleep deepened, my anxiety reduced, and I felt clear-headed for the first time in months.`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day transformation',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // deep sleep sanctuary
  {
    id: 'deep-sleep-sanctuary',
    program_name: 'Deep Sleep Sanctuary',
    header_text:
      'A neurological reset that restores your sleep, stabilises mood, and rewires overnight recovery.',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Deep Sleep Sanctuary',
      video_url: 'https://youtu.be/MxxrHlGETZc',
      testimonial_text: `In the morning I used to push myself to wake up to go to the office. I was pushing myself to go to the office but here I was waking up at 5 o'clock easily.`,
      user_name: 'Qamar Zafeer',
    },
    program_quote: `Designed for those struggling with poor sleep, fatigue, or mental fog, this program targets the root cause of sleep disruption through natural therapies, circadian restoration, and emotional grounding.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to wake feeling refreshed and energised.`,
        `You want to fall asleep easily and stay asleep naturally.`,
        `You want to enjoy deep, continuous, restorative sleep.`,
        `You want to move through your day clear, calm, and focused.`,
        `You want to feel rested, emotionally steady, and mentally clear.`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: `At Pema, we treat sleep as a function of your entire system not a standalone issue. Our protocol activates your body’s parasympathetic state through targeted therapies, cellular support, and rhythmic recalibration helping your brain and body trust rest again.`,
      sub_text_2: '',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Sleep Restoration Protocol',
      sub_title: 'Our Deep Sleep Sanctuary program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Calm the System',
      phase2: 'Induce Deep Rest',
      phase3: 'Rewire Sleep Habits',
      phases: [
        {
          id: 1,
          title: 'Calm the System',
          imgWeb: '/images/wellness-program/sub-programs/deep-sleep/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/deep-sleep/1.webp',
          pointers: [
            'Nervous system reset with acupuncture and hydrotherapy',
            'Cortisol regulation and circadian syncing',
            'Anti-inflammatory meals to reduce brain fog',
          ],
        },
        {
          id: 2,
          title: 'Induce Deep Rest',
          imgWeb: '/images/wellness-program/sub-programs/deep-sleep/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/deep-sleep/2.webp',
          pointers: [
            'Sleep-focused breath training and yoga nidra',
            'Diet-based support for adrenal and melatonin rhythm',
            'Magnesium therapy and digestive calm protocols',
          ],
        },
        {
          id: 3,
          title: 'Rewire Sleep Habits',
          imgWeb: '/images/wellness-program/sub-programs/deep-sleep/web-3.webp',
          imgMobile: '/images/wellness-program/sub-programs/deep-sleep/3.webp',
          pointers: [
            'Energy balancing and emotional clarity',
            'Personal rituals for sustainable sleep',
            '60-day home recovery blueprint',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Deep Sleep Team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Neha J.',
          id: 1,
          review: `My mind used to race at night. Now I fall asleep in 15 minutes, and wake up feeling human again.`,
        },
        {
          name: 'Rahul M.',
          id: 2,
          review: `I haven’t used sleep medication in 3 months. Pema taught my body how to sleep again.`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day sleep reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day transformation',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // age well
  {
    id: 'age-well',
    program_name: 'Age Well',
    header_text:
      'A graceful ageing protocol that rebuilds strength, sharpens clarity, and restores glow at the cellular level',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Age Well',
      video_url: 'https://youtu.be/wz5oDbQWAOw',
      testimonial_text: `So from start to finish, they organized my day, my food plan, my exercise plan, and meditation, yoga, and believe it or not, I was in bed by 9:30 every night.`,
      user_name: 'Rosemin Madhavi Manji',
    },
    program_quote: `This program blends modern longevity science with ancient healing practices to optimise skin, joints, metabolism, and cognitive energy, without invasive treatments.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to counter slower recovery, duller skin, and stiffer joints with a smart reset.`,
        `You want to follow a structured plan that supports healthy ageing.`,
        `You want to age differently than your parents—on your own terms.`,
        `You want to stay sharp, energetic, and in command of your body.`,
        `You want to prioritise vitality over vanity.`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: 'At Pema, we don’t fight ageing,  we align with it.',
      sub_text_2:
        "Our approach focuses on restoring your body's rhythm, regenerating cellular energy, and calming inflammation,  so you age with vitality, strength, and ease.",
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Cellular Regeneration Protocol',
      sub_title: 'Our Age Well program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Cleanse & Revive',
      phase2: 'Rebuild & Strengthen',
      phase3: 'Longevity Integration',
      phases: [
        {
          id: 1,
          title: 'Cleanse & Revive',
          imgWeb: '/images/wellness-program/sub-programs/age-well/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/age-well/mobile-1.webp',
          pointers: [
            'Cleansing therapies to remove aging accelerators',
            'Nutrition reset with antioxidant-rich cuisine',
            'Inflammation reduction and digestive reboot',
          ],
        },
        {
          id: 2,
          title: 'Rebuild & Strengthen',
          imgWeb: '/images/wellness-program/sub-programs/age-well/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/age-well/mobile-2.webp',
          pointers: [
            'Acupuncture to stimulate energy flow and cognitive clarity',
            'Joint mobility and strength sessions',
            'Breathwork and sleep syncing for deep recovery',
          ],
        },
        {
          id: 3,
          title: 'Longevity Integration',
          imgWeb: '/images/wellness-program/sub-programs/age-well/web-3.webp',
          imgMobile: '/images/wellness-program/sub-programs/age-well/mobile-3.webp',
          pointers: [
            'Hormonal and metabolic balancing',
            'Personal longevity rituals',
            '90-day take-home plan for graceful ageing',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Age Well Team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Aarti D.',
          id: 1,
          review: `It wasn’t cosmetic. I didn’t just look better,  I moved easier, thought faster, and slept deeper.`,
        },
        {
          name: 'Rajesh K.',
          id: 2,
          review: `The inflammation in my hands is gone. I feel 10 years younger, without trying to pretend I’m 30.`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day age reset',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day graceful ageing plan',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // hair vitality boost
  {
    id: 'hair-vitality-boost',
    program_name: 'Hair Vitality Boost',
    header_text:
      'A targeted plan to reduce hair fall, stimulate regrowth, and restore scalp health from the inside out.',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: {
      heading: 'Stories of renewal with Hair Vitality Boost',
      video_url: 'https://youtu.be/rc6Y2DQwonI',
      testimonial_text: `The treatments, they are fantastic. Very well trained people. And I think they take a lot of effort on people getting trained.`,
      user_name: 'Jayashree Vivek',
    },
    program_quote: `This is not a surface-level treatment. It’s a root-to-tip reset powered by acupuncture, gut support, scalp therapies, and anti-inflammatory nutrition.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to enjoy fuller hair with noticeably less shedding.`,
        `You want to help settle stress and hormonal patterns to support healthy growth.`,
        `You want to keep your scalp clean, soothed, and comfortable.`,
        `You want to replenish key nutrients for stronger, more resilient strands.`,
        `You want to encourage natural hair growth—gently, without medications.`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1: 'At Pema, we approach hair as an extension of inner vitality.',
      sub_text_2:
        'Our protocols address internal inflammation, blood flow, nutrient absorption, and scalp balance, restoring conditions for healthy, sustained growth.',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Follicle Revival Protocol',
      sub_title: 'Our Hair Vitality Boost program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Control',
      phase2: 'Reignite',
      phase1_label: '1st month - 8 days',
      phase2_label: '2nd month - 8 nights',
      phases: [
        {
          id: 1,
          title: 'Control',
          phase_label: '1st month - 8 days',

          imgWeb: '/images/wellness-program/sub-programs/hair-boost/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/hair-boost/1.webp',
          pointers: [
            `Reduces active hair fall by strengthening follicles`,
            `Calms scalp inflammation and balances scalp pH`,
            `Clears buildup and improves circulation for growth`,
          ],
        },
        {
          id: 2,
          title: 'Reignite',
          phase_label: '2nd month - 8 nights',

          imgWeb: '/images/wellness-program/sub-programs/hair-boost/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/hair-boost/2.webp',
          pointers: [
            `Stimulates new growth with targeted therapies and acupuncture`,
            `Improves density, texture and shine`,
            `Restores long term follicle strength and healthy hair cycles`,
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Hair Restoration Team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Meenakshi R.',
          id: 1,
          review: `Hair fall had become my identity. Within days, that shifted. My scalp finally felt calm.`,
        },
        {
          name: 'Natasha A.',
          id: 2,
          review: `My regrowth wasn't just visible — it felt deeply mine. This was healing, not hiding.`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Hair Vitality Boost',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Deep Growth Program',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },

  // facial skin renewal
  {
    id: 'facial-skin-renewal',
    program_name: 'Facial Skin Renewal',
    header_text:
      'A journey that restores dermal balance, natural glow, and skin vitality from within.',
    hero_img_web: '/images/wellness-program/sub-programs/pema-signature-hero-web.webp',
    hero_img_mobile: '/images/wellness-program/sub-programs/pema-signature-hero-mobile.webp',
    video_testimonial: null,
    program_quote: `Designed for those seeking healthy, glowing skin without harsh interventions, this journey restores dermal balance through pranic skincare, internal detoxification, and natural stimulation. Our protocols revive your skin from the inside out.`,
    what_brings_you_here: {
      heading: 'What brings you here',
      imgWeb: '/images/wellness-program/sub-programs/what-brings-you-here-web.webp',
      imgMobile: '/images/wellness-program/sub-programs/what-brings-you-here-mobile.webp',
      pointers: [
        `You want to revive dull, tired skin that hasn’t responded to products.`,
        `You want to even out tone, reduce pigmentation, and soften stress lines.`,
        `You want a real, lasting glow—not just a makeup fix.`,
        `You want gentler care that respects sensitive skin.`,
        `You want to try a more conscious, healing approach.`,
      ],
    },
    three_img_section: {
      img1: '/images/wellness-program/sub-programs/pema-way/img-1.webp',
      img2: '/images/wellness-program/sub-programs/pema-way/img-2.webp',
      img3: '/images/wellness-program/sub-programs/pema-way/img-3.webp',
      imgMobile: '/images/wellness-program/sub-programs/pema-way/img-mobile.webp',
      heading: 'The Pema way',
      sub_text_1:
        'We don’t believe in quick fixes or harsh peels. Our approach supports your skin’s self-renewal systems.',
      sub_text_2:
        'Through acupuncture, skin nutrition, lymphatic stimulation, pranic care, and breath-guided therapies, we help your face reflect the vitality you feel.',
      sub_text_3: '',
    },
    inside_program: {
      title: 'Your Skin Renewal Protocol',
      sub_title: 'Our Facial Skin Renewal program',
      required_days_text: '*Minimum 8 days | Recommended 14 days',
      note: `Note: The ideal program length may vary based on your health profile.
Our team will guide you after a personalised assessment.`,
      phase1: 'Internal Cleanse',
      phase2: 'Circulation & Repair',
      phase3: 'Radiance Reset',
      phases: [
        {
          id: 1,
          title: 'Internal Cleanse',
          imgWeb: '/images/wellness-program/sub-programs/facial-skin/web-1.webp',
          imgMobile: '/images/wellness-program/sub-programs/facial-skin/1.webp',
          pointers: [
            'Detox analysis and skin mapping',
            'Gut-liver axis support',
            'Herbal teas for skin purification',
            'Ozone - facial cupping',
          ],
        },
        {
          id: 2,
          title: 'Circulation & Repair',
          imgWeb: '/images/wellness-program/sub-programs/facial-skin/web-2.webp',
          imgMobile: '/images/wellness-program/sub-programs/facial-skin/2.webp',
          pointers: [
            'Facial acupuncture and activate the collagen production',
            'Collagen-boosting diet',
            'Mind-skin syncing with yoga nidra',
          ],
        },
        {
          id: 3,
          title: 'Radiance Reset',
          imgWeb: '/images/wellness-program/sub-programs/facial-skin/web-3.webp',
          imgMobile: '/images/wellness-program/sub-programs/facial-skin/3.webp',
          pointers: [
            'Custom pranic face rituals',
            'Lymphatic facial massage',
            'Skin-protective meals and hydration protocol',
          ],
        },
      ],
    },
    experts: {
      heading: 'Your Radiance Team',
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
      bgImgWeb: '/images/wellness-program/sub-programs/testimonials-bg-web.webp',
      bgImgMobile: '/images/wellness-program/sub-programs/testimonials-bg-mobile.webp',
      data: [
        {
          name: 'Amrita K.',
          id: 1,
          review: `“My pigmentation softened, my face felt lifted, and I felt more like myself.”`,
        },
        {
          name: 'Reena S.',
          id: 2,
          review: `“The results weren’t just cosmetic — I felt brighter, clearer, and calmer.”`,
        },
      ],
    },
    investment_booking: {
      title: 'Investment & booking',
      programs: [
        {
          id: 1,
          program_name: '8-day Skin Renewal',
          starting_at: 45000,
        },
        {
          id: 2,
          program_name: '15-day Program',
          starting_at: 45000,
        },
      ],
      note: `(* Includes all consultations, daily therapies, premium healing cuisine, and post-stay guidance other than Program Enhancements)`,
    },
  },
]
