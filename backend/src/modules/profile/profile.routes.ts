import { Router } from 'express';
import { profileController } from './profile.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/language', profileController.updateLanguage);
router.post('/details', profileController.saveDetails);

export default router;

