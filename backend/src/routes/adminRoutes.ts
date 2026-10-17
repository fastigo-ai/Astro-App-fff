import { Router, Request, Response } from 'express';
import {
  UserJourneysCollection,
  SubscriptionsCollection,
  PaymentsCollection,
  ProgramSchemesCollection,
  KickSessionsCollection,
  MoodLogsCollection,
  SamvadNotesCollection,
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

    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: users.length,
        activeSubscriptions: activeSubs.length,
        totalRevenue,
        totalPrograms: programs.filter(p => p.status !== 'archived').length,
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

export default router;
