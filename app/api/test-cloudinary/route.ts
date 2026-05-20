import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    console.log('Testing Cloudinary configuration...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
    
    // Test with a simple 1x1 pixel image
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    const result = await cloudinary.uploader.upload(testImage, {
      folder: 'staybuddy/test',
      resource_type: 'image',
    });
    
    console.log('✓ Cloudinary test successful!');
    console.log('Uploaded URL:', result.secure_url);
    
    // Clean up test image
    await cloudinary.uploader.destroy(result.public_id);
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary is configured correctly',
      testUrl: result.secure_url,
    });
  } catch (error: any) {
    console.error('✗ Cloudinary test failed:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Cloudinary test failed',
      error: {
        name: error.name,
        message: error.message,
        http_code: error.http_code,
      }
    }, { status: 500 });
  }
}
