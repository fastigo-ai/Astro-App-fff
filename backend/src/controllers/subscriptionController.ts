import { Request, Response, NextFunction } from 'express';
import { 
  UserJourneysCollection, 
  SubscriptionsCollection, 
  PaymentsCollection,
  executeAcidTransaction 
} from '../services/dbStore';
import { razorpayService } from '../services/razorpayService';

export const subscriptionController = {
  // GET /api/v1/subscription/plans
  getPlans: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || (req.query.phone as string) || '9366128220';
      
      // Look up user's saved journey from database collection
      const userJourney = await UserJourneysCollection.findOne({ phone });

      const stage = (req.query.stage as string) || userJourney?.stage || 'pregnant';
      let currentMonth = Number(req.query.month) || userJourney?.confirmed_month || 4;
      if (currentMonth < 1) currentMonth = 1;
      if (currentMonth > 9) currentMonth = 9;

      const remainingMonths = Math.max(1, 10 - currentMonth);

      // Dynamic calculation for Utkarsh (Full Plan) based on remaining pregnancy months
      // Standard 9-month full journey price is ₹4,499
      let utkarshPrice = 3499;
      if (remainingMonths <= 2) {
        utkarshPrice = 1199;
      } else if (remainingMonths <= 4) {
        utkarshPrice = 1799;
      } else if (remainingMonths <= 6) {
        utkarshPrice = 2499;
      } else if (remainingMonths <= 8) {
        utkarshPrice = 2999;
      } else {
        utkarshPrice = 3499;
      }

      const utkarshOriginal = 4499;
      const utkarshDiscount = Math.round(((utkarshOriginal - utkarshPrice) / utkarshOriginal) * 100);

      const aadharPrice = 1499;
      const aadharOriginal = 2499;
      const aadharDiscount = Math.round(((aadharOriginal - aadharPrice) / aadharOriginal) * 100);

      // ONLY 2 PLANS RETURNED: Utkarsh (Full) and Aadhar (Half)
      const plans = stage === 'pregnant' ? [
        {
          id: 'garbhsanskar-utkarsh',
          tier: 'full',
          name: 'Utkarsh (उत्कर्ष)',
          tagline: 'Complete Garbhsanskar Journey',
          badge: 'RECOMMENDED • BEST RESULTS',
          duration: `Till Delivery (~${remainingMonths} Months)`,
          durationMonths: remainingMonths,
          calculatedForMonth: currentMonth,
          originalPrice: utkarshOriginal,
          calculatedPrice: utkarshPrice,
          discountPercent: utkarshDiscount,
          monthlyRate: `₹${Math.round(utkarshPrice / remainingMonths)}/mo`,
          highlightText: `Tailored for Month ${currentMonth} (${remainingMonths} months left till birth)`,
          description: '360° complete Garbhsanskar for mother and unborn baby till happy delivery.',
          features: [
            `Full coverage for all remaining ${remainingMonths} months till delivery`,
            'Daily customized Vedic Garbhsanskar activities & shlokas',
            'Live Pregnancy Yoga & Meditation with certified gurus',
            'Trimester-wise Personalized Ayurvedic Diet & Nutrition Chart',
            'Monthly 1-on-1 Gynecologist & Ayurvedic Doctor consultations',
            'Garbh Samvad (Womb bonding audio & classical raagas)',
            'Baby Brain Stimulation kit & intellectual puzzles',
            '24/7 Medical & Astrological consultation chat'
          ]
        },
        {
          id: 'garbhsanskar-aadhar',
          tier: 'half',
          name: 'Aadhar (आधार)',
          tagline: 'Foundation Garbhsanskar Plan',
          badge: 'ESSENTIALS',
          duration: '3 Months Foundation',
          durationMonths: 3,
          calculatedForMonth: currentMonth,
          originalPrice: aadharOriginal,
          calculatedPrice: aadharPrice,
          discountPercent: aadharDiscount,
          monthlyRate: `₹${Math.round(aadharPrice / 3)}/mo`,
          highlightText: '3 Months core foundation',
          description: 'Core essential practices to give your baby the right Vedic beginnings.',
          features: [
            '3 Months daily Garbhsanskar routine',
            'Recorded Yoga & guided relaxation sessions',
            'Standard Ayurvedic pregnancy diet guidelines',
            'Weekly Live group Q&A with doctors',
            'Weekly Fetal Development progress tracking'
          ]
        }
      ] : [
        {
          id: 'garbhadhaan-utkarsh',
          tier: 'full',
          name: 'Utkarsh (उत्कर्ष)',
          tagline: 'Full Garbhadhaan Conception Plan',
          badge: 'BEST FOR FAST CONCEPTION',
          duration: '6 Months Preconception',
          durationMonths: 6,
          originalPrice: 4999,
          calculatedPrice: 2999,
          discountPercent: 40,
          monthlyRate: '₹500/mo',
          highlightText: 'Complete Beej Shuddhi & Fertility Detox',
          description: 'Holistic Ayurvedic & medical preconception preparation for both partners.',
          features: [
            '6 Months customized conception preparation',
            'Beej Shuddhi (Detox & egg/sperm quality enhancement)',
            'Ovulation & fertile window accurate tracker',
            'Couple Yoga & stress reduction meditation',
            'Doctor & Ayurvedic Vaidya 1-on-1 consultations'
          ]
        },
        {
          id: 'garbhadhaan-aadhar',
          tier: 'half',
          name: 'Aadhar (आधार)',
          tagline: 'Foundation Preconception Plan',
          badge: 'STARTER',
          duration: '3 Months Starter',
          durationMonths: 3,
          originalPrice: 2499,
          calculatedPrice: 1499,
          discountPercent: 40,
          monthlyRate: '₹499/mo',
          highlightText: '3 Months fertility routine',
          description: 'Essential guidance and lifestyle modifications for planned pregnancy.',
          features: [
            '3 Months preconception lifestyle guide',
            'Recorded fertility yoga & meditation',
            'Standard fertility-boosting diet chart',
            'Community Q&A with experts'
          ]
        }
      ];

      return res.status(200).json({
        success: true,
        data: {
          userStage: stage,
          confirmedMonth: currentMonth,
          remainingMonths,
          savedJourney: userJourney || null,
          plans
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/v1/subscription/razorpay/create-order
  createRazorpayOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId, tier, amount, month } = req.body;
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';

      const amountNumber = Number(amount) || 1799;
      const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      const order = await razorpayService.createOrder(amountNumber, receipt, {
        planId,
        tier,
        phone,
        userId,
        month
      });

      console.log(`[Razorpay] Created order ${order.id} for amount ₹${amountNumber} (${phone})`);

      return res.status(200).json({
        success: true,
        data: {
          orderId: order.id,
          amount: amountNumber,
          amountInPaise: order.amount,
          currency: order.currency,
          keyId: order.keyId,
          receipt
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/v1/subscription/razorpay/verify-payment (ACID Guaranteed)
  verifyRazorpayPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        planId,
        tier,
        planName,
        amount,
        durationMonths,
        month,
        method = 'upi'
      } = req.body;

      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';

      // 1. Verify Razorpay cryptographic signature
      const isValidSignature = razorpayService.verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValidSignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature from Razorpay. Verification failed.'
        });
      }

      // 2. Execute ACID transaction for Payments + Subscriptions + User Journey
      const transactionResult = await executeAcidTransaction(
        `Activate-Subscription-${phone}-${razorpay_payment_id}`,
        async () => {
          // Idempotency check: has this payment already been processed?
          const existingPayment = await PaymentsCollection.findOne({ paymentId: razorpay_payment_id });
          if (existingPayment) {
            console.log(`[ACID Transaction] Payment ${razorpay_payment_id} already exists. Returning current subscription.`);
            const existingSub = await SubscriptionsCollection.findOne({ paymentId: razorpay_payment_id });
            return { payment: existingPayment, subscription: existingSub };
          }

          const duration = Number(durationMonths) || 3;
          const now = new Date();
          const expires = new Date(now.getTime() + duration * 30 * 24 * 60 * 60 * 1000);

          // Insert atomic payment record
          const paymentRecord = await PaymentsCollection.insert({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            userId,
            phone,
            planId: planId || 'garbhsanskar-utkarsh',
            amount: Number(amount) || 1799,
            currency: 'INR',
            status: 'captured',
            method,
          });

          // Insert atomic subscription record
          const subscriptionRecord = await SubscriptionsCollection.insert({
            userId,
            phone,
            programId: (req.body.programId as string) || 'garbh_sanskar',
            planId: planId || 'garbhsanskar-utkarsh',
            tier: (tier as 'full' | 'half') || 'full',
            planName: planName || 'Utkarsh (उत्कर्ष)',
            amount: Number(amount) || 1799,
            currency: 'INR',
            durationMonths: duration,
            calculatedForMonth: Number(month) || undefined,
            unlockedModules: req.body.unlockedModules || ['kicks', 'bump', 'samvad', 'mood', 'activities', 'diet', 'doctor_chat'],
            status: 'active',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            activatedAt: now.toISOString(),
            expiresAt: expires.toISOString(),
          });

          // Atomically update user journey in database
          await UserJourneysCollection.upsert(
            { phone },
            {
              subscription_tier: (tier as 'full' | 'half') || 'full',
              subscription_status: 'active',
              last_subscribed_program: (req.body.programId as string) || 'garbh_sanskar'
            }
          );

          return { payment: paymentRecord, subscription: subscriptionRecord };
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Payment verified and subscription activated successfully',
        data: transactionResult
      });
    } catch (error) {
      console.error('[Subscription] verifyRazorpayPayment error:', error);
      next(error);
    }
  },

  // POST /api/v1/subscription/skip-trial
  skipTrial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';

      await UserJourneysCollection.upsert(
        { phone },
        {
          subscription_tier: 'trial',
          subscription_status: 'trial'
        }
      );

      console.log(`[Subscription] Free trial activated for user: ${phone}`);

      return res.status(200).json({
        success: true,
        message: '3-day free trial activated successfully',
        data: {
          status: 'trial',
          trialDays: 3
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Standard legacy subscribe endpoint
  subscribe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId, tier, amount, planName, durationMonths, month } = req.body;
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';

      const duration = Number(durationMonths) || 3;
      const now = new Date();
      const expires = new Date(now.getTime() + duration * 30 * 24 * 60 * 60 * 1000);

      const subscription = await SubscriptionsCollection.insert({
        userId,
        phone,
        planId: planId || 'garbhsanskar-utkarsh',
        tier: (tier as 'full' | 'half') || 'full',
        planName: planName || 'Utkarsh (उत्कर्ष)',
        amount: Number(amount) || 1799,
        currency: 'INR',
        durationMonths: duration,
        calculatedForMonth: Number(month) || undefined,
        status: 'active',
        activatedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: 'Subscription successfully activated',
        data: subscription
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/v1/subscription/status
  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || (req.query.phone as string) || '9366128220';

      const activeSub = await SubscriptionsCollection.findOne({ phone, status: 'active' });

      return res.status(200).json({
        success: true,
        data: {
          hasActiveSubscription: !!activeSub,
          subscription: activeSub || null
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
