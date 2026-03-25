import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
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

    const reports = await Report.find({})
      .populate('property', 'title location images propertyType')
      .populate('reportedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('[GET /api/admin/reports]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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

    const { reportId, status } = await req.json();
    if (!reportId || !['reviewed', 'dismissed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const report = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('[PATCH /api/admin/reports]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
