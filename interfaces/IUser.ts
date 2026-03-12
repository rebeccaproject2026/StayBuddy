import { Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: 'renter' | 'landlord' | 'admin';
  country: 'fr' | 'in';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}