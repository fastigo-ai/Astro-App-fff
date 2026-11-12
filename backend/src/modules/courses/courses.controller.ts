import { Request, Response, NextFunction } from 'express';
import { coursesService } from './courses.service';
import { getRequestIdentity } from '../../shared/services/entitlementService';
import {
  createLessonSchema,
  lessonProgressSchema,
  updateLessonSchema,
} from './courses.schemas';

export const coursesController = {
  listCourses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = coursesService.listCourses(
        {
          category: req.query.category as string | undefined,
          search: req.query.search as string | undefined,
        },
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  getCourseById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = coursesService.getCourseDetail(
        String(req.params.id),
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getCourseLessons: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = coursesService.getCourseLessons(
        String(req.params.id),
        {
          moduleTitle: req.query.moduleTitle as string | undefined,
          contentType: req.query.contentType as string | undefined,
        },
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  saveLessonProgress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = lessonProgressSchema.parse(req.body);
      const data = await coursesService.saveLessonProgress(
        String(req.params.id),
        String(req.params.lessonId),
        payload,
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  adminListLessons: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = coursesService.adminListLessons(String(req.params.id));
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  adminCreateLesson: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = createLessonSchema.parse(req.body);
      const data = await coursesService.adminCreateLesson(String(req.params.id), payload);
      return res.status(201).json({
        success: true,
        message: 'Course lesson created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  adminUpdateLesson: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = updateLessonSchema.parse(req.body);
      const data = await coursesService.adminUpdateLesson(
        String(req.params.id),
        String(req.params.lessonId),
        payload
      );
      return res.status(200).json({
        success: true,
        message: 'Course lesson updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  adminDeleteLesson: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lessonId = String(req.params.lessonId);
      await coursesService.adminDeleteLesson(String(req.params.id), lessonId);
      return res.status(200).json({
        success: true,
        message: `Lesson ${lessonId} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};

