import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface with methods
export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: 'renter' | 'landlord' | 'admin' | 'lawyer';
  country: 'fr' | 'in';
  isVerified: boolean;
  isBlocked: boolean;
  isApproved: boolean; // for lawyer accounts — admin must approve before login
  provider: 'credentials' | 'google';
  googleId?: string;
  profileImage?: string;
  favorites: mongoose.Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  otpCode?: string;
  otpExpires?: Date;
  // Lawyer-specific fields
  barCouncilNumber?: string;
  experienceYears?: number;
  aadharNumber?: string;
  barCouncilCertificate?: string; // URL/base64 of uploaded certificate
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
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['renter', 'landlord', 'admin', 'lawyer'],
        message: 'Role must be either renter, landlord, admin, or lawyer'
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
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: false // lawyers start unapproved; other roles default to true via pre-save
    },
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials'
    },
    googleId: {
      type: String,
    },
    profileImage: {
      type: String
    },
    favorites: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
      default: []
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    otpCode: {
      type: String,
      select: false
    },
    otpExpires: {
      type: Date,
      select: false
    },
    // Lawyer-specific fields
    barCouncilNumber: { type: String, trim: true },
    experienceYears: { type: Number, min: 0 },
    aadharNumber: { type: String, trim: true },
    barCouncilCertificate: { type: String }, // stored URL or base64
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
userSchema.index({ role: 1 });
userSchema.index({ country: 1 });
// One account per email per country, one Google account per country
userSchema.index({ email: 1, country: 1 }, { unique: true });
userSchema.index({ googleId: 1, country: 1 }, { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } });

// Pre-save middleware to hash password and set isApproved
userSchema.pre('save', async function() {
  // Non-lawyer roles are always approved
  if (this.isNew && this.role !== 'lawyer') {
    this.isApproved = true;
  }
  // Only hash the password if it has been modified (or is new), exists, and provider is credentials
  if (!this.isModified('password') || !this.password || this.provider !== 'credentials') return;

  // Hash password with cost of 12
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Instance method to compare password
userSchema.method('comparePassword', async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
});

// Static method to find user by email with password
userSchema.static('findByEmailWithPassword', function(email: string) {
  return this.findOne({ email }).select('+password');
});

// Safely register or reuse the model
let User: IUserModel;

try {
  User = mongoose.model<IUser, IUserModel>('User');
  if (!User.schema.path('otpCode') || !User.schema.path('isBlocked') || !User.schema.path('isApproved')) {
    delete (mongoose.models as any).User;
    User = mongoose.model<IUser, IUserModel>('User', userSchema);
  }
} catch {
  User = mongoose.model<IUser, IUserModel>('User', userSchema);
}

export default User;