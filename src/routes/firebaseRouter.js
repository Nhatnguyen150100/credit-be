"use strict";
import express from "express";
const firebaseRouter = express.Router();
import tokenMiddleware from "../middleware/tokenMiddleware";
import firebaseController from "../controllers/firebaseController";

firebaseRouter.get("/", firebaseController.getFirebaseConfig);

firebaseRouter.post(
  "/",
  tokenMiddleware.verifyTokenSuperAdmin,
  firebaseController.setFirebaseConfig
);

export default firebaseRouter;
