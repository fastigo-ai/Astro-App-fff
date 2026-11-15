import { Router } from 'express';
import { profileController } from './profile.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { uploadAvatarMiddleware } from '../../shared/middlewares/uploadMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', profileController.getProfile);
router.get('/me', profileController.getProfile);
router.post('/language', profileController.updateLanguage);
router.post('/details', profileController.saveDetails);

// Avatar Upload with Multer direct streaming to Cloudinary (Zero Node.js RAM Buffering)
router.post('/avatar', uploadAvatarMiddleware, profileController.uploadAvatar);
router.put('/avatar', uploadAvatarMiddleware, profileController.uploadAvatar);

export default router;
