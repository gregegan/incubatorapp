import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '@/config/schema';
import { createClient } from 'redis';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/incubatorapp'
});
export const db = drizzle(pool, { schema });

export const redisClient = createClient();
