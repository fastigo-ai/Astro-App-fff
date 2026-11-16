import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, ScrollView, Dimensions, BackHandler, Image as RNImage, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setHasProfile = useAuthStore(state => state.setHasProfile);
  const setHasLanguage = useAuthStore(state => state.setHasLanguage);

  const handlePickPhoto = async () => {
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
        setAvatar(uri);
        await useAuthStore.getState().setUserAvatar(uri);
      }
    } catch (err: any) {
      if (err?.message !== 'User cancelled image selection') {
        console.warn('Photo picker error:', err);
      }
    }
  };

  const handleBack = () => {
    setHasLanguage(false);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('LanguageSelect');
    }
    return true; // prevent default behavior
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  const handleNextStep = async () => {
    if (!name || !name.trim()) return; // Simple validation for now

    try {
      setIsLoading(true);
      // Sync to backend
      await api.post('/api/v1/profile/details', { name: name.trim(), dob, city, state: selectedState }).catch(() => {});
      
      // Update local state and immediately navigate to WelcomeCourseSelection
      await setHasProfile(true, { name: name.trim(), dob, city, state: selectedState });
      navigation.navigate('WelcomeCourseSelection');
    } catch (error) {
      console.error('Failed to save profile details:', error);
      await setHasProfile(true, { name: name.trim(), dob, city, state: selectedState });
      navigation.navigate('WelcomeCourseSelection');
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

        <Text style={styles.title}>{t('profileSetup.title')}</Text>
        <Text style={styles.subtitle}>{t('profileSetup.subtitle')}</Text>

        <View style={styles.card}>

          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.photoPlaceholder}
              onPress={handlePickPhoto}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t('profileSetup.addPhoto')}
            >
              {avatar ? (
                <RNImage source={{ uri: avatar }} style={styles.photoImage} />
              ) : (
                <Text style={styles.cameraIcon}>📸</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.photoText}>
              {avatar ? (t('profileSetup.changePhoto') || 'Change Photo') : t('profileSetup.addPhoto')}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('profileSetup.fullName')}</Text>
              <TextInput 
                style={styles.input} 
                placeholder={t('profileSetup.fullNamePlaceholder')}
                placeholderTextColor="#A9A9A9"
                value={name}
                onChangeText={setName}
                autoComplete="name"
                textContentType="name"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('profileSetup.dob')}</Text>
              <TouchableOpacity 
                style={[styles.input, { justifyContent: 'center' }]} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateText, !dob && styles.placeholderText]}>
                  {dob || t('profileSetup.dobPlaceholder')}
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
                label={t('profileSetup.state')}
                data={STATES_LIST}
                value={selectedState}
                onSelect={(val) => {
                  setSelectedState(val);
                  setCity(''); // Reset city when state changes
                }}
                placeholder={t('profileSetup.statePlaceholder')}
              />
            </View>

            <View style={styles.inputGroup}>
              <SearchableDropdown
                label={t('profileSetup.city')}
                data={selectedState ? INDIA_STATES_CITIES[selectedState] : []}
                value={city}
                onSelect={setCity}
                placeholder={selectedState ? t('profileSetup.cityPlaceholder') : t('profileSetup.selectStateFirst')}
                disabled={!selectedState}
              />
            </View>

            <Button 
              title={isLoading ? t('profileSetup.saving') : t('profileSetup.nextStep')} 
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
    overflow: 'hidden',
  },
  photoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
});
