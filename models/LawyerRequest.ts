import mongoose, { Schema, Document } from 'mongoose';

export interface ILawyerRequest extends Document {
  lawyer: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const LawyerRequestSchema = new Schema<ILawyerRequest>(
  {
    lawyer:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    status:  { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

// One active request per lawyer-owner pair
LawyerRequestSchema.index({ lawyer: 1, owner: 1 }, { unique: true });

export default mongoose.models.LawyerRequest ||
  mongoose.model<ILawyerRequest>('LawyerRequest', LawyerRequestSchema);
