import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthStatus = 'idle' | 'sending_otp' | 'otp_sent' | 'verifying' | 'authenticated' | 'error';
export type ErrorReason = 'invalid_otp' | 'expired_otp' | 'rate_limited' | 'network_error' | 'otp_send_failed' | null;

interface AuthState {
  status: AuthStatus;
  errorReason: ErrorReason;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  phoneNumber: string | null;
}

const initialState: AuthState = {
  status: 'idle',
  errorReason: null,
  isAuthenticated: false,
  isProfileComplete: false,
  phoneNumber: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.status = action.payload;
    },
    setErrorReason: (state, action: PayloadAction<ErrorReason>) => {
      state.errorReason = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<{ isAuthenticated: boolean; isProfileComplete?: boolean }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      if (action.payload.isProfileComplete !== undefined) {
        state.isProfileComplete = action.payload.isProfileComplete;
      }
      if (action.payload.isAuthenticated) {
        state.status = 'authenticated';
      }
    },
    logout: (state) => {
      state.status = 'idle';
      state.errorReason = null;
      state.isAuthenticated = false;
      state.isProfileComplete = false;
      state.phoneNumber = null;
    },
    resetState: (state) => {
      state.status = 'idle';
      state.errorReason = null;
    },
  },
});

export const { setStatus, setErrorReason, setPhoneNumber, setAuthenticated, logout, resetState } = authSlice.actions;

export default authSlice.reducer;
