import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import { authenticateUser } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { ownerId: string } }) {
  try {
    await connectDB();

    let authUser: any;
    try {
      authUser = await authenticateUser(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'lawyer' && authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const properties = await Property.find({ createdBy: params.ownerId })
      .select('title propertyType location areaName price images approvalStatus isVerified createdAt pgName societyName category')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error('[GET /api/lawyer/owners/[ownerId]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
