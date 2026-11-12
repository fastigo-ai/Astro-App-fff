import { krishnaRepository } from './krishna.repository';
import { classesService } from '../classes/classes.service';
import { RequestIdentity } from '../../shared/services/entitlementService';

export const krishnaService = {
  getPlans(month: number) {
    const remainingMonths = Math.max(1, 10 - month);
    const baseMonthlyRate = 899;
    const originalFullPrice = remainingMonths * 1299;
    const calculatedFullPrice = Math.max(1999, remainingMonths * baseMonthlyRate);
    const discountPercent = Math.round(
      ((originalFullPrice - calculatedFullPrice) / originalFullPrice) * 100
    );

    const installmentMonths = remainingMonths >= 5 ? 3 : remainingMonths >= 3 ? 2 : 1;
    const emiPerMonth = Math.ceil(calculatedFullPrice / installmentMonths);

    const plans = [
      {
        id: 'kc_sampurna_vedic',
        tier: 'full',
        name: 'Sampurna Vedic Garbh Sanskar',
        badge: 'MOST POPULAR - 100% VEDIC CERTIFIED',
        tagline: `Complete Care for Months ${month} to 9 till Delivery`,
        duration: `${remainingMonths} Months (Till Delivery)`,
        durationMonths: remainingMonths,
        originalPrice: originalFullPrice,
        calculatedPrice: calculatedFullPrice,
        discountPercent,
        monthlyRate: `₹${Math.round(calculatedFullPrice / remainingMonths)}/month`,
        installmentOption: {
          available: installmentMonths > 1,
          installmentsCount: installmentMonths,
          downpayment: emiPerMonth,
          perMonthEmi: emiPerMonth,
          summary: `Pay ₹${emiPerMonth} today, remaining in ${installmentMonths - 1} easy monthly EMIs`,
        },
        features: [
          'Daily Month-specific Vedic Sanskar Activities & Mantras',
          'Weekly Interactive Zoom Sessions with Ayurvedic Gynaecologists',
          'Personal Garbh Mitra Guidance on WhatsApp/Call',
          'Complimentary Garbh Kundli & Astrological Muhurat Check',
          'Brain & Sensory Stimulation Classical Raagas (432Hz)',
          'Ayurvedic Trimester Nutrition & Sattvic Recipe Guide',
          'Spiritual Baby Talks (Garbh Samvad) & Pratah Smaran',
          'Full Access to Recorded Masterclasses & Past Live Videos',
        ],
      },
      {
        id: 'kc_aadhar_sanskar',
        tier: 'half',
        name: 'Garbh Sanskar Aadhar',
        badge: 'ESSENTIAL CARE',
        tagline: 'Core Trimester Audio-Visual Curriculum',
        duration: '3 Months Trimester Program',
        durationMonths: 3,
        originalPrice: 4499,
        calculatedPrice: 2499,
        discountPercent: 44,
        monthlyRate: '₹833/month',
        installmentOption: {
          available: true,
          installmentsCount: 2,
          downpayment: 1299,
          perMonthEmi: 1250,
          summary: 'Pay ₹1,299 today, remaining ₹1,200 next month',
        },
        features: [
          'Trimester Daily Activity Plans',
          'Vedic Shlokas, Stotras & Relaxing Instrumental Raagas',
          'Recorded Doctor Lectures & Safe Prenatal Yoga Routines',
          'Kick Counter, Mood Therapy & Bump Tracker Tools',
        ],
      },
      {
        id: 'kc_bal_sanskar',
        tier: 'bal_sanskar',
        name: 'Bal Sanskar (0 to 2 Years)',
        badge: 'POST-DELIVERY SANSKAR',
        tagline: 'Infant Brain & Character Nurturing',
        duration: '12 Months Postnatal Program',
        durationMonths: 12,
        originalPrice: 5999,
        calculatedPrice: 3499,
        discountPercent: 42,
        monthlyRate: '₹291/month',
        installmentOption: {
          available: true,
          installmentsCount: 3,
          downpayment: 1200,
          perMonthEmi: 1150,
          summary: 'Pay ₹1,200 today, remaining in 2 installments',
        },
        features: [
          'Month-by-Month Infant Cognitive & Motor Milestones',
          'Traditional Ayurvedic Baby Massage (Abhyanga) Video Guides',
          'Vedic Sanskars Guidance (Namkaran, Nishkramana, Annaprashan)',
          'Lullabies & Brain-boosting Audios in Pure Sanskrit & Hindi',
        ],
      },
      {
        id: 'kc_garbhadhan_sanskar',
        tier: 'preconceive',
        name: 'Garbhadhan Preconception Plan',
        badge: 'FOR PLANNING COUPLES',
        tagline: 'Ayurvedic & Astrological Body-Mind Cleansing',
        duration: '6 Months Preconception Journey',
        durationMonths: 6,
        originalPrice: 4999,
        calculatedPrice: 2499,
        discountPercent: 50,
        monthlyRate: '₹416/month',
        installmentOption: {
          available: false,
          installmentsCount: 1,
          downpayment: 2499,
          perMonthEmi: 2499,
          summary: 'Single One-Time Payment',
        },
        features: [
          'Fertile Window & Auspicious Conception Muhurat Calculation',
          'Panchakarma & Diet Detox Guidance for Both Partners',
          'Couples Vedic Meditation for Pure Consciousness',
          '1-on-1 Doctor Video Counselling Call',
        ],
      },
    ];

    return {
      month,
      remainingMonths,
      urgencyTimerMinutes: 15,
      trustStats: {
        happyMothers: '100,000+',
        rating: '4.9/5',
        ayurvedicDoctors: '25+',
        guaranteeText: '100% Vedic & Science Backed Guarantee',
      },
      data: plans,
    };
  },

  checkCoupon(code: string, planPrice = 4999) {
    const cleanCode = (code || '').trim().toUpperCase();
    const couponRules: Record<string, { type: 'percent' | 'flat'; value: number; message: string }> = {
      KRISHNA50: { type: 'percent', value: 50, message: '🎉 Krishna Blessing 50% discount applied!' },
      ASTROVEDIC: { type: 'flat', value: 500, message: '🌸 Vedic Welcome ₹500 discount applied!' },
      GARBHMITRA: { type: 'flat', value: 1000, message: '🌟 Garbh Mitra Special ₹1,000 discount applied!' },
      WELCOMEKC: { type: 'percent', value: 20, message: '✨ 20% New Mother discount applied!' },
    };

    const matched = couponRules[cleanCode];
    if (!matched) return null;

    const discountAmount =
      matched.type === 'percent' ? Math.round((planPrice * matched.value) / 100) : matched.value;
    const finalPrice = Math.max(999, planPrice - discountAmount);

    return {
      code: cleanCode,
      discountAmount,
      finalPrice,
      message: matched.message,
    };
  },

  async createInstallmentPlan(params: {
    userId: string;
    phone: string;
    planId?: string;
    totalAmount: number;
    installmentsCount: number;
  }) {
    const downpayment = Math.ceil(params.totalAmount / params.installmentsCount);
    const nextDue = new Date();
    nextDue.setMonth(nextDue.getMonth() + 1);

    const sub = await krishnaRepository.createInstallmentSubscription({
      userId: params.userId,
      phone: params.phone,
      planId: params.planId || 'kc_sampurna_vedic',
      tier: 'full',
      planName: 'Sampurna Vedic Garbh Sanskar (EMI Plan)',
      amount: downpayment,
      currency: 'INR',
      durationMonths: 6,
      paymentMode: 'emi',
      totalInstallments: params.installmentsCount,
      paidInstallments: 1,
      nextInstallmentDue: nextDue.toISOString(),
      status: 'active',
      paymentId: `pay_emi_${Date.now()}`,
      orderId: `ord_emi_${Date.now()}`,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 180 * 86400000).toISOString(),
      unlockedModules: [
        'kicks',
        'bump',
        'samvad',
        'mood',
        'activities',
        'diet',
        'doctor_chat',
        'kundli',
        'live',
      ],
    });

    await krishnaRepository.upsertUserJourneyByUserId(params.userId, {
      subscription_status: 'active',
      subscription_tier: 'full',
      last_subscribed_program: 'garbh_sanskar',
    });

    return {
      message: `Downpayment of ₹${downpayment} received! Full Garbh Sanskar access unlocked.`,
      subscription: sub,
      installmentSchedule: {
        paidCount: 1,
        remainingCount: params.installmentsCount - 1,
        nextAmount: downpayment,
        nextDueDate: nextDue.toISOString(),
      },
    };
  },

  async registerKundli(userId: string, body: Record<string, any>) {
    return krishnaRepository.createKundli({
      userId,
      motherName: body.motherName,
      fatherName: body.fatherName || 'Father',
      motherDob: body.motherDob || '1995-01-01',
      fatherDob: body.fatherDob || '1992-01-01',
      placeOfBirth: body.placeOfBirth,
      gotra: body.gotra || 'Kashyap',
      questions: body.questions || 'Baby health and auspicious birth Nakshatra',
      status: 'ready',
      kundliPdfUrl: 'https://krishnacoming.com/reports/sample_garbh_kundli.pdf',
      astrologerNotes:
        'Auspicious Jupiter influence on 5th house (Putra Bhava). Recite Santan Gopal Mantra daily at dawn for intellectual and radiant progeny.',
    });
  },

  async getKundliStatus(userId: string) {
    const kundlis = await krishnaRepository.findKundlisByUserId(userId);
    return (
      kundlis[kundlis.length - 1] || {
        status: 'ready',
        motherName: 'Devi Maa',
        placeOfBirth: 'Delhi, India',
        kundliPdfUrl: 'https://krishnacoming.com/reports/sample_garbh_kundli.pdf',
        astrologerNotes:
          'Jupiter in auspicious trine. Auspicious days for womb talks: Thursdays & Full Moon. Sacred gemstone suggestion: Yellow Sapphire or pearl.',
      }
    );
  },

  getBalSanskarDetails() {
    return {
      programName: 'Bal Sanskar (0-2 Years)',
      overview:
        'Postnatal physical, emotional, and cognitive nurturing grounded in traditional Ayurvedic and modern pediatric milestones.',
      activities: [
        { id: 'bs_1', month: 1, title: 'Pratham Sparsh (Sacred Touch & Massage)', duration: '15 mins', category: 'Physical' },
        { id: 'bs_2', month: 2, title: 'Karna Bodh (Gentle Sounds & Lullabies)', duration: '12 mins', category: 'Sensory' },
        { id: 'bs_3', month: 3, title: 'Drishti Vikas (Color & High Contrast Cards)', duration: '10 mins', category: 'Cognitive' },
        { id: 'bs_4', month: 6, title: 'Annaprashan Vidhi & Sattvic Weaning Diet', duration: '20 mins', category: 'Ayurveda' },
        { id: 'bs_5', month: 12, title: 'Bhasha Vikas (Vedic Rhymes & Moral Tales)', duration: '15 mins', category: 'Speech' },
      ],
    };
  },

  getPreconceiveDetails() {
    return {
      title: 'Garbhadhan Sanskar (Preconception Preparation)',
      pillars: [
        { title: 'Beej Shuddhi', description: 'Cellular detox and Ayurvedic nourishment for egg & sperm quality' },
        { title: 'Chitta Shuddhi', description: 'Mental serenity, prayer, and stress reduction for welcoming a noble soul' },
        { title: 'Muhurat Nirnay', description: 'Astrological calculation of auspicious planetary windows for conception' },
      ],
      availableSlots: [
        'Tomorrow 11:00 AM - Dr. Sunita Sharma (Ayurvedic Gynaecologist)',
        'Tomorrow 04:00 PM - Acharya Vikramaditya (Vedic Astrologer)',
        'Friday 10:30 AM - Dr. Pooja Deshmukh (Nutritionist)',
      ],
    };
  },

  getLiveSessions(
    filters: { programId?: string; category?: string; trimester?: string },
    identity: RequestIdentity
  ) {
    return classesService.getLiveAndRecordedSessions(filters, identity);
  },

  getReferralInfo(userId: string) {
    const userCode = `ASTRO${userId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'MAA9'}`;
    return {
      referralCode: userCode,
      rewardPerReferral: '₹500 / 1 Free Month',
      friendDiscount: '₹500 Off Any Plan',
      totalReferrals: 3,
      totalRewardsEarned: 1500,
      freeMonthsUnlocked: 1,
      shareMessage: `🌸 Join me on Astro Baby Garbh Sanskar! Use my referral code ${userCode} to get ₹500 discount on complete Vedic pregnancy guidance. Download now: https://astrobaby.app/invite/${userCode}`,
    };
  },

  async getMedicalProfile(userId: string) {
    const records = await krishnaRepository.findMedicalProfilesByUserId(userId);
    return (
      records[0] || {
        userId,
        doctorName: 'Dr. Radhika Sen',
        hospitalName: 'Apollo Cradle Maternity Hospital',
        doctorPhone: '+91 98765 43210',
        bloodGroup: 'B+',
        medicalConditions: ['Mild Morning Sickness', 'Normal Blood Pressure'],
        allergies: ['Penicillin'],
      }
    );
  },

  async updateMedicalProfile(userId: string, body: Record<string, any>) {
    return krishnaRepository.upsertMedicalProfile(userId, body);
  },

  async trackActivity(userId: string, body: Record<string, any>) {
    const { activityId, title, type = 'audio', durationSeconds = 300, watchedSeconds = 300 } = body;
    return krishnaRepository.trackActivity({
      userId,
      activityId: activityId || `act_${Date.now()}`,
      type,
      title: title || 'Vedic Chanting',
      durationSeconds,
      watchedSeconds,
      completed: watchedSeconds >= durationSeconds * 0.8,
      date: new Date().toISOString().split('T')[0]!,
      score: Math.min(100, Math.round((watchedSeconds / durationSeconds) * 100)),
    });
  },
};

