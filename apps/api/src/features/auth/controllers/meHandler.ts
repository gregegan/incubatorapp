import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { CustomSessionData } from "@/features/auth/types";
import { db } from "@/config";
import { users } from "@/config/schema/users";

/**
 * Get current user profile
 * 
 * @example
 * # Get authenticated user profile
   curl -X GET http://localhost:4000/auth/me \
    -H "Content-Type: application/json" \
    -b "incubatorapp=$incubatorapp_COOKIE" \
 */
export const meHandler = async (req: Request, res: Response) => {
  const session: CustomSessionData = req.session;
  const sessionId: string | undefined = session.userId;
  // @ts-ignore
  const userId = req?.user?.id || sessionId;

  if (!sessionId && !userId) {
    return res.json({ message: "User already logged out." }).status(400);
  }

  const remainingTime = session.cookie.maxAge || 0;

  if (remainingTime <= 0) {
    return res.json({ message: "Session has expired." }).status(401);
  }

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

  return res.status(200).json(user);
};
