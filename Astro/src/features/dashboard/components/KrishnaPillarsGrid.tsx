import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image as RNImage, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const KrishnaPillarsGrid = () => {
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const PILLARS = [
    {
      id: 'garbhsanskar',
      title: isHindi ? 'गर्भ संस्कार' : 'Garbh Sanskar',
      hindiSub: 'माह 1 से 9 तक संपूर्ण संस्कार',
      englishSub: 'Month 1 to 9 Complete Care',
      badge: 'POPULAR',
      color: '#E11D48',
      bgColor: '#FFF1F2',
      badgeBg: '#F43F5E',
      image: require('../../../assets/programs/garbh_sanskar.jpg'),
      route: 'Course' as const,
    },
    {
      id: 'preplanner',
      title: isHindi ? 'गर्भधान संस्कार' : 'Pre-Pregnancy',
      hindiSub: 'बीज शुद्धि व उत्तम संतान योग',
      englishSub: 'Beej Shuddhi & Auspicious Muhurat',
      badge: 'PLANNING',
      color: '#2563EB',
      bgColor: '#EFF6FF',
      badgeBg: '#3B82F6',
      image: require('../../../assets/programs/garbhdhaan_sanskar.jpg'),
      route: 'Garbhadhaan' as const,
    },
    {
      id: 'balsanskar',
      title: isHindi ? 'बाल संस्कार' : 'Bal Sanskar',
      hindiSub: '0 से 2 वर्ष शिशु विकास',
      englishSub: '0 to 2 Years Infant Brain Care',
      badge: '0-2 YRS',
      color: '#0D9488',
      bgColor: '#F0FDFA',
      badgeBg: '#14B8A6',
      image: require('../../../assets/programs/bal_sanskar.jpg'),
      route: 'BalSanskar' as const,
    },
    {
      id: 'jyotish',
      title: isHindi ? 'गर्भ कुंडली' : 'Garbh Kundli',
      hindiSub: 'ग्रह-नक्षत्र व वैदिक ज्योतिष',
      englishSub: 'Planetary Charts & Astrologers',
      badge: 'JYOTISH',
      color: '#7C3AED',
      bgColor: '#FAF5FF',
      badgeBg: '#8B5CF6',
      image: require('../../../assets/programs/consultations.jpg'),
      route: 'Kundli' as const,
    },
  ];

  const handlePress = (route: keyof AppStackParamList) => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate(route);
    } else {
      (navigation as any).navigate(route);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.badgeRow}>
            <Sparkles size={14} color="#E11D48" />
            <Text style={styles.badgeLabel}>
              {isHindi ? 'वैदिक गर्भ संस्कार स्तंभ' : '4 VEDIC SANSCAR PILLARS'}
            </Text>
          </View>
          <Text style={styles.sectionTitle}>
            {isHindi ? 'संस्कार कार्यक्रम चयन करें' : 'Select Sanskar Program'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.viewAllBtn}
          onPress={() => handlePress('AllPrograms')}
        >
          <Text style={styles.viewAllText}>{isHindi ? 'सभी देखें' : 'View All'}</Text>
          <ArrowRight size={14} color="#E11D48" />
        </TouchableOpacity>
      </View>

      {/* 2x2 Grid Matching Krishna Coming Layout */}
      <View style={styles.grid}>
        {PILLARS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.bgColor }]}
            activeOpacity={0.88}
            onPress={() => handlePress(item.route)}
          >
            {/* Image Header with Badge */}
            <View style={styles.imageWrapper}>
              <RNImage source={item.image} style={styles.cardImage} resizeMode="cover" />
              <View style={[styles.cardBadge, { backgroundColor: item.badgeBg }]}>
                <Text style={styles.cardBadgeText}>{item.badge}</Text>
              </View>
            </View>

            {/* Card Content */}
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: item.color }]}>
                {item.title}
              </Text>
              <Text style={styles.cardSub} numberOfLines={2}>
                {isHindi ? item.hindiSub : item.englishSub}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={[styles.actionText, { color: item.color }]}>
                  {isHindi ? 'प्रारंभ करें →' : 'Explore →'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E11D48',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  imageWrapper: {
    height: 105,
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 11.5,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
