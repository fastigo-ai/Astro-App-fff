import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '~/shared/theme';

import { DashboardHeader } from '../components/DashboardHeader';
import { MomQuickAccessBar } from '../components/MomQuickAccessBar';
import { BabyDailyGrowthTracker } from '../components/BabyDailyGrowthTracker';
import { PregnancyPowerPack } from '../components/PregnancyPowerPack';
import { KrishnaDailyVedicActivities } from '../components/KrishnaDailyVedicActivities';
import { KrishnaLiveMasterclassBanner } from '../components/KrishnaLiveMasterclassBanner';
import { QuickToolsSection } from '../components/QuickToolsSection';
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
        {/* 0. 1-Tap Zero-Scroll Quick Tools Bar (Approach A) */}
        <MomQuickAccessBar />

        {/* 1. Baby Daily Growth Tracker (Fruit comparison, days left, Baby Says letter from womb) */}
        <BabyDailyGrowthTracker />

        {/* 2. Today's Vedic Routine / Daily Sanskar Activities */}
        <KrishnaDailyVedicActivities />

        {/* 3. Maa & Baby Daily Connect (Common Mom Support Tools: Kick Counter, Samvad, Bump, Puzzles, Mood, Kundli) */}
        <QuickToolsSection />

        {/* 4. Live Doctor Masterclass Banner */}
        <KrishnaLiveMasterclassBanner />

        {/* 5. Pregnancy Power Pack (Course-Unlocked Premium Tools: Food Safety, Weight, Dadi Nuskha, Doctor School, Music, Guide) */}
        <PregnancyPowerPack />
        
        <WhyAstroBabyVideo />

        <UsersExperience />
        <TrustSection />
        <RecentBabies />
        <VideoBanner />
        <Dignitaries />

        {/* 7. Home Screen FAQs */}
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
