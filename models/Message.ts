import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  contactRequest: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  senderRole: 'landlord' | 'renter';
  senderName: string;
  text: string;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    contactRequest: { type: Schema.Types.ObjectId, ref: 'ContactRequest', required: true },
    sender:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole:     { type: String, enum: ['landlord', 'renter'], required: true },
    senderName:     { type: String, required: true },
    text:           { type: String, required: true },
    readBy:         [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

MessageSchema.index({ contactRequest: 1, createdAt: 1 });
// TTL index: MongoDB auto-deletes messages older than 7 days
MessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

if (mongoose.models.Message) {
  delete (mongoose.models as any).Message;
}

export default mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema);
