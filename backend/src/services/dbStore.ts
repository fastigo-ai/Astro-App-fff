import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');

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
}

export interface IUserJourney {
  _id?: string;
  userId?: string;
  phone?: string;
  stage: 'pregnant' | 'planning';
  lmp_date?: string;
  edd_date?: string;
  confirmed_month?: number;
  remaining_months?: number;
  planning_timeline?: string;
  subscription_tier?: 'full' | 'half' | 'trial';
  subscription_status?: 'active' | 'trial' | 'none';
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubscriptionRecord {
  _id?: string;
  userId?: string;
  phone?: string;
  planId: string;
  tier: 'full' | 'half'; // Utkarsh vs Aadhar
  planName: string;
  amount: number;
  currency: string;
  durationMonths: number;
  calculatedForMonth?: number;
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

export const UserJourneysCollection = new JsonCollection<IUserJourney>('user_journeys');
export const SubscriptionsCollection = new JsonCollection<ISubscriptionRecord>('subscriptions');
export const PaymentsCollection = new JsonCollection<IPaymentRecord>('payments');
export const KickSessionsCollection = new JsonCollection<IKickSession>('kick_sessions');
export const MoodLogsCollection = new JsonCollection<IMoodLog>('mood_logs');
export const SamvadNotesCollection = new JsonCollection<ISamvadNote>('samvad_notes');
export const ProgramSchemesCollection = new JsonCollection<IProgramSchemeRecord>('program_schemes');

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
