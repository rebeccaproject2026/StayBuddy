import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import Property from '@/models/Property';
import { authenticateUser } from '@/lib/auth-middleware';
import mongoose from 'mongoose';

const REASONS = [
  'Fake listing',
  'Incorrect information',
  'Misleading photos',
  'Already rented',
  'Scam / fraud',
  'Other',
];

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    let authUser;
    try {
      authUser = await authenticateUser(req);
    } catch {
      return NextResponse.json({ error: 'Please login to report a property' }, { status: 401 });
    }

    // Only renters can report
    if (authUser.role !== 'renter') {
      return NextResponse.json({ error: 'Only tenants can report properties' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    const property = await Property.findById(params.id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const body = await req.json();
    const { reason, description } = body;

    if (!reason || !REASONS.includes(reason)) {
      return NextResponse.json({ error: 'Please select a valid reason' }, { status: 400 });
    }
    if (!description?.trim() || description.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide more details (at least 10 characters)' }, { status: 400 });
    }

    const report = await Report.create({
      property: params.id,
      reportedBy: authUser.id,
      reason,
      description: description.trim(),
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'You have already reported this property' }, { status: 409 });
    }
    console.error('[POST /api/properties/[id]/report]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
