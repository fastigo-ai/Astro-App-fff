import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image as RNImage, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  CreditCard,
  Lock,
  Camera,
} from 'lucide-react-native';
import { useAuthStore } from '~/store/useAuthStore';
import { PROGRAMS_DATA } from '~/features/course/data/programsData';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  { id: 'doctor', icon: '👨‍⚕️', title: 'Details of your Doctor', color: '#84FAB0' },
  { id: 'refer', icon: '🎁', title: 'Refer & Earn (Gift ₹500 & Free Months)', color: '#FF7B89' },
  { id: 'kundli', icon: '✨', title: 'My Garbh Kundli & Horoscope', color: '#A18CD1' },
  { id: 'live', icon: '📹', title: 'Live Doctor Masterclasses', color: '#EF4444' },
  { id: 'mother', icon: '👩', title: 'Details of Pregnant Woman', color: '#FF9A9E' },
  { id: 'husband', icon: '👨', title: 'Details of Husband', color: '#6BAE98' },
  { id: 'notify', icon: '🔔', title: 'Allow Notifications', color: '#FCCB90' },
  { id: 'delete', icon: '🗑️', title: 'Delete My Account', color: '#ff758c' },
];

export const ProfileSettingsScreen: React.FC<any> = ({ navigation: propNavigation }) => {
  let hookNavigation: any = null;
  try {
    hookNavigation = useNavigation<any>();
  } catch {}
  const navigation = propNavigation || hookNavigation;
  const insets = useSafeAreaInsets();

  const user = useAuthStore((state) => state.user);
  const journeyData = useAuthStore((state) => state.journeyData);
  const subscriptionStatus = useAuthStore((state) => state.subscriptionStatus);
  const activeSubscriptions = useAuthStore((state) => state.activeSubscriptions);

  const isActive = subscriptionStatus === 'active';

  // Get first active subscription or default
  const activeKeys = Object.keys(activeSubscriptions);
  const primarySub = activeKeys.length > 0 ? activeSubscriptions[activeKeys[0]!] : null;
  const primaryProg = activeKeys.length > 0 && PROGRAMS_DATA[activeKeys[0]!]
    ? PROGRAMS_DATA[activeKeys[0]!]
    : PROGRAMS_DATA['garbh_sanskar'];

  const planName = primarySub?.planName || (isActive ? 'Garbh Sanskar Utkarsh Plan' : 'Free Explorer');
  const expiryDate = primarySub?.expiresAt
    ? new Date(primarySub.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '15 May 2027';

  const handlePickAvatar = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        includeBase64: true,
        compressImageQuality: 0.8,
      });

      if (image && (image.path || (image as any).data)) {
        const uri = (image as any).data ? `data:${image.mime};base64,${(image as any).data}` : image.path;
        await useAuthStore.getState().setUserAvatar(uri);
        Alert.alert('Profile Photo Saved! 🌸', 'Your profile picture has been updated.');
      }
    } catch (err: any) {
      if (err?.message !== 'User cancelled image selection') {
        console.warn('Avatar pick error:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 40 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Subscription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            {user?.avatar ? (
              <RNImage source={{ uri: user.avatar }} style={styles.avatarImageReal} />
            ) : (
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>👶</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editBadge}
              onPress={handlePickAvatar}
              activeOpacity={0.8}
            >
              <Camera size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'Loving Mother'}</Text>
          <Text style={styles.userSubtitle}>
            {journeyData?.stage === 'planning'
              ? 'Conception Planning Stage'
              : `Pregnancy Month - ${journeyData?.confirmed_month || 4}`}
          </Text>
        </View>

        {/* ACTIVE SUBSCRIPTION SCHEME CARD */}
        <View style={styles.subscriptionCard}>
          <View style={styles.subCardHeader}>
            <View style={[styles.subIconBadge, { backgroundColor: isActive ? '#DCFCE7' : '#FEF3C7' }]}>
              <Text style={styles.subIcon}>{isActive ? '💎' : '🔒'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.badgeRow}>
                <Text style={styles.subPlanLabel}>ACTIVE SUBSCRIPTION</Text>
                <View style={[styles.statusBadge, { backgroundColor: isActive ? '#DCFCE7' : '#F3F4F6' }]}>
                  <Text style={[styles.statusBadgeText, { color: isActive ? '#15803D' : '#6B7280' }]}>
                    {isActive ? 'ACTIVE' : 'FREE TIER'}
                  </Text>
                </View>
              </View>
              <Text style={styles.subPlanName}>{planName}</Text>
            </View>
          </View>

          {isActive ? (
            <View style={styles.subActiveInfo}>
              <View style={styles.subDetailRow}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.subDetailText}>Valid Until: {expiryDate}</Text>
              </View>
              <View style={styles.subDetailRow}>
                <ShieldCheck size={14} color="#16A34A" />
                <Text style={styles.subDetailText}>Full Vedic & Medical Unlocked</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.subFreeText}>
              Subscribe to any program to unlock 24/7 doctor consults, baby kick counter, and daily Vedic modules.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.manageSubButton, { backgroundColor: isActive ? '#FAF5FF' : '#EC4899' }]}
            onPress={() => {
              if (isActive) {
                navigation.navigate('SubscriptionDetails');
              } else {
                navigation.navigate('AllPrograms');
              }
            }}
          >
            <Text style={[styles.manageSubButtonText, { color: isActive ? '#A855F7' : '#FFFFFF' }]}>
              {isActive ? 'Manage Subscription Schemes & Details →' : 'Explore Programs & Subscribe →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Settings List */}
        <Text style={styles.sectionHeading}>Account Settings</Text>
        <View style={styles.settingsSection}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem, 
                index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => {
                if (item.id === 'mother') {
                  navigation.navigate('PregnancyDetails');
                } else if (item.id === 'doctor' || item.id === 'husband') {
                  navigation.navigate('MedicalProfile');
                } else if (item.id === 'refer') {
                  navigation.navigate('ReferEarn');
                } else if (item.id === 'kundli') {
                  navigation.navigate('Kundli');
                } else if (item.id === 'live') {
                  navigation.navigate('LiveSessions');
                } else if (item.id === 'notify') {
                  navigation.navigate('Notifications');
                } else if (item.id === 'delete') {
                  Alert.alert(
                    'Delete Account',
                    'Are you sure you want to delete your Astrobaby account?\n\n• Your active plans and subscriptions will be cancelled.\n• In accordance with privacy regulations and store compliance, your account will be deactivated and soft-deleted.\n• You will be logged out immediately.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete Account',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await useAuthStore.getState().deleteAccount('User requested deletion in profile settings');
                          } catch (e) {
                            console.warn('Error during account deletion:', e);
                          }
                        },
                      },
                    ]
                  );
                }
              }}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '30' }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#F1F5F9',
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F472B6',
  },
  avatarImageReal: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#EC4899',
  },
  avatarEmoji: {
    fontSize: 42,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#EC4899',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    elevation: 3,
  },
  editIcon: {
    fontSize: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subIcon: {
    fontSize: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subPlanLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  subPlanName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1B4B',
    marginTop: 2,
  },
  subActiveInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 14,
  },
  subDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subDetailText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 6,
  },
  subFreeText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  manageSubButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageSubButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1B4B',
  },
});
