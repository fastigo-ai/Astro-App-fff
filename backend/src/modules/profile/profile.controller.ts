import { Request, Response, NextFunction } from 'express';
import { profileService } from './profile.service';

export const profileController = {
  updateLanguage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { language } = req.body;
      const user = req.user;

      if (!language || !['en', 'hi'].includes(language)) {
        return res.status(400).json({ success: false, error: 'Valid language code is required (en or hi)' });
      }

      await profileService.updateLanguage(user?.phone, language);
      return res.status(200).json({
        success: true,
        message: 'Language preference updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  saveDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, dob, city, state } = req.body;
      const user = req.user;

      if (!name) {
        return res.status(400).json({ success: false, error: 'Name is required' });
      }

      await profileService.saveDetails(user?.phone, { name, dob, city, state });
      return res.status(200).json({
        success: true,
        message: 'Profile details saved successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

