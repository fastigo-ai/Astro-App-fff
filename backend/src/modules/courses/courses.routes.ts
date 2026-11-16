import { Router } from 'express';
import { coursesController } from './courses.controller';
import { optionalAuthMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.get('/', optionalAuthMiddleware, coursesController.listCourses);
router.get('/:id', optionalAuthMiddleware, coursesController.getCourseById);
router.get('/:id/lessons', optionalAuthMiddleware, coursesController.getCourseLessons);
router.post('/:id/lessons/:lessonId/progress', optionalAuthMiddleware, coursesController.saveLessonProgress);

router.get('/admin/:id/lessons', coursesController.adminListLessons);
router.post('/admin/:id/lessons', coursesController.adminCreateLesson);
router.put('/admin/:id/lessons/:lessonId', coursesController.adminUpdateLesson);
router.delete('/admin/:id/lessons/:lessonId', coursesController.adminDeleteLesson);

export default router;

