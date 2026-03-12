import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface with methods
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
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the model interface
export interface IUserModel extends mongoose.Model<IUser> {
  findByEmailWithPassword(email: string): mongoose.Query<IUser | null, IUser>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [
        /^[\+]?[1-9][\d]{0,15}$/,
        'Please provide a valid phone number'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['renter', 'landlord', 'admin'],
        message: 'Role must be either renter, landlord, or admin'
      },
      default: 'renter'
    },
    country: {
      type: String,
      enum: {
        values: ['fr', 'in'],
        message: 'Country must be either fr (France) or in (India)'
      },
      required: [true, 'Country is required']
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(_doc, ret) {
        delete (ret as any).password;
        return ret;
      }
    }
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ country: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  // Hash password with cost of 12
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Instance method to compare password
userSchema.method('comparePassword', async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
});

// Static method to find user by email with password
userSchema.static('findByEmailWithPassword', function(email: string) {
  return this.findOne({ email }).select('+password');
});

// Check if model already exists to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;