import { Router } from 'express';
import { classesController } from './classes.controller';
import { optionalAuthMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.get('/', optionalAuthMiddleware, classesController.listLiveClasses);
router.get('/live', optionalAuthMiddleware, classesController.listLiveClasses);
router.get('/recorded', optionalAuthMiddleware, classesController.listRecordedClasses);
router.get('/recorded/:id', optionalAuthMiddleware, classesController.getRecordedClassById);
router.post('/recorded/:id/progress', optionalAuthMiddleware, classesController.saveRecordedProgress);
router.get('/my-registrations', optionalAuthMiddleware, classesController.getMyRegistrations);

router.get('/:id', optionalAuthMiddleware, classesController.getLiveClassById);
router.post('/:id/register', optionalAuthMiddleware, classesController.registerForLiveClass);
router.post('/:id/join', optionalAuthMiddleware, classesController.joinLiveClass);

export default router;

