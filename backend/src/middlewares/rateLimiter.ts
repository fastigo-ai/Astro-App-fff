import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

// Only connect to Redis if REDIS_URL is explicitly provided
let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000)),
      enableOfflineQueue: false,
    });

    redis.on('error', (err) => {
      console.warn('[Redis] Cache disconnected, falling back gracefully:', err.message);
    });

    redis.defineCommand('rateLimit', {
      numberOfKeys: 1,
      lua: TOKEN_BUCKET_SCRIPT,
    });
  } catch (e) {
    console.warn('[Redis] Initialization skipped:', e);
    redis = null;
  }
}

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  if (!redis) {
    return next(); // Fail open if Redis is not configured
  }
  try {
    // Identify user by IP or User ID if authenticated
    const identifier = (req as any).user?.id || req.ip || 'global';
    const key = `rate_limit:${identifier}`;

    const MAX_TOKENS = 100; // Bucket capacity (burst allowance)
    const REFILL_RATE = 10; // Tokens per second
    const NOW = Math.floor(Date.now() / 1000);
    const REQUESTED = 1;

    // Execute atomic Lua script
    // @ts-ignore (custom command)
    const [allowed, remainingTokens] = await redis.rateLimit(
      key, 
      MAX_TOKENS, 
      REFILL_RATE, 
      NOW, 
      REQUESTED
    );

    res.setHeader('X-RateLimit-Limit', MAX_TOKENS);
    res.setHeader('X-RateLimit-Remaining', remainingTokens);

    if (allowed === 1) {
      return next();
    } else {
      return res.status(429).json({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded. Please try again later.',
        },
        requestId: req.headers['x-request-id'] || 'unknown',
      });
    }
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    // Fail open in case Redis goes down, so users aren't blocked
    next(); 
  }
};
