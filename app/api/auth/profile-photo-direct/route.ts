import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateUser } from '@/lib/auth-middleware';

// This route stores the base64 image directly in the database
// Use this as a temporary solution if Cloudinary is not working

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log('=== Direct profile photo upload (no Cloudinary) ===');
  
  try {
    // Authenticate user
    console.log('Step 1: Authenticating user...');
    const user = await authenticateUser(req);
    console.log('✓ User authenticated:', user.id);
    
    // Connect to database
    console.log('Step 2: Connecting to database...');
    await connectDB();
    console.log('✓ Database connected');

    // Parse request body
    console.log('Step 3: Parsing request body...');
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ success: false, message: 'Image is required' }, { status: 400 });
    }

    // Store image directly (base64)
    console.log('Step 4: Storing image directly in database...');
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { profileImage: image },
      { new: true }
    ).select('_id email fullName phoneNumber role country profileImage isVerified provider').lean();

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    console.log('✓ Profile photo updated successfully (direct storage)');
    return NextResponse.json({
      success: true,
      message: 'Profile photo updated successfully',
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        country: updatedUser.country,
        profileImage: updatedUser.profileImage,
        isVerified: updatedUser.isVerified,
        provider: updatedUser.provider,
      },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
