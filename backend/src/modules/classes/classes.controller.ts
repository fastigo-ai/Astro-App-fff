import { Request, Response, NextFunction } from 'express';
import { classesService } from './classes.service';
import { getRequestIdentity } from '../../shared/services/entitlementService';
import {
  createLiveClassSchema,
  createRecordedClassSchema,
  publishRecordingSchema,
  recordedProgressSchema,
  updateLiveClassSchema,
  updateRecordedClassSchema,
} from './classes.schemas';

export const classesController = {
  listLiveClasses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = classesService.listLiveClasses(
        {
          programId: req.query.programId as string | undefined,
          category: req.query.category as string | undefined,
          trimester: req.query.trimester as string | undefined,
          status: req.query.status as string | undefined,
          upcomingOnly: req.query.upcomingOnly === 'true',
        },
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  listRecordedClasses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = classesService.listRecordedClasses(
        {
          programId: req.query.programId as string | undefined,
          category: req.query.category as string | undefined,
          trimester: req.query.trimester as string | undefined,
          search: req.query.search as string | undefined,
        },
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  getRecordedClassById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await classesService.getRecordedClassDetail(
        String(req.params.id),
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  saveRecordedProgress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = recordedProgressSchema.parse(req.body);
      const data = await classesService.saveRecordedProgress(
        String(req.params.id),
        payload,
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getMyRegistrations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = classesService.getMyRegistrations(getRequestIdentity(req));
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  getLiveClassById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = classesService.getLiveClassDetail(
        String(req.params.id),
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  registerForLiveClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await classesService.registerForLiveClass(
        String(req.params.id),
        getRequestIdentity(req)
      );
      return res.status(result.alreadyRegistered ? 200 : 201).json({
        success: true,
        message: result.alreadyRegistered
          ? 'Already registered for this live class'
          : 'Successfully registered for live class',
        data: {
          registration: result.registration,
          registeredCount: result.registeredCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  joinLiveClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await classesService.joinLiveClass(
        String(req.params.id),
        getRequestIdentity(req)
      );
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  adminListClasses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = classesService.adminListClasses({
        programId: req.query.programId as string | undefined,
        status: req.query.status as string | undefined,
      });
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  adminCreateClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = createLiveClassSchema.parse(req.body);
      const data = await classesService.adminCreateClass(payload);
      return res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  adminUpdateClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = updateLiveClassSchema.parse(req.body);
      const data = await classesService.adminUpdateClass(String(req.params.id), payload);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  adminPublishRecording: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = publishRecordingSchema.parse(req.body);
      const data = await classesService.adminPublishRecording(String(req.params.id), payload);
      return res.status(201).json({
        success: true,
        message: 'Live class marked completed and recording published',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  adminDeleteClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await classesService.adminDeleteClass(String(req.params.id));
      return res.status(200).json({ success: true, message: 'Class deleted' });
    } catch (error) {
      next(error);
    }
  },

  adminListRecorded: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = classesService.adminListRecorded({
        programId: req.query.programId as string | undefined,
      });
      return res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
      next(error);
    }
  },

  adminCreateRecorded: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = createRecordedClassSchema.parse(req.body);
      const data = await classesService.adminCreateRecorded(payload);
      return res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  adminUpdateRecorded: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = updateRecordedClassSchema.parse(req.body);
      const data = await classesService.adminUpdateRecorded(String(req.params.id), payload);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  adminDeleteRecorded: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await classesService.adminDeleteRecorded(String(req.params.id));
      return res.status(200).json({ success: true, message: 'Recorded class deleted' });
    } catch (error) {
      next(error);
    }
  },
};

