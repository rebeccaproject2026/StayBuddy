import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  property: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema<IReport>({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true, maxlength: 1000 },
  status: { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending' },
}, { timestamps: true });

// One report per user per property
ReportSchema.index({ property: 1, reportedBy: 1 }, { unique: true });

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
