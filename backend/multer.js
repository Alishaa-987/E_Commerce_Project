const multer = require("multer");
const fs = require("fs");
const path = require("path");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const target = path.join("uploads", folder);
      ensureDir(target);
      cb(null, target);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const base = file.originalname.split(".")[0];
      cb(null, `${base}-${uniqueSuffix}.png`);
    },
  });

const upload = multer({ storage: makeStorage("") }); // default root uploads
const uploadSeller = multer({ storage: makeStorage("sellers") });

module.exports = { upload, uploadSeller };
