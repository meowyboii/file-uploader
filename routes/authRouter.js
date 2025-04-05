const express = require("express");
const {
  getSignUp,
  createUser,
  validateUser,
  getLogin,
  login,
} = require("../controllers/authController");
const router = express.Router();

router.get("/sign-up", getSignUp);
router.post("/sign-up", validateUser, createUser);

router.get("/log-in", getLogin);
router.post("/log-in", login);

module.exports = router;
