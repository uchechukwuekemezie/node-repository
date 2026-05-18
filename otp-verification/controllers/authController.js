const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// The email transporter configuration using the nodemailer package to send emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uvalentine54@gmail.com",
    pass: "ggtfbwbkcowplvte",
  },
});

// function to generate a random 6-digit otp
const generateOTP = () => randomInt(100000, 999999).toString();

// to register a user and send the otp to the email provided by the user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // otp expires in 10 minutes

    user = new User({ name, email, password, otp, otpExpiry });
    await user.save();

    await transporter.sendMail({
      from: "uvalentine54@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}, expires in 10 minutes.`,
    });

    res.status(200).json({
      message: "User registered successfully, Verification OTP sent to email",
    });
  } catch (error) {
    res.staus(500).json({ message: "error registering user", error });
  }
};

// to verify the otp sent to the user's email
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      message: "OTP verified successfully, proceeding to load user dashboard",
    });
  } catch (error) {
    res.status(500).json({ message: "error verifying OTP", error });
  }
};

// to resend the otp if the previous otp has expired or if the user did not receive the otp
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // otp expires in 10 minutes
    await user.save();

    await transporter.sendMail({
      from: "uvalentine54@gmail.com",
      to: email,
      subject: "Resend OTP",
      text: `Your new OTP is ${otp}, expires in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP", error });
  }
};

// to login the user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "User not verified, please verify your email" });

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified. Please verify OTP " });
    }

    request.session.user = { id: user._id, name: user.name, email: user.email };
    res.json({ message: "Login successful." });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// logout the user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });
    res.json({ message: "logout successful" });
  });
};

// dashboard route to load the user dashboard after successful login(protected route)
exports.dashboard = (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.session.user.name}` });
};
