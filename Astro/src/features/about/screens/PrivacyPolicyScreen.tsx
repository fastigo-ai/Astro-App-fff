import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '~/shared/theme';

export const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 40 }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // @ts-ignore - Fallback
              navigation.navigate('MainTabs');
            }
          }}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Data Collection</Text>
          <Text style={styles.cardText}>
            We collect personal information that you provide to us such as name, address, contact information, passwords and security data, payment information, and social media login data. We may also collect health and wellness data that you choose to input for the purpose of personalized guidance.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Use of Information</Text>
          <Text style={styles.cardText}>
            The information we collect is used to personalize your experience, improve our platform, process your transactions, and provide customer service. Health data is used strictly to provide you with tailored Garbh Sanskar and spiritual guidance.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Data Protection</Text>
          <Text style={styles.cardText}>
            We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>4. Contact Us</Text>
          <Text style={styles.cardText}>
            If there are any questions regarding this privacy policy, you may contact us using the information in the Contact section of the app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 4,
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '500',
    color: '#000',
    lineHeight: 30,
    marginLeft: -2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 24,
  },
});
