import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Lock, CheckCircle2, Circle, PlayCircle, BookOpen, Music, Sparkles } from 'lucide-react-native';

import { api } from '~/shared/api';

const { width } = Dimensions.get('window');

// Icon Mapper helper
const getIcon = (name: string, size: number, color: string) => {
  switch (name) {
    case 'PlayCircle': return <PlayCircle size={size} color={color} />;
    case 'BookOpen': return <BookOpen size={size} color={color} />;
    case 'CheckCircle2': return <CheckCircle2 size={size} color={color} />;
    case 'Music': return <Music size={size} color={color} />;
    default: return <Sparkles size={size} color={color} />;
  }
};

export const ActivityScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [selectedDay, setSelectedDay] = useState(28);
  const [days, setDays] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await api.get('/api/v1/activities/daily');
        if (response.data.success) {
          setDays(response.data.data.days);
          setActivities(response.data.data.activities);
          setStreak(response.data.data.streak);
          setSelectedDay(response.data.data.selectedDay);
        }
      } catch (error) {
        console.error('Failed to fetch daily journey:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJourney();
  }, []);

  const currentDayInfo = days.find(d => d.day === selectedDay);
  const isLocked = currentDayInfo?.status === 'locked';
  
  const completedCount = activities.filter(a => a.completed).length;
  const totalCount = activities.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#1E1B4B', fontWeight: 'bold' }}>Loading your journey...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        <View style={styles.heroContainer}>
          <RNImage source={require('../../../assets/programs/garbh_sanskar.jpg')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <SafeAreaView>
              <View style={styles.headerTitleRow}>
                <Text style={styles.heroHeader}>Daily Journey</Text>
                <View style={styles.streakBadge}>
                  <Sparkles size={14} color="#F59E0B" />
                  <Text style={styles.streakText}>{streak} Day Streak!</Text>
                </View>
              </View>
              <Text style={styles.heroSubtitle}>Consistent efforts create miracles</Text>
            </SafeAreaView>
          </View>
        </View>

        <View style={styles.contentContainer}>
          
          <View style={styles.floatingProgressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressSubtext}>{completedCount} of {totalCount} activities completed</Text>
          </View>

          <View style={styles.daySelectorContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScrollContent}>
              {days.map((item) => {
                const isSelected = selectedDay === item.day;
                const isCompleted = item.status === 'completed';
                const isToday = item.status === 'today';
                const isItemLocked = item.status === 'locked';

                let bgColor = '#FFFFFF';
                let textColor = '#6B7280';
                let borderColor = '#F3F4F6';

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
                    <Text style={[styles.dayLabel, { color: isSelected ? '#9CA3AF' : '#9CA3AF' }]}>{item.label}</Text>
                    <Text style={[styles.dayNumber, { color: textColor }]}>{item.day}</Text>
                    
                    <View style={styles.statusIconContainer}>
                      {isCompleted && <CheckCircle2 size={16} color={isSelected ? '#10B981' : '#10B981'} />}
                      {isItemLocked && <Lock size={14} color="#D1D5DB" />}
                      {isToday && !isCompleted && <Circle size={14} color={isSelected ? '#FFFFFF' : '#EC4899'} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {isLocked ? (
            <View style={styles.lockedContainer}>
              <View style={styles.lockedIconCircle}>
                <Lock size={32} color="#9CA3AF" />
              </View>
              <Text style={styles.lockedTitle}>Day {selectedDay} is Locked</Text>
              <Text style={styles.lockedSubtitle}>Complete today's activities to unlock the next day's journey.</Text>
            </View>
          ) : (
            <View style={styles.timelineWrapper}>
              
              <Text style={styles.sectionTitle}>Activities for Day {selectedDay}</Text>

              {activities.map((activity, index) => {
                const isLast = index === activities.length - 1;
                return (
                  <View key={activity.id} style={styles.timelineRow}>
                    
                    <View style={styles.timelineIndicator}>
                      <View style={[
                        styles.timelineDot, 
                        { backgroundColor: activity.completed ? activity.color : '#FFFFFF', borderColor: activity.color }
                      ]}>
                        {activity.completed && <CheckCircle2 size={12} color="#FFFFFF" />}
                      </View>
                      {!isLast && <View style={[styles.timelineLine, { backgroundColor: activity.completed ? activity.color + '50' : '#E5E7EB' }]} />}
                    </View>

                    <TouchableOpacity 
                      style={[styles.activityCard, activity.completed && styles.activityCardCompleted]} 
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('ActivityDetail', { id: activity.id })}
                    >
                      
                      <View style={[styles.activityIconWrapper, { backgroundColor: activity.color }]}>
                        {getIcon(activity.iconName, 20, '#FFF')}
                      </View>

                      <View style={styles.activityInfo}>
                        <Text style={[styles.activityTitle, activity.completed && styles.activityTitleCompleted]}>
                          {activity.title}
                        </Text>
                        <View style={styles.activityMetaRow}>
                          <Text style={styles.activityType}>{activity.type}</Text>
                          <Text style={styles.dotSeparator}>•</Text>
                          <Text style={styles.activityDuration}>{activity.duration}</Text>
                        </View>
                      </View>

                      <View style={styles.checkboxContainer}>
                        {activity.completed ? (
                          <CheckCircle2 size={24} color={activity.color} />
                        ) : (
                          <Circle size={24} color="#D1D5DB" />
                        )}
                      </View>

                    </TouchableOpacity>
                  </View>
                );
              })}

              <TouchableOpacity 
                style={styles.completeDayButton}
                onPress={async () => {
                  try {
                    const response = await api.post('/api/v1/activities/complete', { day: selectedDay });
                    if (response.data.success) {
                      setStreak(response.data.data.newStreak);
                      // In a real app we'd refetch or update local state for the activities too
                    }
                  } catch (e) {
                    console.error("Failed to mark complete", e);
                  }
                }}
              >
                <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.completeDayButtonText}>Mark Day as Complete</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 120 }} /> 
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  heroContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  heroHeader: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  streakText: {
    color: '#F59E0B',
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 6,
  },
  heroSubtitle: {
    color: '#E5E7EB',
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40,
  },
  floatingProgressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -30,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EC4899',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  daySelectorContainer: {
    marginBottom: 32,
  },
  dayScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  dayBox: {
    width: 68,
    height: 88,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  statusIconContainer: {
    marginTop: 6,
  },
  lockedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  lockedIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 8,
  },
  lockedSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  timelineWrapper: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E1B4B',
    marginBottom: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIndicator: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -16, 
    zIndex: 1,
  },
  activityCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  activityCardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
    shadowOpacity: 0,
  },
  activityIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityTitleCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  activityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityType: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#D1D5DB',
  },
  activityDuration: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  completeDayButton: {
    flexDirection: 'row',
    backgroundColor: '#1E1B4B',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  completeDayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
