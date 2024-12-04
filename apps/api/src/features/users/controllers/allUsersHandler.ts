import { eq } from 'drizzle-orm';
import { db } from '@/config';
import { users } from '@/config/schema/users';
import { ApiError } from '@/utils/ApiError';
import { RequestHandler } from 'express';
import { CustomSessionData } from '@/features/auth/types';

/**
 * Get user details by ID
 */
async function getUsers() {
    try {
      const allUsers = await db.query.users.findMany();
  
      // Filter out sensitive information from all users
      const sanitizedUsers = allUsers.map(user => {
        const { passwordHash, ...userDetails } = user;
        return userDetails;
      });
      
      return sanitizedUsers;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch user details', 500);
    }
}

export const allUsersHandler: RequestHandler = async (req, res, next) => {
    try {
    const users = await getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };