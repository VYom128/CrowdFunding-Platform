import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  createOrder,
  confirmDonation,
  getUserDonations,
  getDonationById,
} from "../controllers/donationController.js";

const router = express.Router();

// Create a new donation order
router.post("/create-order", protect, createOrder);

// Confirm payment
router.post("/confirm", protect, confirmDonation);

// Get donation by ID
router.get("/:donationId", protect, getDonationById);

// Get user donations
router.get("/", protect, getUserDonations);

export default router;