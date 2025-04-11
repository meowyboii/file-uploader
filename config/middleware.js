const { CustomError, NotFoundError } = require("./error");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
};

const setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

const setRootFolderId = (req, res, next) => {
  res.locals.rootFolderId = req.session.rootFolderId || null;
  next();
};

const setCurrentPath = (req, res, next) => {
  res.locals.currentPath = req.path;
  next();
};

const errorHandler = (err, req, res, next) => {
  const isCustomError = err instanceof CustomError;
  res.status(err.statusCode || 500).render("error", {
    message: isCustomError ? err.message : "Internal Server Error",
    statusCode: err.statusCode || 500,
  });
};

const allRouteHandler = (req, res, next) => {
  return next(new NotFoundError(`Cannot find ${req.originalUrl}`));
};

module.exports = {
  isAuthenticated,
  setCurrentUser,
  setRootFolderId,
  setCurrentPath,
  errorHandler,
  allRouteHandler,
};
