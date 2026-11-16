import { Router } from 'express';
import { authController } from './auth.controller';
import { optionalAuthMiddleware } from '../../shared/middlewares/authMiddleware';
import { sendOtpRateLimiter, verifyOtpRateLimiter } from '../../shared/middlewares/rateLimitMiddleware';

const router = Router();

// Rate-limited OTP send (Per IP + Per Account / Phone + 30s Cooldown)
router.post('/send-otp', sendOtpRateLimiter, authController.sendOtp);

// Rate-limited OTP verify (Per IP + Failed Attempt Lockout)
router.post('/verify-otp', verifyOtpRateLimiter, authController.verifyOtp);

router.post('/refresh', authController.refreshToken);
router.post('/journey', optionalAuthMiddleware, authController.saveJourney);

export default router;

