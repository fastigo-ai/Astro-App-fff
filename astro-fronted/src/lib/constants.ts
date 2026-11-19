export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface VedicMonthMilestone {
  month: number;
  sanskritName: string;
  hindiTitle: string;
  trimester: 1 | 2 | 3;
  weeksRange: string;
  fetalDevelopment: string;
  vedicTheme: string;
  primaryPractice: string;
}

export const VEDIC_MONTH_MILESTONES: VedicMonthMilestone[] = [
  {
    month: 1,
    sanskritName: 'Srishti Sankalp (सृष्टि संकल्प)',
    hindiTitle: 'बीज एवं गर्भाधान शुद्धि',
    trimester: 1,
    weeksRange: 'Week 1 - 4',
    fetalDevelopment: 'Cellular division, sacred implantation, neural tube initiation.',
    vedicTheme: 'Chitta Shuddhi & Sattvic environment creation for pure soul invitation.',
    primaryPractice: 'Gayatri Mantra chanting, quiet breathing, cold/spicy food restriction.',
  },
  {
    month: 2,
    sanskritName: 'Anga Utpatti (अंग उत्पत्ति)',
    hindiTitle: 'हृदय स्पंदन व अवयव निर्माण',
    trimester: 1,
    weeksRange: 'Week 5 - 8',
    fetalDevelopment: 'First rhythmic heartbeat, cranial formation, limb buds emerge.',
    vedicTheme: 'Hridaya Samvad - Connecting with baby through the heart chakra.',
    primaryPractice: 'Santan Gopal Mantra, gentle hydration, morning sickness herbal remedies.',
  },
  {
    month: 3,
    sanskritName: 'Chaitanya Jagruti (चैतन्य जागृति)',
    hindiTitle: 'चेतना एवं इन्द्रिय अंकुरण',
    trimester: 1,
    weeksRange: 'Week 9 - 13',
    fetalDevelopment: 'Reflexes develop, vocal cords and tooth buds form, facial features refine.',
    vedicTheme: 'Indriya Samyama - Sensory calmness and pure positive thoughts.',
    primaryPractice: 'Garbh Sanskar Raagas (Bhairav & Yaman 432Hz), daily sattvic dry fruit milk.',
  },
  {
    month: 4,
    sanskritName: 'Karna Shravana (कर्ण श्रवण)',
    hindiTitle: 'श्रवण शक्ति एवं संवाद का आरंभ',
    trimester: 2,
    weeksRange: 'Week 14 - 17',
    fetalDevelopment: 'Auditory receptors fully activate; baby clearly hears mother’s heartbeat & voice.',
    vedicTheme: 'Garbh Samvad - Daily affectionate spoken conversations between parents & baby.',
    primaryPractice: 'Mother & father daily voice talk, classical veena audios, memory stimulation.',
  },
  {
    month: 5,
    sanskritName: 'Mana Vikas (मन विकास)',
    hindiTitle: 'मन एवं भावुक संबंध',
    trimester: 2,
    weeksRange: 'Week 18 - 22',
    fetalDevelopment: 'Brain neurons multiply rapidly; baby feels emotions and kicks actively.',
    vedicTheme: 'Bhavna Shuddhi - Emotional tranquility, avoiding anger and negative media.',
    primaryPractice: 'Daily kick counting, joyous spiritual reading (Ramayana/Gita excerpts).',
  },
  {
    month: 6,
    sanskritName: 'Buddhi & Medha (बुद्धि एवं मेधा)',
    hindiTitle: 'बुद्धि, ज्ञान एवं स्मरण शक्ति',
    trimester: 2,
    weeksRange: 'Week 23 - 27',
    fetalDevelopment: 'Cerebral cortex convolutions develop; sleep-wake cycles emerge; taste buds functional.',
    vedicTheme: 'Medha Shakti - Baby brain stimulation with puzzles and intellectual tales.',
    primaryPractice: 'Math riddles, Sanskrit shlokas recitation, prenatal yoga for spine strength.',
  },
  {
    month: 7,
    sanskritName: 'Sarvanga Purnata (सर्वांग पूर्णता)',
    hindiTitle: 'समस्त इन्द्रियों की जागृति',
    trimester: 3,
    weeksRange: 'Week 28 - 31',
    fetalDevelopment: 'Eyelids open, responsive to external light, sound, and belly touches.',
    vedicTheme: 'Dhyana & Dharana - Spiritual communion and calming deep meditation.',
    primaryPractice: 'Om Dhyana, belly massage with safe sesame oil, weekly live doctor Zoom.',
  },
  {
    month: 8,
    sanskritName: 'Ojas Sanchara (ओज संचार)',
    hindiTitle: 'प्राण शक्ति व प्रतिरक्षा संचरण',
    trimester: 3,
    weeksRange: 'Week 32 - 35',
    fetalDevelopment: 'Vital Ojas (vital immunity energy) flows between mother and baby; rapid weight gain.',
    vedicTheme: 'Ojas Raksha - Calm restorative rest, stress avoidance, gentle perineal prep.',
    primaryPractice: 'Pranayama (Anulom Vilom), restful lullabies, father’s gentle bedtime care.',
  },
  {
    month: 9,
    sanskritName: 'Janma Siddhi (जन्म सिद्धि)',
    hindiTitle: 'सहज, सुखद एवं सुरक्षित प्रसव',
    trimester: 3,
    weeksRange: 'Week 36 - 40',
    fetalDevelopment: 'Full term maturity; lungs primed; baby moves into head-down birth canal position.',
    vedicTheme: 'Sukh-Prasav Sankalp - Fearless surrender and blissful natural birth confidence.',
    primaryPractice: 'Sukh-Prasav mantras, pelvic mobility exercises, labor breathing rehearsals.',
  },
];
