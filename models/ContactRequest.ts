import mongoose, { Schema, Document } from 'mongoose';

export interface IContactRequest extends Document {
  property: mongoose.Types.ObjectId;
  renter: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  // form fields
  fullName: string;
  phone: string;
  email?: string;
  gender: string;
  moveInDate: string;
  stayDuration: string;
  numberOfOccupants: string;
  roomType: string;
  occupation: string;
  companyCollege?: string;
  budgetRange: string;
  foodPreference: string;
  needParking: string;
  message: string;
  // meta
  propertyTitle: string;
  propertyLocation: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ContactRequestSchema = new Schema<IContactRequest>(
  {
    property:         { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    renter:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName:         { type: String, required: true },
    phone:            { type: String, required: true },
    email:            { type: String },
    gender:           { type: String, required: true },
    moveInDate:       { type: String, required: true },
    stayDuration:     { type: String, required: true },
    numberOfOccupants:{ type: String, default: '1' },
    roomType:         { type: String, required: true },
    occupation:       { type: String, required: true },
    companyCollege:   { type: String },
    budgetRange:      { type: String, required: true },
    foodPreference:   { type: String, required: true },
    needParking:      { type: String, required: true },
    message:          { type: String, required: true },
    propertyTitle:    { type: String, required: true },
    propertyLocation: { type: String, required: true },
    status:           { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

ContactRequestSchema.index({ renter: 1, createdAt: -1 });
ContactRequestSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.models.ContactRequest ||
  mongoose.model<IContactRequest>('ContactRequest', ContactRequestSchema);
