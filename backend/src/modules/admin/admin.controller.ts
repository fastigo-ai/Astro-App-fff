import { Request, Response } from 'express';
import { adminService } from './admin.service';

export const adminController = {
  getStats: async (req: Request, res: Response) => {
    try {
      const data = adminService.getStats();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  getUsers: async (req: Request, res: Response) => {
    try {
      const enrichedUsers = adminService.getUsers();
      return res.status(200).json({
        success: true,
        count: enrichedUsers.length,
        data: enrichedUsers,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  grantUser: async (req: Request, res: Response) => {
    try {
      const { phone, programId, tierName, durationMonths = 6, amount = 0 } = req.body;
      if (!phone || !programId) {
        return res.status(400).json({
          success: false,
          error: 'Phone number and programId are required',
        });
      }

      const subRecord = await adminService.grantUserSubscription({
        phone,
        programId,
        tierName,
        durationMonths,
        amount,
      });

      return res.status(200).json({
        success: true,
        message: `Subscription successfully granted to ${phone}`,
        data: subRecord,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  revokeUser: async (req: Request, res: Response) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone number is required' });
      }

      const updatedCount = await adminService.revokeUserSubscription(phone);
      return res.status(200).json({
        success: true,
        message: `Revoked ${updatedCount} active subscription(s) for ${phone}`,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  getPayments: async (req: Request, res: Response) => {
    try {
      const payments = adminService.getPayments();
      return res.status(200).json({
        success: true,
        count: payments.length,
        data: payments,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  getCoupons: async (req: Request, res: Response) => {
    try {
      const coupons = adminService.getCoupons();
      return res.status(200).json({ success: true, data: coupons });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  createCoupon: async (req: Request, res: Response) => {
    try {
      const { code, discountValue } = req.body;
      if (!code || !discountValue) {
        return res.status(400).json({
          success: false,
          error: 'Coupon code and discountValue are required',
        });
      }
      const newCoupon = await adminService.createCoupon(req.body);
      return res.status(201).json({ success: true, data: newCoupon });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteCoupon: async (req: Request, res: Response) => {
    try {
      await adminService.deleteCoupon(req.params.id as string);
      return res.status(200).json({ success: true, message: 'Coupon deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  verifyCoupon: async (req: Request, res: Response) => {
    try {
      const { code, orderAmount } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, error: 'Coupon code required' });
      }
      const result = adminService.verifyCoupon(code, orderAmount);
      if (result.status !== 200) {
        return res.status(result.status).json({ success: false, error: result.error });
      }
      return res.status(200).json({ success: true, data: result.data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  getDispatches: async (req: Request, res: Response) => {
    try {
      const dispatches = adminService.getDispatches();
      return res.status(200).json({ success: true, data: dispatches });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  createDispatch: async (req: Request, res: Response) => {
    try {
      const { phone, kitName } = req.body;
      if (!phone || !kitName) {
        return res.status(400).json({ success: false, error: 'Phone and kitName are required' });
      }
      const newDispatch = await adminService.createDispatch(req.body);
      return res.status(201).json({ success: true, data: newDispatch });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  updateDispatch: async (req: Request, res: Response) => {
    try {
      const updated = await adminService.updateDispatch(req.params.id as string, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  getBroadcasts: async (req: Request, res: Response) => {
    try {
      const list = adminService.getBroadcasts();
      return res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  createBroadcast: async (req: Request, res: Response) => {
    try {
      const { title, message, targetAudience = 'all' } = req.body;
      if (!title || !message) {
        return res.status(400).json({ success: false, error: 'Title and message are required' });
      }
      const broadcast = await adminService.createBroadcast(title, message, targetAudience);
      return res.status(201).json({
        success: true,
        message: 'Notification broadcasted to app users successfully',
        data: broadcast,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};

