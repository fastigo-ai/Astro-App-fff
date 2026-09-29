import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

// Ensure you have REDIS_URL in your env
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Advanced Redis Token Bucket Rate Limiter
 * Inspired by Uber's distributed global rate limiting architecture.
 * Uses an atomic Lua script to prevent race conditions across multiple node instances.
 */
const TOKEN_BUCKET_SCRIPT = `
  local key = KEYS[1]
  local max_tokens = tonumber(ARGV[1])
  local refill_rate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  local requested = tonumber(ARGV[4])

  local bucket = redis.call('HMGET', key, 'tokens', 'last_update')
  local tokens = tonumber(bucket[1])
  local last_update = tonumber(bucket[2])

  if not tokens then
    tokens = max_tokens
    last_update = now
  else
    -- Calculate tokens to add based on elapsed time
    local elapsed = math.max(0, now - last_update)
    local tokens_to_add = math.floor(elapsed * refill_rate)
    
    if tokens_to_add > 0 then
      tokens = math.min(max_tokens, tokens + tokens_to_add)
      last_update = now
    end
  end

  if tokens >= requested then
    tokens = tokens - requested
    redis.call('HMSET', key, 'tokens', tokens, 'last_update', last_update)
    -- Set TTL to clean up old keys (e.g., 60 seconds)
    redis.call('EXPIRE', key, 60)
    return {1, tokens}
  else
    return {0, tokens}
  end
`;

// Define a command for ioredis
redis.defineCommand('rateLimit', {
  numberOfKeys: 1,
  lua: TOKEN_BUCKET_SCRIPT,
});

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
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
