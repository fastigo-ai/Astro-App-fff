import { ISmsProvider, SendOtpResult, VerifyOtpResult } from './smsProvider.interface';
import { BYPASS_PHONE, BYPASS_OTP } from '../../../shared/config/constants';

interface StoredOtp {
  otp: string;
  expiresAt: number;
}

export class MockSmsProvider implements ISmsProvider {
  public name = 'mock';
  private otpStore = new Map<string, StoredOtp>();
  private readonly defaultTtlMs = 5 * 60 * 1000; // 5 minutes

  async sendOtp(phone: string, otp: string): Promise<SendOtpResult> {
    const isBypass = Boolean(BYPASS_PHONE && phone.endsWith(BYPASS_PHONE));
    const finalOtp = isBypass ? BYPASS_OTP : otp;
    const expiresAt = Date.now() + this.defaultTtlMs;

    this.otpStore.set(phone, { otp: finalOtp, expiresAt });

    console.log('\n======================================================');
    console.log(`[MockSmsProvider] 📱 SMS OUTGOING FOR: ${phone}`);
    console.log(`[MockSmsProvider] 🔑 ASTROBABY OTP CODE: [ ${finalOtp} ]`);
    console.log(`[MockSmsProvider] ⏳ TTL: 5 minutes (Expires at: ${new Date(expiresAt).toLocaleTimeString()})`);
    console.log('======================================================\n');

    return {
      success: true,
      message: isBypass
        ? 'OTP sent (bypass number detected from .env)'
        : 'OTP generated and sent successfully (development mode)',
      devOtp: process.env.NODE_ENV !== 'production' ? finalOtp : undefined,
      provider: 'mock',
    };
  }

  async verifyOtp(phone: string, otp: string): Promise<VerifyOtpResult> {
    // 1. Bypass number check from .env (always works with configured BYPASS_OTP)
    if (BYPASS_PHONE && BYPASS_OTP && phone.endsWith(BYPASS_PHONE) && otp === BYPASS_OTP) {
      return { valid: true, message: 'Bypass OTP verified successfully' };
    }

    const stored = this.otpStore.get(phone);
    if (!stored) {
      return { valid: false, message: 'No OTP requested for this phone number or it has expired.' };
    }

    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(phone);
      return { valid: false, message: 'OTP has expired. Please request a new code.' };
    }

    if (stored.otp !== otp) {
      return { valid: false, message: 'Incorrect OTP entered. Please try again.' };
    }

    // OTP matched - single use consumption
    this.otpStore.delete(phone);
    return { valid: true, message: 'OTP verified successfully' };
  }

  getStoredOtp(phone: string): string | undefined {
    const entry = this.otpStore.get(phone);
    return entry && Date.now() <= entry.expiresAt ? entry.otp : undefined;
  }

  clear() {
    this.otpStore.clear();
  }
}

export const mockSmsProvider = new MockSmsProvider();

