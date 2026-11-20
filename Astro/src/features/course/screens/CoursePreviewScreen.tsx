import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image as RNImage,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Play,
  Calendar,
  Bell,
  Video,
  Wallet,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Crown,
  Music,
  Heart,
  Check,
  Award,
  BookOpen,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '~/store/useAuthStore';
import { api } from '~/shared/api';

const COURSE_ASSET_IMAGES: Record<string, any> = {
  garbh_sanskar: require('../../../assets/programs/garbh_sanskar.jpg'),
  beej_sanskar: require('../../../assets/programs/beej_sanskar.jpg'),
  garbhdhaan_sanskar: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
  garbhadhaan: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
  bal_sanskar: require('../../../assets/programs/bal_sanskar.jpg'),
  infant_care: require('../../../assets/programs/infant_care.jpg'),
  consultations: require('../../../assets/programs/consultations.jpg'),
  bhavitavyam: require('../../../assets/programs/consultations.jpg'),
  baby_cute: require('../../../assets/images/baby_cute.png'),
  mentor_prof: require('../../../assets/images/mentor_prof.png'),
};

export interface ICourseExperience {
  title: string;
  hindiTitle?: string;
  taglinePill: string;
  timelineMode: 'pregnancy_months' | 'conception_phases' | 'infant_months' | 'consultations';
  timelineLabel: string;
  mentor: {
    showBanner?: boolean;
    classTitle: string;
    mentorName: string;
    subtitle: string;
    avatarKey?: string;
  };
  activityCard: {
    title: string;
    titleBig: string;
    sub: string;
    imageKey: string;
  };
  importanceCard: {
    titleSmall: string;
    titleBig: string;
    sub: string;
    imageKey: string;
  };
  featureReelTitle: string;
  reelItems: Array<{
    id: number;
    title: string;
    subtitle: string;
    duration: string;
    imageKey?: string;
  }>;
  widgets: {
    showThoughtOfDay?: boolean;
    showLiveSessions?: boolean;
    showBrainupedia?: boolean;
    showAudioLibrary?: boolean;
    showTools?: boolean;
  };
  featuresSummaryList?: string[];
}

const DEFAULT_COURSE_EXPERIENCES: Record<string, ICourseExperience> = {
  garbh_sanskar: {
    title: 'Garbh Sanskar',
    hindiTitle: 'गर्भ संस्कार',
    taglinePill: 'मैं से माँ तक की आनंदमयी यात्रा',
    timelineMode: 'pregnancy_months',
    timelineLabel: 'Pregnancy Month',
    mentor: {
      showBanner: true,
      classTitle: 'Miraculous Pregnancy',
      mentorName: 'Prof. Vipin Joshi',
      subtitle: 'Garbh Sanskar Class',
      avatarKey: 'mentor_prof',
    },
    activityCard: {
      title: 'Garbh Sanskar',
      titleBig: 'Activities',
      sub: 'of this Month',
      imageKey: 'garbh_sanskar',
    },
    importanceCard: {
      titleSmall: 'Importance of',
      titleBig: 'MONTH {month}',
      sub: 'in Pregnancy',
      imageKey: 'baby_cute',
    },
    featureReelTitle: 'Garbh Sanskar Demo Features',
    reelItems: [
      { id: 1, title: '1. Jeevan Sutra (जीवन सूत्र)', subtitle: 'Daily morning inspiring life lessons & sacred positive thoughts for fetus development.', duration: '6:30 Mins (Vocal Guide)', imageKey: 'consultations' },
      { id: 2, title: '2. Garbh Music (432Hz Raagas)', subtitle: 'Scientifically tuned 432Hz Vedic classical soundwaves stimulating fetal brain neurons.', duration: '18:45 Mins (432Hz Audio)', imageKey: 'garbh_sanskar' },
      { id: 3, title: '3. Garbh Sutra (गर्भ सूत्र)', subtitle: 'Vedic guidelines & spiritual lifestyle discipline taught by Prof. Vipin Joshi.', duration: '10:15 Mins (Masterclass)', imageKey: 'mentor_prof' },
      { id: 4, title: '4. Garbh Samvad (गर्भ संवाद)', subtitle: 'Soul-to-soul womb conversation scripts strengthening the mother-child emotional bond.', duration: '12:00 Mins (Guided Samvad)', imageKey: 'garbhdhaan_sanskar' },
      { id: 5, title: '5. Vedic Mantra Vrushti (मंत्र वृष्टि)', subtitle: 'Potent Vedic chanting creating an aura of serenity, protection and spiritual energy.', duration: '14:20 Mins (Sacred Chants)', imageKey: 'bal_sanskar' },
    ],
    widgets: {
      showThoughtOfDay: true,
      showLiveSessions: true,
      showBrainupedia: true,
    },
    featuresSummaryList: [
      'Art to Live Happy Life',
      'Garbh Sanskar Music (432Hz)',
      'Meditation & Yognidra',
      'Vedic Mantra Vrushti',
      'Supraj Santanotpatti Hawan',
      'Personal Isht Mantra',
      'Punsavan & Simantonayana Sanskar',
    ],
  },
  beej_sanskar: {
    title: 'Beej Sanskar',
    hindiTitle: 'बीज संस्कार',
    taglinePill: 'पवित्र गर्भाधान हेतु बीज एवं शरीर शुद्धि',
    timelineMode: 'conception_phases',
    timelineLabel: 'Conception Phase',
    mentor: {
      showBanner: true,
      classTitle: 'Cellular & DNA Purification',
      mentorName: 'Dr. Sunita & Vedic Team',
      subtitle: 'Beej Sanskar Masterclass',
      avatarKey: 'mentor_prof',
    },
    activityCard: {
      title: 'Beej Sanskar',
      titleBig: 'Detox Rituals',
      sub: 'for Couple Purity',
      imageKey: 'beej_sanskar',
    },
    importanceCard: {
      titleSmall: 'Importance of',
      titleBig: 'PHASE {month}',
      sub: 'in Beej Sanskar',
      imageKey: 'baby_cute',
    },
    featureReelTitle: 'Beej Sanskar Demo Features',
    reelItems: [
      { id: 1, title: '1. Beej Shuddhi Vidhi', subtitle: 'Vedic body purification mantras and cellular detoxification routines for couples.', duration: '8:00 Mins (Daily Routine)', imageKey: 'beej_sanskar' },
      { id: 2, title: '2. Panchakarma Diet', subtitle: 'Ayurvedic sattvic nutritional diet plan enhancing ovum and sperm vitality.', duration: '12:15 Mins (Diet Guide)', imageKey: 'consultations' },
      { id: 3, title: '3. Swara & Prana Yoga', subtitle: 'Breath synchronization techniques balancing solar and lunar energy channels.', duration: '15:00 Mins (Yoga Session)', imageKey: 'mentor_prof' },
      { id: 4, title: '4. Beej Dhyan', subtitle: 'Conscious meditation to invite a noble, healthy, and highly elevated soul.', duration: '10:30 Mins (Meditation)', imageKey: 'garbhdhaan_sanskar' },
      { id: 5, title: '5. Vedic Mantra Jaap', subtitle: 'Vedic sacred chants to remove hereditary doshas and negative planetary impressions.', duration: '14:00 Mins (Sacred Chants)', imageKey: 'bal_sanskar' },
    ],
    widgets: {
      showThoughtOfDay: true,
      showLiveSessions: true,
      showBrainupedia: false,
    },
    featuresSummaryList: [
      'Ayurvedic Couple Detox Protocol',
      'Ovum & Sperm Health Enhancement',
      'Vedic Swara Yoga & Breathing',
      'Ancestral Karma Purification',
      'Sattvic Nutrition Plan',
      'Personalized Doctor Guidance',
    ],
  },
  garbhdhaan_sanskar: {
    title: 'Garbhadhaan Sanskar',
    hindiTitle: 'गर्भाधान संस्कार',
    taglinePill: 'दिव्य संतान के आगमन की पावन शुरुआत',
    timelineMode: 'conception_phases',
    timelineLabel: 'Pre-Conception Month',
    mentor: {
      showBanner: true,
      classTitle: 'Sacred Conception & Muhurat',
      mentorName: 'Prof. Vipin Joshi',
      subtitle: 'Garbhadhaan Sanskar Class',
      avatarKey: 'mentor_prof',
    },
    activityCard: {
      title: 'Garbhadhaan',
      titleBig: 'Conception Care',
      sub: 'Daily Guidance',
      imageKey: 'garbhdhaan_sanskar',
    },
    importanceCard: {
      titleSmall: 'Significance of',
      titleBig: 'MONTH {month}',
      sub: 'in Baby Planning',
      imageKey: 'baby_cute',
    },
    featureReelTitle: 'Garbhadhaan Demo Features',
    reelItems: [
      { id: 1, title: '1. Rutu-Kaal Shuddhi', subtitle: 'Sacred timing and astrological favorable windows for blissful conception.', duration: '7:45 Mins (Vedic Guide)', imageKey: 'garbhdhaan_sanskar' },
      { id: 2, title: '2. Couple Mind Harmonization', subtitle: 'Harmonizing heart frequencies between mother and father before conception.', duration: '11:20 Mins (Audio Guide)', imageKey: 'consultations' },
      { id: 3, title: '3. Ojas Booster Diet', subtitle: 'Ayurvedic superfoods optimizing fertility and emotional stability.', duration: '9:10 Mins (Diet Routine)', imageKey: 'mentor_prof' },
      { id: 4, title: '4. Santan Gopal Jaap', subtitle: 'Daily rhythmic recitation of Shri Santan Gopal Stotram for divine blessings.', duration: '16:00 Mins (Sacred Chants)', imageKey: 'garbh_sanskar' },
      { id: 5, title: '5. Mental Serenity Sutra', subtitle: 'Stress-busting affirmations ensuring a tranquil home atmosphere.', duration: '8:30 Mins (Affirmations)', imageKey: 'bal_sanskar' },
    ],
    widgets: {
      showThoughtOfDay: true,
      showLiveSessions: true,
      showBrainupedia: false,
    },
    featuresSummaryList: [
      'Auspicious Muhurat Calculation',
      'Santan Gopal Mantra Chanting',
      'Couple Emotional Harmonization',
      'Fertility-Boosting Ojas Diet',
      'Mindfulness & Stress Relief',
    ],
  },
  bal_sanskar: {
    title: 'Bal Sanskar',
    hindiTitle: 'बाल संस्कार',
    taglinePill: 'शिशु के प्रथम 2 वर्ष - मस्तिष्क और संस्कार की नींव',
    timelineMode: 'infant_months',
    timelineLabel: 'Infant Age Month',
    mentor: {
      showBanner: true,
      classTitle: '0-2 Yrs Brain Stimulation',
      mentorName: 'Dr. Anita Rao & Team',
      subtitle: 'Bal Sanskar Workshop',
      avatarKey: 'mentor_prof',
    },
    activityCard: {
      title: 'Bal Sanskar',
      titleBig: 'Brain Games',
      sub: '0-2 Years',
      imageKey: 'bal_sanskar',
    },
    importanceCard: {
      titleSmall: 'Milestones of',
      titleBig: 'MONTH {month}',
      sub: 'in Baby Development',
      imageKey: 'baby_cute',
    },
    featureReelTitle: 'Bal Sanskar Demo Features',
    reelItems: [
      { id: 1, title: '1. Suvarnaprashan Samskara', subtitle: 'Vedic golden drops ritual for boosting immunity, memory, and cognitive sharpness.', duration: '6:15 Mins (Health Ritual)', imageKey: 'bal_sanskar' },
      { id: 2, title: '2. Shishu Lullabies (432Hz)', subtitle: 'Soothing Vedic lullabies and 432Hz sleep melodies for calm and peaceful sleep.', duration: '20:00 Mins (Lullaby Audio)', imageKey: 'garbh_sanskar' },
      { id: 3, title: '3. Sensory High-Contrast Cards', subtitle: 'High contrast black and white flashcards stimulating optic nerve development.', duration: '8:45 Mins (Visual Session)', imageKey: 'mentor_prof' },
      { id: 4, title: '4. Panchatantra Audio Tale', subtitle: 'Moral storytelling cultivating noble character and subconscious wisdom.', duration: '10:00 Mins (Audio Story)', imageKey: 'garbhdhaan_sanskar' },
      { id: 5, title: '5. Baby Motor Skills & Play', subtitle: 'Gentle physical exercises enhancing neck control and body coordination.', duration: '12:30 Mins (Activity Guide)', imageKey: 'consultations' },
    ],
    widgets: {
      showThoughtOfDay: true,
      showLiveSessions: true,
      showBrainupedia: true,
    },
    featuresSummaryList: [
      'Daily 0-2 Years Brain Puzzles & Sensory Cards',
      'Suvarnaprashan Ayurvedic Immunity Drops',
      'Vedic Moral Stories & Shishu Geeth',
      'Physical Milestone Tracking',
      'Pediatrician Live Consultations',
    ],
  },
  infant_care: {
    title: 'Infant Care',
    hindiTitle: 'शिशु देखभाल',
    taglinePill: 'वैज्ञानिक और पारंपरिक नवजात शिशु देखभाल',
    timelineMode: 'infant_months',
    timelineLabel: 'Infant Care Month',
    mentor: {
      showBanner: true,
      classTitle: 'Neonatal & Mother Wellness',
      mentorName: 'Dr. Anita Rao (MD)',
      subtitle: 'Infant Wellness Guide',
      avatarKey: 'mentor_prof',
    },
    activityCard: {
      title: 'Infant Care',
      titleBig: 'Daily Care',
      sub: 'for Newborn',
      imageKey: 'infant_care',
    },
    importanceCard: {
      titleSmall: 'Essentials of',
      titleBig: 'MONTH {month}',
      sub: 'in Baby Care',
      imageKey: 'baby_cute',
    },
    featureReelTitle: 'Infant Care Demo Features',
    reelItems: [
      { id: 1, title: '1. Abhyanga Massage Guide', subtitle: 'Traditional warm sesame/almond oil massage strengthening baby bones and muscles.', duration: '12:00 Mins (Video Guide)', imageKey: 'infant_care' },
      { id: 2, title: '2. Colic & Burp Relief', subtitle: 'Gentle tummy massage and upright holding methods relieving infant gas.', duration: '8:30 Mins (Doctor Tutorial)', imageKey: 'consultations' },
      { id: 3, title: '3. Baby Sleep Training', subtitle: 'Creating rhythmic circadian rhythms for uninterrupted infant night sleep.', duration: '14:00 Mins (Masterclass)', imageKey: 'mentor_prof' },
      { id: 4, title: '4. Postpartum Lactation Diet', subtitle: 'Nutrient-rich post-partum diet increasing milk flow and maternal strength.', duration: '10:15 Mins (Diet Routine)', imageKey: 'garbhdhaan_sanskar' },
      { id: 5, title: '5. Gentle Hygiene & Bath', subtitle: 'Natural herbal bath and diaper rash prevention tips from pediatricians.', duration: '7:50 Mins (Care Guide)', imageKey: 'garbh_sanskar' },
    ],
    widgets: {
      showThoughtOfDay: true,
      showLiveSessions: false,
      showBrainupedia: false,
    },
    featuresSummaryList: [
      'Doctor-Guided Newborn First 100 Days Care',
      'Abhyanga Baby Massage Tutorials',
      'Colic, Gas & Teething Instant Remedies',
      'Mother Lactation & Postpartum Recovery',
      'Pediatrician 24/7 Q&A Support',
    ],
  },
  consultations: {
    title: 'Bhavitavyam',
    hindiTitle: 'भवितव्यम् ज्योतिष',
    taglinePill: 'जन्म कुंडली, नक्षत्र एवं दिव्य मार्गदर्शन',
    timelineMode: 'consultations',
    timelineLabel: 'Consultation Session',
    mentor: {
      showBanner: true,
      classTitle: 'Kundali & Nakshatra Guidance',
      mentorName: 'Acharya Raman Shastri',
      subtitle: 'Vedic Astrology Consultation',
      avatarKey: 'mentor_prof',
    },
    activityCard: {
      title: 'Bhavitavyam',
      titleBig: 'Kundali Sessions',
      sub: 'Vedic Astrology',
      imageKey: 'consultations',
    },
    importanceCard: {
      titleSmall: 'Importance of',
      titleBig: 'SESSION {month}',
      sub: 'in Vedic Guidance',
      imageKey: 'baby_cute',
    },
    featureReelTitle: 'Astrology Demo Features',
    reelItems: [
      { id: 1, title: '1. Janma Kundali Analysis', subtitle: 'In-depth analysis of child planetary positions and auspicious yogas.', duration: '25:00 Mins (Consultation)', imageKey: 'consultations' },
      { id: 2, title: '2. Nakshatra Sanskar', subtitle: 'Identifying primary birth constellation and protective gemstones / deities.', duration: '15:30 Mins (Guidance)', imageKey: 'garbhdhaan_sanskar' },
      { id: 3, title: '3. Graha Shanti Vidhi', subtitle: 'Vedic pacification remedies to eliminate planetary afflictions.', duration: '18:00 Mins (Vedic Ritual)', imageKey: 'mentor_prof' },
      { id: 4, title: '4. Ishta Devata Puja', subtitle: 'Establishing family guardian deity worship for lifetime protection.', duration: '12:45 Mins (Spiritual Puja)', imageKey: 'garbh_sanskar' },
      { id: 5, title: '5. Auspicious Naming Sanskar', subtitle: 'Auspicious first-letter syllable selection based on Nakshatra Charana.', duration: '10:00 Mins (Naming Guide)', imageKey: 'bal_sanskar' },
    ],
    widgets: {
      showThoughtOfDay: true,
      showLiveSessions: true,
      showBrainupedia: false,
    },
    featuresSummaryList: [
      'Comprehensive Birth Chart (Janma Kundali)',
      'Nakshatra & Planetary Dosha Analysis',
      'Auspicious Vedic Naming Guidance (Namkaran)',
      '1-on-1 Acharya Video Consultations',
      'Personalized Remedies & Yantras',
    ],
  },
};

const resolveExperience = (
  courseId: string,
  serverCourse?: any,
  isHindi?: boolean
): ICourseExperience => {
  const normId = (courseId || 'garbh_sanskar').toLowerCase();
  const matchedKey =
    normId.includes('beej')
      ? 'beej_sanskar'
      : normId.includes('dhaan') || normId.includes('dhan') || normId.includes('conception')
      ? 'garbhdhaan_sanskar'
      : normId.includes('bal') || normId.includes('baal')
      ? 'bal_sanskar'
      : normId.includes('infant')
      ? 'infant_care'
      : normId.includes('bhavi') || normId.includes('consult')
      ? 'consultations'
      : 'garbh_sanskar';

  const base = DEFAULT_COURSE_EXPERIENCES[matchedKey] || DEFAULT_COURSE_EXPERIENCES.garbh_sanskar;
  const cfg = serverCourse?.experienceConfig || {};

  return {
    ...base,
    title: serverCourse?.title || base.title,
    hindiTitle: serverCourse?.hindiTitle || base.hindiTitle,
    taglinePill: cfg.taglinePill || (isHindi && base.hindiTitle ? base.hindiTitle : base.taglinePill),
    timelineMode: cfg.timelineMode || base.timelineMode,
    timelineLabel: cfg.timelineLabel || base.timelineLabel,
    mentor: {
      showBanner: cfg.mentor?.showBanner !== undefined ? cfg.mentor.showBanner : (base.mentor?.showBanner ?? true),
      mentorName: cfg.mentor?.mentorName || cfg.mentor?.name || base.mentor.mentorName,
      classTitle: cfg.mentor?.classTitle || base.mentor.classTitle,
      subtitle: cfg.mentor?.subtitle || cfg.mentor?.classSubtitle || cfg.mentor?.role || base.mentor.subtitle,
      avatarKey: cfg.mentor?.avatarKey || base.mentor.avatarKey,
    },
    activityCard: {
      ...base.activityCard,
      title: cfg.activityCard?.title || base.activityCard.title,
      titleBig: cfg.activityCard?.titleBig || base.activityCard.titleBig,
      sub: cfg.activityCard?.sub || cfg.activityCard?.subtitle || base.activityCard.sub,
      imageKey: cfg.activityCard?.imageKey || base.activityCard.imageKey,
    },
    importanceCard: {
      ...base.importanceCard,
      ...(cfg.importanceCard || {}),
    },
    featureReelTitle: cfg.featureReelTitle || base.featureReelTitle,
    reelItems: (cfg.reelItems && Array.isArray(cfg.reelItems) && cfg.reelItems.length > 0) ? cfg.reelItems : base.reelItems,
    widgets: {
      showThoughtOfDay: cfg.widgets?.showThoughtOfDay !== undefined ? cfg.widgets.showThoughtOfDay : (base.widgets?.showThoughtOfDay ?? true),
      showLiveSessions: cfg.widgets?.showLiveSessions !== undefined ? cfg.widgets.showLiveSessions : (base.widgets?.showLiveSessions ?? true),
      showBrainupedia: cfg.widgets?.showBrainupedia !== undefined ? cfg.widgets.showBrainupedia : (base.widgets?.showBrainupedia ?? true),
      showAudioLibrary: cfg.widgets?.showAudioLibrary !== undefined ? cfg.widgets.showAudioLibrary : (base.widgets?.showAudioLibrary ?? true),
      showTools: cfg.widgets?.showTools !== undefined ? cfg.widgets.showTools : (base.widgets?.showTools ?? true),
    },
    featuresSummaryList: (cfg.featuresSummaryList && cfg.featuresSummaryList.length > 0) ? cfg.featuresSummaryList : base.featuresSummaryList,
  };
};

const { width } = Dimensions.get('window');

export const CoursePreviewScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const currentCourseId = (route.params?.courseId || 'garbh_sanskar').toLowerCase();
  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get(`/api/v1/courses/${currentCourseId}`)
      .then(res => {
        if (isMounted && res.data?.data) {
          setCourseData(res.data.data);
        }
      })
      .catch(() => {
        // Silently fall back to built-in presets
      });
    return () => {
      isMounted = false;
    };
  }, [currentCourseId]);

  const experience = resolveExperience(currentCourseId, courseData, isHindi);

  const activateDemo = useAuthStore(state => state.activateDemo);
  const setJourneyData = useAuthStore(state => state.setJourneyData);
  const journeyData = useAuthStore(state => state.journeyData);

  // Selected Month State (Default to Month 2 Free Demo matching Krishna Coming)
  const [selectedMonth, setSelectedMonth] = useState<number>(2);
  const [showMonthModal, setShowMonthModal] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<'select_month' | 'pregnancy_details'>('select_month');
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  // Feature Preview Player Modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<{
    id: number;
    title: string;
    subtitle: string;
    duration: string;
  } | null>(null);

  // Thought & Brainupedia Modals
  const [showThoughtModal, setShowThoughtModal] = useState<boolean>(false);
  const [showBrainupediaModal, setShowBrainupediaModal] = useState<boolean>(false);

  // Month & LMP Details inside modal
  const [date, setDate] = useState(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempMonth, setTempMonth] = useState<number>(2);
  const [calculatedWeeks, setCalculatedWeeks] = useState<number>(8);

  const calculatePregnancyMonth = (selectedDate: Date) => {
    const diffTime = Date.now() - selectedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const w = Math.max(1, Math.floor(diffDays / 7));
    setCalculatedWeeks(w);
    const m = Math.min(9, Math.max(1, Math.ceil(w / 4.33)));
    setTempMonth(m);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      calculatePregnancyMonth(selectedDate);
    }
  };

  const remainingMonths = Math.max(1, 10 - tempMonth);
  const currentTrimester = tempMonth <= 3 ? '1st' : tempMonth <= 6 ? '2nd' : '3rd';

  const handleMonthPillPress = () => {
    setTempMonth(selectedMonth);
    setModalStep('select_month');
    setShowMonthModal(true);
  };

  const handleSelectMonthFromModal = (m: number) => {
    setTempMonth(m);
    if (m === 2) {
      // Month 2 is the free demo -> activate demo directly
      handleActivateDemo(2);
    } else {
      // Other month -> show detailed Step 2 Pregnancy Details sheet
      setModalStep('pregnancy_details');
    }
  };

  const handleConfirmMonthSettings = () => {
    if (tempMonth === 2) {
      handleActivateDemo(2);
    } else {
      setModalStep('pregnancy_details');
    }
  };

  // Demo Activation: activates demo in auth store and navigates directly to MainTabs with tabbar active
  const handleActivateDemo = async (m = 2) => {
    setShowMonthModal(false);
    setShowUpgradeModal(false);
    setShowPreviewModal(false);
    setSelectedMonth(m);
    await activateDemo(m);
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  // Navigates directly to PricingScreen with selectedMonth and remainingMonths params
  const handleOpenPricing = (monthToOpen?: number) => {
    setShowMonthModal(false);
    setShowUpgradeModal(false);
    setShowPreviewModal(false);
    const targetMonth = monthToOpen || tempMonth || selectedMonth;
    const remaining = Math.max(1, 10 - targetMonth);

    setJourneyData({
      stage: 'pregnant',
      lmp_date: date.toISOString(),
      confirmed_month: targetMonth,
      remaining_months: remaining,
    });

    navigation.navigate('Pricing', {
      selectedMonth: targetMonth,
      remainingMonths: remaining,
    });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('WelcomeCourseSelection');
            }
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.titleCenter}>
          <Text style={styles.headerTitle}>{experience.title}</Text>
          <View style={styles.subPill}>
            <Text style={styles.subPillText}>{experience.taglinePill}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.headerPlansBtn}
          onPress={() => handleOpenPricing(selectedMonth)}
          activeOpacity={0.8}
        >
          <Text style={styles.headerPlansBtnText}>👑 Plans</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Mentor / Guide Free Class Banner */}
        {experience.mentor?.showBanner !== false && (
          <View style={styles.mentorBannerCard}>
            <View style={styles.mentorFreeBadge}>
              <Text style={styles.mentorFreeBadgeText}>FREE</Text>
            </View>

            <View style={styles.mentorRow}>
              <View style={styles.mentorTextCol}>
                <Text style={styles.classSub}>{experience.mentor?.subtitle || 'Course Masterclass'}</Text>
                <Text style={styles.classMain}>{experience.mentor?.classTitle || experience.title}</Text>
                <Text style={styles.classBy}>— By {experience.mentor?.mentorName || 'Prof. Vipin Joshi'}. —</Text>

                <TouchableOpacity 
                  style={styles.viewDetailsBtn}
                  onPress={() => setShowUpgradeModal(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.mentorAvatarWrapper}>
                <RNImage
                  source={COURSE_ASSET_IMAGES[experience.mentor?.avatarKey || 'mentor_prof'] || COURSE_ASSET_IMAGES.mentor_prof}
                  style={styles.mentorAvatar}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        )}

        {/* Dynamic Running Month / Phase / Session Selector Pill */}
        <View style={styles.monthPillWrapper}>
          <TouchableOpacity 
            style={styles.monthSelectorPill}
            onPress={handleMonthPillPress}
            activeOpacity={0.85}
          >
            <Text style={styles.monthSelectorPillText}>
              {selectedMonth === 2 
                ? `${experience.timelineLabel} 2 (Free Demo)` 
                : `${experience.timelineLabel} ${selectedMonth}`}
            </Text>
            <View style={styles.monthArrowBox}>
              <ChevronDown size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 2 Quick Action Cards (Side-by-side: Month Activities & Importance of Month) */}
        <View style={styles.twoActionCardsRow}>
          {/* Pink Card: Activities */}
          <TouchableOpacity 
            style={[styles.quickCard, styles.quickCardPink]}
            activeOpacity={0.88}
            onPress={() => {
              setPreviewContent({
                id: 1,
                title: isHindi ? `${experience.title} दैनिक क्रियाएं` : `${experience.timelineLabel} ${selectedMonth} ${experience.title} Activities`,
                subtitle: isHindi 
                  ? `${experience.timelineLabel} ${selectedMonth} की विशेष क्रियाएं एवं सकारात्मक ध्यान` 
                  : `${experience.timelineLabel} ${selectedMonth} Daily Positive Mindset, Sensory Stimulation & Samvad`,
                duration: '15 Mins / Day',
              });
              setShowPreviewModal(true);
            }}
          >
            <View style={styles.quickCardTextCol}>
              <Text style={styles.quickCardTitle}>{experience.activityCard?.title || experience.title}</Text>
              <Text style={styles.quickCardTitleBig}>{experience.activityCard?.titleBig || 'Activities'}</Text>
              <Text style={styles.quickCardSub}>{experience.activityCard?.sub || 'of this Month'}</Text>
            </View>
            <RNImage
              source={COURSE_ASSET_IMAGES[experience.activityCard?.imageKey || 'garbh_sanskar'] || COURSE_ASSET_IMAGES.garbh_sanskar}
              style={styles.quickCardImg}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Sky Blue Card: Fetus Development / Importance Visual */}
          <TouchableOpacity 
            style={[styles.quickCard, styles.quickCardBlue]}
            activeOpacity={0.88}
            onPress={() => {
              setTempMonth(selectedMonth);
              setModalStep('pregnancy_details');
              setShowMonthModal(true);
            }}
          >
            <View style={styles.quickCardTextCol}>
              <Text style={styles.quickCardTitleSmall}>{experience.importanceCard?.titleSmall || 'Importance of'}</Text>
              <Text style={styles.quickCardTitleBig}>
                {(experience.importanceCard?.titleBig || 'MONTH {month}').replace(
                  '{month}',
                  selectedMonth === 2 ? 'SECOND' : String(selectedMonth)
                )}
              </Text>
              <Text style={styles.quickCardSub}>{experience.importanceCard?.sub || 'in Pregnancy'}</Text>
            </View>
            <RNImage
              source={COURSE_ASSET_IMAGES[experience.importanceCard?.imageKey || 'baby_cute'] || COURSE_ASSET_IMAGES.baby_cute}
              style={styles.quickCardImgBaby}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Dynamic Demo Features Section (Numbered horizontal cards) */}
        <View style={styles.demoFeaturesSection}>
          <View style={styles.demoFeaturesHeaderPill}>
            <Text style={styles.demoFeaturesHeaderText}>{experience.featureReelTitle}</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoCardsScroll}
          >
            {experience.reelItems.map((item, idx) => (
              <TouchableOpacity 
                key={item.id || idx}
                style={styles.demoFeatureCard}
                activeOpacity={0.88}
                onPress={() => {
                  setPreviewContent({
                    id: item.id || (idx + 1),
                    title: item.title,
                    subtitle: item.subtitle,
                    duration: item.duration,
                  });
                  setShowPreviewModal(true);
                }}
              >
                <RNImage
                  source={COURSE_ASSET_IMAGES[item.imageKey || 'garbh_sanskar'] || COURSE_ASSET_IMAGES.garbh_sanskar}
                  style={styles.demoCardBg}
                  resizeMode="cover"
                />
                <View style={styles.demoCardOverlay}>
                  <Text style={styles.demoCardNumber}>{idx + 1}</Text>
                  <View style={styles.demoCardPlayRow}>
                    <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.demoCardTitle} numberOfLines={1}>
                      {item.title.replace(/^\d+\.\s*/, '')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Thought of the Day Card (Conditional) */}
        {experience.widgets?.showThoughtOfDay !== false && (
          <TouchableOpacity 
            style={styles.thoughtCard}
            activeOpacity={0.9}
            onPress={() => setShowThoughtModal(true)}
          >
            <View style={styles.thoughtHeaderPill}>
              <Text style={styles.thoughtHeaderPillText}>Thought of the day</Text>
            </View>
            <Text style={styles.thoughtBodyText}>
              भाई-बहन का रिश्ता बचपन की यादों, निस्वार्थ स्नेह और जीवनभर साथ निभाने वाले विश्वास से संवरता है।
            </Text>
            <Text style={styles.thoughtDateText}>11th Nov '26 • Tap for meaning</Text>
          </TouchableOpacity>
        )}

        {/* Live Sessions Banner (Conditional) */}
        {experience.widgets?.showLiveSessions !== false && (
          <TouchableOpacity 
            style={styles.liveSessionCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('LiveSessions')}
          >
            <View style={styles.livePill}>
              <Text style={styles.livePillText}>Live Sessions</Text>
            </View>
            <View style={styles.liveInnerRow}>
              <View>
                <Text style={styles.liveTitle}>प्रबोधन (कहानी सत्र)</Text>
                <Text style={styles.liveSub}>Watch in the live section of Astro Baby App</Text>
              </View>
              <View style={styles.liveRedTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveRedText}>LIVE</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Vedic Audio Library Section (Conditional) */}
        {experience.widgets?.showAudioLibrary !== false && (
          <TouchableOpacity 
            style={styles.audioLibraryCard}
            activeOpacity={0.9}
            onPress={() => {
              setPreviewContent({
                id: 99,
                title: isHindi ? 'वैदिक ऑडियो लाइब्रेरी (432Hz राग)' : 'Vedic Audio Library (432Hz Raagas)',
                subtitle: isHindi 
                  ? 'दैनिक श्लोक, गर्भ संवाद, 432Hz ध्यान संगीत एवं शांत निद्रा राग' 
                  : 'Daily Shlokas, Soulful Garbh Samvad, 432Hz Vedic Soundwaves & Peaceful Sleep Lullabies',
                duration: 'Unlimited Access',
              });
              setShowPreviewModal(true);
            }}
          >
            <View style={styles.audioLibInnerRow}>
              <View style={styles.audioIconBox}>
                <Music size={22} color="#D97706" />
              </View>
              <View style={styles.audioTextCol}>
                <View style={styles.audioTitleRow}>
                  <Text style={styles.audioLibraryTitle}>Vedic Audio Library</Text>
                  <View style={styles.audioBadge}>
                    <Text style={styles.audioBadgeText}>INCLUDED</Text>
                  </View>
                </View>
                <Text style={styles.audioLibrarySub}>
                  432Hz Raagas, Garbh Samvad, Vedic Mantras & Sleep Lullabies 🎵
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Brainupedia & IQ Stimulation Section (Conditional) */}
        {experience.widgets?.showBrainupedia !== false && (
          <TouchableOpacity 
            style={styles.brainupediaCard}
            activeOpacity={0.9}
            onPress={() => setShowBrainupediaModal(true)}
          >
            <Text style={styles.brainupediaTitle}>Brainupedia & Brain Games</Text>
            <Text style={styles.brainupediaSub}>
              Astro Baby brings you exciting Brain Games, Quizzes & Puzzle Sessions for Pregnant Ladies. 🧠
            </Text>
          </TouchableOpacity>
        )}

        {/* Interactive Support Tools (Kick Counter, Womb Game, Water Tracker) */}
        {experience.widgets?.showTools !== false && (
          <View style={styles.toolsSupportCard}>
            <View style={styles.toolsHeaderRow}>
              <View style={styles.toolsIconBox}>
                <Sparkles size={18} color="#059669" />
              </View>
              <View>
                <Text style={styles.toolsTitle}>Interactive Support Tools</Text>
                <Text style={styles.toolsSub}>Included with your program</Text>
              </View>
            </View>
            <View style={styles.toolsPillRow}>
              <View style={styles.toolPill}>
                <Text style={styles.toolPillText}>🩺 Fetal Kick Counter</Text>
              </View>
              <View style={styles.toolPill}>
                <Text style={styles.toolPillText}>🎮 Interactive Womb Game</Text>
              </View>
              <View style={styles.toolPill}>
                <Text style={styles.toolPillText}>💧 Water Intake Tracker</Text>
              </View>
            </View>
          </View>
        )}

        {/* Features Summary Card with Read More */}
        <View style={styles.featuresListCard}>
          <Text style={styles.featuresListTitle}>Features</Text>
          <View style={styles.featuresListGrid}>
            {(experience.featuresSummaryList || [
              'Art to Live Happy Life',
              'Garbh Sanskar Music (432Hz)',
              'Meditation & Yognidra',
              'Vedic Mantra Vrushti',
              'Supraj Santanotpatti Hawan',
              'Personal Isht Mantra',
              'Punsavan & Simantonayana Sanskar',
            ]).map((f, i) => (
              <View key={i} style={styles.featureBulletRow}>
                <Text style={styles.featureBulletDot}>•</Text>
                <Text style={styles.featureBulletText}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.readMoreBtn}
            onPress={() => handleOpenPricing(selectedMonth)}
            activeOpacity={0.8}
          >
            <Text style={styles.readMoreText}>READ MORE...</Text>
          </TouchableOpacity>
        </View>

        {/* Happy Families Wall Collage */}
        <View style={styles.wallCollageCard}>
          <RNImage
            source={require('../../../assets/images/family_collage.png')}
            style={styles.wallCollageImg}
            resizeMode="cover"
          />
        </View>

        {/* Clean bottom padding without tab bar */}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Floating "JUST JOINED" Social Proof Badge (left side) */}
      <View style={styles.floatingJustJoined}>
        <Text style={styles.justJoinedVertical}>JUST JOINED</Text>
      </View>

      {/* ======================================================== */}
      {/* MODAL 1: MONTH & PERIOD CONFIGURATION SHEET              */}
      {/* (Step 1: Month Selector, Step 2: Pregnancy Details)      */}
      {/* ======================================================== */}
      <Modal
        visible={showMonthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.monthSheetCard}>
            {modalStep === 'select_month' ? (
              <>
                <View style={styles.sheetHeaderRow}>
                  <Text style={styles.sheetTitle}>Select Pregnancy Month</Text>
                  <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                    <X size={22} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sheetSub}>
                  Month 2 is completely free in demo mode. Choose your current running month:
                </Text>

                {/* 9 Month Selector Grid */}
                <View style={styles.monthSheetGrid}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => {
                    const isSelected = tempMonth === m;
                    const isFree = m === 2;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[
                          styles.sheetMonthBox,
                          isSelected && styles.sheetMonthBoxSelected,
                        ]}
                        onPress={() => handleSelectMonthFromModal(m)}
                      >
                        <Text
                          style={[
                            styles.sheetMonthNum,
                            isSelected && styles.sheetMonthNumSelected,
                          ]}
                        >
                          {m}
                        </Text>
                        <Text
                          style={[
                            styles.sheetMonthTag,
                            isSelected && styles.sheetMonthTagSelected,
                          ]}
                        >
                          {isFree ? 'FREE DEMO' : `Month ${m}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.saveMonthSettingsBtn}
                  onPress={handleConfirmMonthSettings}
                >
                  <Text style={styles.saveMonthSettingsText}>
                    {tempMonth === 2 ? 'Continue with 2nd Month Demo →' : 'Confirm & View Details →'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              /* Step 2 Pregnancy Details Sheet */
              <>
                <View style={styles.sheetHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => setModalStep('select_month')}>
                      <ArrowLeft size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.sheetTitle}>
                      {isHindi ? 'अंतिम माहवारी एवं गर्भकाल' : 'Step 2: Pregnancy Details'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                    <X size={22} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sheetSub}>
                  {isHindi
                    ? 'अपने अंतिम माहवारी (LMP) की तिथि बताएं और वर्तमान माह की पुष्टि करें:'
                    : 'Enter the first day of your last period to personalize your daily Garbhsanskar plan:'}
                </Text>

                {/* LMP Date Selector Box */}
                <TouchableOpacity
                  style={styles.dateSelectorBox}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}
                >
                  <View style={styles.dateSelectorLeft}>
                    <View style={styles.calendarIconCircle}>
                      <Calendar size={18} color="#FD5580" />
                    </View>
                    <View>
                      <Text style={styles.dateLabelSmall}>
                        {isHindi ? 'अंतिम माहवारी (LMP)' : 'First Day of Last Period (LMP)'}
                      </Text>
                      <Text style={styles.dateValueText}>
                        {formatDate(date)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.changeDateText}>
                    {isHindi ? 'बदलें ▾' : 'Change ▾'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}

                {/* Gestational & Month Stepper Card */}
                <View style={styles.confirmationCard}>
                  <View style={styles.calcHeaderRow}>
                    <View style={styles.trimesterBadge}>
                      <Sparkles size={12} color="#D97706" />
                      <Text style={styles.calcBadgeText}>
                        Week {calculatedWeeks} • {currentTrimester} Trimester
                      </Text>
                    </View>
                    <View style={styles.remainingPillBox}>
                      <Text style={styles.remainingPillText}>
                        ~{remainingMonths} {isHindi ? 'महीने शेष' : 'Months Left'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.confirmPromptText}>
                    {isHindi ? 'वर्तमान गर्भावस्था माह:' : 'Select Your Running Pregnancy Month:'}
                  </Text>

                  {/* Stepper with Month Badge */}
                  <View style={styles.monthStepperRow}>
                    <TouchableOpacity
                      style={[styles.stepBtn, tempMonth <= 1 && styles.stepBtnDisabled]}
                      onPress={() => setTempMonth(prev => Math.max(1, prev - 1))}
                      disabled={tempMonth <= 1}
                      activeOpacity={0.7}
                    >
                      <Minus size={18} color={tempMonth <= 1 ? '#CBD5E1' : '#FD5580'} />
                    </TouchableOpacity>

                    <View style={styles.monthDisplayBox}>
                      <Text style={styles.monthBigNumber}>
                        {isHindi ? `माह ${tempMonth}` : `Month ${tempMonth}`}
                      </Text>
                      <Text style={styles.monthSubNote}>
                        {tempMonth === 2 ? 'Free Demo Available' : `Weeks ${(tempMonth - 1) * 4 + 1} - ${tempMonth * 4}`}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.stepBtn, tempMonth >= 9 && styles.stepBtnDisabled]}
                      onPress={() => setTempMonth(prev => Math.min(9, prev + 1))}
                      disabled={tempMonth >= 9}
                      activeOpacity={0.7}
                    >
                      <Plus size={18} color={tempMonth >= 9 ? '#CBD5E1' : '#FD5580'} />
                    </TouchableOpacity>
                  </View>

                  {/* Dynamic Pricing Callout */}
                  <View style={styles.dynamicPricingMiniBox}>
                    <Award size={16} color="#D97706" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dynamicPricingTitle}>
                        Utkarsh & Aadhar Garbhsanskar Plans
                      </Text>
                      <Text style={styles.dynamicPricingSub}>
                        Customized for remaining {remainingMonths} months till delivery
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Main CTA: View Garbhsanskar Plans (Utkarsh & Aadhar) */}
                <TouchableOpacity
                  style={styles.saveMonthSettingsBtn}
                  onPress={() => handleOpenPricing(tempMonth)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.saveMonthSettingsText}>
                    🌸 View Garbhsanskar Plans (Utkarsh & Aadhar) →
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: "UPGRADE TO UNLOCK" PREMIUM MEMBERSHIP MODAL   */}
      {/* ======================================================== */}
      <Modal
        visible={showUpgradeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.upgradeCard}>
            {/* VIP Seal Ribbon */}
            <View style={styles.vipRibbonContainer}>
              <View style={styles.vipGoldRibbon}>
                <Text style={styles.vipStarText}>★ PREMIUM ★</Text>
                <Text style={styles.vipMembershipText}>MEMBERSHIP</Text>
                <Text style={styles.vipStarText}>★ PREMIUM ★</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeUpgradeBtn}
                onPress={() => setShowUpgradeModal(false)}
              >
                <X size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.upgradeMainTitle}>Upgrade to Unlock</Text>

            {/* White Info Card */}
            <View style={styles.upgradeWhiteBox}>
              <Text style={styles.upgradeNoticeText}>
                Astro Baby Garbh Sanskar Free demo is available{' '}
                <Text style={{ fontWeight: '800', color: '#1F2937' }}>only for pregnancy month 2.</Text>
              </Text>
              <Text style={styles.upgradeNoticeSub}>
                Please purchase the subscription to experience all 'Garbh Sanskar' features & Live sessions for your pregnancy month.
              </Text>

              {/* Button 1: Continue with 2nd Month Demo */}
              <TouchableOpacity
                style={styles.continueDemoBtn}
                onPress={() => handleActivateDemo(2)}
              >
                <Text style={styles.continueDemoText}>CONTINUE WITH 2ND MONTH DEMO</Text>
              </TouchableOpacity>
            </View>

            {/* Button 2: Click for subscription (Gold button) */}
            <TouchableOpacity
              style={styles.subscriptionGoldBtn}
              onPress={() => handleOpenPricing(tempMonth || selectedMonth)}
              activeOpacity={0.88}
            >
              <Text style={styles.subscriptionGoldText}>
                Click for <Text style={{ color: '#BE123C' }}>subscription</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 3: DEMO FEATURE PREVIEW PLAYER MODAL               */}
      {/* ======================================================== */}
      <Modal
        visible={showPreviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.previewCard}>
            <View style={styles.previewHeaderRow}>
              <View style={styles.previewBadge}>
                <Sparkles size={13} color="#D97706" />
                <Text style={styles.previewBadgeText}>DEMO FEATURE PREVIEW</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.previewTitle}>{previewContent?.title}</Text>
            <Text style={styles.previewSub}>{previewContent?.subtitle}</Text>

            <View style={styles.previewPlayerBox}>
              <View style={styles.playCircleBig}>
                <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.playerTrackName}>Sample Demo Session</Text>
                <Text style={styles.playerTrackDuration}>
                  Duration: {previewContent?.duration}
                </Text>
              </View>
            </View>

            <View style={styles.previewActionsCol}>
              <TouchableOpacity
                style={styles.previewDemoBtn}
                onPress={() => handleActivateDemo(2)}
                activeOpacity={0.85}
              >
                <Text style={styles.previewDemoBtnText}>
                  ▶ Play Month 2 Free Demo Session
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewUpgradeBtn}
                onPress={() => handleOpenPricing(selectedMonth)}
                activeOpacity={0.88}
              >
                <Text style={styles.previewUpgradeBtnText}>
                  👑 Unlock Full 9-Month Program
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 4: THOUGHT OF THE DAY POPUP                        */}
      {/* ======================================================== */}
      <Modal
        visible={showThoughtModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThoughtModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.thoughtPopupCard}>
            <View style={styles.thoughtPopupHeader}>
              <Text style={styles.thoughtPopupTitle}>Thought of the Day</Text>
              <TouchableOpacity onPress={() => setShowThoughtModal(false)}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.thoughtPopupBody}>
              भाई-बहन का रिश्ता बचपन की यादों, निस्वार्थ स्नेह और जीवनभर साथ निभाने वाले विश्वास से संवरता है।
            </Text>
            <Text style={styles.thoughtPopupMeaning}>
              Meaning: Sibling bonds are nurtured by pure affection, shared memories, and lifelong trust. Cultivating harmonious thoughts in pregnancy creates emotional balance in your baby.
            </Text>
            <TouchableOpacity
              style={styles.thoughtCloseBtn}
              onPress={() => setShowThoughtModal(false)}
            >
              <Text style={styles.thoughtCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 5: BRAINUPEDIA PREVIEW POPUP                       */}
      {/* ======================================================== */}
      <Modal
        visible={showBrainupediaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBrainupediaModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.brainupediaPopupCard}>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.brainupediaPopupTitle}>🧠 Brainupedia & IQ Stimulation</Text>
              <TouchableOpacity onPress={() => setShowBrainupediaModal(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.brainupediaPopupSub}>
              Astro Baby brings you curated Brain Games, Logic Quizzes, Music Therapy & Puzzle Sessions for Pregnant Mothers to activate baby's left and right brain lobes.
            </Text>

            <TouchableOpacity
              style={styles.continueDemoBtn}
              onPress={() => handleActivateDemo(2)}
            >
              <Text style={styles.continueDemoText}>TRY BRAIN ACTIVITIES IN MONTH 2 DEMO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subscriptionGoldBtn, { marginTop: 10 }]}
              onPress={() => handleOpenPricing(selectedMonth)}
            >
              <Text style={styles.subscriptionGoldText}>
                UNLOCK ALL BRAINUPEDIA SESSIONS →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 6,
  },
  titleCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2A0845',
    letterSpacing: -0.3,
  },
  subPill: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FCE7F3',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  subPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BE123C',
  },
  headerPlansBtn: {
    backgroundColor: '#FEF08A',
    borderWidth: 1,
    borderColor: '#FDE047',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  headerPlansBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  // Mentor Free Class Banner
  mentorBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mentorFreeBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#84CC16',
    paddingHorizontal: 18,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#65A30D',
  },
  mentorFreeBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  mentorTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  classSub: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  classMain: {
    fontSize: 18,
    fontWeight: '900',
    color: '#9F1239',
    marginTop: 2,
  },
  classBy: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 10,
  },
  viewDetailsBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#9F1239',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  viewDetailsText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mentorAvatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: '#D4AF37',
    overflow: 'hidden',
  },
  mentorAvatar: {
    width: '100%',
    height: '100%',
  },
  // Month Selector Pill
  monthPillWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  monthSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  monthSelectorPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginRight: 10,
  },
  monthArrowBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F43F5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 2 Quick Action Cards
  twoActionCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    height: 115,
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  quickCardPink: {
    backgroundColor: '#FFF0F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  quickCardBlue: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  quickCardTextCol: {
    flex: 1,
    paddingRight: 4,
  },
  quickCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#BE123C',
  },
  quickCardTitleSmall: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  quickCardTitleBig: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E1B4B',
    marginTop: 2,
  },
  quickCardSub: {
    fontSize: 10.5,
    color: '#4B5563',
    marginTop: 2,
  },
  quickCardImg: {
    width: 55,
    height: 80,
    borderRadius: 8,
  },
  quickCardImgBaby: {
    width: 60,
    height: 70,
  },
  // Demo Features Section
  demoFeaturesSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 12,
  },
  demoFeaturesHeaderPill: {
    alignSelf: 'center',
    backgroundColor: '#4B5563',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 12,
  },
  demoFeaturesHeaderText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  demoCardsScroll: {
    gap: 10,
  },
  demoFeatureCard: {
    width: 105,
    height: 125,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoCardBg: {
    width: '100%',
    height: '100%',
  },
  demoCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  demoCardNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  demoCardPlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoCardTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Thought of the day
  thoughtCard: {
    backgroundColor: '#B91C1C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  thoughtHeaderPill: {
    alignSelf: 'center',
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  thoughtHeaderPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  thoughtBodyText: {
    fontSize: 12.5,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  thoughtDateText: {
    fontSize: 10,
    color: '#FEE2E2',
    textAlign: 'right',
    marginTop: 6,
    fontWeight: '600',
  },
  // Live session banner
  liveSessionCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 12,
    marginBottom: 14,
  },
  livePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  livePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  liveSub: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 2,
  },
  liveRedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  liveRedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  // Audio Library
  audioLibraryCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
    marginBottom: 14,
  },
  audioLibInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  audioTextCol: {
    flex: 1,
  },
  audioTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  audioLibraryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#92400E',
  },
  audioBadge: {
    backgroundColor: '#FDE68A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  audioBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#92400E',
  },
  audioLibrarySub: {
    fontSize: 11.5,
    color: '#78350F',
    lineHeight: 16,
  },
  // Brainupedia
  brainupediaCard: {
    backgroundColor: '#FDF4FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0ABFC',
    padding: 14,
    marginBottom: 14,
  },
  brainupediaTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#86198F',
    marginBottom: 4,
  },
  brainupediaSub: {
    fontSize: 11.5,
    color: '#701A75',
    lineHeight: 16,
  },
  // Tools Support
  toolsSupportCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 14,
    marginBottom: 14,
  },
  toolsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolsIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  toolsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
  },
  toolsSub: {
    fontSize: 11,
    color: '#047857',
  },
  toolsPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  toolPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  toolPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#047857',
  },
  // Features list
  featuresListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
  },
  featuresListTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 8,
  },
  featuresListGrid: {
    gap: 4,
    marginBottom: 12,
  },
  featureBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureBulletDot: {
    fontSize: 14,
    color: '#1F2937',
  },
  featureBulletText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  readMoreBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#047857',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  readMoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  wallCollageCard: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
  },
  wallCollageImg: {
    width: '100%',
    height: '100%',
  },
  // Floating Social Proof Badge
  floatingJustJoined: {
    position: 'absolute',
    left: 0,
    bottom: 24,
    backgroundColor: '#22C55E',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    zIndex: 99,
  },
  justJoinedVertical: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  // Modal Backdrop
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  monthSheetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
  },
  sheetSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 16,
  },
  monthSheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 18,
  },
  sheetMonthBox: {
    width: '31%',
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetMonthBoxSelected: {
    backgroundColor: '#FD5580',
    borderColor: '#FD5580',
  },
  sheetMonthNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#374151',
  },
  sheetMonthNumSelected: {
    color: '#FFFFFF',
  },
  sheetMonthTag: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#6B7280',
  },
  sheetMonthTagSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  saveMonthSettingsBtn: {
    backgroundColor: '#FD5580',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveMonthSettingsText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  // Step 2 Pregnancy Details Styles
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  dateLabelSmall: {
    fontSize: 11,
    color: '#BE123C',
    fontWeight: '600',
  },
  dateValueText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 2,
  },
  changeDateText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  confirmationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trimesterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  calcBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  remainingPillBox: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  remainingPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  confirmPromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 8,
  },
  monthStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 12,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FD5580',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },
  monthDisplayBox: {
    alignItems: 'center',
    minWidth: 100,
  },
  monthBigNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  monthSubNote: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  dynamicPricingMiniBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 10,
  },
  dynamicPricingTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#92400E',
  },
  dynamicPricingSub: {
    fontSize: 10.5,
    color: '#78350F',
    marginTop: 1,
  },
  // Modal 2: "Upgrade to Unlock"
  upgradeCard: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  vipRibbonContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  vipGoldRibbon: {
    backgroundColor: '#D97706',
    borderWidth: 2,
    borderColor: '#FDE68A',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 5,
    alignItems: 'center',
  },
  vipStarText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FEF3C7',
  },
  vipMembershipText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  closeUpgradeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
  upgradeMainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FEF08A',
    marginVertical: 10,
  },
  upgradeWhiteBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  upgradeNoticeText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  upgradeNoticeSub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  continueDemoBtn: {
    width: '100%',
    backgroundColor: '#60A5FA',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueDemoText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subscriptionGoldBtn: {
    width: '100%',
    backgroundColor: '#FDE047',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  subscriptionGoldText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  // Modal 3: Feature Preview Player
  previewCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  previewBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 6,
  },
  previewSub: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginBottom: 16,
  },
  previewPlayerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
  },
  playCircleBig: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FD5580',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerTrackName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  playerTrackDuration: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  previewActionsCol: {
    gap: 10,
  },
  previewDemoBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  previewDemoBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  previewUpgradeBtn: {
    backgroundColor: '#FEF08A',
    borderWidth: 1,
    borderColor: '#FDE047',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  previewUpgradeBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#854D0E',
  },
  // Modal 4 & 5
  thoughtPopupCard: {
    width: '100%',
    backgroundColor: '#B91C1C',
    borderRadius: 20,
    padding: 20,
  },
  thoughtPopupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  thoughtPopupTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  thoughtPopupBody: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FEF2F2',
    lineHeight: 22,
    marginBottom: 14,
  },
  thoughtPopupMeaning: {
    fontSize: 12.5,
    color: '#FEE2E2',
    lineHeight: 18,
    marginBottom: 18,
  },
  thoughtCloseBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  thoughtCloseBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B91C1C',
  },
  brainupediaPopupCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },
  brainupediaPopupTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#86198F',
  },
  brainupediaPopupSub: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginTop: 8,
    marginBottom: 16,
  },
});
