require("dotenv").config(); //ALWAYS WRITE AT THE VERY START
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const auth = require("../src/middleware/auth");

require("./database/conn");

const port = process.env.PORT || 3000;

//console.log(__dirname)
//console.log(path.join(__dirname, "../public"))

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(template_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

//app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// console.log(process.env.JWT_SECRETKEY);

app.get("/", (req, res) => {
  res.render("index");
});

//CREATING ROUTER
const homeRouter = require("./routes/home");
app.use("/api/home", homeRouter);

const registerRouter = require("./routes/register");
app.use("/api/register", registerRouter);

const loginRouter = require("./routes/login");
app.use("/api/login", loginRouter);

const profileRouter = require("./routes/profile");
app.use("/api/profile", profileRouter);

const changePasswordRouter = require("./routes/changepassword");
app.use("/api/changepassword", changePasswordRouter);

const logoutRouter = require("./routes/logout");
app.use("/api/logout", logoutRouter);

app.listen(port, () => {
  console.log(`Server is running at PORT Number ${port}`); //Don't use "" OR '' here
});
