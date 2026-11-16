import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';
import { smsProvider } from './sms/smsProviderFactory';
import { JWT_SECRET } from '../../shared/config/constants';

export const authService = {
  async sendOtp(phone: string) {
    const cleaned = phone.trim();
    // 4-digit OTP for mobile input
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    return smsProvider.sendOtp(cleaned, generatedOtp);
  },

  async verifyOtp(phone: string, otp: string) {
    const cleaned = phone.trim();
    const verification = await smsProvider.verifyOtp(cleaned, otp.trim());

    if (!verification.valid) {
      return null;
    }

    // Check if user already exists
    let user = await authRepository.findByPhone(cleaned);

    if (!user) {
      const generatedUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      user = await authRepository.upsertUserJourney(cleaned, {
        userId: generatedUserId,
        phone: cleaned,
        is_deleted: false,
      });
    } else if (user.is_deleted) {
      // Reactivate returning user if previously soft-deleted (fresh onboarding flow)
      user = await authRepository.upsertUserJourney(cleaned, {
        is_deleted: false,
        deleted_at: undefined,
        deletion_reason: undefined,
        name: '', // reset name so user goes through fresh onboarding form
        stage: undefined,
        confirmed_month: undefined,
        remaining_months: undefined,
        subscription_status: 'none',
      });
      console.log(`[Reactivation] Soft-deleted user ${cleaned} reactivated upon successful OTP verification.`);
    }

    // A user is considered a new user if their profile (e.g. name) is not yet set
    const hasProfile = Boolean(user.name && user.name.trim().length > 0);
    const hasLifeStage = Boolean(user.stage);
    const isNewUser = !hasProfile;

    const payload = {
      id: user.userId || user._id || `usr_${Date.now()}`,
      phone: user.phone || cleaned,
      role: 'user',
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
      isNewUser,
      user: {
        id: user.userId || user._id,
        phone: user.phone || cleaned,
        name: user.name || '',
        dob: user.dob || '',
        city: user.city || '',
        state: user.state || '',
        language: user.language || 'en',
        stage: user.stage,
        lmp_date: user.lmp_date,
        edd_date: user.edd_date,
        confirmed_month: user.confirmed_month,
        remaining_months: user.remaining_months,
        hasProfile,
        hasLifeStage,
        subscriptionStatus: user.subscription_status || 'none',
      },
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
