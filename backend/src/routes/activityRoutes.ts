import { Router } from 'express';
import { activityController } from '../controllers/activityController';

const router = Router();

router.get('/daily', activityController.getDailyJourney);
router.post('/complete', activityController.markDayComplete);
router.get('/:id', activityController.getActivityDetail);

// Admin Routes (Would normally be protected by an admin middleware)
router.post('/', activityController.adminCreateActivity);

export default router;
