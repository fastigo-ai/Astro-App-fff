import { Request, Response, NextFunction } from 'express';
import { profileService } from './profile.service';

export const profileController = {
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.query.phone;
      if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

      const profile = await profileService.getProfile(String(phone));
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Profile not found' });
      }

      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },

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
      const phone = user?.phone || req.body.phone;

      if (!name) {
        return res.status(400).json({ success: false, error: 'Name is required' });
      }

      await profileService.saveDetails(phone, { name, dob, city, state });
      return res.status(200).json({
        success: true,
        message: 'Profile details saved successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
