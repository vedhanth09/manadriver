import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJob extends Document {
  customerId: Types.ObjectId;
  jobType: "hourly" | "temporary" | "permanent";
  city: string;
  areas: string[];
  startLocation: string;
  endLocation: string | null;
  carType: "hatchback" | "sedan" | "suv" | "luxury";
  transmissionType: "manual" | "automatic" | "semi-automatic";
  // Hourly fields
  estimatedDuration: number | null;
  expectedPayout: number | null;
  // Temporary fields
  durationDays: number | null;
  dailyPayment: number | null;
  // Permanent fields
  workingHours: "12hr" | "24x7" | null;
  monthlySalary: number | null;
  status: "posted" | "applied" | "accepted" | "in_progress" | "completed" | "cancelled";
  acceptedDriverId: Types.ObjectId | null;
  cancellationReason: string | null;
  // Phase 2 placeholders
  paymentId: string | null;
  location: { type: "Point"; coordinates: [number, number] } | null;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobType: {
      type: String,
      required: true,
      enum: ["hourly", "temporary", "permanent"],
    },
    city: { type: String, required: true, trim: true },
    areas: [{ type: String, trim: true }],
    startLocation: { type: String, required: true, trim: true },
    endLocation: { type: String, default: null, trim: true },
    carType: {
      type: String,
      required: true,
      enum: ["hatchback", "sedan", "suv", "luxury"],
    },
    transmissionType: {
      type: String,
      required: true,
      enum: ["manual", "automatic", "semi-automatic"],
    },
    // Hourly fields
    estimatedDuration: { type: Number, default: null },
    expectedPayout: { type: Number, default: null },
    // Temporary fields
    durationDays: { type: Number, default: null },
    dailyPayment: { type: Number, default: null },
    // Permanent fields
    workingHours: { type: String, enum: ["12hr", "24x7"], default: null },
    monthlySalary: { type: Number, default: null },
    status: {
      type: String,
      required: true,
      enum: ["posted", "applied", "accepted", "in_progress", "completed", "cancelled"],
      default: "posted",
    },
    acceptedDriverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    cancellationReason: { type: String, default: null },
    // Phase 2 placeholders
    paymentId: { type: String, default: null },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  { timestamps: true }
);

jobSchema.index({ customerId: 1 });
jobSchema.index({ city: 1 });

export default mongoose.model<IJob>("Job", jobSchema);
