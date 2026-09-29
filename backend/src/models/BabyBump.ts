import mongoose, { Document, Schema } from 'mongoose';

export interface IBabyBump extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  month: number;
  frameType: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BabyBumpSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true }, // Would be Cloudinary URL
    month: { type: Number, required: true },
    frameType: { type: String, required: true },
    notes: { type: String }
  },
  { timestamps: true }
);

export const BabyBump = mongoose.model<IBabyBump>('BabyBump', BabyBumpSchema);
