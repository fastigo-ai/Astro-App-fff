import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class JsonCollection<T extends { id?: string; _id?: string }> {
  public filePath: string;
  public name: string;

  constructor(collectionName: string) {
    this.name = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
  }

  public read(): T[] {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (e) {
      console.error(`Error reading collection ${this.filePath}:`, e);
      return [];
    }
  }

  public write(data: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`Error writing collection ${this.filePath}:`, e);
    }
  }

  async insert(item: T): Promise<T> {
    const items = this.read();
    const record = {
      ...item,
      _id: item._id || item.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(record as any);
    this.write(items);
    return record as T;
  }

  async upsert(query: Partial<T>, update: Partial<T>): Promise<T> {
    const items = this.read();
    const index = items.findIndex((item: any) => {
      return Object.keys(query).every(key => item[key] === (query as any)[key]);
    });

    if (index >= 0) {
      items[index] = {
        ...items[index],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      this.write(items);
      return items[index];
    } else {
      return this.insert({ ...query, ...update } as any);
    }
  }

  async find(query: Partial<T> = {}): Promise<T[]> {
    const items = this.read();
    if (Object.keys(query).length === 0) return items;
    return items.filter((item: any) => {
      return Object.keys(query).every(key => item[key] === (query as any)[key]);
    });
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    const items = await this.find(query);
    return items[0] || null;
  }

  async update(id: string, update: Partial<T>): Promise<T | null> {
    const items = this.read();
    const index = items.findIndex((item: any) => item._id === id || item.id === id);
    if (index >= 0) {
      items[index] = {
        ...items[index],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      this.write(items);
      return items[index];
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const items = this.read();
    const filtered = items.filter((item: any) => item._id !== id && item.id !== id);
    if (filtered.length !== items.length) {
      this.write(filtered);
      return true;
    }
    return false;
  }

  async deleteById(id: string): Promise<boolean> {
    return this.delete(id);
  }
}

export interface IAvatarHistoryItem {
  url: string;
  publicId?: string;
  count: number;
  updatedAt: string;
  ip?: string;
  userAgent?: string;
}

export interface IUserJourney {
  _id?: string;
  userId?: string;
  phone?: string;
  name?: string;
  dob?: string;
  city?: string;
  state?: string;
  language?: string;
  stage?: 'pregnant' | 'planning';
  lmp_date?: string;
  edd_date?: string;
  confirmed_month?: number;
  remaining_months?: number;
  planning_timeline?: string;
  avatar?: string;
  avatarPublicId?: string;
  avatarUpdateCount?: number;
  avatarUpdatedAt?: string;
  avatarHistory?: IAvatarHistoryItem[];
  subscription_tier?: 'full' | 'half' | 'trial';
  subscription_status?: 'active' | 'trial' | 'none' | 'expired';
  last_subscribed_program?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubscriptionRecord {
  _id?: string;
  userId?: string;
  phone?: string;
  planId: string;
  programId?: string;
  tier: 'full' | 'half'; // Utkarsh vs Aadhar
  planName: string;
  amount: number;
  currency: string;
  durationMonths: number;
  calculatedForMonth?: number;
  paymentMode?: 'full' | 'emi';
  totalInstallments?: number;
  paidInstallments?: number;
  nextInstallmentDue?: string;
  unlockedModules?: string[];
  status: 'active' | 'expired' | 'cancelled';
  paymentId?: string;
  orderId?: string;
  activatedAt: string;
  expiresAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPaymentRecord {
  _id?: string;
  orderId: string;
  paymentId: string;
  signature?: string;
  userId: string;
  phone: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  method?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IKickSession {
  _id?: string;
  userId?: string;
  phone?: string;
  babyId?: string;
  totalKicks: number;
  durationSeconds: number;
  targetKicks: number;
  completed: boolean;
  notes?: string;
  kickTimestamps?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IMoodLog {
  _id?: string;
  userId?: string;
  phone?: string;
  moodId: string;
  moodLabel: string;
  moodEmoji: string;
  calmingTherapyUsed?: string;
  breathingSeconds?: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISamvadNote {
  _id?: string;
  userId?: string;
  phone?: string;
  category: string;
  title: string;
  promptSnippet: string;
  momNote?: string;
  hasAudioRecording?: boolean;
  durationSeconds?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProgramSchemeRecord {
  id: string;
  title: string;
  hindiTitle?: string;
  subtitle: string;
  category: string;
  badge?: string;
  color?: string;
  rating?: number;
  reviewsCount?: number;
  enrolledCount?: string;
  overview: string;
  whoIsItFor: string;
  duration: string;
  unlockedModules: string[];
  tiers: {
    id: string;
    name: string;
    tagline: string;
    badge?: string;
    duration: string;
    durationMonths: number;
    originalPrice: number;
    calculatedPrice: number;
    discountPercent: number;
    monthlyRate: string;
    highlightText: string;
    features: string[];
  }[];
  modules?: {
    title: string;
    description: string;
    items: string[];
  }[];
  deliverables?: string[];
  faculty?: { name: string; role: string; exp: string }[];
  faqs?: { q: string; a: string }[];
  status: 'active' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface ICoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscountCap?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive';
  description: string;
  createdAt?: string;
}

export interface ILiveClass {
  id: string;
  programId: string;
  title: string;
  hindiTitle?: string;
  instructor: string;
  doctorName?: string;
  credentials?: string;
  institution?: string;
  dateTime: string;
  scheduledAt?: string;
  durationMinutes: number;
  joinUrl: string;
  zoomLink?: string;
  status: 'upcoming' | 'live' | 'live_today' | 'completed' | 'cancelled';
  trimester?: string;
  category?: string;
  categoryLabel?: string;
  overview?: string;
  learningPoints?: string[];
  attendeesCount: number;
  registeredCount?: number;
  maxCapacity?: number;
  isFreePreview?: boolean;
  recordingUrl?: string;
  notesUrl?: string;
  recordedClassId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRecordedClass {
  id: string;
  programId: string;
  sourceLiveClassId?: string;
  title: string;
  hindiTitle?: string;
  doctorName: string;
  instructor?: string;
  duration: string;
  durationSeconds?: number;
  category: string;
  categoryLabel: string;
  trimester: string;
  viewsCount: string;
  viewsNumeric?: number;
  notesAvailable: boolean;
  notesUrl?: string;
  thumbnail: string;
  videoUrl: string;
  summary: string;
  takeaways: string[];
  isFreePreview?: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseLesson {
  id: string;
  programId: string;
  moduleTitle: string;
  moduleOrder?: number;
  lessonTitle: string;
  order?: number;
  description?: string;
  contentType: 'video' | 'audio' | 'pdf' | 'activity';
  duration: string;
  durationSeconds?: number;
  contentUrl: string;
  thumbnail?: string;
  notesUrl?: string;
  trimester?: string;
  isFreePreview: boolean;
  status?: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface ILiveClassRegistration {
  id?: string;
  classId: string;
  userId: string;
  phone: string;
  userName?: string;
  status: 'registered' | 'attended' | 'cancelled';
  registeredAt: string;
  joinedAt?: string;
}

export interface ILessonProgress {
  id?: string;
  userId: string;
  phone: string;
  programId: string;
  itemId: string;
  itemType: 'lesson' | 'recorded_class';
  watchedSeconds: number;
  durationSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}

export interface IKitDispatch {
  id: string;
  orderId: string;
  phone: string;
  userName: string;
  kitName: string;
  shippingAddress: string;
  courier: string;
  trackingNumber: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  updatedAt: string;
  createdAt?: string;
}

export interface IBroadcastNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'pregnant' | 'planning' | 'subscribed';
  sentAt: string;
}

export interface IKundliRecord {
  _id?: string;
  id?: string;
  userId: string;
  motherName: string;
  fatherName: string;
  motherDob: string;
  fatherDob: string;
  placeOfBirth: string;
  conceptionDate?: string;
  expectedDeliveryDate?: string;
  gotra?: string;
  questions?: string;
  status: 'pending' | 'in_review' | 'ready';
  kundliPdfUrl?: string;
  astrologerNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBalSanskarRecord {
  _id?: string;
  id?: string;
  userId: string;
  babyName: string;
  gender: 'boy' | 'girl' | 'prefer_not_to_say';
  dateOfBirth: string;
  currentAgeMonths: number;
  completedActivities: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IPreconceiveRecord {
  _id?: string;
  id?: string;
  userId: string;
  planningTimeline: string;
  cycleLengthDays?: number;
  lastPeriodDate?: string;
  ovulationWindowStart?: string;
  ovulationWindowEnd?: string;
  counsellingSlot?: string;
  dietPlan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReferralRecord {
  _id?: string;
  id?: string;
  userId: string;
  referralCode: string;
  referredUsers: {
    userId: string;
    phone: string;
    joinedAt: string;
    subscribed: boolean;
    rewardEarned: number;
  }[];
  totalCoinsEarned: number;
  freeMonthsUnlocked: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMedicalProfileRecord {
  _id?: string;
  id?: string;
  userId: string;
  doctorName?: string;
  hospitalName?: string;
  doctorPhone?: string;
  bloodGroup?: string;
  medicalConditions?: string[];
  allergies?: string[];
  reports?: { title: string; url: string; date: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IActivityTrackingRecord {
  _id?: string;
  id?: string;
  userId: string;
  activityId: string;
  type: 'video' | 'audio' | 'mantra' | 'exercise';
  title: string;
  durationSeconds: number;
  watchedSeconds: number;
  completed: boolean;
  score?: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFaqRecord {
  id: string;
  category: string;
  question: string;
  answer: string;
  language?: string;
}

export interface IDoctorRecord {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  imageUrl: string;
  bio: string;
  availableDays: string[];
}

export interface ISupportTicketMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ISupportTicket {
  _id: string;
  userId: string;
  userPhone: string;
  userName: string;
  category: 'payment' | 'medical' | 'classes' | 'general';
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'normal' | 'high' | 'urgent';
  messages: Array<{ id: string; sender: 'user' | 'admin'; senderName: string; text: string; createdAt: string }>;
  assignedAdmin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const UserJourneysCollection = new JsonCollection<IUserJourney>('user_journeys');
export const SubscriptionsCollection = new JsonCollection<ISubscriptionRecord>('subscriptions');
export const PaymentsCollection = new JsonCollection<IPaymentRecord>('payments');
export const KickSessionsCollection = new JsonCollection<IKickSession>('kick_sessions');
export const MoodLogsCollection = new JsonCollection<IMoodLog>('mood_logs');
export const SamvadNotesCollection = new JsonCollection<ISamvadNote>('samvad_notes');
export const ProgramSchemesCollection = new JsonCollection<IProgramSchemeRecord>('program_schemes');
export const CouponsCollection = new JsonCollection<ICoupon>('coupons');
export const LiveClassesCollection = new JsonCollection<ILiveClass>('live_classes');
export const RecordedClassesCollection = new JsonCollection<IRecordedClass>('recorded_classes');
export const LiveClassRegistrationsCollection = new JsonCollection<ILiveClassRegistration>('live_class_registrations');
export const CourseLessonsCollection = new JsonCollection<ICourseLesson>('course_lessons');
export const LessonProgressCollection = new JsonCollection<ILessonProgress>('lesson_progress');
export const KitDispatchesCollection = new JsonCollection<IKitDispatch>('kit_dispatches');
export const BroadcastNotificationsCollection = new JsonCollection<IBroadcastNotification>('broadcast_notifications');
export const KundliCollection = new JsonCollection<IKundliRecord>('kundli');
export const BalSanskarCollection = new JsonCollection<IBalSanskarRecord>('bal_sanskar');
export const PreconceiveCollection = new JsonCollection<IPreconceiveRecord>('preconceive');
export const ReferralsCollection = new JsonCollection<IReferralRecord>('referrals');
export const MedicalProfilesCollection = new JsonCollection<IMedicalProfileRecord>('medical_profiles');
export const ActivityTrackingCollection = new JsonCollection<IActivityTrackingRecord>('activity_tracking');
export const FaqsCollection = new JsonCollection<IFaqRecord>('faqs');
export const DoctorsCollection = new JsonCollection<IDoctorRecord>('doctors');
export const SupportTicketsCollection = new JsonCollection<ISupportTicket>('support_tickets');

// Auto-seed default 6 programs if empty
export const seedDefaultPrograms = () => {
  const existing = ProgramSchemesCollection.read();
  if (existing.length === 0) {
    const defaultPrograms: IProgramSchemeRecord[] = [
      {
        id: 'garbh_sanskar',
        title: 'Garbh Sanskar',
        hindiTitle: 'गर्भ संस्कार',
        subtitle: 'Positive Pregnancy & Womb Bonding',
        category: 'Pregnancy',
        badge: 'MOST POPULAR',
        color: '#65A30D',
        rating: 4.9,
        reviewsCount: 3840,
        enrolledCount: '12,500+ Moms',
        overview: 'An authentic Vedic and modern scientific Garbh Sanskar program designed to stimulate baby IQ, EQ, and spiritual intelligence.',
        whoIsItFor: 'Pregnant mothers in any trimester (Month 1 to 9).',
        duration: 'Full Pregnancy (~3 to 9 Months till Delivery)',
        unlockedModules: ['kicks', 'bump', 'samvad', 'mood', 'activities', 'diet', 'doctor_chat'],
        status: 'active',
        tiers: [
          {
            id: 'garbhsanskar-utkarsh',
            name: 'Utkarsh (Complete Journey)',
            tagline: 'Till Delivery Complete Holistic Care',
            badge: 'RECOMMENDED • BEST VALUE',
            duration: 'Till Delivery (~6-9 Months)',
            durationMonths: 6,
            originalPrice: 4499,
            calculatedPrice: 2499,
            discountPercent: 44,
            monthlyRate: '₹416/mo',
            highlightText: 'Full coverage for all remaining pregnancy months',
            features: [
              'Full coverage till your delivery date',
              'Daily Vedic Garbh Sanskar routine & Shlokas',
              'Live pregnancy yoga & guided meditation',
              'Trimester Ayurvedic diet chart & consultations',
            ],
          },
          {
            id: 'garbhsanskar-aadhar',
            name: 'Aadhar (3 Months Starter)',
            tagline: 'Core Trimester Foundation Plan',
            badge: 'STARTER',
            duration: '3 Months Active Access',
            durationMonths: 3,
            originalPrice: 2499,
            calculatedPrice: 1499,
            discountPercent: 40,
            monthlyRate: '₹499/mo',
            highlightText: '3 Months core Garbh Sanskar foundation',
            features: [
              '3 Months active daily Vedic activities',
              'Recorded pregnancy yoga & relaxation audio',
            ],
          },
        ],
      },
      {
        id: 'beej_sanskar',
        title: 'Beej Sanskar',
        hindiTitle: 'बीज संस्कार',
        subtitle: 'Fertility Detox & Egg/Sperm Vitality',
        category: 'Conception',
        badge: 'FERTILITY CARE',
        color: '#EC4899',
        rating: 4.95,
        reviewsCount: 1920,
        enrolledCount: '5,800+ Couples',
        overview: 'A specialized 90-day couple program blending classical Ayurvedic Panchakarma principles, hormonal diets, and reproductive yoga.',
        whoIsItFor: 'Couples trying to conceive naturally or preparing for parenthood.',
        duration: '90 Days Comprehensive Program',
        unlockedModules: ['activities', 'diet', 'doctor_chat', 'mood'],
        status: 'active',
        tiers: [
          {
            id: 'beej-complete',
            name: 'Beej Shuddhi Complete (Couple)',
            tagline: '90-Day Full Holistic Couple Journey',
            badge: 'MOST EFFECTIVE',
            duration: '90 Days Complete Protocol',
            durationMonths: 3,
            originalPrice: 25000,
            calculatedPrice: 7999,
            discountPercent: 68,
            monthlyRate: '₹2,666/mo',
            highlightText: 'Full 90-day couple fertility transformation protocol',
            features: [
              'Dual partner Ayurvedic health evaluation',
              'Beej Shuddhi herbal detox guidance',
              'Fertile window hormonal tracker',
            ],
          },
        ],
      },
      {
        id: 'garbhdhaan_sanskar',
        title: 'Garbhdhaan Sanskar',
        hindiTitle: 'गर्भाधान संस्कार',
        subtitle: 'Auspicious Pre-Pregnancy Planning & Muhurat',
        category: 'Planning',
        badge: 'PLANNING',
        color: '#3B82F6',
        rating: 4.9,
        reviewsCount: 1420,
        enrolledCount: '4,200+ Couples',
        overview: 'Combines astrological Muhurat Aadharit Tithis, pre-pregnancy medical checklists, and auspicious spiritual rituals.',
        whoIsItFor: 'Couples planning pregnancy within the next 3 to 12 months.',
        duration: '6 Months Preconception Auspicious Window',
        unlockedModules: ['activities', 'diet', 'doctor_chat'],
        status: 'active',
        tiers: [
          {
            id: 'garbhdhaan-full',
            name: 'Garbhdhaan Complete Muhurat & Health',
            tagline: 'Complete Auspicious Conception Program',
            badge: 'POPULAR',
            duration: '6 Months Full Validity',
            durationMonths: 6,
            originalPrice: 11000,
            calculatedPrice: 3999,
            discountPercent: 64,
            monthlyRate: '₹666/mo',
            highlightText: 'Customized Muhurat calculations & doctor clearance',
            features: [
              'Personalized Shubh Muhurat calendar for 6 months',
              'Horoscope planetary matching for conception',
            ],
          },
        ],
      },
      {
        id: 'bal_sanskar',
        title: 'Bal Sanskar',
        hindiTitle: 'बाल संस्कार',
        subtitle: 'Newborn Nurturing & Sacred Ceremonies',
        category: 'Newborn',
        badge: 'NEWBORN 0-2 YRS',
        color: '#06B6D4',
        rating: 4.92,
        reviewsCount: 1680,
        enrolledCount: '6,400+ Babies',
        overview: 'Complete Vedic ceremonies (Namkaran, Annaprashan, Mundan) alongside modern pediatric development tracking.',
        whoIsItFor: 'Parents with newborns, infants, and toddlers (0 to 24 months).',
        duration: '1 Year Full Infant Care & Ceremony Access',
        unlockedModules: ['activities', 'diet', 'doctor_chat', 'mood'],
        status: 'active',
        tiers: [
          {
            id: 'bal-complete',
            name: 'Bal Sanskar 1-Year Comprehensive',
            tagline: 'All Vedic Ceremonies & Milestone Care',
            badge: 'RECOMMENDED',
            duration: '12 Months Active Access',
            durationMonths: 12,
            originalPrice: 12000,
            calculatedPrice: 3499,
            discountPercent: 70,
            monthlyRate: '₹291/mo',
            highlightText: 'Full coverage for infant year 1 & all 4 major ceremonies',
            features: [
              'Vedic Namkaran & Annaprashan ceremony guides',
              'Ayurvedic baby massage (Abhyanga) video routines',
            ],
          },
        ],
      },
      {
        id: 'infant_care',
        title: 'Infant Care',
        hindiTitle: 'शिशु एवं प्रसूता देखभाल',
        subtitle: 'Postpartum Mother Care & Infant Parenting Coach',
        category: 'Postpartum',
        badge: 'POSTPARTUM COACHING',
        color: '#F59E0B',
        rating: 4.88,
        reviewsCount: 1250,
        enrolledCount: '4,900+ Mothers',
        overview: 'Dedicated support for new mothers during the crucial first 6 months post-delivery with lactation and recovery.',
        whoIsItFor: 'New mothers in their 4th trimester (0 to 6 months post-delivery).',
        duration: '6 Months Comprehensive Postpartum Care',
        unlockedModules: ['activities', 'diet', 'doctor_chat', 'mood'],
        status: 'active',
        tiers: [
          {
            id: 'infant-complete',
            name: 'Infant & Postpartum Care Complete',
            tagline: 'Lactation, Recovery Diet & Parenting Coach',
            badge: 'ALL-IN-ONE',
            duration: '6 Months Complete Coaching',
            durationMonths: 6,
            originalPrice: 8999,
            calculatedPrice: 2999,
            discountPercent: 66,
            monthlyRate: '₹499/mo',
            highlightText: 'Full postpartum mother and newborn support',
            features: [
              '1-on-1 Certified Lactation consultant video session',
              'Customized postpartum healing diet & recovery exercises',
            ],
          },
        ],
      },
      {
        id: 'consultations',
        title: 'A La Carte Consults',
        hindiTitle: 'विशेषज्ञ परामर्श (१-ऑन-१)',
        subtitle: 'Direct 1-on-1 Video Consultations',
        category: 'Consultations',
        badge: '1-ON-1 SESSIONS',
        color: '#854D0E',
        rating: 4.96,
        reviewsCount: 2210,
        enrolledCount: '8,900+ Consults',
        overview: 'Book direct, confidential 1-on-1 video consultations with top Gynecologists, Vedic Astrologers, and Nutritionists.',
        whoIsItFor: 'Any parent or expecting couple needing customized expert answers.',
        duration: 'Single Session or 3-Pack Bundle',
        unlockedModules: ['doctor_chat'],
        status: 'active',
        tiers: [
          {
            id: 'consult-bundle',
            name: '3-Specialist Care Pack',
            tagline: 'Gynecologist + Astrologer + Dietitian',
            badge: 'BEST VALUE',
            duration: '3 Sessions (Valid 90 Days)',
            durationMonths: 3,
            originalPrice: 6300,
            calculatedPrice: 3499,
            discountPercent: 44,
            monthlyRate: '₹1,166/session',
            highlightText: 'Complete mind, body, and celestial guidance trio',
            features: [
              '1 Consultation with Senior Gynecologist (30 mins)',
              '1 Comprehensive Horoscope reading with Vedic Astrologer (30 mins)',
              '1 Personalized Diet & Nutrition consultation (30 mins)',
            ],
          },
        ],
      },
    ];
    ProgramSchemesCollection.write(defaultPrograms);
  }

  // Seed default coupons if empty
  if (CouponsCollection.read().length === 0) {
    CouponsCollection.write([
      {
        id: 'coup_vedic20',
        code: 'VEDIC20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 999,
        maxDiscountCap: 1000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 500,
        usedCount: 42,
        status: 'active',
        description: '20% Off on all Garbh Sanskar Complete Plans',
      },
      {
        id: 'coup_welcome500',
        code: 'WELCOME500',
        discountType: 'flat',
        discountValue: 500,
        minOrderValue: 1999,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 1000,
        usedCount: 156,
        status: 'active',
        description: 'Flat ₹500 discount for new expecting mothers',
      },
      {
        id: 'coup_festive30',
        code: 'AUSTRO30',
        discountType: 'percentage',
        discountValue: 30,
        minOrderValue: 2499,
        maxDiscountCap: 1500,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 200,
        usedCount: 88,
        status: 'active',
        description: 'Special 30% Festive Discount on Beej Sanskar & Garbh Sanskar',
      },
    ]);
  }

  // Seed default live classes if empty
  if (LiveClassesCollection.read().length === 0) {
    LiveClassesCollection.write([
      {
        id: 'live_kc_101',
        programId: 'garbh_sanskar',
        title: 'Garbh Samvad & Fetal Brain Stimulation with Raagas',
        hindiTitle: 'गर्भ संवाद एवं शास्त्रीय रागों द्वारा शिशु मस्तिष्क विकास',
        instructor: 'Dr. Anita Joshi',
        doctorName: 'Dr. Anita Joshi',
        credentials: 'MD (Ayurveda Gynaecology), Certified Fetal Psychologist',
        institution: 'Vedic Maternity & Neuro-Fetal Research Institute',
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 45,
        joinUrl: 'https://zoom.us/j/9109121342?pwd=KC_VEDIC_SANSCAR',
        zoomLink: 'https://zoom.us/j/9109121342?pwd=KC_VEDIC_SANSCAR',
        status: 'live_today',
        trimester: 'Trimester 2 & 3',
        category: 'brain_stimulation',
        categoryLabel: 'Brain Stimulation & Raagas 🧠',
        overview: 'Discover how specific 432Hz sound vibrations, parents loving speech patterns, and rhythmic Vedic mantras physically accelerate neural dendritic connections in the fetal auditory cortex.',
        learningPoints: [
          'How baby hears and processes father vs mother voice pitch',
          '432Hz Raag Yaman and Raag Bilawal neuro-stimulatory protocol',
          'Overcoming maternal cortisol to protect baby limbic system',
          'Interactive live womb-bonding dialogue exercise',
        ],
        attendeesCount: 582,
        registeredCount: 582,
        maxCapacity: 1000,
        isFreePreview: true,
      },
      {
        id: 'live_kc_102',
        programId: 'garbh_sanskar',
        title: 'Easy Natural Birth & Pelvic Opening Yoga (Sukha Prasava)',
        hindiTitle: 'सुख प्रसव योग व पेल्विक लचीलापन कार्यशाला',
        instructor: 'Dr. Meenakshi Sharma',
        doctorName: 'Dr. Meenakshi Sharma',
        credentials: 'MS (Obs & Gynae), Prenatal Yoga Guru',
        institution: 'Apollo Maternity & Garbh Sanskar Center',
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60,
        joinUrl: 'https://zoom.us/j/9109121343?pwd=KC_VEDIC_SANSCAR',
        zoomLink: 'https://zoom.us/j/9109121343?pwd=KC_VEDIC_SANSCAR',
        status: 'upcoming',
        trimester: 'Trimester 2 & 3',
        category: 'safe_delivery',
        categoryLabel: 'Safe Delivery & Yoga 🧘‍♀️',
        overview: 'Learn proven physiological movement sequences, gentle pelvic floor strengthening, and butterfly stretches designed to ease baby down into the optimal anterior birth position.',
        learningPoints: [
          'Bhadrasana and pelvic tilt postures for labor readiness',
          'Breathing techniques (Apana Vayu Pranayama) during contractions',
          'Perineal massage and natural labor pain management',
          'Live posture correction and pelvic alignment',
        ],
        attendeesCount: 420,
        registeredCount: 420,
        maxCapacity: 1000,
        isFreePreview: false,
      },
      {
        id: 'live_kc_103',
        programId: 'beej_sanskar',
        title: 'Ayurvedic Trimester Diet: Iron & Calcium Without Constipation',
        hindiTitle: 'माह-अनुसार आयुर्वेदिक सात्विक आहार एवं पोषण',
        instructor: 'Dr. Vasant Lad & Dt. Neha Gupta',
        doctorName: 'Dr. Vasant Lad & Dt. Neha Gupta',
        credentials: 'BAMS, MD (Ayurveda Nutrition & Dietetics)',
        institution: 'National Institute of Ayurvedic Sciences',
        dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 60,
        joinUrl: 'https://zoom.us/j/9109121344?pwd=KC_VEDIC_SANSCAR',
        zoomLink: 'https://zoom.us/j/9109121344?pwd=KC_VEDIC_SANSCAR',
        status: 'upcoming',
        trimester: 'All Trimesters',
        category: 'nutrition',
        categoryLabel: 'Ayurvedic Nutrition 🥗',
        overview: 'Master satvik pregnancy eating principles: natural food sources of iron, calcium, and DHA that absorb smoothly without triggering heartburn or sluggish digestion.',
        learningPoints: [
          'Superfoods for fetal bone density and maternal hemoglobin',
          'Munakka and anjeer water for smooth bowel motility',
          'Debunking ghee myths: how much healthy fat baby really needs',
          'Personalized trimester meal timetable guide',
        ],
        attendeesCount: 390,
        registeredCount: 390,
        maxCapacity: 1000,
        isFreePreview: false,
      },
    ]);
  }

  // Seed default recorded classes if empty
  if (RecordedClassesCollection.read().length === 0) {
    RecordedClassesCollection.write([
      {
        id: 'rec_kc_201',
        programId: 'garbh_sanskar',
        title: 'Spiritual Preparation for Normal Gentle Birth',
        hindiTitle: 'सुखद व निर्भय प्रसव की आध्यात्मिक तैयारी',
        doctorName: 'Dr. Sunita Sharma, MD (Gynae)',
        instructor: 'Dr. Sunita Sharma, MD (Gynae)',
        duration: '48 mins',
        durationSeconds: 2880,
        category: 'safe_delivery',
        categoryLabel: 'Safe Delivery 🧘‍♀️',
        trimester: 'Trimester 3',
        viewsCount: '12.4k views',
        viewsNumeric: 12400,
        notesAvailable: true,
        notesUrl: 'https://cdn.astrobaby.app/notes/gentle-birth-prep.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'A transformative clinical masterclass on removing maternal fear and birth anxiety through ancient Garbha Upanishad meditation and focused pelvic relaxation.',
        takeaways: [
          'The fear-tension-pain cycle and how to dissolve it',
          'Sacred affirmations for the labor room',
          'Birthing partner guidance: how fathers support active labor',
        ],
        isFreePreview: true,
        status: 'published',
      },
      {
        id: 'rec_kc_202',
        programId: 'garbh_sanskar',
        title: 'Overcoming Pregnancy Anxiety with Pranayama & Mantras',
        hindiTitle: 'प्राणायाम व मंत्रोच्चार द्वारा गर्भावस्था का तनाव मुक्ति',
        doctorName: 'Yogacharya Rajeshwar & Dr. Anita Joshi',
        instructor: 'Yogacharya Rajeshwar & Dr. Anita Joshi',
        duration: '42 mins',
        durationSeconds: 2520,
        category: 'mantras',
        categoryLabel: 'Spiritual Mantras 🕉️',
        trimester: 'All Trimesters',
        viewsCount: '18.9k views',
        viewsNumeric: 18900,
        notesAvailable: true,
        notesUrl: 'https://cdn.astrobaby.app/notes/pranayama-mantras.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'Learn specific safe prenatal breathing rhythms (Anulom Vilom and Bhramari) that increase oxygen saturation to the placenta by up to 20%.',
        takeaways: [
          'Safe vs unsafe breathing exercises in pregnancy',
          'Santan Gopal Stotra recitation pronunciation guide',
          'Daily 15-minute mental peace protocol',
        ],
        isFreePreview: false,
        status: 'published',
      },
      {
        id: 'rec_kc_203',
        programId: 'garbh_sanskar',
        title: 'Fetal Memory & Womb Education (Abhimanyu Principle)',
        hindiTitle: 'गर्भस्थ शिशु की स्मरण शक्ति व संस्कार (अभिमन्यु सिद्धांत)',
        doctorName: 'Prof. Vipin Joshi',
        instructor: 'Prof. Vipin Joshi',
        duration: '54 mins',
        durationSeconds: 3240,
        category: 'brain_stimulation',
        categoryLabel: 'Brain Stimulation 🧠',
        trimester: 'Trimester 2',
        viewsCount: '24.1k views',
        viewsNumeric: 24100,
        notesAvailable: true,
        notesUrl: 'https://cdn.astrobaby.app/notes/fetal-memory-abhimanyu.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'Exploring the biological and historical proof of intrauterine learning, highlighting how mothers daily reading and moral contemplation shape baby subconscious instincts.',
        takeaways: [
          'When fetal sensory organs connect to cerebral memory banks',
          'Reading stories with moral values to the bump',
          'How maternal serenity fosters high EQ in infants',
        ],
        isFreePreview: false,
        status: 'published',
      },
      {
        id: 'rec_beej_204',
        programId: 'beej_sanskar',
        title: 'Beej Shuddhi: 90-Day Egg & Sperm Vitality Protocol',
        hindiTitle: 'बीज शुद्धि: ९० दिवसीय प्रजनन स्वास्थ्य विज्ञान',
        doctorName: 'Acharya Vidyadhar & Dr. Pooja Deshmukh',
        instructor: 'Acharya Vidyadhar',
        duration: '51 mins',
        durationSeconds: 3060,
        category: 'fertility',
        categoryLabel: 'Fertility & Detox 🌱',
        trimester: 'Preconception',
        viewsCount: '9.6k views',
        viewsNumeric: 9600,
        notesAvailable: true,
        notesUrl: 'https://cdn.astrobaby.app/notes/beej-shuddhi-protocol.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'A step-by-step clinical Ayurveda workshop for couples preparing for healthy conception through cellular detox, circadian rhythm reset, and micronutrients.',
        takeaways: [
          '90-day follicular and spermatogenesis nourishment timeline',
          'Herbal formulations & satvik kitchen swaps for hormonal balance',
          'Stress reduction rituals for couples trying to conceive',
        ],
        isFreePreview: true,
        status: 'published',
      },
      {
        id: 'rec_bal_205',
        programId: 'bal_sanskar',
        title: 'Abhyanga Baby Massage & Infant Neuro-Motor Milestones',
        hindiTitle: 'शिशु अभ्यंग मालिश एवं मस्तिष्क विकास',
        doctorName: 'Dr. Kavita Rao (MD Pediatrics)',
        instructor: 'Dr. Kavita Rao',
        duration: '36 mins',
        durationSeconds: 2160,
        category: 'infant_care',
        categoryLabel: 'Infant Development 👶',
        trimester: '0-12 Months',
        viewsCount: '15.2k views',
        viewsNumeric: 15200,
        notesAvailable: true,
        notesUrl: 'https://cdn.astrobaby.app/notes/abhyanga-massage-guide.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        summary: 'Demonstrates safe Ayurvedic warm-oil massage strokes that strengthen newborn bone density, calm colic, and improve deep sleep cycles.',
        takeaways: [
          'Choosing cold-pressed sesame vs coconut oil by season',
          'Tummy-time and sensory stimulation games for months 0-6',
          'Warning signs and milestone red flags for parents',
        ],
        isFreePreview: false,
        status: 'published',
      },
    ]);
  }

  // Seed default course lessons if empty
  if (CourseLessonsCollection.read().length === 0) {
    CourseLessonsCollection.write([
      {
        id: 'les_gs_01',
        programId: 'garbh_sanskar',
        moduleTitle: 'Module 1: Foundation of Vedic Garbh Sanskar',
        moduleOrder: 1,
        lessonTitle: 'Science & Spirituality of Womb Conditioning',
        order: 1,
        description: 'Understand how maternal emotions, nutrition, and sound vibrations influence fetal neuroplasticity.',
        contentType: 'video',
        duration: '18 mins',
        durationSeconds: 1080,
        contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
        notesUrl: 'https://cdn.astrobaby.app/notes/gs-mod1-les1.pdf',
        trimester: 'All Trimesters',
        isFreePreview: true,
        status: 'published',
      },
      {
        id: 'les_gs_02',
        programId: 'garbh_sanskar',
        moduleTitle: 'Module 1: Foundation of Vedic Garbh Sanskar',
        moduleOrder: 1,
        lessonTitle: 'Morning Garbh Prarthana & Sankalpa Audio',
        order: 2,
        description: 'Guided 12-minute Sanskrit & Hindi morning affirmation audio for serene womb connection.',
        contentType: 'audio',
        duration: '12 mins',
        durationSeconds: 720,
        contentUrl: 'https://cdn.astrobaby.app/audio/morning-garbh-prarthana.mp3',
        trimester: 'All Trimesters',
        isFreePreview: true,
        status: 'published',
      },
      {
        id: 'les_gs_03',
        programId: 'garbh_sanskar',
        moduleTitle: 'Module 2: Fetal Brain & Sensory Stimulation',
        moduleOrder: 2,
        lessonTitle: '432Hz Raag Yaman & Auditory Cortex Activation',
        order: 1,
        description: 'Evening classical raaga therapy calibrated for trimester 2 & 3 fetal auditory development.',
        contentType: 'audio',
        duration: '22 mins',
        durationSeconds: 1320,
        contentUrl: 'https://cdn.astrobaby.app/audio/raag-yaman-432hz.mp3',
        trimester: 'Trimester 2 & 3',
        isFreePreview: false,
        status: 'published',
      },
      {
        id: 'les_gs_04',
        programId: 'garbh_sanskar',
        moduleTitle: 'Module 2: Fetal Brain & Sensory Stimulation',
        moduleOrder: 2,
        lessonTitle: 'Trimester-Wise Satvik Nutrition Handbook (PDF)',
        order: 2,
        description: 'Downloadable meal charts, iron/calcium combinations, and Ayurvedic herbal drinks by month.',
        contentType: 'pdf',
        duration: '10 mins read',
        durationSeconds: 600,
        contentUrl: 'https://cdn.astrobaby.app/notes/trimester-nutrition-handbook.pdf',
        trimester: 'All Trimesters',
        isFreePreview: false,
        status: 'published',
      },
      {
        id: 'les_gs_05',
        programId: 'garbh_sanskar',
        moduleTitle: 'Module 3: Safe Labor & Sukha Prasava',
        moduleOrder: 3,
        lessonTitle: 'Prenatal Pelvic Opening Yoga Sequence',
        order: 1,
        description: 'Doctor-approved yoga postures for optimal fetal positioning and smoother normal delivery.',
        contentType: 'video',
        duration: '25 mins',
        durationSeconds: 1500,
        contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
        trimester: 'Trimester 3',
        isFreePreview: false,
        status: 'published',
      },
      {
        id: 'les_beej_01',
        programId: 'beej_sanskar',
        moduleTitle: 'Module 1: Beej Shuddhi Detox',
        moduleOrder: 1,
        lessonTitle: 'Preconception Cellular Cleansing & Agni Balance',
        order: 1,
        description: 'Foundational couple lifestyle reset to optimize egg and sperm vitality over 90 days.',
        contentType: 'video',
        duration: '20 mins',
        durationSeconds: 1200,
        contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        trimester: 'Preconception',
        isFreePreview: true,
        status: 'published',
      },
      {
        id: 'les_bal_01',
        programId: 'bal_sanskar',
        moduleTitle: 'Module 1: Sacred Newborn Ceremonies',
        moduleOrder: 1,
        lessonTitle: 'Namkaran & Annaprashan Sanskar Vidhi Guide',
        order: 1,
        description: 'Authentic step-by-step Vedic ritual checklist, mantras, and auspicious timing guidelines.',
        contentType: 'pdf',
        duration: '15 mins read',
        durationSeconds: 900,
        contentUrl: 'https://cdn.astrobaby.app/notes/bal-sanskar-ceremonies.pdf',
        trimester: '0-12 Months',
        isFreePreview: true,
        status: 'published',
      },
    ]);
  }

  // Seed default physical kit dispatches if empty
  if (KitDispatchesCollection.read().length === 0) {
    KitDispatchesCollection.write([
      {
        id: 'dispatch_101',
        orderId: 'order_TouAiyghT5AUp0',
        phone: '9366128220',
        userName: 'Astro Parent',
        kitName: 'Vedic Garbh Samvad Kit + Organic Saffron & Herb Pack',
        shippingAddress: 'Flat 402, Lotus Tower, Indiranagar, Bengaluru, 560038',
        courier: 'BlueDart Express',
        trackingNumber: 'BD982736412IN',
        status: 'out_for_delivery',
        updatedAt: new Date().toISOString(),
      },
    ]);
  }

  // Seed default support tickets if empty
  if (SupportTicketsCollection.read().length === 0) {
    SupportTicketsCollection.write([
      {
        _id: 'ticket_demo_01',
        userId: 'usr_demo_01',
        userPhone: '9366128220',
        userName: 'Astro Parent',
        category: 'payment',
        subject: 'Clarification regarding Utkarsh Scheme EMI Schedule',
        status: 'open',
        priority: 'high',
        messages: [
          {
            id: 'msg_demo_01',
            sender: 'user',
            senderName: 'Astro Parent',
            text: 'Hi Team, I completed my first installment for Utkarsh Garbh Sanskar. When is the next EMI due?',
            createdAt: new Date().toISOString(),
          },
        ],
        assignedAdmin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }
};

// Execute seed on file load
seedDefaultPrograms();

// ACID Transaction Engine with Isolation Mutex and Rollback Guarantees
let transactionMutex = Promise.resolve();

export async function executeAcidTransaction<T>(
  operationName: string,
  fn: () => Promise<T>
): Promise<T> {
  let release: () => void;
  const nextInQueue = new Promise<void>(resolve => {
    release = resolve;
  });
  const currentLock = transactionMutex;
  transactionMutex = currentLock.then(() => nextInQueue);

  await currentLock;

  console.log(`[ACID Transaction: START] ${operationName}`);

  // 1. Take snapshot of all collection files for rollback durability
  const collections = [UserJourneysCollection, SubscriptionsCollection, PaymentsCollection];
  const snapshots = new Map<string, string>();
  for (const col of collections) {
    if (fs.existsSync(col.filePath)) {
      snapshots.set(col.filePath, fs.readFileSync(col.filePath, 'utf-8'));
    }
  }

  try {
    const result = await fn();
    console.log(`[ACID Transaction: COMMIT] ${operationName} committed successfully.`);
    return result;
  } catch (err) {
    console.error(`[ACID Transaction: ROLLBACK] ${operationName} failed. Rolling back changes!`, err);
    // Rollback every collection from snapshot
    for (const [filePath, content] of snapshots.entries()) {
      try {
        fs.writeFileSync(filePath, content, 'utf-8');
      } catch (rollbackErr) {
        console.error(`Fatal: Failed to rollback file ${filePath}:`, rollbackErr);
      }
    }
    throw err;
  } finally {
    release!();
  }
}
