import { Router } from 'express';
import { subscriptionController } from './subscription.controller';

const router = Router();

router.get('/plans', subscriptionController.getPlans);
router.post('/subscribe', subscriptionController.subscribe);
router.get('/status', subscriptionController.getStatus);

router.get('/programs', subscriptionController.getProgramSchemes);
router.get('/programs/:id', subscriptionController.getProgramSchemeById);

router.post('/admin/programs', subscriptionController.adminSaveProgramScheme);
router.put('/admin/programs/:id', subscriptionController.adminUpdateProgramScheme);
router.delete('/admin/programs/:id', subscriptionController.adminDeleteProgramScheme);

router.post('/razorpay/create-order', subscriptionController.createRazorpayOrder);
router.post('/razorpay/verify-payment', subscriptionController.verifyRazorpayPayment);
router.post('/skip-trial', subscriptionController.skipTrial);

export default router;

