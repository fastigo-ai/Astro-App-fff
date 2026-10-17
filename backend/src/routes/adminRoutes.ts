import { Router, Request, Response } from 'express';
import {
  UserJourneysCollection,
  SubscriptionsCollection,
  PaymentsCollection,
  ProgramSchemesCollection,
  KickSessionsCollection,
  MoodLogsCollection,
  SamvadNotesCollection,
  CouponsCollection,
  LiveClassesCollection,
  KitDispatchesCollection,
  BroadcastNotificationsCollection,
} from '../services/dbStore';

const router = Router();

// GET /api/v1/admin/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const users = UserJourneysCollection.read();
    const subscriptions = SubscriptionsCollection.read();
    const payments = PaymentsCollection.read();
    const programs = ProgramSchemesCollection.read();
    const kicks = KickSessionsCollection.read();
    const moods = MoodLogsCollection.read();

    const coupons = CouponsCollection.read();
    const classes = LiveClassesCollection.read();
    const dispatches = KitDispatchesCollection.read();

    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: users.length,
        activeSubscriptions: activeSubs.length,
        totalRevenue,
        totalPrograms: programs.filter(p => p.status !== 'archived').length,
        totalCoupons: coupons.filter(c => c.status === 'active').length,
        upcomingClasses: classes.filter(c => c.status === 'upcoming').length,
        activeDispatches: dispatches.filter(d => d.status !== 'delivered').length,
        totalKicksLogged: kicks.reduce((sum, k) => sum + (k.totalKicks || 0), 0),
        totalMoodLogs: moods.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/admin/users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = UserJourneysCollection.read();
    const subscriptions = SubscriptionsCollection.read();
    const payments = PaymentsCollection.read();

    const enrichedUsers = users.map((u) => {
      const userSubs = subscriptions.filter(s => s.phone === u.phone);
      const activeSub = userSubs.find(s => s.status === 'active');
      const userPayments = payments.filter(p => p.phone === u.phone);

      return {
        ...u,
        hasActiveSubscription: !!activeSub,
        activeSubscription: activeSub || null,
        allSubscriptions: userSubs,
        totalSpent: userPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
        paymentsCount: userPayments.length,
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      data: enrichedUsers,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/users/grant (Manually activate or gift a scheme to a user)
router.post('/users/grant', async (req: Request, res: Response) => {
  try {
    const { phone, programId, tierName, durationMonths = 6, amount = 0 } = req.body;

    if (!phone || !programId) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and programId are required',
      });
    }

    const programs = ProgramSchemesCollection.read();
    const program = programs.find(p => p.id === programId);

    const now = new Date();
    const expires = new Date(now.getTime() + Number(durationMonths) * 30 * 24 * 60 * 60 * 1000);

    // Create subscription record
    const subRecord = await SubscriptionsCollection.insert({
      userId: `usr_admin_${Date.now()}`,
      phone,
      programId,
      planId: `${programId}-admin-grant`,
      tier: 'full',
      planName: tierName || `${program?.title || 'Program'} (Admin Grant)`,
      amount: Number(amount) || 0,
      currency: 'INR',
      durationMonths: Number(durationMonths),
      status: 'active',
      unlockedModules: program?.unlockedModules || ['kicks', 'bump', 'samvad', 'mood', 'activities', 'diet', 'doctor_chat'],
      activatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      grantedByAdmin: true,
    } as any);

    // Upsert user journey
    await UserJourneysCollection.upsert(
      { phone },
      {
        subscription_status: 'active',
        subscription_tier: 'full',
        last_subscribed_program: programId,
      }
    );

    return res.status(200).json({
      success: true,
      message: `Subscription successfully granted to ${phone}`,
      data: subRecord,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/users/revoke (Revoke/expire user subscription)
router.post('/users/revoke', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    // Update active subscriptions to expired
    const allSubs = SubscriptionsCollection.read();
    let updatedCount = 0;
    allSubs.forEach((s) => {
      if (s.phone === phone && s.status === 'active') {
        s.status = 'expired';
        updatedCount++;
      }
    });
    SubscriptionsCollection.write(allSubs);

    await UserJourneysCollection.upsert(
      { phone },
      { subscription_status: 'expired' }
    );

    return res.status(200).json({
      success: true,
      message: `Revoked ${updatedCount} active subscription(s) for ${phone}`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/admin/payments
router.get('/payments', async (req: Request, res: Response) => {
  try {
    const payments = PaymentsCollection.read();
    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments.reverse(),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 1. COUPONS & PROMOTIONS (COURSE ECOMMERCE)
// ==========================================

// GET /api/v1/admin/coupons
router.get('/coupons', async (req: Request, res: Response) => {
  try {
    const coupons = CouponsCollection.read();
    return res.status(200).json({ success: true, data: coupons });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/coupons
router.post('/coupons', async (req: Request, res: Response) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscountCap, expiresAt, usageLimit, description } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ success: false, error: 'Coupon code and discountValue are required' });
    }

    const newCoupon = await CouponsCollection.insert({
      id: `coup_${Date.now()}`,
      code: String(code).toUpperCase().trim(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscountCap: maxDiscountCap ? Number(maxDiscountCap) : undefined,
      expiresAt: expiresAt || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: Number(usageLimit) || 100,
      usedCount: 0,
      status: 'active',
      description: description || '',
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, data: newCoupon });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/admin/coupons/:id
router.delete('/coupons/:id', async (req: Request, res: Response) => {
  try {
    await CouponsCollection.delete(req.params.id);
    return res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/coupons/verify (App checkout verification)
router.post('/coupons/verify', async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code required' });
    }

    const coupons = CouponsCollection.read();
    const coupon = coupons.find(c => c.code.toUpperCase() === String(code).toUpperCase() && c.status === 'active');

    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid or inactive coupon code' });
    }

    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ success: false, error: 'Coupon code has expired' });
    }

    const amount = Number(orderAmount) || 0;
    if (amount < (coupon.minOrderValue || 0)) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of ₹${coupon.minOrderValue} required for this coupon`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
        discount = coupon.maxDiscountCap;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, amount);
    const finalAmount = Math.max(0, amount - discount);

    return res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount),
        finalAmount: Math.round(finalAmount),
        description: coupon.description,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. LIVE CLASSES & WEBINARS (LMS)
// ==========================================

// GET /api/v1/admin/classes
router.get('/classes', async (req: Request, res: Response) => {
  try {
    const classes = LiveClassesCollection.read();
    return res.status(200).json({ success: true, data: classes });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/classes
router.post('/classes', async (req: Request, res: Response) => {
  try {
    const { programId, title, instructor, dateTime, durationMinutes, joinUrl } = req.body;
    if (!title || !joinUrl) {
      return res.status(400).json({ success: false, error: 'Title and joinUrl are required' });
    }

    const newClass = await LiveClassesCollection.insert({
      id: `live_${Date.now()}`,
      programId: programId || 'garbh_sanskar',
      title,
      instructor: instructor || 'AstroBaby Senior Mentor',
      dateTime: dateTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: Number(durationMinutes) || 45,
      joinUrl,
      status: 'upcoming',
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, data: newClass });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/admin/classes/:id
router.delete('/classes/:id', async (req: Request, res: Response) => {
  try {
    await LiveClassesCollection.delete(req.params.id);
    return res.status(200).json({ success: true, message: 'Class deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 3. PHYSICAL KIT DISPATCHES (ECOMMERCE FULFILLMENT)
// ==========================================

// GET /api/v1/admin/dispatches
router.get('/dispatches', async (req: Request, res: Response) => {
  try {
    const dispatches = KitDispatchesCollection.read();
    return res.status(200).json({ success: true, data: dispatches });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/dispatches
router.post('/dispatches', async (req: Request, res: Response) => {
  try {
    const { phone, userName, kitName, shippingAddress, courier, trackingNumber, status } = req.body;
    if (!phone || !kitName) {
      return res.status(400).json({ success: false, error: 'Phone and kitName are required' });
    }

    const newDispatch = await KitDispatchesCollection.insert({
      id: `dispatch_${Date.now()}`,
      orderId: `ord_${Date.now()}`,
      phone,
      userName: userName || 'Astro Parent',
      kitName,
      shippingAddress: shippingAddress || 'Pending confirmation',
      courier: courier || 'BlueDart',
      trackingNumber: trackingNumber || `BD${Date.now().toString().slice(-8)}IN`,
      status: status || 'processing',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, data: newDispatch });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/v1/admin/dispatches/:id (Update shipping status)
router.put('/dispatches/:id', async (req: Request, res: Response) => {
  try {
    const updated = await KitDispatchesCollection.update(req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 4. BROADCAST NOTIFICATIONS (APP ENGAGEMENT)
// ==========================================

// GET /api/v1/admin/broadcasts
router.get('/broadcasts', async (req: Request, res: Response) => {
  try {
    const list = BroadcastNotificationsCollection.read();
    return res.status(200).json({ success: true, data: list.reverse() });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/admin/broadcasts (Send in-app notification)
router.post('/broadcasts', async (req: Request, res: Response) => {
  try {
    const { title, message, targetAudience = 'all' } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }

    const broadcast = await BroadcastNotificationsCollection.insert({
      id: `notif_${Date.now()}`,
      title,
      message,
      targetAudience,
      sentAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Notification broadcasted to app users successfully',
      data: broadcast,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
