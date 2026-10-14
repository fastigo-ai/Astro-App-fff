import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Linking, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '~/app/navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setStatus, setErrorReason, resetState, setAuthenticated } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '~/shared/components/Button';
import SmsRetriever from 'react-native-sms-retriever';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(28);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const { status, errorReason, phoneNumber } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for native SMS Retriever events
  useEffect(() => {
    const startSmsListener = async () => {
      try {
        if (!SmsRetriever || !SmsRetriever.startSmsRetriever) return;
        const registered = await SmsRetriever.startSmsRetriever();
        if (registered) {
          SmsRetriever.addSmsListener(event => {
            if (event && event.message) {
              const otpMatch = /(\d{4})/.exec(event.message); // 4 digits
              if (otpMatch && otpMatch[1]) {
                setOtp(otpMatch[1]);
                handleVerifyWithOtp(otpMatch[1]);
              }
            }
          });
        }
      } catch (error) {
        console.log('SMS Retriever not available or failed', error);
      }
    };
    startSmsListener();
    return () => SmsRetriever.removeSmsListener();
  }, []);

  useEffect(() => {
    if (errorReason === 'invalid_otp' || errorReason === 'expired_otp') {
      setFailedAttempts(prev => prev + 1);
    }
  }, [errorReason]);

  const handleVerifyWithOtp = async (otpCode: string) => {
    dispatch(setStatus('verifying'));
    
    const { useAuthStore } = require('~/store/useAuthStore');
    
    // Call the real backend via Zustand store
    await useAuthStore.getState().verifyOtp(otpCode);
    
    // Check if it was successful
    const authStatus = useAuthStore.getState().status;
    
    if (authStatus === 'authenticated') {
      setIsSuccess(true);
      dispatch(setAuthenticated({ isAuthenticated: true })); // Fix missing payload
    } else {
      dispatch(setErrorReason('invalid_otp'));
    }
  };

  const handleVerify = () => {
    if (otp.length === 4) {
      handleVerifyWithOtp(otp);
    }
  };

  const handleResend = async () => {
    if (phoneNumber) {
      dispatch(resetState());
      // --- LOCAL MOCK BYPASS ---
      setTimeout(() => {
        setTimer(28);
      }, 500);
    }
  };

  const handleSupportFallback = () => {
    Linking.openURL(`whatsapp://send?text=Hello GarbhCompanion Support, I need help logging in with number ${phoneNumber}&phone=919999999999`);
  };

  const getErrorMessage = () => {
    if (errorReason === 'invalid_otp') return 'Incorrect OTP entered.';
    if (errorReason === 'expired_otp') return 'OTP has expired. Please request a new one.';
    return undefined;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* Modern Background Decor matching first screen */}
          <View style={styles.bgDecorTop} />

          <View style={styles.inner}>
            
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.content}>
              
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>💬</Text>
              </View>

              <Text style={styles.title}>Verify Phone</Text>
              <Text style={styles.subtitle}>
                We have sent a 4-digit code to{'\n'}
                <Text style={styles.phoneHighlight}>{phoneNumber || '+91 620009993'}</Text>
              </Text>

              {/* OTP Input Boxes */}
              <View style={styles.otpWrapper}>
                <View style={styles.otpBoxesContainer}>
                  {[0, 1, 2, 3].map((index) => (
                    <View key={index} style={[
                      styles.otpBox, 
                      otp.length === index && styles.otpBoxActive,
                      otp.length > index && styles.otpBoxFilled
                    ]}>
                      <Text style={[
                        styles.otpText,
                        otp.length > index && styles.otpTextFilled
                      ]}>{otp[index] || ''}</Text>
                    </View>
                  ))}
                </View>
                <TextInput
                  value={otp}
                  onChangeText={(val) => {
                    setOtp(val.replace(/[^0-9]/g, ''));
                    if (errorReason) resetState();
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                  style={styles.hiddenInput}
                  autoFocus
                />
              </View>

              {getErrorMessage() ? <Text style={styles.errorText}>{getErrorMessage()}</Text> : null}

              <View style={styles.resendContainer}>
                <Text style={styles.resendPrompt}>Didn't receive the code?</Text>
                {timer > 0 ? (
                  <Text style={styles.timerText}>Resend in {timer}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={(errorReason as string) === 'rate_limit_exceeded'}>
                    <Text style={styles.resendLink}>
                      {(errorReason as string) === 'rate_limit_exceeded' ? 'Too many attempts' : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {isSuccess ? (
                <View style={styles.successContainer}>
                  <Text style={styles.successIcon}>✅</Text>
                  <Text style={styles.successText}>Verification Successful!</Text>
                </View>
              ) : (
                <Button 
                  title="Verify & Proceed" 
                  onPress={handleVerify} 
                  isLoading={status === 'verifying' && !isSuccess} 
                  disabled={otp.length !== 4}
                  style={StyleSheet.flatten([styles.submitBtn, otp.length !== 4 && styles.submitBtnDisabled]) as any}
                  textStyle={styles.submitBtnText}
                />
              )}

              <TouchableOpacity style={styles.supportContainer} onPress={handleSupportFallback}>
                <Text style={styles.supportText}>Need help? Contact support</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFAFA' // Clean off-white background matching screen 1
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
  inner: { 
    flex: 1, 
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  backButtonText: {
    fontSize: 22,
    color: '#374151',
    marginTop: -2,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconText: {
    fontSize: 32,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: { 
    fontWeight: '400',
    fontSize: 15, 
    lineHeight: 24,
    color: '#6B7280', 
    textAlign: 'center',
    marginBottom: 40,
  },
  phoneHighlight: {
    fontWeight: '600',
    color: '#111827',
  },
  otpWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 24,
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpBox: {
    width: 64,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  otpBoxFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4F46E5', // Indigo from brand
    shadowOpacity: 0.05,
  },
  otpBoxActive: {
    borderColor: '#EC4899', // Pink accent from the logo for active state
    backgroundColor: '#FFFFFF',
    shadowColor: '#EC4899',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  otpText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  otpTextFilled: {
    color: '#111827',
    fontWeight: '700',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
    fontWeight: '500',
  },
  resendContainer: { 
    alignItems: 'center', 
    marginBottom: 40,
  },
  resendPrompt: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '400',
  },
  timerText: { 
    fontSize: 15, 
    color: '#4F46E5',
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 15, 
    color: '#EC4899', // Pink accent for links
    fontWeight: '600',
  },
  submitBtn: { 
    backgroundColor: '#4F46E5', // Indigo primary
    borderRadius: 16,
    height: 60,
    width: '100%',
    marginBottom: 24,
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
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5', // Soft green background
    borderRadius: 16,
    height: 60,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  successIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  successText: {
    fontWeight: '700',
    fontSize: 17,
    color: '#059669', // Emerald green text
  },
  supportContainer: {
    paddingVertical: 10,
  },
  supportText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
