import { db } from '@/config';
import { notifications } from '@/config/schema';
import { and, eq } from 'drizzle-orm';
import { RequestHandler } from 'express';
import { logger } from '@/utils/logger';
import { CustomSessionData } from '@/features/auth/types';

/**
 * Get user notifications
 * 
 * @example
 * # Get user notifications
 curl -X GET http://localhost:4000/notifications/unread \
  -H "Content-Type: application/json" \
  -b "incubatorapp=$incubatorapp_COOKIE"
*/
export async function getUnreadUserNotifications(userId: string) {
  try {
    logger.debug('Fetching unread user notifications', { userId });

    return await db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ),
      orderBy: (notifications, { desc }) => [
        desc(notifications.createdAt)
      ],
    });
  } catch (error) {
    logger.error('Failed to fetch unread notifications', {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new Error('Failed to fetch unread notifications');
  }
}

export const getUnreadNotificationsHandler: RequestHandler = async (req, res, next) => {
  try {
    const session: CustomSessionData = req.session;
    const sessionId: string | undefined = session.userId;
    // @ts-ignore
    const userId = req?.user?.id || sessionId;
    
    const userNotifications = await getUnreadUserNotifications(userId);
    res.json(userNotifications);
  } catch (error) {
    next(error);
  }
};