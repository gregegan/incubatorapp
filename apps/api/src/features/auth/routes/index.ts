import express from "express";

import { validate } from "@/features/auth/middlewares/validate";
import { signupSchema } from "@/features/auth/validation/signup";
import { loginSchema } from "@/features/auth/validation/login";

import { logoutHandler } from "@/features/auth/controllers/logoutHandler";
import { meHandler } from "@/features/auth/controllers/meHandler";
import { signupHandler } from "@/features/auth/controllers/signupHandler";
import { loginHandler } from "@/features/auth/controllers/loginHandler";

const authRouter = express.Router();

// @ts-ignore
authRouter.post("/signup", validate(signupSchema), signupHandler);
// @ts-ignore
authRouter.post("/login", validate(loginSchema), loginHandler);
authRouter.get("/logout", logoutHandler);
// @ts-ignore
authRouter.get("/me", meHandler);

export { authRouter };
