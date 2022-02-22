const express = require("express");
const router = express.Router();
const User = require("../models/userDetails");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

router.use(express.json());
router.use(cookieParser());
//router.use(express.urlencoded({ extended: false }));

router.get("", (req, res) => {
  res.render("register");
});

router.post("", async (req, res) => {
  try {
    console.log(req.body);
    const {
      firstname,
      lastname,
      username,
      emailID,
      gender,
      age,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    const alreadyUser = await User.findOne({ username }).lean();
    const alreadyRegisteredEmail = await User.findOne({ emailID }).lean();
    const alreadyRegisteredPhoneNumber = await User.findOne({
      phoneNumber,
    }).lean();

    if (alreadyUser) {
      return res.json({ status: "error", error: "Username already exists" });
    }

    if (alreadyRegisteredEmail) {
      return res.json({ status: "error", error: "Email already registered" });
    }

    if (alreadyRegisteredPhoneNumber) {
      return res.json({
        status: "error",
        error: "Phone Number already Registered",
      });
    }

    if (!username || typeof username !== "string") {
      return res.json({ status: "error", error: "Invalid username" });
    }

    if (!password || typeof password !== "string") {
      return res.json({
        status: "error",
        error: "Invalid password, password can only be string",
      });
    }

    if (password.length < 8) {
      return res.json({
        status: "error",
        error: "Password is less than 8 characters",
      });
    }

    if (password !== confirmPassword) {
      console.log(
        "confirmPassword: ",
        confirmPassword,
        "  password: ",
        password
      );
      return res.json({
        status: "error",
        error: "Passwords do not match!",
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    const registerUser = new User({
      firstname,
      lastname,
      username,
      emailID,
      gender,
      age,
      phoneNumber,
      password,
      //password: hashedPassword,
    });

    const token = await registerUser.generateAuthToken();
    console.log(`The token is: ${token}`);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 300000),
      httpOnly: true,
    });

    const result = await registerUser.save();
    console.log("User Created Succesfully");
  } catch (error) {
    return res.json({
      status: "error",
      error: "Can't Register due to error. Retry",
    });
    throw error;
  }
  res.json({ status: "OK" });
});

module.exports = router;
