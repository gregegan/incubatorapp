import { RequestHandler } from 'express';
import { logger } from '@/utils/logger';
import { users } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/config';
import { CustomSessionData } from '@/features/auth/types';

/**
 * Middleware that validates requests from either:
 * 1. Vercel Cron jobs (using CRON_SECRET)
 * 2. Admin users (using session)
 * 
 * Used to protect admin/system endpoints that can be triggered
 * either automatically by cron or manually by admins.
 */
export const validateAdminOrCronRequest: RequestHandler = async (req, _res, next) => {
  const startTime = Date.now();
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  const session: CustomSessionData = req.session;
  const sessionId: string | undefined = session.userId;
  // @ts-ignore
  const userId = req?.user?.id || sessionId;

  try {
    logger.debug('Starting admin/cron validation', {
      requestId: req.id,
      path: req.originalUrl || req.path,
      method: req.method,
      hasCronAuth: !!authHeader,
      sessionId,
      userId
    });

    // First check: Cron secret validation
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      logger.info('Request authorized via cron secret', {
        requestId: req.id,
        path: req.originalUrl || req.path
      });
      return next();
    }

    // Second check: Admin user validation
    if (!sessionId && !userId) {
      logger.warn('No active session or user ID found', {
        requestId: req.id,
        headers: req.headers
      });
      throw new ApiError("Authentication required", 401);
    }

    // Validate session if present
    if (session) {
      const remainingTime = session.cookie.maxAge || 0;
      if (remainingTime <= 0) {
        logger.warn('Session expired', {
          requestId: req.id,
          sessionId,
          userId,
          remainingTime
        });
        throw new ApiError("Session has expired.", 401);
      }
    }

    // Fetch and validate user
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.id, sessionId || userId))
      .then((rows) => rows[0]);

    if (!user) {
      logger.warn('User not found in database', {
        requestId: req.id,
        sessionId,
        userId,
        duration: Date.now() - startTime
      });
      throw new ApiError("User not found", 404);
    }

    if (!user.isAdmin) {
      logger.warn('Non-admin user attempted admin action', {
        requestId: req.id,
        userId: user.id,
        username: user.username,
        duration: Date.now() - startTime
      });
      throw new ApiError("Admin access required", 403);
    }

    logger.info('Request authorized via admin user', {
      requestId: req.id,
      userId: user.id,
      username: user.username,
      duration: Date.now() - startTime
    });

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof ApiError) {
      logger.warn('Admin/Cron validation failed with ApiError', {
        requestId: req.id,
        sessionId,
        userId,
        message: error.message,
        duration
      });
      next(error)
    }

    logger.error('Unexpected admin/cron validation error', {
      requestId: req.id,
      sessionId,
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration
    });

    next(error)
  }
}; 