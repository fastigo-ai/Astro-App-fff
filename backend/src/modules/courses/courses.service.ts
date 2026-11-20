import { ICourseLesson } from '../../shared/db/dbStore';
import {
  courseLessonRepository,
  courseRepository,
  lessonProgressRepository,
} from './courses.repository';
import {
  liveClassRegistrationRepository,
  liveClassRepository,
  recordedClassRepository,
} from '../classes/classes.repository';
import {
  entitlementService,
  normalizeLiveClass,
  normalizeRecordedClass,
  RequestIdentity,
} from '../../shared/services/entitlementService';
import {
  CreateLessonInput,
  LessonProgressInput,
  UpdateLessonInput,
} from './courses.schemas';
import { AppError } from '../../shared/utils/appError';

export interface CourseListFilters {
  category?: string;
  search?: string;
}

export interface LessonFilters {
  moduleTitle?: string;
  contentType?: string;
}

export const coursesService = {
  listCourses(filters: CourseListFilters, identity: RequestIdentity) {
    const category = filters.category?.trim().toLowerCase();
    const search = filters.search?.trim().toLowerCase();
    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);

    let programs = courseRepository.findActiveCourses();

    if (category && category !== 'all') {
      programs = programs.filter((p) => p.category?.toLowerCase() === category);
    }

    if (search) {
      programs = programs.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          (p.subtitle || '').toLowerCase().includes(search) ||
          (p.overview || '').toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      );
    }

    const allLessons = courseLessonRepository.findPublishedAll();
    const allLiveClasses = liveClassRepository.findUpcomingAndLive();
    const allRecorded = recordedClassRepository.findPublished();
    const userProgress = lessonProgressRepository.findByUser(identity.phone, identity.userId);

    return programs.map((program) => {
      const courseLessons = allLessons.filter((l) => l.programId === program.id);
      const upcomingLiveCount = allLiveClasses.filter((c) => c.programId === program.id).length;
      const recordedClassCount = allRecorded.filter((r) => r.programId === program.id).length;
      const completedLessonIds = new Set(
        userProgress
          .filter((p) => p.programId === program.id && p.itemType === 'lesson' && p.completed)
          .map((p) => p.itemId)
      );
      const completionPercent =
        courseLessons.length > 0
          ? Math.round((completedLessonIds.size / courseLessons.length) * 100)
          : 0;

      return {
        ...program,
        lessonCount: courseLessons.length,
        upcomingLiveCount,
        recordedClassCount,
        isSubscribed: entitlementService.hasAccessToProgram(entitlement, program.id, false),
        completionPercent,
      };
    });
  },

  getCourseDetail(courseId: string, identity: RequestIdentity) {
    const program = courseRepository.findById(courseId);
    if (!program) {
      throw new AppError(`Course with ID ${courseId} not found`, 404, 'COURSE_NOT_FOUND');
    }

    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    const rawLessons = courseLessonRepository.findByProgramId(courseId, false);
    const userProgress = lessonProgressRepository.findByUser(
      identity.phone,
      identity.userId,
      courseId
    );
    const progressMap = new Map(userProgress.map((p) => [p.itemId, p]));

    const lessons = rawLessons.map((lesson) => {
      const isUnlocked = entitlementService.hasAccessToProgram(
        entitlement,
        courseId,
        lesson.isFreePreview
      );
      return {
        ...lesson,
        contentUrl: isUnlocked ? lesson.contentUrl : '',
        notesUrl: isUnlocked ? lesson.notesUrl : undefined,
        isUnlocked,
        progress: progressMap.get(lesson.id) || null,
      };
    });

    const moduleMap = new Map<
      string,
      { moduleTitle: string; moduleOrder: number; lessons: typeof lessons }
    >();
    for (const lesson of lessons) {
      const existing = moduleMap.get(lesson.moduleTitle);
      if (existing) {
        existing.lessons.push(lesson);
      } else {
        moduleMap.set(lesson.moduleTitle, {
          moduleTitle: lesson.moduleTitle,
          moduleOrder: lesson.moduleOrder ?? moduleMap.size + 1,
          lessons: [lesson],
        });
      }
    }

    const registeredSet = new Set(
      liveClassRegistrationRepository
        .findByUser(identity.phone, identity.userId)
        .map((r) => r.classId)
    );

    const liveClasses = liveClassRepository
      .findNonCancelled()
      .filter((c) => c.programId === courseId)
      .map((c) =>
        normalizeLiveClass(c, {
          isRegistered: registeredSet.has(c.id),
          isUnlocked: entitlementService.hasAccessToProgram(entitlement, courseId, c.isFreePreview),
        })
      );

    const recordedClasses = recordedClassRepository
      .findPublished()
      .filter((r) => r.programId === courseId)
      .map((r) =>
        normalizeRecordedClass(r, {
          isUnlocked: entitlementService.hasAccessToProgram(entitlement, courseId, r.isFreePreview),
          progress: progressMap.get(r.id) || null,
        })
      );

    const completedLessons = lessons.filter((l) => l.progress?.completed).length;
    const completionPercent =
      lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

    return {
      ...program,
      isSubscribed: entitlementService.hasAccessToProgram(entitlement, courseId, false),
      curriculumModules: Array.from(moduleMap.values()),
      lessons,
      liveClasses,
      recordedClasses,
      progressSummary: {
        completedLessons,
        totalLessons: lessons.length,
        completionPercent,
      },
    };
  },

  getCourseLessons(courseId: string, filters: LessonFilters, identity: RequestIdentity) {
    const entitlement = entitlementService.getUserEntitlement(identity.phone, identity.userId);
    const moduleTitle = filters.moduleTitle?.trim().toLowerCase();
    const contentType = filters.contentType?.trim().toLowerCase();

    let lessons = courseLessonRepository.findByProgramId(courseId, false);
    if (moduleTitle) {
      lessons = lessons.filter((l) => l.moduleTitle.toLowerCase() === moduleTitle);
    }
    if (contentType) {
      lessons = lessons.filter((l) => l.contentType.toLowerCase() === contentType);
    }

    const progressMap = new Map(
      lessonProgressRepository
        .findByUser(identity.phone, identity.userId, courseId)
        .filter((p) => p.itemType === 'lesson')
        .map((p) => [p.itemId, p])
    );

    return lessons.map((l) => {
      const isUnlocked = entitlementService.hasAccessToProgram(
        entitlement,
        courseId,
        l.isFreePreview
      );
      return {
        ...l,
        contentUrl: isUnlocked ? l.contentUrl : '',
        notesUrl: isUnlocked ? l.notesUrl : undefined,
        isUnlocked,
        progress: progressMap.get(l.id) || null,
      };
    });
  },

  async saveLessonProgress(
    courseId: string,
    lessonId: string,
    payload: LessonProgressInput,
    identity: RequestIdentity
  ) {
    const lesson = courseLessonRepository.findByIdInCourse(courseId, lessonId);
    if (!lesson) {
      throw new AppError(
        `Lesson ${lessonId} not found in course ${courseId}`,
        404,
        'LESSON_NOT_FOUND'
      );
    }

    const phone = payload.phone || identity.phone || '9366128220';
    const userId = payload.userId || identity.userId || `usr_${phone}`;

    return lessonProgressRepository.upsertWatchProgress({
      userId,
      phone,
      programId: courseId,
      itemId: lessonId,
      itemType: 'lesson',
      watchedSeconds: payload.watchedSeconds,
      durationSeconds: payload.durationSeconds || lesson.durationSeconds || 0,
      completed: payload.completed,
    });
  },

  adminListLessons(courseId: string) {
    return courseLessonRepository.findByProgramId(courseId, true);
  },

  async adminCreateLesson(courseId: string, payload: CreateLessonInput) {
    const program = courseRepository.findById(courseId);
    if (!program) {
      throw new AppError(`Course ${courseId} not found`, 404, 'COURSE_NOT_FOUND');
    }

    const newLesson: ICourseLesson = {
      id: `les_${courseId}_${Date.now()}`,
      programId: courseId,
      moduleTitle: payload.moduleTitle,
      moduleOrder: payload.moduleOrder,
      lessonTitle: payload.lessonTitle,
      order: payload.order,
      description: payload.description,
      contentType: payload.contentType,
      duration: payload.duration,
      durationSeconds: payload.durationSeconds,
      contentUrl: payload.contentUrl,
      thumbnail: payload.thumbnail,
      notesUrl: payload.notesUrl,
      trimester: payload.trimester,
      isFreePreview: payload.isFreePreview,
      status: payload.status,
    };

    return courseLessonRepository.create(newLesson);
  },

  async adminUpdateLesson(courseId: string, lessonId: string, payload: UpdateLessonInput) {
    const existing = courseLessonRepository.findByIdInCourse(courseId, lessonId);
    if (!existing) {
      throw new AppError(
        `Lesson ${lessonId} not found in course ${courseId}`,
        404,
        'LESSON_NOT_FOUND'
      );
    }
    return courseLessonRepository.updateById(lessonId, payload);
  },

  async adminDeleteLesson(courseId: string, lessonId: string) {
    const existing = courseLessonRepository.findByIdInCourse(courseId, lessonId);
    if (!existing) {
      throw new AppError(
        `Lesson ${lessonId} not found in course ${courseId}`,
        404,
        'LESSON_NOT_FOUND'
      );
    }
    await courseLessonRepository.deleteById(lessonId);
  },

  async adminCreateCourse(body: Record<string, any>) {
    const id = body.id || `prog_${Date.now()}`;
    const price = Number(body.price) || 2499;
    const originalPrice = Number(body.originalPrice) || 4499;
    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    const durationMonths = Number(body.durationMonths) || 6;
    const customFeatures = Array.isArray(body.features)
      ? body.features
      : [body.bullet1, body.bullet2].filter(Boolean);

    const experienceConfig = body.experienceConfig || {
      taglinePill: body.taglinePill || body.subtitle || '',
      themeColor: body.themeColor || '#65A30D',
      themeBg: body.themeBg || '#FFE4E6',
      timelineMode: body.timelineMode || (body.stage === 'planning' ? 'phases' : body.stage === 'parenting' ? 'infant_months' : 'pregnancy_months'),
      timelineLabel: body.timelineLabel || (body.stage === 'planning' ? 'Planning Phase' : body.stage === 'parenting' ? 'Infant Month' : 'Pregnancy Month'),
      totalTimelineUnits: Number(body.totalTimelineUnits) || (body.stage === 'planning' ? 6 : body.stage === 'parenting' ? 24 : 9),
      defaultUnit: Number(body.defaultUnit) || (body.stage === 'pregnant' ? 2 : 1),
      mentor: {
        name: body.mentorName || 'Senior Ayurvedic Mentor',
        role: body.mentorRole || 'Garbh Sanskar Specialist',
        classTitle: body.classTitle || body.title || 'Vedic Program Masterclass',
        classSubtitle: body.classSubtitle || `— By ${body.mentorName || 'Senior Faculty'} —`,
        avatarUrl: body.mentorAvatarUrl || '',
        badgeText: body.badgeText || 'FREE',
        showBanner: body.showMentorBanner !== false,
      },
      activityCard: {
        title: body.activityCardTitle || body.title || 'Course Activities',
        titleBig: body.activityCardBig || 'Activities',
        subtitle: body.activityCardSubtitle || 'of this Month',
        actionLabel: body.activityCardAction || 'Explore Activities',
      },
      importanceCard: {
        titleSmall: body.importanceCardSmall || 'Importance of',
        titleBig: body.importanceCardBig || 'CURRENT PHASE',
        subtitle: body.importanceCardSubtitle || 'in Your Journey',
      },
      featureReelTitle: body.featureReelTitle || `${body.title || 'Course'} Key Features`,
      reelItems: body.reelItems || (
        (body.reel1Title || body.reel2Title || body.reel3Title || body.reel4Title || body.reel5Title)
          ? [
              { id: 1, title: body.reel1Title || '1. Pratah Shuddhi & Mantra', subtitle: body.reel1Subtitle || 'Daily morning inspiring life lessons & sacred positive thoughts.', duration: body.reel1Duration || '8:00 Mins', imageKey: body.reel1ImageKey || 'garbh_sanskar' },
              { id: 2, title: body.reel2Title || '2. Classical Raaga & Soundwaves', subtitle: body.reel2Subtitle || 'Scientifically tuned 432Hz Vedic soundwaves stimulating brain neurons.', duration: body.reel2Duration || '15:00 Mins', imageKey: body.reel2ImageKey || 'consultations' },
              { id: 3, title: body.reel3Title || '3. Spiritual Lifestyle Sutra', subtitle: body.reel3Subtitle || 'Vedic guidelines & spiritual lifestyle discipline.', duration: body.reel3Duration || '10:00 Mins', imageKey: body.reel3ImageKey || 'mentor_prof' },
              { id: 4, title: body.reel4Title || '4. Soul-to-Soul Samvad', subtitle: body.reel4Subtitle || 'Soul-to-soul womb conversation scripts strengthening bonding.', duration: body.reel4Duration || '12:00 Mins', imageKey: body.reel4ImageKey || 'garbhdhaan_sanskar' },
              { id: 5, title: body.reel5Title || '5. Vedic Chanting & Dhyan', subtitle: body.reel5Subtitle || 'Potent Vedic chanting creating an aura of serenity & protection.', duration: body.reel5Duration || '14:00 Mins', imageKey: body.reel5ImageKey || 'bal_sanskar' },
            ]
          : undefined
      ),
      widgets: {
        showLiveSessions: body.showLiveSessions !== false,
        showBrainupedia: body.showBrainupedia !== false,
        showAudioLibrary: body.showAudioLibrary !== false,
        showTools: body.showTools !== false,
        showThoughtOfDay: body.showThoughtOfDay !== false,
        showDietPlan: body.showDietPlan !== false,
      },
    };

    const cardHighlights: string[] = Array.isArray(body.cardHighlights) && body.cardHighlights.length > 0
      ? body.cardHighlights.filter(Boolean).map((s: string) => String(s).trim())
      : [body.bullet1, body.bullet2, body.bullet3].filter(Boolean).map((s: string) => String(s).trim());

    const record: any = {
      _id: id,
      id,
      title: body.title || 'Vedic Garbh Sanskar Program',
      hindiTitle: body.hindiTitle || '',
      subtitle: body.subtitle || '',
      imageUrl: body.imageUrl || '',
      cardHighlights: cardHighlights.length > 0 ? cardHighlights : ['Vedic Care', 'Expert Mentorship'],
      category: body.category || 'Vedic Garbh Sanskar',
      stage: body.stage || 'pregnant',
      durationMonths,
      duration: `${durationMonths} Months Program`,
      whoIsItFor: body.whoIsItFor || 'Pregnant mothers and families seeking authentic Vedic Garbh Sanskar.',
      pricing: {
        currentPrice: price,
        originalPrice,
        discountPercent,
      },
      tiers: [
        {
          id: `${id}-full`,
          name: 'Utkarsh (Full Access)',
          tagline: 'Complete Program till delivery',
          duration: `${durationMonths} Months`,
          durationMonths,
          originalPrice,
          calculatedPrice: price,
          discountPercent,
          monthlyRate: `₹${Math.round(price / durationMonths)}/mo`,
          highlightText: `Complete ${durationMonths}-month curriculum`,
          features: customFeatures.length > 0 ? customFeatures : [
            'Daily Vedic Mantras & Garbh Samvad audios',
            'Pregnancy Brain Stimulation cognitive puzzles',
            'Live Doctor Zoom sessions & recorded masterclasses',
          ],
        },
      ],
      experienceConfig,
      status: body.status || 'active',
      overview: body.overview || '',
      unlockedModules: ['kicks', 'bump', 'samvad', 'mood', 'activities', 'diet', 'doctor_chat', 'live'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return courseRepository.create(record);
  },

  async adminUpdateCourse(id: string, body: Record<string, any>) {
    const existing = courseRepository.findById(id);
    if (!existing) {
      throw new AppError(`Course ${id} not found`, 404, 'COURSE_NOT_FOUND');
    }

    let updatedCardHighlights = existing.cardHighlights;
    if (body.cardHighlights !== undefined) {
      updatedCardHighlights = Array.isArray(body.cardHighlights)
        ? body.cardHighlights.filter(Boolean).map((s: string) => String(s).trim())
        : [String(body.cardHighlights).trim()];
    } else if (body.bullet1 !== undefined || body.bullet2 !== undefined || body.bullet3 !== undefined) {
      updatedCardHighlights = [body.bullet1, body.bullet2, body.bullet3].filter(Boolean).map((s: string) => String(s).trim());
    }

    let updatedExp = body.experienceConfig || existing.experienceConfig || {};

    let updatedReelItems = body.reelItems !== undefined ? body.reelItems : updatedExp.reelItems;
    if (body.reel1Title !== undefined || body.reel2Title !== undefined || body.reel3Title !== undefined || body.reel4Title !== undefined || body.reel5Title !== undefined) {
      const existingItems = Array.isArray(updatedReelItems) ? updatedReelItems : [];
      const makeItem = (idx: number, t?: string, sub?: string, dur?: string, img?: string) => ({
        id: idx,
        title: t !== undefined ? String(t).trim() : (existingItems[idx - 1]?.title || `Activity ${idx}`),
        subtitle: sub !== undefined ? String(sub).trim() : (existingItems[idx - 1]?.subtitle || ''),
        duration: dur !== undefined ? String(dur).trim() : (existingItems[idx - 1]?.duration || '10:00 Mins'),
        imageKey: img !== undefined ? String(img).trim() : (existingItems[idx - 1]?.imageKey || 'garbh_sanskar'),
      });
      updatedReelItems = [
        makeItem(1, body.reel1Title, body.reel1Subtitle, body.reel1Duration, body.reel1ImageKey),
        makeItem(2, body.reel2Title, body.reel2Subtitle, body.reel2Duration, body.reel2ImageKey),
        makeItem(3, body.reel3Title, body.reel3Subtitle, body.reel3Duration, body.reel3ImageKey),
        makeItem(4, body.reel4Title, body.reel4Subtitle, body.reel4Duration, body.reel4ImageKey),
        makeItem(5, body.reel5Title, body.reel5Subtitle, body.reel5Duration, body.reel5ImageKey),
      ];
    }

    if (
      body.taglinePill !== undefined ||
      body.mentorName !== undefined ||
      body.classTitle !== undefined ||
      body.timelineMode !== undefined ||
      body.timelineLabel !== undefined ||
      body.featureReelTitle !== undefined ||
      body.activityCardTitle !== undefined ||
      body.activityCardSubtitle !== undefined ||
      updatedReelItems !== undefined ||
      body.showMentorBanner !== undefined ||
      body.showThoughtOfDay !== undefined ||
      body.showLiveSessions !== undefined ||
      body.showBrainupedia !== undefined ||
      body.showAudioLibrary !== undefined ||
      body.showTools !== undefined
    ) {
      updatedExp = {
        ...updatedExp,
        taglinePill: body.taglinePill ?? updatedExp.taglinePill,
        timelineMode: body.timelineMode ?? updatedExp.timelineMode,
        timelineLabel: body.timelineLabel ?? updatedExp.timelineLabel,
        featureReelTitle: body.featureReelTitle ?? updatedExp.featureReelTitle,
        activityCard: {
          title: body.activityCardTitle ?? updatedExp.activityCard?.title ?? existing.title,
          titleBig: body.activityCardTitleBig ?? updatedExp.activityCard?.titleBig ?? 'Activities',
          subtitle: body.activityCardSubtitle ?? updatedExp.activityCard?.subtitle ?? 'of this Month',
          sub: body.activityCardSubtitle ?? updatedExp.activityCard?.sub ?? 'of this Month',
          actionLabel: body.activityCardActionLabel ?? updatedExp.activityCard?.actionLabel ?? 'Explore Activities',
        },
        reelItems: updatedReelItems ?? updatedExp.reelItems,
        mentor: {
          showBanner: body.showMentorBanner !== undefined ? Boolean(body.showMentorBanner) : (updatedExp.mentor?.showBanner ?? true),
          mentorName: body.mentorName ?? updatedExp.mentor?.mentorName,
          classTitle: body.classTitle ?? updatedExp.mentor?.classTitle,
          subtitle: body.mentorSubtitle ?? updatedExp.mentor?.subtitle,
        },
        widgets: {
          showThoughtOfDay: body.showThoughtOfDay !== undefined ? Boolean(body.showThoughtOfDay) : (updatedExp.widgets?.showThoughtOfDay ?? true),
          showLiveSessions: body.showLiveSessions !== undefined ? Boolean(body.showLiveSessions) : (updatedExp.widgets?.showLiveSessions ?? true),
          showBrainupedia: body.showBrainupedia !== undefined ? Boolean(body.showBrainupedia) : (updatedExp.widgets?.showBrainupedia ?? true),
          showAudioLibrary: body.showAudioLibrary !== undefined ? Boolean(body.showAudioLibrary) : (updatedExp.widgets?.showAudioLibrary ?? true),
          showTools: body.showTools !== undefined ? Boolean(body.showTools) : (updatedExp.widgets?.showTools ?? true),
        },
      };
    }

    return courseRepository.updateById(id, {
      ...body,
      cardHighlights: updatedCardHighlights,
      experienceConfig: updatedExp,
      updatedAt: new Date().toISOString(),
    });
  },

  async adminDeleteCourse(id: string) {
    const existing = courseRepository.findById(id);
    if (!existing) {
      throw new AppError(`Course ${id} not found`, 404, 'COURSE_NOT_FOUND');
    }
    return courseRepository.deleteById(id);
  },
};

