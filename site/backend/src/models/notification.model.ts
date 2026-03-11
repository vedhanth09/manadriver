import mongoose, { Schema, Document, Types } from "mongoose";

export type NotificationType =
  | "new_job"
  | "application_approved"
  | "application_rejected"
  | "driver_applied"
  | "driver_accepted"
  | "driver_declined"
  | "job_completed"
  | "job_cancelled";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  message: string;
  relatedJobId: Types.ObjectId | null;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    required: true,
    enum: [
      "new_job",
      "application_approved",
      "application_rejected",
      "driver_applied",
      "driver_accepted",
      "driver_declined",
      "job_completed",
      "job_cancelled",
    ],
  },
  message: { type: String, required: true },
  relatedJobId: { type: Schema.Types.ObjectId, ref: "Job", default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1 });

export default mongoose.model<INotification>("Notification", notificationSchema);
