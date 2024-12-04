import { db } from '@/config';
import { notifications } from '@/config/schema/notifications';
import { ApiError } from '@/utils/ApiError';
import type { RequestHandler } from 'express';
import { NotificationType } from '../types';
import { logger } from '@/utils/logger';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

/**
 * Creates a new notification for a user
 * @param data Notification data including userId, type, title, and message
 * @returns The created notification
 */
export async function createNotification(data: CreateNotificationData, requestId: string) {
  logger.info('Creating new notification', { 
    userId: data.userId,
    type: data.type,
    title: data.title,
    requestId 
  });

  try {
    logger.debug('Inserting notification into database', { 
      userId: data.userId,
      type: data.type,
      requestId 
    });

    const [newNotification] = await db.insert(notifications).values({
      ...data,
      read: false,
    }).returning();

    if (!newNotification) {
      logger.warn('No notification created', { 
        userId: data.userId,
        type: data.type,
        requestId 
      });
      throw new ApiError('Failed to create notification', 500);
    }

    logger.info('Notification created successfully', {
      notificationId: newNotification.id,
      userId: newNotification.userId,
      type: newNotification.type,
      requestId
    });

    return newNotification;
  } catch (error) {
    logger.error('Failed to create notification', {
      userId: data.userId,
      type: data.type,
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to create notification', 500);
  }
}

export const createNotificationHandler: RequestHandler<
  unknown,
  unknown,
  CreateNotificationData
> = async (req, res, next) => {
  logger.debug('Handling notification creation request', {
    requestBody: req.body,
    requestId: req.id
  });

  try {
    const notification = await createNotification(req.body, req.id);
    
    logger.info('Notification creation completed', {
      notificationId: notification.id,
      userId: notification.userId,
      type: notification.type,
      requestId: req.id
    });

    res.json(notification);
  } catch (error) {
    logger.error('Notification creation handler error', {
      requestId: req.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    next(error);
  }
};