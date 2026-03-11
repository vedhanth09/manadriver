import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import DriverProfile from "../models/driverProfile.model";
import User from "../models/user.model";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinary.service";
import { successResponse, errorResponse } from "../utils/response.utils";

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const profile = await DriverProfile.findOne({ userId: req.user?.userId });
    if (!profile) {
      errorResponse(res, "Driver profile not found", 404);
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
    const existing = await DriverProfile.findOne({ userId: req.user?.userId });
    if (existing) {
      errorResponse(res, "Profile already exists. Use PATCH to update.", 409);
      return;
    }

    const { age, address, city, areas, transmissionTypes, vehicleCategories } =
      req.body;

    if (!age || !address || !city) {
      errorResponse(res, "Age, address, and city are required", 400);
      return;
    }

    const profile = await DriverProfile.create({
      userId: req.user?.userId,
      age,
      address,
      city,
      areas: areas || [],
      transmissionTypes: transmissionTypes || [],
      vehicleCategories: vehicleCategories || [],
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
    const profile = await DriverProfile.findOne({ userId: req.user?.userId });
    if (!profile) {
      errorResponse(res, "Profile not found", 404);
      return;
    }

    const allowedFields = [
      "age",
      "address",
      "city",
      "areas",
      "transmissionTypes",
      "vehicleCategories",
    ];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updated = await DriverProfile.findOneAndUpdate(
      { userId: req.user?.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    successResponse(res, { profile: updated }, "Profile updated successfully");
  } catch {
    errorResponse(res, "Failed to update profile");
  }
};

export const uploadDocuments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const profile = await DriverProfile.findOne({ userId: req.user?.userId });
    if (!profile) {
      errorResponse(
        res,
        "Create a profile before uploading documents",
        400
      );
      return;
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (!files || Object.keys(files).length === 0) {
      errorResponse(res, "No files uploaded", 400);
      return;
    }

    const documentUpdates: Record<string, unknown> = {};
    const docTypes = ["aadhaar", "pan", "license"] as const;

    for (const docType of docTypes) {
      if (files[docType]?.[0]) {
        // Delete old document from Cloudinary if it exists
        const existing = profile.documents[docType];
        if (existing?.cloudinaryId) {
          await deleteFromCloudinary(existing.cloudinaryId);
        }

        const result = await uploadToCloudinary(
          files[docType][0].buffer,
          `driver-documents/${req.user?.userId}/${docType}`
        );

        documentUpdates[`documents.${docType}`] = {
          url: result.url,
          cloudinaryId: result.cloudinaryId,
          uploadedAt: new Date(),
        };
      }
    }

    const updated = await DriverProfile.findOneAndUpdate(
      { userId: req.user?.userId },
      { $set: documentUpdates },
      { new: true }
    );

    // Phase 1 stub: mark verified + profile complete when all docs uploaded
    if (
      updated?.documents.aadhaar &&
      updated?.documents.pan &&
      updated?.documents.license
    ) {
      updated.isVerified = true;
      await updated.save();
      await User.findByIdAndUpdate(req.user?.userId, {
        isProfileComplete: true,
      });
    }

    successResponse(
      res,
      { profile: updated },
      "Documents uploaded successfully"
    );
  } catch {
    errorResponse(res, "Failed to upload documents");
  }
};
