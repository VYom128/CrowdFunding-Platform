import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Routes
import authRoutes from "./routes/auth.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import userRoutes from "./routes/users.routes.js";
import campaignerRoutes from "./routes/campaigner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

// Middleware
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();



// Secure HTTP headers
app.use(helmet());

// Logging middleware
app.use(morgan("dev"));

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);



app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());


app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "PawRescue API Running",
  });
});

// Auth routes with rate limiting
app.use("/api/v1/auth", authLimiter, authRoutes);

app.use("/api/v1/campaigns", campaignRoutes);

app.use("/api/v1/donations", donationRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/campaigner", campaignerRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/notifications", notificationRoutes);


app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});



app.use(errorMiddleware);

export default app;