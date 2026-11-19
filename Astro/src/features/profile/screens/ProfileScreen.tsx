import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Linking, Image as RNImage, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '~/store/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  User, 
  Calendar, 
  Settings, 
  HelpCircle, 
  ChevronRight, 
  LogOut, 
  Crown,
  Heart,
  Globe,
  MessageCircle,
  Mail,
  Phone,
  Camera,
  X
} from 'lucide-react-native';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, onPress, rightElement, isLast }) => (
  <TouchableOpacity 
    style={[styles.settingItem, !isLast && styles.settingItemBorder]} 
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingIconWrapper}>{icon}</View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.settingRightElement}>
      {rightElement || <ChevronRight size={20} color="#D1D5DB" />}
    </View>
  </TouchableOpacity>
);

export const ProfileScreen: React.FC<any> = ({ navigation: propNavigation }) => {
  const { t, i18n } = useTranslation();
  const hookNavigation = useNavigation();
  const navigation = propNavigation || hookNavigation;
  const { user, journeyData, logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = React.useState(true);
  const [isContactModalVisible, setContactModalVisible] = React.useState(false);

  const toggleLanguage = async () => {
    const nextLang = i18n.language?.startsWith('hi') ? 'en' : 'hi';
    await i18n.changeLanguage(nextLang);
    await AsyncStorage.setItem('@garbhcompanion/language', nextLang);
    try {
      const { api } = require('~/shared/api');
      await api.post('/api/v1/profile/language', { language: nextLang });
    } catch (e) {
      console.warn('Backend language sync optional error:', e);
    }
  };

  const name = user?.name || t('profile.newMom');
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isHindi = i18n.language?.startsWith('hi');

  const navigateToScreen = (screenName: string, params?: any) => {
    const parent = navigation.getParent();
    if (parent) {
      (parent as any).navigate(screenName, params);
    } else {
      (navigation as any).navigate(screenName, params);
    }
  };

  const handlePartnerProfile = () => {
    navigateToScreen('FatherProfile');
  };

  const handleHelpCenter = () => {
    navigateToScreen('Contact');
  };

  const handleTermsPrivacy = () => {
    navigateToScreen('TermsConditions');
  };

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
        Alert.alert(
          isHindi ? 'फ़ोटो अपडेट हुई! 🌸' : 'Profile Photo Saved! 🌸',
          isHindi ? 'आपकी प्रोफ़ाइल फ़ोटो सफलतापूर्वक सुरक्षित कर दी गई है।' : 'Your beautiful profile picture has been updated.'
        );
      }
    } catch (err: any) {
      if (err?.message !== 'User cancelled image selection') {
        console.warn('Avatar pick error:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section (Dreamy Aesthetic) */}
        <View style={[styles.headerCanvas, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity 
            style={styles.headerSettingsBtn} 
            onPress={() => navigateToScreen('ProfileSettings')}
            accessibilityRole="button"
            accessibilityLabel="Profile Settings"
            activeOpacity={0.8}
          >
            <Settings size={22} color="#6B7280" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <RNImage source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            {/* Edit avatar button */}
            <TouchableOpacity 
              style={styles.editAvatarBadge}
              onPress={handlePickAvatar}
              activeOpacity={0.8}
            >
              <Camera size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
              <Text style={styles.editAvatarText}>
                {user?.avatar
                  ? (isHindi ? 'DP बदलें' : 'Change DP')
                  : (isHindi ? 'नयी DP लगाएं' : 'Add DP')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{name}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{t('profile.status')}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          
          {/* Premium Banner */}
          <TouchableOpacity 
            style={styles.premiumBanner} 
            activeOpacity={0.8}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                (parent as any).navigate('Pricing');
              } else {
                (navigation as any).navigate('Pricing');
              }
            }}
          >
            <View style={styles.premiumIconBox}>
              <Crown size={24} color="#D97706" />
            </View>
            <View style={styles.premiumTextBox}>
              <Text style={styles.premiumTitle}>{t('profile.unlockPremium')}</Text>
              <Text style={styles.premiumSubtitle}>{t('profile.unlockPremiumSub')}</Text>
            </View>
            <ChevronRight size={20} color="#D97706" />
          </TouchableOpacity>

          {/* Section: My Journey */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>{t('profile.myJourney')}</Text>
              <TouchableOpacity
                onPress={() => navigateToScreen('PregnancyDetails')}
                activeOpacity={0.7}
              >
                <Text style={styles.editSectionLink}>
                  {isHindi ? 'विवरण देखें / बदलें ✏️' : 'View & Update ✏️'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Collected Details Summary Card */}
            <TouchableOpacity
              style={styles.pregnancyDetailsSummaryCard}
              onPress={() => navigateToScreen('PregnancyDetails')}
              activeOpacity={0.88}
            >
              <View style={styles.pregnancySummaryHeader}>
                <View style={styles.pregnancyIconBadge}>
                  <Calendar size={18} color="#BE123C" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pregnancyStageTitle}>
                    {journeyData?.stage === 'planning'
                      ? (isHindi ? 'गर्भाधान योजना चरण' : 'Conception Planning Stage')
                      : (isHindi 
                          ? `गर्भावस्था माह ${journeyData?.confirmed_month || 4} (${(journeyData?.confirmed_month || 4) <= 3 ? 'प्रथम' : (journeyData?.confirmed_month || 4) <= 6 ? 'द्वितीय' : 'तृतीय'} तिमाही)` 
                          : `Pregnancy Month ${journeyData?.confirmed_month || 4} • ${(journeyData?.confirmed_month || 4) <= 3 ? '1st' : (journeyData?.confirmed_month || 4) <= 6 ? '2nd' : '3rd'} Trimester`)}
                  </Text>
                  <Text style={styles.pregnancyMilestoneSubtitle}>
                    {journeyData?.stage === 'planning'
                      ? (isHindi ? 'बीज शुद्धि एवं सात्विक तैयारी' : 'Preconception Vedic Detox & Wellness')
                      : (isHindi ? 'मस्तिष्क व संवेदी तंत्रिकाओं का तीव्र विकास' : 'Auditory sensory nerves & brain wiring active')}
                  </Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </View>

              {/* Quick Details Chips */}
              <View style={styles.collectedChipsGrid}>
                <View style={styles.collectedChip}>
                  <Text style={styles.chipLabel}>{isHindi ? 'प्रसव तिथि (EDD)' : 'Due Date (EDD)'}</Text>
                  <Text style={styles.chipValue}>{journeyData?.edd_date || '15 Oct 2027'}</Text>
                </View>
                <View style={styles.collectedChip}>
                  <Text style={styles.chipLabel}>{isHindi ? 'अंतिम माहवारी (LMP)' : 'LMP Date'}</Text>
                  <Text style={styles.chipValue}>{journeyData?.lmp_date || user?.lmp_date || '10 Jan 2027'}</Text>
                </View>
                <View style={styles.collectedChip}>
                  <Text style={styles.chipLabel}>{isHindi ? 'स्थान' : 'City'}</Text>
                  <Text style={styles.chipValue}>{user?.city || 'Delhi, India'}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.cardGroup}>
              <SettingItem 
                icon={<Calendar size={22} color="#EC4899" />} 
                title={t('profile.pregnancyDetails')} 
                subtitle={isHindi ? 'सभी विवरण देखें व फोटो (DP) अपडेट करें' : 'View all collected details & update DP'} 
                onPress={() => navigateToScreen('PregnancyDetails')}
              />
              <SettingItem 
                icon={<Heart size={22} color="#EC4899" />} 
                title={t('profile.partnerProfile')} 
                subtitle={t('profile.partnerProfileSub')} 
                onPress={handlePartnerProfile}
                isLast
              />
            </View>
          </View>

          {/* Section: Preferences */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{t('profile.preferences')}</Text>
            <View style={styles.cardGroup}>
              <SettingItem 
                icon={<Settings size={22} color="#6366F1" />} 
                title={isHindi ? 'खाता और ऐप सेटिंग्स' : 'Account & App Settings'} 
                subtitle={isHindi ? 'सदस्यता, डॉक्टर और प्रोफ़ाइल विवरण' : 'Subscription, doctor & profile details'} 
                onPress={() => navigateToScreen('ProfileSettings')} 
              />
              <SettingItem 
                icon={<Globe size={22} color="#4B5563" />} 
                title={t('profile.language')} 
                onPress={toggleLanguage}
                rightElement={
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.languageValue, { color: '#4F46E5', fontWeight: '700' }]}>
                      {isHindi ? 'हिन्दी' : 'English'}
                    </Text>
                    <ChevronRight size={18} color="#9CA3AF" />
                  </View>
                }
              />
              <SettingItem 
                icon={<Settings size={22} color="#4B5563" />} 
                title={t('profile.pushNotifications')} 
                rightElement={
                  <Switch 
                    value={notifications} 
                    onValueChange={setNotifications}
                    trackColor={{ false: "#E5E7EB", true: "#FDE68A" }}
                    thumbColor={notifications ? "#D97706" : "#f4f3f4"}
                  />
                }
                isLast
              />
            </View>
          </View>

          {/* Section: Support */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{t('profile.supportAbout')}</Text>
            <View style={styles.cardGroup}>
              <SettingItem 
                icon={<MessageCircle size={22} color="#10B981" />} 
                title={t('profile.chatWithUs')} 
                subtitle={t('profile.chatWithUsSub')} 
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    (parent as any).navigate('SupportChat');
                  } else {
                    (navigation as any).navigate('SupportChat');
                  }
                }}
              />
              <SettingItem 
                icon={<HelpCircle size={22} color="#4B5563" />} 
                title={t('profile.helpCenter')} 
                subtitle={isHindi ? 'संपर्क और सहायता केंद्र' : 'Contact & customer care'}
                onPress={handleHelpCenter}
              />
              <SettingItem 
                icon={<User size={22} color="#4B5563" />} 
                title={t('profile.termsPrivacy')} 
                subtitle={isHindi ? 'नियम और गोपनीयता नीति' : 'Terms & Privacy Policy'}
                onPress={handleTermsPrivacy}
                isLast
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
          
          <Text style={styles.appVersion}>{t('profile.version')}</Text>

        </View>
      </ScrollView>

      {/* Contact Us Modal */}
      <Modal
        visible={isContactModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('profile.contactModalTitle')}</Text>
              <TouchableOpacity onPress={() => setContactModalVisible(false)} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              {t('profile.contactModalSub')}
            </Text>

            <TouchableOpacity 
              style={[styles.contactCard, { borderColor: '#FDF2F8', backgroundColor: '#FDF2F8' }]}
              onPress={() => Linking.openURL('mailto:support@astrobaby.com')}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIconBox, { backgroundColor: '#FBCFE8' }]}>
                <Mail size={24} color="#EC4899" />
              </View>
              <View style={styles.contactTextBox}>
                <Text style={styles.contactType}>{t('profile.sendEmail')}</Text>
                <Text style={styles.contactValue}>support@astrobaby.com</Text>
              </View>
              <ChevronRight size={20} color="#EC4899" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.contactCard, { borderColor: '#F0FDF4', backgroundColor: '#F0FDF4' }]}
              onPress={() => Linking.openURL('tel:+18002787622')}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIconBox, { backgroundColor: '#BBF7D0' }]}>
                <Phone size={24} color="#10B981" />
              </View>
              <View style={styles.contactTextBox}>
                <Text style={styles.contactType}>{t('profile.callNow')}</Text>
                <Text style={styles.contactValue}>+1 800-ASTRO-BABY</Text>
              </View>
              <ChevronRight size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Soft creamy background matches Dashboard
  },
  scrollContent: {
    paddingBottom: 120, // Extra padding for bottom tab bar
  },
  headerCanvas: {
    backgroundColor: '#FFFDF9', // Very soft ethereal cream
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 3,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    position: 'relative',
  },
  headerSettingsBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    zIndex: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FDFBF7',
    borderWidth: 2,
    borderColor: '#FEF08A', // Soft gold border
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    color: '#92400E',
    fontWeight: '700',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#FCE7F3',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -8,
    backgroundColor: '#EC4899',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  editAvatarText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusPill: {
    backgroundColor: '#FDFBF7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  statusText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB', // Very soft yellow/gold tint
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  premiumIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#FEF3C7',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumTextBox: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 12,
    color: '#B45309',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editSectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BE123C',
  },
  pregnancyDetailsSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pregnancySummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  pregnancyIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pregnancyStageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
  },
  pregnancyMilestoneSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  collectedChipsGrid: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FAF9F6',
    borderRadius: 12,
    padding: 10,
  },
  collectedChip: {
    flex: 1,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
  },
  chipValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIconWrapper: {
    width: 36,
    height: 36,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingRightElement: {
    marginLeft: 16,
  },
  languageValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2', // Soft red tint
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 8,
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 11,
    color: '#D1D5DB',
    marginTop: 24,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  contactIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactTextBox: {
    flex: 1,
  },
  contactType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: '#6B7280',
  }
});
