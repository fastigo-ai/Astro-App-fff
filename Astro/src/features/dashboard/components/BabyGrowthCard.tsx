import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '~/store/useAuthStore';
import { MainTabParamList } from '~/app/navigation/types';

export const BabyGrowthCard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>();
  // In reality, this would be fetched from user profile (e.g., user.profileType === 'pregnant')
  const isPregnant = true;
  const user = useAuthStore(state => state.user);
  const subscriptionStatus = useAuthStore(state => state.subscriptionStatus);
  const userName = user?.name || "Mumma"; 

  if (!isPregnant) {
    return null; // Don't show if not pregnant
  }

  // Calculate real-time gestational age
  const lmpDateStr = user?.lmp_date;
  let weeks = 3;
  let days = 6;
  let totalDays = 27;
  let trimester = '1st';

  if (lmpDateStr) {
    const lmp = new Date(lmpDateStr);
    const today = new Date();
    const diffTime = today.getTime() - lmp.getTime();
    if (diffTime > 0) {
      totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      weeks = Math.floor(totalDays / 7);
      days = totalDays % 7;
      if (weeks >= 28) trimester = '3rd';
      else if (weeks >= 14) trimester = '2nd';
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top section */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('dashboard.babyGrowthToday', { name: userName })}</Text>
          <TouchableOpacity style={styles.arrowButton}>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Middle Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>{t('dashboard.weekMonth')}</Text>
            <Text style={styles.statValue}>{weeks}{t('dashboard.week')} & {days}{t('dashboard.day')}/{trimester}</Text>
          </View>
          
          <View style={styles.imagePlaceholder}>
            {/* Fallback emoji for the cute baby vector art */}
            <Text style={styles.emojiArt}>👼</Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statLabel}>{t('dashboard.heightWeight')}</Text>
            <Text style={styles.statValue}>1.5mm/&lt;1g</Text>
          </View>
        </View>

        {/* Bottom Text */}
        <Text style={styles.footerText}>Mumma, It has been {totalDays} days in your womb.</Text>

        {/* Quick Interaction Link */}
        <TouchableOpacity 
          style={styles.quickKickLink}
          onPress={() => {
            const parent = navigation.getParent();
            if (parent) {
              (parent as any).navigate('KickCounter');
            } else {
              (navigation as any).navigate('KickCounter');
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.quickKickLinkText}>
            🌸 Count Baby's Kicks Today (शिशु की हलचल गिनें) →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Routine Section Below Card */}
      <View style={styles.routineSection}>
        <Text style={styles.routineTitle}>Your Garbhsanskar Routine</Text>
        {subscriptionStatus === 'active' ? (
          <TouchableOpacity 
            style={[styles.trialButton, { backgroundColor: '#FEF9C3', borderColor: '#FDE047' }]}
            onPress={() => navigation.navigate('Activity')}
          >
            <Text style={[styles.trialButtonText, { color: '#CA8A04' }]}>Play Today's Routine ✨</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.trialButton}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                (parent as any).navigate('Pricing');
              } else {
                (navigation as any).navigate('Pricing');
              }
            }}
            activeOpacity={0.8}
          >
            <Lock size={14} color="#854D0E" style={styles.lockIcon} />
            <Text style={styles.trialButtonText}>3-day free trial</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: '#FFFDF9', // Very soft, warm creamy ethereal background
    borderRadius: 24,
    paddingTop: 32, 
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7', // Faint warm border
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    letterSpacing: 0.3,
  },
  arrowButton: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statPill: {
    backgroundColor: '#FDFBF7', // Cream pill
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#FEF08A', // Soft gold border
  },
  statLabel: {
    fontSize: 10,
    color: '#92400E', // Warm golden brown
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  imagePlaceholder: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiArt: {
    fontSize: 40,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '400',
    fontStyle: 'italic',
  },
  quickKickLink: {
    marginTop: 12,
    backgroundColor: '#FFF1F2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  quickKickLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E11D48',
  },
  routineSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  routineTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  trialButton: {
    backgroundColor: '#FDFBF7', // Pillowy cream color like the stitched button
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Faint border mimicking stitching
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lockIcon: {
    marginRight: 6,
  },
  trialButtonText: {
    color: '#854D0E', // Dark warm gold/brown text
    fontWeight: '600',
    fontSize: 14,
  }
});
