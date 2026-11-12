import { Request, Response } from 'express';
import { krishnaService } from './krishna.service';
import { getRequestIdentity } from '../../shared/services/entitlementService';

export const krishnaController = {
  getKrishnaPlans: async (req: Request, res: Response) => {
    try {
      const month = Number(req.query.month) || 4;
      const result = krishnaService.getPlans(month);
      return res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  checkCoupon: async (req: Request, res: Response) => {
    try {
      const { code, planPrice = 4999 } = req.body;
      const matched = krishnaService.checkCoupon(code, planPrice);
      if (!matched) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code. Try KRISHNA50 or GARBHMITRA.',
        });
      }
      return res.status(200).json({ success: true, ...matched });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  createInstallmentPlan: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const phone = (req as any).user?.phone || '9999999999';
      const { planId, totalAmount, installmentsCount = 3 } = req.body;
      const result = await krishnaService.createInstallmentPlan({
        userId,
        phone,
        planId,
        totalAmount,
        installmentsCount,
      });

      return res.status(201).json({ success: true, ...result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  registerKundli: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const { motherName, placeOfBirth } = req.body;
      if (!motherName || !placeOfBirth) {
        return res.status(400).json({
          success: false,
          message: 'Mother name and place of birth are required',
        });
      }

      const kundli = await krishnaService.registerKundli(userId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Garbh Kundli successfully submitted to Vedic astrologer panel!',
        data: kundli,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getKundliStatus: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const record = await krishnaService.getKundliStatus(userId);
      return res.status(200).json({ success: true, data: record });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getBalSanskarDetails: async (req: Request, res: Response) => {
    try {
      const data = krishnaService.getBalSanskarDetails();
      return res.status(200).json({ success: true, ...data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getPreconceiveDetails: async (req: Request, res: Response) => {
    try {
      const data = krishnaService.getPreconceiveDetails();
      return res.status(200).json({ success: true, ...data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getLiveSessions: async (req: Request, res: Response) => {
    try {
      const { upcoming, recorded } = krishnaService.getLiveSessions(
        {
          programId: req.query.programId as string | undefined,
          category: req.query.category as string | undefined,
          trimester: req.query.trimester as string | undefined,
        },
        getRequestIdentity(req)
      );

      return res.status(200).json({ success: true, upcoming, recorded });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getReferralInfo: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const data = krishnaService.getReferralInfo(userId);
      return res.status(200).json({ success: true, ...data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getMedicalProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const data = await krishnaService.getMedicalProfile(userId);
      return res.status(200).json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  updateMedicalProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const updated = await krishnaService.updateMedicalProfile(userId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Medical profile updated successfully',
        data: updated,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  trackActivity: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || 'usr_guest';
      const record = await krishnaService.trackActivity(userId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Activity tracking synced successfully',
        data: record,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};

