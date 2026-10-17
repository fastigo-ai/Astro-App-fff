import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image as RNImage, Dimensions, Animated, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; 
const SPACING = (width - CARD_WIDTH) / 2; 

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

export const CourseGrid = () => {
  const navigation = useNavigation<any>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-swipe logic
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= COURSES.length) {
        nextIndex = 0;
      }
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
      setCurrentIndex(nextIndex);
    }, 4000); // Swipes every 4 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Explore Programs</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllPrograms')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList 
        ref={flatListRef}
        data={COURSES}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false } // Kept false to support dot width/color animation
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          const isSubscribed = useAuthStore.getState().isProgramSubscribed(item.id);
          return (
            <View style={{ width: CARD_WIDTH }}>
              <Animated.View style={[styles.cardWrapper, { transform: [{ scale }], opacity }]}>
                <TouchableOpacity 
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
                    
                    <Text style={styles.courseDescription} numberOfLines={3}>
                      {item.description}
                    </Text>

                    <View style={styles.cardFooter}>
                      <View style={styles.checkRow}>
                        <CheckCircle2 size={14} color={isSubscribed ? '#16A34A' : '#EC4899'} />
                        <Text style={[styles.checkText, isSubscribed && { color: '#15803D', fontWeight: '700' }]}>
                          {isSubscribed ? 'Access Unlocked' : `Enroll from ${item.price}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {COURSES.map((_, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#FBCFE8', '#EC4899', '#FBCFE8'], 
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, backgroundColor: dotColor as any }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingBottom: 24,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
  },
  cardWrapper: {
    flex: 1,
    paddingVertical: 10,
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
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
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
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  floatingTextBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  floatingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EC4899',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 20,
    flex: 1,
  },
  courseTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E1B4B', 
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EC4899',
    marginBottom: 12,
  },
  courseDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  cardFooter: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
