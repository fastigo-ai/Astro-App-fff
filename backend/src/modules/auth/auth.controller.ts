import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import {
  recordFailedOtpAttempt,
  clearOtpVerificationFailures,
} from '../../shared/middlewares/rateLimitMiddleware';

export const authController = {
  sendOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone } = req.body;
      if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

      const result = await authService.sendOtp(String(phone));
      return res.status(200).json({
        success: result.success,
        message: result.message,
        ...(result.devOtp ? { devOtp: result.devOtp } : {}),
      });
    } catch (error) {
      next(error);
    }
  },

  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({ success: false, error: 'Phone and OTP required' });
      }

      const result = await authService.verifyOtp(String(phone), String(otp));
      if (!result) {
        const { locked, remainingAttempts } = await recordFailedOtpAttempt(String(phone));
        if (locked) {
          return res.status(429).json({
            success: false,
            error: 'Account temporarily locked due to 5 consecutive failed OTP attempts. Please wait 15 minutes or request a fresh OTP.',
            code: 'ACCOUNT_TEMPORARILY_LOCKED',
            scope: 'account',
            retryAfter: 900,
          });
        }
        return res.status(401).json({
          success: false,
          error: `Invalid or expired OTP. ${remainingAttempts} attempt(s) remaining before temporary lockout.`,
          remainingAttempts,
        });
      }

      // Successful verification: clear failed count
      await clearOtpVerificationFailures(String(phone));

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  saveJourney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stage, lmp_date, edd_date, confirmed_month, remaining_months, planning_timeline } = req.body;
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';

      const savedRecord = await authService.saveJourney({
        userId,
        phone,
        stage,
        lmp_date,
        edd_date,
        confirmed_month: Number(confirmed_month) || undefined,
        remaining_months: Number(remaining_months) || undefined,
        planning_timeline,
      });

      return res.status(200).json({
        success: true,
        message: 'Journey details successfully saved to database collection',
        data: savedRecord,
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'No refresh token provided' });
      }

      const accessToken = authService.refreshAccessToken(String(refreshToken));
      if (!accessToken) {
        return res.status(403).json({ success: false, error: 'Invalid or expired refresh token' });
      }

      return res.status(200).json({ success: true, data: { accessToken } });
    } catch (error) {
      next(error);
    }
  },
};
