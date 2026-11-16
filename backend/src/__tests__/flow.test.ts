import { Request, Response } from 'express';
import { subscriptionController } from '../modules/subscription/subscription.controller';
import { UserJourneysCollection, SubscriptionsCollection } from '../shared/db/dbStore';

function createMockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.data = null;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: any) => {
    res.data = data;
    return res;
  };
  return res;
}

async function runTests() {
  console.log('🧪 Starting Astro Baby End-to-End Backend QA & Flow Tests (In-Process Unit/Integration)...\n');

  let passed = 0;
  let failed = 0;

  async function assert(desc: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${desc}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Test Plans for Month 2 (Krishna Coming Demo Month)
  await assert('subscriptionController.getPlans with month=2 returns Utkarsh and Aadhar for 8 remaining months', async () => {
    const req: any = { query: { month: '2', phone: '9366128220' } };
    const res = createMockRes();
    await subscriptionController.getPlans(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Expected success true');
    const plans = res.data.data.plans;
    if (!Array.isArray(plans) || plans.length !== 2) throw new Error(`Expected 2 plans, got ${plans?.length}`);

    const utkarsh = plans.find((p: any) => p.tier === 'full');
    if (!utkarsh) throw new Error('Utkarsh plan not found');
    if (utkarsh.durationMonths !== 8) throw new Error(`Expected 8 durationMonths, got ${utkarsh.durationMonths}`);
    if (utkarsh.calculatedPrice !== 2999) throw new Error(`Expected 2999 price, got ${utkarsh.calculatedPrice}`);

    const aadhar = plans.find((p: any) => p.tier === 'half');
    if (!aadhar) throw new Error('Aadhar plan not found');
    if (aadhar.calculatedPrice !== 1499) throw new Error(`Expected 1499 price, got ${aadhar.calculatedPrice}`);
  });

  // 2. Test Plans for Month 4 (Trimester 2)
  await assert('subscriptionController.getPlans with month=4 returns Utkarsh for 6 remaining months at ₹2,499', async () => {
    const req: any = { query: { month: '4', phone: '9366128220' } };
    const res = createMockRes();
    await subscriptionController.getPlans(req, res, () => {});

    const utkarsh = res.data.data.plans.find((p: any) => p.tier === 'full');
    if (utkarsh.durationMonths !== 6) throw new Error(`Expected 6 durationMonths, got ${utkarsh.durationMonths}`);
    if (utkarsh.calculatedPrice !== 2499) throw new Error(`Expected 2499 price, got ${utkarsh.calculatedPrice}`);
  });

  // 3. Test Plans for Month 8 (Late Trimester 3)
  await assert('subscriptionController.getPlans with month=8 returns Utkarsh for 2 remaining months at ₹1,199', async () => {
    const req: any = { query: { month: '8', phone: '9366128220' } };
    const res = createMockRes();
    await subscriptionController.getPlans(req, res, () => {});

    const utkarsh = res.data.data.plans.find((p: any) => p.tier === 'full');
    if (utkarsh.durationMonths !== 2) throw new Error(`Expected 2 durationMonths, got ${utkarsh.durationMonths}`);
    if (utkarsh.calculatedPrice !== 1199) throw new Error(`Expected 1199 price, got ${utkarsh.calculatedPrice}`);
  });

  // 4. Test Razorpay Order Creation
  let createdOrderId = '';
  await assert('subscriptionController.createRazorpayOrder creates a valid order', async () => {
    const req: any = {
      body: {
        planId: 'garbhsanskar-utkarsh',
        tier: 'full',
        amount: 2499,
        month: 4,
        phone: '9366128220',
      },
    };
    const res = createMockRes();
    await subscriptionController.createRazorpayOrder(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success || !res.data.data.orderId) throw new Error('Order creation response invalid');
    createdOrderId = res.data.data.orderId;
  });

  // 5. Test Razorpay Payment Verification
  await assert('subscriptionController.verifyRazorpayPayment activates subscription atomically', async () => {
    const req: any = {
      body: {
        razorpay_order_id: createdOrderId,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: 'sandbox_verified_signature',
        planId: 'garbhsanskar-utkarsh',
        tier: 'full',
        planName: 'Utkarsh (उत्कर्ष)',
        amount: 2499,
        durationMonths: 6,
        month: 4,
        method: 'upi',
        phone: '9366128220',
      },
    };
    const res = createMockRes();
    await subscriptionController.verifyRazorpayPayment(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.success) throw new Error('Payment verification not successful');
    if (res.data.data.subscription.status !== 'active') throw new Error(`Expected status active, got ${res.data.data.subscription.status}`);
  });

  // 6. Test Get Subscription Status
  await assert('subscriptionController.getStatus returns active subscription for subscribed user', async () => {
    const req: any = { query: { phone: '9366128220' } };
    const res = createMockRes();
    await subscriptionController.getStatus(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (!res.data.data.hasActiveSubscription) {
      throw new Error(`Expected hasActiveSubscription to be true`);
    }
  });

  // 7. Test Skip Trial
  await assert('subscriptionController.skipTrial sets trial status for non-subscriber', async () => {
    const req: any = { body: { phone: '9111222333' } };
    const res = createMockRes();
    await subscriptionController.skipTrial(req, res, () => {});

    if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
    if (res.data.data.status !== 'trial') {
      throw new Error(`Expected trial, got ${res.data.data.status}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`🏁 All Flow Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
