const express = require("express");
const { isAuthenticated } = require("../config/middleware");
const {
  createFolder,
  deleteFolder,
  renameFolder,
} = require("../controllers/folderController");

const router = express.Router();

router.post("/folder", isAuthenticated, createFolder);
router.delete("/folder/:folderId", isAuthenticated, deleteFolder);
router.post("/folder/:folderId", isAuthenticated, renameFolder);

module.exports = router;
