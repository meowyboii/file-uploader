const path = require("node:path");
const express = require("express");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: false }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening at port " + PORT);
});
