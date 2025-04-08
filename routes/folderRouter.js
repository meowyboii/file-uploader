const express = require("express");
const { isAuthenticated } = require("../controllers/authController");
const { createFolder } = require("../controllers/folderController");

const router = express.Router();

router.post("/folder", isAuthenticated, createFolder);

module.exports = router;
