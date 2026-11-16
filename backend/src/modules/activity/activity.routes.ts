import { Router } from 'express';
import { activityController } from './activity.controller';

const router = Router();

router.get('/daily', activityController.getDailyJourney);
router.post('/complete', activityController.markDayComplete);
router.get('/:id', activityController.getActivityDetail);
router.post('/', activityController.adminCreateActivity);

export default router;

