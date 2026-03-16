import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import cloudinary from '@/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseFormData(req: NextRequest) {
  // Use formidable or busboy for production; here is a simple fallback for JSON
  try {
    const data = await req.json();
    return { fields: data, files: {} };
  } catch {
    return { fields: {}, files: {} };
  }
}

async function uploadImagesToCloudinary(images: any[]) {
  const uploadedUrls: string[] = [];
  for (const image of images) {
    if (typeof image === 'string' && image.startsWith('http')) {
      uploadedUrls.push(image);
      continue;
    }
    // image should be a base64 string or file object
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'staybuddy/properties',
      public_id: uuidv4(),
    });
    uploadedUrls.push(uploadResponse.secure_url);
  }
  return uploadedUrls;
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { fields } = await parseFormData(req);

  try {
    // Handle images
    let images: string[] = [];
    if (fields.images && Array.isArray(fields.images)) {
      images = await uploadImagesToCloudinary(fields.images);
    }
    // Handle roomImages, kitchenImages, etc. as needed
    // ...
    const propertyData = {
      ...fields,
      images,
      createdBy: fields.createdBy, // Should be set from auth context in real app
    };
    const property = await Property.create(propertyData);
    return NextResponse.json({ success: true, property });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
