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

module.exports = { isAuthenticated, setCurrentUser, setRootFolderId };
