import multer from "multer";
import path, { join } from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { user_id } = req.body;
    const { id } = req.params;
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "user_id_img",
      user_id ?? id ?? "anonymous"
    );
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    const { user_id } = req.body;
    const { id } = req.params;
    const extension = path.extname(file.originalname);
    let customName;
    if (file.fieldname === "frontEndImg") {
      customName = `front_end`;
    } else if (file.fieldname === "backEndImg") {
      customName = `back_end`;
    } else {
      return cb(new Error("Unknown field"));
    }
    const filePath = `${customName}${extension}`;
    req[`${customName}_user_id_img`] = `${
      process.env.BASE_URL_SERVER
    }/user_id_img/${user_id ?? id}/${filePath}`;
    cb(null, filePath);
  },
});

const limits = { fileSize: 5 * 1024 * 1024 };

const uploadStorage = multer({ storage, limits });

export default uploadStorage;
