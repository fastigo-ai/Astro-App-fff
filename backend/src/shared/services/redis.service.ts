import Redis from 'ioredis';

interface CacheEntry {
  value: any;
  expiresAt: number;
}

class CacheService {
  private redisClient: Redis | null = null;
  private memoryCache = new Map<string, CacheEntry>();
  private isRedisConnected = false;

  constructor() {
    this.init();
  }

  private init() {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      try {
        console.log(`[CacheService] Attempting connection to Redis at ${redisUrl}...`);
        this.redisClient = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          connectTimeout: 3000,
          enableOfflineQueue: false,
        });

        this.redisClient.on('connect', () => {
          this.isRedisConnected = true;
          console.log('[CacheService] ✅ Successfully connected to Redis server');
        });

        this.redisClient.on('error', (err) => {
          this.isRedisConnected = false;
          console.warn('[CacheService] ⚠️ Redis connection error, using in-memory cache fallback:', err.message);
        });

        this.redisClient.connect().catch((err) => {
          this.isRedisConnected = false;
          console.warn('[CacheService] ⚠️ Initial Redis connection failed, falling back to memory cache.');
        });
      } catch (err: any) {
        this.isRedisConnected = false;
        console.warn('[CacheService] ⚠️ Redis initialization error, using in-memory fallback:', err.message);
      }
    } else {
      console.log('[CacheService] ℹ️ REDIS_URL not set in .env. Using built-in high-performance in-memory cache.');
    }
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
        console.warn(`[CacheService] Redis get error for key "${key}", checking memory cache fallback.`);
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
        console.warn(`[CacheService] Redis set error for key "${key}", caching in memory.`);
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

  isRedisActive(): boolean {
    return this.isRedisConnected;
  }

  clearMemoryCache() {
    this.memoryCache.clear();
  }
}

export const cacheService = new CacheService();

