import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image as RNImage,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Calendar, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;
const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(210, Math.round(width * 0.54));

export const KrishnaDailyVedicActivities = () => {
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [completedList] = useState<string[]>(['act_1']);

  // 3 Curated Feature Activities with photo and single activity title
  const FEATURE_ACTIVITIES = [
    {
      id: 'act_1',
      detailId: '1',
      title: isHindi ? 'प्रातः स्मरण एवं श्लोक' : 'Pratah Smaran & Shloka',
      image: require('../../../assets/programs/garbh_sanskar.jpg'),
    },
    {
      id: 'act_2',
      detailId: '3',
      title: isHindi ? 'गर्भ संवाद' : 'Garbh Samvad',
      image: require('../../../assets/programs/infant_care.jpg'),
    },
    {
      id: 'act_3',
      detailId: '4',
      title: isHindi ? 'राग यमन संगीत' : 'Raag Yaman Music',
      image: require('../../../assets/programs/bal_sanskar.jpg'),
    },
  ];

  const navigateToActivitiesScreen = () => {
    try {
      const parent = navigation.getParent();
      if (parent) {
        (parent as any).navigate('Activity');
      } else {
        (navigation as any).navigate('Activity');
      }
    } catch {
      (navigation as any).navigate('Activity');
    }
  };

  const handleOpenActivity = (act: any) => {
    if (act.detailId) {
      navigation.navigate('ActivityDetail', { id: act.detailId });
    } else {
      navigateToActivitiesScreen();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerBadge}>
            {isHindi ? 'दैनिक संस्कार दिनचर्या' : 'TODAY’S VEDIC ROUTINE'}
          </Text>
          <Text style={styles.headerTitle}>
            {isHindi ? 'दैनिक गर्भ संस्कार क्रियाएं' : 'Daily Sanskar Activities'}
          </Text>
        </View>

        {/* Clickable "See All" pill leading to full Activity screen */}
        <TouchableOpacity
          style={styles.seeAllPill}
          activeOpacity={0.7}
          onPress={navigateToActivitiesScreen}
        >
          <Text style={styles.seeAllText}>
            {isHindi ? 'सभी देखें (5) >' : 'See All (5) →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Horizontal Cards (Single Activity Name + Photo Only) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScrollContent}
        snapToInterval={CARD_WIDTH + 14}
        decelerationRate="fast"
      >
        {FEATURE_ACTIVITIES.map((act) => {
          const isDone = completedList.includes(act.id);

          return (
            <TouchableOpacity
              key={act.id}
              style={styles.activitySwipeCard}
              activeOpacity={0.88}
              onPress={() => handleOpenActivity(act)}
            >
              {/* Photo of the activity */}
              <View style={styles.imageBox}>
                <RNImage
                  source={act.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                {isDone && (
                  <View style={styles.checkBadge}>
                    <CheckCircle2 size={14} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* Single text of the activity name */}
              <View style={styles.titleContainer}>
                <Text style={styles.activityTitleText} numberOfLines={2}>
                  {act.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Final "View All" Card Box */}
        <TouchableOpacity
          style={styles.viewAllCard}
          activeOpacity={0.85}
          onPress={navigateToActivitiesScreen}
        >
          <View style={styles.viewAllIconRing}>
            <Calendar size={28} color="#831843" />
          </View>
          <Text style={styles.viewAllTitle}>
            {isHindi ? 'सभी क्रियाएं देखें' : 'View All Activities'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  seeAllPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  cardsScrollContent: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: 6,
  },
  activitySwipeCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageBox: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#16A34A',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  titleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  activityTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
    textAlign: 'center',
    lineHeight: 18,
  },
  viewAllCard: {
    width: CARD_WIDTH - 20,
    backgroundColor: '#FDF2F8',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#831843',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 180,
  },
  viewAllIconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#831843',
    textAlign: 'center',
    lineHeight: 18,
  },
});
