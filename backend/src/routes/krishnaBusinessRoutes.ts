import { Router } from 'express';
import { krishnaBusinessController } from '../controllers/krishnaBusinessController';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// 1. Subscription & Month-Wise Pricing Plans (Krishna Coming Business Model)
router.get('/plans', krishnaBusinessController.getKrishnaPlans);
router.post('/coupon/check', krishnaBusinessController.checkCoupon);
router.post('/installments/create', optionalAuthMiddleware, krishnaBusinessController.createInstallmentPlan);

// 2. Garbh Kundli (Horoscope & Astrological guidance)
router.post('/kundli/register', optionalAuthMiddleware, krishnaBusinessController.registerKundli);
router.get('/kundli/status', optionalAuthMiddleware, krishnaBusinessController.getKundliStatus);

// 3. Bal Sanskar (Postnatal 0-2 Years)
router.get('/bal-sanskar/details', krishnaBusinessController.getBalSanskarDetails);

// 4. Preconception (Garbhadhan)
router.get('/preconceive/details', krishnaBusinessController.getPreconceiveDetails);

// 5. Live Classes & Mentoring Webinars
router.get('/live/sessions', krishnaBusinessController.getLiveSessions);

// 6. Refer & Earn
router.get('/referral/info', optionalAuthMiddleware, krishnaBusinessController.getReferralInfo);

// 7. Medical & Doctor Profile
router.get('/profile/medical', optionalAuthMiddleware, krishnaBusinessController.getMedicalProfile);
router.put('/profile/medical', optionalAuthMiddleware, krishnaBusinessController.updateMedicalProfile);

// 8. Activity Tracking (sync-video-tracking / sync-audio-tracking)
router.post('/activity/track', optionalAuthMiddleware, krishnaBusinessController.trackActivity);

export default router;
