import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/redis.service';
import {
  BYPASS_PHONE,
  RATE_LIMIT_OTP_MAX_PER_PHONE,
  RATE_LIMIT_OTP_WINDOW_SECONDS,
  RATE_LIMIT_OTP_MAX_PER_IP,
  RATE_LIMIT_OTP_IP_WINDOW_SECONDS,
  RATE_LIMIT_VERIFY_MAX_PER_PHONE,
  RATE_LIMIT_VERIFY_WINDOW_SECONDS,
  RATE_LIMIT_VERIFY_MAX_PER_IP,
} from '../config/constants';

/**
 * Extracts and normalizes client IP address from standard proxy headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return cleanIp(first);
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length > 0) {
    return cleanIp(realIp.trim());
  }
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp.length > 0) {
    return cleanIp(cfIp.trim());
  }
  return cleanIp(req.socket?.remoteAddress || '127.0.0.1');
}

function cleanIp(ip: string): string {
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip === '::1' ? '127.0.0.1' : ip;
}

/**
 * Normalizes phone number by stripping formatting characters
 */
export function cleanPhone(phone: any): string {
  if (!phone) return '';
  return String(phone).replace(/[^0-9]/g, '');
}

/**
 * Rate Limiter for Sending OTP (/api/v1/auth/send-otp):
 * 1. IP-Based: Max 10 requests per 15 min per IP to prevent distributed spam
 * 2. Account-Based: Max 3 requests per 10 min per phone number to prevent SMS bombing
 * 3. 30s Cooldown: Prevents rapid-fire button spamming
 */
export async function sendOtpRateLimiter(req: Request, res: Response, next: NextFunction) {
  const phone = cleanPhone(req.body?.phone);
  const ip = getClientIp(req);

  // Bypass phone for Apple/Google Review and development testing
  if (phone && phone === BYPASS_PHONE) {
    return next();
  }

  // 1. Check IP-based rate limit
  const ipKey = `rl:otp:ip:${ip}`;
  const ipRequests = await cacheService.incr(ipKey, RATE_LIMIT_OTP_IP_WINDOW_SECONDS);
  const ipTtl = await cacheService.getTtl(ipKey);

  res.setHeader('X-RateLimit-IP-Limit', RATE_LIMIT_OTP_MAX_PER_IP);
  res.setHeader('X-RateLimit-IP-Remaining', Math.max(0, RATE_LIMIT_OTP_MAX_PER_IP - ipRequests));

  if (ipRequests > RATE_LIMIT_OTP_MAX_PER_IP) {
    const retryAfter = ipTtl > 0 ? ipTtl : RATE_LIMIT_OTP_IP_WINDOW_SECONDS;
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      success: false,
      error: `Too many OTP requests from this IP address. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      code: 'IP_RATE_LIMIT_EXCEEDED',
      scope: 'ip',
      retryAfter,
    });
  }

  // 2. Check Account-based rate limit if phone is supplied
  if (phone) {
    // 2a. Check 30-second cooldown
    const cooldownKey = `rl:otp:cooldown:${phone}`;
    const cooldownActive = await cacheService.get<boolean>(cooldownKey);
    if (cooldownActive) {
      const remainingCooldown = await cacheService.getTtl(cooldownKey);
      const retryAfter = remainingCooldown > 0 ? remainingCooldown : 30;
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: `Please wait ${retryAfter} seconds before requesting another OTP.`,
        code: 'OTP_COOLDOWN_ACTIVE',
        scope: 'account',
        retryAfter,
      });
    }

    // 2b. Check Account Window Limit (e.g. 3 attempts / 10 min)
    const accKey = `rl:otp:acc:${phone}`;
    const accRequests = await cacheService.incr(accKey, RATE_LIMIT_OTP_WINDOW_SECONDS);
    const accTtl = await cacheService.getTtl(accKey);

    res.setHeader('X-RateLimit-Account-Limit', RATE_LIMIT_OTP_MAX_PER_PHONE);
    res.setHeader('X-RateLimit-Account-Remaining', Math.max(0, RATE_LIMIT_OTP_MAX_PER_PHONE - accRequests));

    if (accRequests > RATE_LIMIT_OTP_MAX_PER_PHONE) {
      const retryAfter = accTtl > 0 ? accTtl : RATE_LIMIT_OTP_WINDOW_SECONDS;
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: `Too many OTP requests for this phone number. Please wait ${Math.ceil(retryAfter / 60)} minutes before trying again.`,
        code: 'ACCOUNT_RATE_LIMIT_EXCEEDED',
        scope: 'account',
        retryAfter,
      });
    }

    // Set 30-second cooldown
    await cacheService.set(cooldownKey, true, 30);
  }

  next();
}

/**
 * Rate Limiter for OTP Verification (/api/v1/auth/verify-otp):
 * 1. IP-Based: Max 25 attempts per 15 min per IP to prevent distributed guessing
 * 2. Account-Based Lockout: Max 5 failed OTP attempts per phone number.
 */
export async function verifyOtpRateLimiter(req: Request, res: Response, next: NextFunction) {
  const phone = cleanPhone(req.body?.phone);
  const ip = getClientIp(req);

  // Bypass phone for Apple/Google Review and development testing
  if (phone && phone === BYPASS_PHONE) {
    return next();
  }

  // 1. Check IP-based rate limit
  const ipKey = `rl:verify:ip:${ip}`;
  const ipRequests = await cacheService.incr(ipKey, RATE_LIMIT_VERIFY_WINDOW_SECONDS);
  const ipTtl = await cacheService.getTtl(ipKey);

  if (ipRequests > RATE_LIMIT_VERIFY_MAX_PER_IP) {
    const retryAfter = ipTtl > 0 ? ipTtl : RATE_LIMIT_VERIFY_WINDOW_SECONDS;
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      success: false,
      error: `Too many verification attempts from this IP address. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      code: 'IP_RATE_LIMIT_EXCEEDED',
      scope: 'ip',
      retryAfter,
    });
  }

  // 2. Check Account-based Lockout
  if (phone) {
    const lockKey = `rl:verify:lock:${phone}`;
    const isLocked = await cacheService.get<boolean>(lockKey);
    if (isLocked) {
      const remainingLock = await cacheService.getTtl(lockKey);
      const retryAfter = remainingLock > 0 ? remainingLock : RATE_LIMIT_VERIFY_WINDOW_SECONDS;
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: `Account temporarily locked due to repeated incorrect OTP attempts. Please wait ${Math.ceil(retryAfter / 60)} minutes or request a fresh OTP.`,
        code: 'ACCOUNT_TEMPORARILY_LOCKED',
        scope: 'account',
        retryAfter,
      });
    }
  }

  next();
}

/**
 * Records a failed OTP verification attempt for a phone number.
 * Locks the account for 15 minutes if failed attempts reach the threshold (5).
 */
export async function recordFailedOtpAttempt(phone: string): Promise<{ locked: boolean; remainingAttempts: number }> {
  const cleaned = cleanPhone(phone);
  if (!cleaned || cleaned === BYPASS_PHONE) return { locked: false, remainingAttempts: 5 };

  const failKey = `rl:verify:fail:${cleaned}`;
  const failCount = await cacheService.incr(failKey, RATE_LIMIT_VERIFY_WINDOW_SECONDS);

  if (failCount >= RATE_LIMIT_VERIFY_MAX_PER_PHONE) {
    const lockKey = `rl:verify:lock:${cleaned}`;
    await cacheService.set(lockKey, true, RATE_LIMIT_VERIFY_WINDOW_SECONDS);
    console.warn(`[Security Alert] Account ${cleaned} locked for 15 minutes after ${failCount} failed OTP attempts.`);
    return { locked: true, remainingAttempts: 0 };
  }

  return { locked: false, remainingAttempts: Math.max(0, RATE_LIMIT_VERIFY_MAX_PER_PHONE - failCount) };
}

/**
 * Clears failed verification count upon successful OTP verification.
 */
export async function clearOtpVerificationFailures(phone: string): Promise<void> {
  const cleaned = cleanPhone(phone);
  if (!cleaned) return;
  await cacheService.del(`rl:verify:fail:${cleaned}`);
  await cacheService.del(`rl:verify:lock:${cleaned}`);
}
