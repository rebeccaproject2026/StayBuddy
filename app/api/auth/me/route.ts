import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    // Verify token
    const decoded = verifyToken(token);

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          country: user.country,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user profile error:', error);

    // Handle token errors
    if (error.message.includes('token') || error.message.includes('Authorization')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    let userId: string | null = null;
    let isGoogleUser = false;

    // Try custom JWT first
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = extractTokenFromHeader(authHeader);
        const decoded = verifyToken(token);
        userId = decoded.userId;
      } catch {
        // fall through to NextAuth
      }
    }

    // Fall back to NextAuth session (Google OAuth users)
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        userId = session.user.id;
        isGoogleUser = true;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phoneNumber, currentPassword, newPassword } = body;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Password change — not available for Google users
    if (newPassword) {
      if (isGoogleUser) {
        return NextResponse.json({ success: false, message: 'Password change is not available for Google accounts.' }, { status: 400 });
      }
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: 'Current password is required' }, { status: 400 });
      }
      const valid = await user.comparePassword(currentPassword);
      if (!valid) {
        return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
      }
      user.password = newPassword;
    }

    // Profile update
    if (fullName !== undefined) user.fullName = fullName.trim();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.trim();

    await user.save({ validateModifiedOnly: true });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        country: user.country,
        isVerified: user.isVerified,
        provider: user.provider,
      },
    });
  } catch (error: any) {
    if (error.message?.includes('token') || error.message?.includes('Authorization')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
