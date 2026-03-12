import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';
import { generateToken } from '@/lib/jwt';

// Admin signup schema (temporary for testing)
const adminSignupSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional().or(z.literal('')),
  password: z.string().min(8),
  confirmPassword: z.string(),
  country: z.enum(['fr', 'in']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = adminSignupSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new admin user
    const user = new User({
      fullName: validatedData.fullName,
      email: validatedData.email,
      phoneNumber: validatedData.phoneNumber || undefined,
      password: validatedData.password,
      role: 'admin', // Force admin role
      country: validatedData.country,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      country: user.country,
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          country: user.country,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Admin signup error:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}