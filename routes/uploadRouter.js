const express = require("express");
const multer = require("multer");
const { getUpload, uploadFile } = require("../controllers/uploadController");

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/upload", getUpload);
router.post("/upload", upload.single("file"), uploadFile);
module.exports = router;
