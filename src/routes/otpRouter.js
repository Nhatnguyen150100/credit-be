"use strict";
import express from "express";
const otpRouter = express.Router();
import tokenMiddleware from "../middleware/tokenMiddleware";
import otpController from "../controllers/otpController";

otpRouter.get(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  otpController.getOtp
);

otpRouter.post(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  otpController.createOtp
);


otpRouter.post(
  "/on-check-otp",
  otpController.onCheckOtp
);

otpRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  otpController.updateOtp
);

otpRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  otpController.deleteOtp
);

otpRouter.post(
  "/send-otp",
  otpController.sendOtp
);

otpRouter.post(
  "/verify-otp",
  otpController.verifyOtp
);

otpRouter.post(
  "/reset-otp",
  otpController.resetOtp
);

export default otpRouter;