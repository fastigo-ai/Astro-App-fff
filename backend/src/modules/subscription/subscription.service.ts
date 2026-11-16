import { executeAcidTransaction } from '../../shared/db/dbStore';
import { paymentRepository } from '../payment/payment.repository';
import { razorpayService } from '../payment/payment.service';
import {
  programSchemeRepository,
  subscriptionRepository,
} from './subscription.repository';

export const subscriptionService = {
  async getPlans(params: { phone: string; stage?: string; month?: number }) {
    const userJourney = await subscriptionRepository.findJourneyByPhone(params.phone);
    const stage = params.stage || userJourney?.stage || 'pregnant';
    let currentMonth = params.month || userJourney?.confirmed_month || 4;
    if (currentMonth < 1) currentMonth = 1;
    if (currentMonth > 9) currentMonth = 9;

    const remainingMonths = Math.max(1, 10 - currentMonth);

    let utkarshPrice = 3499;
    if (remainingMonths <= 2) utkarshPrice = 1199;
    else if (remainingMonths <= 4) utkarshPrice = 1799;
    else if (remainingMonths <= 6) utkarshPrice = 2499;
    else if (remainingMonths <= 8) utkarshPrice = 2999;

    const utkarshOriginal = 4499;
    const utkarshDiscount = Math.round(((utkarshOriginal - utkarshPrice) / utkarshOriginal) * 100);

    const aadharPrice = 1499;
    const aadharOriginal = 2499;
    const aadharDiscount = Math.round(((aadharOriginal - aadharPrice) / aadharOriginal) * 100);

    const plans =
      stage === 'pregnant'
        ? [
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
                '24/7 Medical & Astrological consultation chat',
              ],
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
                'Weekly Fetal Development progress tracking',
              ],
            },
          ]
        : [
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
                'Doctor & Ayurvedic Vaidya 1-on-1 consultations',
              ],
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
                'Community Q&A with experts',
              ],
            },
          ];

    return {
      userStage: stage,
      confirmedMonth: currentMonth,
      remainingMonths,
      savedJourney: userJourney || null,
      plans,
    };
  },

  async createRazorpayOrder(params: {
    planId?: string;
    tier?: string;
    amount: number;
    month?: number;
    phone: string;
    userId: string;
  }) {
    const amountNumber = Number(params.amount) || 1799;
    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const order = await razorpayService.createOrder(amountNumber, receipt, {
      planId: params.planId,
      tier: params.tier,
      phone: params.phone,
      userId: params.userId,
      month: params.month,
    });

    console.log(`[Razorpay] Created order ${order.id} for amount ₹${amountNumber} (${params.phone})`);

    return {
      orderId: order.id,
      amount: amountNumber,
      amountInPaise: order.amount,
      currency: order.currency,
      keyId: order.keyId,
      receipt,
    };
  },

  async verifyRazorpayPayment(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId?: string;
    tier?: string;
    planName?: string;
    amount?: number;
    durationMonths?: number;
    month?: number;
    method?: string;
    programId?: string;
    unlockedModules?: string[];
    phone: string;
    userId: string;
  }) {
    const isValidSignature = razorpayService.verifySignature(
      params.razorpay_order_id,
      params.razorpay_payment_id,
      params.razorpay_signature
    );

    if (!isValidSignature) return { valid: false as const };

    const transactionResult = await executeAcidTransaction(
      `Activate-Subscription-${params.phone}-${params.razorpay_payment_id}`,
      async () => {
        const existingPayment = await paymentRepository.findOne({
          paymentId: params.razorpay_payment_id,
        });
        if (existingPayment) {
          console.log(
            `[ACID Transaction] Payment ${params.razorpay_payment_id} already exists. Returning current subscription.`
          );
          const existingSub = await subscriptionRepository.findByPaymentId(
            params.razorpay_payment_id
          );
          return { payment: existingPayment, subscription: existingSub };
        }

        const duration = Number(params.durationMonths) || 3;
        const now = new Date();
        const expires = new Date(now.getTime() + duration * 30 * 24 * 60 * 60 * 1000);

        const paymentRecord = await paymentRepository.create({
          orderId: params.razorpay_order_id,
          paymentId: params.razorpay_payment_id,
          signature: params.razorpay_signature,
          userId: params.userId,
          phone: params.phone,
          planId: params.planId || 'garbhsanskar-utkarsh',
          amount: Number(params.amount) || 1799,
          currency: 'INR',
          status: 'captured',
          method: params.method || 'upi',
        });

        const subscriptionRecord = await subscriptionRepository.create({
          userId: params.userId,
          phone: params.phone,
          programId: params.programId || 'garbh_sanskar',
          planId: params.planId || 'garbhsanskar-utkarsh',
          tier: (params.tier as 'full' | 'half') || 'full',
          planName: params.planName || 'Utkarsh (उत्कर्ष)',
          amount: Number(params.amount) || 1799,
          currency: 'INR',
          durationMonths: duration,
          calculatedForMonth: Number(params.month) || undefined,
          unlockedModules:
            params.unlockedModules || [
              'kicks',
              'bump',
              'samvad',
              'mood',
              'activities',
              'diet',
              'doctor_chat',
            ],
          status: 'active',
          paymentId: params.razorpay_payment_id,
          orderId: params.razorpay_order_id,
          activatedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
        });

        await subscriptionRepository.upsertJourney(params.phone, {
          subscription_tier: (params.tier as 'full' | 'half') || 'full',
          subscription_status: 'active',
          last_subscribed_program: params.programId || 'garbh_sanskar',
        });

        return { payment: paymentRecord, subscription: subscriptionRecord };
      }
    );

    return { valid: true as const, data: transactionResult };
  },

  async skipTrial(phone: string) {
    await subscriptionRepository.upsertJourney(phone, {
      subscription_tier: 'trial',
      subscription_status: 'trial',
    });
    console.log(`[Subscription] Free trial activated for user: ${phone}`);
    return { status: 'trial', trialDays: 3 };
  },

  async subscribe(params: {
    userId: string;
    phone: string;
    planId?: string;
    tier?: string;
    amount?: number;
    planName?: string;
    durationMonths?: number;
    month?: number;
  }) {
    const duration = Number(params.durationMonths) || 3;
    const now = new Date();
    const expires = new Date(now.getTime() + duration * 30 * 24 * 60 * 60 * 1000);

    return subscriptionRepository.create({
      userId: params.userId,
      phone: params.phone,
      planId: params.planId || 'garbhsanskar-utkarsh',
      tier: (params.tier as 'full' | 'half') || 'full',
      planName: params.planName || 'Utkarsh (उत्कर्ष)',
      amount: Number(params.amount) || 1799,
      currency: 'INR',
      durationMonths: duration,
      calculatedForMonth: Number(params.month) || undefined,
      status: 'active',
      activatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    });
  },

  async getStatus(phone: string) {
    const activeSub = await subscriptionRepository.findActiveByPhone(phone);
    return {
      hasActiveSubscription: !!activeSub,
      subscription: activeSub || null,
    };
  },

  getProgramSchemes(category?: string) {
    let programs = programSchemeRepository.findAll().filter((p) => p.status !== 'archived');
    if (category) {
      programs = programs.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return programs;
  },

  getProgramSchemeById(id: string) {
    return programSchemeRepository.findAll().find((p) => p.id === id) || null;
  },

  adminSaveProgramScheme(body: Record<string, any>) {
    const existing = programSchemeRepository.findAll();
    const existingIdx = existing.findIndex((p) => p.id === body.id);

    const programRecord = {
      id: body.id,
      title: body.title,
      hindiTitle: body.hindiTitle || body.title,
      subtitle: body.subtitle || '',
      category: body.category,
      badge: body.badge || 'NEW',
      color: body.color || '#EC4899',
      rating: body.rating || 4.9,
      reviewsCount: body.reviewsCount || 100,
      enrolledCount: body.enrolledCount || '500+ Moms',
      overview: body.overview || '',
      whoIsItFor: body.whoIsItFor || '',
      duration: body.duration || '3 Months',
      unlockedModules: Array.isArray(body.unlockedModules)
        ? body.unlockedModules
        : ['activities', 'diet'],
      tiers: body.tiers,
      modules: body.modules || [],
      deliverables: body.deliverables || [],
      faculty: body.faculty || [],
      faqs: body.faqs || [],
      status: (body.status || 'active') as 'active' | 'draft' | 'archived',
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      existing[existingIdx] = { ...existing[existingIdx], ...programRecord };
    } else {
      existing.push({ ...programRecord, createdAt: new Date().toISOString() } as any);
    }

    programSchemeRepository.replaceAll(existing);
    return { updated: existingIdx >= 0, programRecord };
  },

  adminUpdateProgramScheme(id: string, updates: Record<string, any>) {
    const existing = programSchemeRepository.findAll();
    const existingIdx = existing.findIndex((p) => p.id === id);
    if (existingIdx < 0) return null;

    existing[existingIdx] = {
      ...existing[existingIdx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    programSchemeRepository.replaceAll(existing);
    return existing[existingIdx];
  },

  adminDeleteProgramScheme(id: string) {
    const existing = programSchemeRepository.findAll();
    const filtered = existing.filter((p) => p.id !== id);
    if (filtered.length === existing.length) return false;
    programSchemeRepository.replaceAll(filtered);
    return true;
  },
};

