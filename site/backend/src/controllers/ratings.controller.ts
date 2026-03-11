import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Rating from "../models/rating.model";
import Job from "../models/job.model";
import DriverProfile from "../models/driverProfile.model";
import CustomerProfile from "../models/customerProfile.model";
import { successResponse, errorResponse } from "../utils/response.utils";

// Create a rating for a completed job
export const createRating = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const raterId = req.user!.userId;
    const { jobId, rateeId, rateeRole, drivingSkill, professionalBehavior, punctuality, review } =
      req.body;

    // Validate required fields
    if (!jobId || !rateeId || !rateeRole || !drivingSkill || !professionalBehavior || !punctuality) {
      errorResponse(res, "Missing required fields", 400);
      return;
    }

    if (!["driver", "customer"].includes(rateeRole)) {
      errorResponse(res, "rateeRole must be 'driver' or 'customer'", 400);
      return;
    }

    // Validate star ranges
    for (const val of [drivingSkill, professionalBehavior, punctuality]) {
      if (typeof val !== "number" || val < 1 || val > 5) {
        errorResponse(res, "Ratings must be numbers between 1 and 5", 400);
        return;
      }
    }

    // Verify the job exists and is completed
    const job = await Job.findById(jobId);
    if (!job) {
      errorResponse(res, "Job not found", 404);
      return;
    }
    if (job.status !== "completed") {
      errorResponse(res, "Ratings can only be submitted for completed jobs", 400);
      return;
    }

    // Verify rater is a participant in this job
    const customerId = job.customerId.toString();
    const driverId = job.acceptedDriverId?.toString();
    if (raterId !== customerId && raterId !== driverId) {
      errorResponse(res, "You are not a participant of this job", 403);
      return;
    }

    // Verify ratee is the other participant
    if (rateeId !== customerId && rateeId !== driverId) {
      errorResponse(res, "Ratee is not a participant of this job", 400);
      return;
    }

    // Cannot rate yourself
    if (raterId === rateeId) {
      errorResponse(res, "You cannot rate yourself", 400);
      return;
    }

    // Check for duplicate rating (compound unique index also enforces this)
    const existing = await Rating.findOne({ jobId, raterId });
    if (existing) {
      errorResponse(res, "You have already rated for this job", 409);
      return;
    }

    const rating = await Rating.create({
      jobId,
      raterId,
      rateeId,
      rateeRole,
      drivingSkill,
      professionalBehavior,
      punctuality,
      review: review?.trim() || null,
    });

    // Recalculate average rating on the ratee's profile
    const allRatings = await Rating.find({ rateeId });
    const avgRating =
      allRatings.length > 0
        ? Math.round(
            (allRatings.reduce((sum, r) => sum + r.overallRating, 0) / allRatings.length) * 10
          ) / 10
        : 0;

    if (rateeRole === "driver") {
      await DriverProfile.findOneAndUpdate({ userId: rateeId }, { averageRating: avgRating });
    } else {
      await CustomerProfile.findOneAndUpdate({ userId: rateeId }, { averageRating: avgRating });
    }

    successResponse(res, { rating }, "Rating submitted successfully", 201);
  } catch {
    errorResponse(res, "Failed to create rating");
  }
};

// Get all ratings for a driver
export const getDriverRatings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { driverId } = req.params;

    const ratings = await Rating.find({ rateeId: driverId, rateeRole: "driver" })
      .populate("raterId", "fullName")
      .sort({ createdAt: -1 });

    successResponse(res, { ratings }, "Driver ratings fetched");
  } catch {
    errorResponse(res, "Failed to fetch driver ratings");
  }
};

// Get ratings the current user has submitted (to check which jobs are already rated)
export const getMySubmittedRatings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const raterId = req.user!.userId;
    const ratings = await Rating.find({ raterId }).select("jobId");
    const ratedJobIds = ratings.map((r) => r.jobId.toString());
    successResponse(res, { ratedJobIds }, "Submitted ratings fetched");
  } catch {
    errorResponse(res, "Failed to fetch submitted ratings");
  }
};
