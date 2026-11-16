import {
  ILiveClass,
  ILiveClassRegistration,
  IRecordedClass,
  LiveClassesCollection,
  LiveClassRegistrationsCollection,
  RecordedClassesCollection,
} from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class LiveClassRepository extends BaseRepository<ILiveClass> {
  constructor() {
    super(LiveClassesCollection);
  }

  sortByScheduleAsc(classes: ILiveClass[]): ILiveClass[] {
    return [...classes].sort((a, b) => {
      const tA = new Date(a.scheduledAt || a.dateTime).getTime() || 0;
      const tB = new Date(b.scheduledAt || b.dateTime).getTime() || 0;
      return tA - tB;
    });
  }

  findUpcomingAndLive(): ILiveClass[] {
    return this.sortByScheduleAsc(
      this.findAll().filter(
        (c) => c.status === 'upcoming' || c.status === 'live' || c.status === 'live_today'
      )
    );
  }

  findNonCancelled(): ILiveClass[] {
    return this.sortByScheduleAsc(this.findAll().filter((c) => c.status !== 'cancelled'));
  }
}

export class RecordedClassRepository extends BaseRepository<IRecordedClass> {
  constructor() {
    super(RecordedClassesCollection);
  }

  findPublished(): IRecordedClass[] {
    return this.findAll().filter((r) => r.status === 'published');
  }

  async incrementViews(id: string, formatViewsFn: (n: number) => string): Promise<IRecordedClass | null> {
    const rec = this.findById(id);
    if (!rec) return null;
    const nextViews = (rec.viewsNumeric ?? 0) + 1;
    return this.updateById(id, {
      viewsNumeric: nextViews,
      viewsCount: formatViewsCountSafe(nextViews, formatViewsFn),
    });
  }
}

function formatViewsCountSafe(n: number, fn: (v: number) => string): string {
  return fn(n);
}

export class LiveClassRegistrationRepository extends BaseRepository<ILiveClassRegistration> {
  constructor() {
    super(LiveClassRegistrationsCollection);
  }

  findByUser(phone?: string, userId?: string): ILiveClassRegistration[] {
    if (!phone && !userId) return [];
    return this.findAll().filter(
      (r) =>
        r.status !== 'cancelled' &&
        ((phone && r.phone === phone) || (userId && r.userId === userId))
    );
  }

  findActiveForClass(classId: string, phone?: string, userId?: string): ILiveClassRegistration | null {
    return (
      this.findAll().find(
        (r) =>
          r.classId === classId &&
          r.status !== 'cancelled' &&
          ((phone && r.phone === phone) || (userId && r.userId === userId))
      ) || null
    );
  }

  async markAttendedOrCreate(params: {
    classId: string;
    phone?: string;
    userId?: string;
    userName?: string;
  }): Promise<{ createdNew: boolean; registration: ILiveClassRegistration }> {
    const now = new Date().toISOString();
    const all = this.findAll();
    const idx = all.findIndex(
      (r) =>
        r.classId === params.classId &&
        r.status !== 'cancelled' &&
        ((params.phone && r.phone === params.phone) || (params.userId && r.userId === params.userId))
    );

    if (idx >= 0) {
      all[idx] = { ...all[idx], status: 'attended', joinedAt: now };
      this.replaceAll(all);
      return { createdNew: false, registration: all[idx] };
    }

    const registration = await this.create({
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      classId: params.classId,
      userId: params.userId || `usr_${params.phone}`,
      phone: params.phone || '',
      userName: params.userName || 'Astro Parent',
      status: 'attended',
      registeredAt: now,
      joinedAt: now,
    });
    return { createdNew: true, registration };
  }
}

export const liveClassRepository = new LiveClassRepository();
export const recordedClassRepository = new RecordedClassRepository();
export const liveClassRegistrationRepository = new LiveClassRegistrationRepository();

