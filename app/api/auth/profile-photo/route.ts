import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateUser } from '@/lib/auth-middleware';
import { v2 as cloudinary } from 'cloudinary';

// Configure route segment
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  console.log('=== Profile photo upload request received ===');
  
  try {
    // Authenticate user
    console.log('Step 1: Authenticating user...');
    let user;
    try {
      user = await authenticateUser(req);
      console.log('✓ User authenticated:', user.id, user.email);
    } catch (authError: any) {
      console.error('✗ Authentication failed:', authError.message);
      return NextResponse.json(
        { success: false, message: 'Unauthorized: ' + authError.message },
        { status: 401 }
      );
    }
    
    // Connect to database
    console.log('Step 2: Connecting to database...');
    try {
      await connectDB();
      console.log('✓ Database connected');
    } catch (dbError: any) {
      console.error('✗ Database connection failed:', dbError.message);
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Parse request body
    console.log('Step 3: Parsing request body...');
    let body, image;
    try {
      body = await req.json();
      image = body.image;
      console.log('✓ Body parsed, image length:', image?.length || 0);
    } catch (parseError: any) {
      console.error('✗ Body parsing failed:', parseError.message);
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!image) {
      console.log('✗ No image provided');
      return NextResponse.json({ success: false, message: 'Image is required' }, { status: 400 });
    }

    // Upload to Cloudinary
    let imageUrl = image;
    if (image && !image.startsWith('http')) {
      console.log('Step 4: Uploading to Cloudinary...');
      try {
        // Generate timestamp for signed upload
        const timestamp = Math.round(new Date().getTime() / 1000);
        
        const result = await cloudinary.uploader.upload(image, {
          folder: 'staybuddy/profiles',
          resource_type: 'image',
          timestamp: timestamp,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ],
          // Add these options for better compatibility
          invalidate: true,
          overwrite: true,
        });
        imageUrl = result.secure_url;
        console.log('✓ Image uploaded successfully:', imageUrl);
      } catch (uploadError: any) {
        console.error('✗ Cloudinary upload error:', uploadError);
        console.error('Cloudinary error details:', JSON.stringify(uploadError, null, 2));
        
        // Provide more specific error message
        let errorMessage = 'Cloudinary upload failed';
        if (uploadError.http_code === 403) {
          errorMessage = 'Cloudinary authentication failed. Please check your API credentials.';
        } else if (uploadError.message) {
          errorMessage = uploadError.message;
        }
        
        return NextResponse.json({ 
          success: false, 
          message: errorMessage
        }, { status: 500 });
      }
    }

    // Update user profile image
    console.log('Step 5: Updating user profile image...');
    let updatedUser;
    try {
      updatedUser = await User.findByIdAndUpdate(
        user.id,
        { profileImage: imageUrl },
        { new: true }
      ).select('_id email fullName phoneNumber role country profileImage isVerified provider').lean();
      
      if (!updatedUser) {
        console.log('✗ User not found:', user.id);
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      console.log('✓ User profile updated successfully');
    } catch (updateError: any) {
      console.error('✗ Database update failed:', updateError.message);
      return NextResponse.json(
        { success: false, message: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    console.log('=== Profile photo upload completed successfully ===');
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
    console.error('=== UNEXPECTED ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
