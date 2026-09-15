import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { theme } from '~/shared/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width minus horizontal padding

const BANNERS = [
  { 
    id: '1', 
    title: 'EXPERT DOCTORS', 
    image: require('~/assets/images/team_photo.png') 
  },
  { 
    id: '2', 
    title: 'TEAM ASTRO BABY', 
    image: require('~/assets/images/team_photo.png') 
  },
  { 
    id: '3', 
    title: 'AWARD WINNING', 
    image: require('~/assets/images/team_photo.png') 
  },
];

export const TeamBanner = () => {
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % BANNERS.length;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: indexRef.current * (CARD_WIDTH + 16),
          animated: true,
        });
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(timer);
  }, []);

  const handleScrollEnd = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    indexRef.current = Math.round(x / (CARD_WIDTH + 16));
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + 16} // card width + marginRight
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
      >
        {BANNERS.map((banner) => (
          <View key={banner.id} style={styles.card}>
            <Image 
              source={banner.image} 
              style={styles.imagePlaceholder}
              resizeMode="cover"
            />
            <View style={styles.bannerBanner}>
              <Text style={styles.bannerText}>{banner.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: 16, // padding at the start and end of the scroll view
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 16,
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    height: 180, // match image height
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#EAEAEA',
  },
  bannerBanner: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#FFF9C4', // Soft yellow
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#F57F17',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F57F17', // deep gold
    letterSpacing: 1.5,
  },
});
