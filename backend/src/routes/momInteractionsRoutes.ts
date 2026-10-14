import { Router } from 'express';
import { momInteractionsController } from '../controllers/momInteractionsController';
import { optionalAuthMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Kick Counter
router.post('/kicks', optionalAuthMiddleware, momInteractionsController.saveKickSession);
router.get('/kicks', optionalAuthMiddleware, momInteractionsController.getKickSessions);

// Mood Check-in & Therapy
router.post('/mood', optionalAuthMiddleware, momInteractionsController.saveMoodLog);
router.get('/mood', optionalAuthMiddleware, momInteractionsController.getMoodLogs);

// Garbh Samvad
router.post('/samvad', optionalAuthMiddleware, momInteractionsController.saveSamvadNote);
router.get('/samvad', optionalAuthMiddleware, momInteractionsController.getSamvadNotes);

export default router;
