import { Request, Response, NextFunction } from 'express';
import { activityService } from './activity.service';

export const activityController = {
  getDailyJourney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = activityService.getDailyJourney();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  markDayComplete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = activityService.markDayComplete(req.body.day);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getActivityDetail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = activityService.getActivityDetail(String(req.params.id));
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  adminCreateActivity: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = activityService.saveDailySchedule(req.body);
      return res.status(201).json({
        success: true,
        message: 'Daily schedule saved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  getDailySchedule: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = Number(req.query.month) || 4;
      const day = Number(req.query.day) || 1;
      const data = activityService.getDailySchedule(month, day);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  saveDailySchedule: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { month, day } = req.body;
      if (!month || !day) {
        return res.status(400).json({ success: false, error: 'Month and day are required' });
      }
      const data = await activityService.saveDailySchedule(req.body);
      return res.status(200).json({ success: true, message: 'Daily schedule saved', data });
    } catch (error) {
      next(error);
    }
  },

  getCareNotes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = Number(req.query.month) || 4;
      const day = Number(req.query.day) || 1;
      const data = activityService.getCareNotes(month, day);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  saveCareNotes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { month, day } = req.body;
      if (!month || !day) {
        return res.status(400).json({ success: false, error: 'Month and day are required' });
      }
      const data = await activityService.saveCareNotes(req.body);
      return res.status(200).json({ success: true, message: 'Care notes saved', data });
    } catch (error) {
      next(error);
    }
  },
};

