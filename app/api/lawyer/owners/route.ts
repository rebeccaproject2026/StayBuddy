import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateUser } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Must be an authenticated, approved lawyer
    let authUser: any;
    try {
      authUser = await authenticateUser(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'lawyer' && authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const owners = await User.find({ role: 'landlord', country: 'in' })
      .select('fullName email phoneNumber isVerified isBlocked createdAt profileImage')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, owners });
  } catch (error) {
    console.error('[GET /api/lawyer/owners]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
