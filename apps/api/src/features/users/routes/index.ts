import express from "express";
import { validateAdminOrCronRequest } from "@/middleware/validateAdminOrCronRequest";
import { allUsersHandler } from "../controllers/allUsersHandler";

const userRouter = express.Router();

// Admin Only Routes
userRouter.get('/', 
  validateAdminOrCronRequest,
  allUsersHandler
);

export { userRouter };