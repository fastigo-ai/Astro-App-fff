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

export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'none';

export interface JourneyData {
  stage: 'pregnant' | 'planning';
  lmp_date?: string;
  edd_date?: string;
  confirmed_month?: number;
  remaining_months?: number;
  planning_timeline?: string;
}

interface AuthState {
  status: AuthStatus;
  errorReason: AuthErrorReason;
  user: User | null;
  phoneNumber: string | null;
  hasLanguage: boolean;
  hasProfile: boolean;
  hasLifeStage: boolean;
  hasSeenPricing: boolean;
  hasSeenIntro: boolean;
  journeyData: JourneyData | null;
  otpRequestTimestamps: number[]; // For rate limiting
  subscriptionStatus: SubscriptionStatus;
  subscribedPrograms: string[];
  activeSubscriptions: Record<string, any>;
  babyKicks: number;
  
  // Actions
  setHasLanguage: (val: boolean) => void;
  setHasProfile: (val: boolean, data?: { name: string; dob: string; city: string; state: string }) => void;
  setHasLifeStage: (val: boolean, stageId?: string, extraData?: any) => void;
  setHasSeenPricing: (val: boolean) => void;
  setHasSeenIntro: (val: boolean) => void;
  setJourneyData: (data: JourneyData) => void;
  restoreSession: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resetState: () => void;
  logout: () => Promise<void>;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
  fetchSubscriptionStatus: () => Promise<void>;
  incrementBabyKicks: () => void;
  isProgramSubscribed: (programId: string) => boolean;
  isModuleUnlocked: (moduleId: string) => boolean;
  subscribeToProgram: (programId: string, planDetails: any) => Promise<void>;
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
  hasSeenPricing: false,
  hasSeenIntro: false,
  journeyData: null,
  otpRequestTimestamps: [],
  subscriptionStatus: 'none',
  subscribedPrograms: [],
  activeSubscriptions: {},
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
    const jData = extraData ? { stage: (stageId as any) || 'pregnant', ...extraData } : null;
    set((state) => ({ 
      hasLifeStage: val,
      journeyData: jData || state.journeyData,
      user: state.user ? { ...state.user, lmp_date: extraData?.lmp_date } : null
    }));
  },

  setHasSeenPricing: async (val: boolean) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_seen_pricing', 'true');
    } else {
      await AsyncStorage.removeItem('@garbhcompanion/has_seen_pricing');
    }
    set({ hasSeenPricing: val });
  },

  setHasSeenIntro: async (val: boolean) => {
    if (val) {
      await AsyncStorage.setItem('@garbhcompanion/has_seen_intro', 'true');
    }
    set({ hasSeenIntro: val });
  },

  setJourneyData: (data: JourneyData) => {
    set({ journeyData: data });
  },

  restoreSession: async () => {
    const hasLang = await AsyncStorage.getItem('@garbhcompanion/has_language');
    const hasProf = await AsyncStorage.getItem('@garbhcompanion/has_profile');
    const hasLife = await AsyncStorage.getItem('@garbhcompanion/has_life_stage');
    const hasPricing = await AsyncStorage.getItem('@garbhcompanion/has_seen_pricing');
    const hasIntro = await AsyncStorage.getItem('@garbhcompanion/has_seen_intro');
    const storedSub = await AsyncStorage.getItem('@garbhcompanion/subscription_status');
    const hasSession = await AsyncStorage.getItem('@mock_session');
    const token = await AsyncStorage.getItem('@jwt_token');
    
    // Attempt to read saved profile data
    let profileData = null;
    if (hasProf) {
      const storedData = await AsyncStorage.getItem('@garbhcompanion/profile_data');
      if (storedData) profileData = JSON.parse(storedData);
    }
    
    let extraData = null;
    const stageId = await AsyncStorage.getItem('@garbhcompanion/life_stage_data');
    if (hasLife) {
      const storedExtra = await AsyncStorage.getItem('@garbhcompanion/life_stage_extra');
      if (storedExtra) extraData = JSON.parse(storedExtra);
    }

    const jData: JourneyData | null = extraData ? { stage: (stageId as any) || 'pregnant', ...extraData } : null;
    
    const storedPrograms = await AsyncStorage.getItem('@garbhcompanion/subscribed_programs');
    const storedActiveSubs = await AsyncStorage.getItem('@garbhcompanion/active_subscriptions');
    let parsedPrograms: string[] = [];
    let parsedActiveSubs: Record<string, any> = {};
    if (storedPrograms) {
      try { parsedPrograms = JSON.parse(storedPrograms); } catch (e) {}
    }
    if (storedActiveSubs) {
      try { parsedActiveSubs = JSON.parse(storedActiveSubs); } catch (e) {}
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
        hasSeenPricing: !!hasPricing,
        hasSeenIntro: !!hasIntro,
        journeyData: jData,
        subscriptionStatus: (storedSub as any) || 'none',
        subscribedPrograms: parsedPrograms,
        activeSubscriptions: parsedActiveSubs,
      });
    } else {
      set({ 
        status: 'idle', 
        user: null, 
        subscribedPrograms: parsedPrograms,
        activeSubscriptions: parsedActiveSubs,
        subscriptionStatus: (storedSub as any) || 'none' 
      });
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
        const hasPricing = await AsyncStorage.getItem('@garbhcompanion/has_seen_pricing');
        const hasIntro = await AsyncStorage.getItem('@garbhcompanion/has_seen_intro');
        
        set({ 
          status: 'authenticated', 
          user: { id: '1', name: 'New Mom', phone: phoneNumber || '' },
          otpRequestTimestamps: [], // Reset on success
          hasLanguage: !!hasLang,
          hasProfile: !!hasProf,
          hasLifeStage: !!hasLife,
          hasSeenPricing: !!hasPricing,
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
    await AsyncStorage.removeItem('@garbhcompanion/life_stage_extra');
    await AsyncStorage.removeItem('@garbhcompanion/has_seen_pricing');
    await AsyncStorage.removeItem('@garbhcompanion/has_seen_intro');
    await AsyncStorage.removeItem('@garbhcompanion/subscription_status');
    set({ 
      status: 'idle', 
      user: null, 
      phoneNumber: null, 
      subscriptionStatus: 'none', 
      hasLanguage: false, 
      hasProfile: false, 
      hasLifeStage: false, 
      hasSeenPricing: false, 
      hasSeenIntro: false,
      journeyData: null 
    });
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

  isProgramSubscribed: (programId: string) => {
    const { subscriptionStatus, subscribedPrograms } = get();
    // Default garbh_sanskar is active if general subscriptionStatus is active
    if (programId === 'garbh_sanskar' && subscriptionStatus === 'active') {
      return true;
    }
    return subscribedPrograms.includes(programId);
  },

  isModuleUnlocked: (moduleId: string) => {
    const { subscriptionStatus, subscribedPrograms, activeSubscriptions } = get();
    // If full Garbhsanskar subscription is active, default modules are unlocked
    if (subscriptionStatus === 'active') return true;

    // Check specific module against all active program subscriptions
    for (const progId of subscribedPrograms) {
      const sub = activeSubscriptions[progId];
      if (sub && Array.isArray(sub.unlockedModules) && sub.unlockedModules.includes(moduleId)) {
        return true;
      }
    }
    return false;
  },

  subscribeToProgram: async (programId: string, planDetails: any) => {
    const { subscribedPrograms, activeSubscriptions } = get();
    const updatedPrograms = Array.from(new Set([...subscribedPrograms, programId]));
    const updatedActiveSubs = {
      ...activeSubscriptions,
      [programId]: {
        ...planDetails,
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (planDetails?.durationMonths || 3) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    await AsyncStorage.setItem('@garbhcompanion/subscribed_programs', JSON.stringify(updatedPrograms));
    await AsyncStorage.setItem('@garbhcompanion/active_subscriptions', JSON.stringify(updatedActiveSubs));
    await AsyncStorage.setItem('@garbhcompanion/subscription_status', 'active');

    set({
      subscribedPrograms: updatedPrograms,
      activeSubscriptions: updatedActiveSubs,
      subscriptionStatus: 'active',
    });
  },
}));
