import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '~/shared/api';

export type AuthStatus = 'idle' | 'sending_otp' | 'otp_sent' | 'verifying' | 'authenticated' | 'error';
export type AuthErrorReason = 'network' | 'invalid_phone' | 'invalid_otp' | 'expired_otp' | 'rate_limit_exceeded' | null;

export interface User {
  id: string;
  name: string;
  phone: string;
  lmp_date?: string;
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
  hasSeenIntro: boolean;
  otpRequestTimestamps: number[]; // For rate limiting
  subscriptionStatus: SubscriptionStatus;
  babyKicks: number;
  
  // Actions
  setHasLanguage: (val: boolean) => void;
  setHasProfile: (val: boolean, data?: { name: string; dob: string; city: string; state: string }) => void;
  setHasLifeStage: (val: boolean, stageId?: string, extraData?: any) => void;
  setHasSeenIntro: (val: boolean) => void;
  restoreSession: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resetState: () => void;
  logout: () => Promise<void>;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
  fetchSubscriptionStatus: () => Promise<void>;
  incrementBabyKicks: () => void;
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
  hasSeenIntro: false,
  otpRequestTimestamps: [],
  subscriptionStatus: 'none',
  babyKicks: 0,

  setHasLanguage: async (val: boolean) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_language', 'true');
    }
    set({ hasLanguage: val });
  },

  setHasProfile: async (val: boolean, data?: { name: string; dob: string; city: string; state: string }) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_profile', 'true');
      if (data) {
        await AsyncStorage.setItem('@garbhcompanion/profile_data', JSON.stringify(data));
        
        // Update user name in state
        set((state) => ({
          user: state.user ? { ...state.user, name: data.name } : { id: '1', phone: state.phoneNumber || '', name: data.name }
        }));
      }
    }
    set({ hasProfile: val });
  },

  setHasLifeStage: async (val: boolean, stageId?: string, extraData?: any) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_life_stage', 'true');
      if (stageId) {
        await AsyncStorage.setItem('@garbhcompanion/life_stage_data', stageId);
      }
      if (extraData) {
        await AsyncStorage.setItem('@garbhcompanion/life_stage_extra', JSON.stringify(extraData));
      }
    }
    
    // Also save to state so it's instantly available without reloading
    set((state) => ({ 
      hasLifeStage: val,
      user: state.user ? { ...state.user, lmp_date: extraData?.lmp_date } : null
    }));
  },

  setHasSeenIntro: async (val: boolean) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_seen_intro', 'true');
    }
    set({ hasSeenIntro: val });
  },

  restoreSession: async () => {
    const hasLang = await AsyncStorage.getItem('@garbhcompanion/has_language');
    const hasProf = await AsyncStorage.getItem('@garbhcompanion/has_profile');
    const hasLife = await AsyncStorage.getItem('@garbhcompanion/has_life_stage');
    const hasIntro = await AsyncStorage.getItem('@garbhcompanion/has_seen_intro');
    const hasSession = await AsyncStorage.getItem('@mock_session');
    const token = await AsyncStorage.getItem('@jwt_token');
    
    // Attempt to read saved profile data
    let profileData = null;
    if (hasProf) {
      const storedData = await AsyncStorage.getItem('@garbhcompanion/profile_data');
      if (storedData) profileData = JSON.parse(storedData);
    }
    
    let extraData = null;
    if (hasLife) {
      const storedExtra = await AsyncStorage.getItem('@garbhcompanion/life_stage_extra');
      if (storedExtra) extraData = JSON.parse(storedExtra);
    }
    
    if (hasSession === 'true' && token) {
      // Restore API token for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ 
        status: 'authenticated', 
        user: { 
          id: '1', 
          name: profileData?.name || 'New Mom', 
          phone: '',
          lmp_date: extraData?.lmp_date 
        },
        hasLanguage: !!hasLang,
        hasProfile: !!hasProf,
        hasLifeStage: !!hasLife,
        hasSeenIntro: !!hasIntro
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
    
    try {
      const response = await api.post('/api/v1/auth/send-otp', { phone });
      
      if (response.data.success) {
        set({ 
          status: 'otp_sent', 
          otpRequestTimestamps: [...recentRequests, now] 
        });
      } else {
        set({ status: 'error', errorReason: 'network' });
      }
    } catch (error) {
      set({ status: 'error', errorReason: 'network' });
    }
  },

  verifyOtp: async (otp: string) => {
    set({ status: 'verifying', errorReason: null });
    
    try {
      const { phoneNumber } = get();
      const response = await api.post('/api/v1/auth/verify-otp', { 
        phone: phoneNumber, 
        otp 
      });

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        
        // Setup API token for subsequent requests globally
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Save session locally
        await AsyncStorage.setItem('@mock_session', 'true');
        await AsyncStorage.setItem('@jwt_token', accessToken);
        if (refreshToken) {
          await AsyncStorage.setItem('@refresh_token', refreshToken);
        }
        
        const hasLang = await AsyncStorage.getItem('@garbhcompanion/has_language');
        const hasProf = await AsyncStorage.getItem('@garbhcompanion/has_profile');
        const hasLife = await AsyncStorage.getItem('@garbhcompanion/has_life_stage');
        const hasIntro = await AsyncStorage.getItem('@garbhcompanion/has_seen_intro');
        
        set({ 
          status: 'authenticated', 
          user: { id: '1', name: 'New Mom', phone: phoneNumber || '' },
          otpRequestTimestamps: [], // Reset on success
          hasLanguage: !!hasLang,
          hasProfile: !!hasProf,
          hasLifeStage: !!hasLife,
          hasSeenIntro: !!hasIntro
        });
      } else {
        set({ status: 'error', errorReason: 'invalid_otp' });
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        set({ status: 'error', errorReason: 'invalid_otp' });
      } else {
        set({ status: 'error', errorReason: 'network' });
      }
    }
  },

  resetState: () => set({ status: 'idle', errorReason: null }),

  logout: async () => {
    await AsyncStorage.removeItem('@mock_session');
    await AsyncStorage.removeItem('@jwt_token');
    await AsyncStorage.removeItem('@refresh_token');
    await AsyncStorage.removeItem('@garbhcompanion/has_language');
    await AsyncStorage.removeItem('@garbhcompanion/has_profile');
    await AsyncStorage.removeItem('@garbhcompanion/profile_data');
    await AsyncStorage.removeItem('@garbhcompanion/has_life_stage');
    await AsyncStorage.removeItem('@garbhcompanion/life_stage_data');
    await AsyncStorage.removeItem('@garbhcompanion/has_seen_intro');
    set({ status: 'idle', user: null, phoneNumber: null, subscriptionStatus: 'none', hasLanguage: false, hasProfile: false, hasLifeStage: false, hasSeenIntro: false });
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

  incrementBabyKicks: () => {
    set((state) => ({ babyKicks: state.babyKicks + 1 }));
  },
}));
