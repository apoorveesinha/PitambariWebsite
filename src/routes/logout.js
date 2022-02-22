const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const user = require("../models/userDetails");

router.use(express.json());

router.get("", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currElement) => {
      return currElement.token !== req.token;
    });

    res.clearCookie("jwt");
    console.log("Logged Out Successfully!");

    await req.user.save();
    res.status(200).render("index");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
