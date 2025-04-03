"use strict";
import express from "express";
import authController from "../controllers/auth/authController";
import tokenMiddleware from "../middleware/tokenMiddleware";
const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post(
  "/create-user",
  tokenMiddleware.verifyTokenSuperAdmin,
  authController.register
);

authRouter.get(
  "/",
  tokenMiddleware.verifyTokenSuperAdmin,
  authController.getAllUserAdmin
);

authRouter.delete(
  "/delete-user/:id",
  tokenMiddleware.verifyTokenSuperAdmin,
  authController.deleteUser
);

authRouter.put(
  "/update-user/:id",
  tokenMiddleware.verifyTokenSuperAdmin,
  authController.updateUser
);

export default authRouter;
