import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image as RNImage,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, Clock, CalendarDays, ChevronRight, PlayCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FILTERS = ['Today', 'Upcoming', 'Recorded'];

const UPCOMING_CLASSES = [
  {
    id: '1',
    time: '10:00 AM',
    duration: '45m',
    title: 'Garbh Samvaad Masterclass',
    expert: 'Dr. Rukmani (Sr. Gynecologist)',
    color: '#EC4899', // Pink
    type: 'Zoom Live',
  },
  {
    id: '2',
    time: '04:30 PM',
    duration: '30m',
    title: 'Pregnancy Yoga & Stretching',
    expert: 'Aarti Sharma (Yoga Expert)',
    color: '#3B82F6', // Blue
    type: 'Zoom Live',
  },
  {
    id: '3',
    time: '07:00 PM',
    duration: '60m',
    title: 'Nutrition for 3rd Trimester',
    expert: 'Dt. Neha Gupta',
    color: '#65A30D', // Green
    type: 'Interactive',
  }
];

export const ClassesScreen = () => {
  const [activeFilter, setActiveFilter] = useState('Today');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Sessions</Text>
        <Text style={styles.headerSubtitle}>Join our experts on Zoom</Text>
      </View>

      <View style={styles.filterContainer}>
        {FILTERS.map((filter) => (
          <TouchableOpacity 
            key={filter} 
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Next Up</Text>
        <View style={styles.heroCard}>
          <RNImage source={require('../../../assets/images/team_photo.png')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <View style={styles.liveBadge}>
              <View style={styles.redDot} />
              <Text style={styles.liveBadgeText}>STARTS IN 15 MINS</Text>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Ayurvedic Diet & Lifestyle</Text>
              <Text style={styles.heroExpert}>with Dr. Vasant Lad</Text>
              
              <TouchableOpacity style={styles.joinButton} activeOpacity={0.9}>
                <Video size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.joinButtonText}>Join Zoom Class</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.scheduleHeaderRow}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <CalendarDays size={16} color="#EC4899" style={{ marginRight: 6 }} />
            <Text style={styles.calendarButtonText}>Sync to Calendar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timelineContainer}>
          {UPCOMING_CLASSES.map((cls, index) => (
            <View key={cls.id} style={styles.timelineRow}>
              
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{cls.time}</Text>
                <Text style={styles.durationText}>{cls.duration}</Text>
              </View>

              <View style={styles.lineColumn}>
                <View style={[styles.timelineDot, { borderColor: cls.color }]} />
                {index !== UPCOMING_CLASSES.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.classCard}>
                <View style={styles.classCardHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: cls.color + '15' }]}>
                    <Text style={[styles.typeText, { color: cls.color }]}>{cls.type}</Text>
                  </View>
                </View>
                <Text style={styles.classTitle}>{cls.title}</Text>
                <Text style={styles.classExpert}>{cls.expert}</Text>
                
                <TouchableOpacity style={styles.remindButton}>
                  <Clock size={14} color="#6B7280" style={{ marginRight: 6 }} />
                  <Text style={styles.remindButtonText}>Set Reminder</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>

        <View style={{ height: 120 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E1B4B',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  heroCard: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    justifyContent: 'space-between',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  heroContent: {
    marginTop: 'auto',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroExpert: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  calendarButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EC4899',
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingTop: 4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  durationText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  lineColumn: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    position: 'absolute',
    top: 20,
    bottom: -20,
    zIndex: 1,
  },
  classCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  classExpert: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  remindButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  remindButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
});
