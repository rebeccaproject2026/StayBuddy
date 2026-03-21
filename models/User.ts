import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface with methods
export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  role: 'renter' | 'landlord' | 'admin';
  country: 'fr' | 'in';
  isVerified: boolean;
  provider: 'credentials' | 'google';
  googleId?: string;
  profileImage?: string;
  favorites: mongoose.Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  otpCode?: string;
  otpExpires?: Date;
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
userSchema.index({ role: 1 });
userSchema.index({ country: 1 });
// One account per email per country, one Google account per country
userSchema.index({ email: 1, country: 1 }, { unique: true });
userSchema.index({ googleId: 1, country: 1 }, { unique: true, partialFilterExpression: { googleId: { $type: 'string' } } });

// Pre-save middleware to hash password
userSchema.pre('save', async function() {
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
  // Try to get existing model
  User = mongoose.model<IUser, IUserModel>('User');
  // If it exists but doesn't have otpCode, delete and re-register
  if (!User.schema.path('otpCode')) {
    delete (mongoose.models as any).User;
    User = mongoose.model<IUser, IUserModel>('User', userSchema);
  }
} catch {
  // Model doesn't exist yet, register it
  User = mongoose.model<IUser, IUserModel>('User', userSchema);
}

export default User;