import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthStatus = 'idle' | 'sending_otp' | 'otp_sent' | 'verifying' | 'authenticated' | 'error';
export type AuthErrorReason = 'network' | 'invalid_phone' | 'invalid_otp' | 'expired_otp' | 'rate_limit_exceeded' | null;

export interface User {
  id: string;
  name: string;
  phone: string;
}

export type SubscriptionStatus = 'active' | 'expired' | 'none';

interface AuthState {
  status: AuthStatus;
  errorReason: AuthErrorReason;
  user: User | null;
  phoneNumber: string | null;
  hasLanguage: boolean;
  hasProfile: boolean;
  hasLifeStage: boolean;
  otpRequestTimestamps: number[]; // For rate limiting
  subscriptionStatus: SubscriptionStatus;
  
  // Actions
  setHasLanguage: (val: boolean) => void;
  setHasProfile: (val: boolean, data?: { name: string; dob: string; city: string }) => void;
  setHasLifeStage: (val: boolean, stageId?: string) => void;
  restoreSession: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resetState: () => void;
  logout: () => Promise<void>;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
  fetchSubscriptionStatus: () => Promise<void>;
}

const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  errorReason: null,
  user: null,
  phoneNumber: null,
  hasLanguage: false,
  hasProfile: false,
  hasLifeStage: false,
  otpRequestTimestamps: [],
  subscriptionStatus: 'none',

  setHasLanguage: async (val: boolean) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_language', 'true');
    }
    set({ hasLanguage: val });
  },

  setHasProfile: async (val: boolean, data?: { name: string; dob: string; city: string }) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_profile', 'true');
      if (data) {
        await AsyncStorage.setItem('@garbhcompanion/profile_data', JSON.stringify(data));
      }
    }
    set({ hasProfile: val });
  },

  setHasLifeStage: async (val: boolean, stageId?: string) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_life_stage', 'true');
      if (stageId) {
        await AsyncStorage.setItem('@garbhcompanion/life_stage_data', stageId);
      }
    }
    set({ hasLifeStage: val });
  },

  restoreSession: async () => {
    const hasLang = await AsyncStorage.getItem('@garbhcompanion/has_language');
    const hasProf = await AsyncStorage.getItem('@garbhcompanion/has_profile');
    const hasLife = await AsyncStorage.getItem('@garbhcompanion/has_life_stage');
    const hasSession = await AsyncStorage.getItem('@mock_session');
    
    if (hasSession === 'true') {
      set({ 
        status: 'authenticated', 
        user: { id: '1', name: 'New Mom', phone: '' },
        hasLanguage: !!hasLang,
        hasProfile: !!hasProf,
        hasLifeStage: !!hasLife
      });
    } else {
      set({ status: 'idle', user: null });
    }
  },

  sendOtp: async (phone: string) => {
    const now = Date.now();
    const { otpRequestTimestamps } = get();
    
    // Filter timestamps to only those within the window
    const recentRequests = otpRequestTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    
    if (recentRequests.length >= RATE_LIMIT_COUNT) {
      set({ 
        status: 'error', 
        errorReason: 'rate_limit_exceeded',
        otpRequestTimestamps: recentRequests 
      });
      return;
    }

    set({ status: 'sending_otp', errorReason: null, phoneNumber: phone });
    
    // Mock API call
    return new Promise((resolve) => {
      const execute = () => {
        if (phone.length < 10) {
          set({ status: 'error', errorReason: 'invalid_phone' });
        } else if (phone === '+910000000000') {
           set({ status: 'error', errorReason: 'network' });
        } else {
          set({ 
            status: 'otp_sent', 
            otpRequestTimestamps: [...recentRequests, now] 
          });
        }
        resolve();
      };
      if (process.env.NODE_ENV === 'test') { execute(); } else { setTimeout(execute, 50); }
    });
  },

  verifyOtp: async (otp: string) => {
    set({ status: 'verifying', errorReason: null });
    
    // Mock API call
    return new Promise((resolve) => {
      const execute = async () => {
        if (otp === '000000') {
          set({ status: 'error', errorReason: 'expired_otp' });
        } else if (otp !== '1234') {
          set({ status: 'error', errorReason: 'invalid_otp' });
        } else {
          // Tokens handled by Firebase natively
          await AsyncStorage.setItem('@mock_session', 'true');
          
          const hasLang = await AsyncStorage.getItem('@garbhcompanion/has_language');
          const hasProf = await AsyncStorage.getItem('@garbhcompanion/has_profile');
          const hasLife = await AsyncStorage.getItem('@garbhcompanion/has_life_stage');
          
          set({ 
            status: 'authenticated', 
            user: { id: '1', name: 'New Mom', phone: get().phoneNumber || '' },
            otpRequestTimestamps: [], // Reset on success
            hasLanguage: !!hasLang,
            hasProfile: !!hasProf,
            hasLifeStage: !!hasLife
          });
        }
        resolve();
      };
      if (process.env.NODE_ENV === 'test') { execute(); } else { setTimeout(execute, 50); }
    });
  },

  resetState: () => set({ status: 'idle', errorReason: null }),

  logout: async () => {
    await AsyncStorage.removeItem('@mock_session');
    await AsyncStorage.removeItem('@garbhcompanion/has_language');
    await AsyncStorage.removeItem('@garbhcompanion/has_profile');
    await AsyncStorage.removeItem('@garbhcompanion/profile_data');
    await AsyncStorage.removeItem('@garbhcompanion/has_life_stage');
    await AsyncStorage.removeItem('@garbhcompanion/life_stage_data');
    set({ status: 'idle', user: null, phoneNumber: null, subscriptionStatus: 'none', hasLanguage: false, hasProfile: false, hasLifeStage: false });
  },

  setSubscriptionStatus: (status: SubscriptionStatus) => set({ subscriptionStatus: status }),

  fetchSubscriptionStatus: async () => {
    // Mock network delay for pull to refresh
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly assign 'active' or 'expired' in a real app, here we just keep it as is or default to none
        const current = get().subscriptionStatus;
        if (current === 'none') {
          // just mock it fetching something
          set({ subscriptionStatus: 'expired' });
        }
        resolve();
      }, 1000);
    });
  },
}));
