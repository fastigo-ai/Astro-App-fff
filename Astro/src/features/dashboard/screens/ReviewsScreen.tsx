import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Star, Heart, Send } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';

const INITIAL_REVIEWS = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    month: '8th Month',
    rating: 5,
    text: 'Astro Baby completely transformed my pregnancy journey. The daily Garbhsanskar routines bring me so much peace, and I feel deeply connected with my baby.',
    type: 'ongoing'
  },
  {
    id: '2',
    name: 'Anjali Verma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    month: 'Delivered',
    rating: 5,
    text: 'I started using this app in my second trimester. The Vedic chanting and logic puzzles kept me sharp and calm. My baby boy was born so peaceful and healthy!',
    type: 'alumni'
  },
  {
    id: '3',
    name: 'Sneha Patel',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop',
    month: '4th Month',
    rating: 5,
    text: 'The daily diet charts and yoga sessions are so tailored and accurate. It feels like having a personal pregnancy coach in my pocket.',
    type: 'ongoing'
  },
];

export const ReviewsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [newReviewText, setNewReviewText] = useState('');

  // Calculate current month from LMP
  const getCurrentMonth = () => {
    if (!user?.lmp_date) return '1st Month';
    const lmp = new Date(user.lmp_date);
    const today = new Date();
    const diffTime = today.getTime() - lmp.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const month = Math.ceil(weeks / 4.33); // approx weeks in a month
    
    if (month >= 9) return '9th Month';
    if (month === 1) return '1st Month';
    if (month === 2) return '2nd Month';
    if (month === 3) return '3rd Month';
    return `${month}th Month`;
  };

  const handleSubmitReview = () => {
    if (!newReviewText.trim()) {
      Alert.alert('Empty Review', 'Please write something about your experience first!');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: user?.name || 'New Mumma',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop', // Default lovely avatar
      month: getCurrentMonth(),
      rating: 5,
      text: newReviewText,
      type: 'ongoing'
    };

    setReviews([newReview, ...reviews]);
    setNewReviewText('');
    Alert.alert('Thank You! 💖', 'Your beautiful experience has been shared with the community!');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top || 40 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#374151" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Experiences</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.heroSection}>
          <View style={styles.badgeContainer}>
            <Heart size={20} color="#EC4899" fill="#EC4899" />
            <Text style={styles.badgeText}>Loved by 10,000+ Mothers</Text>
          </View>
          <Text style={styles.heroTitle}>Transforming lives, one miracle at a time.</Text>
          <Text style={styles.heroSubtitle}>Hear from expecting mothers experiencing the magic of Garbhsanskar.</Text>
        </View>

        {/* WRITE REVIEW SECTION */}
        <View style={styles.writeReviewCard}>
          <Text style={styles.writeReviewTitle}>Share your journey with us</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="How is Astro Baby helping you?..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={newReviewText}
              onChangeText={setNewReviewText}
              maxLength={200}
            />
            <TouchableOpacity 
              style={[styles.sendBtn, newReviewText.trim().length > 0 && styles.sendBtnActive]}
              onPress={handleSubmitReview}
              activeOpacity={0.8}
            >
              <Send size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{review.name}</Text>
                <Text style={styles.userStatus}>{review.month}</Text>
              </View>
              <View style={styles.ratingBox}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{review.rating}.0</Text>
              </View>
            </View>
            
            <Text style={styles.reviewText}>"{review.text}"</Text>
            
            {review.type === 'ongoing' ? (
              <View style={styles.ongoingBadge}>
                <View style={styles.ongoingDot} />
                <Text style={styles.ongoingText}>Currently on the Journey</Text>
              </View>
            ) : (
              <View style={[styles.ongoingBadge, { backgroundColor: '#F3E8FF' }]}>
                <SparkleIcon color="#9333EA" />
                <Text style={[styles.ongoingText, { color: '#7E22CE' }]}>Successfully Delivered</Text>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SparkleIcon = ({ color }: { color: string }) => (
  <Text style={{ color, fontSize: 12, marginRight: 6 }}>✨</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Creamy ethereal background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#BE185D',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E1B4B',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  reviewCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#D97706',
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  ongoingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ongoingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#65A30D',
    marginRight: 6,
  },
  ongoingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4D7C0F',
  },
  writeReviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  writeReviewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 4,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1D5DB', // Disabled gray
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  sendBtnActive: {
    backgroundColor: '#EC4899', // Pink when active
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  }
});
