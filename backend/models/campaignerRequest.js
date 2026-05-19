import mongoose from "mongoose";

const campaignerRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignerType: {
      type: String,
      required: [true, "Campaigner type is required"],
      enum: ["Individual", "NGO/Nonprofit", "Company", "School/College", "Community Group", "Other"],
    },
    publicDisplayName: {
      type: String,
      required: [true, "Public display name is required"],
      trim: true,
    },
    campaignerReason: {
      type: String,
      required: [true, "Campaigner reason is required"],
      trim: true,
    },
    verificationDocumentUrl: {
      type: String,
      required: [true, "Verification document is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

campaignerRequestSchema.index({ userId: 1, status: 1 });

const CampaignerRequest = mongoose.model("CampaignerRequest", campaignerRequestSchema);
export default CampaignerRequest;