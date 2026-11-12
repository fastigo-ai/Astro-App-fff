import { Request, Response, NextFunction } from 'express';
import { bumpService } from './bump.service';

export const bumpController = {
  getJourney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = bumpService.getJourney();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  uploadBump: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageBase64, frameType, month, notes } = req.body;
      const data = bumpService.uploadBump({ imageBase64, frameType, month, notes });
      return res.status(201).json({
        success: true,
        message: 'Baby bump photo saved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

