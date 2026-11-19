import { Router } from 'express';
import { activityController } from './activity.controller';

const router = Router();

router.get('/daily', activityController.getDailyJourney);
router.post('/complete', activityController.markDayComplete);
router.get('/schedule', activityController.getDailySchedule);
router.post('/schedule', activityController.saveDailySchedule);
router.get('/care-notes', activityController.getCareNotes);
router.post('/care-notes', activityController.saveCareNotes);
router.get('/:id', activityController.getActivityDetail);
router.post('/', activityController.adminCreateActivity);

export default router;

