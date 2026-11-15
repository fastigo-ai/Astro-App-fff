import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { profileRepository } from '../../modules/profile/profile.repository';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Check if account has been soft-deleted
    if (decoded?.phone) {
      const user = await profileRepository.findByPhone(decoded.phone);
      if (user && user.is_deleted) {
        return res.status(403).json({
          success: false,
          error: 'Account has been deleted or deactivated. Please sign in again with OTP to reactivate.',
          is_deleted: true,
        });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Unauthorized, invalid token' });
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded?.phone) {
        const user = await profileRepository.findByPhone(decoded.phone);
        if (!user || !user.is_deleted) {
          req.user = decoded;
        }
      } else {
        req.user = decoded;
      }
    } catch (error) {
      // Token expired or invalid, continue as guest
    }
  }
  next();
};
