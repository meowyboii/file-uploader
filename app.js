const path = require("node:path");
const express = require("express");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/uploadRouter");
const folderRouter = require("./routes/folderRouter");
const session = require("./config/session");
const passport = require("./config/passport");
const { setCurrentUser } = require("./config/middleware");

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

app.use(authRouter);
app.use(folderRouter);
app.use(uploadRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening at port " + PORT);
});
