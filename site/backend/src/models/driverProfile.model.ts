import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDriverProfile extends Document {
  userId: Types.ObjectId;
  age: number;
  address: string;
  city: string;
  areas: string[];
  transmissionTypes: ("manual" | "automatic" | "semi-automatic")[];
  vehicleCategories: ("hatchback" | "sedan" | "suv" | "luxury")[];
  documents: {
    aadhaar: { url: string; cloudinaryId: string; uploadedAt: Date } | null;
    pan: { url: string; cloudinaryId: string; uploadedAt: Date } | null;
    license: { url: string; cloudinaryId: string; uploadedAt: Date } | null;
  };
  isVerified: boolean;
  averageRating: number;
  totalJobsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const documentSubSchema = new Schema(
  {
    url: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const driverProfileSchema = new Schema<IDriverProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    age: { type: Number, required: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    areas: [{ type: String, trim: true }],
    transmissionTypes: [
      {
        type: String,
        enum: ["manual", "automatic", "semi-automatic"],
      },
    ],
    vehicleCategories: [
      {
        type: String,
        enum: ["hatchback", "sedan", "suv", "luxury"],
      },
    ],
    documents: {
      aadhaar: { type: documentSubSchema, default: null },
      pan: { type: documentSubSchema, default: null },
      license: { type: documentSubSchema, default: null },
    },
    isVerified: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalJobsCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

driverProfileSchema.index({ city: 1 });

export default mongoose.model<IDriverProfile>("DriverProfile", driverProfileSchema);
