import Notification, { NotificationType } from "../models/notification.model";
import { Types } from "mongoose";

export const createNotification = async (
  userId: string | Types.ObjectId,
  type: NotificationType,
  message: string,
  relatedJobId?: string | Types.ObjectId | null
) => {
  return Notification.create({
    userId,
    type,
    message,
    relatedJobId: relatedJobId || null,
  });
};
