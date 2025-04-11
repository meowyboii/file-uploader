const { NotFoundError } = require("./error");

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

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).render("error", {
    message: err.message || "Internal server error",
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
  errorHandler,
  allRouteHandler,
};
