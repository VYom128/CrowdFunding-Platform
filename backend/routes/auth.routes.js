import express from "express";

import {
  register,
  login,
  sendOtp,
  verifyOtp,
  refreshToken,
  logout,
  getMe,
} from "../controllers/authController.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Authentication
router.post("/register", register);

router.post("/login", login);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);

// OTP
router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

// Current user
router.get("/me", protect, getMe);

export default router;