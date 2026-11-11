import { Request, Response } from 'express';
import {
  UserJourneysCollection,
  SubscriptionsCollection,
  CouponsCollection,
  KundliCollection,
  BalSanskarCollection,
  PreconceiveCollection,
  ReferralsCollection,
  MedicalProfilesCollection,
  ActivityTrackingCollection,
  LiveClassesCollection,
  DoctorsCollection,
  IKundliRecord,
  IBalSanskarRecord,
  IPreconceiveRecord,
  IReferralRecord,
  IMedicalProfileRecord,
  IActivityTrackingRecord
} from '../services/dbStore';

export const krishnaBusinessController = {
  // 1. GET /api/v1/krishna/plans - Dynamic Month-based Pricing & Installments
  getKrishnaPlans: async (req: Request, res: Response) => {
    try {
      const month = Number(req.query.month) || 4;
      const stage = (req.query.stage as string) || 'pregnant';
      const remainingMonths = Math.max(1, 10 - month);

      const baseMonthlyRate = 899;
      const originalFullPrice = remainingMonths * 1299;
      const calculatedFullPrice = Math.max(1999, remainingMonths * baseMonthlyRate);
      const discountPercent = Math.round(((originalFullPrice - calculatedFullPrice) / originalFullPrice) * 100);

      // Downpayment / EMI options
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
            summary: `Pay ₹${emiPerMonth} today, remaining in ${installmentMonths - 1} easy monthly EMIs`
          },
          features: [
            'Daily Month-specific Vedic Sanskar Activities & Mantras',
            'Weekly Interactive Zoom Sessions with Ayurvedic Gynaecologists',
            'Personal Garbh Mitra Guidance on WhatsApp/Call',
            'Complimentary Garbh Kundli & Astrological Muhurat Check',
            'Brain & Sensory Stimulation Classical Raagas (432Hz)',
            'Ayurvedic Trimester Nutrition & Sattvic Recipe Guide',
            'Spiritual Baby Talks (Garbh Samvad) & Pratah Smaran',
            'Full Access to Recorded Masterclasses & Past Live Videos'
          ]
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
            summary: 'Pay ₹1,299 today, remaining ₹1,200 next month'
          },
          features: [
            'Trimester Daily Activity Plans',
            'Vedic Shlokas, Stotras & Relaxing Instrumental Raagas',
            'Recorded Doctor Lectures & Safe Prenatal Yoga Routines',
            'Kick Counter, Mood Therapy & Bump Tracker Tools'
          ]
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
            summary: 'Pay ₹1,200 today, remaining in 2 installments'
          },
          features: [
            'Month-by-Month Infant Cognitive & Motor Milestones',
            'Traditional Ayurvedic Baby Massage (Abhyanga) Video Guides',
            'Vedic Sanskars Guidance (Namkaran, Nishkramana, Annaprashan)',
            'Lullabies & Brain-boosting Audios in Pure Sanskrit & Hindi'
          ]
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
            summary: 'Single One-Time Payment'
          },
          features: [
            'Fertile Window & Auspicious Conception Muhurat Calculation',
            'Panchakarma & Diet Detox Guidance for Both Partners',
            'Couples Vedic Meditation for Pure Consciousness',
            '1-on-1 Doctor Video Counselling Call'
          ]
        }
      ];

      return res.status(200).json({
        success: true,
        month,
        remainingMonths,
        urgencyTimerMinutes: 15,
        trustStats: {
          happyMothers: '100,000+',
          rating: '4.9/5',
          ayurvedicDoctors: '25+',
          guaranteeText: '100% Vedic & Science Backed Guarantee'
        },
        data: plans
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 2. POST /api/v1/krishna/coupon/check - Verify Coupon Code
  checkCoupon: async (req: Request, res: Response) => {
    try {
      const { code, planPrice = 4999 } = req.body;
      const cleanCode = (code || '').trim().toUpperCase();

      const couponRules: Record<string, { type: 'percent' | 'flat'; value: number; message: string }> = {
        'KRISHNA50': { type: 'percent', value: 50, message: '🎉 Krishna Blessing 50% discount applied!' },
        'ASTROVEDIC': { type: 'flat', value: 500, message: '🌸 Vedic Welcome ₹500 discount applied!' },
        'GARBHMITRA': { type: 'flat', value: 1000, message: '🌟 Garbh Mitra Special ₹1,000 discount applied!' },
        'WELCOMEKC': { type: 'percent', value: 20, message: '✨ 20% New Mother discount applied!' },
      };

      const matched = couponRules[cleanCode];
      if (!matched) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code. Try KRISHNA50 or GARBHMITRA.'
        });
      }

      let discountAmount = 0;
      if (matched.type === 'percent') {
        discountAmount = Math.round((planPrice * matched.value) / 100);
      } else {
        discountAmount = matched.value;
      }
      const finalPrice = Math.max(999, planPrice - discountAmount);

      return res.status(200).json({
        success: true,
        code: cleanCode,
        discountAmount,
        finalPrice,
        message: matched.message
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 3. POST /api/v1/krishna/installments/create - Create Downpayment / EMI Subscription
  createInstallmentPlan: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const phone = (req as any).user?.phone || '9999999999';
      const { planId, totalAmount, installmentsCount = 3 } = req.body;

      const downpayment = Math.ceil(totalAmount / installmentsCount);
      const nextDue = new Date();
      nextDue.setMonth(nextDue.getMonth() + 1);

      const sub = await SubscriptionsCollection.insert({
        userId,
        phone,
        planId: planId || 'kc_sampurna_vedic',
        tier: 'full',
        planName: 'Sampurna Vedic Garbh Sanskar (EMI Plan)',
        amount: downpayment,
        currency: 'INR',
        durationMonths: 6,
        paymentMode: 'emi',
        totalInstallments: installmentsCount,
        paidInstallments: 1,
        nextInstallmentDue: nextDue.toISOString(),
        status: 'active',
        paymentId: `pay_emi_${Date.now()}`,
        orderId: `ord_emi_${Date.now()}`,
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 180 * 86400000).toISOString(),
        unlockedModules: ['kicks', 'bump', 'samvad', 'mood', 'activities', 'diet', 'doctor_chat', 'kundli', 'live']
      });

      await UserJourneysCollection.upsert(
        { userId },
        { subscription_status: 'active', subscription_tier: 'full', last_subscribed_program: 'garbh_sanskar' }
      );

      return res.status(201).json({
        success: true,
        message: `Downpayment of ₹${downpayment} received! Full Garbh Sanskar access unlocked.`,
        subscription: sub,
        installmentSchedule: {
          paidCount: 1,
          remainingCount: installmentsCount - 1,
          nextAmount: downpayment,
          nextDueDate: nextDue.toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 4. Garbh Kundli Registration & Horoscope
  registerKundli: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const { motherName, fatherName, motherDob, fatherDob, placeOfBirth, gotra, questions } = req.body;

      if (!motherName || !placeOfBirth) {
        return res.status(400).json({ success: false, message: 'Mother name and place of birth are required' });
      }

      const kundli = await KundliCollection.insert({
        userId,
        motherName,
        fatherName: fatherName || 'Father',
        motherDob: motherDob || '1995-01-01',
        fatherDob: fatherDob || '1992-01-01',
        placeOfBirth,
        gotra: gotra || 'Kashyap',
        questions: questions || 'Baby health and auspicious birth Nakshatra',
        status: 'ready',
        kundliPdfUrl: 'https://krishnacoming.com/reports/sample_garbh_kundli.pdf',
        astrologerNotes: 'Auspicious Jupiter influence on 5th house (Putra Bhava). Recite Santan Gopal Mantra daily at dawn for intellectual and radiant progeny.'
      });

      return res.status(201).json({
        success: true,
        message: 'Garbh Kundli successfully submitted to Vedic astrologer panel!',
        data: kundli
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getKundliStatus: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const kundlis = await KundliCollection.find({ userId });
      const record = kundlis[kundlis.length - 1] || {
        status: 'ready',
        motherName: 'Devi Maa',
        placeOfBirth: 'Delhi, India',
        kundliPdfUrl: 'https://krishnacoming.com/reports/sample_garbh_kundli.pdf',
        astrologerNotes: 'Jupiter in auspicious trine. Auspicious days for womb talks: Thursdays & Full Moon. Sacred gemstone suggestion: Yellow Sapphire or pearl.'
      };
      return res.status(200).json({ success: true, data: record });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 5. Bal Sanskar (Infant Care 0-2 Years)
  getBalSanskarDetails: async (req: Request, res: Response) => {
    try {
      const activities = [
        { id: 'bs_1', month: 1, title: 'Pratham Sparsh (Sacred Touch & Massage)', duration: '15 mins', category: 'Physical' },
        { id: 'bs_2', month: 2, title: 'Karna Bodh (Gentle Sounds & Lullabies)', duration: '12 mins', category: 'Sensory' },
        { id: 'bs_3', month: 3, title: 'Drishti Vikas (Color & High Contrast Cards)', duration: '10 mins', category: 'Cognitive' },
        { id: 'bs_4', month: 6, title: 'Annaprashan Vidhi & Sattvic Weaning Diet', duration: '20 mins', category: 'Ayurveda' },
        { id: 'bs_5', month: 12, title: 'Bhasha Vikas (Vedic Rhymes & Moral Tales)', duration: '15 mins', category: 'Speech' },
      ];

      return res.status(200).json({
        success: true,
        programName: 'Bal Sanskar (0-2 Years)',
        overview: 'Postnatal physical, emotional, and cognitive nurturing grounded in traditional Ayurvedic and modern pediatric milestones.',
        activities
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 6. Preconception (Garbhadhan)
  getPreconceiveDetails: async (req: Request, res: Response) => {
    try {
      return res.status(200).json({
        success: true,
        title: 'Garbhadhan Sanskar (Preconception Preparation)',
        pillars: [
          { title: 'Beej Shuddhi', description: 'Cellular detox and Ayurvedic nourishment for egg & sperm quality' },
          { title: 'Chitta Shuddhi', description: 'Mental serenity, prayer, and stress reduction for welcoming a noble soul' },
          { title: 'Muhurat Nirnay', description: 'Astrological calculation of auspicious planetary windows for conception' }
        ],
        availableSlots: [
          'Tomorrow 11:00 AM - Dr. Sunita Sharma (Ayurvedic Gynaecologist)',
          'Tomorrow 04:00 PM - Acharya Vikramaditya (Vedic Astrologer)',
          'Friday 10:30 AM - Dr. Pooja Deshmukh (Nutritionist)'
        ]
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 7. Live Sessions & Doctor Webinars
  getLiveSessions: async (req: Request, res: Response) => {
    try {
      const upcoming = [
        {
          id: 'live_kc_101',
          title: 'Garbh Samvad & Fetal Brain Stimulation with Raagas',
          hindiTitle: 'गर्भ संवाद एवं शास्त्रीय रागों द्वारा शिशु मस्तिष्क विकास',
          doctorName: 'Dr. Anita Joshi',
          credentials: 'MD (Ayurveda Gynaecology), Certified Fetal Psychologist',
          institution: 'Vedic Maternity & Neuro-Fetal Research Institute',
          dateTime: 'Saturday • 11:00 AM IST',
          zoomLink: 'https://zoom.us/j/9109121342?pwd=KC_VEDIC_SANSCAR',
          status: 'live_today',
          trimester: 'Trimester 2 & 3',
          category: 'brain_stimulation',
          categoryLabel: 'Brain Stimulation & Raagas 🧠',
          registeredCount: 582,
          overview: 'Discover how specific 432Hz sound vibrations, parents loving speech patterns, and rhythmic Vedic mantras physically accelerate neural dendritic connections in the fetal auditory cortex.',
          learningPoints: [
            'How baby hears and processes father vs mother voice pitch',
            '432Hz Raag Yaman and Raag Bilawal neuro-stimulatory protocol',
            'Overcoming maternal cortisol to protect baby limbic system',
            'Interactive live womb-bonding dialogue exercise'
          ],
        },
        {
          id: 'live_kc_102',
          title: 'Easy Natural Birth & Pelvic Opening Yoga (Sukha Prasava)',
          hindiTitle: 'सुख प्रसव योग व पेल्विक लचीलापन कार्यशाला',
          doctorName: 'Dr. Meenakshi Sharma',
          credentials: 'MS (Obs & Gynae), Prenatal Yoga Guru',
          institution: 'Apollo Maternity & Garbh Sanskar Center',
          dateTime: 'Sunday • 04:30 PM IST',
          zoomLink: 'https://zoom.us/j/9109121343?pwd=KC_VEDIC_SANSCAR',
          status: 'upcoming',
          trimester: 'Trimester 2 & 3',
          category: 'safe_delivery',
          categoryLabel: 'Safe Delivery & Yoga 🧘‍♀️',
          registeredCount: 420,
          overview: 'Learn proven physiological movement sequences, gentle pelvic floor strengthening, and butterfly stretches designed to ease baby down into the optimal anterior birth position.',
          learningPoints: [
            'Bhadrasana and pelvic tilt postures for labor readiness',
            'Breathing techniques (Apana Vayu Pranayama) during contractions',
            'Perineal massage and natural labor pain management',
            'Live posture correction and pelvic alignment'
          ],
        },
        {
          id: 'live_kc_103',
          title: 'Ayurvedic Trimester Diet: Iron & Calcium Without Constipation',
          hindiTitle: 'माह-अनुसार आयुर्वेदिक सात्विक आहार एवं पोषण',
          doctorName: 'Dr. Vasant Lad & Dt. Neha Gupta',
          credentials: 'BAMS, MD (Ayurveda Nutrition & Dietetics)',
          institution: 'National Institute of Ayurvedic Sciences',
          dateTime: 'Tuesday • 06:00 PM IST',
          zoomLink: 'https://zoom.us/j/9109121344?pwd=KC_VEDIC_SANSCAR',
          status: 'upcoming',
          trimester: 'All Trimesters',
          category: 'nutrition',
          categoryLabel: 'Ayurvedic Nutrition 🥗',
          registeredCount: 390,
          overview: 'Master satvik pregnancy eating principles: natural food sources of iron, calcium, and DHA that absorb smoothly without triggering heartburn or sluggish digestion.',
          learningPoints: [
            'Superfoods for fetal bone density and maternal hemoglobin',
            'Munakka and anjeer water for smooth bowel motility',
            'Debunking ghee myths: how much healthy fat baby really needs',
            'Personalized trimester meal timetable guide'
          ],
        },
      ];

      const recorded = [
        {
          id: 'rec_kc_201',
          title: 'Spiritual Preparation for Normal Gentle Birth',
          hindiTitle: 'सुखद व निर्भय प्रसव की आध्यात्मिक तैयारी',
          doctorName: 'Dr. Sunita Sharma, MD (Gynae)',
          duration: '48 mins',
          category: 'safe_delivery',
          categoryLabel: 'Safe Delivery 🧘‍♀️',
          trimester: 'Trimester 3',
          viewsCount: '12.4k views',
          notesAvailable: true,
          thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          summary: 'A transformative clinical masterclass on removing maternal fear and birth anxiety through ancient Garbha Upanishad meditation and focused pelvic relaxation.',
          takeaways: [
            'The fear-tension-pain cycle and how to dissolve it',
            'Sacred affirmations for the labor room',
            'Birthing partner guidance: how fathers support active labor'
          ]
        },
        {
          id: 'rec_kc_202',
          title: 'Overcoming Pregnancy Anxiety with Pranayama & Mantras',
          hindiTitle: 'प्राणायाम व मंत्रोच्चार द्वारा गर्भावस्था का तनाव मुक्ति',
          doctorName: 'Yogacharya Rajeshwar & Dr. Anita Joshi',
          duration: '42 mins',
          category: 'mantras',
          categoryLabel: 'Spiritual Mantras 🕉️',
          trimester: 'All Trimesters',
          viewsCount: '18.9k views',
          notesAvailable: true,
          thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          summary: 'Learn specific safe prenatal breathing rhythms (Anulom Vilom and Bhramari) that increase oxygen saturation to the placenta by up to 20%.',
          takeaways: [
            'Safe vs unsafe breathing exercises in pregnancy',
            'Santan Gopal Stotra recitation pronunciation guide',
            'Daily 15-minute mental peace protocol'
          ]
        },
        {
          id: 'rec_kc_203',
          title: 'Fetal Memory & Womb Education (Abhimanyu Principle)',
          hindiTitle: 'गर्भस्थ शिशु की स्मरण शक्ति व संस्कार (अभिमन्यु सिद्धांत)',
          doctorName: 'Prof. Vipin Joshi',
          duration: '54 mins',
          category: 'brain_stimulation',
          categoryLabel: 'Brain Stimulation 🧠',
          trimester: 'Trimester 2',
          viewsCount: '24.1k views',
          notesAvailable: true,
          thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          summary: 'Exploring the biological and historical proof of intrauterine learning, highlighting how mothers daily reading and moral contemplation shape baby subconscious instincts.',
          takeaways: [
            'When fetal sensory organs connect to cerebral memory banks',
            'Reading stories with moral values to the bump',
            'How maternal serenity fosters high EQ in infants'
          ]
        },
      ];

      return res.status(200).json({
        success: true,
        upcoming,
        recorded
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 8. Refer & Earn
  getReferralInfo: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const userCode = `ASTRO${userId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'MAA9'}`;

      return res.status(200).json({
        success: true,
        referralCode: userCode,
        rewardPerReferral: '₹500 / 1 Free Month',
        friendDiscount: '₹500 Off Any Plan',
        totalReferrals: 3,
        totalRewardsEarned: 1500,
        freeMonthsUnlocked: 1,
        shareMessage: `🌸 Join me on Astro Baby Garbh Sanskar! Use my referral code ${userCode} to get ₹500 discount on complete Vedic pregnancy guidance. Download now: https://astrobaby.app/invite/${userCode}`
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 9. Medical & Doctor Profile
  getMedicalProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const records = await MedicalProfilesCollection.find({ userId });
      const current = records[0] || {
        userId,
        doctorName: 'Dr. Radhika Sen',
        hospitalName: 'Apollo Cradle Maternity Hospital',
        doctorPhone: '+91 98765 43210',
        bloodGroup: 'B+',
        medicalConditions: ['Mild Morning Sickness', 'Normal Blood Pressure'],
        allergies: ['Penicillin']
      };

      return res.status(200).json({ success: true, data: current });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  updateMedicalProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const updated = await MedicalProfilesCollection.upsert({ userId }, { ...req.body, userId });
      return res.status(200).json({ success: true, message: 'Medical profile updated successfully', data: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // 10. Activity & Media Tracking (sync-video-tracking & sync-audio-tracking)
  trackActivity: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const { activityId, title, type = 'audio', durationSeconds = 300, watchedSeconds = 300 } = req.body;

      const record = await ActivityTrackingCollection.insert({
        userId,
        activityId: activityId || `act_${Date.now()}`,
        type,
        title: title || 'Vedic Chanting',
        durationSeconds,
        watchedSeconds,
        completed: watchedSeconds >= (durationSeconds * 0.8),
        date: new Date().toISOString().split('T')[0]!,
        score: Math.min(100, Math.round((watchedSeconds / durationSeconds) * 100))
      });

      return res.status(200).json({
        success: true,
        message: 'Activity tracking synced successfully',
        data: record
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

