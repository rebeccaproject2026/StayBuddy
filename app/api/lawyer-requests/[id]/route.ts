import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import LawyerRequest from '@/models/LawyerRequest';

// PATCH /api/lawyer-requests/[id] — owner accepts or rejects a lawyer request
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateUser(request);
    if (user.role !== 'landlord') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { status } = await request.json();
    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await connectDB();
    const req = await LawyerRequest.findOneAndUpdate(
      { _id: params.id, owner: user.id },
      { status },
      { new: true }
    );
    if (!req) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, request: req });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
