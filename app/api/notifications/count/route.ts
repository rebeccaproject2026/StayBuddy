import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import { authenticateUser } from '@/lib/auth-middleware';

// GET /api/notifications/count — unread message count for the current user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);

    // Get total count
    const count = await Message.countDocuments({
      receiver: authUser.id,
      seenByReceiver: false,
    });

    // Get per-request breakdown
    const unreadMessages = await Message.find({
      receiver: authUser.id,
      seenByReceiver: false,
    }).select('contactRequest').lean();

    // Count unread messages per contact request
    const unreadByRequest: Record<string, number> = {};
    unreadMessages.forEach((msg: any) => {
      const reqId = msg.contactRequest.toString();
      unreadByRequest[reqId] = (unreadByRequest[reqId] || 0) + 1;
    });

    return NextResponse.json({ success: true, count, unreadByRequest });
  } catch (err: any) {
    if (err.message?.includes('Authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
