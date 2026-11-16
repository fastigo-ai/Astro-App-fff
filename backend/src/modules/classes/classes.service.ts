import { ILiveClass, IRecordedClass } from '../../shared/db/dbStore';
import {
  liveClassRegistrationRepository,
  liveClassRepository,
  recordedClassRepository,
} from './classes.repository';
import { lessonProgressRepository } from '../courses/courses.repository';
import {
  entitlementService,
  formatViewsCount,
  normalizeLiveClass,
  normalizeRecordedClass,
  RequestIdentity,
} from '../../shared/services/entitlementService';
import {
  CreateLiveClassInput,
  CreateRecordedClassInput,
  PublishRecordingInput,
  RecordedProgressInput,
  UpdateLiveClassInput,
  UpdateRecordedClassInput,
} from './classes.schemas';
import { AppError } from '../../shared/utils/appError';

export interface LiveClassFilters {
  programId?: string;
  category?: string;
  trimester?: string;
  status?: string;
  upcomingOnly?: boolean;
}

export interface RecordedClassFilters {
  programId?: string;
  category?: string;
  trimester?: string;
  search?: string;
}

export const classesService = {
  listLiveClasses(filters: LiveClassFilters, identity: RequestIdentity) {
    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    const registeredSet = new Set(
      liveClassRegistrationRepository
        .findByUser(identity.phone, identity.userId)
        .map((r) => r.classId)
    );

    let classes = filters.upcomingOnly
      ? liveClassRepository.findUpcomingAndLive()
      : liveClassRepository.findNonCancelled();

    if (filters.programId) {
      classes = classes.filter((c) => c.programId === filters.programId);
    }
    if (filters.category && filters.category.toLowerCase() !== 'all') {
      const cat = filters.category.toLowerCase();
      classes = classes.filter((c) => (c.category || '').toLowerCase() === cat);
    }
    if (filters.trimester && filters.trimester.toLowerCase() !== 'all') {
      const tri = filters.trimester.toLowerCase();
      classes = classes.filter((c) => (c.trimester || '').toLowerCase().includes(tri));
    }
    if (filters.status) {
      const st = filters.status.toLowerCase();
      classes = classes.filter((c) => c.status.toLowerCase() === st);
    }

    return classes.map((cls) =>
      normalizeLiveClass(cls, {
        isRegistered: registeredSet.has(cls.id),
        isUnlocked: entitlementService.hasAccessToProgram(
          entitlement,
          cls.programId,
          cls.isFreePreview
        ),
      })
    );
  },

  getLiveClassDetail(classId: string, identity: RequestIdentity) {
    const cls = liveClassRepository.findById(classId);
    if (!cls) {
      throw new AppError(`Live class ${classId} not found`, 404, 'LIVE_CLASS_NOT_FOUND');
    }

    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    const isRegistered = Boolean(
      (identity.phone || identity.userId) &&
        liveClassRegistrationRepository.findActiveForClass(classId, identity.phone, identity.userId)
    );

    return normalizeLiveClass(cls, {
      isRegistered,
      isUnlocked: entitlementService.hasAccessToProgram(
        entitlement,
        cls.programId,
        cls.isFreePreview
      ),
    });
  },

  async registerForLiveClass(classId: string, identity: RequestIdentity) {
    const cls = liveClassRepository.findById(classId);
    if (!cls) {
      throw new AppError(`Live class ${classId} not found`, 404, 'LIVE_CLASS_NOT_FOUND');
    }

    if (cls.status === 'cancelled' || cls.status === 'completed') {
      throw new AppError(
        `Cannot register for a ${cls.status} live class`,
        400,
        'CLASS_NOT_OPEN_FOR_REGISTRATION'
      );
    }

    if (!identity.phone && !identity.userId) {
      throw new AppError(
        'Phone number or authenticated user is required to register',
        400,
        'IDENTITY_REQUIRED'
      );
    }

    const existing = liveClassRegistrationRepository.findActiveForClass(
      classId,
      identity.phone,
      identity.userId
    );
    if (existing) {
      return {
        alreadyRegistered: true,
        registration: existing,
        registeredCount: cls.registeredCount ?? cls.attendeesCount ?? 0,
      };
    }

    const currentCount = cls.registeredCount ?? cls.attendeesCount ?? 0;
    if (cls.maxCapacity && currentCount >= cls.maxCapacity) {
      throw new AppError('This live class has reached maximum capacity', 409, 'CLASS_FULL');
    }

    const registration = await liveClassRegistrationRepository.create({
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      classId,
      userId: identity.userId || `usr_${identity.phone}`,
      phone: identity.phone || '',
      userName: identity.userName || 'Astro Parent',
      status: 'registered',
      registeredAt: new Date().toISOString(),
    });

    const registeredCount = currentCount + 1;
    await liveClassRepository.updateById(classId, {
      registeredCount,
      attendeesCount: registeredCount,
    });

    return {
      alreadyRegistered: false,
      registration,
      registeredCount,
    };
  },

  getMyRegistrations(identity: RequestIdentity) {
    if (!identity.phone && !identity.userId) {
      throw new AppError('User phone or authentication token is required', 400, 'IDENTITY_REQUIRED');
    }

    const registrations = liveClassRegistrationRepository.findByUser(
      identity.phone,
      identity.userId
    );
    const classesById = new Map(liveClassRepository.findAll().map((c) => [c.id, c]));
    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);

    return registrations.map((reg) => {
      const cls = classesById.get(reg.classId);
      return {
        ...reg,
        liveClass: cls
          ? normalizeLiveClass(cls, {
              isRegistered: true,
              isUnlocked: entitlementService.hasAccessToProgram(
                entitlement,
                cls.programId,
                cls.isFreePreview
              ),
            })
          : null,
      };
    });
  },

  async joinLiveClass(classId: string, identity: RequestIdentity) {
    const cls = liveClassRepository.findById(classId);
    if (!cls) {
      throw new AppError(`Live class ${classId} not found`, 404, 'LIVE_CLASS_NOT_FOUND');
    }

    if (cls.status === 'cancelled') {
      throw new AppError('This live class has been cancelled', 400, 'CLASS_CANCELLED');
    }

    if (cls.status === 'completed') {
      throw new AppError('This live class has already ended', 400, 'CLASS_COMPLETED');
    }

    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    if (!entitlementService.hasAccessToProgram(entitlement, cls.programId, cls.isFreePreview)) {
      throw new AppError(
        'Active subscription or trial required to join this live class',
        403,
        'SUBSCRIPTION_REQUIRED'
      );
    }

    if (identity.phone || identity.userId) {
      const { createdNew } = await liveClassRegistrationRepository.markAttendedOrCreate({
        classId,
        phone: identity.phone,
        userId: identity.userId,
        userName: identity.userName,
      });

      if (createdNew) {
        const nextCount = (cls.registeredCount ?? cls.attendeesCount ?? 0) + 1;
        await liveClassRepository.updateById(classId, {
          registeredCount: nextCount,
          attendeesCount: nextCount,
        });
      }
    }

    const joinUrl = cls.joinUrl || cls.zoomLink;
    return {
      classId: cls.id,
      title: cls.title,
      joinUrl,
      zoomLink: joinUrl,
      status: cls.status,
    };
  },

  listRecordedClasses(filters: RecordedClassFilters, identity: RequestIdentity) {
    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    const progressMap = new Map(
      lessonProgressRepository
        .findByUser(identity.phone, identity.userId)
        .filter((p) => p.itemType === 'recorded_class')
        .map((p) => [p.itemId, p])
    );

    let recorded = recordedClassRepository.findPublished();

    if (filters.programId) {
      recorded = recorded.filter((r) => r.programId === filters.programId);
    }
    if (filters.category && filters.category.toLowerCase() !== 'all') {
      const cat = filters.category.toLowerCase();
      recorded = recorded.filter((r) => (r.category || '').toLowerCase() === cat);
    }
    if (filters.trimester && filters.trimester.toLowerCase() !== 'all') {
      const tri = filters.trimester.toLowerCase();
      recorded = recorded.filter((r) => (r.trimester || '').toLowerCase().includes(tri));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      recorded = recorded.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.summary || '').toLowerCase().includes(q) ||
          (r.doctorName || '').toLowerCase().includes(q)
      );
    }

    return recorded.map((rec) =>
      normalizeRecordedClass(rec, {
        isUnlocked: entitlementService.hasAccessToProgram(
          entitlement,
          rec.programId,
          rec.isFreePreview
        ),
        progress: progressMap.get(rec.id) || null,
      })
    );
  },

  async getRecordedClassDetail(recordedId: string, identity: RequestIdentity) {
    const existing = recordedClassRepository.findById(recordedId);
    if (!existing || existing.status === 'archived') {
      throw new AppError(`Recorded class ${recordedId} not found`, 404, 'RECORDED_CLASS_NOT_FOUND');
    }

    const updatedRec =
      (await recordedClassRepository.incrementViews(recordedId, formatViewsCount)) || existing;

    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    const isUnlocked = entitlementService.hasAccessToProgram(
      entitlement,
      updatedRec.programId,
      updatedRec.isFreePreview
    );
    const progress =
      lessonProgressRepository
        .findByUser(identity.phone, identity.userId)
        .find((p) => p.itemId === recordedId && p.itemType === 'recorded_class') || null;

    return normalizeRecordedClass(updatedRec, { isUnlocked, progress });
  },

  async saveRecordedProgress(
    recordedId: string,
    payload: RecordedProgressInput,
    identity: RequestIdentity
  ) {
    const rec = recordedClassRepository.findById(recordedId);
    if (!rec) {
      throw new AppError(`Recorded class ${recordedId} not found`, 404, 'RECORDED_CLASS_NOT_FOUND');
    }

    const phone = payload.phone || identity.phone || '9366128220';
    const userId = payload.userId || identity.userId || `usr_${phone}`;

    return lessonProgressRepository.upsertWatchProgress({
      userId,
      phone,
      programId: rec.programId,
      itemId: rec.id,
      itemType: 'recorded_class',
      watchedSeconds: payload.watchedSeconds,
      durationSeconds: payload.durationSeconds || rec.durationSeconds || 0,
      completed: payload.completed,
    });
  },

  getLiveAndRecordedSessions(
    filters: { programId?: string; category?: string; trimester?: string },
    identity: RequestIdentity
  ) {
    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    const registeredSet = new Set(
      liveClassRegistrationRepository
        .findByUser(identity.phone, identity.userId)
        .map((r) => r.classId)
    );

    let upcomingRaw = liveClassRepository.findUpcomingAndLive();
    let recordedRaw = recordedClassRepository.findPublished();

    if (filters.programId) {
      upcomingRaw = upcomingRaw.filter((c) => c.programId === filters.programId);
      recordedRaw = recordedRaw.filter((r) => r.programId === filters.programId);
    }
    if (filters.category && filters.category.toLowerCase() !== 'all') {
      const cat = filters.category.toLowerCase();
      upcomingRaw = upcomingRaw.filter((c) => (c.category || '').toLowerCase() === cat);
      recordedRaw = recordedRaw.filter((r) => (r.category || '').toLowerCase() === cat);
    }
    if (filters.trimester && filters.trimester.toLowerCase() !== 'all') {
      const tri = filters.trimester.toLowerCase();
      upcomingRaw = upcomingRaw.filter((c) => (c.trimester || '').toLowerCase().includes(tri));
      recordedRaw = recordedRaw.filter((r) => (r.trimester || '').toLowerCase().includes(tri));
    }

    return {
      upcoming: upcomingRaw.map((cls) =>
        normalizeLiveClass(cls, {
          isRegistered: registeredSet.has(cls.id),
          isUnlocked: entitlementService.hasAccessToProgram(
            entitlement,
            cls.programId,
            cls.isFreePreview ?? true
          ),
        })
      ),
      recorded: recordedRaw.map((rec) =>
        normalizeRecordedClass(rec, {
          isUnlocked: entitlementService.hasAccessToProgram(
            entitlement,
            rec.programId,
            rec.isFreePreview ?? true
          ),
        })
      ),
    };
  },

  adminListClasses(filters: { programId?: string; status?: string }) {
    let classes = liveClassRepository.sortByScheduleAsc(liveClassRepository.findAll());
    if (filters.programId) {
      classes = classes.filter((c) => c.programId === filters.programId);
    }
    if (filters.status) {
      const st = filters.status.toLowerCase();
      classes = classes.filter((c) => c.status.toLowerCase() === st);
    }
    return classes.map((c) => normalizeLiveClass(c));
  },

  async adminCreateClass(payload: CreateLiveClassInput) {
    const effectiveJoinUrl = (payload.joinUrl || payload.zoomLink || '').trim();
    if (!effectiveJoinUrl) {
      throw new AppError('Meeting joinUrl or zoomLink is required', 400, 'JOIN_URL_REQUIRED');
    }

    const effectiveInstructor = payload.instructor || payload.doctorName || 'AstroBaby Senior Mentor';
    const effectiveDateTime =
      payload.dateTime || payload.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const saved = await liveClassRepository.create({
      id: `live_${Date.now()}`,
      programId: payload.programId,
      title: payload.title,
      hindiTitle: payload.hindiTitle,
      instructor: effectiveInstructor,
      doctorName: payload.doctorName || effectiveInstructor,
      credentials: payload.credentials,
      institution: payload.institution,
      dateTime: effectiveDateTime,
      scheduledAt: payload.scheduledAt || effectiveDateTime,
      durationMinutes: payload.durationMinutes,
      joinUrl: effectiveJoinUrl,
      zoomLink: effectiveJoinUrl,
      status: payload.status,
      trimester: payload.trimester || 'All Trimesters',
      category: payload.category || 'general',
      categoryLabel: payload.categoryLabel || 'Live Masterclass 🎥',
      overview: payload.overview,
      learningPoints: payload.learningPoints || [],
      attendeesCount: 0,
      registeredCount: 0,
      maxCapacity: payload.maxCapacity,
      isFreePreview: payload.isFreePreview,
      notesUrl: payload.notesUrl,
    });

    return normalizeLiveClass(saved);
  },

  async adminUpdateClass(classId: string, payload: UpdateLiveClassInput) {
    const existing = liveClassRepository.findById(classId);
    if (!existing) {
      throw new AppError(`Live class ${classId} not found`, 404, 'LIVE_CLASS_NOT_FOUND');
    }

    const updates: Partial<ILiveClass> = { ...payload };
    if (payload.joinUrl || payload.zoomLink) {
      const url = payload.joinUrl || payload.zoomLink;
      updates.joinUrl = url;
      updates.zoomLink = url;
    }
    if (payload.instructor && !payload.doctorName) {
      updates.doctorName = payload.instructor;
    } else if (payload.doctorName && !payload.instructor) {
      updates.instructor = payload.doctorName;
    }
    if (payload.dateTime && !payload.scheduledAt) {
      updates.scheduledAt = payload.dateTime;
    }

    const updated = await liveClassRepository.updateById(classId, updates);
    return updated ? normalizeLiveClass(updated) : null;
  },

  async adminPublishRecording(classId: string, payload: PublishRecordingInput) {
    const liveClass = liveClassRepository.findById(classId);
    if (!liveClass) {
      throw new AppError(`Live class ${classId} not found`, 404, 'LIVE_CLASS_NOT_FOUND');
    }

    const durationStr = payload.duration || `${liveClass.durationMinutes || 45} mins`;

    let recorded: IRecordedClass;
    if (liveClass.recordedClassId) {
      const updated = await recordedClassRepository.updateById(liveClass.recordedClassId, {
        videoUrl: payload.videoUrl,
        duration: durationStr,
        durationSeconds: payload.durationSeconds ?? (liveClass.durationMinutes || 45) * 60,
        summary: payload.summary || liveClass.overview || liveClass.title,
        takeaways: payload.takeaways || liveClass.learningPoints || [],
        notesUrl: payload.notesUrl ?? liveClass.notesUrl,
        notesAvailable: Boolean(payload.notesUrl ?? liveClass.notesUrl),
        thumbnail:
          payload.thumbnail || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
        isFreePreview: payload.isFreePreview ?? liveClass.isFreePreview ?? false,
        status: 'published',
      });
      recorded = updated!;
    } else {
      recorded = await recordedClassRepository.create({
        id: `rec_${Date.now()}`,
        programId: liveClass.programId,
        sourceLiveClassId: liveClass.id,
        title: liveClass.title,
        hindiTitle: liveClass.hindiTitle,
        doctorName: liveClass.doctorName || liveClass.instructor,
        instructor: liveClass.instructor,
        duration: durationStr,
        durationSeconds: payload.durationSeconds ?? (liveClass.durationMinutes || 45) * 60,
        category: payload.category || liveClass.category || 'general',
        categoryLabel: payload.categoryLabel || liveClass.categoryLabel || 'Recorded Masterclass 🎬',
        trimester: payload.trimester || liveClass.trimester || 'All Trimesters',
        viewsCount: '0 views',
        viewsNumeric: 0,
        notesAvailable: Boolean(payload.notesUrl ?? liveClass.notesUrl),
        notesUrl: payload.notesUrl ?? liveClass.notesUrl,
        thumbnail:
          payload.thumbnail || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
        videoUrl: payload.videoUrl,
        summary: payload.summary || liveClass.overview || liveClass.title,
        takeaways: payload.takeaways || liveClass.learningPoints || [],
        isFreePreview: payload.isFreePreview ?? liveClass.isFreePreview ?? false,
        status: 'published',
      });
    }

    const updatedLive = await liveClassRepository.updateById(classId, {
      status: 'completed',
      recordingUrl: payload.videoUrl,
      recordedClassId: recorded.id,
      notesUrl: payload.notesUrl ?? liveClass.notesUrl,
    });

    return {
      liveClass: updatedLive ? normalizeLiveClass(updatedLive) : null,
      recordedClass: normalizeRecordedClass(recorded),
    };
  },

  async adminDeleteClass(classId: string) {
    const deleted = await liveClassRepository.deleteById(classId);
    if (!deleted) {
      throw new AppError(`Live class ${classId} not found`, 404, 'LIVE_CLASS_NOT_FOUND');
    }
  },

  adminListRecorded(filters: { programId?: string }) {
    let recorded = recordedClassRepository.findAll();
    if (filters.programId) {
      recorded = recorded.filter((r) => r.programId === filters.programId);
    }
    return recorded.map((r) => normalizeRecordedClass(r));
  },

  async adminCreateRecorded(payload: CreateRecordedClassInput) {
    const doctorName = payload.doctorName || payload.instructor || 'AstroBaby Senior Mentor';
    const created = await recordedClassRepository.create({
      id: `rec_${Date.now()}`,
      programId: payload.programId,
      sourceLiveClassId: payload.sourceLiveClassId,
      title: payload.title,
      hindiTitle: payload.hindiTitle,
      doctorName,
      instructor: payload.instructor || doctorName,
      duration: payload.duration,
      durationSeconds: payload.durationSeconds,
      category: payload.category,
      categoryLabel: payload.categoryLabel,
      trimester: payload.trimester,
      viewsCount: '0 views',
      viewsNumeric: 0,
      notesAvailable: payload.notesAvailable ?? Boolean(payload.notesUrl),
      notesUrl: payload.notesUrl,
      thumbnail: payload.thumbnail,
      videoUrl: payload.videoUrl,
      summary: payload.summary,
      takeaways: payload.takeaways,
      isFreePreview: payload.isFreePreview,
      status: payload.status,
    });

    return normalizeRecordedClass(created);
  },

  async adminUpdateRecorded(recordedId: string, payload: UpdateRecordedClassInput) {
    const existing = recordedClassRepository.findById(recordedId);
    if (!existing) {
      throw new AppError(`Recorded class ${recordedId} not found`, 404, 'RECORDED_CLASS_NOT_FOUND');
    }

    const updated = await recordedClassRepository.updateById(recordedId, {
      ...payload,
      notesAvailable: payload.notesAvailable ?? (payload.notesUrl ? true : existing.notesAvailable),
    });

    return updated ? normalizeRecordedClass(updated) : null;
  },

  async adminDeleteRecorded(recordedId: string) {
    const deleted = await recordedClassRepository.deleteById(recordedId);
    if (!deleted) {
      throw new AppError(`Recorded class ${recordedId} not found`, 404, 'RECORDED_CLASS_NOT_FOUND');
    }
  },
};

