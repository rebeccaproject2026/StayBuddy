import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import { authenticateUser } from '@/lib/auth-middleware';

// GET /api/notifications/count — unread message count for the current user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);

    const count = await Message.countDocuments({
      receiver: authUser.id,
      seenByReceiver: false,
    });

    return NextResponse.json({ success: true, count });
  } catch (err: any) {
    if (err.message?.includes('Authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
