import { Request } from 'express';
import { ILiveClass, ILessonProgress, IRecordedClass } from '../db/dbStore';
import { entitlementRepository } from '../repositories/entitlementRepository';

export interface RequestIdentity {
  userId?: string;
  phone?: string;
  userName?: string;
}

export interface UserEntitlement {
  hasActiveSubscription: boolean;
  isTrial: boolean;
  subscribedProgramIds: string[];
  unlockedModules: string[];
}

export function getRequestIdentity(req: Request): RequestIdentity {
  const user = (req as any).user;
  const phone = (
    user?.phone ||
    req.query?.phone ||
    req.body?.phone ||
    req.body?.userPhone ||
    ''
  )
    .toString()
    .trim();
  const userId = (
    user?.userId ||
    user?.id ||
    req.query?.userId ||
    req.body?.userId ||
    (phone ? `usr_${phone}` : '')
  )
    .toString()
    .trim();
  const userName = (user?.name || req.body?.userName || 'Astro Parent').toString().trim();

  return {
    userId: userId || undefined,
    phone: phone || undefined,
    userName,
  };
}

export const entitlementService = {
  getUserEntitlement(phone?: string, userId?: string): UserEntitlement {
    const activeSubs = entitlementRepository.findActiveSubscriptions(phone, userId);
    const journey = entitlementRepository.findUserJourney(phone, userId);
    const isTrial = journey?.subscription_status === 'trial';

    const subscribedProgramIds = Array.from(
      new Set(
        activeSubs
          .map((s) => s.programId || (s.planId?.startsWith('garbhsanskar') ? 'garbh_sanskar' : ''))
          .filter(Boolean)
      )
    );

    const unlockedModules = Array.from(
      new Set(activeSubs.flatMap((s) => s.unlockedModules || []))
    );

    return {
      hasActiveSubscription: activeSubs.length > 0,
      isTrial,
      subscribedProgramIds,
      unlockedModules,
    };
  },

  hasAccessToProgram(
    entitlement: UserEntitlement,
    programId?: string,
    isFreePreview?: boolean
  ): boolean {
    if (isFreePreview) return true;
    if (entitlement.isTrial) return true;
    if (!entitlement.hasActiveSubscription) return false;
    if (!programId) return true;
    return (
      entitlement.subscribedProgramIds.length === 0 ||
      entitlement.subscribedProgramIds.includes(programId)
    );
  },
};

export function formatViewsCount(viewsNumeric: number): string {
  if (viewsNumeric >= 1000) {
    return `${(viewsNumeric / 1000).toFixed(1).replace(/\.0$/, '')}k views`;
  }
  return `${viewsNumeric} views`;
}

export function normalizeLiveClass(
  cls: ILiveClass,
  options: { isRegistered?: boolean; isUnlocked?: boolean } = {}
) {
  const joinUrl = cls.joinUrl || cls.zoomLink || '';
  const doctorName = cls.doctorName || cls.instructor || 'AstroBaby Senior Mentor';
  const registeredCount = cls.registeredCount ?? cls.attendeesCount ?? 0;

  return {
    ...cls,
    instructor: cls.instructor || doctorName,
    doctorName,
    credentials: cls.credentials || 'Certified Garbh Sanskar Mentor',
    institution: cls.institution || 'AstroBaby Vedic Academy',
    joinUrl: options.isUnlocked === false ? '' : joinUrl,
    zoomLink: options.isUnlocked === false ? '' : joinUrl,
    scheduledAt: cls.scheduledAt || cls.dateTime,
    trimester: cls.trimester || 'All Trimesters',
    category: cls.category || 'general',
    categoryLabel: cls.categoryLabel || 'Live Masterclass 🎥',
    overview: cls.overview || `${cls.title} with ${doctorName}`,
    learningPoints: cls.learningPoints || [],
    registeredCount,
    attendeesCount: cls.attendeesCount ?? registeredCount,
    isRegistered: options.isRegistered ?? false,
    isUnlocked: options.isUnlocked ?? true,
  };
}

export function normalizeRecordedClass(
  rec: IRecordedClass,
  options: { isUnlocked?: boolean; progress?: ILessonProgress | null } = {}
) {
  const viewsNumeric = rec.viewsNumeric ?? 0;
  return {
    ...rec,
    instructor: rec.instructor || rec.doctorName,
    viewsCount: rec.viewsCount || formatViewsCount(viewsNumeric),
    videoUrl: options.isUnlocked === false ? '' : rec.videoUrl,
    notesUrl: options.isUnlocked === false ? undefined : rec.notesUrl,
    isUnlocked: options.isUnlocked ?? true,
    progress: options.progress || null,
  };
}

