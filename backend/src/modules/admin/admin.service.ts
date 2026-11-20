import { adminRepository } from './admin.repository';
import { SUPER_ADMIN_PHONE, UserRole } from '../../shared/config/constants';

export const adminService = {
  getStats() {
    const users = adminRepository.getAllUsers();
    const subscriptions = adminRepository.getAllSubscriptions();
    const payments = adminRepository.getAllPayments();
    const programs = adminRepository.getAllPrograms();
    const kicks = adminRepository.getAllKicks();
    const moods = adminRepository.getAllMoods();
    const coupons = adminRepository.getAllCoupons();
    const classes = adminRepository.getAllClasses();
    const recorded = adminRepository.getAllRecordedClasses();
    const lessons = adminRepository.getAllCourseLessons();
    const registrations = adminRepository.getAllClassRegistrations();
    const dispatches = adminRepository.getAllDispatches();
    const tickets = adminRepository.getAllSupportTickets();

    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const openTickets = tickets.filter((t) => t.status === 'open');

    return {
      totalUsers: users.length,
      activeSubscriptions: activeSubs.length,
      totalRevenue,
      totalPrograms: programs.filter((p) => p.status !== 'archived').length,
      totalLessons: lessons.filter((l) => l.status !== 'draft').length,
      totalCoupons: coupons.filter((c) => c.status === 'active').length,
      upcomingClasses: classes.filter(
        (c) => c.status === 'upcoming' || c.status === 'live' || c.status === 'live_today'
      ).length,
      totalRecordedClasses: recorded.filter((r) => r.status === 'published').length,
      totalClassRegistrations: registrations.filter((r) => r.status !== 'cancelled').length,
      activeDispatches: dispatches.filter((d) => d.status !== 'delivered').length,
      totalKicksLogged: kicks.reduce((sum, k) => sum + (k.totalKicks || 0), 0),
      totalMoodLogs: moods.length,
      totalSupportTickets: tickets.length,
      openSupportTickets: openTickets.length,
    };
  },

  getUsers() {
    const users = adminRepository.getAllUsers();
    const subscriptions = adminRepository.getAllSubscriptions();
    const payments = adminRepository.getAllPayments();

    return users.map((u) => {
      const userSubs = subscriptions.filter((s) => s.phone === u.phone);
      const activeSub = userSubs.find((s) => s.status === 'active');
      const userPayments = payments.filter((p) => p.phone === u.phone);

      return {
        ...u,
        hasActiveSubscription: !!activeSub,
        activeSubscription: activeSub || null,
        allSubscriptions: userSubs,
        totalSpent: userPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
        paymentsCount: userPayments.length,
      };
    });
  },

  async grantUserSubscription(params: {
    phone: string;
    programId: string;
    tierName?: string;
    durationMonths?: number;
    amount?: number;
  }) {
    const durationMonths = Number(params.durationMonths ?? 6);
    const programs = adminRepository.getAllPrograms();
    const program = programs.find((p) => p.id === params.programId);

    const now = new Date();
    const expires = new Date(now.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);

    const subRecord = await adminRepository.insertSubscription({
      userId: `usr_admin_${Date.now()}`,
      phone: params.phone,
      programId: params.programId,
      planId: `${params.programId}-admin-grant`,
      tier: 'full',
      planName: params.tierName || `${program?.title || 'Program'} (Admin Grant)`,
      amount: Number(params.amount) || 0,
      currency: 'INR',
      durationMonths,
      status: 'active',
      unlockedModules: program?.unlockedModules || [
        'kicks',
        'bump',
        'samvad',
        'mood',
        'activities',
        'diet',
        'doctor_chat',
      ],
      activatedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      grantedByAdmin: true,
    });

    await adminRepository.upsertUserJourney(params.phone, {
      subscription_status: 'active',
      subscription_tier: 'full',
      last_subscribed_program: params.programId,
    });

    return subRecord;
  },

  async revokeUserSubscription(phone: string) {
    const allSubs = adminRepository.getAllSubscriptions();
    let updatedCount = 0;
    allSubs.forEach((s) => {
      if (s.phone === phone && s.status === 'active') {
        s.status = 'expired';
        updatedCount++;
      }
    });
    adminRepository.replaceAllSubscriptions(allSubs);
    await adminRepository.upsertUserJourney(phone, { subscription_status: 'expired' });
    return updatedCount;
  },

  getPayments() {
    return [...adminRepository.getAllPayments()].reverse();
  },

  getCoupons() {
    return adminRepository.getAllCoupons();
  },

  async createCoupon(body: Record<string, any>) {
    return adminRepository.createCoupon({
      id: `coup_${Date.now()}`,
      code: String(body.code).toUpperCase().trim(),
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue),
      minOrderValue: Number(body.minOrderValue) || 0,
      maxDiscountCap: body.maxDiscountCap ? Number(body.maxDiscountCap) : undefined,
      expiresAt: body.expiresAt || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: Number(body.usageLimit) || 100,
      usedCount: 0,
      status: 'active',
      description: body.description || '',
      createdAt: new Date().toISOString(),
    });
  },

  async deleteCoupon(id: string) {
    return adminRepository.deleteCoupon(id);
  },

  verifyCoupon(code: string, orderAmount: number) {
    const coupons = adminRepository.getAllCoupons();
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === String(code).toUpperCase() && c.status === 'active'
    );

    if (!coupon) return { status: 404 as const, error: 'Invalid or inactive coupon code' };
    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { status: 400 as const, error: 'Coupon code has expired' };
    }

    const amount = Number(orderAmount) || 0;
    if (amount < (coupon.minOrderValue || 0)) {
      return {
        status: 400 as const,
        error: `Minimum order amount of ₹${coupon.minOrderValue} required for this coupon`,
      };
    }

    let discount =
      coupon.discountType === 'percentage'
        ? (amount * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.discountType === 'percentage' && coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
      discount = coupon.maxDiscountCap;
    }

    discount = Math.min(discount, amount);
    const finalAmount = Math.max(0, amount - discount);

    return {
      status: 200 as const,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount),
        finalAmount: Math.round(finalAmount),
        description: coupon.description,
      },
    };
  },

  getDispatches() {
    return adminRepository.getAllDispatches();
  },

  async createDispatch(body: Record<string, any>) {
    return adminRepository.createDispatch({
      id: `dispatch_${Date.now()}`,
      orderId: `ord_${Date.now()}`,
      phone: body.phone,
      userName: body.userName || 'Astro Parent',
      kitName: body.kitName,
      shippingAddress: body.shippingAddress || 'Pending confirmation',
      courier: body.courier || 'BlueDart',
      trackingNumber: body.trackingNumber || `BD${Date.now().toString().slice(-8)}IN`,
      status: body.status || 'processing',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  },

  async updateDispatch(id: string, body: Record<string, any>) {
    return adminRepository.updateDispatch(id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });
  },

  getBroadcasts() {
    return [...adminRepository.getAllBroadcasts()].reverse();
  },

  async createBroadcast(title: string, message: string, targetAudience = 'all') {
    return adminRepository.createBroadcast({
      id: `notif_${Date.now()}`,
      title,
      message,
      targetAudience: targetAudience as any,
      sentAt: new Date().toISOString(),
    });
  },

  async assignRole(targetPhone: string, newRole: UserRole) {
    const validRoles: UserRole[] = ['user', 'admin', 'super_admin'];
    if (!validRoles.includes(newRole)) {
      return {
        status: 400 as const,
        error: `Invalid role '${newRole}'. Allowed roles are: ${validRoles.join(', ')}`,
      };
    }

    const cleanPhone = targetPhone.trim();

    // Safety guard: Prevent demoting primary root SUPER_ADMIN_PHONE
    if (cleanPhone === SUPER_ADMIN_PHONE && newRole !== 'super_admin') {
      return {
        status: 403 as const,
        error: `The root super administrator (${SUPER_ADMIN_PHONE}) cannot be demoted`,
      };
    }

    const user = adminRepository.getUserByPhone(cleanPhone);
    if (!user) {
      return {
        status: 404 as const,
        error: `User with phone ${cleanPhone} not found`,
      };
    }

    const updated = await adminRepository.updateUserRole(cleanPhone, newRole);

    return {
      status: 200 as const,
      data: {
        phone: cleanPhone,
        userId: updated.userId,
        name: updated.name,
        role: updated.role,
        message: `Role successfully updated to '${newRole}' for user ${cleanPhone}`,
      },
    };
  },

  listPatientKicks(filter?: { phone?: string }) {
    const kicks = adminRepository.getAllKicks();
    let result = [...kicks].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    if (filter?.phone) {
      result = result.filter(k => k.phone === filter.phone);
    }
    return result;
  },

  getDeliveredBabies() {
    const babies = adminRepository.getAllDeliveredBabies();
    return [...babies]
      .filter((b: any) => !b.is_deleted)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  },

  async createDeliveredBaby(data: {
    babyName: string;
    parentsName: string;
    city: string;
    imageUrl: string;
    deliveryDate?: string;
    deliveryType?: string;
    testimonial?: string;
    gender?: 'boy' | 'girl' | 'twins';
    weight?: string;
  }) {
    const id = `baby_${Date.now()}`;
    const newBaby = {
      id,
      babyName: data.babyName.trim(),
      parentsName: data.parentsName.trim(),
      city: data.city.trim(),
      imageUrl: data.imageUrl.trim(),
      deliveryDate: data.deliveryDate?.trim() || `Delivered ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      deliveryType: data.deliveryType || 'Normal Delivery',
      testimonial: data.testimonial?.trim() || 'Blessed with health, joy, and spiritual harmony through Garbh Sanskar.',
      gender: data.gender || 'boy',
      weight: data.weight?.trim() || '3.2 kg',
      likesCount: Math.floor(Math.random() * 500) + 800,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await adminRepository.createDeliveredBaby(newBaby);
    return newBaby;
  },

  async deleteDeliveredBaby(id: string) {
    return adminRepository.deleteDeliveredBaby(id);
  },
};

