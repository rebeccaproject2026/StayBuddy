import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  contactRequest: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  text: string;
  seenByReceiver: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    contactRequest: { type: Schema.Types.ObjectId, ref: 'ContactRequest', required: true },
    sender:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text:           { type: String, required: true, maxlength: 2000 },
    seenByReceiver: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ contactRequest: 1, createdAt: 1 });
MessageSchema.index({ receiver: 1, seenByReceiver: 1 });

export default mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema);
