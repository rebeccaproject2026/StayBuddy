import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  phone: string;
  name?: string;
  pgName?: string;
  country: string;
  status: 'contacted' | 'interested' | 'not_interested' | 'listed';
  messageSentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    phone: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    pgName: { type: String, trim: true },
    country: { type: String, required: true },
    status: {
      type: String,
      enum: ['contacted', 'interested', 'not_interested', 'listed'],
      default: 'contacted',
    },
    messageSentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

LeadSchema.index({ phone: 1, country: 1 });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
