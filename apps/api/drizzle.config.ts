import { defineConfig } from 'drizzle-kit';
 
export default defineConfig({
  schema: './src/config/schema',
  out: './src/config/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'incubatorapp',
    ssl: false
  },
  verbose: true,
  strict: true
});