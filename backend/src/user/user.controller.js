import UserModel from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendmail.js";
import { otpTemplate } from "../utils/otp.template.js";
import { generateOTP } from "../utils/generateotp.js";
import { forgotPasswordTemplate } from "../utils/forgot-template.js";

export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const user = new UserModel(data);
    await user.save();

    // generate and send OTP immediately upon signup
    const otp = generateOTP();
    otpStore[user.email] = otp;
    const htmlBody = otpTemplate(otp);
    await sendMail(user.email, "OTP for signup", htmlBody);

    res
      .status(201)
      .json({ message: "User created successfully", user, otpSent: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// in-memory store for OTPs (for demonstration only)
const otpStore = {};

export const sendEmail = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    email = email.toLowerCase().trim();

    // check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // any email address is permitted; simple presence validation above
    // generate a 6‑digit OTP using the shared helper
    const otp = generateOTP();
    otpStore[email] = otp; // in production store in database/cache with expiry

    // pass the OTP into our HTML template
    const htmlBody = otpTemplate(otp);
    await sendMail(email, "OTP for signup", htmlBody);
    res.json({ message: "OTP sent successfully", otp });
  } catch (err) {
    console.error("sendEmail error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const createToken = async (user) => {
  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  };

  const token = await jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isLoggedIn = await bcrypt.compare(password, user.password);
    if (!isLoggedIn)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = await createToken(user);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT !== "DEV",
      sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
      path: "/",
      domain: undefined,
    });

    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const token = await jwt.sign(
      { id: user._id },
      process.env.FORGOT_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const link = `${process.env.DOMAIN}/forgot-password?token=${token}`;
    const sent = await sendMail(
      email,
      "Expense - Forgot Password",
      forgotPasswordTemplate(user.fullname, link),
    );

    if (!sent) {
      return res.status(424).json({ message: "Email sending failed!" });
    }

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    email = email.toLowerCase().trim();

    // check if OTP matches the stored OTP for this email
    const storedOTP = otpStore[email];
    if (!storedOTP) {
      return res.status(400).json({
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    if (storedOTP !== otp.toString()) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // OTP is valid; delete it from store
    delete otpStore[email];
    res.json({ message: "OTP verified successfully", verified: true });
  } catch (err) {
    console.error("verifyOTP error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const signupWithOTP = async (req, res) => {
  try {
    let { email, otp, ...userData } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    email = email.toLowerCase().trim();

    // verify OTP first
    const storedOTP = otpStore[email];
    if (!storedOTP) {
      return res.status(400).json({
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    if (storedOTP !== otp.toString()) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // delete used OTP
    delete otpStore[email];

    // create user with provided data and email
    const user = new UserModel({ ...userData, email });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("signupWithOTP error", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    res.json("Verification successful");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    const encrypted = await bcrypt.hash(password.toString(), 12);

    await UserModel.findByIdAndUpdate(req.user.id, { password: encrypted });

    res.json("Password updated successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.ENVIRONMENT !== "DEV",
      sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
      path: "/",
    });
    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
