const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const auth = require("../middleware/auth");

router.use(express.json());
router.use(cookieParser());

router.get("", auth, (req, res) => {
  res.render("profile");
  //console.log(`This is the COOKIE: ${req.cookies.jwt}`);
});

router.post("", auth, (req, res) => {
  res.json({ status: "OK" });
});

module.exports = router;
