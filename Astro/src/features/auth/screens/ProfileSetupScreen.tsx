import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Button } from '~/shared/components/Button';
import { useAuthStore } from '~/store/useAuthStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '~/shared/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [city, setCity] = useState('');
  const setHasProfile = useAuthStore(state => state.setHasProfile);
  const setHasLanguage = useAuthStore(state => state.setHasLanguage);

  const handleNextStep = () => {
    // In a real app, you might validate the fields first.
    // For now, we'll save locally and proceed.
    setHasProfile(true, { name, dob, city });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      setDob(`${mm}/${dd}/${yyyy}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Background */}
      <View style={[styles.bubble, styles.bubble1]} />
      <View style={[styles.bubble, styles.bubble2]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setHasLanguage(false)}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressActive} />
            <View style={styles.progressInactive} />
          </View>
        </View>

        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>We use this to personalize your holistic journey.</Text>

        <View style={styles.card}>

          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoPlaceholder}>
              <Text style={styles.cameraIcon}>📸</Text>
            </TouchableOpacity>
            <Text style={styles.photoText}>Add a photo</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Jane Doe"
                placeholderTextColor="#A9A9A9"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity 
                style={[styles.input, { justifyContent: 'center' }]} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateText, !dob && styles.placeholderText]}>
                  {dob || 'mm/dd/yyyy '}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputIcon}>📍</Text>
                <TextInput 
                  style={[styles.input, styles.inputBorderless]} 
                  placeholder="e.g. San Francisco"
                  placeholderTextColor="#A9A9A9"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.partnerCard}>
              <View style={styles.partnerIconWrapper}>
                <Text style={styles.partnerIcon}>⚣</Text>
              </View>
              <View style={styles.partnerTextWrapper}>
                <Text style={styles.partnerTitle}>Partner's Details</Text>
                <Text style={styles.partnerSubtitle}>Optional combined alignment</Text>
              </View>
              <View style={styles.partnerChevronWrapper}>
                <Text style={styles.partnerChevron}>˅</Text>
              </View>
            </TouchableOpacity>

            <Button 
              title="Next Step →" 
              onPress={handleNextStep} 
              style={styles.submitBtn}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  bubble1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  bubble2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -100,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  backIcon: {
    fontSize: 28,
    color: '#FFF',
    lineHeight: 32,
    marginLeft: -2,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingRight: 56, // to balance the back button width
  },
  progressActive: {
    width: 32,
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  progressInactive: {
    width: 32,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    opacity: 0.7,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontFamily: 'Libre Caslon Text',
    fontWeight: '400',
    fontSize: 28,
    lineHeight: 36,
    color: '#1B1C1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DAB8C5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraIcon: {
    fontSize: 32,
  },
  photoText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.7,
    color: '#57423A',
  },
  input: {
    backgroundColor: '#F5F5F0',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
  },
  dateText: {
    fontSize: 16,
    color: '#111',
  },
  placeholderText: {
    color: '#A9A9A9',
  },
  inputWithIcon: {
    backgroundColor: '#F5F5F0',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  inputBorderless: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  submitBtn: {
    backgroundColor: '#1C77F2',
    borderRadius: 26,
    height: 52,
    marginTop: 10,
    shadowColor: '#1C77F2',
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0E5DF',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  partnerIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partnerIcon: {
    fontSize: 20,
    color: '#57423A',
  },
  partnerTextWrapper: {
    flex: 1,
  },
  partnerTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
    fontSize: 16,
    color: '#111',
    marginBottom: 2,
  },
  partnerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  partnerChevronWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerChevron: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
    marginTop: -2,
  },
});
