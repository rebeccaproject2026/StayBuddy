import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import '@/models/User'; // ensure User model is registered for populate
import { authenticateUser } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    let authUser;
    try {
      authUser = await authenticateUser(req);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // pending | approved | rejected | all

    const filter: Record<string, any> = {};
    if (status && status !== 'all') {
      if (status === 'approved') {
        // Include both explicitly approved AND legacy properties (no approvalStatus field)
        filter.$or = [
          { approvalStatus: 'approved' },
          { approvalStatus: { $exists: false } },
        ];
      } else {
        filter.approvalStatus = status;
      }
    }

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'fullName email phoneNumber createdAt')
      .lean();

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error('[GET /api/admin/properties]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
