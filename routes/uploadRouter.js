const express = require("express");
const multer = require("multer");
const { getUpload, createFile } = require("../controllers/uploadController");
const { isAuthenticated } = require("../controllers/authController");

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/upload/:folderId", isAuthenticated, getUpload);
router.post("/upload", isAuthenticated, upload.single("file"), createFile);
module.exports = router;
