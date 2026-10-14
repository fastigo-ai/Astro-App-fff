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
import { IntroVideoScreen } from '~/features/onboarding/screens/IntroVideoScreen';
import { NotificationScreen } from '~/features/dashboard/screens/NotificationScreen';
import { SubscriptionDetailsScreen } from '~/features/subscription/screens/SubscriptionDetailsScreen';
import { AllProgramsScreen } from '~/features/dashboard/screens/AllProgramsScreen';
import { PrivacyPolicyScreen } from '~/features/about/screens/PrivacyPolicyScreen';
import { TermsConditionsScreen } from '~/features/about/screens/TermsConditionsScreen';
import { GiftRedeemScreen } from '~/features/dashboard/screens/GiftRedeemScreen';
import { ActivityDetailScreen } from '~/features/dashboard/screens/ActivityDetailScreen';
import { ReviewsScreen } from '~/features/dashboard/screens/ReviewsScreen';
import { BabyBumpScreen } from '~/features/dashboard/screens/BabyBumpScreen';
import { KickCounterScreen } from '~/features/interactions/screens/KickCounterScreen';
import { MoodTherapyScreen } from '~/features/interactions/screens/MoodTherapyScreen';
import { GarbhSamvadScreen } from '~/features/interactions/screens/GarbhSamvadScreen';

import { useAuthStore } from '~/store/useAuthStore';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  const hasLanguage = useAuthStore(state => state.hasLanguage);
  const hasProfile = useAuthStore(state => state.hasProfile);
  const hasLifeStage = useAuthStore(state => state.hasLifeStage);
  const hasSeenPricing = useAuthStore(state => state.hasSeenPricing);
  const hasSeenIntro = useAuthStore(state => state.hasSeenIntro);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasLanguage ? (
        <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      ) : !hasProfile ? (
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      ) : !hasLifeStage ? (
        <Stack.Screen name="LifeStage" component={LifeStageScreen} />
      ) : !hasSeenPricing ? (
        <Stack.Screen name="Pricing" component={PricingScreen} />
      ) : !hasSeenIntro ? (
        <Stack.Screen name="IntroVideo" component={IntroVideoScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name="Pricing" 
            component={PricingScreen} 
            options={{ presentation: 'fullScreenModal' }}
          />
          <Stack.Screen name="LifeStage" component={LifeStageScreen} />
          <Stack.Screen name="IntroVideo" component={IntroVideoScreen} />
          <Stack.Screen name="AllPrograms" component={AllProgramsScreen} />
          <Stack.Screen name="Course" component={CourseScreen} />
          <Stack.Screen name="Garbhadhaan" component={GarbhadhaanScreen} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="AboutUs" component={AboutScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetailsScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
          <Stack.Screen 
            name="GiftRedeem" 
            component={GiftRedeemScreen} 
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="ActivityDetail" 
            component={ActivityDetailScreen} 
            options={{ presentation: 'fullScreenModal' }}
          />
          <Stack.Screen 
            name="Reviews" 
            component={ReviewsScreen} 
          />
          <Stack.Screen 
            name="BabyBump" 
            component={BabyBumpScreen} 
          />
          <Stack.Screen 
            name="KickCounter" 
            component={KickCounterScreen} 
          />
          <Stack.Screen 
            name="MoodTherapy" 
            component={MoodTherapyScreen} 
          />
          <Stack.Screen 
            name="GarbhSamvad" 
            component={GarbhSamvadScreen} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

