import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notifications = pgTable('notifications', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    type: text('type', { enum: ['signup'] }).notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    read: boolean('read').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  });