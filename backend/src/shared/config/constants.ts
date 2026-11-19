export const JWT_SECRET = process.env.JWT_SECRET || 'astrobaby-super-secret-key-2026';

// 3-Tier Role-Based Access Control (RBAC)
export type UserRole = 'user' | 'admin' | 'super_admin';
export const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || '9366128220';

// Loaded dynamically from .env so developers can easily change or disable bypass credentials
export const BYPASS_PHONE = process.env.BYPASS_PHONE || '9366128220';
export const BYPASS_OTP = process.env.BYPASS_OTP || '1234';

// Rate Limiting Constants for Auth & Login (Sliding window / Counter in Redis or Memory)
export const RATE_LIMIT_OTP_MAX_PER_PHONE = Number(process.env.RATE_LIMIT_OTP_MAX_PER_PHONE) || 3;
export const RATE_LIMIT_OTP_WINDOW_SECONDS = Number(process.env.RATE_LIMIT_OTP_WINDOW_SECONDS) || 600; // 10 minutes
export const RATE_LIMIT_OTP_MAX_PER_IP = Number(process.env.RATE_LIMIT_OTP_MAX_PER_IP) || 10;
export const RATE_LIMIT_OTP_IP_WINDOW_SECONDS = Number(process.env.RATE_LIMIT_OTP_IP_WINDOW_SECONDS) || 900; // 15 minutes

export const RATE_LIMIT_VERIFY_MAX_PER_PHONE = Number(process.env.RATE_LIMIT_VERIFY_MAX_PER_PHONE) || 5;
export const RATE_LIMIT_VERIFY_WINDOW_SECONDS = Number(process.env.RATE_LIMIT_VERIFY_WINDOW_SECONDS) || 900; // 15 minutes
export const RATE_LIMIT_VERIFY_MAX_PER_IP = Number(process.env.RATE_LIMIT_VERIFY_MAX_PER_IP) || 25;
