import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import driverRoutes from "./routes/driver.routes";
import customerRoutes from "./routes/customer.routes";
import jobRoutes from "./routes/jobs.routes";
import applicationRoutes from "./routes/applications.routes";
import ratingRoutes from "./routes/ratings.routes";
import notificationRoutes from "./routes/notifications.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",").map((u) => u.trim())
      : "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check for Render
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

export default app;
