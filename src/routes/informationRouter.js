"use strict";
import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const informationRouter = express.Router();
import tokenMiddleware from "../middleware/tokenMiddleware";
import informationController from "../controllers/informationController";
import uploadStorage from "../config/multer";

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "tmp"));
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.csv`);
  },
});

const csvUpload = multer({
  storage: csvStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.originalname.endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file CSV"));
    }
  },
});

informationRouter.get(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  informationController.getAllInformation
);

informationRouter.get(
  "/export-csv",
  tokenMiddleware.verifyTokenAdmin,
  informationController.exportCsv
);

informationRouter.get(
  "/import-jobs",
  tokenMiddleware.verifyTokenSuperAdmin,
  informationController.getImportJobs
);

informationRouter.get(
  "/import-jobs/:jobId",
  tokenMiddleware.verifyTokenAdmin,
  informationController.getImportJobStatus
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
  ]),
  informationController.saveInformation
);

informationRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenAdminUpdate,
  uploadStorage.fields([
    { name: "userTakeIdImg", maxCount: 1 },
    { name: "frontEndImg", maxCount: 1 },
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

informationRouter.post(
  "/import-csv",
  // tokenMiddleware.verifyTokenAdminCreate,
  csvUpload.single("file"),
  informationController.importCsv
);

export default informationRouter;
