import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';

type Props = NativeStackScreenProps<AppStackParamList, 'GiftRedeem'>;
const { width } = Dimensions.get('window');

export const GiftRedeemScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Gift</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.giftBox}>
          <Text style={styles.giftEmoji}>🎁</Text>
        </View>
        <Text style={styles.title}>Congratulations, Mumma!</Text>
        <Text style={styles.subtitle}>
          You've unlocked a special gift to help you through your beautiful journey.
        </Text>
        
        <View style={styles.couponCard}>
          <Text style={styles.couponCode}>ASTROBABY50</Text>
          <Text style={styles.couponDesc}>Use this code to get 50% off your Garbhsanskar Routine</Text>
        </View>

        <TouchableOpacity style={styles.redeemButton} onPress={() => navigation.goBack()}>
          <Text style={styles.redeemButtonText}>Redeem Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginRight: 16,
  },
  backIcon: {
    fontSize: 22,
    color: '#374151',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  giftBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  giftEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  couponCard: {
    backgroundColor: '#EEF2FF',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 40,
    borderStyle: 'dashed',
  },
  couponCode: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 2,
    marginBottom: 8,
  },
  couponDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  redeemButton: {
    backgroundColor: '#EC4899', // Pink
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
