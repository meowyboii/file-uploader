const express = require("express");
const multer = require("multer");
const { getUpload, uploadFile } = require("../controllers/uploadController");
const { isAuthenticated } = require("../controllers/authController");

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/:folderName/upload", isAuthenticated, getUpload);
router.post("/upload", isAuthenticated, upload.single("file"), uploadFile);
module.exports = router;
