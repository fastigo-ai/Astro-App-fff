import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '~/shared/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Footprints, Bell } from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

import { useTranslation } from 'react-i18next';

export const DashboardHeader: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const babyKicks = useAuthStore(state => state.babyKicks);
  const incrementBabyKicks = useAuthStore(state => state.incrementBabyKicks);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
      {/* Left Side: Logo */}
      <View style={styles.leftContainer}>
        <Image
          source={require('~/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Right Side: Interactive Actions (Minimalist Icons) */}
      <View style={styles.rightContainer}>
        {/* Baby Kick Counter */}
        <TouchableOpacity
          style={styles.kickButton}
          onPress={incrementBabyKicks}
          activeOpacity={0.7}
        >
          <View style={styles.kickIconWrapper}>
            <Footprints size={16} color="#E11D48" strokeWidth={2.5} />
          </View>
          <Text style={styles.kickButtonText}>
            {babyKicks > 0 ? `${babyKicks} ${t('dashboard.kicks')}` : t('dashboard.recordKick')}
          </Text>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Bell size={26} color="#111827" strokeWidth={1.5} />
          <View style={styles.dotBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8, // Drastically reduced from 16 to make the header thin
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    // Subtle drop shadow to visually lift the header off the page
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
    zIndex: 10,
  },
  leftContainer: {
    justifyContent: 'center',
  },
  logoImage: {
    height: 32, // Slightly reduced to fit the thinner profile
    width: 120,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  iconButton: {
    position: 'relative',
    padding: 2,
  },
  kickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2', // Soft rose pink
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
    marginRight: 4,
  },
  kickIconWrapper: {
    marginRight: 6,
  },
  kickButtonText: {
    color: '#E11D48',
    fontWeight: '700',
    fontSize: 13,
  },
  dotBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});


