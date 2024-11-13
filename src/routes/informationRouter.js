"use-strict";
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

informationRouter.post(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  uploadStorage.fields([
    { name: "userTakeIdImg", maxCount: 1 },
    { name: "frontEndImg", maxCount: 1 },
    // { name: "backEndImg", maxCount: 1 },
  ]),
  informationController.saveInformation
);

informationRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  uploadStorage.fields([
    { name: "userTakeIdImg", maxCount: 1 },
    { name: "frontEndImg", maxCount: 1 },
    // { name: "backEndImg", maxCount: 1 },
  ]),
  informationController.updateInformation
);

informationRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  informationController.deleteInformation
);

informationRouter.post(
  "/delete-multi",
  tokenMiddleware.verifyTokenAdmin,
  informationController.deleteMultiInfo
);


// informationRouter.post("/update-multi-info", tokenMiddleware.verifyTokenAdmin, informationController.updateStatusMultiInfo);

export default informationRouter;

