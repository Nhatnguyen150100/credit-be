"use strict";
import express from "express";
const otpRouter = express.Router();
import tokenMiddleware from "../middleware/tokenMiddleware";
import otpController from "../controllers/otpController";

otpRouter.get("/", tokenMiddleware.verifyTokenSuperAdmin, otpController.getOtp);

otpRouter.post(
  "/",
  tokenMiddleware.verifyTokenSuperAdmin,
  otpController.createOtp
);

otpRouter.post("/on-check-otp", otpController.onCheckOtp);

otpRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenSuperAdmin,
  otpController.updateOtp
);

otpRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenSuperAdmin,
  otpController.deleteOtp
);

export default otpRouter;
