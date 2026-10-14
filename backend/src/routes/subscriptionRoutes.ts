import { Router } from 'express';
import { subscriptionController } from '../controllers/subscriptionController';

const router = Router();

router.get('/plans', subscriptionController.getPlans);
router.post('/subscribe', subscriptionController.subscribe);
router.get('/status', subscriptionController.getStatus);

// Razorpay & Trial routes
router.post('/razorpay/create-order', subscriptionController.createRazorpayOrder);
router.post('/razorpay/verify-payment', subscriptionController.verifyRazorpayPayment);
router.post('/skip-trial', subscriptionController.skipTrial);

export default router;
