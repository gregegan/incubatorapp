import express from "express";
import { validateAuthenticatedRequest } from '@/middleware/validateAuthenticatedRequest';
import { createNotificationHandler } from "../controllers/createNotificationHandler";
import { getUserNotificationsHandler } from "../controllers/getUserNotificationsHandler";
import { markAllNotificationsReadHandler } from "../controllers/markAllNotificationsReadHandler";
import { validateAdminOrCronRequest } from "@/middleware/validateAdminOrCronRequest";
import { getUnreadNotificationsHandler } from "../controllers/getUnreadUserNotificationsHandler";

const notificationRouter = express.Router();

// Admin Only Routes
notificationRouter.post('', validateAdminOrCronRequest, createNotificationHandler);

// Authenticated User Routes
notificationRouter.get('', validateAuthenticatedRequest, getUserNotificationsHandler);
notificationRouter.get('/unread', validateAuthenticatedRequest, getUnreadNotificationsHandler);
notificationRouter.patch('/read-all', validateAuthenticatedRequest, markAllNotificationsReadHandler);

export { notificationRouter };