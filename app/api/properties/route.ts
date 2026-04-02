import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import Review from '@/models/Review';
import cloudinary from '@/lib/cloudinary';
import { authenticateUser } from '@/lib/auth-middleware';
import { propertySchema } from '@/lib/validation';
import { sendPropertyRequestEmail } from '@/lib/email';
import { notifyNewProperty } from '@/lib/sse-events';

// Increase body size limit for image uploads
export const maxDuration = 60;

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

    // Debug: log nearbyPlaces at each stage
    console.log('[POST /api/properties] body.nearbyPlaces:', JSON.stringify(body.nearbyPlaces));
    console.log('[POST /api/properties] parsed.nearbyPlaces:', JSON.stringify(data.nearbyPlaces));

    // 4. Upload images to Cloudinary
    console.log('[POST /api/properties] Starting Cloudinary uploads...');
    let mainImages, kitchenImgs, washroomImgs, commonAreaImgs,
        tenantKitchenImgs, tenantWashroomImgs, tenantCommonAreaImgs,
        pgRoomImgs, tenantRoomImgs, verificationImgs;
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
        verificationImgs,
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
        uploadImages(data.verificationImages ?? [], 'properties/verification'),
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
    console.log('[POST /api/properties] nearbyPlaces going to DB:', JSON.stringify(data.nearbyPlaces));
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
      verificationImages: verificationImgs,
      isVerified: false,           // always false until admin explicitly verifies
      approvalStatus: 'pending',   // always pending until admin approves
      createdBy: authUser.id,
    });

    console.log('[POST /api/properties] Saved nearbyPlaces:', JSON.stringify((property as any).nearbyPlaces));

    // Notify connected admin dashboards via SSE (fire-and-forget)
    notifyNewProperty();

    // Send notification email to admin (fire-and-forget — don't block the response)
    const User = (await import('@/models/User')).default;
    const owner = await User.findById(authUser.id).select('fullName email').lean();
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    sendPropertyRequestEmail(
      (owner as any)?.fullName || 'Unknown',
      (owner as any)?.email || authUser.email,
      (property as any).title,
      (property as any).propertyType,
      (property as any).location,
      (property as any).price,
      ((property as any).verificationImages?.length ?? 0) > 0,
      `${baseUrl}/in/dashboard/admin`
    ).catch(err => console.error('[email] Property request notification failed:', err));

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
    const mine       = searchParams.get('mine');       // 'true' → filter by logged-in user
    const page       = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit      = Math.min(50, parseInt(searchParams.get('limit') ?? '12'));

    const pgFor = searchParams.get('pgFor'); // Male | Female | Both

    const filter: Record<string, any> = {};
    if (country)  filter.country      = country;
    if (type)     filter.propertyType = type;
    if (category) filter.category     = category;
    if (pgFor) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { pgFor: { $regex: new RegExp(pgFor, 'i') } },
          { preferredGender: { $regex: new RegExp(pgFor, 'i') } },
          { pgFor: { $regex: /both/i } },
          { preferredGender: { $regex: /both/i } },
        ],
      });
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by the authenticated user's own properties
    if (mine === 'true') {
      let authUser;
      try {
        authUser = await authenticateUser(req);
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      filter.createdBy = authUser.id;
      // Show all statuses for owner's own properties (so they can see pending ones)
    } else {
      // Public listing — only show approved properties (or legacy ones with no approvalStatus)
      filter.$or = [
        { approvalStatus: 'approved' },
        { approvalStatus: { $exists: false } },
      ];
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy', 'fullName email phoneNumber createdAt')
        .lean(),
      Property.countDocuments(filter),
    ]);

    // Attach review stats to each property
    const propertyIds = properties.map((p: any) => p._id);
    const reviewStats = await Review.aggregate([
      { $match: { property: { $in: propertyIds } } },
      {
        $group: {
          _id: '$property',
          averageRating: { $avg: '$rating' },
          reviewsCount: { $sum: 1 },
        },
      },
    ]);
    const statsMap: Record<string, { averageRating: number; reviewsCount: number }> = {};
    for (const s of reviewStats) {
      statsMap[String(s._id)] = { averageRating: s.averageRating, reviewsCount: s.reviewsCount };
    }
    const propertiesWithStats = properties.map((p: any) => {
      const stats = statsMap[String(p._id)];
      return {
        ...p,
        averageRating: stats ? Math.round(stats.averageRating * 10) / 10 : null,
        reviewsCount: stats ? stats.reviewsCount : 0,
      };
    });

    return NextResponse.json({
      success: true,
      properties: propertiesWithStats,
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
