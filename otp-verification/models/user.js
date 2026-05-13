const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, // this is required for verification
  otpExpiry: { type: Date }, // the time taken for the otp to expire
  isVerified: { type: Boolean, default: false }, // to check if the user's email is verified or not
});

const User = mongoose.model("User", userSchema);

module.exports = User;
