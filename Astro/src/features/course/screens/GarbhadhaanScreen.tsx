import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  CourseFeatureGrid,
  CourseFeature,
} from '../components/CourseFeatureGrid';
import { CourseFeatureModal } from '../components/CourseFeatureModal';
import { CourseBannerCarousel } from '../components/CourseBannerCarousel';

const FEATURES_DATA: CourseFeature[] = [
  { id: '1', title: 'Suitable Intercourse Dates', description: 'Our sages researched every dimension of human life and saw it from the point of view of science, yoga, Ayurveda, vastu, and raga are its results. You will be surprised to know that if you are planning a baby, then after how many days after menstruation, having intercourse will give birth to a divine child with superior qualities; it is all certain.\n\nAuspicious dates of conception by astrologers are decided after calculating your zodiac, the date of menstruation and the positions of the constellations, etc., it is told to you.' },
  { id: '2', title: 'Isht Mantra', description: 'Personalized mantra to chant.' },
  { id: '3', title: 'Garbhadhaan Sanskar', description: 'Traditional ceremony guidance.' },
  { id: '4', title: 'Guided Garbhadhaan...', description: 'Step by step guided process.' },
  { id: '5', title: 'Daily Evening Prayer', description: 'Prayers for daily evening.' },
  { id: '6', title: 'Garbhadhaan Special...', description: 'Special activities and more.' },
  { id: '7', title: 'Sankalp', description: 'Intention setting practice.' },
  { id: '8', title: 'Nutritionist Assistance', description: 'Expert diet advice.' },
  { id: '9', title: 'Gynecologist Assistance', description: 'Medical expert assistance.' },
  { id: '10', title: 'Realtime Support (on WhatsApp)', description: 'WhatsApp support group.' },
  { id: '11', title: "Vipin Joshi Sir's special Sessions", description: 'Special live sessions.' },
];

export const GarbhadhaanScreen: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<CourseFeature | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Scrollable Top Banner */}
        <CourseBannerCarousel />

        {/* Main White Content Card */}
        <View style={styles.mainWhiteCard}>
          
          {/* Tabs Area */}
          <View style={styles.tabsRow}>
            {/* Tab 1 */}
            <View style={styles.tabCard}>
              <Text style={styles.tabTitleText}>Why plan{'\n'}for your baby{'\n'}from today</Text>
              <Text style={styles.bgQuestionMark}>?</Text>
              <TouchableOpacity style={styles.tabButton}>
                <Text style={styles.tabButtonText}>Tap to Read ⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Divider Line */}
            <View style={styles.tabDivider} />

            {/* Tab 2 */}
            <View style={styles.tabCard}>
              <Text style={styles.tabTitleText}>Krishna-Coming,{'\n'}how will{'\n'}it be helpful?</Text>
              <Text style={styles.bgQuestionMark}>?</Text>
              <TouchableOpacity style={styles.tabButton}>
                <Text style={styles.tabButtonText}>Tap to Read ⌄</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features Section */}
          <Text style={styles.featuresSectionTitle}>Features of this course</Text>
          <CourseFeatureGrid
            features={FEATURES_DATA}
            onReadMore={feature => setSelectedFeature(feature)}
          />

          <Text style={styles.subscribeHint}>
            To subscribe to this course, go to the pricing section.
          </Text>
        </View>

        {/* Live Sessions Banner */}
        <View style={styles.liveSessionsWrapper}>
          <View style={styles.liveSessionBadge}>
            <Text style={styles.liveSessionBadgeText}>Live Sessions</Text>
          </View>
          <View style={styles.liveSessionCard}>
            <Image source={require('~/assets/images/baby_cute.png')} style={styles.liveSessionImagePlaceholder} />
            <View style={styles.liveSessionContent}>
              <View style={styles.liveIndicator}>
                <Text style={styles.liveIndicatorText}>((•)) LIVE</Text>
              </View>
              <Text style={styles.liveSessionTitle}>Meditation{'\n'}Session</Text>
              <Text style={styles.liveSessionSubtitle}>For a Safe Pregnancy</Text>
            </View>
          </View>
        </View>

        {/* Users Experience */}
        <View style={styles.usersExperienceSection}>
          <Image
            source={require('~/assets/images/family_collage.png')}
            style={styles.collageImage}
            resizeMode="cover"
          />
          <View style={styles.usersExperienceOverlay}>
            <Text style={styles.usersExperienceText}>USERS EXPERIENCE</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Feature Details Modal */}
      <CourseFeatureModal
        visible={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        title={selectedFeature?.title || ''}
        content={selectedFeature?.description || ''}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Soft blue/grey base
  },
  container: {
    flex: 1,
  },
  bannerContainer: {
    height: 220,
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerBgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    paddingTop: 10,
  },
  freeBadge: {
    backgroundColor: '#00BFA5', // Vibrant teal
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0F2F1',
    marginBottom: 10,
    marginTop: -5,
  },
  freeBadgeText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  bannerTextSection: {
    flex: 1,
  },
  bannerClassText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bannerMiraculousText: {
    fontSize: 28,
    color: '#111',
    fontWeight: '300',
    marginTop: 4,
  },
  bannerPregnancyText: {
    fontSize: 34,
    color: '#4A90E2', // Blue to match Garbhadhaan theme
    fontWeight: '900',
  },
  bannerAuthorText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  bannerImageSection: {
    width: 120,
    alignItems: 'center',
  },
  mentorRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#d4af37', // Gold ring
    overflow: 'hidden',
  },
  mentorImage: {
    width: '100%',
    height: '100%',
  },
  viewDetailsButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 15,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewDetailsText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  mainWhiteCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 15,
    marginHorizontal: 15,
    paddingBottom: 30,
    overflow: 'hidden',
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 30,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  tabCard: {
    flex: 1,
    position: 'relative',
    paddingRight: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabDivider: {
    width: 0, // removed divider since we have cards now
  },
  tabTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    minHeight: 50,
  },
  bgQuestionMark: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    fontSize: 50,
    color: '#F0F4F8',
    fontWeight: 'bold',
    zIndex: 1,
  },
  tabButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    zIndex: 2,
  },
  tabButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuresSectionTitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  subscribeHint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  liveSessionsWrapper: {
    marginTop: 30,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  liveSessionBadge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 2,
    marginBottom: -15,
  },
  liveSessionBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  liveSessionCard: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  liveSessionImagePlaceholder: {
    width: 140,
    height: '100%',
    resizeMode: 'cover',
  },
  liveSessionContent: {
    flex: 1,
    backgroundColor: '#E3F2FD', // light blue
    padding: 15,
    justifyContent: 'center',
  },
  liveIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF3B30', // standard live red
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveIndicatorText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveSessionTitle: {
    color: '#111',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
  },
  liveSessionSubtitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  usersExperienceSection: {
    marginTop: 30,
    marginHorizontal: 15,
    height: 250,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  collageImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  usersExperienceOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: '#e5e5e5',
  },
  usersExperienceText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3b4371',
    letterSpacing: 2,
  },
});
