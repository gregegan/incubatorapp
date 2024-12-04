import { users } from "@/config/schema";

declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: typeof users.$inferSelect;
    }
  }
}

export {};
