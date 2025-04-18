const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const passport = require("../config/passport");
const bcrypt = require("bcryptjs");
const { createRootFolder, getRootFolderId } = require("./folderController");

const prisma = new PrismaClient();

const getSignUp = (req, res, next) => {
  res.status(200).render("sign-up", { errors: null });
};

const getLogin = (req, res, next) => {
  res.status(200).render("log-in", { failureMessage: null });
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
  try {
    const errors = validationResult(req);
    const errorArray = errors.array();

    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      errorArray.push({ msg: "Username already taken" });
    }

    if (errorArray.length > 0) {
      return res.status(400).render("sign-up", { errors: errorArray });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const rootFolder = await createRootFolder(newUser.username, newUser.id);

    req.login(newUser, (err) => {
      if (err) {
        return next(new CustomError("Login failed", 500));
      }
      return res.redirect(`/upload/${rootFolder.id}`);
    });
  } catch (error) {
    return next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("log-in", {
        failureMessage: info?.message || "Invalid login credentials",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      (async () => {
        try {
          // Redirect user to the root folder
          const rootFolderId = await getRootFolderId(user.id);
          req.session.rootFolderId = rootFolderId;
          return res.redirect(`/upload/${rootFolderId}`);
        } catch (error) {
          return next(error);
        }
      })();
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // Destroy session data
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      // Clear the session cookie
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: false,
        sameSite: "strict", // Prevents cross-site requests
        path: "/",
      });

      // Redirect to the login page
      res.redirect("/log-in");
    });
  });
};

module.exports = {
  getSignUp,
  getLogin,
  createUser,
  validateUser,
  login,
  logout,
};
