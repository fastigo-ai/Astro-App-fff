import React from 'react';
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

import { useNavigation } from '@react-navigation/native';
import { CourseBannerCarousel } from '../components/CourseBannerCarousel';

const GARBH_SANSKAR_BANNERS = [
  { 
    id: '1', 
    title: 'Garbh Sanskar Journey', 
    subtitle: 'From conception to a blissful motherhood',
    image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&h=400&fit=crop'
  },
  { 
    id: '2', 
    title: 'Positive Pregnancy', 
    subtitle: 'Daily activities for a healthy, happy child',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=400&fit=crop'
  },
  { 
    id: '3', 
    title: 'Yoga & Meditation', 
    subtitle: 'Expert-led sessions for your well-being',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=400&fit=crop'
  },
];

const { width } = Dimensions.get('window');

export const CourseScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Garbh Sanskar</Text>
          <View style={styles.headerSubtitleContainer}>
            <Text style={styles.headerSubtitle}>में से माँ तक की आनंदमयी यात्रा</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Scrollable Top Banner */}
        <CourseBannerCarousel banners={GARBH_SANSKAR_BANNERS} />

        {/* Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>Pregnancy Month 2 (Free Demo)</Text>
          <View style={styles.dropdownIconContainer}>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCardsRow}>
          <View style={[styles.actionCard, { backgroundColor: '#ff6f91' }]}>
            <Text style={styles.actionCardTitle}>Garbh Sanskar{'\n'}Activities{'\n'}of this Month</Text>
            <Image source={require('~/assets/images/team_photo.png')} style={styles.actionCardLeftImg} resizeMode="contain" />
          </View>
          <View style={[styles.actionCard, { backgroundColor: '#4ba3e3' }]}>
            <Image source={require('~/assets/images/baby_cute.png')} style={styles.actionCardRightImg} resizeMode="contain" />
            <Text style={styles.actionCardTitleRight}>Importance{'\n'}— of —{'\n'}SECOND{'\n'}MONTH{'\n'}in Pregnancy</Text>
          </View>
        </View>

        {/* Demo Features */}
        <View style={styles.demoFeaturesSection}>
          <View style={styles.demoFeaturesHeader}>
            <Text style={styles.demoFeaturesTitle}>Garbh Sanskar Demo Features</Text>
          </View>
          <View style={styles.demoFeaturesList}>
            {[
              { id: '1', title: 'Jeevan Sutra', color: '#4ba3e3' },
              { id: '2', title: 'Garbh\nSanskar Music', color: '#8e44ad' },
              { id: '3', title: 'Garbh\nSanskar', color: '#e74c3c' },
            ].map(item => (
              <View key={item.id} style={styles.demoFeatureItem}>
                <Text style={styles.demoFeatureNumber}>{item.id}</Text>
                <View style={styles.demoFeatureBg}>
                  <Text style={styles.demoFeatureText}>{item.title}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Thought of the Day */}
        <View style={styles.thoughtSection}>
          <View style={styles.thoughtBadge}>
            <Text style={styles.thoughtBadgeText}>Thought of the day</Text>
          </View>
          <View style={styles.thoughtCard}>
            <Text style={styles.thoughtText}>
              <Text style={{ color: '#1a237e', fontWeight: 'bold' }}>प्रकृति</Text> के साथ बिताया हर पल{'\n'}मन को नई <Text style={{ color: '#1a237e', fontWeight: 'bold' }}>शांति</Text> देता है।
            </Text>
            <Text style={styles.thoughtDate}>28th July'26</Text>
          </View>
        </View>

        {/* Live Sessions */}
        <View style={styles.liveSessionSection}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>Live Sessions</Text>
          </View>
          <View style={[styles.bannerCard, { backgroundColor: '#3caea3' }]}>
            <View style={styles.bannerCardLeft}>
              <View style={styles.liveIndicatorPill}>
                <Text style={styles.liveIndicatorText}>🔴 LIVE</Text>
              </View>
              <Text style={styles.bannerCardTitle}>Pregnancy</Text>
              <Text style={styles.bannerCardSubtitle}>YOGA SESSION</Text>
              <View style={styles.batchPill}>
                <Text style={styles.batchPillText}>Batch: Rukmani</Text>
              </View>
              <Text style={styles.batchSubtext}>Only for 4th, 5th & 6th Month Users.</Text>
            </View>
          </View>
        </View>

        {/* Audio */}
        <View style={[styles.bannerCard, { backgroundColor: '#9b59b6', marginTop: 25 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 32 }}>🎧</Text>
            </View>
            <View style={styles.audioContent}>
              <Text style={styles.audioTitle}>Garbh Sanskar</Text>
              <Text style={styles.audioMain}>Audio</Text>
              <Text style={styles.audioSub}>Tap here to listen...</Text>
            </View>
          </View>
        </View>

        {/* Library */}
        <View style={[styles.bannerCard, { backgroundColor: '#f39c12', marginTop: 25 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: 1 }}>LIBRARY</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }}>Access all your resources</Text>
            </View>
            <View style={{ backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}>
              <Text style={{ color: '#f39c12', fontWeight: 'bold', fontSize: 14 }}>Explore ➔</Text>
            </View>
          </View>
        </View>

        {/* Features list */}
        <View style={styles.featuresListSection}>
          <Text style={styles.featuresTitleMain}>Features</Text>
          <View style={styles.featuresContent}>
            <View style={styles.featuresPhoneMockup}>
              <Image source={require('~/assets/images/baby_cute.png')} style={styles.mockupInner} resizeMode="cover" />
            </View>
            <View style={styles.featuresList}>
              {[
                'Art to Live Happy Life',
                'Garbh Sanskar Music',
                'Meditation & Yognidra',
                'Vedic Mantra Vrushti',
                'Supraj Santanotpatti Hawan',
                'Personal Isht Mantra',
                'Punsavan & Simantonayana Sanskar',
              ].map((f, i) => (
                <View key={i} style={styles.featureItemRow}>
                  <Text style={styles.featureItemDot}>✨</Text>
                  <Text style={styles.featureItemText}>{f}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.readMoreBtn}>
                <Text style={styles.readMoreText}>READ MORE...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Users Experience */}
        <View style={styles.experienceSection}>
          <Image source={require('~/assets/images/family_collage.png')} style={styles.experienceBg} resizeMode="cover" />
          <View style={styles.experienceOverlayContainer}>
            <View style={styles.experienceOverlayBox}>
              <Text style={styles.experienceTitle}>USERS EXPERIENCE</Text>
              <View style={styles.experienceSubtitlePill}>
                <Text style={styles.experienceSubtitle}>Changed their lives</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.tapHereBtn}>
              <Text style={styles.tapHereText}>TAP HERE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <View style={styles.faqContent}>
            <Text style={styles.faqTitle}>Frequently</Text>
            <Text style={styles.faqTitle}>Asked Questions</Text>
            <Text style={styles.faqSub}>Tap here to see...</Text>
          </View>
          <View style={styles.faqGraphic}>
            <View style={styles.faqCircle}>
              <Text style={styles.faqQuestionMark}>?</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5F7', // Soft premium pink
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#FFF5F7',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'serif',
    color: '#4a4a4a',
    letterSpacing: 1,
  },
  headerSubtitleContainer: {
    borderWidth: 1,
    borderColor: '#7a7a7a',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#555',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  bannerContainer: {
    height: 240,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerBgImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    padding: 15,
  },
  freeBadge: {
    backgroundColor: '#8bc34a',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
    position: 'absolute',
    top: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  freeBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerContent: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  bannerTextSection: {
    flex: 1,
  },
  bannerClassText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  bannerMiraculousText: {
    fontSize: 26,
    fontFamily: 'serif',
    color: '#333',
    marginVertical: -2,
  },
  bannerPregnancyText: {
    fontSize: 32,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#d81b60',
    marginBottom: 5,
  },
  bannerAuthorText: {
    fontSize: 12,
    color: '#555',
  },
  bannerImageSection: {
    width: 100,
    alignItems: 'center',
  },
  mentorRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#ffd700',
    overflow: 'hidden',
  },
  mentorImage: {
    width: '100%',
    height: '100%',
  },
  viewDetailsButton: {
    backgroundColor: '#900c3f',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  viewDetailsText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 30,
    marginTop: 20,
    height: 45,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    flex: 1,
    textAlign: 'center',
    color: '#555',
    fontWeight: '600',
  },
  dropdownIconContainer: {
    backgroundColor: '#ff4081',
    height: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  dropdownIcon: {
    color: '#FFF',
    fontSize: 12,
  },
  actionCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 20,
  },
  actionCard: {
    width: (width - 45) / 2,
    height: 150,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardLeftImg: {
    position: 'absolute',
    bottom: -10,
    right: -20,
    width: 100,
    height: 100,
    opacity: 0.8,
  },
  actionCardRightImg: {
    position: 'absolute',
    bottom: -10,
    left: -20,
    width: 100,
    height: 100,
    opacity: 0.8,
  },
  actionCardTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    zIndex: 2,
  },
  actionCardTitleRight: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'right',
    zIndex: 2,
  },
  demoFeaturesSection: {
    marginTop: 30,
  },
  demoFeaturesHeader: {
    backgroundColor: '#333',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  demoFeaturesTitle: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  demoFeaturesList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  demoFeatureItem: {
    width: '31%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  demoFeatureNumber: {
    fontSize: 32, 
    fontWeight: '900',
    color: '#FF69B4',
    marginBottom: 8,
  },
  demoFeatureBg: {
    alignItems: 'center',
  },
  demoFeatureText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 11, 
    textAlign: 'center',
  },
  thoughtSection: {
    marginTop: 30,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  thoughtBadge: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    zIndex: 2,
    marginBottom: -10,
  },
  thoughtBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  thoughtCard: {
    backgroundColor: '#e3f2fd',
    width: '100%',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  thoughtText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    lineHeight: 28,
  },
  thoughtDate: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    fontSize: 10,
    color: '#555',
  },
  liveSessionSection: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  liveBadge: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 15, // smoother
    zIndex: 2,
    marginBottom: -14, // adjust overlap perfectly
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  liveBadgeText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
  },
  bannerCard: {
    alignSelf: 'stretch', // instead of width: 100%
    height: 150,
    borderRadius: 20, // softer radius
    padding: 24,
    justifyContent: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  bannerCardLeft: {
    width: '60%',
  },
  liveIndicatorPill: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 5,
  },
  liveIndicatorText: {
    color: '#d32f2f',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerCardTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerCardSubtitle: {
    color: '#FFF',
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 10,
  },
  batchPill: {
    backgroundColor: '#ffb74d',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  batchPillText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  batchSubtext: {
    color: '#FFF',
    fontSize: 10,
    marginTop: 5,
  },
  audioContent: {
    alignItems: 'flex-end',
    width: '100%',
  },
  audioTitle: {
    color: '#FFF',
    fontSize: 16,
  },
  audioMain: {
    color: '#FFF',
    fontSize: 40,
    fontFamily: 'serif',
    fontStyle: 'italic',
    marginVertical: -10,
  },
  audioSub: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 10,
  },
  librarySignContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
    paddingRight: 20,
  },
  libraryChainRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 120,
    marginBottom: -5,
    zIndex: 1,
  },
  libraryChain: {
    width: 2,
    height: 20,
    backgroundColor: '#FFF',
  },
  librarySign: {
    backgroundColor: '#d32f2f',
    width: 140,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  libraryText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  featuresListSection: {
    marginTop: 30,
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  featuresTitleMain: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  featuresContent: {
    flexDirection: 'row',
  },
  featuresPhoneMockup: {
    width: 110,
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 5,
    borderColor: '#1E293B',
    marginRight: 15,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mockupInner: {
    flex: 1,
    borderRadius: 16,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  featuresList: {
    flex: 1,
    justifyContent: 'center',
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureItemDot: {
    fontSize: 10,
    marginRight: 8,
  },
  featureItemText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  readMoreBtn: {
    backgroundColor: '#10B981',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  readMoreText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  experienceSection: {
    marginTop: 30,
    marginHorizontal: 15,
    height: 250,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  experienceBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.6,
  },
  experienceOverlayContainer: {
    alignItems: 'center',
  },
  experienceOverlayBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b4371',
    letterSpacing: 1,
  },
  experienceSubtitlePill: {
    borderWidth: 1,
    borderColor: '#3b4371',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 5,
  },
  experienceSubtitle: {
    fontSize: 12,
    color: '#3b4371',
  },
  tapHereBtn: {
    backgroundColor: '#ff8a65',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#ff8a65',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  tapHereText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  faqSection: {
    marginTop: 30,
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqContent: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 18,
    color: '#555',
    fontWeight: '400',
  },
  faqSub: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
  faqGraphic: {
    width: 100,
    height: 100,
    backgroundColor: '#e1f5fe',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#81d4fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqQuestionMark: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
