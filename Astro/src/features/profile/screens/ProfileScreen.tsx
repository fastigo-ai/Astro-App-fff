import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Linking } from 'react-native';
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

export const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = React.useState(true);
  const [isContactModalVisible, setContactModalVisible] = React.useState(false);

  const toggleLanguage = async () => {
    const nextLang = i18n.language?.startsWith('hi') ? 'en' : 'hi';
    await i18n.changeLanguage(nextLang);
    await AsyncStorage.setItem('@garbhcompanion/language', nextLang);
  };

  const name = user?.name || t('profile.newMom');
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isHindi = i18n.language?.startsWith('hi');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section (Dreamy Aesthetic) */}
        <View style={[styles.headerCanvas, { paddingTop: insets.top + 20 }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {/* Edit avatar button */}
            <TouchableOpacity style={styles.editAvatarBadge}>
              <Text style={styles.editAvatarText}>Edit</Text>
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
            <Text style={styles.sectionHeader}>{t('profile.myJourney')}</Text>
            <View style={styles.cardGroup}>
              <SettingItem 
                icon={<Calendar size={22} color="#EC4899" />} 
                title={t('profile.pregnancyDetails')} 
                subtitle={t('profile.pregnancyDetailsSub')} 
                onPress={() => {
                  const parent = navigation.getParent();
                  if (parent) {
                    (parent as any).navigate('LifeStage');
                  } else {
                    (navigation as any).navigate('LifeStage');
                  }
                }}
              />
              <SettingItem 
                icon={<Heart size={22} color="#EC4899" />} 
                title={t('profile.partnerProfile')} 
                subtitle={t('profile.partnerProfileSub')} 
                isLast
              />
            </View>
          </View>

          {/* Section: Preferences */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{t('profile.preferences')}</Text>
            <View style={styles.cardGroup}>
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
                onPress={() => setContactModalVisible(true)}
              />
              <SettingItem 
                icon={<HelpCircle size={22} color="#4B5563" />} 
                title={t('profile.helpCenter')} 
              />
              <SettingItem 
                icon={<User size={22} color="#4B5563" />} 
                title={t('profile.termsPrivacy')} 
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
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  editAvatarText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 8,
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
