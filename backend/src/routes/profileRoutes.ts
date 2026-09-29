import { Router } from 'express';
import { profileController } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Protect all profile routes
router.use(authMiddleware);

router.post('/language', profileController.updateLanguage);
router.post('/details', profileController.saveDetails);

export default router;
