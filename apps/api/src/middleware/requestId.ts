import { RequestHandler } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request type to include id
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const requestIdMiddleware: RequestHandler = (req, _res, next) => {
  req.id = randomUUID();
  next();
}; 