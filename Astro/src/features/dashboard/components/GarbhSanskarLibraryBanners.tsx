import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Headphones, BookOpen, Sparkles, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const GarbhSanskarLibraryBanners: React.FC = () => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const handleAudioPress = () => {
    // Navigate to Mood & 432Hz Raaga Audio Therapy
    navigation.navigate('MoodTherapy');
  };

  const handleLibraryPress = () => {
    // Navigate to Garbh Sanskar Library Screen
    navigation.navigate('GarbhSanskarLibrary');
  };

  return (
    <View style={styles.container}>
      {/* Box 1: Garbh Sanskar Audio Banner */}
      <TouchableOpacity
        testID="banner-garbh-audio"
        style={[styles.bannerBox, styles.audioBanner]}
        activeOpacity={0.88}
        onPress={handleAudioPress}
      >
        <View style={styles.bannerDecorCircle1} />
        <View style={styles.bannerDecorCircle2} />

        <View style={styles.bannerLeftContent}>
          <Text style={styles.bannerSubheading}>
            {isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar'}
          </Text>
          <Text style={styles.bannerHeadingScript}>
            {isHindi ? 'ऑडियो संगीत' : 'Audio'}
          </Text>
          <View style={styles.tapPromptRow}>
            <Text style={styles.bannerTapPrompt}>
              {isHindi ? 'सुनने के लिए टैप करें...' : 'Tap here to listen...'}
            </Text>
            <ChevronRight size={14} color="#E9D5FF" />
          </View>
        </View>

        <View style={styles.iconCirclePurple}>
          <Headphones size={28} color="#7C3AED" />
        </View>
      </TouchableOpacity>

      {/* Box 2: Garbh Sanskar Library Banner */}
      <TouchableOpacity
        testID="banner-garbh-library"
        style={[styles.bannerBox, styles.libraryBanner]}
        activeOpacity={0.88}
        onPress={handleLibraryPress}
      >
        <View style={styles.bannerDecorCircle3} />
        <View style={styles.bannerDecorCircle4} />

        <View style={styles.bannerLeftContent}>
          <Text style={[styles.bannerSubheading, { color: '#7C2D12' }]}>
            {isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar'}
          </Text>
          
          <View style={styles.hangingSignWrap}>
            <View style={styles.hangingSignBadge}>
              <Text style={styles.hangingSignText}>
                {isHindi ? 'लाइब्रेरी' : 'Library'}
              </Text>
            </View>
          </View>

          <View style={styles.tapPromptRow}>
            <Text style={[styles.bannerTapPrompt, { color: '#9A3412' }]}>
              {isHindi ? 'कथाएं पढ़ने के लिए टैप करें...' : 'Tap to read sacred stories...'}
            </Text>
            <ChevronRight size={14} color="#EA580C" />
          </View>
        </View>

        <View style={styles.iconCircleOrange}>
          <BookOpen size={28} color="#EA580C" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 14,
    gap: 12,
  },
  bannerBox: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  audioBanner: {
    backgroundColor: '#7C3AED', // Royal Purple matching top reference
  },
  libraryBanner: {
    backgroundColor: '#FEF08A', // Warm golden yellow / peach gradient backing
    borderWidth: 1.5,
    borderColor: '#FDE047',
  },
  bannerLeftContent: {
    flex: 1,
    zIndex: 2,
  },
  bannerSubheading: {
    fontSize: 13,
    color: '#EDE9FE',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bannerHeadingScript: {
    fontSize: 30,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginVertical: 2,
    letterSpacing: -0.5,
  },
  hangingSignWrap: {
    marginVertical: 4,
  },
  hangingSignBadge: {
    backgroundColor: '#DC2626', // Red hanging badge matching reference
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#B91C1C',
  },
  hangingSignText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tapPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  bannerTapPrompt: {
    fontSize: 12.5,
    color: '#E9D5FF',
    fontWeight: '600',
  },
  iconCirclePurple: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 2,
  },
  iconCircleOrange: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 2,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  bannerDecorCircle1: {
    position: 'absolute',
    top: -20,
    right: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  bannerDecorCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  bannerDecorCircle3: {
    position: 'absolute',
    top: -15,
    right: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
  },
  bannerDecorCircle4: {
    position: 'absolute',
    bottom: -20,
    left: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(234, 88, 12, 0.08)',
  },
});
