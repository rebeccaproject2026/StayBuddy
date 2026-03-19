import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import cloudinary from '@/lib/cloudinary';
import { authenticateUser } from '@/lib/auth-middleware';
import { propertySchema } from '@/lib/validation';

// Increase body size limit for image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

// ─── Cloudinary helpers ──────────────────────────────────────────────────────

async function uploadBase64(base64: string, folder: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder: `staybuddy/${folder}`,
      resource_type: 'image',
      overwrite: false,
    });
    return result.secure_url;
  } catch (err: any) {
    console.error(`[Cloudinary] Upload failed for folder ${folder}:`, err?.message || err);
    // Return the base64 as-is if Cloudinary fails — property still saves
    return base64;
  }
}

/**
 * Upload an array of image values.
 * Each item can be:
 *   - an existing https:// URL  → returned as-is
 *   - a base64 data URI         → uploaded to Cloudinary
 */
async function uploadImages(images: string[], folder = 'properties'): Promise<string[]> {
  return Promise.all(
    images.map((img) =>
      img.startsWith('http') ? Promise.resolve(img) : uploadBase64(img, folder)
    )
  );
}

/**
 * Upload structured room image arrays.
 * Each item has { id, name, status?, image? }
 * Only uploads the `image` field if it's a base64 string.
 */
async function uploadRoomImages(
  rooms: Array<{ id: string; name: string; status?: string; image?: string }>,
  folder = 'properties/rooms'
): Promise<Array<{ id: string; name: string; status?: string; image?: string }>> {
  return Promise.all(
    rooms.map(async (room) => {
      if (!room.image || room.image.startsWith('http')) return room;
      const url = await uploadBase64(room.image, folder);
      return { ...room, image: url };
    })
  );
}

// ─── POST /api/properties ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 1. Auth — only landlords can post
    let authUser;
    try {
      authUser = await authenticateUser(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'landlord') {
      return NextResponse.json(
        { error: 'Only landlords can post properties' },
        { status: 403 }
      );
    }

    // 2. Parse body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // 3. Zod validation
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) {
      console.error('[POST /api/properties] Validation errors:', JSON.stringify(parsed.error.issues, null, 2));
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 4. Upload images to Cloudinary
    console.log('[POST /api/properties] Starting Cloudinary uploads...');
    let mainImages, kitchenImgs, washroomImgs, commonAreaImgs,
        tenantKitchenImgs, tenantWashroomImgs, tenantCommonAreaImgs,
        pgRoomImgs, tenantRoomImgs;
    try {
      [
        mainImages,
        kitchenImgs,
        washroomImgs,
        commonAreaImgs,
        tenantKitchenImgs,
        tenantWashroomImgs,
        tenantCommonAreaImgs,
        pgRoomImgs,
        tenantRoomImgs,
      ] = await Promise.all([
        uploadImages(data.images, 'properties'),
        uploadImages(data.kitchenImages ?? [], 'properties/kitchen'),
        uploadImages(data.washroomImages ?? [], 'properties/washroom'),
        uploadImages(data.commonAreaImages ?? [], 'properties/common'),
        uploadImages(data.tenantKitchenImages ?? [], 'properties/kitchen'),
        uploadImages(data.tenantWashroomImages ?? [], 'properties/washroom'),
        uploadImages(data.tenantCommonAreaImages ?? [], 'properties/common'),
        uploadRoomImages(data.roomImages ?? [], 'properties/rooms'),
        uploadRoomImages(data.tenantRoomImages ?? [], 'properties/rooms'),
      ]);
      console.log('[POST /api/properties] Cloudinary uploads complete');
    } catch (uploadError: any) {
      console.error('[POST /api/properties] Cloudinary upload failed:', uploadError?.message || uploadError);
      return NextResponse.json(
        { error: 'Image upload failed', details: uploadError?.message },
        { status: 500 }
      );
    }

    // 5. Build property document
    console.log('[POST /api/properties] Saving to DB...');
    const property = await Property.create({
      ...data,
      images: mainImages,
      kitchenImages: kitchenImgs,
      washroomImages: washroomImgs,
      commonAreaImages: commonAreaImgs,
      tenantKitchenImages: tenantKitchenImgs,
      tenantWashroomImages: tenantWashroomImgs,
      tenantCommonAreaImages: tenantCommonAreaImgs,
      roomImages: pgRoomImgs,
      tenantRoomImages: tenantRoomImgs,
      createdBy: authUser.id,
    });

    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/properties]', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: Object.values(error.errors).map((e: any) => ({
            field: e.path,
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
  }
}

// ─── GET /api/properties ─────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const country    = searchParams.get('country');
    const type       = searchParams.get('type');       // PG | Tenant
    const category   = searchParams.get('category');
    const minPrice   = searchParams.get('minPrice');
    const maxPrice   = searchParams.get('maxPrice');
    const page       = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit      = Math.min(50, parseInt(searchParams.get('limit') ?? '12'));

    const filter: Record<string, any> = {};
    if (country)  filter.country      = country;
    if (type)     filter.propertyType = type;
    if (category) filter.category     = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Property.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      properties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('[GET /api/properties]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
