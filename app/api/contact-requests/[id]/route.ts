import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactRequest from '@/models/ContactRequest';
import { authenticateUser } from '@/lib/auth-middleware';

// PATCH /api/contact-requests/[id] — owner accepts or rejects
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);

    const { status } = await req.json();
    if (!['new', 'contacted', 'interested', 'booked', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const request = await ContactRequest.findById(params.id);
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.owner.toString() !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    request.status = status;
    await request.save();

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    if (err.message?.includes('token') || err.message?.includes('Authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
