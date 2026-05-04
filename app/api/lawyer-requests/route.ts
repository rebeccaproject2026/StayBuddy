import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import LawyerRequest from '@/models/LawyerRequest';

// GET /api/lawyer-requests
// - lawyer: fetch all requests they sent
// - landlord (owner): fetch all incoming requests with lawyer details
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    await connectDB();

    if (user.role === 'lawyer') {
      const requests = await LawyerRequest.find({ lawyer: user.id }).lean();
      return NextResponse.json({ success: true, requests });
    }

    if (user.role === 'landlord') {
      const requests = await LawyerRequest.find({ owner: user.id })
        .populate('lawyer', 'fullName email phoneNumber profileImage barCouncilNumber experienceYears barCouncilCertificate isApproved createdAt')
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ success: true, requests });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST /api/lawyer-requests — send a request to an owner
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (user.role !== 'lawyer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { ownerId, message } = await request.json();
    if (!ownerId) {
      return NextResponse.json({ error: 'ownerId is required' }, { status: 400 });
    }
    await connectDB();
    // Upsert — if already exists just return it
    const existing = await LawyerRequest.findOne({ lawyer: user.id, owner: ownerId });
    if (existing) {
      return NextResponse.json({ success: true, request: existing, alreadySent: true });
    }
    const req = await LawyerRequest.create({ lawyer: user.id, owner: ownerId, message });
    return NextResponse.json({ success: true, request: req }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
