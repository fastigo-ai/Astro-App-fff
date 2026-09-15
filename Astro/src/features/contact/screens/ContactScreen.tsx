import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ContactScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    Linking.openURL('tel:+918320993257');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@astrobaby.com');
  };

  return (
    <View style={styles.container}>
      {/* Sleek Header */}
      <View style={[styles.header, { paddingTop: insets.top || 40 }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
            <Text style={styles.icon}>📞</Text>
          </View>
          <Text style={styles.cardTitle}>Give us a call</Text>
          <Text style={styles.cardDescription}>
            We're here to help you with any questions about your pregnancy journey.
          </Text>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3B82F6', shadowColor: '#3B82F6' }]} onPress={handleCall}>
            <Text style={styles.actionButtonText}>+91 8320993257</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
            <Text style={styles.icon}>✉️</Text>
          </View>
          <Text style={styles.cardTitle}>Send us an email</Text>
          <Text style={styles.cardDescription}>
            Have a detailed query or need technical support? Send us an email anytime.
          </Text>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981', shadowColor: '#10B981' }]} onPress={handleEmail}>
            <Text style={styles.actionButtonText}>support@astrobaby.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Modern off-white
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#334155',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
