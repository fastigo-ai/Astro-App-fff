import { Router } from 'express';
import { krishnaController } from './krishna.controller';
import { optionalAuthMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.get('/plans', krishnaController.getKrishnaPlans);
router.post('/coupon/check', krishnaController.checkCoupon);
router.post('/installments/create', optionalAuthMiddleware, krishnaController.createInstallmentPlan);

router.post('/kundli/register', optionalAuthMiddleware, krishnaController.registerKundli);
router.get('/kundli/status', optionalAuthMiddleware, krishnaController.getKundliStatus);

router.get('/bal-sanskar/details', krishnaController.getBalSanskarDetails);
router.get('/preconceive/details', krishnaController.getPreconceiveDetails);
router.get('/live/sessions', optionalAuthMiddleware, krishnaController.getLiveSessions);

router.get('/referral/info', optionalAuthMiddleware, krishnaController.getReferralInfo);
router.get('/profile/medical', optionalAuthMiddleware, krishnaController.getMedicalProfile);
router.put('/profile/medical', optionalAuthMiddleware, krishnaController.updateMedicalProfile);
router.post('/activity/track', optionalAuthMiddleware, krishnaController.trackActivity);

export default router;

