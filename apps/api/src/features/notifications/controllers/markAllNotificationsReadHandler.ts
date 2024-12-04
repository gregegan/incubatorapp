import { eq } from 'drizzle-orm';
import { db } from '@/config';
import { notifications } from '@/config/schema/notifications';
import { ApiError } from '@/utils/ApiError';
import { RequestHandler } from 'express';
import { logger } from '@/utils/logger';
import { CustomSessionData } from '@/features/auth/types';

/**
 * Marks all notifications for a user as read
 * @param userId The user's ID
 */
async function markAllNotificationsRead(userId: string, requestId?: string) {
    try {
      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.userId, userId));
      
      logger.info('All notifications marked as read', { requestId, userId });
      return { success: true };
    } catch (error: unknown) {
      logger.error('Failed to mark all notifications as read', { 
        requestId, 
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw new ApiError('Failed to mark all notifications as read', 500);
    }
}
  
export const markAllNotificationsReadHandler: RequestHandler = async (req, res, next) => {
    try {
      const session: CustomSessionData = req.session;
      const sessionId: string | undefined = session.userId;
      // @ts-ignore
      const userId = req?.user?.id || sessionId;
      
      const result = await markAllNotificationsRead(userId, req.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
};