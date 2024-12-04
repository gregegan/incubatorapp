import { Request, Response } from "express";
import { logger } from "@/utils/logger";

/**
 * Handle user logout
 * 
 * @example
 * # Logout user and invalidate token
   curl -v -X GET http://localhost:4000/auth/logout \
    -H "Content-Type: application/json" \
    -b "incubatorapp=$incubatorapp_COOKIE"
 */
export const logoutHandler = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req?.user?.id;
  logger.info(`Logout initiated for user: ${userId}`);

  req.session.destroy((err) => {
    if (err) {
      logger.error('Session destruction failed:', { error: err, userId });
      return res.status(400).json({
        message: 'Logout failed',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    if (process.env.SESSION_COOKIE_NAME) {
      logger.debug(`Clearing cookie: ${process.env.SESSION_COOKIE_NAME}`);
      res.clearCookie(process.env.SESSION_COOKIE_NAME);
    }

    logger.info(`User ${userId} logged out successfully`);
    return res.status(200).json({
      message: "User logged out successfully"
    });
  });
};
