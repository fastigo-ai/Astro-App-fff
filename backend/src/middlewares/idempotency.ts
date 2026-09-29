import { Request, Response, NextFunction } from 'express';
// import redis from '../utils/redis'; // Assuming ioredis setup

export const checkIdempotency = async (req: Request, res: Response, next: NextFunction) => {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return next(); // Skip if not provided, or throw error if strictly required for the route
  }

  try {
    // Example pseudocode:
    // const cachedResponse = await redis.get(`idempotency:${idempotencyKey}`);
    // if (cachedResponse) {
    //   return res.status(200).json(JSON.parse(cachedResponse));
    // }
    
    // Pass the key to the controller so it can cache the successful response later
    (req as any).idempotencyKey = idempotencyKey;
    next();
  } catch (error) {
    next(error);
  }
};
