import { ApiError } from "@/utils/ApiError";
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { logger } from "@/utils/logger";

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Global error handler', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    path: req.originalUrl || req.path,
    method: req.method,
  });

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};

export default errorHandler;
