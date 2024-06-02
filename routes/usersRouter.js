import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getUserByToken,
  userAvatar,
  userEmail,
} from "../controllers/usersControllers.js";

import { validateBody } from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/usersSchemas.js";

import authCheck from "../middleware/auth.js";
import uploadMiddleware from "../middleware/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);
usersRouter.post("/login", validateBody(loginSchema), loginUser);
usersRouter.post("/logout", authCheck, logoutUser);
usersRouter.get("/current", authCheck, getUserByToken);
usersRouter.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  authCheck,
  userAvatar
);
usersRouter.get("/verify/:verificationToken", userEmail);

export default usersRouter;
