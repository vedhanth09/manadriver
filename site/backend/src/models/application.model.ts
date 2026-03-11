import mongoose, { Schema, Document, Types } from "mongoose";

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  driverId: Types.ObjectId;
  appliedAt: Date;
  status: "pending" | "approved" | "rejected" | "withdrawn";
  driverResponse: "pending" | "accepted" | "declined" | null;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected", "withdrawn"],
      default: "pending",
    },
    driverResponse: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: null,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1 });
applicationSchema.index({ driverId: 1 });
applicationSchema.index({ jobId: 1, driverId: 1 }, { unique: true });

export default mongoose.model<IApplication>("Application", applicationSchema);
