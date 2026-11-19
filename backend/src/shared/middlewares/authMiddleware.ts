import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, UserRole } from '../config/constants';
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

    // Check if account has been soft-deleted or role updated
    if (decoded?.phone) {
      const user = await profileRepository.findByPhone(decoded.phone);
      if (user && user.is_deleted) {
        return res.status(403).json({
          success: false,
          error: 'Account has been deleted or deactivated. Please sign in again with OTP to reactivate.',
          is_deleted: true,
        });
      }
      // Populate latest role from DB
      if (user && user.role) {
        req.user.role = user.role;
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Unauthorized, invalid token' });
  }
};

/**
 * Role-Based Access Control (RBAC) middleware
 * Allows fine-grained access checks based on 3-tier hierarchy:
 * user -> admin -> super_admin
 */
export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized, user identity missing' });
    }

    const userRole: UserRole = req.user.role || 'user';

    // super_admin has master authority across all roles
    if (userRole === 'super_admin' || roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Access denied. Requires one of [${roles.join(', ')}] role(s).`,
      currentRole: userRole,
    });
  };
};

export const requireAdmin = requireRole(['admin', 'super_admin']);
export const requireSuperAdmin = requireRole('super_admin');

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
