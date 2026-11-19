import { Router } from 'express';
import { adminController } from './admin.controller';
import { supportController } from '../support/support.controller';
import { classesController } from '../classes/classes.controller';
import { coursesController } from '../courses/courses.controller';
import { activityController } from '../activity/activity.controller';
import { authMiddleware, requireAdmin, requireSuperAdmin } from '../../shared/middlewares/authMiddleware';

const router = Router();

// Protect ALL admin routes with authMiddleware and requireAdmin by default
router.use(authMiddleware, requireAdmin);

// Super-admin exclusive: 3-Tier Role Management (Assign / Promote / Demote)
router.post('/roles/assign', requireSuperAdmin, adminController.assignRole);

// Super-admin exclusive: Manual Subscription Grant & Revoke
router.post('/users/grant', requireSuperAdmin, adminController.grantUser);
router.post('/users/revoke', requireSuperAdmin, adminController.revokeUser);

// Stats & Users (Admins & Super Admins)
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/payments', adminController.getPayments);

// Course Programs Management
router.post('/courses', coursesController.adminCreateCourse);
router.put('/courses/:id', coursesController.adminUpdateCourse);
router.delete('/courses/:id', coursesController.adminDeleteCourse);

// Daily Garbh Sanskar Activities Calendar (Month 1-9 & Day 1-30)
router.get('/activities/daily', activityController.getDailySchedule);
router.post('/activities/daily', activityController.saveDailySchedule);

// Daily Care Notes & Guidelines (Do's, Don'ts, Father duties, Hydration)
router.get('/care-notes', activityController.getCareNotes);
router.post('/care-notes', activityController.saveCareNotes);

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

