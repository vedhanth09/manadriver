import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Notification from "../models/notification.model";
import { successResponse, errorResponse } from "../utils/response.utils";

export const getNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    successResponse(
      res,
      { notifications, unreadCount },
      "Notifications retrieved successfully"
    );
  } catch {
    errorResponse(res, "Failed to fetch notifications");
  }
};

export const markAllRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    successResponse(res, {}, "All notifications marked as read");
  } catch {
    errorResponse(res, "Failed to mark notifications as read");
  }
};
