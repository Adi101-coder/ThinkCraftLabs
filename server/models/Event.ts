import mongoose, { Document, Schema } from 'mongoose';

export interface IEventRegistration {
  userId: mongoose.Types.ObjectId;
  username: string;
  registeredAt: Date;
}

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
  registrations: IEventRegistration[];
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
}, { _id: false });

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
    registrations: { type: [EventRegistrationSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
