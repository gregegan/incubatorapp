import { RequestHandler } from 'express';
import { Schema } from 'zod';
import { logger } from '@/utils/logger';
import { ApiError } from '@/utils/ApiError';

export const validateRequest = (schema: Schema): RequestHandler => {
  return (req, _res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      logger.warn('Request validation failed', {
        requestId: req.id,
        path: req.originalUrl || req.path,
        error: error instanceof Error ? error.message : String(error)
      });
      next(new ApiError('Invalid request data', 400));
    }
  };
};
