import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '~/app/navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, setErrorReason, setPhoneNumber, resetState } from '../store/authSlice';
import { RootState } from '../../../store';
import { Button } from '~/shared/components/Button';
import { Modal } from '~/shared/components/Modal';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry'>;

const COUNTRY_CODES = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
];

export const PhoneEntryScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isPickerVisible, setPickerVisible] = useState(false);
  
  const dispatch = useDispatch();
  const { status, errorReason } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  const handleSendOtp = async () => {
    const fullNumber = `${countryCode}${phone}`;
    
    // Update Redux state just in case other UI elements rely on it
    dispatch(setPhoneNumber(fullNumber));
    dispatch(setStatus('sending_otp'));
    dispatch(setErrorReason(null));
    
    // Call the actual backend via Zustand store
    const { useAuthStore } = require('~/store/useAuthStore');
    await useAuthStore.getState().sendOtp(fullNumber);
    
    const authStatus = useAuthStore.getState().status;
    
    if (authStatus === 'otp_sent') {
      dispatch(setStatus('otp_sent'));
      navigation.navigate('OtpVerification');
    } else {
      dispatch(setErrorReason('network_error'));
      dispatch(setStatus('error'));
    }
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* Modern Background Decor */}
          <View style={styles.bgDecorTop} />
          
          <View style={styles.content}>
            
            <View style={styles.logoWrapper}>
              <Image
                source={require('~/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Welcome to Astro Baby</Text>
              <Text style={styles.subtitle}>Enter your mobile number to get started</Text>
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity 
                style={styles.countrySelector}
                onPress={() => setPickerVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.flagIcon}>{selectedCountry?.flag}</Text>
                <Text style={styles.countryCodeText}>{countryCode}</Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TextInput 
                style={styles.input}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val.replace(/[^0-9]/g, ''));
                  if (errorReason) resetState();
                }}
                keyboardType="phone-pad"
                placeholder="Mobile number"
                placeholderTextColor="#9CA3AF"
                maxLength={15}
                selectionColor="#4F46E5"
              />
            </View>
            
            {(errorReason as string) === 'invalid_phone' && (
              <Text style={styles.errorText}>Please enter a valid phone number</Text>
            )}

            <Button 
              title="Continue" 
              onPress={handleSendOtp} 
              isLoading={status === 'sending_otp'} 
              disabled={phone.length < 5}
              style={StyleSheet.flatten([styles.submitBtn, phone.length < 5 && styles.submitBtnDisabled]) as any}
              textStyle={styles.submitBtnText}
            />

          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text>{' '}and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

        </View>
      </TouchableWithoutFeedback>

      {/* Country Code Modal */}
      <Modal visible={isPickerVisible} onClose={() => setPickerVisible(false)} title="Select Country">
        {COUNTRY_CODES.map((item) => (
          <TouchableOpacity 
            key={item.code} 
            style={styles.countryItem}
            onPress={() => {
              setCountryCode(item.code);
              setPickerVisible(false);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.countryItemFlag}>{item.flag}</Text>
              <Text style={styles.countryItemText}>{item.name}</Text>
            </View>
            <Text style={styles.countryItemCode}>{item.code}</Text>
          </TouchableOpacity>
        ))}
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' // Clean off-white background
  },
  bgDecorTop: {
    position: 'absolute',
    top: -width * 0.5,
    right: -width * 0.2,
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: '#EEF2FF', // Very subtle indigo tint
    opacity: 0.6,
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: width * 0.7,
    height: 100,
  },
  header: { 
    marginBottom: 80,
    alignItems: 'center',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280', 
    lineHeight: 22,
    textAlign: 'center',
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 64,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  flagIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCodeText: { 
    fontWeight: '600',
    fontSize: 16, 
    color: '#374151' 
  },
  chevron: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 6,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontWeight: '500',
    fontSize: 17,
    color: '#111827',
  },
  errorText: {
    fontWeight: '500',
    color: '#EF4444',
    fontSize: 13,
    marginTop: 10,
    marginLeft: 4,
  },
  submitBtn: { 
    backgroundColor: '#4F46E5', // Indigo primary
    borderRadius: 16,
    height: 60,
    marginTop: 32,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#C7D2FE',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontWeight: '700',
    fontSize: 17,
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  link: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryItemFlag: { fontSize: 24, marginRight: 12 },
  countryItemText: { fontSize: 16, color: '#111827', fontWeight: '500' },
  countryItemCode: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
});
