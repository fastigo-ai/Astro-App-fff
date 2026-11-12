import { Request, Response, NextFunction } from 'express';
import { momService } from './mom.service';

export const momController = {
  saveKickSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';
      const record = await momService.saveKickSession({
        userId,
        phone,
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        message: 'Kick session saved successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  },

  getKickSessions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phone = req.user?.phone || (req.query.phone as string) || '9366128220';
      const data = await momService.getKickSessions(phone);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  saveMoodLog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';
      const record = await momService.saveMoodLog({
        userId,
        phone,
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        message: 'Mood check-in saved successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  },

  getMoodLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phone = req.user?.phone || (req.query.phone as string) || '9366128220';
      const data = await momService.getMoodLogs(phone);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  saveSamvadNote: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';
      const record = await momService.saveSamvadNote({
        userId,
        phone,
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        message: 'Garbh Samvad note saved successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  },

  getSamvadNotes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phone = req.user?.phone || (req.query.phone as string) || '9366128220';
      const data = await momService.getSamvadNotes(phone);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};

