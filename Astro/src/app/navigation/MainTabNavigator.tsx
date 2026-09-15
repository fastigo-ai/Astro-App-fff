import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DashboardScreen } from '~/features/dashboard/screens/DashboardScreen';
import { ComponentGalleryScreen } from '~/features/debug/screens/ComponentGalleryScreen';
import { theme } from '~/shared/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

import { useAuthStore } from '~/store/useAuthStore';
import { LockedState } from '~/shared/components/LockedState';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';

const LiveSessionsScreen = () => {
  const status = useAuthStore(state => state.subscriptionStatus);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  
  if (status !== 'active') {
    return <LockedState 
      title="Live Sessions" 
      description="Join daily live yoga, meditation, and expert Q&A sessions designed specifically for expecting mothers."
      onPressPricing={() => navigation.navigate('Pricing')}
    />;
  }
  return <View style={styles.center}><Text>Live Sessions coming soon!</Text></View>;
};

const OnDemandScreen = () => {
  const status = useAuthStore(state => state.subscriptionStatus);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  
  if (status !== 'active') {
    return <LockedState 
      title="Premium Library" 
      description="Access our complete catalog of prenatal workouts, diet plans, and educational videos anytime."
      onPressPricing={() => navigation.navigate('Pricing')}
    />;
  }
  return <View style={styles.center}><Text>On Demand coming soon!</Text></View>;
};

const ProfileScreen = () => {
  const logout = useAuthStore(state => state.logout);
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.profileName}>Jane Doe</Text>
        <Text style={styles.profileSubtitle}>Week 24 • Trimester 2</Text>
      </View>
      <View style={styles.profileActions}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TabIcon = ({ focused, label }: { focused: boolean; label: string }) => (
  <View style={styles.iconContainer}>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
    {focused && <View style={styles.activeDot} />}
  </View>
);

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Home" />
        }}
      />
      <Tab.Screen 
        name="LiveSessions" 
        component={LiveSessionsScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Live" />
        }}
      />
      <Tab.Screen 
        name="OnDemand" 
        component={OnDemandScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Content" />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Profile" />
        }}
      />
      {/* Temporary Debug Tab */}
      <Tab.Screen 
        name="Gallery" 
        component={ComponentGalleryScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Design UI" />
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    elevation: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 70,
    paddingBottom: 0, // Overrides default safe area inset
    paddingTop: 0,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    borderTopWidth: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  tabLabelFocused: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    bottom: 12,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  profileActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 26,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#E53935',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
