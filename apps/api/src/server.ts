import { config } from "dotenv";
import express, { Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import helmet from "helmet";
import RedisStore from "connect-redis";

import { authRouter } from "@/features/auth/routes";
import { userRouter } from "@/features/users/routes";
import { notificationRouter } from "@/features/notifications/routes";
import { logger } from "@/utils/logger";
import { createRateLimiter } from "@/middleware/rateLimit";
import { requestIdMiddleware } from "@/middleware/requestId";
import { metricsMiddleware } from "@/utils/metrics";
import { redisClient } from "@/config";
import errorHandler from "./middleware/errorHandler";

config();

async function main(): Promise<void> {
  const app = express();
  app.set("trust proxy", 1);

  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "auth:",
    disableTouch: true,
  });

  redisClient.on("error", (error: Error) => {
    logger.error(error.message);
  });
  redisClient.on("connect", function () {
    console.log(
      `Redis connected at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    );
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        const origins = String(process.env.CORS_ORIGIN).split(",");
        if (!origin || origins.includes(String(origin))) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed."), false);
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === "production" ? undefined : false,
    })
  );

  if (process.env.NODE_ENV === 'production') {
    app.use(createRateLimiter(30 * 60 * 1000, 200)); // 200 requests per 30 minutes
  }
  app.use(requestIdMiddleware);
  app.use(metricsMiddleware);
  
  app.use(
    express.json({
      limit: "20mb",
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME,
      secret: String(process.env.SESSION_SECRET),
      store: redisStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: Number(process.env.SESSION_MAX_AGE),
        sameSite: "lax",
      },
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Welcome" });
  });

  app.use("/auth", authRouter);
  app.use('/users', userRouter);
  app.use('/notifications', notificationRouter);

  app.use(errorHandler);

  app.use((req: Request, res: Response) => {
    logger.warn(`No route matched for ${req.method} ${req.url}`);
    res.status(404).json({ 
      error: 'Not Found',
      message: `No route matched for ${req.method} ${req.url}`
    });
  });
  
  app.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at ${process.env.SCHEME}://${process.env.HOST}:${process.env.PORT}`
    );
  });
}

main().catch((error) => {
  logger.error(error.message);
});
