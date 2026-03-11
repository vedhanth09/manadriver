import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Application from "../models/application.model";
import Job from "../models/job.model";
import DriverProfile from "../models/driverProfile.model";
import User from "../models/user.model";
import { createNotification } from "../services/notification.service";
import { successResponse, errorResponse } from "../utils/response.utils";

// Driver applies to a job
export const applyToJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobId } = req.body;
    const driverId = req.user!.userId;

    if (!jobId) {
      errorResponse(res, "jobId is required", 400);
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      errorResponse(res, "Job not found", 404);
      return;
    }

    if (job.status !== "posted" && job.status !== "applied") {
      errorResponse(res, "Job is no longer accepting applications", 400);
      return;
    }

    // Check duplicate (compound index will also catch this, but better UX message)
    const existing = await Application.findOne({ jobId, driverId });
    if (existing) {
      errorResponse(res, "You have already applied to this job", 409);
      return;
    }

    const application = await Application.create({
      jobId,
      driverId,
      appliedAt: new Date(),
      status: "pending",
    });

    // Update job status to "applied" if it was "posted"
    if (job.status === "posted") {
      job.status = "applied";
      await job.save();
    }

    // Create notification for the customer
    const driver = await User.findById(driverId);
    await createNotification(
      job.customerId,
      "driver_applied",
      `${driver?.fullName || "A driver"} applied to your ${job.jobType} job in ${job.city}`,
      job._id
    );

    successResponse(res, { application }, "Application submitted successfully", 201);
  } catch {
    errorResponse(res, "Failed to apply to job");
  }
};

// Driver views their own applications
export const getDriverApplications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const driverId = req.user!.userId;

    const applications = await Application.find({ driverId })
      .populate({
        path: "jobId",
        populate: { path: "customerId", select: "fullName email phone" },
      })
      .sort({ appliedAt: -1 });

    successResponse(res, { applications }, "Applications retrieved successfully");
  } catch {
    errorResponse(res, "Failed to fetch applications");
  }
};

// Customer views applicants for their job — sorted by appliedAt ASC, ties by higher rating
export const getJobApplicants = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const customerId = req.user!.userId;

    // Verify the job belongs to this customer
    const job = await Job.findById(jobId);
    if (!job) {
      errorResponse(res, "Job not found", 404);
      return;
    }
    if (job.customerId.toString() !== customerId) {
      errorResponse(res, "Not authorized to view applicants for this job", 403);
      return;
    }

    // Customer-side filter params
    const { minRating, experienceLevel } = req.query;

    const applications = await Application.find({ jobId })
      .populate("driverId", "fullName email phone")
      .sort({ appliedAt: 1 });

    // Enrich with driver profile data and sort by appliedAt ASC, ties by higher rating
    let enriched = await Promise.all(
      applications.map(async (app) => {
        const profile = await DriverProfile.findOne({ userId: app.driverId });
        return {
          _id: app._id,
          jobId: app.jobId,
          driverId: app.driverId,
          appliedAt: app.appliedAt,
          status: app.status,
          driverResponse: app.driverResponse,
          driverProfile: profile
            ? {
                age: profile.age,
                city: profile.city,
                areas: profile.areas,
                transmissionTypes: profile.transmissionTypes,
                vehicleCategories: profile.vehicleCategories,
                isVerified: profile.isVerified,
                averageRating: profile.averageRating,
                totalJobsCompleted: profile.totalJobsCompleted,
              }
            : null,
        };
      })
    );

    // Filter by minimum rating
    if (minRating) {
      const minR = Number(minRating);
      enriched = enriched.filter(
        (a) => (a.driverProfile?.averageRating || 0) >= minR
      );
    }

    // Filter by experience level (based on totalJobsCompleted)
    if (experienceLevel) {
      enriched = enriched.filter((a) => {
        const completed = a.driverProfile?.totalJobsCompleted || 0;
        switch (experienceLevel) {
          case "beginner":
            return completed < 10;
          case "intermediate":
            return completed >= 10 && completed < 50;
          case "experienced":
            return completed >= 50;
          default:
            return true;
        }
      });
    }

    // Sort: first-applied first, ties broken by higher rating
    enriched.sort((a, b) => {
      const timeA = new Date(a.appliedAt).getTime();
      const timeB = new Date(b.appliedAt).getTime();
      if (timeA !== timeB) return timeA - timeB;
      const ratingA = a.driverProfile?.averageRating || 0;
      const ratingB = b.driverProfile?.averageRating || 0;
      return ratingB - ratingA; // higher rating first on tie
    });

    successResponse(res, { applicants: enriched }, "Applicants retrieved successfully");
  } catch {
    errorResponse(res, "Failed to fetch applicants");
  }
};

// Customer hires a driver / Driver accepts or declines
export const updateApplication = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "hire" | "accept" | "decline"
    const userId = req.user!.userId;
    const role = req.user!.role;

    if (!action || !["hire", "accept", "decline"].includes(action)) {
      errorResponse(res, "Invalid action. Must be hire, accept, or decline", 400);
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      errorResponse(res, "Application not found", 404);
      return;
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      errorResponse(res, "Related job not found", 404);
      return;
    }

    // === CUSTOMER hires a driver ===
    if (action === "hire") {
      if (role !== "customer") {
        errorResponse(res, "Only customers can hire", 403);
        return;
      }
      if (job.customerId.toString() !== userId) {
        errorResponse(res, "Not authorized to hire for this job", 403);
        return;
      }
      if (application.status !== "pending") {
        errorResponse(res, "Can only hire from pending applications", 400);
        return;
      }

      // 1. Approve this application
      application.status = "approved";
      application.driverResponse = "pending";
      await application.save();

      // 2. Reject all other pending applications for this job
      const otherApps = await Application.find({
        jobId: job._id,
        _id: { $ne: application._id },
        status: "pending",
      });

      await Application.updateMany(
        { jobId: job._id, _id: { $ne: application._id }, status: "pending" },
        { $set: { status: "rejected" } }
      );

      // 3. Auto-withdraw all other pending applications by this driver for other jobs
      await Application.updateMany(
        {
          driverId: application.driverId,
          _id: { $ne: application._id },
          status: "pending",
        },
        { $set: { status: "withdrawn" } }
      );

      // 4. Update job
      job.acceptedDriverId = application.driverId;
      job.status = "accepted";
      await job.save();

      // 5. Notify hired driver
      await createNotification(
        application.driverId,
        "application_approved",
        `You have been selected for a ${job.jobType} job in ${job.city}. Please accept or decline.`,
        job._id
      );

      // 6. Notify rejected drivers
      for (const other of otherApps) {
        await createNotification(
          other.driverId,
          "application_rejected",
          `Your application for a ${job.jobType} job in ${job.city} was not selected.`,
          job._id
        );
      }

      successResponse(res, { application }, "Driver hired successfully");
      return;
    }

    // === DRIVER accepts or declines ===
    if (action === "accept" || action === "decline") {
      if (role !== "driver") {
        errorResponse(res, "Only drivers can accept or decline", 403);
        return;
      }
      if (application.driverId.toString() !== userId) {
        errorResponse(res, "Not your application", 403);
        return;
      }
      if (application.status !== "approved") {
        errorResponse(res, "Can only respond to approved applications", 400);
        return;
      }
      if (application.driverResponse !== "pending") {
        errorResponse(res, "Already responded to this application", 400);
        return;
      }

      if (action === "accept") {
        application.driverResponse = "accepted";
        await application.save();

        // Job stays in "accepted" status — in_progress is triggered manually
        // (job.status is already "accepted" from the hire step)

        // Notify customer
        const driver = await User.findById(userId);
        await createNotification(
          job.customerId,
          "driver_accepted",
          `${driver?.fullName || "The driver"} accepted your ${job.jobType} job in ${job.city}. You can now start the job.`,
          job._id
        );

        successResponse(res, { application }, "Job accepted successfully");
      } else {
        // decline
        application.driverResponse = "declined";
        application.status = "rejected";
        await application.save();

        // Reset job so customer can pick another
        job.acceptedDriverId = null;
        job.status = "applied";
        await job.save();

        // Notify customer
        const driver = await User.findById(userId);
        await createNotification(
          job.customerId,
          "driver_declined",
          `${driver?.fullName || "The driver"} declined your ${job.jobType} job in ${job.city}. You can select another applicant.`,
          job._id
        );

        successResponse(res, { application }, "Job declined");
      }
    }
  } catch {
    errorResponse(res, "Failed to update application");
  }
};
