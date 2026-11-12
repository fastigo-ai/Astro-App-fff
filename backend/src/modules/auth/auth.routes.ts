import { Router } from 'express';
import { authController } from './auth.controller';
import { optionalAuthMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/refresh', authController.refreshToken);
router.post('/journey', optionalAuthMiddleware, authController.saveJourney);

export default router;

