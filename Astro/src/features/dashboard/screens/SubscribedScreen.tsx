import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image as RNImage,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, CheckCircle2, PlayCircle, BookOpen, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mocked Subscribed Program (Garbh Sanskar)
const PROGRAM = {
  id: 'garbh_sanskar',
  title: 'Garbh Sanskar',
  subtitle: 'Positive Pregnancy',
  description: 'Your beautiful journey of motherhood continues. Stay consistent with your daily practices for a blissful experience.',
  color: '#65A30D',
  image: require('../../../assets/programs/garbh_sanskar.jpg'),
  progress: 35, // percentage
};

const TODAY_TASKS = [
  { id: '1', title: 'Morning Yognidra', duration: '15 mins', completed: true },
  { id: '2', title: 'Brainopedia Music Therapy', duration: '20 mins', completed: false },
  { id: '3', title: 'Garbh Samvaad', duration: '10 mins', completed: false },
];

export const SubscribedScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        <View style={styles.heroContainer}>
          <RNImage source={PROGRAM.image} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <SafeAreaView>
              <Text style={styles.heroHeader}>Active Program</Text>
            </SafeAreaView>
          </View>
        </View>

        <View style={styles.contentContainer}>
          
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>{PROGRAM.title}</Text>
              <Text style={[styles.subtitle, { color: PROGRAM.color }]}>{PROGRAM.subtitle}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: PROGRAM.color + '20' }]}>
              <Sparkles size={16} color={PROGRAM.color} />
            </View>
          </View>
          
          <Text style={styles.description}>{PROGRAM.description}</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Course Progress</Text>
              <Text style={styles.progressPercent}>{PROGRAM.progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${PROGRAM.progress}%`, backgroundColor: PROGRAM.color }]} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Today's Routine</Text>
          
          {TODAY_TASKS.map((task, index) => (
            <TouchableOpacity key={task.id} style={styles.taskCard} activeOpacity={0.8}>
              <View style={[styles.taskIconBg, { backgroundColor: task.completed ? PROGRAM.color : '#F3F4F6' }]}>
                {task.completed ? (
                  <CheckCircle2 size={24} color="#FFF" />
                ) : (
                  <PlayCircle size={24} color="#9CA3AF" />
                )}
              </View>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
                <View style={styles.taskMetaRow}>
                  <Clock size={12} color="#9CA3AF" />
                  <Text style={styles.taskDuration}>{task.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={[styles.libraryButton, { borderColor: PROGRAM.color }]}>
            <BookOpen size={20} color={PROGRAM.color} style={{ marginRight: 8 }} />
            <Text style={[styles.libraryButtonText, { color: PROGRAM.color }]}>Open Program Library</Text>
          </TouchableOpacity>

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
    height: 300,
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heroHeader: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E1B4B',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 32,
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  taskIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDuration: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  libraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
  },
  libraryButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
