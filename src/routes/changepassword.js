const express = require("express");
const router = express.Router();
const User = require("../models/userDetails");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.use(express.json());

router.get("", auth, (req, res) => {
  res.render("changePassword");
});

router.post("", auth, async (req, res) => {
  //console.log(req.body);

  const { token, newpassword: plainTextPassword, cnewpassword } = req.body;

  //console.log("New Password: ", plainTextPassword, "C N P: ", cnewpassword);

  if (plainTextPassword !== cnewpassword) {
    return res.json({ status: "error", error: "Passwords do not match" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({
      status: "error",
      error: "Invalid password, password can only be string",
    });
  }

  if (plainTextPassword.length < 2) {
    return res.json({
      status: "error",
      error: "Password is less than 2 characters",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRETKEY);
    console.log("JWT decoded:", user);

    const _id = user.id;
    const hashedNewPassword = await bcrypt.hash(plainTextPassword, 10);

    await User.updateOne(
      { _id },
      {
        $set: { password: hashedNewPassword },
      }
    );
    res.json({ status: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: ";))" });
  }
});

module.exports = router;
