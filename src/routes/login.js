const express = require("express");
const router = express.Router();
const User = require("../models/userDetails");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

router.use(express.json());
router.use(cookieParser());

router.get("", (req, res) => {
  res.render("login");
});

router.post("", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({
      status: "error",
      error: "!User Invalid Username/Password",
    });
  }
  //console.log(user);
  //console.log("Username: ", username, " Password: ", password);
  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({
      status: "error",
      error: "Password doesn't match.",
    });
  }

  const token = await user.generateAuthToken();
  //console.log(`Login Token is: ${token}`);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 600000),
    httpOnly: true,
  });

  console.log("Login Successful");
  return res.json({
    status: "OK",
    message: "Welcome! Login Successful",
    //data: token,
  });
});

module.exports = router;
