import { Request, Response } from 'express';
import { paymentService } from './payment.service';

export const paymentController = {
  createOrder: async (req: Request, res: Response) => {
    try {
      const { amount, currency = 'INR', receipt, notes = {} } = req.body;
      if (!amount) {
        return res.status(400).json({ success: false, error: 'Amount is required' });
      }

      const amountInPaise = Math.round(Number(amount));
      if (amountInPaise < 100) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be at least 100 paise (₹1.00)',
        });
      }

      const order = await paymentService.createCheckoutOrder({
        amount: amountInPaise,
        currency,
        receipt,
        notes,
      });

      return res.status(200).json({ success: true, ...order });
    } catch (error: any) {
      console.error('[Razorpay Create Order Error]:', error);
      if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR') {
        return res.status(401).json({
          success: false,
          error: error?.error?.description || 'Authentication with Razorpay failed',
        });
      }
      return res.status(500).json({
        success: false,
        error: error?.error?.description || error.message || 'Failed to create Razorpay order',
      });
    }
  },

  verifyPayment: (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          error:
            'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
        });
      }

      const result = paymentService.verifyCheckoutSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!result.configured) {
        return res.status(500).json({
          success: false,
          error: 'RAZORPAY_KEY_SECRET is not configured on the server',
        });
      }

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid payment signature. Payment verification failed.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });
    } catch (error: any) {
      console.error('[Razorpay Verify Payment Error]:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Payment signature verification failed',
      });
    }
  },
};

