import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  PhoneEntry: undefined;
  OtpVerification: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  LanguageSelection: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Subscribed: undefined;
  Activity: undefined;
  InProgress: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  LifeStage: undefined;
  IntroVideo: undefined;
  LanguageSelect: undefined;
  ProfileSetup: undefined;
  Pricing: undefined;
  Course: undefined;
  Garbhadhaan: undefined;
  ProfileSettings: undefined;
  Contact: undefined;
  AboutUs: undefined;
  Notifications: undefined;
  SubscriptionDetails: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  AllPrograms: undefined;
  GiftRedeem: undefined;
  ActivityDetail: { id: string };
  Reviews: undefined;
  BabyBump: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<AppStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
