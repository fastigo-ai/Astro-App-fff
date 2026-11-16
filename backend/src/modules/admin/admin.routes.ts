import { Router } from 'express';
import { adminController } from './admin.controller';
import { supportController } from '../support/support.controller';
import { classesController } from '../classes/classes.controller';
import { coursesController } from '../courses/courses.controller';

const router = Router();

// Stats & Users
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.post('/users/grant', adminController.grantUser);
router.post('/users/revoke', adminController.revokeUser);
router.get('/payments', adminController.getPayments);

// Coupons
router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);
router.post('/coupons/verify', adminController.verifyCoupon);

// Live Classes, Recorded Masterclasses & Course Lessons (LMS)
router.get('/classes', classesController.adminListClasses);
router.post('/classes', classesController.adminCreateClass);
router.put('/classes/:id', classesController.adminUpdateClass);
router.post('/classes/:id/publish-recording', classesController.adminPublishRecording);
router.delete('/classes/:id', classesController.adminDeleteClass);

router.get('/recorded', classesController.adminListRecorded);
router.post('/recorded', classesController.adminCreateRecorded);
router.put('/recorded/:id', classesController.adminUpdateRecorded);
router.delete('/recorded/:id', classesController.adminDeleteRecorded);

router.get('/courses/:id/lessons', coursesController.adminListLessons);
router.post('/courses/:id/lessons', coursesController.adminCreateLesson);
router.put('/courses/:id/lessons/:lessonId', coursesController.adminUpdateLesson);
router.delete('/courses/:id/lessons/:lessonId', coursesController.adminDeleteLesson);

// Physical Kit Dispatches
router.get('/dispatches', adminController.getDispatches);
router.post('/dispatches', adminController.createDispatch);
router.put('/dispatches/:id', adminController.updateDispatch);

// Broadcast Notifications
router.get('/broadcasts', adminController.getBroadcasts);
router.post('/broadcasts', adminController.createBroadcast);

// Role-Based Support Tickets
router.get('/support/tickets', supportController.adminListTickets);
router.post('/support/tickets/:id/reply', supportController.adminReplyTicket);
router.put('/support/tickets/:id/status', supportController.adminUpdateStatus);

export default router;

