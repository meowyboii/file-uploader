const express = require("express");
const {
  getSignUp,
  createUser,
  validateUser,
} = require("../controllers/authController");
const router = express.Router();

router.get("/sign-up", getSignUp);
router.post("/sign-up", validateUser, createUser);

module.exports = router;
