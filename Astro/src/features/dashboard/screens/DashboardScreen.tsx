import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '~/shared/theme';

import { DashboardHeader } from '../components/DashboardHeader';
import { TeamBanner } from '../components/TeamBanner';
import { KrishnaLiveMasterclassBanner } from '../components/KrishnaLiveMasterclassBanner';
import { KrishnaPillarsGrid } from '../components/KrishnaPillarsGrid';
import { KrishnaDailyVedicActivities } from '../components/KrishnaDailyVedicActivities';
import { BabyDailyGrowthTracker } from '../components/BabyDailyGrowthTracker';
import { PregnancyPowerPack } from '../components/PregnancyPowerPack';
import { BabyGrowthCard } from '../components/BabyGrowthCard';
import { QuickToolsSection } from '../components/QuickToolsSection';
import { CourseGrid } from '../components/CourseGrid';
import { UsersExperience } from '../components/UsersExperience';
import { TrustSection } from '../components/TrustSection';
import { RecentBabies } from '../components/RecentBabies';
import { VideoBanner } from '../components/VideoBanner';
import { Dignitaries } from '../components/Dignitaries';
import { WhyAstroBabyVideo } from '../components/WhyAstroBabyVideo';
import { DashboardFaqSection } from '../components/DashboardFaqSection';

import { useScrollStore } from '~/store/useScrollStore';

export const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>
      <DashboardHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => useScrollStore.getState().setScrollY(e.nativeEvent.contentOffset.y)}
      >

        <TeamBanner />

        {/* Krishna Coming Live Masterclass Banner */}
        <KrishnaLiveMasterclassBanner />

        {/* Krishna Coming 4 Primary Vedic Pillars (2x2 Grid) */}
        <KrishnaPillarsGrid />

        {/* Baby Daily Growth Tracker (Image 2: Fruit comparison, days left, Baby Says letter from womb) */}
        <BabyDailyGrowthTracker />

        {/* Pregnancy Power Pack (Image 3: Essential Maternity & Vedic Tools) */}
        <PregnancyPowerPack />

        {/* Krishna Coming Daily Vedic Activities Routine */}
        <KrishnaDailyVedicActivities />

        {/* Baby Growth / Pregnancy Progress Card */}
        <BabyGrowthCard />

        {/* Daily Essentials (Baby Bump, Om, Games) */}
        <QuickToolsSection />

        <CourseGrid />
        
        <WhyAstroBabyVideo />

        <UsersExperience />
        <TrustSection />
        <RecentBabies />
        <VideoBanner />
        <Dignitaries />

        {/* Home Screen FAQs at the very end */}
        <DashboardFaqSection />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    backgroundColor: '#FAF9F6', // Soft, warm creamy off-white to match the ethereal image
    paddingTop: 16, 
    paddingBottom: 100,
  },

});
