import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'workshop' | 'competition' | 'course' | 'other';
  images: string[];
  date: Date;
  location: string;
  isLive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdByUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['workshop', 'competition', 'course', 'other'],
      required: true 
    },
    images: [{ type: String }],
    date: { type: Date, required: true },
    location: { type: String, required: true },
    isLive: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdByUsername: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
