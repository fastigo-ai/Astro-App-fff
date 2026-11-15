import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import {
  CheckCircle2,
  Circle,
  Music,
  Sun,
  Heart,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;
const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(280, Math.round(width * 0.72));

export const KrishnaDailyVedicActivities = () => {
  const navigation = useNavigation<NavigationProp>();
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [completedList, setCompletedList] = useState<string[]>(['act_1']);

  // 3 Curated Feature Activities for the Swipe Carousel
  const FEATURE_ACTIVITIES = [
    {
      id: 'act_1',
      detailId: '1',
      time: '07:00 AM',
      duration: '10 min',
      title: isHindi ? 'प्रातः स्मरण एवं शांति पाठ' : 'Pratah Smaran & Morning Shloka',
      subtitle: isHindi ? 'शिशु के साथ पावन शुरुआत' : 'Sacred sunrise Vedic chanting',
      icon: <Sun size={20} color="#D97706" />,
      iconBg: '#FEF3C7',
      category: isHindi ? 'दैनिक मंत्र' : 'Mantra',
      actionPrompt: isHindi ? 'पाठ शुरू करें' : 'Start Chanting',
      color: '#D97706',
    },
    {
      id: 'act_2',
      detailId: '3',
      time: '10:30 AM',
      duration: '12 min',
      title: isHindi ? 'गर्भ संवाद (पावन संवाद)' : 'Garbh Samvad: Daily Womb Talk',
      subtitle: isHindi ? 'शिशु को प्रेम व संस्कार का संदेश' : 'Deep soul-to-soul womb conversation',
      icon: <Heart size={20} color="#E11D48" />,
      iconBg: '#FFE4E6',
      category: isHindi ? 'गर्भ संवाद' : 'Womb Talk',
      actionPrompt: isHindi ? 'संवाद शुरू करें' : 'Talk to Baby',
      color: '#E11D48',
    },
    {
      id: 'act_3',
      detailId: '4',
      time: '01:00 PM',
      duration: '15 min',
      title: isHindi ? 'राग यमन व नाद चिकित्सा' : 'Raag Yaman & 432Hz Music',
      subtitle: isHindi ? 'शिशु के मस्तिष्क का विकास' : 'Harmonic frequencies for fetal brain',
      icon: <Music size={20} color="#7C3AED" />,
      iconBg: '#F3E8FF',
      category: isHindi ? 'संगीत चिकित्सा' : 'Raaga Therapy',
      actionPrompt: isHindi ? 'संगीत सुनें' : 'Play Raaga',
      color: '#7C3AED',
    },
  ];

  const TOTAL_ACTIVITIES_COUNT = 5;

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

  const handleToggle = (id: string) => {
    if (completedList.includes(id)) {
      setCompletedList((prev) => prev.filter((x) => x !== id));
    } else {
      setCompletedList((prev) => [...prev, id]);
      Alert.alert(
        isHindi ? 'संस्कार पूर्ण! 🌸' : 'Activity Completed! 🌸',
        isHindi
          ? 'आपके शिशु को आज के पावन संस्कार का पूर्ण आशीर्वाद प्राप्त हुआ।'
          : 'You earned +20 Garbh Sanskar wellness points today.'
      );
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

      {/* Swipeable Horizontal Cards (Dating-style small card boxes) */}
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
              style={[styles.activitySwipeCard, isDone && styles.activitySwipeCardDone]}
              activeOpacity={0.88}
              onPress={() => handleOpenActivity(act)}
            >
              {/* Card Top: Category Badge & Time */}
              <View style={styles.cardTopRow}>
                <View style={[styles.categoryPill, { backgroundColor: act.iconBg }]}>
                  <Text style={[styles.categoryPillText, { color: act.color }]}>
                    {act.category}
                  </Text>
                </View>

                {/* Check Button */}
                <TouchableOpacity
                  style={styles.checkIconBtn}
                  onPress={() => handleToggle(act.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {isDone ? (
                    <CheckCircle2 size={22} color="#16A34A" />
                  ) : (
                    <Circle size={22} color="#CBD5E1" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Card Center: Icon & Title */}
              <View style={styles.cardCenterCol}>
                <View style={[styles.iconRing, { backgroundColor: act.iconBg }]}>
                  {act.icon}
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {act.title}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>
                  {act.subtitle}
                </Text>
              </View>

              {/* Card Bottom: Duration & Tap Prompt */}
              <View style={styles.cardBottomRow}>
                <Text style={styles.durationPill}>⏱ {act.duration} • {act.time}</Text>
                <View style={styles.actionPromptRow}>
                  <Text style={[styles.actionPromptText, { color: act.color }]}>
                    {isDone ? (isHindi ? 'पूर्ण ✓' : 'Done ✓') : act.actionPrompt}
                  </Text>
                  {!isDone && <ArrowRight size={13} color={act.color} style={{ marginLeft: 2 }} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Final "View All Activities" Card Box */}
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
          <Text style={styles.viewAllSub}>
            {isHindi ? 'दैनिक कैलेंडर, स्ट्रीक व 5 क्रियाएं' : 'Full 5 activities & month calendar'}
          </Text>

          <View style={styles.openCalendarBtn}>
            <Sparkles size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.openCalendarBtnText}>
              {isHindi ? 'कैलेंडर खोलें' : 'Open Calendar'}
            </Text>
          </View>
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
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    minHeight: 195,
  },
  activitySwipeCardDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  checkIconBtn: {
    padding: 2,
  },
  cardCenterCol: {
    marginVertical: 10,
  },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1B4B',
    lineHeight: 20,
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  durationPill: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  actionPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionPromptText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  viewAllCard: {
    width: CARD_WIDTH - 20,
    backgroundColor: '#FDF2F8',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#831843',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 195,
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
    fontSize: 15,
    fontWeight: '800',
    color: '#831843',
    textAlign: 'center',
    marginBottom: 4,
  },
  viewAllSub: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 8,
    lineHeight: 16,
  },
  openCalendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#831843',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  openCalendarBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
