import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  preferences: {
    city?: string;
    propertyType?: 'PG' | 'Tenant';
  };
  isActive: boolean;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    preferences: {
      city: { type: String, trim: true },
      propertyType: { type: String, enum: ['PG', 'Tenant'] },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubscriberSchema.index({ isActive: 1, 'preferences.city': 1, 'preferences.propertyType': 1 });

export default mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
