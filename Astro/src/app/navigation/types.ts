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
  LiveSessions: undefined;
  OnDemand: undefined;
  Profile: undefined;
  Gallery: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  LifeStage: undefined;
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
