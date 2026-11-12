import { Request, Response, NextFunction } from 'express';

// In-Memory Token Bucket Rate Limiter (No external Redis required)
// Blazing fast (0ms latency), fail-safe, and zero background connection noise.
interface MemoryBucket {
  tokens: number;
  lastRefreshed: number;
}

const memoryBuckets = new Map<string, MemoryBucket>();

// Automatically purge stale IP/User buckets every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const [key, bucket] of memoryBuckets.entries()) {
    if (now - bucket.lastRefreshed > 300) {
      memoryBuckets.delete(key);
    }
  }
}, 300000);

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Identify client by user ID if logged in, or client IP
    const identifier = (req as any).user?.id || req.ip || req.headers['x-forwarded-for'] || 'global';
    const key = String(identifier);

    const MAX_TOKENS = 120; // 120 requests burst capacity
    const REFILL_RATE = 20; // 20 tokens per second
    const NOW = Math.floor(Date.now() / 1000);

    let bucket = memoryBuckets.get(key);

    if (!bucket) {
      bucket = { tokens: MAX_TOKENS, lastRefreshed: NOW };
      memoryBuckets.set(key, bucket);
    }

    // Refill tokens based on elapsed seconds
    const delta = Math.max(0, NOW - bucket.lastRefreshed);
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + delta * REFILL_RATE);
    bucket.lastRefreshed = NOW;

    res.setHeader('X-RateLimit-Limit', MAX_TOKENS);

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
      return next();
    }

    res.setHeader('X-RateLimit-Remaining', 0);
    return res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Please slow down and try again in a few seconds.',
      },
    });
  } catch (error) {
    // Fail-open: Never block legitimate requests on rate limiter error
    return next();
  }
};
