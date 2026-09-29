import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image as RNImage,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Sparkles, CheckCircle2, Star, Clock, Heart, CalendarDays } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COURSES = [
  {
    id: 'beej_sanskar',
    title: 'Beej Sanskar',
    subtitle: 'Fertility & Conception',
    description: 'A comprehensive 90-day program with Ayurveda, Yoga, and holistic support to overcome fertility issues naturally. Join thousands of couples who have found success with our holistic approach.',
    badge: 'PROGRAM',
    price: '₹25,000',
    color: '#EC4899', 
    image: require('../../../assets/programs/beej_sanskar.jpg'),
    features: [
      'Ayurvedic Consultations',
      'Customized Yoga Plans',
      'Astrological Guidance',
      'Apni Sakhi Emotional Support',
      'Holistic Wellness Practices'
    ]
  },
  {
    id: 'garbhdhaan_sanskar',
    title: 'Garbhdhaan Sanskar',
    subtitle: 'Pre-Pregnancy Planning',
    description: 'Auspicious planning with Muhurat Aadharit Tithiya, diet plans, and expert gynecologist guidance.',
    badge: 'PROGRAM',
    price: '₹11,000',
    color: '#3B82F6', 
    image: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
    features: [
      'Pre-pregnancy screening',
      'Muhurat selection for conception',
      'Nutritional guidance',
      'Partner wellness counseling'
    ]
  },
  {
    id: 'garbh_sanskar',
    title: 'Garbh Sanskar',
    subtitle: 'Positive Pregnancy',
    description: 'Diamond, Gold, and Silver tiers featuring daily prayers, music therapy, and month-by-month doctor support.',
    badge: 'POPULAR',
    price: 'From ₹5,000',
    color: '#65A30D', 
    image: require('../../../assets/programs/garbh_sanskar.jpg'),
    features: [
      'Daily Meditation & Yoga',
      'Brainopedia & Music Therapy',
      'Garbh Samvaad (Womb communication)',
      'Live Nutritionist Sessions',
      'Monthly Milestone Tracking'
    ]
  },
  {
    id: 'bal_sanskar',
    title: 'Bal Sanskar',
    subtitle: 'Newborn Nurturing',
    description: 'Traditional ceremonies including Namkaran, Nishkraman, and Annaprashan for your baby’s holistic start.',
    badge: 'CEREMONY',
    price: '₹6,000',
    color: '#06B6D4', 
    image: require('../../../assets/programs/bal_sanskar.jpg'),
    features: [
      'Namkaran (Naming Ceremony)',
      'Annaprashan (First solid food)',
      'Mundan (First haircut)',
      'Vedic upbringing principles'
    ]
  },
  {
    id: 'infant_care',
    title: 'Infant Care',
    subtitle: 'Parenting Support',
    description: 'Complete post-delivery care with a personal parenting coach, lactation experts, and custom diet plans.',
    badge: 'COACHING',
    price: '₹5,000',
    color: '#F59E0B', 
    image: require('../../../assets/programs/infant_care.jpg'),
    features: [
      'Lactation consultation',
      'Postpartum recovery diet',
      'Sleep training basics',
      'Newborn hygiene coaching'
    ]
  },
  {
    id: 'consultations',
    title: 'A La Carte Consults',
    subtitle: 'Targeted Guidance',
    description: 'Book 1-on-1 sessions with verified doctors, specialist astrologers, and expert dietitians instantly.',
    badge: 'FLEXIBLE',
    price: 'From ₹2,100',
    color: '#854D0E', 
    image: require('../../../assets/programs/consultations.jpg'),
    features: [
      'Verified Doctor Consultations',
      'Digital Prescriptions',
      'Specialist Astrologer reading',
      'Free follow-up sessions'
    ]
  },
];

export const CourseScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Get courseId from route params, fallback to garbh_sanskar if none provided
  const courseId = route.params?.courseId || 'garbh_sanskar';
  
  const course = useMemo(() => {
    return COURSES.find(c => c.id === courseId) || COURSES[2];
  }, [courseId]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.heroContainer}>
          <RNImage source={course.image} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <SafeAreaView>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#1F2937" />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </View>

        <View style={styles.contentContainer}>
          
          <View style={styles.floatingBadgeRow}>
            <View style={[styles.badge, { backgroundColor: course.color + '20' }]}>
              <Sparkles size={14} color={course.color} />
              <Text style={[styles.badgeText, { color: course.color }]}>{course.badge}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>

          <Text style={styles.title}>{course.title}</Text>
          <Text style={[styles.subtitle, { color: course.color }]}>{course.subtitle}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Clock size={20} color="#6B7280" />
              <Text style={styles.statBoxText}>Flexible</Text>
            </View>
            <View style={styles.statBox}>
              <CalendarDays size={20} color="#6B7280" />
              <Text style={styles.statBoxText}>Lifetime</Text>
            </View>
            <View style={styles.statBox}>
              <Heart size={20} color="#6B7280" />
              <Text style={styles.statBoxText}>Holistic</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About the Program</Text>
          <Text style={styles.description}>{course.description}</Text>

          <Text style={styles.sectionTitle}>What's Included</Text>
          <View style={styles.featuresContainer}>
            {course.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.checkCircle, { backgroundColor: course.color + '15' }]}>
                  <CheckCircle2 size={16} color={course.color} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Total Investment</Text>
          <Text style={[styles.priceValue, { color: course.color }]}>{course.price}</Text>
        </View>
        <TouchableOpacity style={[styles.enrollButton, { backgroundColor: course.color }]}>
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Match creamy background
  },
  heroContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  floatingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginLeft: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E1B4B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  statBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 32,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32, // safe area spacing
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  enrollButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  enrollButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
