import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Text } from 'react-native';
import { theme } from '~/shared/theme';

import { DashboardHeader } from '../components/DashboardHeader';
import { SideMenu } from '../components/SideMenu';
import { TeamBanner } from '../components/TeamBanner';
import { CourseGrid } from '../components/CourseGrid';
import { UsersExperience } from '../components/UsersExperience';
import { TrustSection } from '../components/TrustSection';
import { RecentBabies } from '../components/RecentBabies';
import { VideoBanner } from '../components/VideoBanner';
import { Dignitaries } from '../components/Dignitaries';

export const DashboardScreen = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader onOpenMenu={() => setIsMenuVisible(true)} />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        <TeamBanner />
        <CourseGrid />
        <UsersExperience />
        <TrustSection />
        <RecentBabies />
        <VideoBanner />
        <Dignitaries />
      </ScrollView>
      <SideMenu key="side-menu-v3" visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  scrollContainer: {
    backgroundColor: '#F8F9FA', 
    paddingBottom: 100, 
  },

});
