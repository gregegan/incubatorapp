import rateLimit from 'express-rate-limit';
import { logger } from '@/utils/logger';

export const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.originalUrl || req.path,
        requestId: req.id
      });
      res.status(429).json({
        error: 'Too many requests, please try again later'
      });
    }
  });
}; 