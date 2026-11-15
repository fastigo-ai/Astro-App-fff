import { ISmsProvider, SendOtpResult, VerifyOtpResult } from './smsProvider.interface';
import { BYPASS_PHONE, BYPASS_OTP } from '../../../shared/config/constants';

interface StoredOtp {
  otp: string;
  expiresAt: number;
}

export class TwilioSmsProvider implements ISmsProvider {
  public name = 'twilio';
  private accountSid: string;
  private authToken: string;
  private serviceSid?: string;
  private fromPhoneNumber?: string;
  private localOtpStore = new Map<string, StoredOtp>();
  private readonly defaultTtlMs = 5 * 60 * 1000;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.serviceSid = process.env.TWILIO_SERVICE_SID || '';
    this.fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  isConfigured(): boolean {
    return Boolean(
      this.accountSid &&
      this.authToken &&
      (this.serviceSid || this.fromPhoneNumber)
    );
  }

  private getBasicAuthHeader(): string {
    const creds = `${this.accountSid}:${this.authToken}`;
    return `Basic ${Buffer.from(creds).toString('base64')}`;
  }

  private normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    // Default to +91 if 10 digits
    if (/^\d{10}$/.test(cleaned)) return `+91${cleaned}`;
    return `+${cleaned}`;
  }

  async sendOtp(phone: string, otp: string): Promise<SendOtpResult> {
    const formattedPhone = this.normalizePhone(phone);

    // Bypass check
    if (formattedPhone.endsWith(BYPASS_PHONE)) {
      console.log(`[TwilioSmsProvider] Bypass number ${formattedPhone} detected. Skipping Twilio dispatch.`);
      return {
        success: true,
        message: 'OTP sent (bypass)',
        devOtp: BYPASS_OTP,
        provider: 'twilio-bypass',
      };
    }

    if (!this.isConfigured()) {
      throw new Error(
        'Twilio credentials are incomplete. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either TWILIO_SERVICE_SID or TWILIO_PHONE_NUMBER.'
      );
    }

    try {
      // 1. If Twilio Verify Service SID is configured (Preferred)
      if (this.serviceSid) {
        console.log(`[TwilioSmsProvider] Dispatching verification via Twilio Verify Service to ${formattedPhone}...`);
        const endpoint = `https://verify.twilio.com/v2/Services/${this.serviceSid}/Verifications`;
        
        const params = new URLSearchParams();
        params.append('To', formattedPhone);
        params.append('Channel', 'sms');

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: this.getBasicAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const data: any = await response.json();

        if (!response.ok) {
          console.error('[TwilioSmsProvider] Twilio Verify API error:', data);
          return {
            success: false,
            message: data.message || 'Failed to send OTP via Twilio Verify',
            provider: 'twilio-verify',
          };
        }

        return {
          success: true,
          message: 'OTP sent successfully via SMS',
          provider: 'twilio-verify',
        };
      }

      // 2. Twilio Programmable Messaging (SMS API with local OTP code)
      if (this.fromPhoneNumber) {
        console.log(`[TwilioSmsProvider] Dispatching SMS via Twilio Messages API to ${formattedPhone}...`);
        const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;

        // Store OTP locally for verification
        this.localOtpStore.set(formattedPhone, {
          otp,
          expiresAt: Date.now() + this.defaultTtlMs,
        });

        const params = new URLSearchParams();
        params.append('From', this.fromPhoneNumber);
        params.append('To', formattedPhone);
        params.append('Body', `Your AstroBaby verification code is ${otp}. It will expire in 5 minutes.`);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: this.getBasicAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const data: any = await response.json();

        if (!response.ok) {
          console.error('[TwilioSmsProvider] Twilio Messaging API error:', data);
          return {
            success: false,
            message: data.message || 'Failed to send SMS via Twilio',
            provider: 'twilio-sms',
          };
        }

        return {
          success: true,
          message: 'OTP sent successfully via SMS',
          provider: 'twilio-sms',
        };
      }

      return {
        success: false,
        message: 'No Twilio service or phone number configured',
        provider: 'twilio',
      };
    } catch (error: any) {
      console.error('[TwilioSmsProvider] Network or API Exception:', error);
      return {
        success: false,
        message: error.message || 'Twilio SMS service unavailable',
        provider: 'twilio',
      };
    }
  }

  async verifyOtp(phone: string, otp: string): Promise<VerifyOtpResult> {
    const formattedPhone = this.normalizePhone(phone);

    // Bypass check
    if (formattedPhone.endsWith(BYPASS_PHONE) && otp === BYPASS_OTP) {
      return { valid: true, message: 'Bypass OTP verified' };
    }

    // 1. If Twilio Verify Service is used
    if (this.serviceSid) {
      try {
        const endpoint = `https://verify.twilio.com/v2/Services/${this.serviceSid}/VerificationCheck`;
        const params = new URLSearchParams();
        params.append('To', formattedPhone);
        params.append('Code', otp);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: this.getBasicAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const data: any = await response.json();

        if (response.ok && data.status === 'approved') {
          return { valid: true, message: 'Verification successful' };
        }

        return {
          valid: false,
          message: data.message || 'Invalid or expired OTP',
        };
      } catch (error: any) {
        console.error('[TwilioSmsProvider] Verify check exception:', error);
        return { valid: false, message: 'Failed to verify OTP with Twilio' };
      }
    }

    // 2. Local OTP verification (Twilio Messages API mode)
    const stored = this.localOtpStore.get(formattedPhone);
    if (!stored) {
      return { valid: false, message: 'No OTP requested for this phone number' };
    }

    if (Date.now() > stored.expiresAt) {
      this.localOtpStore.delete(formattedPhone);
      return { valid: false, message: 'OTP has expired. Please request a new code.' };
    }

    if (stored.otp !== otp) {
      return { valid: false, message: 'Incorrect OTP entered.' };
    }

    this.localOtpStore.delete(formattedPhone);
    return { valid: true, message: 'OTP verified successfully' };
  }
}

export const twilioSmsProvider = new TwilioSmsProvider();
