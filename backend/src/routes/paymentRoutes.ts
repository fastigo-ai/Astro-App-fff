import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Lazy getter for Razorpay client using environment variables
const getRazorpayClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials not configured in environment variables');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request body: { amount (in paise or rupees), currency, receipt }
 * Minimum amount: 100 paise
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    let { amount, currency = 'INR', receipt, notes = {} } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required',
      });
    }

    // Convert amount to integer paise if passed as decimal/rupees
    let amountInPaise = Math.round(Number(amount));
    if (amountInPaise < 100) {
      // If user passed e.g. 50 (rupees), 50 * 100 = 5000 paise
      // But if user passed 0.5 (50 paise), it is under 100 paise
      return res.status(400).json({
        success: false,
        error: 'Amount must be at least 100 paise (₹1.00)',
      });
    }

    const receiptId = receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const razorpay = getRazorpayClient();

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receiptId,
      notes,
    });

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error('[Razorpay Create Order Error]:', error);

    // Authentication failure with Razorpay
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
});

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment
 * Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
router.post('/verify-payment', (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(500).json({
        success: false,
        error: 'RAZORPAY_KEY_SECRET is not configured on the server',
      });
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isMatch =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!isMatch) {
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
});

export default router;
