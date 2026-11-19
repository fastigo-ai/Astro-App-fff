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

    const record: any = {
      _id: id,
      id,
      title: body.title || 'Vedic Garbh Sanskar Program',
      subtitle: body.subtitle || '',
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
          features: [
            'Daily Vedic Mantras & Garbh Samvad audios',
            'Pregnancy Brain Stimulation cognitive puzzles',
            'Live Doctor Zoom sessions & recorded masterclasses',
          ],
        },
      ],
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
    return courseRepository.updateById(id, { ...body, updatedAt: new Date().toISOString() });
  },

  async adminDeleteCourse(id: string) {
    const existing = courseRepository.findById(id);
    if (!existing) {
      throw new AppError(`Course ${id} not found`, 404, 'COURSE_NOT_FOUND');
    }
    return courseRepository.deleteById(id);
  },
};

