import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Job from "../models/job.model";
import Application from "../models/application.model";
import User from "../models/user.model";
import DriverProfile from "../models/driverProfile.model";
import CustomerProfile from "../models/customerProfile.model";
import { createNotification } from "../services/notification.service";
import { successResponse, errorResponse } from "../utils/response.utils";

export const createJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      jobType,
      city,
      areas,
      startLocation,
      endLocation,
      carType,
      transmissionType,
      // Hourly
      estimatedDuration,
      expectedPayout,
      // Temporary
      durationDays,
      dailyPayment,
      // Permanent
      workingHours,
      monthlySalary,
    } = req.body;

    // Common required fields
    if (!jobType || !city || !startLocation || !carType || !transmissionType) {
      errorResponse(res, "Missing required fields: jobType, city, startLocation, carType, transmissionType", 400);
      return;
    }

    if (!["hourly", "temporary", "permanent"].includes(jobType)) {
      errorResponse(res, "Invalid jobType. Must be hourly, temporary, or permanent", 400);
      return;
    }

    // Validate type-specific required fields
    if (jobType === "hourly") {
      if (!endLocation || !estimatedDuration || !expectedPayout) {
        errorResponse(res, "Hourly jobs require endLocation, estimatedDuration, and expectedPayout", 400);
        return;
      }
    }

    if (jobType === "temporary") {
      if (!endLocation || !durationDays || !dailyPayment) {
        errorResponse(res, "Temporary jobs require endLocation, durationDays, and dailyPayment", 400);
        return;
      }
    }

    if (jobType === "permanent") {
      if (!workingHours || !monthlySalary) {
        errorResponse(res, "Permanent jobs require workingHours and monthlySalary", 400);
        return;
      }
      if (!["12hr", "24x7"].includes(workingHours)) {
        errorResponse(res, "workingHours must be 12hr or 24x7", 400);
        return;
      }
    }

    const job = await Job.create({
      customerId: req.user?.userId,
      jobType,
      city,
      areas: areas || [],
      startLocation,
      endLocation: endLocation || null,
      carType,
      transmissionType,
      estimatedDuration: jobType === "hourly" ? estimatedDuration : null,
      expectedPayout: jobType === "hourly" ? expectedPayout : null,
      durationDays: jobType === "temporary" ? durationDays : null,
      dailyPayment: jobType === "temporary" ? dailyPayment : null,
      workingHours: jobType === "permanent" ? workingHours : null,
      monthlySalary: jobType === "permanent" ? monthlySalary : null,
      status: "posted",
    });

    // Notify drivers in the same city/areas about the new job
    const areaFilter: Record<string, unknown> = { city: job.city };
    if (job.areas && job.areas.length > 0) {
      areaFilter.areas = { $in: job.areas };
    }
    const matchingDrivers = await DriverProfile.find(areaFilter, { userId: 1 });
    for (const dp of matchingDrivers) {
      await createNotification(
        dp.userId,
        "new_job",
        `New ${job.jobType} job posted in ${job.city}. Check it out!`,
        job._id
      );
    }

    successResponse(res, { job }, "Job posted successfully", 201);
  } catch {
    errorResponse(res, "Failed to create job");
  }
};

export const getJobs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { role, userId } = req.user!;

    if (role === "customer") {
      // Customer sees their own jobs
      const jobs = await Job.find({ customerId: userId }).sort({ createdAt: -1 });
      successResponse(res, { jobs }, "Jobs retrieved successfully");
      return;
    }

    if (role === "driver") {
      // Driver browses jobs in their city/areas with optional filters
      const { city, areas, jobType, carType, transmissionType, minPay, maxPay, workingHours } = req.query;

      const filter: Record<string, unknown> = { status: "posted" };

      if (city) filter.city = city;
      if (areas) {
        const areasArr = (areas as string).split(",");
        filter.areas = { $in: areasArr };
      }
      if (jobType) filter.jobType = jobType;
      if (carType) filter.carType = carType;
      if (transmissionType) filter.transmissionType = transmissionType;
      if (workingHours) filter.workingHours = workingHours;

      // Pay range filter across job types
      if (minPay || maxPay) {
        const payConditions = [];
        const min = minPay ? Number(minPay) : undefined;
        const max = maxPay ? Number(maxPay) : undefined;

        const range: Record<string, number> = {};
        if (min) range.$gte = min;
        if (max) range.$lte = max;

        payConditions.push({ expectedPayout: range });
        payConditions.push({ dailyPayment: range });
        payConditions.push({ monthlySalary: range });

        filter.$or = payConditions;
      }

      const jobs = await Job.find(filter)
        .populate("customerId", "fullName")
        .sort({ createdAt: -1 });

      // Also return IDs of jobs this driver has applied to
      const appliedApplications = await Application.find(
        { driverId: userId, status: { $in: ["pending", "approved"] } },
        { jobId: 1 }
      );
      const appliedJobIds = appliedApplications.map((app) => app.jobId.toString());

      successResponse(res, { jobs, appliedJobIds }, "Jobs retrieved successfully");
      return;
    }

    errorResponse(res, "Invalid role", 403);
  } catch {
    errorResponse(res, "Failed to get jobs");
  }
};

export const getJobById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("customerId", "fullName email phone")
      .populate("acceptedDriverId", "fullName email phone");

    if (!job) {
      errorResponse(res, "Job not found", 404);
      return;
    }

    successResponse(res, { job }, "Job retrieved successfully");
  } catch {
    errorResponse(res, "Failed to get job");
  }
};

export const updateJobStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    if (!status) {
      errorResponse(res, "Status is required", 400);
      return;
    }

    const validStatuses = ["posted", "applied", "accepted", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      errorResponse(res, "Invalid status", 400);
      return;
    }

    const job = await Job.findById(id);
    if (!job) {
      errorResponse(res, "Job not found", 404);
      return;
    }

    // Only the job owner or accepted driver can update status
    const userId = req.user?.userId;
    const role = req.user?.role;
    const isOwner = job.customerId.toString() === userId;
    const isAcceptedDriver = job.acceptedDriverId?.toString() === userId;

    if (!isOwner && !isAcceptedDriver) {
      errorResponse(res, "Not authorized to update this job", 403);
      return;
    }

    // Define allowed transitions
    const allowedTransitions: Record<string, string[]> = {
      posted: ["cancelled"],
      applied: ["cancelled"],
      accepted: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
    };

    const currentStatus = job.status;
    const allowed = allowedTransitions[currentStatus];

    if (!allowed || !allowed.includes(status)) {
      errorResponse(
        res,
        `Invalid status transition: ${currentStatus} → ${status}`,
        400
      );
      return;
    }

    // Apply the status change
    job.status = status;
    if (status === "cancelled" && cancellationReason) {
      job.cancellationReason = cancellationReason;
    }
    await job.save();

    // Increment driver's totalJobsCompleted on completion
    if (status === "completed" && job.acceptedDriverId) {
      await DriverProfile.findOneAndUpdate(
        { userId: job.acceptedDriverId },
        { $inc: { totalJobsCompleted: 1 } }
      );
    }

    // Create notifications for status changes
    const customer = await User.findById(job.customerId);
    const driver = job.acceptedDriverId
      ? await User.findById(job.acceptedDriverId)
      : null;

    if (status === "in_progress") {
      // Notify the other party
      if (isOwner && driver) {
        await createNotification(
          driver._id,
          "driver_accepted",
          `Your ${job.jobType} job in ${job.city} has been started by ${customer?.fullName || "the customer"}.`,
          job._id
        );
      } else if (isAcceptedDriver && customer) {
        await createNotification(
          customer._id,
          "driver_accepted",
          `${driver?.fullName || "The driver"} started your ${job.jobType} job in ${job.city}.`,
          job._id
        );
      }
    }

    if (status === "completed") {
      // Notify both parties
      if (driver) {
        await createNotification(
          driver._id,
          "job_completed",
          `Your ${job.jobType} job in ${job.city} has been marked as completed.`,
          job._id
        );
      }
      if (customer) {
        await createNotification(
          customer._id,
          "job_completed",
          `Your ${job.jobType} job in ${job.city} has been marked as completed.`,
          job._id
        );
      }
    }

    if (status === "cancelled") {
      const reason = cancellationReason ? ` Reason: ${cancellationReason}` : "";

      // Reject all pending/approved applications for this job
      const pendingApps = await Application.find({
        jobId: job._id,
        status: { $in: ["pending", "approved"] },
      });
      for (const app of pendingApps) {
        app.status = "rejected";
        await app.save();
        await createNotification(
          app.driverId,
          "job_cancelled",
          `The ${job.jobType} job in ${job.city} has been cancelled.${reason}`,
          job._id
        );
      }

      // Notify the other party (the one who didn't cancel)
      if (isOwner && driver) {
        await createNotification(
          driver._id,
          "job_cancelled",
          `The ${job.jobType} job in ${job.city} was cancelled by the customer.${reason}`,
          job._id
        );
      } else if (isAcceptedDriver && customer) {
        await createNotification(
          customer._id,
          "job_cancelled",
          `The driver cancelled your ${job.jobType} job in ${job.city}.${reason}`,
          job._id
        );
      }
    }

    successResponse(res, { job }, "Job status updated successfully");
  } catch {
    errorResponse(res, "Failed to update job status");
  }
};
