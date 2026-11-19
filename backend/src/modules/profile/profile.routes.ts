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

// Family Profile routes (Mother, Father / Husband, Doctor)
router.get('/family', profileController.getFamilyDetails);
router.get('/mother', profileController.getFamilyDetails);
router.put('/mother', profileController.updateMotherDetails);
router.post('/mother', profileController.updateMotherDetails);

router.get('/father', profileController.getFamilyDetails);
router.put('/father', profileController.updateFatherDetails);
router.post('/father', profileController.updateFatherDetails);
router.put('/husband', profileController.updateFatherDetails);
router.post('/husband', profileController.updateFatherDetails);

router.get('/doctor', profileController.getFamilyDetails);
router.put('/doctor', profileController.updateDoctorDetails);
router.post('/doctor', profileController.updateDoctorDetails);

// Account Deletion (Soft delete: is_deleted = true, Apple & Google store compliance)
router.delete('/', profileController.deleteAccount);
router.post('/delete-account', profileController.deleteAccount);

export default router;
