import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image as RNImage,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, CheckCircle2, PlayCircle, BookOpen, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { pastelPalette } from '~/shared/theme';

const { width } = Dimensions.get('window');

// Active Subscribed Program (Garbh Sanskar)
const PROGRAM = {
  id: 'garbh_sanskar',
  title: 'Garbh Sanskar',
  category: 'During Pregnancy',
  subtitle: 'Positive Pregnancy Program',
  bullets: [
    '• Daily Vedic Mantras & Meditation',
    '• Trimester-Specific Nutrition Plans',
    '• 1-on-1 Doctor & Coach Guidance',
  ],
  color: pastelPalette.softCoralRose, // Gentle pastel rose (#DE6B81)
  image: require('../../../assets/programs/garbh_sanskar.jpg'),
  progress: 35, // percentage
};

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Morning Yognidra',
    duration: '15 mins',
    tag: 'Mental Calmness',
    bullets: ['• Deep relaxation', '• Stress release'],
    completed: true,
  },
  {
    id: '2',
    title: 'Brainopedia Music Therapy',
    duration: '20 mins',
    tag: 'Classical Raagas',
    bullets: ['• Raag Yaman', '• Brain stimulation'],
    completed: false,
  },
  {
    id: '3',
    title: 'Garbh Samvaad',
    duration: '10 mins',
    tag: 'Bonding Talk',
    bullets: ['• Heart-to-heart with baby', '• Positive affirmations'],
    completed: false,
  },
];

export const SubscribedScreen = () => {
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleOpenLibrary = () => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate('Course', { courseId: PROGRAM.id });
    } else {
      navigation.navigate('Course', { courseId: PROGRAM.id });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Screen Header */}
        <View style={styles.screenHeader}>
          <Text style={styles.headerTitle}>My Learning Space</Text>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>ACTIVE SUBSCRIBER</Text>
          </View>
        </View>

        {/* Clean Minimal Program Card Container */}
        <View style={styles.programCard}>
          {/* Top Banner Row with Category Badge Pill & Title */}
          <View style={styles.programHeaderRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{PROGRAM.category}</Text>
            </View>
            <View style={styles.sparkleBadge}>
              <Sparkles size={14} color={PROGRAM.color} />
            </View>
          </View>

          <View style={styles.programRow}>
            <View style={styles.programInfoCol}>
              <Text style={styles.programTitle}>{PROGRAM.title}</Text>
              <Text style={styles.programSubtitle}>{PROGRAM.subtitle}</Text>

              {/* Concise 2-3 Bullet Points */}
              <View style={styles.bulletsBox}>
                {PROGRAM.bullets.map((bullet, idx) => (
                  <Text key={idx} style={styles.bulletText}>
                    {bullet}
                  </Text>
                ))}
              </View>
            </View>

            <RNImage
              source={PROGRAM.image}
              style={styles.programThumb}
              resizeMode="cover"
            />
          </View>

          {/* Gentle Pastel Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Overall Completion</Text>
              <Text style={styles.progressPercent}>{PROGRAM.progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${PROGRAM.progress}%`, backgroundColor: pastelPalette.softMutedTeal },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Today's Routine Section */}
        <View style={styles.routineSectionHeader}>
          <Text style={styles.sectionTitle}>Today's Routine</Text>
          <Text style={styles.sectionSubtitle}>Tap card to toggle completed status</Text>
        </View>

        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
            activeOpacity={0.8}
            onPress={() => handleToggleTask(task.id)}
            accessibilityRole="button"
            accessibilityLabel={`${task.title}, ${task.duration}`}
          >
            <View
              style={[
                styles.taskIconBg,
                {
                  backgroundColor: task.completed
                    ? pastelPalette.softMutedTeal
                    : '#F3F4F6',
                },
              ]}
            >
              {task.completed ? (
                <CheckCircle2 size={22} color="#FFFFFF" />
              ) : (
                <PlayCircle size={22} color="#9CA3AF" />
              )}
            </View>

            <View style={styles.taskInfo}>
              <View style={styles.taskTitleRow}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                  ]}
                >
                  {task.title}
                </Text>
                <View style={styles.taskDurationPill}>
                  <Clock size={11} color="#6B7280" />
                  <Text style={styles.taskDurationText}>{task.duration}</Text>
                </View>
              </View>

              {/* Concise 2 Bullet Points for Routine Tasks */}
              <View style={styles.taskBulletsRow}>
                {task.bullets.map((b, i) => (
                  <Text key={i} style={styles.taskBulletItem}>
                    {b}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Open Program Library Button */}
        <TouchableOpacity
          style={styles.libraryButton}
          activeOpacity={0.85}
          onPress={handleOpenLibrary}
          accessibilityRole="button"
          accessibilityLabel="Open Program Library"
        >
          <BookOpen size={18} color={pastelPalette.softCoralRose} style={{ marginRight: 8 }} />
          <Text style={styles.libraryButtonText}>Open Program Library</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Warm screen background
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: -0.3,
  },
  activePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  programCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  programHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: pastelPalette.softCoralRose,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sparkleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  programRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  programInfoCol: {
    flex: 1,
    paddingRight: 12,
  },
  programTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  programSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: pastelPalette.softCoralRose,
    marginBottom: 8,
  },
  bulletsBox: {
    gap: 3,
  },
  bulletText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '500',
  },
  programThumb: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: pastelPalette.softMutedTeal,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  routineSectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#FDFEFE',
    borderColor: '#D1FAE5',
  },
  taskIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  taskTitleCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  taskDurationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  taskDurationText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  taskBulletsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  taskBulletItem: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  libraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: pastelPalette.softCoralRose,
    paddingVertical: 14,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  libraryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: pastelPalette.softCoralRose,
  },
});
