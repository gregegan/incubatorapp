import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import { db } from "@/config";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { CustomSessionData } from "@/features/auth/types";
import { logger } from "@/utils/logger";
import { ApiError } from "@/utils/ApiError";

/**
 * Handle user login
 * 
 * @example
 * # Login with credentials
 export EMAIL="admin@admin.com"
 export PASSWORD="password"
 curl -v -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d "{
      \"email\": \"$EMAIL\",
      \"password\": \"$PASSWORD\"
  }"
*/
export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { email, password } = req.body;

  try {
    logger.debug('Login attempt started', {
      requestId: req.id,
      email,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        passwordHash: users.passwordHash,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.email, email))
      .then((rows) => rows[0]);

    if (!user) {
      logger.warn('Login failed - User not found', {
        requestId: req.id,
        email,
        duration: Date.now() - startTime
      });
      throw new ApiError('Invalid email or password', 401);
    }

    const validPassword = await argon2.verify(user.passwordHash, password);

    if (!validPassword) {
      logger.warn('Login failed - Invalid password', {
        requestId: req.id,
        userId: user.id,
        email,
        duration: Date.now() - startTime
      });
      throw new ApiError('Invalid email or password', 401);
    }

    // Set session
    (req.session as CustomSessionData).userId = String(user.id);

    logger.info('Login successful', {
      requestId: req.id,
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      duration: Date.now() - startTime
    });

    // Remove sensitive data
    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    logger.error('Login error', {
      requestId: req.id,
      email,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: Date.now() - startTime
    });

    next(error);
  }
};
