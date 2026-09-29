import { Request, Response, NextFunction } from 'express';

export const profileController = {
  updateLanguage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { language } = req.body;
      const user = req.user;

      if (!language || !['en', 'hi'].includes(language)) {
        return res.status(400).json({ success: false, error: 'Valid language code is required (en or hi)' });
      }

      // In production: await User.updateOne({ _id: user.id }, { $set: { 'preferences.language': language } });
      console.log(`[Backend] Updated language for user ${user?.phone} to: ${language}`);

      return res.status(200).json({
        success: true,
        message: 'Language preference updated successfully'
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

      // In production: await User.updateOne({ _id: user.id }, { name, dob, city, state });
      console.log(`[Backend] Saved Profile for ${user?.phone}: Name=${name}, DOB=${dob}`);

      return res.status(200).json({
        success: true,
        message: 'Profile details saved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
