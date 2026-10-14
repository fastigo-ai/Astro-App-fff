import { Router } from 'express';
import { authController } from '../controllers/authController';
import { optionalAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/refresh', authController.refreshToken);

// Save user journey (authenticated or onboarding session)
router.post('/journey', optionalAuthMiddleware, authController.saveJourney);

export default router;
