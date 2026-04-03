import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  country: 'in' | 'fr';
  preferences: {
    city?: string;
    propertyType?: 'PG' | 'Tenant';
  };
  isActive: boolean;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    country: { type: String, enum: ['in', 'fr'], required: true, default: 'in' },
    preferences: {
      city: { type: String, trim: true },
      propertyType: { type: String, enum: ['PG', 'Tenant'] },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Unique per email+country combination (same email can subscribe to both countries)
SubscriberSchema.index({ email: 1, country: 1 }, { unique: true });
SubscriberSchema.index({ isActive: 1, country: 1, 'preferences.city': 1, 'preferences.propertyType': 1 });

// Force re-register to pick up schema changes (handles Next.js hot-reload cache)
if (mongoose.models.Subscriber) {
  delete (mongoose.models as any).Subscriber;
}

export default mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
