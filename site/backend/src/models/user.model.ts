import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "driver" | "customer" | "admin";
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["driver", "customer", "admin"] },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model<IUser>("User", userSchema);
