import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  Activity,
  Mic,
  Camera,
  MessageCircle,
} from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { PROGRAMS_DATA } from '~/features/course/data/programsData';

export const SubscriptionDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const subscriptionStatus = useAuthStore((state) => state.subscriptionStatus);
  const subscribedPrograms = useAuthStore((state) => state.subscribedPrograms);
  const activeSubscriptions = useAuthStore((state) => state.activeSubscriptions);

  const isActive = subscriptionStatus === 'active';

  // Format expiration date
  const formatExpiry = (isoString?: string) => {
    if (!isoString) {
      // Default to 6 months from now
      const d = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Subscribed programs array
  const activeList = Object.keys(activeSubscriptions).length > 0
    ? Object.keys(activeSubscriptions).map((progId) => ({
        id: progId,
        program: PROGRAMS_DATA[progId] || PROGRAMS_DATA['garbh_sanskar'],
        subDetails: activeSubscriptions[progId],
      }))
    : isActive
    ? [
        {
          id: 'garbh_sanskar',
          program: PROGRAMS_DATA['garbh_sanskar'],
          subDetails: {
            planName: 'Garbh Sanskar Utkarsh Journey',
            durationMonths: 6,
            amount: 2499,
            expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      ]
    : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 40 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subscription Schemes</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Status Hero */}
        <View style={styles.statusCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{isActive ? '💎' : '🔒'}</Text>
          </View>
          <Text style={styles.statusTitle}>
            {isActive ? 'GarbhCompanion Premium Member' : 'Free Explorer Plan'}
          </Text>
          <Text style={styles.statusDescription}>
            {isActive
              ? 'Your account has active program schemes unlocked. You enjoy unrestricted access to daily Vedic activities, doctor sessions, and pregnancy trackers.'
              : 'Upgrade to a Vedic program to unlock unlimited doctor consults, baby kick counter, and personalized diet charts.'}
          </Text>

          {!isActive && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('AllPrograms')}
            >
              <Text style={styles.upgradeButtonText}>Explore & Subscribe to Programs</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ACTIVE PROGRAM SUBSCRIPTIONS */}
        {isActive && activeList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Subscribed Programs</Text>
            {activeList.map(({ id, program, subDetails }) => (
              <View key={id} style={styles.activeProgramCard}>
                <View style={styles.progCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.progTitle}>{program.title}</Text>
                    <Text style={styles.progTier}>{subDetails.planName || 'Full Program'}</Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>ACTIVE</Text>
                  </View>
                </View>

                <View style={styles.progDetailRow}>
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Validity: {formatExpiry(subDetails.expiresAt)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <ShieldCheck size={14} color="#16A34A" />
                    <Text style={styles.detailText}>Verified Member</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <TouchableOpacity
                  style={[styles.openProgBtn, { backgroundColor: program.color }]}
                  onPress={() => navigation.navigate('Course', { courseId: program.id })}
                >
                  <Text style={styles.openProgBtnText}>View Program Detailing & Schedule →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* UNLOCKED MODULES QUICK SHORTCUTS */}
        {isActive && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Unlocked Inside Modules</Text>
            <Text style={styles.sectionSubtitle}>
              Tap any tool to jump straight in:
            </Text>

            <View style={styles.toolsGrid}>
              <TouchableOpacity
                style={styles.toolItem}
                onPress={() => navigation.navigate('KickCounter')}
              >
                <View style={[styles.toolIconWrap, { backgroundColor: '#FDF2F8' }]}>
                  <Activity size={20} color="#EC4899" />
                </View>
                <Text style={styles.toolName}>Kick Counter</Text>
                <Text style={styles.toolDesc}>Track fetal movements</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolItem}
                onPress={() => navigation.navigate('BabyBump')}
              >
                <View style={[styles.toolIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <Camera size={20} color="#3B82F6" />
                </View>
                <Text style={styles.toolName}>Baby Bump</Text>
                <Text style={styles.toolDesc}>Weekly photo diary</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolItem}
                onPress={() => navigation.navigate('GarbhSamvad')}
              >
                <View style={[styles.toolIconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <Mic size={20} color="#16A34A" />
                </View>
                <Text style={styles.toolName}>Garbh Samvad</Text>
                <Text style={styles.toolDesc}>Voice bonding diary</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toolItem}
                onPress={() => navigation.navigate('MoodTherapy')}
              >
                <View style={[styles.toolIconWrap, { backgroundColor: '#FAF5FF' }]}>
                  <Heart size={20} color="#A855F7" />
                </View>
                <Text style={styles.toolName}>Mood Therapy</Text>
                <Text style={styles.toolDesc}>Calming audio & breath</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* EXPLORE OTHER COMPLEMENTARY PROGRAMS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Explore Other Programs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllPrograms')}>
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>

          {Object.values(PROGRAMS_DATA)
            .filter((p) => p.id !== 'garbh_sanskar')
            .slice(0, 3)
            .map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.compactProgramCard}
                onPress={() => navigation.navigate('Course', { courseId: item.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.compactTitle}>{item.title}</Text>
                  <Text style={styles.compactSubtitle}>{item.subtitle}</Text>
                  <Text style={[styles.compactPrice, { color: item.color }]}>
                    Tiers from {item.tiers[0]?.calculatedPrice ? `₹${item.tiers[0].calculatedPrice}` : '₹1,999'}
                  </Text>
                </View>
                <View style={styles.compactArrow}>
                  <Text style={styles.compactArrowText}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => Alert.alert('Receipt', 'Digital invoice sent to your registered phone number.')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.actionIcon}>🧾</Text>
            </View>
            <Text style={styles.actionText}>Digital Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Contact')}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.actionIcon}>🎧</Text>
            </View>
            <Text style={styles.actionText}>Priority Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
  },
  statusTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 6,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EC4899',
  },
  activeProgramCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    padding: 16,
    marginBottom: 12,
  },
  progCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  progTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  progTier: {
    fontSize: 13,
    color: '#15803D',
    fontWeight: '600',
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  progDetailRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 6,
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  openProgBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  openProgBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolItem: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toolIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  toolDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  compactProgramCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  compactSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  compactPrice: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  compactArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactArrowText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1B4B',
  },
});
