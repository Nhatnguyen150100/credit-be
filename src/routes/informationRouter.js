"use strict";
import express from "express";
const informationRouter = express.Router();
import tokenMiddleware from "../middleware/tokenMiddleware";
import informationController from "../controllers/informationController";
import uploadStorage from "../config/multer";

informationRouter.get(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  informationController.getAllInformation
);

informationRouter.get("/:id", informationController.getInformation);

informationRouter.post("/check", informationController.checkUserExits);

informationRouter.post("/check-v2", informationController.checkUserExitsV2);

informationRouter.post(
  "/",
  tokenMiddleware.verifyTokenAdminCreate,
  uploadStorage.fields([
    { name: "userTakeIdImg", maxCount: 1 },
    { name: "frontEndImg", maxCount: 1 },
    // { name: "backEndImg", maxCount: 1 },
  ]),
  informationController.saveInformation
);

informationRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenAdminUpdate,
  uploadStorage.fields([
    { name: "userTakeIdImg", maxCount: 1 },
    { name: "frontEndImg", maxCount: 1 },
    // { name: "backEndImg", maxCount: 1 },
  ]),
  informationController.updateInformation
);

informationRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdminDelete,
  informationController.deleteInformation
);

informationRouter.post(
  "/delete-multi",
  tokenMiddleware.verifyTokenAdminDelete,
  informationController.deleteMultiInfo
);

informationRouter.post(
  "/update-multi-info",
  tokenMiddleware.verifyTokenAdminUpdate,
  informationController.updateStatusMultiInfo
);

informationRouter.post(
  "/assignee-information",
  tokenMiddleware.verifyTokenSuperAdmin,
  informationController.assigneeInformation
);

export default informationRouter;
