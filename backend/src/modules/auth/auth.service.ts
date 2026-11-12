import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start in production.');
}

const JWT_SECRET = process.env.JWT_SECRET || 'astrobaby-dev-secret-change-me';
const BYPASS_NUMBER = '9366128220';
const BYPASS_OTP = '1234';

export const authService = {
  sendOtp(phone: string) {
    if (phone === BYPASS_NUMBER) {
      console.log('[Backend] Bypass number detected. No actual SMS sent.');
      return { bypass: true, message: 'OTP sent (bypass)' };
    }
    console.log(`[Backend] Mock sending OTP to ${phone}`);
    return { bypass: false, message: 'OTP sent successfully' };
  },

  verifyOtp(phone: string, otp: string) {
    const isValid = phone === BYPASS_NUMBER ? otp === BYPASS_OTP : true;
    if (!isValid) return null;

    const payload = { id: 'usr_123', phone, role: 'user' };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
      isNewUser: true,
    };
  },

  async saveJourney(params: {
    userId: string;
    phone: string;
    stage: 'pregnant' | 'planning';
    lmp_date?: string;
    edd_date?: string;
    confirmed_month?: number;
    remaining_months?: number;
    planning_timeline?: string;
  }) {
    console.log(
      `[Backend] Saving Journey to Collection for user ${params.phone}: Stage=${params.stage}, Month=${params.confirmed_month}, Remaining=${params.remaining_months}`
    );

    return authRepository.upsertUserJourney(params.phone, {
      userId: params.userId,
      phone: params.phone,
      stage: params.stage,
      lmp_date: params.lmp_date,
      edd_date: params.edd_date,
      confirmed_month: params.confirmed_month ? Number(params.confirmed_month) : undefined,
      remaining_months: params.remaining_months ? Number(params.remaining_months) : undefined,
      planning_timeline: params.planning_timeline,
    });
  },

  refreshAccessToken(refreshToken: string): string | null {
    try {
      const decoded: any = jwt.verify(refreshToken, JWT_SECRET);
      const payload = { id: decoded.id, phone: decoded.phone, role: decoded.role };
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    } catch {
      return null;
    }
  },
};

