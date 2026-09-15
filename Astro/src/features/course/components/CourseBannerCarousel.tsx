import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
  { 
    id: '1', 
    title: 'Garbhadhaan Blueprint', 
    subtitle: 'Step-by-step guidance for natural conception',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=400&fit=crop'
  },
  { 
    id: '2', 
    title: 'Expert Consultations', 
    subtitle: 'Talk directly to top Gynecologists & Nutritionists',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=400&fit=crop'
  },
  { 
    id: '3', 
    title: 'Personalized Care', 
    subtitle: 'Tailored diet plans and daily routines',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=400&fit=crop'
  },
];

interface CourseBannerCarouselProps {
  banners?: BannerItem[];
}

export const CourseBannerCarousel = ({ banners = DEFAULT_BANNERS }: CourseBannerCarouselProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % banners.length;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: indexRef.current * (CARD_WIDTH + 16),
          animated: true,
        });
      }
      setActiveIndex(indexRef.current);
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const handleScrollEnd = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / (CARD_WIDTH + 16));
    indexRef.current = newIndex;
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.scrollContent}
      >
        {banners.map((banner) => (
          <View key={banner.id} style={styles.card}>
            <Image 
              source={{ uri: banner.image }} 
              style={styles.imagePlaceholder}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <View style={styles.textContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>PREMIUM</Text>
                </View>
                <Text style={styles.title}>{banner.title}</Text>
                <Text style={styles.subtitle}>{banner.subtitle}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.paginationContainer}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 220,
    marginTop: 16,
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    position: 'relative',
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 24,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#00BFA5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#F0F4F8',
    fontSize: 12,
    fontWeight: '500',
    maxWidth: '90%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C5D0DE',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2',
  },
});
