import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image as RNImage, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';

const COURSES = [
  {
    id: 'beej_sanskar',
    title: 'Beej Sanskar',
    subtitle: 'Fertility & Conception',
    description: 'A comprehensive 90-day program with Ayurveda, Yoga, and holistic support to overcome fertility issues naturally.',
    badge: 'PROGRAM',
    price: '₹25,000',
    color: '#EC4899', 
    image: require('../../../assets/programs/beej_sanskar.jpg'), 
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
  },
];

export const AllProgramsScreen = () => { // force refresh
  const navigation = useNavigation<any>();
  const isProgramSubscribed = useAuthStore(state => state.isProgramSubscribed);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Programs</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {COURSES.map((item, index) => {
          const isSubscribed = isProgramSubscribed(item.id);
          return (
            <TouchableOpacity 
              key={item.id}
              style={[styles.card, isSubscribed && { borderColor: '#BBF7D0', borderWidth: 2 }]} 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Course', { courseId: item.id })}
            >
              <View style={styles.imageContainer}>
                <RNImage 
                  source={item.image} 
                  style={styles.cardImage} 
                  resizeMode="cover"
                />
                <View style={styles.floatingIconBadge}>
                  <Sparkles size={14} color={isSubscribed ? '#16A34A' : '#EC4899'} />
                </View>
                <View style={[styles.floatingTextBadge, isSubscribed && { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.floatingBadgeText, isSubscribed && { color: '#15803D' }]}>
                    {isSubscribed ? '✓ ACTIVE MEMBER' : item.badge}
                  </Text>
                </View>
              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseSubtitle}>{item.subtitle}</Text>
                
                <Text style={styles.courseDescription}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.checkRow}>
                    <CheckCircle2 size={14} color={isSubscribed ? '#16A34A' : '#EC4899'} />
                    <Text style={[styles.checkText, isSubscribed && { color: '#15803D', fontWeight: '700' }]}>
                      {isSubscribed ? 'Access Unlocked' : `Starting at ${item.price}`}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Match dashboard background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FAF9F6',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FEE2E2', 
    shadowColor: '#EC4899', 
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180, // Slightly taller for the full list view
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  floatingIconBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  floatingTextBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  floatingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EC4899',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1B4B', 
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
    marginBottom: 12,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    marginLeft: 8,
  },
});
