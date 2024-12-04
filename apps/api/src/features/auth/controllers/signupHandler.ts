import { Request, Response } from "express";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/config"; 
import { users } from "@/config/schema/users";
import { CustomSessionData } from "@/features/auth/types";
import { createNotification } from "@/features/notifications/controllers/createNotificationHandler";

/**
 * Handle user signup
 * 
 * @example
 * # Create new user account
   curl -X POST http://localhost:4000/auth/signup \
    -H "Content-Type: application/json" \
    -b "incubatorapp=$incubatorapp_COOKIE" \
    -d '{
      "username": "john_doe",
      "email": "john@example.com",
      "password": "securePassword123",
      "confirmPassword": "securePassword123"
    }'
 */

export const signupHandler = async (req: Request, res: Response) => {
  const userDetails = req.body;

  const hashedPasword = await argon2.hash(userDetails.password);

  const userId = uuidv4();

  const [user] = await db
    .insert(users)
    .values({
      id: userId,
      username: userDetails.username,
      email: userDetails.email,
      passwordHash: hashedPasword,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      createdAt: users.createdAt,
    });

  (req.session as CustomSessionData).userId = String(user.id);

  createNotification({
    userId: user.id,
    type: 'signup',
    title: 'Welcome to incubatorapp!',
    message: 'You have successfully created an account.',
  }, req.id);

  return res.status(200).json(user);
};
