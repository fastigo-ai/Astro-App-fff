import {
  CourseLessonsCollection,
  ICourseLesson,
  ILessonProgress,
  IProgramSchemeRecord,
  LessonProgressCollection,
  ProgramSchemesCollection,
} from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class CourseRepository extends BaseRepository<IProgramSchemeRecord> {
  constructor() {
    super(ProgramSchemesCollection);
  }

  findActiveCourses(): IProgramSchemeRecord[] {
    return this.findAll().filter((p) => p.status !== 'archived');
  }
}

export class CourseLessonRepository extends BaseRepository<ICourseLesson> {
  constructor() {
    super(CourseLessonsCollection);
  }

  private sortLessons(lessons: ICourseLesson[]): ICourseLesson[] {
    return [...lessons].sort((a, b) => {
      const modDiff = (a.moduleOrder ?? 99) - (b.moduleOrder ?? 99);
      if (modDiff !== 0) return modDiff;
      return (a.order ?? 99) - (b.order ?? 99);
    });
  }

  findByProgramId(programId: string, includeDrafts = false): ICourseLesson[] {
    const items = this.findAll().filter(
      (l) => l.programId === programId && (includeDrafts || l.status !== 'draft')
    );
    return this.sortLessons(items);
  }

  findPublishedAll(): ICourseLesson[] {
    return this.sortLessons(this.findAll().filter((l) => l.status !== 'draft'));
  }

  findByIdInCourse(programId: string, lessonId: string): ICourseLesson | null {
    return this.findAll().find((l) => l.id === lessonId && l.programId === programId) || null;
  }
}

export class LessonProgressRepository extends BaseRepository<ILessonProgress> {
  constructor() {
    super(LessonProgressCollection);
  }

  findByUser(phone?: string, userId?: string, programId?: string): ILessonProgress[] {
    if (!phone && !userId) return [];
    return this.findAll().filter(
      (p) =>
        (!programId || p.programId === programId) &&
        ((phone && p.phone === phone) || (userId && p.userId === userId))
    );
  }

  async upsertWatchProgress(params: {
    userId: string;
    phone: string;
    programId: string;
    itemId: string;
    itemType: 'lesson' | 'recorded_class';
    watchedSeconds: number;
    durationSeconds: number;
    completed?: boolean;
  }): Promise<ILessonProgress> {
    const items = this.findAll();
    const existingIdx = items.findIndex(
      (p) =>
        p.itemId === params.itemId &&
        p.itemType === params.itemType &&
        ((params.phone && p.phone === params.phone) || (params.userId && p.userId === params.userId))
    );

    const safeDuration = Math.max(0, Number(params.durationSeconds) || 0);
    const safeWatched = Math.max(0, Number(params.watchedSeconds) || 0);
    const autoCompleted = safeDuration > 0 && safeWatched >= safeDuration * 0.9;
    const isCompleted = Boolean(
      params.completed || autoCompleted || (existingIdx >= 0 && items[existingIdx].completed)
    );

    const record: ILessonProgress = {
      id:
        existingIdx >= 0
          ? items[existingIdx].id
          : `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      phone: params.phone,
      programId: params.programId,
      itemId: params.itemId,
      itemType: params.itemType,
      watchedSeconds:
        existingIdx >= 0 ? Math.max(items[existingIdx].watchedSeconds, safeWatched) : safeWatched,
      durationSeconds: safeDuration || (existingIdx >= 0 ? items[existingIdx].durationSeconds : 0),
      completed: isCompleted,
      lastWatchedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      items[existingIdx] = { ...items[existingIdx], ...record };
      this.replaceAll(items);
      return items[existingIdx];
    }

    return this.create(record);
  }
}

export const courseRepository = new CourseRepository();
export const courseLessonRepository = new CourseLessonRepository();
export const lessonProgressRepository = new LessonProgressRepository();

