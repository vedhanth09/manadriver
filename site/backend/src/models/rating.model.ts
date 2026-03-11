import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRating extends Document {
  jobId: Types.ObjectId;
  raterId: Types.ObjectId;
  rateeId: Types.ObjectId;
  rateeRole: "driver" | "customer";
  drivingSkill: number;
  professionalBehavior: number;
  punctuality: number;
  overallRating: number;
  review: string | null;
  createdAt: Date;
}

const ratingSchema = new Schema<IRating>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  raterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rateeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rateeRole: { type: String, required: true, enum: ["driver", "customer"] },
  drivingSkill: { type: Number, min: 1, max: 5, required: true },
  professionalBehavior: { type: Number, min: 1, max: 5, required: true },
  punctuality: { type: Number, min: 1, max: 5, required: true },
  overallRating: { type: Number, min: 1, max: 5 },
  review: { type: String, default: null, trim: true },
  createdAt: { type: Date, default: Date.now },
});

ratingSchema.pre("save", function () {
  this.overallRating =
    Math.round(
      ((this.drivingSkill + this.professionalBehavior + this.punctuality) / 3) * 10
    ) / 10;
});

ratingSchema.index({ jobId: 1, raterId: 1 }, { unique: true });

export default mongoose.model<IRating>("Rating", ratingSchema);
