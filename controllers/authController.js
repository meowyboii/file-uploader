const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const getSignUp = async (req, res, next) => {
  res.status(200).render("sign-up", { errors: null });
};

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 }) // set max length
    .withMessage("Username must be between 3 and 30 characters")
    .escape(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm Password must match the Password"),
];

const createUser = async (req, res, next) => {
  let errors = validationResult(req).array();
  const { username, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      errors.push({ msg: "Username already taken" });
    }
    if (errors.length > 0) {
      return res.status(400).render("sign-up", { errors: errors });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created", userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { getSignUp, createUser, validateUser };
