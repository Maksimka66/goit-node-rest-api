import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserByToken,
} from "../controllers/usersControllers.js";
import { validateBody } from "../helpers/validateBody.js";
import { loginSchema, registerSchema } from "../schemas/usersSchemas.js";
import authCheck from "../auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), registerUser);
usersRouter.post("/login", validateBody(loginSchema), loginUser);
usersRouter.post("/logout", authCheck, logoutUser);
usersRouter.get("/current", authCheck, getUserByToken);

export default usersRouter;
