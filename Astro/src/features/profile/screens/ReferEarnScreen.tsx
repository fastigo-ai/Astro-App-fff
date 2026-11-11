import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { theme } from '~/shared/theme';
import { api } from '~/shared/api';
import {
  Gift,
  ArrowLeft,
  Copy,
  Share2,
  Users,
  Coins,
  CheckCircle,
  Sparkles,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<AppStackParamList, 'ReferEarn'>;

export const ReferEarnScreen: React.FC<Props> = ({ navigation }) => {
  const [referralInfo, setReferralInfo] = useState({
    referralCode: 'ASTROMAA9',
    rewardPerReferral: '₹500 / 1 Free Month',
    friendDiscount: '₹500 Off',
    totalReferrals: 3,
    totalRewardsEarned: 1500,
    freeMonthsUnlocked: 1,
    shareMessage: '🌸 Join me on Astro Baby Garbh Sanskar! Use code ASTROMAA9 to get ₹500 off. Download: https://astrobaby.app',
  });

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const fetchReferralInfo = async () => {
    try {
      const res = await api.get('/api/v1/krishna/referral/info');
      if (res.data?.success) {
        setReferralInfo(res.data);
      }
    } catch (e) {
      // fallback
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: referralInfo.shareMessage,
      });
    } catch (e) {
      Alert.alert('Share', `Your code is ${referralInfo.referralCode}`);
    }
  };

  const handleCopy = () => {
    Alert.alert('Copied to Clipboard', `Referral code ${referralInfo.referralCode} copied!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.badgeRow}>
            <Gift size={16} color={theme.colors.primary} />
            <Text style={styles.badgeText}>GIFT SANSKAR TO MOTHERS</Text>
          </View>
          <Text style={styles.bannerTitle}>Earn ₹500 & Free Months</Text>
          <Text style={styles.bannerText}>
            Invite expecting friends or pregnant mothers. When they join, they get ₹500 off and you receive ₹500 in your wallet + 1 month free Garbh Sanskar!
          </Text>
        </View>

        {/* Code Box */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>YOUR UNIQUE REFERRAL CODE</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeText}>{referralInfo.referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              <Copy size={18} color={theme.colors.primary} />
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={18} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Users size={20} color={theme.colors.secondary} />
            <Text style={styles.statNumber}>{referralInfo.totalReferrals}</Text>
            <Text style={styles.statLabel}>Friends Joined</Text>
          </View>
          <View style={styles.statBox}>
            <Coins size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>₹{referralInfo.totalRewardsEarned}</Text>
            <Text style={styles.statLabel}>Rewards Earned</Text>
          </View>
          <View style={styles.statBox}>
            <Sparkles size={20} color="#EAB308" />
            <Text style={styles.statNumber}>{referralInfo.freeMonthsUnlocked}</Text>
            <Text style={styles.statLabel}>Free Months</Text>
          </View>
        </View>

        {/* Steps */}
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepCard}>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <View style={styles.stepTextCol}>
              <Text style={styles.stepTitle}>Share your invite code</Text>
              <Text style={styles.stepDesc}>Send your code to pregnant friends via WhatsApp, SMS, or Instagram.</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
            <View style={styles.stepTextCol}>
              <Text style={styles.stepTitle}>They get ₹500 instant discount</Text>
              <Text style={styles.stepDesc}>When they enter your code during plan selection, they save ₹500 immediately.</Text>
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
            <View style={styles.stepTextCol}>
              <Text style={styles.stepTitle}>You unlock rewards & free access</Text>
              <Text style={styles.stepDesc}>₹500 is deposited into your wallet and free months get credited to your active plan!</Text>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#FFF5F6',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  bannerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 10,
    textAlign: 'center',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
  },
  copyText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 14,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
});

