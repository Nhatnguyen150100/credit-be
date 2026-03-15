"use strict";
import express from "express";
import authController from "../controllers/auth/authController";
import tokenMiddleware from "../middleware/tokenMiddleware";
const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/supervisor/login", authController.supervisorLogin);
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

authRouter.put(
  "/change-password",
  tokenMiddleware.verifyTokenSuperAdmin,
  authController.changePassword
);

// ── SYSTEM_ADMIN management (only SUPER_ADMIN) ──────────────────────────────
authRouter.get(
  "/system-admins",
  tokenMiddleware.verifyTokenOnlySuperAdmin,
  authController.getAllSystemAdmin
);

authRouter.post(
  "/system-admins",
  tokenMiddleware.verifyTokenOnlySuperAdmin,
  authController.createSystemAdmin
);

authRouter.put(
  "/system-admins/:id",
  tokenMiddleware.verifyTokenOnlySuperAdmin,
  authController.updateSystemAdmin
);

authRouter.delete(
  "/system-admins/:id",
  tokenMiddleware.verifyTokenOnlySuperAdmin,
  authController.deleteSystemAdmin
);

authRouter.put(
  "/system-admins/:id/reset-password",
  tokenMiddleware.verifyTokenOnlySuperAdmin,
  authController.resetSystemAdminPassword
);

export default authRouter;
