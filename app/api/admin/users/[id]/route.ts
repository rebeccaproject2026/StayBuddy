import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/auth-middleware';
import { z } from 'zod';

const updateUserSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/).optional().or(z.literal('')),
  role: z.enum(['renter', 'landlord', 'admin']).optional(),
  country: z.enum(['fr', 'in']).optional(),
  isVerified: z.boolean().optional(),
});

// GET /api/admin/users/[id] - Get single user (Admin only)
export const GET = requireRole(['admin'])(async (request, { params }) => {
  try {
    await connectDB();

    const user = await User.findById(params.id).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// PUT /api/admin/users/[id] - Update user (Admin only)
export const PUT = requireRole(['admin'])(async (request, { params }) => {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const user = await User.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error: any) {
    console.error('Update user error:', error);

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

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/users/[id] - Delete user (Admin only)
export const DELETE = requireRole(['admin'])(async (request, { params }) => {
  try {
    await connectDB();

    const user = await User.findByIdAndDelete(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});