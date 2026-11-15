import 'dotenv/config';
import Redis from 'ioredis';

interface CacheEntry {
  value: any;
  expiresAt: number;
}

class CacheService {
  private redisClient: Redis | null = null;
  private memoryCache = new Map<string, CacheEntry>();
  private isRedisConnected = false;
  private connectionPromise: Promise<boolean> | null = null;

  constructor() {
    this.init();
  }

  private init() {
    const redisUrl = process.env.REDIS_URL?.trim();

    if (redisUrl) {
      try {
        let maskedHost = 'Redis Server';
        try {
          const parsed = new URL(redisUrl);
          maskedHost = `${parsed.hostname}:${parsed.port || '6379'}`;
        } catch {}

        this.redisClient = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          connectTimeout: 5000,
          enableOfflineQueue: false,
          retryStrategy(times) {
            if (times > 3) return null; // Stop retrying after 3 attempts
            return Math.min(times * 300, 1000);
          },
        });

        this.redisClient.on('connect', () => {
          this.isRedisConnected = true;
        });

        this.redisClient.on('ready', () => {
          this.isRedisConnected = true;
          console.log(`[Redis] ✅ Connected & Ready at ${maskedHost}`);
        });

        this.redisClient.on('error', (err: any) => {
          this.isRedisConnected = false;
          // Only log once or on change to avoid console spam
          console.warn(`[Redis] ⚠️ Redis error (${err.code || err.message}). In-memory cache is active.`);
        });

        this.redisClient.on('close', () => {
          this.isRedisConnected = false;
        });
      } catch (err: any) {
        this.isRedisConnected = false;
        console.warn('[Redis] ⚠️ Redis client init failed, using in-memory cache:', err.message);
      }
    }
  }

  async ensureConnection(): Promise<boolean> {
    const redisUrl = process.env.REDIS_URL?.trim();
    if (!redisUrl || !this.redisClient) {
      console.log('[Redis] ℹ️ REDIS_URL not configured. Using high-performance in-memory cache.');
      return false;
    }

    if (this.isRedisConnected) return true;

    if (!this.connectionPromise) {
      this.connectionPromise = (async () => {
        try {
          await this.redisClient!.connect();
          this.isRedisConnected = true;
          return true;
        } catch (err: any) {
          this.isRedisConnected = false;
          console.warn(`[Redis] ⚠️ Could not connect to Redis (${err.message}). Using in-memory fallback.`);
          return false;
        } finally {
          this.connectionPromise = null;
        }
      })();
    }

    return this.connectionPromise;
  }

  async get<T>(key: string): Promise<T | null> {
    // 1. Try Redis if connected
    if (this.isRedisConnected && this.redisClient) {
      try {
        const raw = await this.redisClient.get(key);
        if (raw) {
          return JSON.parse(raw) as T;
        }
        return null;
      } catch (err) {
        // Fall through to memory cache
      }
    }

    // 2. In-memory cache fallback
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set(key: string, value: any, ttlSeconds = 86400): Promise<void> {
    const jsonStr = JSON.stringify(value);

    // 1. Try Redis if connected
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.set(key, jsonStr, 'EX', ttlSeconds);
        return;
      } catch (err) {
        // Fall through to memory cache
      }
    }

    // 2. In-memory cache fallback
    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err) {}
    }
    this.memoryCache.delete(key);
  }

  /**
   * Atomic increment for rate-limiting.
   * Increments key value and sets expiry if key was newly created.
   * Returns current count.
   */
  async incr(key: string, ttlSeconds = 60): Promise<number> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        const count = await this.redisClient.incr(key);
        if (count === 1) {
          await this.redisClient.expire(key, ttlSeconds);
        }
        return count;
      } catch (err) {
        // Fall through to in-memory fallback
      }
    }

    const now = Date.now();
    const entry = this.memoryCache.get(key);
    if (!entry || now > entry.expiresAt) {
      this.memoryCache.set(key, {
        value: 1,
        expiresAt: now + ttlSeconds * 1000,
      });
      return 1;
    }

    const newCount = (Number(entry.value) || 0) + 1;
    entry.value = newCount;
    return newCount;
  }

  /**
   * Get remaining TTL in seconds for a key
   */
  async getTtl(key: string): Promise<number> {
    if (this.isRedisConnected && this.redisClient) {
      try {
        const ttl = await this.redisClient.ttl(key);
        if (ttl > 0) return ttl;
      } catch (err) {}
    }

    const entry = this.memoryCache.get(key);
    if (!entry) return -2;
    const diff = Math.ceil((entry.expiresAt - Date.now()) / 1000);
    return diff > 0 ? diff : -2;
  }

  isRedisActive(): boolean {
    return this.isRedisConnected;
  }

  clearMemoryCache() {
    this.memoryCache.clear();
  }
}

export const cacheService = new CacheService();
