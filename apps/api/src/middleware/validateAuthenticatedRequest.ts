import { RequestHandler } from 'express';
import { ApiError } from '@/utils/ApiError';
import { logger } from '@/utils/logger';
import { db } from '@/config';
import { users } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { CustomSessionData } from '@/features/auth/types';

/**
 * Middleware that validates requests from authenticated users
 * Used for operations that require a valid user but no special permissions
 */
export const validateAuthenticatedRequest: RequestHandler = async (req, res, next) => {
  const startTime = Date.now();
  const session: CustomSessionData = req.session;
  const sessionId: string | undefined = session.userId;
  // @ts-ignore
  const userId = req?.user?.id || sessionId;

  try {
    logger.debug('Starting authentication validation', {
      requestId: req.id,
      path: req.originalUrl || req.path,
      method: req.method,
      sessionId,
      userId
    });

    // Check for active session or user ID
    if (!sessionId && !userId) {
      logger.warn('No active session or user ID found', {
        requestId: req.id,
        headers: req.headers
      });
      throw new ApiError("User already logged out.", 400);
    }

    // Validate session expiration
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

    // Fetch user from database
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, sessionId || userId))
      .then((rows) => rows[0]);

    // Validate user exists
    if (!user) {
      logger.warn('User not found in database', {
        requestId: req.id,
        sessionId,
        userId,
        duration: Date.now() - startTime
      });
      throw new ApiError("User not found.", 404);
    }

    logger.debug('User authentication successful', {
      requestId: req.id,
      userId: user.id,
      username: user.username,
      duration: Date.now() - startTime
    });

    // Attach user to request
    req.user = user;

    // Log session details
    logger.debug('Session details', {
      requestId: req.id,
      remainingTime,
      sessionAge: session.cookie.originalMaxAge,
      isSecure: session.cookie.secure,
      path: session.cookie.path
    });

    next();
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof ApiError) {
      logger.warn('Authentication failed with ApiError', {
        requestId: req.id,
        sessionId,
        userId,
        message: error.message,
        duration
      });
    } else {
      logger.error('Unexpected authentication error', {
        requestId: req.id,
        sessionId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        duration
      });
    }


    next(error)
  }
}; 