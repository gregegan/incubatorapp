/**
 * Application configuration
 * Uses Next.js environment variables
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */
export const config = {
  serverUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000",
  env: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
} as const;

/**
 * Type-safe config access
 */
export type Config = typeof config;
