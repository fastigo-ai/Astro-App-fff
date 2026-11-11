import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image as RNImage,
  Dimensions,
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
} from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export const WelcomeCourseSelectionScreen = () => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const setHasLifeStage = useAuthStore(state => state.setHasLifeStage);

  const COURSES = [
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
      id: 'bhavitavyam',
      categoryTag: isHindi ? 'सभी के लिए' : 'For Everyone',
      categoryTagBg: '#FEF3C7',
      categoryTagText: '#92400E',
      title: isHindi ? 'भवितव्यम् (कुंडली)' : 'Bhavitavyam',
      titleColor: '#92400E',
      bullets: [
        isHindi ? 'वैदिक ज्योतिषीय मार्गदर्शन' : 'Astrological Guidance',
        isHindi ? 'अतुलनीय ग्रह शांति' : 'Unparalleled',
      ],
      image: require('../../../assets/programs/consultations.jpg'),
      stage: 'planning' as const,
      route: 'Kundli',
    },
  ];

  const handleSelectCourse = (course: typeof COURSES[0]) => {
    // Save life stage in store
    setHasLifeStage(true, course.stage, {
      selected_module: course.id,
      confirmed_month: 2, // Default Month 2 Free Demo like Krishna Coming
    });

    if (course.route === 'CoursePreview') {
      navigation.navigate('CoursePreview', { courseId: course.id });
    } else {
      navigation.navigate(course.route);
    }
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
        {/* National Awardee Credibility Banner (Image 1 reference) */}
        <View style={styles.credibilityBanner}>
          <View style={styles.credibilityTrimTop} />
          <Text style={styles.credibilitySub}>An Initiative by</Text>
          <Text style={styles.credibilityTitle}>
            President & Prime Minister
          </Text>
          <Text style={styles.credibilityFoot}>
            Awardee Team of IITians, Doctors & more..
          </Text>
          <View style={styles.credibilityTrimBottom} />
        </View>

        {/* Section Heading */}
        <Text style={styles.selectCourseHeading}>
          {isHindi ? 'अपनी आवश्यकतानुसार पाठ्यक्रम चुनें' : 'Select Course as Required'}
        </Text>

        {/* 2x2 Grid of Module Cards */}
        <View style={styles.gridContainer}>
          {COURSES.map((course) => (
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
                    <Text style={styles.bulletText}>{bullet}</Text>
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

          {/* Happy Babies & Families Collage Banner */}
          <View style={styles.familiesCollageCard}>
            <RNImage
              source={require('../../../assets/images/family_collage.png')}
              style={styles.familyCollageImage}
              resizeMode="cover"
            />
            <View style={styles.familyCollageOverlay}>
              <View style={styles.verifiedCountBadge}>
                <CheckCircle2 size={14} color="#10B981" />
                <Text style={styles.verifiedCountText}>
                  {isHindi ? '1,50,000+ खुशहाल माताएं व दिव्य शिशु' : '1,50,000+ Happy Families Blessed'}
                </Text>
              </View>
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
  // Credibility Banner (President & Prime Minister Awardee)
  credibilityBanner: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  credibilityTrimTop: {
    width: 220,
    height: 1.5,
    backgroundColor: '#D4AF37', // Gold trim
    marginBottom: 6,
  },
  credibilitySub: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  credibilityTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  credibilityFoot: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 2,
  },
  credibilityTrimBottom: {
    width: 220,
    height: 1.5,
    backgroundColor: '#D4AF37', // Gold trim
    marginTop: 8,
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
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
  familiesCollageCard: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  familyCollageImage: {
    width: '100%',
    height: '100%',
  },
  familyCollageOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    alignItems: 'center',
  },
  verifiedCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  verifiedCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
});
