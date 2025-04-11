const path = require("node:path");
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/uploadRouter");
const folderRouter = require("./routes/folderRouter");
const session = require("./config/session");
const passport = require("./config/passport");
const {
  setCurrentUser,
  setRootFolderId,
  errorHandler,
  allRouteHandler,
  setCurrentPath,
} = require("./config/middleware");

require("dotenv").config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: false }));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

//Current user middleware
app.use(setCurrentUser);

//Current path middleware
app.use(setCurrentPath);

//Root folder id middleware
app.use(setRootFolderId);

app.use(indexRouter);
app.use(authRouter);
app.use(folderRouter);
app.use(uploadRouter);

//Catch-all route middleware
app.use("*", allRouteHandler);

// Error handling middleware
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening at port " + PORT);
});
