import { Router } from 'express';
import { profileController } from './profile.controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { uploadAvatarMiddleware } from '../../shared/middlewares/uploadMiddleware';

const router = Router();

router.use(authMiddleware);

// Profile details
router.get('/', profileController.getProfile);
router.get('/me', profileController.getProfile);
router.post('/details', profileController.saveDetails);

// Language preference routes (GET, POST, PUT)
router.get('/language', profileController.getLanguage);
router.post('/language', profileController.updateLanguage);
router.put('/language', profileController.updateLanguage);

// Avatar Upload with Multer direct streaming to Cloudinary (Zero Node.js RAM Buffering)
router.post('/avatar', uploadAvatarMiddleware, profileController.uploadAvatar);
router.put('/avatar', uploadAvatarMiddleware, profileController.uploadAvatar);

// Account Deletion (Soft delete: is_deleted = true, Apple & Google store compliance)
router.delete('/', profileController.deleteAccount);
router.post('/delete-account', profileController.deleteAccount);

export default router;
