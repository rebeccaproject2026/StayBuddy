import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/auth-middleware';

// PUT /api/admin/users/verify/[id] - Verify/Unverify user (Admin only)
export const PUT = requireRole(['admin'])(async (request, { params }) => {
  try {
    await connectDB();

    const body = await request.json();
    const { isVerified } = body;

    if (typeof isVerified !== 'boolean') {
      return NextResponse.json(
        { error: 'isVerified must be a boolean value' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { isVerified },
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
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: { user }
    });

  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});