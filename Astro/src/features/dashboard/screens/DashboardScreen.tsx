import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '~/shared/theme';

import { DashboardHeader } from '../components/DashboardHeader';
import { TeamBanner } from '../components/TeamBanner';
import { BabyGrowthCard } from '../components/BabyGrowthCard';
import { QuickToolsSection } from '../components/QuickToolsSection';
import { CourseGrid } from '../components/CourseGrid';
import { UsersExperience } from '../components/UsersExperience';
import { TrustSection } from '../components/TrustSection';
import { RecentBabies } from '../components/RecentBabies';
import { VideoBanner } from '../components/VideoBanner';
import { Dignitaries } from '../components/Dignitaries';
import { WhyAstroBabyVideo } from '../components/WhyAstroBabyVideo';

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
