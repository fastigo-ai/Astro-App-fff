import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Linking, TouchableOpacity, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '~/app/navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setStatus, setErrorReason, resetState, setAuthenticated } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '~/shared/components/Button';
import SmsRetriever from 'react-native-sms-retriever';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(28);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
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
    // --- LOCAL MOCK BYPASS ---
    setTimeout(async () => {
      if (otpCode === '1234') { // Changed mock check back to 4 digits
        await AsyncStorage.setItem('@mock_session', 'true');
        dispatch(setAuthenticated({ isAuthenticated: true, isProfileComplete: true }));
      } else {
        dispatch(setErrorReason('invalid_otp'));
      }
    }, 1000);
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
          {/* Decorative Bubbles */}
          <View style={[styles.bubble, styles.bubble1]} />
          <View style={[styles.bubble, styles.bubble2]} />
          <View style={[styles.bubble, styles.bubble3]} />
          <View style={[styles.bubble, styles.bubble4]} />

          <View style={styles.inner}>
            
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>{'<'}</Text>
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
                      <Text style={styles.otpText}>{otp[index] || ''}</Text>
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
                />
              </View>

              {getErrorMessage() ? <Text style={styles.errorText}>{getErrorMessage()}</Text> : null}

              <View style={styles.resendContainer}>
                <Text style={styles.resendPrompt}>Didn't receive the code?</Text>
                {timer > 0 ? (
                  <Text style={styles.timerText}>Resend in {timer}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={errorReason === 'rate_limit_exceeded'}>
                    <Text style={styles.resendLink}>
                      {errorReason === 'rate_limit_exceeded' ? 'Too many attempts' : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Button 
                title="Verify & Proceed" 
                onPress={handleVerify} 
                isLoading={status === 'verifying'} 
                disabled={otp.length !== 4}
                style={styles.submitBtn}
                textStyle={styles.submitBtnText}
              />

              <TouchableOpacity style={styles.supportContainer} onPress={handleSupportFallback}>
                <Text style={styles.supportText}>❓ Need help? Contact support</Text>
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
    backgroundColor: '#FFE6DF' // Soft peach tone from screenshot
  },
  inner: { 
    flex: 1, 
    padding: 24,
    paddingTop: 50,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  title: { 
    fontFamily: 'serif',
    fontSize: 30, 
    fontWeight: '600', 
    color: '#1E90FF', 
    marginBottom: 16,
    textAlign: 'center'
  },
  subtitle: { 
    fontWeight: '400',
    fontSize: 16, 
    lineHeight: 24,
    color: '#333', 
    textAlign: 'center',
    marginBottom: 30,
  },
  phoneHighlight: {
    fontWeight: '500',
    color: '#111',
  },
  otpWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpBox: {
    width: 60,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F7EBE8', // Muted background color
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFilled: {
    backgroundColor: '#FFF',
  },
  otpBoxActive: {
    borderColor: '#1E90FF',
    backgroundColor: '#FFF',
  },
  otpText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  resendContainer: { 
    alignItems: 'center', 
    marginBottom: 30,
  },
  resendPrompt: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    fontWeight: '400',
  },
  timerText: { 
    fontSize: 15, 
    color: '#1E90FF',
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 15, 
    color: '#1E90FF',
    fontWeight: '500',
  },
  submitBtn: { 
    backgroundColor: '#1E90FF', // Bright blue
    borderRadius: 27,
    height: 54,
    width: '100%',
    marginBottom: 24,
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
  supportContainer: {
    paddingVertical: 10,
  },
  supportText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
});
