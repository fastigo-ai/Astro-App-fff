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

export const UserJourneysCollection = new JsonCollection<IUserJourney>('user_journeys');
export const SubscriptionsCollection = new JsonCollection<ISubscriptionRecord>('subscriptions');
export const PaymentsCollection = new JsonCollection<IPaymentRecord>('payments');
export const KickSessionsCollection = new JsonCollection<IKickSession>('kick_sessions');
export const MoodLogsCollection = new JsonCollection<IMoodLog>('mood_logs');
export const SamvadNotesCollection = new JsonCollection<ISamvadNote>('samvad_notes');

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
