import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import ContactRequest from '@/models/ContactRequest';

// GET /api/contracts/booked-tenants?ownerId=xxx
// Returns tenants with status='booked' for the given owner's properties (lawyer only)
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (user.role !== 'lawyer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ownerId = request.nextUrl.searchParams.get('ownerId');
    if (!ownerId) {
      return NextResponse.json({ error: 'ownerId is required' }, { status: 400 });
    }

    await connectDB();

    const bookedRequests = await ContactRequest.find({ owner: ownerId, status: 'booked' })
      .populate('renter', 'fullName email phoneNumber')
      .populate('property', 'title location fullAddress')
      .sort({ createdAt: -1 })
      .lean();

    // Deduplicate by renter id, keep latest
    const seen = new Set<string>();
    const tenants = bookedRequests
      .filter((r: any) => {
        const renterId = r.renter?._id?.toString();
        if (!renterId || seen.has(renterId)) return false;
        seen.add(renterId);
        return true;
      })
      .map((r: any) => ({
        renterId: r.renter._id,
        fullName: r.renter.fullName || r.fullName,
        email: r.renter.email || r.email || '',
        phone: r.renter.phoneNumber || r.phone || '',
        propertyTitle: r.property?.title || r.propertyTitle || '',
        propertyAddress: r.property?.fullAddress || r.property?.location || r.propertyLocation || '',
        contactRequestId: r._id,
      }));

    return NextResponse.json({ success: true, tenants });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
