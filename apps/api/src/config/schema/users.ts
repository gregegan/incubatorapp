import { pgTable, uuid, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

/**
 * Users Table
 * Core user management system for authentication, points tracking, and administrative control
 * 
 * @property id - Unique identifier for the user (UUID v4)
 * @property username - User's unique display name for public identification
 * @property email - User's unique email address for account management
 * @property passwordHash - Securely hashed user password using bcrypt
 * @property createdAt - Timestamp when the user account was created
 * @property updatedAt - Timestamp of the last account modification
 * @property isAdmin - Boolean flag indicating administrative privileges
 */

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  isAdmin: boolean('is_admin').notNull().default(false),
});