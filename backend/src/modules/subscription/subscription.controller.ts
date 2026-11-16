import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from './subscription.service';

export const subscriptionController = {
  getPlans: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || (req.query.phone as string) || '9366128220';
      const data = await subscriptionService.getPlans({
        phone,
        stage: req.query.stage as string | undefined,
        month: req.query.month ? Number(req.query.month) : undefined,
      });

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  createRazorpayOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId, tier, amount, month } = req.body;
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';

      const data = await subscriptionService.createRazorpayOrder({
        planId,
        tier,
        amount,
        month,
        phone,
        userId,
      });

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  verifyRazorpayPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';

      const result = await subscriptionService.verifyRazorpayPayment({
        ...req.body,
        phone,
        userId,
      });

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature from Razorpay. Verification failed.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified and subscription activated successfully',
        data: result.data,
      });
    } catch (error) {
      console.error('[Subscription] verifyRazorpayPayment error:', error);
      next(error);
    }
  },

  skipTrial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phone = req.user?.phone || req.body.phone || '9366128220';
      const data = await subscriptionService.skipTrial(phone);

      return res.status(200).json({
        success: true,
        message: '3-day free trial activated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  subscribe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';

      const subscription = await subscriptionService.subscribe({
        userId,
        phone,
        ...req.body,
      });

      return res.status(200).json({
        success: true,
        message: 'Subscription successfully activated',
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  },

  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phone = req.user?.phone || (req.query.phone as string) || '9366128220';
      const data = await subscriptionService.getStatus(phone);

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getProgramSchemes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const programs = subscriptionService.getProgramSchemes(req.query.category as string | undefined);
      return res.status(200).json({
        success: true,
        count: programs.length,
        data: programs,
      });
    } catch (error) {
      next(error);
    }
  },

  getProgramSchemeById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const program = subscriptionService.getProgramSchemeById(id);

      if (!program) {
        return res.status(404).json({
          success: false,
          message: `Program scheme with ID ${id} not found`,
        });
      }

      return res.status(200).json({ success: true, data: program });
    } catch (error) {
      next(error);
    }
  },

  adminSaveProgramScheme: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, title, category, tiers } = req.body;
      if (!id || !title || !category || !Array.isArray(tiers)) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: id, title, category, and tiers array are required',
        });
      }

      const { updated, programRecord } = subscriptionService.adminSaveProgramScheme(req.body);
      return res.status(200).json({
        success: true,
        message: updated
          ? 'Program scheme updated successfully'
          : 'New program scheme created successfully',
        data: programRecord,
      });
    } catch (error) {
      next(error);
    }
  },

  adminUpdateProgramScheme: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const updated = subscriptionService.adminUpdateProgramScheme(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Program with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Program scheme ${id} updated successfully`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  adminDeleteProgramScheme: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const deleted = subscriptionService.adminDeleteProgramScheme(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Program scheme with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Program scheme ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};

