import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User';
import cloudinary from '@/lib/cloudinary';
import { authenticateUser } from '@/lib/auth-middleware';
import { sendPropertyDeletedEmail, sendVacancyAlert } from '@/lib/email';
import mongoose from 'mongoose';

// ─── GET /api/properties/[id] ────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    const property = await Property.findById(params.id).lean();
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Populate creator's phone so the detail page can show "Call Owner"
    const User = (await import('@/models/User')).default;
    const creator = await User.findById((property as any).createdBy).select('phoneNumber').lean();
    const propertyWithPhone = {
      ...property,
      ownerPhone: (creator as any)?.phoneNumber || null,
    };

    return NextResponse.json({ success: true, property: propertyWithPhone });
  } catch (error) {
    console.error('[GET /api/properties/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT /api/properties/[id] ────────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    let authUser;
    try {
      authUser = await authenticateUser(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    const property = await Property.findById(params.id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Only the owner or admin can update
    if (
      property.createdBy.toString() !== authUser.id &&
      authUser.role !== 'admin'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    // Upload any new base64 images to Cloudinary
    if (Array.isArray(body.images)) {
      body.images = await Promise.all(
        body.images.map(async (img: string) => {
          if (!img || img.startsWith('http')) return img;
          try {
            const result = await cloudinary.uploader.upload(img, {
              folder: 'staybuddy/properties',
              resource_type: 'image',
            });
            return result.secure_url;
          } catch {
            return img;
          }
        })
      );
    }

    // Upload simple string image arrays
    const simpleArrayFields = ['kitchenImages', 'washroomImages', 'commonAreaImages', 'tenantKitchenImages', 'tenantWashroomImages', 'tenantCommonAreaImages', 'verificationImages'];
    for (const field of simpleArrayFields) {
      if (Array.isArray(body[field])) {
        body[field] = await Promise.all(
          body[field].map(async (img: string) => {
            if (!img || img.startsWith('http')) return img;
            try {
              const result = await cloudinary.uploader.upload(img, { folder: 'staybuddy/properties', resource_type: 'image' });
              return result.secure_url;
            } catch { return img; }
          })
        );
      }
    }

    // Upload room image objects {id, name, status?, image?}
    const roomArrayFields = ['roomImages', 'tenantRoomImages'];
    for (const field of roomArrayFields) {
      if (Array.isArray(body[field])) {
        body[field] = await Promise.all(
          body[field].map(async (room: any) => {
            if (!room.image || room.image.startsWith('http')) return room;
            try {
              const result = await cloudinary.uploader.upload(room.image, { folder: 'staybuddy/properties/rooms', resource_type: 'image' });
              return { ...room, image: result.secure_url };
            } catch { return room; }
          })
        );
      }
    }

    const updated = await Property.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    // Fire vacancy alert if availability increased
    // Check 1: top-level rooms count increased
    const roomsIncreased =
      typeof body.rooms === 'number' &&
      typeof (property as any).rooms === 'number' &&
      body.rooms > (property as any).rooms;

    // Check 2: total availableBeds across roomDetails increased (PG bed availability)
    let bedsIncreased = false;
    if (body.roomDetails && (property as any).roomDetails) {
      const sumBeds = (rd: Record<string, any>) =>
        Object.values(rd).reduce((acc: number, cat: any) => {
          const v = Number(cat?.availableBeds ?? cat?.availableRooms ?? 0);
          return acc + (isNaN(v) ? 0 : v);
        }, 0);
      const oldTotal = sumBeds((property as any).roomDetails);
      const newTotal = sumBeds(body.roomDetails);
      bedsIncreased = newTotal > oldTotal;
    } else if (body.roomDetails && !(property as any).roomDetails) {
      // roomDetails didn't exist before — any beds are new availability
      const sumBeds = (rd: Record<string, any>) =>
        Object.values(rd).reduce((acc: number, cat: any) => {
          const v = Number(cat?.availableBeds ?? cat?.availableRooms ?? 0);
          return acc + (isNaN(v) ? 0 : v);
        }, 0);
      bedsIncreased = sumBeds(body.roomDetails) > 0;
    }

    // Check 3: France Tenant rooms — available spots increased
    // Available = maxPersons - currentPersons; if this sum goes up, vacancy increased
    let tenantRoomsIncreased = false;
    if (Array.isArray(body.tenantRooms) && Array.isArray((property as any).tenantRooms)) {
      const sumAvailable = (rooms: any[]) =>
        rooms.reduce((acc: number, r: any) => {
          const max = parseInt(r.maxPersons) || 0;
          const cur = parseInt(r.currentPersons) || 0;
          return acc + Math.max(0, max - cur);
        }, 0);
      const oldAvail = sumAvailable((property as any).tenantRooms);
      const newAvail = sumAvailable(body.tenantRooms);
      tenantRoomsIncreased = newAvail > oldAvail;
    }

    if (
      updated &&
      (roomsIncreased || bedsIncreased || tenantRoomsIncreased) &&
      (updated as any).approvalStatus === 'approved'
    ) {
      sendVacancyAlert({
        _id: params.id,
        title: (updated as any).title,
        location: (updated as any).location,
        price: (updated as any).price,
        propertyType: (updated as any).propertyType,
        country: (updated as any).country,
        pgName: (updated as any).pgName,
        societyName: (updated as any).societyName,
      }).catch(err => console.error('[email] Vacancy alert failed:', err));
    }

    return NextResponse.json({ success: true, property: updated });
  } catch (error: any) {
    console.error('[PUT /api/properties/[id]]', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: Object.values(error.errors).map((e: any) => e.message) },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/properties/[id] ─────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    let authUser;
    try {
      authUser = await authenticateUser(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    const property = await Property.findById(params.id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (
      property.createdBy.toString() !== authUser.id &&
      authUser.role !== 'admin'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse optional reason (admin-only deletion notification)
    let reason = '';
    try {
      const body = await req.json();
      reason = body?.reason?.trim() || '';
    } catch { /* no body is fine */ }

    await Property.findByIdAndDelete(params.id);

    // If deleted by admin with a reason, email the property owner (fire-and-forget)
    if (authUser.role === 'admin' && reason) {
      try {
        const owner = await User.findById(property.createdBy).select('email fullName').lean() as any;
        if (owner?.email) {
          await sendPropertyDeletedEmail(
            owner.email,
            owner.fullName || 'there',
            property.propertyType,
            property.pgName,
            property.societyName,
            reason
          );
        }
      } catch (mailErr) {
        console.error('[DELETE property] email failed:', mailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('[DELETE /api/properties/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
