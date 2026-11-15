import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Headphones, BookOpen, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Default high-resolution maternal images matching reference media_1794783676454_54307c45.jpg
const DEFAULT_AUDIO_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
};

const DEFAULT_LIBRARY_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
};

export interface GarbhSanskarLibraryBannersProps {
  audioImage?: any;
  libraryImage?: any;
}

export const GarbhSanskarLibraryBanners: React.FC<GarbhSanskarLibraryBannersProps> = ({
  audioImage,
  libraryImage,
}) => {
  const navigation = useNavigation<any>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const handleAudioPress = () => {
    navigation.navigate('MoodTherapy');
  };

  const handleLibraryPress = () => {
    navigation.navigate('GarbhSanskarLibrary');
  };

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* Box 1: Garbh Sanskar Audio Banner (Half Diagonal Image Ready) */}
      {/* ============================================================== */}
      <TouchableOpacity
        testID="banner-garbh-audio"
        style={[styles.bannerBox, styles.audioBanner]}
        activeOpacity={0.9}
        onPress={handleAudioPress}
      >
        {/* Left Half: Diagonal Image Container */}
        <View style={styles.imageHalfContainer}>
          <Image
            source={audioImage || DEFAULT_AUDIO_IMAGE}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          {/* Diagonal Angle Divider Slice */}
          <View style={[styles.diagonalDivider, { backgroundColor: '#7C3AED' }]} />
        </View>

        {/* Right Half: Text & Action Content */}
        <View style={styles.rightContentArea}>
          <Text style={styles.audioSubheading}>
            {isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar'}
          </Text>
          <Text style={styles.audioScriptTitle}>
            {isHindi ? 'ऑडियो संगीत' : 'Audio'}
          </Text>
          <View style={styles.tapPromptRow}>
            <Text style={styles.audioTapText}>
              {isHindi ? 'सुनने के लिए टैप करें...' : 'Tap here to listen...'}
            </Text>
            <ChevronRight size={13} color="#E9D5FF" />
          </View>
        </View>

        {/* Small floating audio icon pill */}
        <View style={styles.floatingAudioIcon}>
          <Headphones size={18} color="#7C3AED" />
        </View>
      </TouchableOpacity>

      {/* ================================================================ */}
      {/* Box 2: Garbh Sanskar Library Banner (Half Diagonal Image Ready) */}
      {/* ================================================================ */}
      <TouchableOpacity
        testID="banner-garbh-library"
        style={[styles.bannerBox, styles.libraryBanner]}
        activeOpacity={0.9}
        onPress={handleLibraryPress}
      >
        {/* Left Half: Diagonal Image Container */}
        <View style={styles.imageHalfContainer}>
          <Image
            source={libraryImage || DEFAULT_LIBRARY_IMAGE}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          {/* Diagonal Angle Divider Slice */}
          <View style={[styles.diagonalDivider, { backgroundColor: '#FEF08A' }]} />
        </View>

        {/* Right Half: Hanging Sign & Content */}
        <View style={styles.rightContentArea}>
          {/* Chains for hanging sign effect */}
          <View style={styles.chainsRow}>
            <View style={styles.chainLink} />
            <View style={styles.chainLink} />
          </View>

          {/* Hanging Red Library Board */}
          <View style={styles.hangingSignBoard}>
            <Text style={styles.hangingSignText}>
              {isHindi ? 'लाइब्रेरी' : 'Library'}
            </Text>
          </View>

          <View style={styles.tapPromptRow}>
            <Text style={styles.libraryTapText}>
              {isHindi ? 'कथाएं पढ़ने के लिए टैप करें...' : 'Tap to read sacred stories...'}
            </Text>
            <ChevronRight size={13} color="#C2410C" />
          </View>
        </View>

        {/* Small floating book icon pill */}
        <View style={styles.floatingBookIcon}>
          <BookOpen size={18} color="#EA580C" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 12,
  },
  bannerBox: {
    height: 114,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  audioBanner: {
    backgroundColor: '#7C3AED', // Deep Royal Violet matching top reference
  },
  libraryBanner: {
    backgroundColor: '#FEF08A', // Warm golden yellow matching bottom reference
    borderWidth: 1.5,
    borderColor: '#FDE047',
  },
  imageHalfContainer: {
    width: '44%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  diagonalDivider: {
    position: 'absolute',
    top: -15,
    bottom: -15,
    right: -16,
    width: 34,
    transform: [{ skewX: '-14deg' }],
    zIndex: 2,
  },
  rightContentArea: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 18,
    justifyContent: 'center',
    zIndex: 3,
  },
  audioSubheading: {
    fontSize: 12.5,
    color: '#EDE9FE',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  audioScriptTitle: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '800',
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginVertical: 1,
    letterSpacing: -0.5,
  },
  chainsRow: {
    flexDirection: 'row',
    gap: 46,
    paddingLeft: 12,
    marginBottom: -2,
  },
  chainLink: {
    width: 4,
    height: 8,
    backgroundColor: '#94A3B8',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#64748B',
  },
  hangingSignBoard: {
    backgroundColor: '#DC2626', // Vibrant red hanging board
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 9,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#B91C1C',
    marginBottom: 4,
  },
  hangingSignText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tapPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  audioTapText: {
    fontSize: 12,
    color: '#E9D5FF',
    fontWeight: '600',
  },
  libraryTapText: {
    fontSize: 11.5,
    color: '#9A3412',
    fontWeight: '700',
  },
  floatingAudioIcon: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 4,
  },
  floatingBookIcon: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FED7AA',
    zIndex: 4,
  },
});
