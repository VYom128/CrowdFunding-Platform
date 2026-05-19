import CampaignerRequest from "../models/CampaignerRequest.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// POST /api/campaigner/apply
export const applyAsCampaigner = async (req, res, next) => {
  try {
    const { campaignerType, publicDisplayName, campaignerReason } = req.body;

    if (!campaignerType || !publicDisplayName || !campaignerReason) {
      return res.status(400).json({ message: "Campaigner type, public display name, and reason are required" });
    }
    if (req.user.role !== "donor") {
      return res.status(400).json({ message: "Only donors can apply as campaigners" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Verification document is required" });
    }

    // Prevent duplicate pending request
    const existing = await CampaignerRequest.findOne({
      userId: req.user._id,
      status: "pending",
    });
    if (existing) {
      return res.status(409).json({ message: "You already have a pending application" });
    }

    const verificationDocumentUrl = await uploadToCloudinary(req.file.buffer, "pawrescue/documents");

    const request = await CampaignerRequest.create({
      userId: req.user._id,
      campaignerType,
      publicDisplayName,
      campaignerReason,
      verificationDocumentUrl,
      status: "pending",
    });

    return res.status(201).json({
      message: "Application submitted. Please wait for admin review.",
      request,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/campaigner/status
export const getCampaignerStatus = async (req, res, next) => {
  try {
    const request = await CampaignerRequest.findOne({ userId: req.user._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (!request) {
      return res.status(200).json({ status: "not_applied", request: null });
    }

    return res.status(200).json({ status: request.status, request });
  } catch (error) {
    next(error);
  }
};