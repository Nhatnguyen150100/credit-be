"use strict";
import express from "express";
const bankRouter = express.Router();
import tokenMiddleware from "../middleware/tokenMiddleware";
import bankController from "../controllers/bankController";
import multer from "multer";
import path, { join } from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "..", "public", "bank");
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const customName = "qr_code_img";
    const filePath = `${customName}${extension}`;
    req[`${customName}`] = `${process.env.BASE_URL_SERVER}/bank/${filePath}`;
    cb(null, filePath);
  },
});

const limits = { fileSize: 5 * 1024 * 1024 };

const upload = multer({ storage, limits });

bankRouter.get("/", bankController.getAllBank);

bankRouter.post(
  "/",
  tokenMiddleware.verifyTokenSuperAdmin,
  upload.single("qrCodeImg"),
  bankController.createBank
);

bankRouter.put(
  "/:id",
  tokenMiddleware.verifyTokenSuperAdmin,
  upload.single("qrCodeImg"),
  bankController.updateBank
);

bankRouter.delete(
  "/:id",
  tokenMiddleware.verifyTokenSuperAdmin,
  bankController.deleteBank
);

export default bankRouter;
