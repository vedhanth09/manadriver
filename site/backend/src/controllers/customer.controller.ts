import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import CustomerProfile from "../models/customerProfile.model";
import User from "../models/user.model";
import { successResponse, errorResponse } from "../utils/response.utils";

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const profile = await CustomerProfile.findOne({ userId: req.user?.userId });
    if (!profile) {
      errorResponse(res, "Customer profile not found", 404);
      return;
    }
    successResponse(res, { profile }, "Profile retrieved successfully");
  } catch {
    errorResponse(res, "Failed to get profile");
  }
};

export const createProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const existing = await CustomerProfile.findOne({ userId: req.user?.userId });
    if (existing) {
      errorResponse(res, "Profile already exists. Use PATCH to update.", 409);
      return;
    }

    const { city, carDetails, preferences } = req.body;

    if (!city) {
      errorResponse(res, "City is required", 400);
      return;
    }

    const profile = await CustomerProfile.create({
      userId: req.user?.userId,
      city,
      carDetails: carDetails || null,
      preferences: preferences || null,
    });

    // Mark profile as complete
    await User.findByIdAndUpdate(req.user?.userId, {
      isProfileComplete: true,
    });

    successResponse(res, { profile }, "Profile created successfully", 201);
  } catch {
    errorResponse(res, "Failed to create profile");
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const profile = await CustomerProfile.findOne({ userId: req.user?.userId });
    if (!profile) {
      errorResponse(res, "Profile not found", 404);
      return;
    }

    const allowedFields = ["city", "carDetails", "preferences"];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updated = await CustomerProfile.findOneAndUpdate(
      { userId: req.user?.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    successResponse(res, { profile: updated }, "Profile updated successfully");
  } catch {
    errorResponse(res, "Failed to update profile");
  }
};
