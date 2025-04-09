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

module.exports = { isAuthenticated, setCurrentUser };
