import bcrypt from "bcryptjs";

import Otp from "../models/Otp.js";
import generateOtp from "../utils/generateOtp.js";



export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Prevent OTP spam
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      return res.status(429).json({
        success: false,
        message: "OTP already sent. Please wait 5 minutes.",
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP
    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // TEMPORARY ONLY
    console.log("OTP:", otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({ email }).select("+otp");

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {

      await Otp.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(
      otp,
      otpRecord.otp
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Delete OTP after success
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};