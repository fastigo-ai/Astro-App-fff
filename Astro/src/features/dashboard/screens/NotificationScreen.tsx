import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Session Starting Soon! 🧘‍♀️', message: 'Your Pregnancy Yoga session with Rukmani begins in 15 minutes. Get ready!', time: '15 min ago', read: false, type: 'live' },
  { id: '2', title: 'New Garbh Sanskar Audio 🎵', message: 'We have added a beautiful new chanting audio for your 2nd month of pregnancy.', time: '2 hours ago', read: false, type: 'content' },
  { id: '3', title: 'Daily Tip: Nutrition 🍎', message: 'Remember to stay hydrated today! Drinking coconut water can help with morning sickness.', time: '1 day ago', read: true, type: 'tip' },
  { id: '4', title: 'Welcome to Astro Baby! ✨', message: 'Thank you for joining our community. We are excited to be part of your journey.', time: '3 days ago', read: true, type: 'system' },
];

export const NotificationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'live': return { icon: '🔴', bgColor: '#FFE4E6' }; // Soft Rose
      case 'content': return { icon: '🎧', bgColor: '#FEF3C7' }; // Soft Gold
      case 'tip': return { icon: '💡', bgColor: '#FFEDD5' }; // Soft Orange
      default: return { icon: '🔔', bgColor: '#F3E8FF' }; // Soft Purple
    }
  };

  return (
    <View style={styles.container}>
      {/* Sleek Header */}
      <View style={[styles.header, { paddingTop: insets.top || 40 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#374151" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.placeholder}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MOCK_NOTIFICATIONS.map((notif) => {
          const { icon, bgColor } = getIconForType(notif.type);
          return (
            <View key={notif.id} style={[styles.notifCard, notif.read && styles.notifCardRead]}>
              {!notif.read && <View style={styles.unreadDot} />}
              <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                <Text style={styles.icon}>{icon}</Text>
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, notif.read && styles.textRead]}>{notif.title}</Text>
                <Text style={[styles.notifMessage, notif.read && styles.textRead]} numberOfLines={2}>
                  {notif.message}
                </Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Soft creamy ethereal background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  backIcon: {
    fontSize: 22,
    color: '#374151',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  placeholder: {
    height: 40,
    justifyContent: 'center',
  },
  markAllText: {
    fontSize: 12,
    color: '#F59E0B', // Warm gold instead of blue
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9', // Warm white
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7', // Faint gold border
  },
  notifCardRead: {
    backgroundColor: '#FDFBF7', // Slightly muted cream
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EC4899', // Pink dot for unread
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  notifContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563', // Warm dark gray
    marginBottom: 4,
    paddingRight: 10,
  },
  notifMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  notifTime: {
    fontSize: 11,
    color: '#D97706', // Warm amber for time
    fontWeight: '600',
  },
  textRead: {
    color: '#9CA3AF',
  },
});
