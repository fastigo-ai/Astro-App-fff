import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
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
  MessageCircle
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
  const logout = useAuthStore(state => state.logout);
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section (Dreamy Aesthetic) */}
        <View style={[styles.headerCanvas, { paddingTop: insets.top + 20 }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            {/* Edit avatar button */}
            <TouchableOpacity style={styles.editAvatarBadge}>
              <Text style={styles.editAvatarText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>Jane Doe</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Week 24 • Trimester 2 ✨</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          
          {/* Premium Banner */}
          <TouchableOpacity style={styles.premiumBanner} activeOpacity={0.8}>
            <View style={styles.premiumIconBox}>
              <Crown size={24} color="#D97706" />
            </View>
            <View style={styles.premiumTextBox}>
              <Text style={styles.premiumTitle}>Unlock AstroBaby Premium</Text>
              <Text style={styles.premiumSubtitle}>Get custom diet plans & expert 1-on-1s.</Text>
            </View>
            <ChevronRight size={20} color="#D97706" />
          </TouchableOpacity>

          {/* Section: My Journey */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>My Journey</Text>
            <View style={styles.cardGroup}>
              <SettingItem 
                icon={<Calendar size={22} color="#EC4899" />} 
                title="Pregnancy Details" 
                subtitle="Due date, current week"
              />
              <SettingItem 
                icon={<Heart size={22} color="#EC4899" />} 
                title="Partner Profile" 
                subtitle="Add partner to sync journey"
                isLast
              />
            </View>
          </View>

          {/* Section: Preferences */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Preferences</Text>
            <View style={styles.cardGroup}>
              <SettingItem 
                icon={<Globe size={22} color="#4B5563" />} 
                title="Language" 
                rightElement={<Text style={styles.languageValue}>English</Text>}
              />
              <SettingItem 
                icon={<Settings size={22} color="#4B5563" />} 
                title="Push Notifications" 
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
            <Text style={styles.sectionHeader}>Support & About</Text>
            <View style={styles.cardGroup}>
              <SettingItem 
                icon={<MessageCircle size={22} color="#10B981" />} 
                title="Chat with Us" 
                subtitle="24/7 Support from AstroBaby team"
              />
              <SettingItem 
                icon={<HelpCircle size={22} color="#4B5563" />} 
                title="Help Center & FAQs" 
              />
              <SettingItem 
                icon={<User size={22} color="#4B5563" />} 
                title="Terms of Service & Privacy" 
                isLast
              />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
            <LogOut size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          
          <Text style={styles.appVersion}>AstroBaby App Version 1.0.0</Text>

        </View>
      </ScrollView>
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
  }
});
