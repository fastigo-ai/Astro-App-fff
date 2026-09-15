import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '~/app/navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus, setErrorReason, setPhoneNumber, resetState } from '../store/authSlice';
import { RootState } from '../../../store';
import { Button } from '~/shared/components/Button';
import { Modal } from '~/shared/components/Modal';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry'>;

const COUNTRY_CODES = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'USA/Canada' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'Australia' },
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
    dispatch(setPhoneNumber(fullNumber));
    dispatch(setStatus('sending_otp'));
    dispatch(setErrorReason(null));
    
    // --- LOCAL MOCK BYPASS ---
    setTimeout(() => {
      dispatch(setStatus('otp_sent'));
      navigation.navigate('OtpVerification');
    }, 500);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Decorative Bubbles */}
          <View style={[styles.bubble, styles.bubble1]} />
          <View style={[styles.bubble, styles.bubble2]} />
          <View style={[styles.bubble, styles.bubble3]} />
          <View style={[styles.bubble, styles.bubble4]} />

          <View style={styles.inner}>
            
            <View style={styles.logoContainer}>
              <Image
                source={require('~/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <TouchableOpacity 
                  style={styles.countryPickerBtn}
                  onPress={() => setPickerVisible(true)}
                >
                  <Text style={styles.countryCodeText}>{countryCode} ▾</Text>
                </TouchableOpacity>

                <TextInput 
                  style={styles.input}
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val.replace(/[^0-9]/g, ''));
                    if (errorReason) resetState();
                  }}
                  keyboardType="phone-pad"
                  placeholder="Enter Number"
                  placeholderTextColor="#C4C4C4"
                  maxLength={15}
                />
              </View>
              {errorReason === 'invalid_phone' && <Text style={styles.errorText}>Invalid number</Text>}
            </View>

            <Button 
              title="Send OTP →" 
              onPress={handleSendOtp} 
              isLoading={status === 'sending_otp'} 
              disabled={phone.length < 5}
              style={styles.submitBtn}
              textStyle={styles.submitBtnText}
            />

            <View style={{ flex: 1 }} />

            <Text style={styles.footerText}>
              By continuing, you agree to our <Text style={styles.link}>Terms</Text>{'\n'}
              & <Text style={styles.link}>Privacy Policy</Text>
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
            <Text style={styles.countryItemText}>{item.name}</Text>
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
    backgroundColor: '#FFE6DF' // Soft peach tone from screenshot
  },
  inner: { 
    flex: 1, 
    padding: 24,
    paddingTop: 60,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
  },
  bubble1: {
    width: 250,
    height: 250,
    top: -80,
    right: -50,
  },
  bubble2: {
    width: 200,
    height: 200,
    bottom: 50,
    right: -80,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  bubble3: {
    width: 120,
    height: 120,
    bottom: -40,
    left: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  bubble4: {
    width: 80,
    height: 80,
    top: 150,
    left: -30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 280,
    height: 120,
  },
  header: { 
    alignItems: 'center',
    marginBottom: 30,
  },
  title: { 
    fontFamily: 'serif', // Or whatever serif font is available natively
    fontWeight: '600',
    fontSize: 28, 
    color: '#222', 
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: { 
    fontWeight: '400',
    fontSize: 15,
    color: '#333', 
    textAlign: 'center'
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontWeight: '500',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 54,
  },
  countryPickerBtn: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  countryCodeText: { 
    fontWeight: '500',
    fontSize: 15, 
    color: '#111' 
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontWeight: '400',
    fontSize: 15,
    color: '#111',
  },
  errorText: {
    fontWeight: '400',
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 6,
  },
  submitBtn: { 
    backgroundColor: '#1E90FF', // Bright blue
    borderRadius: 27,
    height: 54,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFF',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '500',
  },
  link: {
    color: '#1E90FF',
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  countryItemText: { fontSize: 16, color: '#333' },
  countryItemCode: { fontSize: 16, fontWeight: 'bold', color: '#1E90FF' },
});
