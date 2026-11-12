import { coursesController } from '../modules/courses/courses.controller';
import { classesController } from '../modules/classes/classes.controller';
import { krishnaController } from '../modules/krishna/krishna.controller';
import { globalErrorHandler } from '../shared/middlewares/errorHandler';
import { courseRepository } from '../modules/courses/courses.repository';
import {
  CourseLessonsCollection,
  LessonProgressCollection,
  LiveClassesCollection,
  LiveClassRegistrationsCollection,
  RecordedClassesCollection,
  SubscriptionsCollection,
} from '../shared/db/dbStore';

function createMockRes() {
  const res: any = {};
  res.statusCode = 200;
  res.data = null;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: any) => {
    res.data = data;
    return res;
  };
  return res;
}

function createNextCapture(req?: any, res?: any) {
  let capturedError: any = null;
  const next = (err?: any) => {
    if (err) {
      capturedError = err;
      if (req && res) {
        globalErrorHandler(err, req, res, () => {});
      }
    }
  };
  return { next, getError: () => capturedError };
}

async function runCoursesAndClassesTests() {
  console.log('🧪 Starting Courses, Live Classes & Recorded Masterclasses Backend Tests...\n');

  let passed = 0;
  let failed = 0;

  async function assert(desc: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${desc}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  const testPhone = `99887${Date.now().toString().slice(-5)}`;
  const createdLessonIds: string[] = [];
  const createdLiveIds: string[] = [];
  const createdRecordedIds: string[] = [];
  const createdSubIds: string[] = [];

  try {
    // 1. Repository & List courses
    await assert('courseRepository & courseController.listCourses return seeded programs with lesson/class counts', async () => {
      if (courseRepository.findActiveCourses().length < 1) {
        throw new Error('Expected courseRepository.findActiveCourses() to return seeded courses');
      }
      const req: any = { query: {} };
      const res = createMockRes();
      const { next, getError } = createNextCapture(req, res);
      await coursesController.listCourses(req, res, next);
      if (getError()) throw getError();

      if (res.statusCode !== 200 || !res.data.success) throw new Error('Expected 200 success');
      const gs = res.data.data.find((c: any) => c.id === 'garbh_sanskar');
      if (!gs) throw new Error('garbh_sanskar course not found');
      if (gs.lessonCount < 1) throw new Error('Expected lessonCount >= 1');
      if (gs.recordedClassCount < 1) throw new Error('Expected recordedClassCount >= 1');
    });

    // 2. Get course detail & entitlement gating
    await assert('coursesController.getCourseById gates paid lessons for unsubscribed user and unlocks free preview', async () => {
      const req: any = { params: { id: 'garbh_sanskar' }, query: { phone: testPhone } };
      const res = createMockRes();
      const { next, getError } = createNextCapture(req, res);
      await coursesController.getCourseById(req, res, next);
      if (getError()) throw getError();

      if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
      const { curriculumModules, lessons } = res.data.data;
      if (!Array.isArray(curriculumModules) || curriculumModules.length === 0) {
        throw new Error('Expected curriculumModules');
      }
      const freeLesson = lessons.find((l: any) => l.isFreePreview);
      const paidLesson = lessons.find((l: any) => !l.isFreePreview);
      if (!freeLesson?.isUnlocked || !freeLesson?.contentUrl) {
        throw new Error('Expected free preview lesson to be unlocked with contentUrl');
      }
      if (!paidLesson || paidLesson.isUnlocked || paidLesson.contentUrl !== '') {
        throw new Error('Expected paid lesson to be locked with empty contentUrl');
      }
    });

    // 3. Admin create/update/progress/delete lesson
    let testLessonId = '';
    await assert('coursesController.adminCreateLesson creates a new lesson and validates input', async () => {
      const badReq: any = { params: { id: 'garbh_sanskar' }, body: { moduleTitle: 'Test' } };
      const badRes = createMockRes();
      const badNext = createNextCapture();
      await coursesController.adminCreateLesson(badReq, badRes, badNext.next);
      if (!badNext.getError()) throw new Error('Expected Zod validation error for missing fields');

      const req: any = {
        params: { id: 'garbh_sanskar' },
        body: {
          moduleTitle: 'Module 99: QA Module',
          moduleOrder: 99,
          lessonTitle: 'QA Test Lesson',
          order: 1,
          contentType: 'video',
          duration: '10 mins',
          durationSeconds: 600,
          contentUrl: 'https://cdn.astrobaby.app/video/qa.mp4',
          isFreePreview: true,
        },
      };
      const res = createMockRes();
      const { next, getError } = createNextCapture(req, res);
      await coursesController.adminCreateLesson(req, res, next);
      if (getError()) throw getError();
      if (res.statusCode !== 201 || !res.data.data?.id) throw new Error('Expected 201 with lesson id');
      testLessonId = res.data.data.id;
      createdLessonIds.push(testLessonId);
    });

    await assert('coursesController.saveLessonProgress marks lesson completed at >= 90% watched', async () => {
      const req: any = {
        params: { id: 'garbh_sanskar', lessonId: testLessonId },
        body: { phone: testPhone, watchedSeconds: 560, durationSeconds: 600 },
      };
      const res = createMockRes();
      const { next, getError } = createNextCapture(req, res);
      await coursesController.saveLessonProgress(req, res, next);
      if (getError()) throw getError();
      if (res.statusCode !== 200 || !res.data.data.completed) {
        throw new Error('Expected lesson progress to auto-complete at 560/600s');
      }
    });

    // 4. Schedule a live class and confirm krishnaController.getLiveSessions reflects it
    let testLiveId = '';
    await assert('classesController.adminCreateClass schedules a live class visible in krishna getLiveSessions', async () => {
      const req: any = {
        body: {
          programId: 'garbh_sanskar',
          title: 'QA Scheduled Prenatal Pranayama',
          instructor: 'Dr. Test Vaidya',
          dateTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          durationMinutes: 50,
          joinUrl: 'https://zoom.us/j/999888777',
          isFreePreview: false,
        },
      };
      const res = createMockRes();
      const { next, getError } = createNextCapture(req, res);
      await classesController.adminCreateClass(req, res, next);
      if (getError()) throw getError();
      if (res.statusCode !== 201 || !res.data.data?.id) throw new Error('Expected 201 for live class');
      testLiveId = res.data.data.id;
      createdLiveIds.push(testLiveId);

      const sessRes = createMockRes();
      await krishnaController.getLiveSessions({ query: { programId: 'garbh_sanskar' } } as any, sessRes);
      const found = (sessRes.data.upcoming || []).find((c: any) => c.id === testLiveId);
      if (!found) throw new Error('Newly scheduled class missing from /api/v1/krishna/live/sessions');
    });

    // 5. Idempotent registration
    await assert('classesController.registerForLiveClass is idempotent and increments count once', async () => {
      const req: any = { params: { id: testLiveId }, body: { phone: testPhone, userName: 'QA Mom' } };
      const res1 = createMockRes();
      await classesController.registerForLiveClass(req, res1, createNextCapture().next);
      if (res1.statusCode !== 201 || res1.data.data.registeredCount !== 1) {
        throw new Error(`Expected 201 and count=1, got ${res1.statusCode}/${res1.data?.data?.registeredCount}`);
      }

      const res2 = createMockRes();
      await classesController.registerForLiveClass(req, res2, createNextCapture().next);
      if (res2.statusCode !== 200 || res2.data.data.registeredCount !== 1) {
        throw new Error(`Expected 200 and count=1 on duplicate register, got ${res2.statusCode}`);
      }
    });

    // 6. Entitlement check on joinLiveClass
    await assert('classesController.joinLiveClass blocks unsubscribed user (403 via globalErrorHandler) and allows subscribed user', async () => {
      const reqDenied: any = { params: { id: testLiveId }, body: { phone: testPhone }, headers: {} };
      const resDenied = createMockRes();
      await classesController.joinLiveClass(reqDenied, resDenied, createNextCapture(reqDenied, resDenied).next);
      if (resDenied.statusCode !== 403 || resDenied.data?.error?.code !== 'SUBSCRIPTION_REQUIRED') {
        throw new Error(`Expected 403 SUBSCRIPTION_REQUIRED for unsubscribed user, got ${resDenied.statusCode}`);
      }

      const sub = await SubscriptionsCollection.insert({
        userId: `usr_${testPhone}`,
        phone: testPhone,
        programId: 'garbh_sanskar',
        planId: 'garbhsanskar-utkarsh',
        tier: 'full',
        planName: 'Utkarsh QA',
        amount: 2499,
        currency: 'INR',
        durationMonths: 6,
        status: 'active',
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      });
      if (sub._id) createdSubIds.push(sub._id);

      const resOk = createMockRes();
      await classesController.joinLiveClass(reqDenied, resOk, createNextCapture(reqDenied, resOk).next);
      if (resOk.statusCode !== 200 || resOk.data.data.joinUrl !== 'https://zoom.us/j/999888777') {
        throw new Error(`Expected 200 with joinUrl for subscribed user, got ${resOk.statusCode}`);
      }
    });

    // 7. Publish recording from live class
    let publishedRecId = '';
    await assert('classesController.adminPublishRecording completes live class and publishes recorded class', async () => {
      const req: any = {
        params: { id: testLiveId },
        body: {
          videoUrl: 'https://cdn.astrobaby.app/recorded/qa-pranayama.mp4',
          duration: '50 mins',
          summary: 'Recorded QA Pranayama session',
          isFreePreview: true,
        },
      };
      const res = createMockRes();
      const { next, getError } = createNextCapture();
      await classesController.adminPublishRecording(req, res, next);
      if (getError()) throw getError();
      if (res.statusCode !== 201) throw new Error(`Expected 201, got ${res.statusCode}`);

      const { liveClass, recordedClass } = res.data.data;
      if (liveClass.status !== 'completed') throw new Error('Expected live class status=completed');
      if (!recordedClass?.id) throw new Error('Expected recorded class id');
      publishedRecId = recordedClass.id;
      createdRecordedIds.push(publishedRecId);

      const recListRes = createMockRes();
      await classesController.listRecordedClasses({ query: { programId: 'garbh_sanskar' } } as any, recListRes, createNextCapture().next);
      const found = (recListRes.data.data || []).find((r: any) => r.id === publishedRecId);
      if (!found) throw new Error('Published recorded class not found in listRecordedClasses');
    });

    // 8. Recorded progress & view counter
    await assert('classesController.getRecordedClassById increments views and saveRecordedProgress tracks progress', async () => {
      const viewRes = createMockRes();
      await classesController.getRecordedClassById({ params: { id: publishedRecId }, query: { phone: testPhone } } as any, viewRes, createNextCapture().next);
      if (viewRes.statusCode !== 200 || viewRes.data.data.viewsNumeric !== 1) {
        throw new Error(`Expected viewsNumeric=1, got ${viewRes.data?.data?.viewsNumeric}`);
      }

      const progRes = createMockRes();
      await classesController.saveRecordedProgress(
        { params: { id: publishedRecId }, body: { phone: testPhone, watchedSeconds: 1500, durationSeconds: 3000 } } as any,
        progRes,
        createNextCapture().next
      );
      if (progRes.statusCode !== 200 || progRes.data.data.watchedSeconds !== 1500 || progRes.data.data.completed) {
        throw new Error('Expected watchedSeconds=1500 and completed=false at 50%');
      }
    });
  } finally {
    // Cleanup synthetic test records
    for (const id of createdLessonIds) await CourseLessonsCollection.delete(id);
    for (const id of createdLiveIds) await LiveClassesCollection.delete(id);
    for (const id of createdRecordedIds) await RecordedClassesCollection.delete(id);
    for (const id of createdSubIds) await SubscriptionsCollection.delete(id);

    const remainingRegs = LiveClassRegistrationsCollection.read().filter((r) => r.phone !== testPhone);
    LiveClassRegistrationsCollection.write(remainingRegs);
    const remainingProg = LessonProgressCollection.read().filter((p) => p.phone !== testPhone);
    LessonProgressCollection.write(remainingProg);
  }

  console.log(`\n========================================`);
  console.log(`📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCoursesAndClassesTests();

