import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactRequest from '@/models/ContactRequest';
import Property from '@/models/Property';
import User from '@/models/User';
import { authenticateUser } from '@/lib/auth-middleware';
import { sendBookingRequestEmail } from '@/lib/email';

// POST /api/contact-requests — renter submits a request
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);

    const body = await req.json();
    const { propertyId, fullName, phone, email, gender, moveInDate, stayDuration,
            numberOfOccupants, roomType, occupation, companyCollege, budgetRange,
            foodPreference, needParking, message } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    const property = await Property.findById(propertyId).lean() as any;
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const request = await ContactRequest.create({
      property: propertyId,
      renter: authUser.id,
      owner: property.createdBy,
      fullName, phone, email, gender, moveInDate, stayDuration,
      numberOfOccupants, roomType, occupation, companyCollege,
      budgetRange, foodPreference, needParking, message,
      propertyTitle: property.title,
      propertyLocation: property.location,
      status: 'new',
    });

    // Send email notification to owner (fire-and-forget)
    try {
      const owner = await User.findById(property.createdBy).lean() as any;
      if (owner?.email) {
        await sendBookingRequestEmail(
          owner.email,
          owner.fullName || 'Owner',
          fullName,
          phone,
          property.propertyType || 'PG',
          property.title,
          property.location || '',
          { roomType, moveInDate, stayDuration, occupation, budgetRange, message }
        );
      }
    } catch (mailErr) {
      console.error('[contact-requests] email notification failed:', mailErr);
    }

    return NextResponse.json({ success: true, request }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/contact-requests]', err);
    if (err.message?.includes('token') || err.message?.includes('Authorization') || err.message?.includes('Authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/contact-requests — list requests for the logged-in user
// renter → their own requests; owner → requests on their properties
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);

    const filter = authUser.role === 'landlord'
      ? { owner: authUser.id }
      : { renter: authUser.id };

    const requests = await ContactRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('property', 'title location images')
      .populate('renter', 'fullName email phoneNumber')
      .populate('owner', 'fullName')
      .lean();

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    console.error('[GET /api/contact-requests]', err);
    if (err.message?.includes('token') || err.message?.includes('Authorization') || err.message?.includes('Authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
