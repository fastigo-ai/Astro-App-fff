import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { AppStack } from './AppStack';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '~/shared/theme';
import { SplashScreen } from '~/shared/components/SplashScreen';
import { useAuthStore } from '~/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RootNavigator = () => {
  const [isReady, setIsReady] = useState(false);
  const status = useAuthStore(state => state.status);
  const restoreSession = useAuthStore(state => state.restoreSession);

  console.log('RootNavigator Rendered - Current Status:', status);

  useEffect(() => {
    const init = async () => {
      console.log('RootNavigator: Initializing session...');
      const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
      await Promise.all([restoreSession(), minDelay]);
      console.log('RootNavigator: Session restored.');
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  // Assuming AppStack contains dashboard, etc.
  // We can add OnboardingStack later for !hasProfile scenario
  return (
    <NavigationContainer>
      {status === 'authenticated' ? (
        <AppStack />
      ) : (
        <AuthNavigator initialRouteName="PhoneEntry" />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

