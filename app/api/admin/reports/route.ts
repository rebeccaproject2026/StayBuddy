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

    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');

    const filter: Record<string, any> = {};

    const reports = await Report.find(filter)
      .populate({
        path: 'property',
        select: 'title location images propertyType country',
        ...(country ? { match: { country } } : {}),
      })
      .populate('reportedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    // Remove reports where property didn't match the country filter (populate returns null)
    const filtered = country ? reports.filter(r => r.property != null) : reports;

    return NextResponse.json({ success: true, reports: filtered });
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

export async function DELETE(req: NextRequest) {
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

    const { reportId } = await req.json();
    if (!reportId) return NextResponse.json({ error: 'reportId required' }, { status: 400 });

    const report = await Report.findByIdAndDelete(reportId);
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/admin/reports]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
