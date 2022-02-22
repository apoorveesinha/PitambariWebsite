const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//CREATE USER SCHEMA
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  emailID: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

//Generate Tokens
userSchema.methods.generateAuthToken = async function () {
  try {
    //console.log(this._id);
    const token = jwt.sign(
      {
        _id: this._id,
        username: this.username,
      },
      process.env.JWT_SECRETKEY
    );
    this.tokens = this.tokens.concat({ token: token });
    //console.log(`Token: ${token}`);
    await this.save();
    return token;
  } catch (error) {
    console.log(`Error: ${this.error}`);
    //return res.json({})
  }
};

//Converting password into hash
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`Current Password: ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`Current Password: ${this.password}`);
  }
  next();
});

const RegisterUserDetails = new mongoose.model("SchemaOfUser", userSchema);
module.exports = RegisterUserDetails;
