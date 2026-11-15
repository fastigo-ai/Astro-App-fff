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

  getLanguage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || (req.query.phone as string);
      if (!phone) {
        return res.status(200).json({ success: true, data: { language: 'en' } });
      }

      const language = await profileService.getLanguage(phone);
      return res.status(200).json({
        success: true,
        data: { language },
      });
    } catch (error) {
      next(error);
    }
  },

  updateLanguage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { language } = req.body;
      const user = req.user;
      const phone = user?.phone || req.body.phone;

      if (!language || !['en', 'hi'].includes(language)) {
        return res.status(400).json({ success: false, error: 'Valid language code is required (en or hi)' });
      }

      const result = await profileService.updateLanguage(phone, language);
      return res.status(200).json({
        success: true,
        message: 'Language preference updated successfully',
        data: result,
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

  uploadAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone;
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone number is required' });
      }

      // Check if file was streamed via Multer direct to Cloudinary
      const file: any = req.file;
      const avatarUrl = file?.url || req.body.avatar || req.body.url;
      const publicId = file?.publicId || req.body.publicId;

      if (!avatarUrl) {
        return res.status(400).json({
          success: false,
          error: 'No image file uploaded or avatar URL provided',
        });
      }

      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = (req.headers['user-agent'] as string) || 'Astrobaby Mobile App';

      const result = await profileService.updateAvatar(
        String(phone),
        { url: avatarUrl, publicId },
        { ip: clientIp, userAgent }
      );

      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
