import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { theme } from '~/shared/theme';
import { Button } from '~/shared/components/Button';
import { useAuthStore } from '~/store/useAuthStore';

type Props = NativeStackScreenProps<AppStackParamList, 'Pricing'>;

const FEATURES = [
  'Unlimited Live Yoga & Meditation Sessions',
  '24/7 Expert Doctor Consultation Chat',
  'Personalized Diet & Nutrition Plans',
  'Weekly Fetal Development Tracking',
];

export const PricingScreen: React.FC<Props> = ({ navigation }) => {
  const setSubscriptionStatus = useAuthStore(state => state.setSubscriptionStatus);

  const handleSubscribe = () => {
    // Mock subscribing
    if (setSubscriptionStatus) {
      setSubscriptionStatus('active');
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Unlock Premium</Text>
        <Text style={styles.subtitle}>Get the complete GarbhCompanion experience for a healthier, happier pregnancy.</Text>
        
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RECOMMENDED</Text>
          </View>
          <Text style={styles.planName}>Full Journey Plan</Text>
          <Text style={styles.price}>₹1999 <Text style={styles.period}>/ 9 months</Text></Text>
          
          <View style={styles.featuresList}>
            {FEATURES.map((feat, i) => (
              <View key={i} style={styles.featureItem}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
          
          <Button 
            title="Subscribe Now" 
            onPress={handleSubscribe} 
            style={styles.subscribeBtn} 
          />
        </View>

        <Text style={styles.termsText}>
          Payment will be charged to your Play Store account at confirmation of purchase.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'flex-end',
  },
  closeBtn: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textDark,
  },
  container: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxl,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textDark,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  price: {
    fontSize: 36,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  period: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  featuresList: {
    marginBottom: theme.spacing.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  checkIcon: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginRight: theme.spacing.md,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: theme.colors.textDark,
    flex: 1,
  },
  subscribeBtn: {
    width: '100%',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
});
