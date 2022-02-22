const jwt = require("jsonwebtoken");
const RegisterUserDetails = require("../models/userDetails");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.JWT_SECRETKEY);
    console.log(verifyUser);
    const user = await RegisterUserDetails.findOne({ _id: verifyUser._id });
    console.log(user);
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", error: "Not a valid user" });
  }
};

module.exports = auth;
