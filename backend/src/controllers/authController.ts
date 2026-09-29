import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'astrobaby-super-secret-key-2026';
const BYPASS_NUMBER = '9366128220';
const BYPASS_OTP = '1234';

export const authController = {
  sendOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone } = req.body;
      
      if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

      // Handle the bypass test number
      if (phone === BYPASS_NUMBER) {
        console.log(`[Backend] Bypass number detected. No actual SMS sent.`);
        return res.status(200).json({ success: true, message: 'OTP sent (bypass)' });
      }

      // Normally we would generate a 6-digit OTP, save to Redis with 5m TTL, and call MSG91/Twilio
      // const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // await redis.setex(`otp:${phone}`, 300, otp);
      
      console.log(`[Backend] Mock sending OTP to ${phone}`);
      return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      next(error);
    }
  },

  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) return res.status(400).json({ success: false, error: 'Phone and OTP required' });

      let isValid = false;

      // Handle bypass number
      if (phone === BYPASS_NUMBER && otp === BYPASS_OTP) {
        isValid = true;
      } else {
        // Normally verify against Redis
        // const storedOtp = await redis.get(`otp:${phone}`);
        // isValid = storedOtp === otp;
        isValid = true; // Mock true for all others right now during dev
      }

      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Invalid OTP' });
      }

      // Generate JWT
      // Normally we check if user exists in DB, if not create them. We use a mock ID for now.
      const payload = { id: 'usr_123', phone, role: 'user' };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

      return res.status(200).json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          isNewUser: true, // Assuming new user to trigger onboarding
        }
      });

    } catch (error) {
      next(error);
    }
  },

  saveJourney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stage, lmp_date } = req.body;
      const user = req.user; // From authMiddleware

      console.log(`[Backend] Saved Journey for user ${user?.phone}: Stage=${stage}, LMP=${lmp_date}`);

      return res.status(200).json({
        success: true,
        data: {
          message: 'Journey updated successfully',
          stage,
          lmp_date,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'No refresh token provided' });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          return res.status(403).json({ success: false, error: 'Invalid or expired refresh token' });
        }

        // Generate a new 15-minute access token using the decoded data
        const payload = { id: decoded.id, phone: decoded.phone, role: decoded.role };
        const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

        return res.status(200).json({
          success: true,
          data: {
            accessToken: newAccessToken
          }
        });
      });
    } catch (error) {
      next(error);
    }
  }
};
