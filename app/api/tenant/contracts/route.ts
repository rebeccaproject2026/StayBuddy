import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import Contract from '@/models/Contract';
import User from '@/models/User';

// GET /api/tenant/contracts — list contracts sent to the authenticated tenant (by email)
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (user.role !== 'renter') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    // Find the user's email to match against tenantEmail on contracts
    const dbUser = await User.findById(user.id).select('email').lean() as any;
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const contracts = await Contract.find({
      tenantEmail: dbUser.email,
      status: { $in: ['PENDING_TENANT_REVIEW', 'TENANT_SIGNED'] },
    })
      .populate('owner', 'fullName email phoneNumber profileImage')
      .populate('lawyer', 'fullName email barCouncilNumber')
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, contracts });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
