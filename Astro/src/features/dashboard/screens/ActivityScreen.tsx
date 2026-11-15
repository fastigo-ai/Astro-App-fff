import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import {
  Lock,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronLeft,
} from 'lucide-react-native';

import { api } from '~/shared/api';

const LOCAL_ACTIVITY_IMAGES: Record<string, any> = {
  '1': require('../../../assets/programs/garbh_sanskar.jpg'),
  '2': require('../../../assets/programs/beej_sanskar.jpg'),
  '3': require('../../../assets/programs/infant_care.jpg'),
  '4': require('../../../assets/programs/bal_sanskar.jpg'),
};

const DEFAULT_DAYS = [
  { day: 26, label: 'Mon', status: 'completed' },
  { day: 27, label: 'Tue', status: 'completed' },
  { day: 28, label: 'Wed', status: 'today' },
  { day: 29, label: 'Thu', status: 'locked' },
  { day: 30, label: 'Fri', status: 'locked' },
];

const DEFAULT_ACTIVITIES = [
  {
    id: '1',
    title: 'Vishnu Sahasranama',
    subtitle: 'Vishnu Sahasranama',
    scheduleText: '21 November, Saturday | 12:00 PM',
    time: '12:00 PM',
    type: 'Vedic Chanting',
    duration: '15 mins',
    completed: true,
    color: '#831843',
    iconName: 'PlayCircle',
    image: require('../../../assets/programs/garbh_sanskar.jpg'),
  },
  {
    id: '2',
    title: 'Morning Yognidra',
    subtitle: 'Gentle Pranayama & Meditation',
    scheduleText: '22 November, Sunday | 07:30 AM',
    time: '07:30 AM',
    type: 'Yoga & Relaxation',
    duration: '20 mins',
    completed: true,
    color: '#0284C7',
    iconName: 'BookOpen',
    image: require('../../../assets/programs/beej_sanskar.jpg'),
  },
  {
    id: '3',
    title: 'Garbh Samvaad',
    subtitle: 'Loving Mother-Baby Bonding',
    scheduleText: '23 November, Monday | 04:30 PM',
    time: '04:30 PM',
    type: 'Bonding Talk',
    duration: '10 mins',
    completed: false,
    color: '#D97706',
    iconName: 'CheckCircle2',
    image: require('../../../assets/programs/infant_care.jpg'),
  },
  {
    id: '4',
    title: 'Evening Ragas',
    subtitle: '432Hz Soothing Classical Melodies',
    scheduleText: '24 November, Tuesday | 07:00 PM',
    time: '07:00 PM',
    type: 'Music Therapy',
    duration: '30 mins',
    completed: false,
    color: '#7C3AED',
    iconName: 'Music',
    image: require('../../../assets/programs/bal_sanskar.jpg'),
  },
];

export const ActivityScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [selectedDay, setSelectedDay] = useState(28);
  const [days, setDays] = useState<any[]>(DEFAULT_DAYS);
  const [activities, setActivities] = useState<any[]>(DEFAULT_ACTIVITIES);
  const [streak, setStreak] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await api.get('/api/v1/activities/daily');
        if (response.data && response.data.success && response.data.data) {
          if (Array.isArray(response.data.data.days) && response.data.data.days.length > 0) {
            setDays(response.data.data.days);
          }
          if (Array.isArray(response.data.data.activities) && response.data.data.activities.length > 0) {
            // merge images
            const merged = response.data.data.activities.map((act: any) => ({
              ...act,
              image: act.image || LOCAL_ACTIVITY_IMAGES[act.id] || LOCAL_ACTIVITY_IMAGES['1'],
            }));
            setActivities(merged);
          }
          if (typeof response.data.data.streak === 'number') {
            setStreak(response.data.data.streak);
          }
          if (typeof response.data.data.selectedDay === 'number') {
            setSelectedDay(response.data.data.selectedDay);
          }
        }
      } catch (error) {
        console.error('Failed to fetch daily journey, using local fallback:', error);
      }
    };
    fetchJourney();
  }, []);

  const currentDayInfo = (days || []).find((d) => d && d.day === selectedDay);
  const isLocked = currentDayInfo?.status === 'locked';

  const completedCount = (activities || []).filter((a) => a && a.completed).length;
  const totalCount = (activities || []).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Spiritual Header with Motif & Sacred Quote */}
        <View style={styles.spiritualHeader}>
          <SafeAreaView edges={['top']}>
            <View style={styles.topNavRow}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                activeOpacity={0.7}
              >
                <ChevronLeft size={22} color="#0F766E" />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>

              <View style={styles.streakBadge}>
                <Sparkles size={14} color="#D97706" />
                <Text style={styles.streakBadgeText}>{streak} Day Streak!</Text>
              </View>
            </View>

            {/* Sacred Motif / Emblem */}
            <View style={styles.sacredEmblemWrapper}>
              <View style={styles.sacredEmblemCircle}>
                <Sparkles size={34} color="#0D9488" />
              </View>
            </View>

            {/* Ornate Ribbon Badge */}
            <View style={styles.ribbonWrapper}>
              <View style={styles.ribbonBanner}>
                <Text style={styles.ribbonSmallText}>Activity Calendar</Text>
                <Text style={styles.ribbonMonthText}>November Month</Text>
              </View>
            </View>

            {/* Sincere Request Card */}
            <View style={styles.sincereCard}>
              <Text style={styles.sincereText}>
                People are experiencing miraculous results of &apos;Krishna Coming Garbh Sanskar Process&apos;. Therefore, we request you to follow this activity calendar religiously with sincere and positive state of mind.
              </Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Today's Progress Card */}
          <View style={styles.floatingProgressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today&apos;s Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressSubtext}>
              {completedCount} of {totalCount} activities completed
            </Text>
          </View>

          {/* Day Selector */}
          <View style={styles.daySelectorContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayScrollContent}
            >
              {days.map((item) => {
                const isSelected = selectedDay === item.day;
                const isCompleted = item.status === 'completed';
                const isToday = item.status === 'today';
                const isItemLocked = item.status === 'locked';

                let bgColor = '#FFFFFF';
                let textColor = '#6B7280';
                let borderColor = '#E2E8F0';

                if (isSelected) {
                  bgColor = '#1E1B4B';
                  textColor = '#FFFFFF';
                  borderColor = '#1E1B4B';
                } else if (isToday) {
                  borderColor = '#EC4899';
                  textColor = '#1F2937';
                } else if (isItemLocked) {
                  bgColor = '#F9FAFB';
                }

                return (
                  <TouchableOpacity
                    key={item.day}
                    style={[styles.dayBox, { backgroundColor: bgColor, borderColor }]}
                    onPress={() => setSelectedDay(item.day)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dayLabel,
                        { color: isSelected ? '#E2E8F0' : '#9CA3AF' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={[styles.dayNumber, { color: textColor }]}>
                      {item.day}
                    </Text>

                    <View style={styles.statusIconContainer}>
                      {isCompleted && <CheckCircle2 size={16} color="#10B981" />}
                      {isItemLocked && <Lock size={14} color="#D1D5DB" />}
                      {isToday && !isCompleted && (
                        <Circle size={14} color={isSelected ? '#FFFFFF' : '#EC4899'} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Activities List or Locked Message */}
          {isLocked ? (
            <View style={styles.lockedContainer}>
              <View style={styles.lockedIconCircle}>
                <Lock size={32} color="#9CA3AF" />
              </View>
              <Text style={styles.lockedTitle}>Day {selectedDay} is Locked</Text>
              <Text style={styles.lockedSubtitle}>
                Complete today&apos;s activities to unlock the next day&apos;s journey.
              </Text>
            </View>
          ) : (
            <View style={styles.activitiesSection}>
              {activities.map((activity) => {
                const activityImage =
                  activity.image ||
                  LOCAL_ACTIVITY_IMAGES[activity.id] ||
                  LOCAL_ACTIVITY_IMAGES['1'];

                return (
                  <View key={activity.id} style={styles.activityCardWrapper}>
                    {/* Top Scheduled Date Badge Pill overlapping the card border */}
                    <View style={styles.dateBadgePillWrapper}>
                      <View style={styles.dateBadgePill}>
                        <Text style={styles.dateBadgePillText}>
                          {activity.scheduleText || `Day ${selectedDay} • ${activity.time || '10:00 AM'}`}
                        </Text>
                      </View>
                    </View>

                    {/* Main Card */}
                    <TouchableOpacity
                      style={styles.activityCard}
                      activeOpacity={0.88}
                      onPress={() => navigation.navigate('ActivityDetail', { id: activity.id })}
                    >
                      {/* Activity Title */}
                      <Text style={styles.activityCardTitle}>{activity.title}</Text>

                      {/* Photo Banner */}
                      <View style={styles.imageContainer}>
                        <RNImage
                          source={activityImage}
                          style={styles.activityBannerImage}
                          resizeMode="cover"
                        />
                        {activity.completed && (
                          <View style={styles.completedTag}>
                            <CheckCircle2 size={12} color="#FFFFFF" />
                            <Text style={styles.completedTagText}>Completed</Text>
                          </View>
                        )}
                      </View>

                      {/* Little bit of text with activity name / subtitle */}
                      <View style={styles.activityCardFooter}>
                        <Text style={styles.activityNameText} numberOfLines={1}>
                          {activity.subtitle || activity.title}
                        </Text>
                        <View style={styles.activityMetaRow}>
                          <Text style={styles.activityMetaText}>
                            {activity.type} • {activity.duration}
                          </Text>
                          <Text style={styles.activityActionPrompt}>
                            Tap for details →
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Mark Day Complete Button */}
              <TouchableOpacity
                style={styles.completeDayButton}
                activeOpacity={0.85}
                onPress={async () => {
                  try {
                    const response = await api.post('/api/v1/activities/complete', {
                      day: selectedDay,
                    });
                    if (response.data?.success) {
                      setStreak(response.data.data.newStreak);
                    }
                  } catch (e) {
                    console.error('Failed to mark complete', e);
                  }
                }}
              >
                <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.completeDayButtonText}>Mark Day as Complete</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 110 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  spiritualHeader: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 16,
    color: '#0F766E',
    fontWeight: '700',
    marginLeft: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakBadgeText: {
    color: '#B45309',
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 6,
  },
  sacredEmblemWrapper: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  sacredEmblemCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  ribbonWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  ribbonBanner: {
    backgroundColor: '#831843',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#831843',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  ribbonSmallText: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  ribbonMonthText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  sincereCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#99F6E4',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sincereText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
  },
  floatingProgressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '900',
    color: '#BE185D',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#BE185D',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  daySelectorContainer: {
    marginBottom: 24,
  },
  dayScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayBox: {
    width: 66,
    height: 84,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '900',
  },
  statusIconContainer: {
    marginTop: 4,
  },
  lockedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  lockedIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  lockedTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
  },
  lockedSubtitle: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 19,
  },
  activitiesSection: {
    paddingHorizontal: 20,
  },
  activityCardWrapper: {
    marginBottom: 30,
    position: 'relative',
    paddingTop: 14,
  },
  dateBadgePillWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  dateBadgePill: {
    backgroundColor: '#475569',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  dateBadgePillText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    padding: 16,
    paddingTop: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#7C2D12',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  activityBannerImage: {
    width: '100%',
    height: '100%',
  },
  completedTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  completedTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  activityCardFooter: {
    marginTop: 12,
  },
  activityNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  activityMetaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  activityActionPrompt: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#BE185D',
  },
  completeDayButton: {
    flexDirection: 'row',
    backgroundColor: '#1E1B4B',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  completeDayButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
