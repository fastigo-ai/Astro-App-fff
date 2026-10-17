import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

// Lua script for atomic Token Bucket in Redis (if Redis is connected)
const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local last_refreshed = tonumber(redis.call('HGET', key, 'last_refreshed')) or now
local tokens = tonumber(redis.call('HGET', key, 'tokens')) or capacity

local delta = math.max(0, now - last_refreshed)
tokens = math.min(capacity, tokens + (delta * refill_rate))

if tokens >= requested then
    tokens = tokens - requested
    redis.call('HMSET', key, 'tokens', tokens, 'last_refreshed', now)
    redis.call('EXPIRE', key, 60)
    return {1, math.floor(tokens)}
else
    return {0, math.floor(tokens)}
end
`;

// In-Memory Token Bucket fallback (works 100% when Redis is not connected)
interface MemoryBucket {
  tokens: number;
  lastRefreshed: number;
}
const memoryBuckets = new Map<string, MemoryBucket>();

// Clean up stale memory buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of memoryBuckets.entries()) {
    if (now - bucket.lastRefreshed > 120000) {
      memoryBuckets.delete(key);
    }
  }
}, 300000);

let redis: Redis | null = null;
let isRedisConnected = false;

// Only attempt Redis connection if REDIS_URL is explicitly set and non-empty
if (process.env.REDIS_URL && process.env.REDIS_URL.trim() !== '') {
  try {
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: false,
      retryStrategy: (times) => (times > 2 ? null : Math.min(times * 300, 1000)),
    });

    client.on('error', (err) => {
      // Gracefully log warning without crashing the process
      if (isRedisConnected) {
        console.warn('[Redis] Connection lost, falling back to in-memory rate limiting:', err.message);
      }
      isRedisConnected = false;
    });

    client.on('connect', () => {
      console.log('✅ [Redis] Connected successfully for distributed rate limiting');
      isRedisConnected = true;
    });

    // Try connecting non-blockingly
    client.connect().catch((err) => {
      console.log('ℹ️ [Redis] Not connected (' + err.message + '). Using robust in-memory rate limiter.');
      isRedisConnected = false;
    });

    try {
      client.defineCommand('rateLimit', {
        numberOfKeys: 1,
        lua: TOKEN_BUCKET_SCRIPT,
      });
    } catch (_) {}

    redis = client;
  } catch (e) {
    console.log('ℹ️ [Redis] Initialization skipped. Using in-memory fallback.');
    redis = null;
    isRedisConnected = false;
  }
} else {
  console.log('ℹ️ [Redis] REDIS_URL not configured. Operating smoothly with in-memory token bucket.');
}

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const identifier = (req as any).user?.id || req.ip || 'global';
  const MAX_TOKENS = 120; // 120 requests burst capacity
  const REFILL_RATE = 20; // 20 tokens per second
  const NOW = Math.floor(Date.now() / 1000);

  // 1. If Redis is connected, use distributed atomic Token Bucket
  if (redis && isRedisConnected) {
    try {
      // @ts-ignore
      const [allowed, remainingTokens] = await redis.rateLimit(
        `rate_limit:${identifier}`,
        MAX_TOKENS,
        REFILL_RATE,
        NOW,
        1
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
            message: 'Rate limit exceeded. Please slow down and try again shortly.',
          },
        });
      }
    } catch (err) {
      // If Redis call fails, fall through to in-memory fallback
      isRedisConnected = false;
    }
  }

  // 2. In-Memory Token Bucket Fallback
  const key = String(identifier);
  let bucket = memoryBuckets.get(key);

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefreshed: NOW };
    memoryBuckets.set(key, bucket);
  }

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
      message: 'Rate limit exceeded. Please try again in a few seconds.',
    },
  });
};
