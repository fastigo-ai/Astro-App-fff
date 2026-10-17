export interface ProgramTier {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  badge?: string;
  duration: string;
  durationMonths: number;
  originalPrice: number;
  calculatedPrice: number;
  discountPercent: number;
  monthlyRate: string;
  highlightText: string;
  features: string[];
}

export interface ProgramModule {
  title: string;
  hindiTitle: string;
  description: string;
  items: string[];
}

export interface ProgramDetail {
  id: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  hindiSubtitle: string;
  badge: string;
  badgeColor: string;
  color: string;
  rating: number;
  reviewsCount: number;
  enrolledCount: string;
  image: any;
  overview: string;
  hindiOverview: string;
  whoIsItFor: string;
  duration: string;
  tiers: ProgramTier[];
  unlockedModules: string[]; // e.g. ['kicks', 'bump', 'samvad', 'mood', 'activities', 'doctor_chat']
  modules: ProgramModule[];
  deliverables: string[];
  faculty: { name: string; role: string; exp: string }[];
  faqs: { q: string; a: string }[];
}

export const PROGRAMS_DATA: Record<string, ProgramDetail> = {
  garbh_sanskar: {
    id: 'garbh_sanskar',
    title: 'Garbh Sanskar',
    hindiTitle: 'गर्भ संस्कार',
    subtitle: 'Positive Pregnancy & Womb Bonding',
    hindiSubtitle: 'सकारात्मक गर्भावस्था और दिव्य मातृत्व',
    badge: 'MOST POPULAR',
    badgeColor: '#16A34A',
    color: '#65A30D',
    rating: 4.9,
    reviewsCount: 3840,
    enrolledCount: '12,500+ Moms',
    image: require('../../../assets/programs/garbh_sanskar.jpg'),
    overview: 'An authentic Vedic and modern scientific Garbh Sanskar program designed to stimulate your baby’s IQ, EQ, and spiritual intelligence inside the womb while keeping the mother calm, healthy, and happy.',
    hindiOverview: 'प्राचीन वैदिक ज्ञान और आधुनिक विज्ञान का संगम, जो गर्भस्थ शिशु की बुद्धि, संस्कार और स्वास्थ्य को पुष्ट करता है और माँ को सुखद प्रसव की ओर ले जाता है।',
    whoIsItFor: 'Pregnant mothers in any trimester (Month 1 to 9).',
    duration: 'Full Pregnancy (~3 to 9 Months till Delivery)',
    unlockedModules: ['kicks', 'bump', 'samvad', 'mood', 'activities', 'diet', 'doctor_chat'],
    tiers: [
      {
        id: 'garbhsanskar-utkarsh',
        name: 'Utkarsh (Complete Journey)',
        hindiName: 'उत्कर्ष (संपूर्ण यात्रा)',
        tagline: 'Till Delivery Complete Holistic Care',
        badge: 'RECOMMENDED • BEST VALUE',
        duration: 'Till Delivery (~6-9 Months)',
        durationMonths: 6,
        originalPrice: 4499,
        calculatedPrice: 2499,
        discountPercent: 44,
        monthlyRate: '₹416/mo',
        highlightText: 'Full coverage for all remaining pregnancy months',
        features: [
          'Full coverage till your delivery date',
          'Daily Vedic Garbh Sanskar routine & Shlokas',
          'Live pregnancy yoga & guided meditation',
          'Personalized trimester Ayurvedic diet chart',
          'Monthly 1-on-1 Gynecologist & Ayurvedic consultations',
          'Unlimited Baby Kick Counter & Garbh Samvad voice diary',
          'Baby Bump photo journal with milestone stamps',
          '24/7 Maternal medical & astrological guidance',
        ],
      },
      {
        id: 'garbhsanskar-aadhar',
        name: 'Aadhar (3 Months Starter)',
        hindiName: 'आधार (बुनियादी संस्कार)',
        tagline: 'Core Trimester Foundation Plan',
        badge: 'STARTER',
        duration: '3 Months Active Access',
        durationMonths: 3,
        originalPrice: 2499,
        calculatedPrice: 1499,
        discountPercent: 40,
        monthlyRate: '₹499/mo',
        highlightText: '3 Months core Garbh Sanskar foundation',
        features: [
          '3 Months active daily Vedic activities',
          'Recorded pregnancy yoga & relaxation audio',
          'Standard trimester nutrition guidelines',
          'Weekly live group Q&A with doctors',
          'Interactive Baby Kick & Mood therapy trackers',
        ],
      },
    ],
    modules: [
      {
        title: 'Module 1: Mansik & Sharirik Shuddhi (Mind & Body)',
        hindiTitle: 'मॉड्यूल १: मानसिक व शारीरिक शुद्धि',
        description: 'Vedic techniques and meditation to release pregnancy anxiety and nurture a peaceful womb environment.',
        items: ['Pranayama for expectant mothers', 'Garbh Kalyan Mantra chanting', 'Soothing Raga therapy for calm sleep'],
      },
      {
        title: 'Module 2: Garbh Samvad & Sensory Bonding',
        hindiTitle: 'मॉड्यूल २: गर्भ संवाद एवं आत्मीय जुड़ाव',
        description: 'Establish deep emotional and neurological connection with your baby through voice exercises.',
        items: ['Daily Hindi & English womb dialogue scripts', 'Voice diary audio recording', 'Classical auditory stimulation'],
      },
      {
        title: 'Module 3: Fetal Brain Stimulation & IQ Boost',
        hindiTitle: 'मॉड्यूल ३: शिशु बौद्धिक विकास (IQ & EQ)',
        description: 'Puzzles, stories, and sensory triggers that accelerate synapse development in fetal brain.',
        items: ['Math & logic womb puzzles', 'Panchatantra moral storytelling', 'Bilingual language exposure in womb'],
      },
      {
        title: 'Module 4: Sukhprasav (Easy & Natural Delivery Prep)',
        hindiTitle: 'मॉड्यूल ४: सुखप्रसव (प्राकृतिक प्रसव तैयारी)',
        description: 'Pelvic floor exercises, breathing techniques, and posture guides for smooth, confident labor.',
        items: ['Labor pain coping breathwork', 'Pelvic opening gentle asanas', 'Partner support labor guide'],
      },
    ],
    deliverables: [
      'Welcome Vedic Garbhsanskar Kit (physical handbook + mantra beads)',
      'Digital Audio Library (100+ Raagas & Garbh Samvad Tracks)',
      'Monthly Printed Diet & Exercise Journal',
      'VIP Access to WhatsApp Doctor Support Group',
    ],
    faculty: [
      { name: 'Dr. Sunita Sharma', role: 'Senior Obstetrician & Gynecologist', exp: '18+ Years Exp' },
      { name: 'Acharya V. Shastri', role: 'Vedic Astrologer & Garbhsanskar Scholar', exp: '22+ Years Exp' },
      { name: 'Dr. Meera Iyer (BAMS)', role: 'Ayurvedic Pregnancy Nutritionist', exp: '12+ Years Exp' },
    ],
    faqs: [
      {
        q: 'When should I start the Garbh Sanskar program?',
        a: 'You can begin in any month! As soon as pregnancy is confirmed, the fetus starts responding to thoughts, hormones, and sounds.',
      },
      {
        q: 'Will I get personal doctor consultations?',
        a: 'Yes, the Utkarsh full package includes 1-on-1 monthly consultations with verified gynecologists and Ayurvedic specialists.',
      },
      {
        q: 'Can my husband participate?',
        a: 'Absolutely! Partner bonding sessions and father-baby Garbh Samvad prompts are included in every module.',
      },
    ],
  },

  beej_sanskar: {
    id: 'beej_sanskar',
    title: 'Beej Sanskar',
    hindiTitle: 'बीज संस्कार',
    subtitle: 'Fertility Detox & Egg/Sperm Vitality',
    hindiSubtitle: 'प्राकृतिक गर्भाधान एवं बीज शुद्धि',
    badge: 'FERTILITY CARE',
    badgeColor: '#DB2777',
    color: '#EC4899',
    rating: 4.95,
    reviewsCount: 1920,
    enrolledCount: '5,800+ Couples',
    image: require('../../../assets/programs/beej_sanskar.jpg'),
    overview: 'A specialized 90-day couple program blending classical Ayurvedic Panchakarma principles, hormonal balancing diets, and reproductive wellness yoga to optimize egg and sperm quality naturally.',
    hindiOverview: 'आयुर्वेदिक बीज शुद्धि, हार्मोनल संतुलन और योग द्वारा दंपत्ति को प्राकृतिक रूप से स्वस्थ संतान प्राप्ति के लिए तैयार करने वाला ९० दिवसीय विशेष कार्यक्रम।',
    whoIsItFor: 'Couples trying to conceive naturally, facing delay in conception, or preparing for high-vitality parenthood.',
    duration: '90 Days Comprehensive Program',
    unlockedModules: ['activities', 'diet', 'doctor_chat', 'mood'],
    tiers: [
      {
        id: 'beej-complete',
        name: 'Beej Shuddhi Complete (Couple)',
        hindiName: 'बीज शुद्धि संपूर्ण (दंपत्ति)',
        tagline: '90-Day Full Holistic Couple Journey',
        badge: 'MOST EFFECTIVE',
        duration: '90 Days Complete Protocol',
        durationMonths: 3,
        originalPrice: 25000,
        calculatedPrice: 7999,
        discountPercent: 68,
        monthlyRate: '₹2,666/mo',
        highlightText: 'Full 90-day couple fertility transformation protocol',
        features: [
          'Dual partner Ayurvedic health & Prakriti evaluation',
          'Personalized Beej Shuddhi herbal detox guidance',
          'Ovulation & fertile window hormonal tracker',
          'Daily couple fertility yoga & endocrine meditation',
          '3 Personal consultations with senior Ayurvedic Vaidya',
          'Astrological planetary transit reading for conception',
          'Apni Sakhi dedicated emotional wellness counselor',
        ],
      },
      {
        id: 'beej-foundation',
        name: 'Beej Sanskar Starter (30 Days)',
        hindiName: 'बीज संस्कार आरंभ (३० दिन)',
        tagline: '1-Month Fertility Kickstarter',
        badge: 'ESSENTIALS',
        duration: '30 Days Detox Routine',
        durationMonths: 1,
        originalPrice: 9999,
        calculatedPrice: 3499,
        discountPercent: 65,
        monthlyRate: '₹3,499/mo',
        highlightText: '30-day foundational lifestyle reset',
        features: [
          '30-Day reproductive vitality dietary plan',
          'Endocrine balance fertility yoga video library',
          '1 Consultation with Ayurvedic Doctor',
          'Fertility stress management audio therapy',
        ],
      },
    ],
    modules: [
      {
        title: 'Module 1: Sharir Shuddhi (Detox & Panchakarma Prep)',
        hindiTitle: 'मॉड्यूल १: शरीर शुद्धि व दोष निवारण',
        description: 'Eliminate toxins (Ama) from reproductive tissue (Shukra & Artava Dhatus).',
        items: ['Ayurvedic dietary detox plan', 'Digestive fire (Agni) restoration', 'Cellular rejuvenation routines'],
      },
      {
        title: 'Module 2: Hormonal Harmony & Ovulation Vitality',
        hindiTitle: 'मॉड्यूल २: हार्मोनल संतुलन एवं डिंब पुष्टि',
        description: 'Balance LH, FSH, thyroid, and progesterone naturally through circadian rhythm and herbs.',
        items: ['Seed cycling and nutrient therapy', 'Stress-cortisol reduction pranayama', 'Cervical mucus & ovulation tracking'],
      },
      {
        title: 'Module 3: Sukra & Beej Poshana (Egg & Sperm Quality)',
        hindiTitle: 'मॉड्यूल ३: शुक्र व बीज पोषण',
        description: 'Enhance cellular DNA integrity, motility, and morphology before conception.',
        items: ['Micronutrient and antioxidant foods', 'Specific asanas for pelvic blood flow', 'Male vitality Ayurvedic protocol'],
      },
    ],
    deliverables: [
      'Beej Sanskar Organic Herbal Detox Starter Kit',
      'Ovulation & Conception Physical Planner',
      'Couple Yoga Guidebook with HD Video Access',
      'Direct WhatsApp Line to Fertility Coach',
    ],
    faculty: [
      { name: 'Dr. Anand Joshi (MD Ayurveda)', role: 'Fertility & Beej Sanskar Specialist', exp: '20+ Years Exp' },
      { name: 'Dr. Shalini Saxena', role: 'Reproductive Endocrinologist', exp: '15+ Years Exp' },
    ],
    faqs: [
      {
        q: 'How does Beej Sanskar improve chances of conception?',
        a: 'In Ayurveda, healthy progeny begins with purified seed (Beej) and fertile soil (Kshetra). It optimizes blood flow, balances hormones, and eliminates cellular stress.',
      },
      {
        q: 'Do both husband and wife need to follow this?',
        a: 'Yes, 50% of the baby’s genetic vitality comes from the sperm and 50% from the ovum, so couple participation yields the highest success.',
      },
    ],
  },

  garbhdhaan_sanskar: {
    id: 'garbhdhaan_sanskar',
    title: 'Garbhdhaan Sanskar',
    hindiTitle: 'गर्भाधान संस्कार',
    subtitle: 'Auspicious Pre-Pregnancy Planning & Muhurat',
    hindiSubtitle: 'शुभ मुहूर्त एवं दिव्य गर्भधारण योजना',
    badge: 'PLANNING',
    badgeColor: '#2563EB',
    color: '#3B82F6',
    rating: 4.9,
    reviewsCount: 1420,
    enrolledCount: '4,200+ Couples',
    image: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
    overview: 'The first of the sixteen sacred Vedic Sanskars. Combines astrological Muhurat Aadharit Tithis, pre-pregnancy medical checklists, and auspicious spiritual rituals to invite a noble, healthy soul into the family.',
    hindiOverview: 'षोडश संस्कारों में प्रथम संस्कार। ज्योतिषीय शुभ मुहूर्त, गर्भाधान तिथियां और वैज्ञानिक स्वास्थ्य योजना के साथ पावन संकल्प।',
    whoIsItFor: 'Couples planning pregnancy within the next 3 to 12 months.',
    duration: '6 Months Preconception Auspicious Window',
    unlockedModules: ['activities', 'diet', 'doctor_chat'],
    tiers: [
      {
        id: 'garbhdhaan-full',
        name: 'Garbhdhaan Complete Muhurat & Health',
        hindiName: 'गर्भाधान संपूर्ण मुहूर्त व स्वास्थ्य',
        tagline: 'Complete Auspicious Conception Program',
        badge: 'POPULAR',
        duration: '6 Months Full Validity',
        durationMonths: 6,
        originalPrice: 11000,
        calculatedPrice: 3999,
        discountPercent: 64,
        monthlyRate: '₹666/mo',
        highlightText: 'Customized Muhurat calculations & doctor clearance',
        features: [
          'Personalized Shubh Muhurat & Tithi calendar for 6 months',
          'Horoscope planetary matching for child-birth yoga (Putra/Putri Dosha analysis)',
          'Pre-conception blood test & clinical checklist review by Gynecologist',
          'Sattvic lifestyle guidelines for both partners',
          'Garbhdhaan Sankalp & Vedic ritual step-by-step guidance',
          '1-on-1 session with senior Astrologer & Gynecologist',
        ],
      },
      {
        id: 'garbhdhaan-starter',
        name: 'Muhurat Only Guidance',
        hindiName: 'शुभ मुहूर्त परामर्श',
        tagline: 'Astrological Conception Muhurat',
        badge: 'FOCUSED',
        duration: '3 Months Muhurat Report',
        durationMonths: 3,
        originalPrice: 4999,
        calculatedPrice: 1999,
        discountPercent: 60,
        monthlyRate: '₹666/mo',
        highlightText: 'Detailed 90-day auspicious date & time table',
        features: [
          'Detailed monthly Shubh Tithi & Nakshatra list',
          'Planetary transit impact evaluation',
          'Digital Muhurat report with dos & don’ts',
        ],
      },
    ],
    modules: [
      {
        title: 'Module 1: Auspicious Tithi & Nakshatra Selection',
        hindiTitle: 'मॉड्यूल १: शुभ तिथि व नक्षत्र चयन',
        description: 'Vedic planetary alignment for spiritual, mental, and physical virtues in the progeny.',
        items: ['Shukla Paksha auspicious nights', 'Avoidance of Bhadra and Rikta tithis', 'Personal Janma Nakshatra harmony'],
      },
      {
        title: 'Module 2: Medical & Nutritional Clearance',
        hindiTitle: 'मॉड्यूल २: चिकित्सीय व पोषण जांच',
        description: 'Ensuring hemoglobin, thyroid, folate, and vitamin D levels are optimal before conception.',
        items: ['Doctor pre-pregnancy lab panel', 'Folic acid & micronutrient diet plan', 'Sattvic food principles'],
      },
      {
        title: 'Module 3: Garbhdhaan Sankalp & Mindset',
        hindiTitle: 'मॉड्यूल ३: गर्भाधान संकल्प व ध्यान',
        description: 'Mental preparation and spiritual prayers to welcome a noble and auspicious soul.',
        items: ['Couple bonding meditation', 'Vedic prayer chanting', 'Emotional alignment for parenthood'],
      },
    ],
    deliverables: [
      'Personalized Astrological Muhurat Calendar PDF',
      'Pre-Pregnancy Medical Checklist by Senior Gynecologist',
      'Garbhdhaan Sankalp Mantra Audio Guide',
    ],
    faculty: [
      { name: 'Pandit Raghavendra Shastri', role: 'Vedic Astrologer (30 yrs exp)', exp: '30+ Years Exp' },
      { name: 'Dr. Reena Patel', role: 'Chief Gynecologist & Fertility Consultant', exp: '16+ Years Exp' },
    ],
    faqs: [
      {
        q: 'What is the significance of Garbhdhaan Muhurat?',
        a: 'The mental state, planetary vibrations, and biological vitality during conception directly influence the temperament and constitution of the child.',
      },
      {
        q: 'Can this be done alongside modern medical tests?',
        a: 'Yes, our program integrates modern clinical lab screenings with ancient Vedic timing for best results.',
      },
    ],
  },

  bal_sanskar: {
    id: 'bal_sanskar',
    title: 'Bal Sanskar',
    hindiTitle: 'बाल संस्कार',
    subtitle: 'Newborn Nurturing & Sacred Ceremonies',
    hindiSubtitle: 'नवजात शिशु संस्कार एवं वैदिक पोषण',
    badge: 'NEWBORN 0-2 YRS',
    badgeColor: '#0891B2',
    color: '#06B6D4',
    rating: 4.92,
    reviewsCount: 1680,
    enrolledCount: '6,400+ Babies',
    image: require('../../../assets/programs/bal_sanskar.jpg'),
    overview: 'A complete Vedic parenting guide covering the essential ceremonies (Namkaran, Nishkraman, Annaprashan, Mundan) alongside modern pediatric development tracking, infant massage, and cognitive stimulation from birth to age 2.',
    hindiOverview: 'जन्म से २ वर्ष तक शिशु के पावन वैदिक संस्कार (नामकरण, अन्नप्राशन, निष्क्रमण, मुंडन) और वैज्ञानिक शारीरिक-मानसिक विकास की संपूर्ण मार्गदर्शिका।',
    whoIsItFor: 'Parents with newborns, infants, and toddlers (0 to 24 months).',
    duration: '1 Year Full Infant Care & Ceremony Access',
    unlockedModules: ['activities', 'diet', 'doctor_chat', 'mood'],
    tiers: [
      {
        id: 'bal-complete',
        name: 'Bal Sanskar 1-Year Comprehensive',
        hindiName: 'बाल संस्कार १-वर्ष संपूर्ण',
        tagline: 'All Vedic Ceremonies & Pediatric Milestone Care',
        badge: 'RECOMMENDED',
        duration: '12 Months Active Access',
        durationMonths: 12,
        originalPrice: 12000,
        calculatedPrice: 3499,
        discountPercent: 70,
        monthlyRate: '₹291/mo',
        highlightText: 'Full coverage for infant year 1 & all 4 major ceremonies',
        features: [
          'Full 12-month access to baby developmental milestones',
          'Vedic Namkaran (Naming ceremony) Astro-Muhurat & alphabet guide',
          'Annaprashan (First solid food) ceremony kit & Sattvic baby recipes',
          'Nishkraman (First outdoor sun/moon darshan) ritual guide',
          'Daily Ayurvedic baby massage (Abhyanga) technique videos',
          'Vedic lullabies, mantras & baby calming audio track library',
          'Quarterly Pediatrician & child wellness consults',
        ],
      },
      {
        id: 'bal-ceremony',
        name: 'Ceremony Only Package',
        hindiName: 'संस्कार अनुष्ठान पैकेज',
        tagline: 'Rituals & Muhurat for Baby Ceremonies',
        badge: 'CEREMONIES',
        duration: '6 Months Validity',
        durationMonths: 6,
        originalPrice: 6000,
        calculatedPrice: 1999,
        discountPercent: 67,
        monthlyRate: '₹333/mo',
        highlightText: 'Muhurats and ritual step-by-step guides for ceremonies',
        features: [
          'Namkaran & Annaprashan custom Muhurat calculation',
          'Priest checklist & sacred mantras audio guide',
          'Baby food introduction chart (Months 6-12)',
        ],
      },
    ],
    modules: [
      {
        title: 'Module 1: Sacred Newborn Ceremonies',
        hindiTitle: 'मॉड्यूल १: पावन नवजात संस्कार',
        description: 'Complete guides for Jatakarma, Namkaran, Nishkraman, and Karnavedha rituals.',
        items: ['Vedic alphabet letter calculation', 'Ceremony checklist & family prayer', 'Sun & Moon darshan ritual'],
      },
      {
        title: 'Module 2: Annaprashan & Sattvic Weaning',
        hindiTitle: 'मॉड्यूल २: अन्नप्राशन व सुपाच्य शिशु आहार',
        description: 'Transitioning from breast milk to first solids smoothly with Ayurvedic infant nutrition.',
        items: ['Month 6 to 12 milestone baby foods', 'First solid food recipe booklet', 'Digestive care (Colic & gas relief)'],
      },
      {
        title: 'Module 3: Ayurvedic Baby Massage & Motor Skills',
        hindiTitle: 'मॉड्यूल ३: शिशु अभ्यंग व शारीरिक पुष्टि',
        description: 'Traditional herbal oil massage routines that strengthen bones and promote sound sleep.',
        items: ['Correct Abhyanga strokes video guide', 'Tummy time & motor skill development', 'Calming sleep lullabies'],
      },
    ],
    deliverables: [
      'Bal Sanskar Ceremony Handbook (Hardcover / PDF)',
      'Ayurvedic Baby Massage Oil Recipe & Guide',
      'Baby Memory Book with Vedic Milestone Badges',
    ],
    faculty: [
      { name: 'Dr. Vivek Saxena (MD Pediatrics)', role: 'Senior Pediatrician & Newborn Specialist', exp: '17+ Years Exp' },
      { name: 'Acharya Girish Vashistha', role: 'Vedic Rituals & Sanskar Authority', exp: '25+ Years Exp' },
    ],
    faqs: [
      {
        q: 'When should Namkaran be performed?',
        a: 'Traditionally, Namkaran is performed on the 10th, 11th, or 12th day after birth, or on an auspicious Nakshatra calculated for the baby.',
      },
      {
        q: 'Does this include advice on baby colic and sleep training?',
        a: 'Yes, natural Ayurvedic colic remedies, pediatric sleep routines, and soothing lullabies are fully included.',
      },
    ],
  },

  infant_care: {
    id: 'infant_care',
    title: 'Infant Care',
    hindiTitle: 'शिशु एवं प्रसूता देखभाल',
    subtitle: 'Postpartum Mother Care & Infant Parenting Coach',
    hindiSubtitle: 'प्रसवोपरांत मातृत्व स्वास्थ्य एवं शिशु पोषण',
    badge: 'POSTPARTUM COACHING',
    badgeColor: '#D97706',
    color: '#F59E0B',
    rating: 4.88,
    reviewsCount: 1250,
    enrolledCount: '4,900+ Mothers',
    image: require('../../../assets/programs/infant_care.jpg'),
    overview: 'Dedicated support for new mothers during the crucial first 6 months post-delivery. Features certified lactation guidance, postpartum pelvic recovery, maternal emotional wellness, and baby care support.',
    hindiOverview: 'प्रसव के बाद माँ के स्वास्थ्य, दुग्धपान (लैक्टेशन) और नवजात की सुरक्षित देखभाल के लिए विशेषज्ञ डॉक्टर एवं पर्सनल पेरेंटिंग कोच का सशक्त संबल।',
    whoIsItFor: 'New mothers in their 4th trimester (0 to 6 months post-delivery).',
    duration: '6 Months Comprehensive Postpartum Care',
    unlockedModules: ['activities', 'diet', 'doctor_chat', 'mood'],
    tiers: [
      {
        id: 'infant-complete',
        name: 'Infant & Postpartum Care Complete',
        hindiName: 'शिशु व प्रसूता संपूर्ण देखभाल',
        tagline: 'Lactation, Recovery Diet & Parenting Coach',
        badge: 'ALL-IN-ONE',
        duration: '6 Months Complete Coaching',
        durationMonths: 6,
        originalPrice: 8999,
        calculatedPrice: 2999,
        discountPercent: 66,
        monthlyRate: '₹499/mo',
        highlightText: 'Full postpartum mother and newborn support',
        features: [
          '1-on-1 Certified Lactation consultant video session',
          'Customized postpartum healing diet (Gond ke laddu, Katlu & herbal decoctions)',
          'Pelvic floor & diastasis recti safe recovery exercises',
          'Postpartum blues & anxiety emotional counseling',
          'Infant vaccination schedule & milestone tracking',
          'Unlimited WhatsApp chat with maternal care nurse',
        ],
      },
      {
        id: 'infant-starter',
        name: 'Lactation & Diet Starter',
        hindiName: 'दुग्धपान व आहार आरंभ',
        tagline: 'Core Lactation & Healing Plan',
        badge: 'ESSENTIALS',
        duration: '3 Months Support',
        durationMonths: 3,
        originalPrice: 4999,
        calculatedPrice: 1799,
        discountPercent: 64,
        monthlyRate: '₹599/mo',
        highlightText: '3 Months lactation and maternal diet care',
        features: [
          'Lactation latch & supply enhancement guide',
          'Traditional Indian postpartum recovery meal plan',
          'Doctor Q&A weekly live access',
        ],
      },
    ],
    modules: [
      {
        title: 'Module 1: Lactation & Breastfeeding Masterclass',
        hindiTitle: 'मॉड्यूल १: सहज दुग्धपान (लैक्टेशन) मार्गदर्शन',
        description: 'Pain-free latching, milk supply boosting Galactagogues, and mastitis prevention.',
        items: ['Latching techniques and comfortable nursing postures', 'Ayurvedic foods to naturally boost breast milk', 'Pumping and safe storage basics'],
      },
      {
        title: 'Module 2: Maternal Postpartum Physical Recovery',
        hindiTitle: 'मॉड्यूल २: प्रसूता का शारीरिक स्वास्थ्य लाभ',
        description: 'Rebuilding core strength, pelvic floor healing, and belly binding guidance.',
        items: ['C-section and vaginal birth gentle recovery', 'Diastasis recti safe core workouts', 'Traditional herbal bathing and massage'],
      },
      {
        title: 'Module 3: Emotional Well-being & Baby Calming',
        hindiTitle: 'मॉड्यूल ३: मानसिक शांति एवं शिशु सुलाने की कला',
        description: 'Overcoming postpartum blues and creating consistent infant sleep cycles.',
        items: ['Hormonal crash coping tools', 'White noise and soothing rhythm techniques', 'Partner postpartum support handbook'],
      },
    ],
    deliverables: [
      'Postpartum Healing Recipe Booklet (Digital & Print)',
      'Infant Milestones & Growth Log Wall Chart',
      'Direct WhatsApp Helpline with Lactation Nurse',
    ],
    faculty: [
      { name: 'Dr. Kavita Nair (IBCLC)', role: 'Certified International Lactation Consultant', exp: '14+ Years Exp' },
      { name: 'Dr. Priya Singhania', role: 'Physiotherapist & Postnatal Fitness Coach', exp: '11+ Years Exp' },
    ],
    faqs: [
      {
        q: 'What if I am having trouble with breast milk supply?',
        a: 'Our certified IBCLC lactation consultants provide personalized latch correction and Ayurvedic diet plans that solve low supply issues quickly.',
      },
      {
        q: 'Can C-section mothers follow the physical recovery exercises?',
        a: 'Yes, our exercises are stratified by delivery type and begin with safe breathing and gentle walking before progressing to core strengthening.',
      },
    ],
  },

  consultations: {
    id: 'consultations',
    title: 'A La Carte Consults',
    hindiTitle: 'विशेषज्ञ परामर्श (१-ऑन-१)',
    subtitle: 'Direct 1-on-1 Video Consultations',
    hindiSubtitle: 'वरिष्ठ डॉक्टरों व ज्योतिषियों से सीधा संवाद',
    badge: '1-ON-1 SESSIONS',
    badgeColor: '#B45309',
    color: '#854D0E',
    rating: 4.96,
    reviewsCount: 2210,
    enrolledCount: '8,900+ Consults',
    image: require('../../../assets/programs/consultations.jpg'),
    overview: 'Book direct, confidential 1-on-1 video and voice consultations with top Gynecologists, Vedic Astrologers, Ayurvedic Doctors, and Pregnancy Nutritionists whenever you need personal guidance.',
    hindiOverview: 'जब भी आवश्यकता हो, शीर्ष स्त्री रोग विशेषज्ञों, आयुर्वेदिक वैद्यों और वैदिक ज्योतिषियों के साथ वीडियो या कॉल पर व्यक्तिगत परामर्श।',
    whoIsItFor: 'Any parent or expecting couple needing customized expert answers.',
    duration: 'Single Session or 3-Pack Bundle (Valid for 90 Days)',
    unlockedModules: ['doctor_chat'],
    tiers: [
      {
        id: 'consult-bundle',
        name: '3-Specialist Care Pack',
        hindiName: '३-विशेषज्ञ परामर्श कॉम्बो',
        tagline: 'Gynecologist + Astrologer + Dietitian',
        badge: 'BEST VALUE',
        duration: '3 Sessions (Valid 90 Days)',
        durationMonths: 3,
        originalPrice: 6300,
        calculatedPrice: 3499,
        discountPercent: 44,
        monthlyRate: '₹1,166/session',
        highlightText: 'Complete mind, body, and celestial guidance trio',
        features: [
          '1 Consultation with Senior Gynecologist (30 mins)',
          '1 Comprehensive Horoscope reading with Vedic Astrologer (30 mins)',
          '1 Personalized Diet & Nutrition chart consultation (30 mins)',
          'Digital prescription and dietary roadmap provided within 2 hours',
          'Free follow-up query chat on WhatsApp for 7 days post-session',
        ],
      },
      {
        id: 'consult-single',
        name: 'Single Specialist Session',
        hindiName: 'एकल विशेषज्ञ सत्र',
        tagline: 'Choose Any Verified Specialist',
        badge: 'FLEXIBLE',
        duration: '1 Session (30 mins)',
        durationMonths: 1,
        originalPrice: 2500,
        calculatedPrice: 1499,
        discountPercent: 40,
        monthlyRate: '₹1,499/session',
        highlightText: 'Immediate booking within next 24 hours',
        features: [
          '30-Minute private 1-on-1 video call',
          'Detailed discussion of test reports or horoscope charts',
          'Written summary & action recommendations',
        ],
      },
    ],
    modules: [
      {
        title: 'Specialty 1: Maternal Medicine & Gynecology',
        hindiTitle: 'विशेषज्ञता १: स्त्री रोग व प्रसूति चिकित्सा',
        description: 'Second opinions on ultrasound scans, dual markers, gestational diabetes, and blood pressure.',
        items: ['Ultrasound & NT scan interpretation', 'Symptom analysis (nausea, bleeding, pain)', 'Labor birth plan finalization'],
      },
      {
        title: 'Specialty 2: Vedic Childbirth & Conception Astrology',
        hindiTitle: 'विशेषज्ञता २: वैदिक संतान ज्योतिष',
        description: 'Deep astrological chart analysis for conception hurdles, dosha remedies, and delivery Muhurat.',
        items: ['Putra/Santana Bhava analysis', 'Panchang and Nakshatra remedies', 'Baby naming based on Moon sign & Pada'],
      },
      {
        title: 'Specialty 3: Personalized Ayurvedic Dietetics',
        hindiTitle: 'विशेषज्ञता ३: व्यक्तिगत आयुर्वेदिक पोषण',
        description: 'Custom food charts tailored to your specific Prakriti (Vata, Pitta, Kapha) and trimester needs.',
        items: ['Trimester micronutrient charts', 'Herbal teas & tonics for energy', 'Ayurvedic craving balancing remedies'],
      },
    ],
    deliverables: [
      'Digital Medical / Astrological Consultation Summary Report',
      'Personalized Actionable Roadmap with Prescriptions',
      '7-Day Follow-up WhatsApp Support',
    ],
    faculty: [
      { name: 'Dr. Ananya Roy (MD, DGO)', role: 'Senior Obstetrician & Fetal Medicine', exp: '19+ Years Exp' },
      { name: 'Acharya Vidyadhar Bhatt', role: 'Presidential Awardee Vedic Astrologer', exp: '28+ Years Exp' },
      { name: 'Dr. Harish Vyas (BAMS)', role: 'Ayurvedic Clinical Nutritionist', exp: '15+ Years Exp' },
    ],
    faqs: [
      {
        q: 'How are the consultations conducted?',
        a: 'Consultations happen seamlessly via private video call or high-quality audio directly within the app or WhatsApp link.',
      },
      {
        q: 'Can I upload my previous medical reports?',
        a: 'Yes, you can upload blood reports and scan summaries before your call so the doctor reviews them in advance.',
      },
    ],
  },
};

// Dynamic cache of programs synchronized with backend
let dynamicProgramsCache: Record<string, ProgramDetail> = { ...PROGRAMS_DATA };

export const fetchDynamicPrograms = async (): Promise<Record<string, ProgramDetail>> => {
  try {
    const { api } = await import('~/shared/api');
    const res = await api.get('/api/v1/subscription/programs');
    if (res.data?.success && Array.isArray(res.data.data)) {
      const serverPrograms: any[] = res.data.data;
      serverPrograms.forEach((p) => {
        const local = PROGRAMS_DATA[p.id];
        dynamicProgramsCache[p.id] = {
          ...(local || {}),
          ...p,
          image: local?.image || require('../../../assets/programs/garbh_sanskar.jpg'),
        };
      });
    }
  } catch (error) {
    console.warn('[ProgramsData] Backend fetch skipped, using local data:', error);
  }
  return dynamicProgramsCache;
};

export const getProgramById = (id: string): ProgramDetail => {
  return dynamicProgramsCache[id] || PROGRAMS_DATA[id] || PROGRAMS_DATA['garbh_sanskar'];
};
