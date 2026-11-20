import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image as RNImage,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Baby,
} from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { api } from '../../../shared/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

const DEFAULT_BABIES = [
  {
    id: 'default_1',
    babyName: 'Baby Anay',
    parentsName: 'Priyanka & Saurabh Patil',
    city: 'Mumbai, MH',
    deliveryType: 'Normal Delivery',
    weight: '3.3 kg',
    localSource: require('../../../assets/images/family_collage.png'),
    imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'default_2',
    babyName: 'Baby Myra',
    parentsName: 'Sunita & Deepak Sharma',
    city: 'Jaipur, RJ',
    deliveryType: 'Normal Delivery',
    weight: '3.1 kg',
    localSource: require('../../../assets/images/baby_cute.png'),
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'default_3',
    babyName: 'Baby Kabir',
    parentsName: 'Neha & Ankit Gupta',
    city: 'Delhi NCR',
    deliveryType: 'Normal Delivery',
    weight: '3.4 kg',
    localSource: require('../../../assets/images/hero-1.png'),
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'default_4',
    babyName: 'Baby Shanaya',
    parentsName: 'Pooja & Rohan Verma',
    city: 'Bengaluru, KA',
    deliveryType: 'Normal Delivery',
    weight: '3.2 kg',
    localSource: require('../../../assets/images/hero-2.png'),
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
  },
];

const COLOR_PALETTES = [
  { bg: '#E0E7FF', text: '#3730A3', title: '#3730A3' },
  { bg: '#FFE4E6', text: '#BE123C', title: '#BE123C' },
  { bg: '#CCFBF1', text: '#0F766E', title: '#0F766E' },
  { bg: '#FEF3C7', text: '#92400E', title: '#92400E' },
  { bg: '#F3E8FF', text: '#6B21A8', title: '#6B21A8' },
  { bg: '#ECFDF5', text: '#047857', title: '#047857' },
  { bg: '#FFF7ED', text: '#C2410C', title: '#C2410C' },
];

const KNOWN_COURSES_CONFIG: Record<string, any> = {
  garbhadhaan: {
    canonicalId: 'garbhadhaan',
    categoryTag: (isHindi: boolean) => (isHindi ? 'गर्भधारण से पूर्व' : 'Before Pregnancy'),
    categoryTagBg: '#E0E7FF',
    categoryTagText: '#3730A3',
    title: (isHindi: boolean) => (isHindi ? 'गर्भधान संस्कार' : 'Garbhadhaan'),
    titleColor: '#3730A3',
    bullets: (isHindi: boolean) => [
      isHindi ? 'शिशु की योजना (Planning)' : 'Baby Planning',
      isHindi ? 'प्राकृतिक गर्भधारण (Conception)' : 'Natural Conception',
    ],
    image: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'Garbhadhaan',
  },
  garbhdhaan_sanskar: {
    canonicalId: 'garbhadhaan',
    categoryTag: (isHindi: boolean) => (isHindi ? 'गर्भधारण से पूर्व' : 'Before Pregnancy'),
    categoryTagBg: '#E0E7FF',
    categoryTagText: '#3730A3',
    title: (isHindi: boolean) => (isHindi ? 'गर्भधान संस्कार' : 'Garbhadhaan'),
    titleColor: '#3730A3',
    bullets: (isHindi: boolean) => [
      isHindi ? 'शिशु की योजना (Planning)' : 'Baby Planning',
      isHindi ? 'प्राकृतिक गर्भधारण (Conception)' : 'Natural Conception',
    ],
    image: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'Garbhadhaan',
  },
  garbhsanskar: {
    canonicalId: 'garbhsanskar',
    categoryTag: (isHindi: boolean) => (isHindi ? 'गर्भावस्था के दौरान' : 'During Pregnancy'),
    categoryTagBg: '#FFE4E6',
    categoryTagText: '#BE123C',
    title: (isHindi: boolean) => (isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar'),
    titleColor: '#BE123C',
    bullets: (isHindi: boolean) => [
      isHindi ? 'सकारात्मक गर्भावस्था' : 'Positive Pregnancy',
      isHindi ? 'सुरक्षित सुखप्रसव' : 'Safe Delivery',
      isHindi ? 'गुणवान श्रेष्ठ संतान' : 'Great Child',
    ],
    image: require('../../../assets/programs/garbh_sanskar.jpg'),
    stage: 'pregnant' as const,
    route: 'CoursePreview',
  },
  garbh_sanskar: {
    canonicalId: 'garbhsanskar',
    categoryTag: (isHindi: boolean) => (isHindi ? 'गर्भावस्था के दौरान' : 'During Pregnancy'),
    categoryTagBg: '#FFE4E6',
    categoryTagText: '#BE123C',
    title: (isHindi: boolean) => (isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar'),
    titleColor: '#BE123C',
    bullets: (isHindi: boolean) => [
      isHindi ? 'सकारात्मक गर्भावस्था' : 'Positive Pregnancy',
      isHindi ? 'सुरक्षित सुखप्रसव' : 'Safe Delivery',
      isHindi ? 'गुणवान श्रेष्ठ संतान' : 'Great Child',
    ],
    image: require('../../../assets/programs/garbh_sanskar.jpg'),
    stage: 'pregnant' as const,
    route: 'CoursePreview',
  },
  beej_sanskar: {
    canonicalId: 'beej_sanskar',
    categoryTag: (isHindi: boolean) => (isHindi ? 'बीज शुद्धि (कपल)' : 'Fertility Care'),
    categoryTagBg: '#FCE7F3',
    categoryTagText: '#BE185D',
    title: (isHindi: boolean) => (isHindi ? 'बीज संस्कार' : 'Beej Sanskar'),
    titleColor: '#BE185D',
    bullets: (isHindi: boolean) => [
      isHindi ? 'कपल फर्टिलिटी डिटॉक्स' : 'Fertility Detox',
      isHindi ? 'अंड व शुक्र धातु शुद्धि' : 'Egg & Sperm Vitality',
    ],
    image: require('../../../assets/programs/beej_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'CoursePreview',
  },
  balsanskar: {
    canonicalId: 'balsanskar',
    categoryTag: (isHindi: boolean) => (isHindi ? 'प्रसव के पश्चात' : 'After Delivery'),
    categoryTagBg: '#CCFBF1',
    categoryTagText: '#0F766E',
    title: (isHindi: boolean) => (isHindi ? 'बाल संस्कार' : 'Bal Sanskar'),
    titleColor: '#0F766E',
    bullets: (isHindi: boolean) => [
      isHindi ? 'नवजात शिशु के संस्कार' : 'Sanskar for Newborn',
      isHindi ? '0 से 2 वर्ष मस्तिष्क विकास' : '0-2 Yrs Brain Care',
    ],
    image: require('../../../assets/programs/bal_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'BalSanskar',
  },
  bal_sanskar: {
    canonicalId: 'balsanskar',
    categoryTag: (isHindi: boolean) => (isHindi ? 'प्रसव के पश्चात' : 'After Delivery'),
    categoryTagBg: '#CCFBF1',
    categoryTagText: '#0F766E',
    title: (isHindi: boolean) => (isHindi ? 'बाल संस्कार' : 'Bal Sanskar'),
    titleColor: '#0F766E',
    bullets: (isHindi: boolean) => [
      isHindi ? 'नवजात शिशु के संस्कार' : 'Sanskar for Newborn',
      isHindi ? '0 से 2 वर्ष मस्तिष्क विकास' : '0-2 Yrs Brain Care',
    ],
    image: require('../../../assets/programs/bal_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'BalSanskar',
  },
  infant_care: {
    canonicalId: 'infant_care',
    categoryTag: (isHindi: boolean) => (isHindi ? 'प्रसूता एवं शिशु देखभाल' : 'Postpartum Care'),
    categoryTagBg: '#FEF3C7',
    categoryTagText: '#B45309',
    title: (isHindi: boolean) => (isHindi ? 'शिशु देखभाल' : 'Infant Care'),
    titleColor: '#B45309',
    bullets: (isHindi: boolean) => [
      isHindi ? 'स्तनपान एवं शिशु पोषण' : 'Lactation Coaching',
      isHindi ? 'प्रसूता स्वास्थ्य व रिकवरी' : 'Postpartum Recovery',
    ],
    image: require('../../../assets/programs/infant_care.jpg'),
    stage: 'planning' as const,
    route: 'CoursePreview',
  },
  bhavitavyam: {
    canonicalId: 'bhavitavyam',
    categoryTag: (isHindi: boolean) => (isHindi ? 'सभी के लिए' : 'For Everyone'),
    categoryTagBg: '#F3E8FF',
    categoryTagText: '#6B21A8',
    title: (isHindi: boolean) => (isHindi ? 'भवितव्यम् (कुंडली)' : 'Bhavitavyam'),
    titleColor: '#6B21A8',
    bullets: (isHindi: boolean) => [
      isHindi ? 'वैदिक ज्योतिषीय मार्गदर्शन' : 'Astrological Guidance',
      isHindi ? 'अतुलनीय ग्रह शांति' : 'Unparalleled Peace',
    ],
    image: require('../../../assets/programs/consultations.jpg'),
    stage: 'planning' as const,
    route: 'Kundli',
  },
  consultations: {
    canonicalId: 'bhavitavyam',
    categoryTag: (isHindi: boolean) => (isHindi ? 'सभी के लिए' : 'For Everyone'),
    categoryTagBg: '#F3E8FF',
    categoryTagText: '#6B21A8',
    title: (isHindi: boolean) => (isHindi ? 'भवितव्यम् (कुंडली)' : 'Bhavitavyam'),
    titleColor: '#6B21A8',
    bullets: (isHindi: boolean) => [
      isHindi ? 'वैदिक ज्योतिषीय मार्गदर्शन' : 'Astrological Guidance',
      isHindi ? 'अतुलनीय ग्रह शांति' : 'Unparalleled Peace',
    ],
    image: require('../../../assets/programs/consultations.jpg'),
    stage: 'planning' as const,
    route: 'Kundli',
  },
};

const buildDefaultCourses = (isHindi: boolean) => [
  {
    id: 'garbhadhaan',
    categoryTag: isHindi ? 'गर्भधारण से पूर्व' : 'Before Pregnancy',
    categoryTagBg: '#E0E7FF',
    categoryTagText: '#3730A3',
    title: isHindi ? 'गर्भधान संस्कार' : 'Garbhadhaan',
    titleColor: '#3730A3',
    bullets: [
      isHindi ? 'शिशु की योजना (Planning)' : 'Baby Planning',
      isHindi ? 'प्राकृतिक गर्भधारण (Conception)' : 'Natural Conception',
    ],
    image: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'Garbhadhaan',
  },
  {
    id: 'garbhsanskar',
    categoryTag: isHindi ? 'गर्भावस्था के दौरान' : 'During Pregnancy',
    categoryTagBg: '#FFE4E6',
    categoryTagText: '#BE123C',
    title: isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar',
    titleColor: '#BE123C',
    bullets: [
      isHindi ? 'सकारात्मक गर्भावस्था' : 'Positive Pregnancy',
      isHindi ? 'सुरक्षित सुखप्रसव' : 'Safe Delivery',
      isHindi ? 'गुणवान श्रेष्ठ संतान' : 'Great Child',
    ],
    image: require('../../../assets/programs/garbh_sanskar.jpg'),
    stage: 'pregnant' as const,
    route: 'CoursePreview',
  },
  {
    id: 'beej_sanskar',
    categoryTag: isHindi ? 'बीज शुद्धि (कपल)' : 'Fertility Care',
    categoryTagBg: '#FCE7F3',
    categoryTagText: '#BE185D',
    title: isHindi ? 'बीज संस्कार' : 'Beej Sanskar',
    titleColor: '#BE185D',
    bullets: [
      isHindi ? 'कपल फर्टिलिटी डिटॉक्स' : 'Fertility Detox',
      isHindi ? 'अंड व शुक्र धातु शुद्धि' : 'Egg & Sperm Vitality',
    ],
    image: require('../../../assets/programs/beej_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'CoursePreview',
  },
  {
    id: 'balsanskar',
    categoryTag: isHindi ? 'प्रसव के पश्चात' : 'After Delivery',
    categoryTagBg: '#CCFBF1',
    categoryTagText: '#0F766E',
    title: isHindi ? 'बाल संस्कार' : 'Bal Sanskar',
    titleColor: '#0F766E',
    bullets: [
      isHindi ? 'नवजात शिशु के संस्कार' : 'Sanskar for Newborn',
      isHindi ? '0 से 2 वर्ष मस्तिष्क विकास' : '0-2 Yrs Brain Care',
    ],
    image: require('../../../assets/programs/bal_sanskar.jpg'),
    stage: 'planning' as const,
    route: 'BalSanskar',
  },
  {
    id: 'infant_care',
    categoryTag: isHindi ? 'प्रसूता एवं शिशु देखभाल' : 'Postpartum Care',
    categoryTagBg: '#FEF3C7',
    categoryTagText: '#B45309',
    title: isHindi ? 'शिशु देखभाल' : 'Infant Care',
    titleColor: '#B45309',
    bullets: [
      isHindi ? 'स्तनपान एवं शिशु पोषण' : 'Lactation Coaching',
      isHindi ? 'प्रसूता स्वास्थ्य व रिकवरी' : 'Postpartum Recovery',
    ],
    image: require('../../../assets/programs/infant_care.jpg'),
    stage: 'planning' as const,
    route: 'CoursePreview',
  },
  {
    id: 'bhavitavyam',
    categoryTag: isHindi ? 'सभी के लिए' : 'For Everyone',
    categoryTagBg: '#F3E8FF',
    categoryTagText: '#6B21A8',
    title: isHindi ? 'भवितव्यम् (कुंडली)' : 'Bhavitavyam',
    titleColor: '#6B21A8',
    bullets: [
      isHindi ? 'वैदिक ज्योतिषीय मार्गदर्शन' : 'Astrological Guidance',
      isHindi ? 'अतुलनीय ग्रह शांति' : 'Unparalleled Peace',
    ],
    image: require('../../../assets/programs/consultations.jpg'),
    stage: 'planning' as const,
    route: 'Kundli',
  },
];

interface WelcomeCourseSelectionScreenProps {
  navigation?: any;
  route?: any;
}

export const WelcomeCourseSelectionScreen: React.FC<WelcomeCourseSelectionScreenProps> = ({ navigation: propNavigation }) => {
  const hookNavigation = useNavigation<any>();
  const navigation = propNavigation || hookNavigation;
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const setHasLifeStage = useAuthStore(state => state.setHasLifeStage);

  const [coursesList, setCoursesList] = useState<any[]>(() => buildDefaultCourses(isHindi));
  const [deliveredBabies, setDeliveredBabies] = useState<any[]>(DEFAULT_BABIES);
  const scrollY = useRef(new Animated.Value(0)).current;

  // 1. Fetch dynamic course list from Backend API (reflects courses added/edited by admin)
  useEffect(() => {
    let isMounted = true;
    api
      .get('/api/v1/courses')
      .then((res) => {
        if (!isMounted || !res.data?.data || !Array.isArray(res.data.data)) return;
        const apiData = res.data.data;
        if (apiData.length === 0) return;

        const seenCanonicalKeys = new Set<string>();
        const processed: any[] = [];

        apiData.forEach((item: any, idx: number) => {
          const key = (item.id || '').toLowerCase();
          const known = KNOWN_COURSES_CONFIG[key];

          const customHighlights =
            item.cardHighlights && item.cardHighlights.length > 0
              ? item.cardHighlights
              : item.experienceConfig?.cardHighlights && item.experienceConfig.cardHighlights.length > 0
              ? item.experienceConfig.cardHighlights
              : null;

          if (known) {
            const canonical = known.canonicalId;
            if (!seenCanonicalKeys.has(canonical)) {
              seenCanonicalKeys.add(canonical);

              const bullets =
                customHighlights && customHighlights.length > 0
                  ? customHighlights.slice(0, 3).map((b: string) => String(b).replace(/^[\s•\-\*\d\.]+\s*/, '').trim())
                  : known.bullets(isHindi);

              processed.push({
                id: canonical,
                categoryTag: known.categoryTag(isHindi),
                categoryTagBg: known.categoryTagBg,
                categoryTagText: known.categoryTagText,
                title: isHindi && item.hindiTitle ? item.hindiTitle : item.title || known.title(isHindi),
                titleColor: known.titleColor,
                bullets,
                image: item.imageUrl ? { uri: item.imageUrl } : known.image,
                stage: item.stage || known.stage,
                route: known.route,
              });
            }
          } else {
            // New course dynamically created by Admin in Admin Dashboard!
            const palette = COLOR_PALETTES[idx % COLOR_PALETTES.length];
            const bullets =
              customHighlights && customHighlights.length > 0
                ? customHighlights.slice(0, 3).map((b: string) => String(b).replace(/^[\s•\-\*\d\.]+\s*/, '').trim())
                : item.subtitle
                ? [item.subtitle.slice(0, 30), item.duration ? item.duration.slice(0, 30) : 'Holistic Care']
                : ['Vedic Garbh Sanskar', 'Guided Mentorship'];

            processed.push({
              id: item.id,
              categoryTag:
                item.category ||
                (item.stage === 'planning'
                  ? isHindi
                    ? 'गर्भधारण से पूर्व'
                    : 'Before Pregnancy'
                  : item.stage === 'pregnant'
                  ? isHindi
                    ? 'गर्भावस्था के दौरान'
                    : 'During Pregnancy'
                  : isHindi
                  ? 'प्रसव के पश्चात'
                  : 'After Delivery'),
              categoryTagBg: palette.bg,
              categoryTagText: palette.text,
              title: isHindi && item.hindiTitle ? item.hindiTitle : item.title || 'Vedic Course',
              titleColor: palette.title,
              bullets,
              image: item.imageUrl
                ? { uri: item.imageUrl }
                : require('../../../assets/programs/garbh_sanskar.jpg'),
              stage: item.stage || 'pregnant',
              route: 'CoursePreview',
            });
          }
        });

        // Ensure foundational courses are retained if not explicitly disabled
        const defaults = buildDefaultCourses(isHindi);
        defaults.forEach((def) => {
          if (!seenCanonicalKeys.has(def.id) && !processed.some((p) => p.id === def.id)) {
            processed.push(def);
          }
        });

        if (processed.length > 0) {
          setCoursesList(processed);
        }
      })
      .catch(() => {
        // Fallback to default courses on network failure
      });

    return () => {
      isMounted = false;
    };
  }, [isHindi]);

  // 2. Fetch delivered babies for ticker
  useEffect(() => {
    let isMounted = true;
    api
      .get('/api/v1/delivered-babies')
      .then((res) => {
        if (isMounted && res.data?.data && res.data.data.length > 0) {
          setDeliveredBabies(res.data.data);
        }
      })
      .catch(() => {
        // Quiet fallback to DEFAULT_BABIES
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const CARD_ITEM_HEIGHT = 160;
  const CARD_GAP = 12;
  const TOTAL_ITEM_HEIGHT = CARD_ITEM_HEIGHT + CARD_GAP;
  const loopDistance = deliveredBabies.length * TOTAL_ITEM_HEIGHT;

  useEffect(() => {
    scrollY.setValue(0);
    const animation = Animated.loop(
      Animated.timing(scrollY, {
        toValue: -loopDistance,
        duration: Math.max(14000, deliveredBabies.length * 3800),
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [deliveredBabies.length, loopDistance]);

  const handleSelectCourse = (course: any) => {
    // Save life stage in store
    setHasLifeStage(true, course.stage || 'pregnant', {
      selected_module: course.id,
      confirmed_month: 2, // Default Month 2 Free Demo like Krishna Coming
    });

    navigation.navigate('CoursePreview', {
      courseId: course.id,
      courseTitle: course.title,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar with Official AstroBaby Logo */}
      <View style={styles.topAppBar}>
        <View style={styles.brandCenter}>
          <RNImage
            source={require('../../../assets/images/logo.png')}
            style={styles.brandLogoImg}
            resizeMode="contain"
          />
          <Text style={styles.brandSubtitleText}>
            {isHindi ? 'भारत का सर्वाधिक विश्वसनीय गर्भ संस्कार ऐप' : 'India’s Most Trusted Garbh Sanskar App.'}
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Section Heading */}
        <Text style={styles.selectCourseHeading}>
          {isHindi ? 'अपनी आवश्यकतानुसार पाठ्यक्रम चुनें' : 'Select Course as Required'}
        </Text>

        {/* Dynamic Grid of Module Cards */}
        <View style={styles.gridContainer}>
          {coursesList.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              activeOpacity={0.9}
              onPress={() => handleSelectCourse(course)}
            >
              {/* Category Pill Tag */}
              <View style={[styles.categoryTagPill, { backgroundColor: course.categoryTagBg }]}>
                <Text style={[styles.categoryTagText, { color: course.categoryTagText }]}>
                  {course.categoryTag}
                </Text>
              </View>

              {/* Title */}
              <Text style={[styles.courseTitle, { color: course.titleColor }]}>
                {course.title}
              </Text>

              {/* Bullet Points */}
              <View style={styles.bulletList}>
                {course.bullets.map((bullet, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText} numberOfLines={1}>{bullet}</Text>
                  </View>
                ))}
              </View>

              {/* Course Photo Mockup */}
              <View style={styles.cardPhotoWrapper}>
                <RNImage 
                  source={course.image} 
                  style={styles.cardPhoto} 
                  resizeMode="cover"
                />
              </View>

              {/* Circle Action Arrow */}
              <View style={styles.arrowCircle}>
                <ArrowRight size={14} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Social Proof: Recently Delivered Babies Section */}
        <View style={styles.socialProofSection}>
          <View style={styles.socialDividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.socialProofHeading}>
              {isHindi ? 'हाल ही में जन्मे स्वस्थ व तेजस्वी शिशु' : 'RECENTLY DELIVERED ASTRO BABY BABIES'}
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Smooth Vertical Auto-Scroller Reel */}
          <View style={styles.autoScrollerViewport}>
            <Animated.View
              style={[
                styles.scrollerTrack,
                {
                  transform: [{ translateY: scrollY }],
                },
              ]}
            >
              {[...deliveredBabies, ...deliveredBabies, ...deliveredBabies].map((baby, idx) => (
                <View key={`${baby.id || idx}_${idx}`} style={styles.babyFeedCard}>
                  <RNImage
                    source={baby.localSource || { uri: baby.imageUrl }}
                    style={styles.babyCardImage}
                    resizeMode="cover"
                  />
                  {/* Subtle Dark Gradient Overlay for Crisp Text Readability */}
                  <View style={styles.babyCardOverlay}>
                    <View style={styles.babyHeaderRow}>
                      <Text style={styles.babyNameText} numberOfLines={1}>
                        {baby.babyName}
                      </Text>
                      <View style={styles.babyTypeBadge}>
                        <Text style={styles.babyTypeBadgeText}>
                          {baby.deliveryType || 'Normal Delivery'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.babyParentsText} numberOfLines={1}>
                      {baby.parentsName} • {baby.city}
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.View>

            {/* Persistent Floating Social Proof Badge */}
            <View style={styles.floatingVerifiedBadge}>
              <CheckCircle2 size={13} color="#10B981" />
              <Text style={styles.verifiedCountText}>
                {isHindi ? '1,50,000+ खुशहाल माताएं व दिव्य शिशु' : '1,50,000+ Happy Families Blessed'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topAppBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  brandCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoImg: {
    width: 145,
    height: 40,
  },
  brandSubtitleText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  selectCourseHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  // 2x2 Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  courseCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    minHeight: 210,
    justifyContent: 'space-between',
  },
  categoryTagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  categoryTagText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  bulletList: {
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 14,
  },
  bulletText: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 14,
    flex: 1,
  },
  cardPhotoWrapper: {
    width: '100%',
    height: 85,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
  },
  arrowCircle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Social proof section
  socialProofSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  socialProofHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  autoScrollerViewport: {
    width: '100%',
    height: 250,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  scrollerTrack: {
    width: '100%',
  },
  babyFeedCard: {
    width: '100%',
    height: 160,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  babyCardImage: {
    width: '100%',
    height: '100%',
  },
  babyCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  babyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  babyNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  babyTypeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  babyTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  babyParentsText: {
    fontSize: 11,
    color: '#FDE68A',
    fontWeight: '600',
  },
  floatingVerifiedBadge: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  verifiedCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
});
