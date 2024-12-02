"use strict";
import express from "express";
import authController from "../controllers/auth/authController";
const authUserRouter = express.Router();

authUserRouter.post("/login-user", authController.loginUser);

export default authUserRouter;
