import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image as RNImage, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { pastelPalette } from '~/shared/theme';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2) - CARD_GAP) / 2;

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const KrishnaPillarsGrid = () => {
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language?.startsWith('hi') ?? false;

  const handlePress = (route: keyof AppStackParamList) => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate(route);
    } else {
      (navigation as any).navigate(route);
    }
  };

  const PILLARS_2X2 = [
    {
      id: 'prepregnancy',
      category: isHindi ? 'गर्भधारण पूर्व' : 'Before Pregnancy',
      categoryColor: pastelPalette.softSlateBlue, // #6B8EB9
      title: isHindi ? 'गर्भधान संस्कार' : 'Pre Pregnancy',
      titleColor: '#3B5B88',
      bullets: [
        isHindi ? '• शिशु योजना' : '• Baby Planning',
        isHindi ? '• प्राकृतिक गर्भधारण' : '• Natural Conception',
      ],
      image: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
      route: 'Garbhadhaan' as const,
      isPremium: false,
    },
    {
      id: 'garbhsanskar',
      category: isHindi ? 'गर्भावस्था के दौरान' : 'During Pregnancy',
      categoryColor: pastelPalette.softCoralRose, // #DE6B81
      title: isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar',
      titleColor: '#C24168',
      bullets: [
        isHindi ? '• सकारात्मक गर्भावस्था' : '• Positive Pregnancy',
        isHindi ? '• सुरक्षित प्रसव' : '• Safe Delivery',
        isHindi ? '• श्रेष्ठ संतान' : '• Great Child',
      ],
      image: require('../../../assets/programs/garbh_sanskar.jpg'),
      route: 'Course' as const,
      isPremium: true,
    },
    {
      id: 'balsanskar',
      category: isHindi ? 'प्रसव के बाद' : 'After Delivery',
      categoryColor: pastelPalette.softMutedTeal, // #47A9A3
      title: isHindi ? 'बाल संस्कार' : 'Bal Sanskar',
      titleColor: '#28807A',
      bullets: [
        isHindi ? '• नवजात शिशु संस्कार' : '• Sanskar for Newborn',
        isHindi ? '• 0-2 वर्ष शिशु देखभाल' : '• 0-2 Yrs Infant Care',
      ],
      image: require('../../../assets/programs/bal_sanskar.jpg'),
      route: 'BalSanskar' as const,
      isPremium: false,
    },
    {
      id: 'jyotish',
      category: isHindi ? 'सभी के लिए' : 'For Everyone',
      categoryColor: pastelPalette.softTaupeMocha, // #7D6855
      title: isHindi ? 'ज्योतिष' : 'Jyotish',
      titleColor: '#5A4634',
      bullets: [
        isHindi ? '• ज्योतिषीय मार्गदर्शन' : '• Astrological Guidance',
        isHindi ? '• कुंडली विश्लेषण' : '• Chart Analysis',
      ],
      image: require('../../../assets/programs/consultations.jpg'),
      route: 'Kundli' as const,
      isPremium: false,
    },
  ];

  const CARD_5 = {
    id: 'anandam',
    category: isHindi ? 'सभी महिलाओं के लिए' : 'For All Women',
    categoryColor: pastelPalette.softPlumOrchid, // #9C477B
    title: isHindi ? 'आनंदम' : 'Anandam',
    titleColor: '#7E2B5A',
    bullets: [
      isHindi ? '• आनंदमय जीवन का मार्ग' : '• Your Path to a blissful life',
      isHindi ? '• दैनिक गर्भ सामंजस्य' : '• Daily Womb Harmony',
    ],
    image: require('../../../assets/images/hero-1.png'),
    route: 'LiveSessions' as const,
  };

  return (
    <View style={styles.container}>
      {/* 2x2 Grid Matching Krishna Coming Layout */}
      <View style={styles.grid}>
        {PILLARS_2X2.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => handlePress(item.route)}
            accessibilityRole="button"
            accessibilityLabel={item.title}
          >
            {/* Category Badge Pill & Premium Pill */}
            <View style={styles.badgesRow}>
              <View style={[styles.categoryBadge, { backgroundColor: item.categoryColor }]}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.cardTitle, { color: item.titleColor }]}>
              {item.title}
            </Text>

            {/* Concise Bullets */}
            <View style={styles.bulletsList}>
              {item.bullets.map((bullet, idx) => (
                <Text key={idx} style={styles.bulletItem} numberOfLines={1}>
                  {bullet}
                </Text>
              ))}
            </View>

            {/* Bottom Row: Premium badge (if any) & Circular Arrow Button */}
            <View style={styles.cardBottomRow}>
              <View style={styles.bottomLeftCol}>
                {item.isPremium && (
                  <View style={styles.premiumPill}>
                    <Text style={styles.premiumPillText}>PREMIUM</Text>
                  </View>
                )}
                <View style={styles.arrowCircle}>
                  <ArrowRight size={14} color="#6B7280" />
                </View>
              </View>
            </View>

            {/* Bottom-right Cutout Image */}
            <RNImage
              source={item.image}
              style={styles.cutoutImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 5th Wide Bottom Card: Anandam */}
      <TouchableOpacity
        style={styles.wideCard}
        activeOpacity={0.88}
        onPress={() => handlePress(CARD_5.route)}
        accessibilityRole="button"
        accessibilityLabel={CARD_5.title}
      >
        <View style={styles.wideCardContent}>
          {/* Category Badge Pill */}
          <View style={[styles.categoryBadge, { backgroundColor: CARD_5.categoryColor, alignSelf: 'flex-start' }]}>
            <Text style={styles.categoryBadgeText}>{CARD_5.category}</Text>
          </View>

          {/* Title */}
          <Text style={[styles.wideCardTitle, { color: CARD_5.titleColor }]}>
            {CARD_5.title}
          </Text>

          {/* Concise Bullets */}
          <View style={styles.bulletsList}>
            {CARD_5.bullets.map((bullet, idx) => (
              <Text key={idx} style={styles.wideBulletItem} numberOfLines={1}>
                {bullet}
              </Text>
            ))}
          </View>

          {/* Circular Arrow Button */}
          <View style={[styles.arrowCircle, { marginTop: 8 }]}>
            <ArrowRight size={14} color="#6B7280" />
          </View>
        </View>

        {/* Bottom-right Cutout Image for Anandam */}
        <RNImage
          source={CARD_5.image}
          style={styles.wideCutoutImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  premiumPill: {
    backgroundColor: '#F59E0B', // Muted amber
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  premiumPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  bulletsList: {
    marginBottom: 8,
    zIndex: 2,
  },
  bulletItem: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 16,
    maxWidth: '65%',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  bottomLeftCol: {
    alignItems: 'flex-start',
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cutoutImage: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 78,
    height: 96,
    borderBottomRightRadius: 19,
    opacity: 0.95,
  },
  wideCard: {
    width: '100%',
    minHeight: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginTop: CARD_GAP,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  wideCardContent: {
    maxWidth: '65%',
    zIndex: 2,
  },
  wideCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  wideBulletItem: {
    fontSize: 11.5,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 17,
  },
  wideCutoutImage: {
    position: 'absolute',
    right: 8,
    bottom: -6,
    width: 110,
    height: 120,
    opacity: 0.95,
  },
});
