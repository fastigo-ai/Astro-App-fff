import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { PricingScreen } from '~/features/subscription/screens/PricingScreen';
import { CourseScreen } from '~/features/course/screens/CourseScreen';
import { GarbhadhaanScreen } from '~/features/course/screens/GarbhadhaanScreen';
import { ProfileSettingsScreen } from '~/features/profile/screens/ProfileSettingsScreen';
import { ContactScreen } from '~/features/contact/screens/ContactScreen';
import { AboutScreen } from '~/features/about/screens/AboutScreen';
import { LanguageSelectScreen } from '~/features/auth/screens/LanguageSelectScreen';
import { ProfileSetupScreen } from '~/features/auth/screens/ProfileSetupScreen';
import { LifeStageScreen } from '~/features/auth/screens/LifeStageScreen';
import { NotificationScreen } from '~/features/dashboard/screens/NotificationScreen';
import { SubscriptionDetailsScreen } from '~/features/subscription/screens/SubscriptionDetailsScreen';

import { useAuthStore } from '~/store/useAuthStore';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  const hasLanguage = useAuthStore(state => state.hasLanguage);
  const hasProfile = useAuthStore(state => state.hasProfile);
  const hasLifeStage = useAuthStore(state => state.hasLifeStage);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasLanguage ? (
        <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      ) : !hasProfile ? (
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      ) : !hasLifeStage ? (
        <Stack.Screen name="LifeStage" component={LifeStageScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name="Pricing" 
            component={PricingScreen} 
            options={{ presentation: 'fullScreenModal' }}
          />
          <Stack.Screen name="Course" component={CourseScreen} />
          <Stack.Screen name="Garbhadhaan" component={GarbhadhaanScreen} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="AboutUs" component={AboutScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetailsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

