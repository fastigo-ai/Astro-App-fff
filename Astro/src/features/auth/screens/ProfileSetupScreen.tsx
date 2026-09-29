import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, ScrollView, Dimensions, BackHandler } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '~/app/navigation/types';
import { Button } from '~/shared/components/Button';
import { useAuthStore } from '~/store/useAuthStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '~/shared/theme';
import { SearchableDropdown } from '~/shared/components/SearchableDropdown';
import { INDIA_STATES_CITIES, STATES_LIST } from '~/shared/data/india-states-cities';
import { api } from '~/shared/api';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AppStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setHasProfile = useAuthStore(state => state.setHasProfile);
  const setHasLanguage = useAuthStore(state => state.setHasLanguage);

  const handleBack = () => {
    setHasLanguage(false);
    return true; // prevent default behavior
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  const handleNextStep = async () => {
    if (!name) return; // Simple validation for now

    try {
      setIsLoading(true);
      // Sync to backend
      await api.post('/api/v1/profile/details', { name, dob, city, state: selectedState });
      
      // Update local state to advance to next screen
      setHasProfile(true, { name, dob, city, state: selectedState });
    } catch (error) {
      console.error('Failed to save profile details:', error);
      // Fallback to local state if backend is down during dev
      setHasProfile(true, { name, dob, city, state: selectedState });
    } finally {
      setIsLoading(false);
    }
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
      {/* Modern Background Decor */}
      <View style={styles.bgDecorTop} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.backIcon}>←</Text>
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
                autoComplete="name"
                textContentType="name"
                autoCorrect={false}
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
              <SearchableDropdown
                label="State"
                data={STATES_LIST}
                value={selectedState}
                onSelect={(val) => {
                  setSelectedState(val);
                  setCity(''); // Reset city when state changes
                }}
                placeholder="Select State"
              />
            </View>

            <View style={styles.inputGroup}>
              <SearchableDropdown
                label="City"
                data={selectedState ? INDIA_STATES_CITIES[selectedState] : []}
                value={city}
                onSelect={setCity}
                placeholder={selectedState ? "Select City" : "Select a State first"}
                disabled={!selectedState}
              />
            </View>

            <Button 
              title={isLoading ? "Saving..." : "Next Step →"} 
              onPress={handleNextStep} 
              isLoading={isLoading}
              style={styles.submitBtn}
              textStyle={styles.submitBtnText}
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
    backgroundColor: '#FAFAFA',
  },
  bgDecorTop: {
    position: 'absolute',
    top: -width * 0.5,
    right: -width * 0.2,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: '#EEF2FF',
    opacity: 0.6,
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
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingRight: 60, // balance the back button width
  },
  progressActive: {
    width: 32,
    height: 4,
    backgroundColor: '#4F46E5', // Indigo
    borderRadius: 2,
  },
  progressInactive: {
    width: 32,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF2FF', // Soft indigo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  cameraIcon: {
    fontSize: 32,
  },
  photoText: {
    fontSize: 14,
    color: '#4F46E5', // Indigo
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 54,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  inputWithIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 12,
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
    borderWidth: 0,
  },
  submitBtn: {
    backgroundColor: '#4F46E5', // Indigo
    borderRadius: 16,
    height: 60,
    marginTop: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  submitBtnText: {
    fontWeight: '700',
    fontSize: 17,
    color: '#FFFFFF',
  },
  submitBtnText: {
    fontWeight: '700',
    fontSize: 17,
    color: '#FFFFFF',
  },
});
