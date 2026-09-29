import mongoose, { Document, Schema } from 'mongoose';

export interface IContentBlock {
  type: 'video' | 'image' | 'text' | 'steps';
  url?: string; // For video or image
  text?: string; // For text
  steps?: string[]; // For steps
}

export interface IActivity extends Document {
  title: string;
  type: string;
  duration: string;
  color: string;
  iconName: string;
  contentBlocks: IContentBlock[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema({
  type: { type: String, enum: ['video', 'image', 'text', 'steps'], required: true },
  url: { type: String },
  text: { type: String },
  steps: [{ type: String }]
}, { _id: false });

const ActivitySchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    color: { type: String, required: true },
    iconName: { type: String, required: true },
    contentBlocks: [ContentBlockSchema]
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
