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
      const data = activityService.adminCreateActivity(req.body);
      return res.status(201).json({
        success: true,
        message: 'Activity created successfully via Admin panel',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

