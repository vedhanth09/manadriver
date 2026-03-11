import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICustomerProfile extends Document {
  userId: Types.ObjectId;
  city: string;
  carDetails: {
    make: string;
    model: string;
  } | null;
  preferences: {
    transmissionType: string;
    vehicleCategory: string;
  } | null;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const customerProfileSchema = new Schema<ICustomerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    city: { type: String, required: true, trim: true },
    carDetails: {
      make: { type: String, trim: true, default: "" },
      model: { type: String, trim: true, default: "" },
    },
    preferences: {
      transmissionType: { type: String, trim: true, default: "" },
      vehicleCategory: { type: String, trim: true, default: "" },
    },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomerProfile>("CustomerProfile", customerProfileSchema);
