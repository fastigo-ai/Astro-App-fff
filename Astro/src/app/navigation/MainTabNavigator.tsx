import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, BookOpen, Clock, Bell, User, CheckCircle2 } from 'lucide-react-native';
import { DashboardScreen } from '~/features/dashboard/screens/DashboardScreen';
import { ProfileScreen } from '~/features/profile/screens/ProfileScreen';
import { useAuthStore } from '~/store/useAuthStore';
import { SubscribedScreen } from '~/features/dashboard/screens/SubscribedScreen';
import { ClassesScreen } from '~/features/dashboard/screens/ClassesScreen';
import { ActivityScreen } from '~/features/dashboard/screens/ActivityScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Dynamic icon renderer based on state
const getIcon = (routeName: string, color: string, isFocused: boolean) => {
  const size = isFocused ? 28 : 24; 
  const stroke = isFocused ? 2.5 : 1.5;
  switch (routeName) {
    case 'Dashboard': return <Home size={size} color={color} strokeWidth={stroke} />;
    case 'Subscribed': return <BookOpen size={size} color={color} strokeWidth={stroke} />;
    case 'Activity': return <CheckCircle2 size={size} color={color} strokeWidth={stroke} />;
    case 'InProgress': return <Clock size={size} color={color} strokeWidth={stroke} />;
    case 'Profile': return <User size={size} color={color} strokeWidth={stroke} />;
    default: return <View style={{ width: size, height: size, backgroundColor: color }} />;
  }
};

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            {isFocused ? (
              <View style={styles.focusedCircle}>
                {getIcon(route.name, '#FFFFFF', true)}
              </View>
            ) : (
              <>
                <View style={styles.iconWrapper}>
                  {getIcon(route.name, '#9CA3AF', false)}
                </View>
                <Text style={styles.labelText}>{label}</Text>
              </>
            )}

          </TouchableOpacity>
        );
      })}
    </View>
  );
};

import { useTranslation } from 'react-i18next';

export const MainTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Subscribed" component={SubscribedScreen} options={{ title: t('tabs.program') }} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{ title: t('tabs.activity') }} />
      <Tab.Screen name="InProgress" component={ClassesScreen} options={{ title: t('tabs.classes') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('tabs.profile') }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    // Soft drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 72,
    flex: 1,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  focusedCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EC4899', // Signature vibrant pink color
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }], // Pops up playfully above the tab bar
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: '50%',
    backgroundColor: '#EC4899',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    transform: [{ translateX: 15 }, { translateY: -15 }], // Pushed top-right of the icon
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    backgroundColor: '#EC4899',
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
