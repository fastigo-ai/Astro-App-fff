import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { PhoneEntryScreen } from '~/features/auth/screens/PhoneEntryScreen';
import { OtpVerificationScreen } from '~/features/auth/screens/OtpVerificationScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = ({ initialRouteName = 'PhoneEntry' }: { initialRouteName?: keyof AuthStackParamList }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    </Stack.Navigator>
  );
};
