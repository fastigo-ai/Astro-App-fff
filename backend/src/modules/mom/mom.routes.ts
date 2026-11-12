import { Router } from 'express';
import { momController } from './mom.controller';
import { optionalAuthMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.post('/kicks', optionalAuthMiddleware, momController.saveKickSession);
router.get('/kicks', optionalAuthMiddleware, momController.getKickSessions);

router.post('/mood', optionalAuthMiddleware, momController.saveMoodLog);
router.get('/mood', optionalAuthMiddleware, momController.getMoodLogs);

router.post('/samvad', optionalAuthMiddleware, momController.saveSamvadNote);
router.get('/samvad', optionalAuthMiddleware, momController.getSamvadNotes);

export default router;

