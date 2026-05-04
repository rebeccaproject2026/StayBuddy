import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateUser } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

// GET — list all lawyer accounts (pending + approved)
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
    const status = searchParams.get('status'); // 'pending' | 'approved' | null (all)

    const filter: Record<string, any> = { role: 'lawyer' };
    if (status === 'pending') filter.isApproved = false;
    else if (status === 'approved') filter.isApproved = true;

    const lawyers = await User.find(filter)
      .select('-password -otpCode -otpExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, lawyers });
  } catch (error) {
    console.error('[GET /api/admin/lawyers]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — approve or reject a lawyer
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

    const { lawyerId, isApproved } = await req.json();
    if (!lawyerId || typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const lawyer = await User.findOne({ _id: lawyerId, role: 'lawyer' });
    if (!lawyer) {
      return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    lawyer.isApproved = isApproved;
    await lawyer.save({ validateModifiedOnly: true });

    return NextResponse.json({ success: true, isApproved: lawyer.isApproved });
  } catch (error) {
    console.error('[PATCH /api/admin/lawyers]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
