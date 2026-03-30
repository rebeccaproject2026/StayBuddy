import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactRequest from '@/models/ContactRequest';
import Message from '@/models/Message';
import { authenticateUser } from '@/lib/auth-middleware';
import mongoose from 'mongoose';

// GET /api/notifications/count
// Returns count of conversations that have at least one unread message
// (sent by the other party and not yet in readBy for the current user)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);

    if (authUser.role !== 'landlord' && authUser.role !== 'renter') {
      return NextResponse.json({ success: true, newInquiries: 0, unreadMessages: 0, total: 0 });
    }

    const userId = new mongoose.Types.ObjectId(authUser.id);

    // Get all contact requests for this user
    const filter = authUser.role === 'landlord'
      ? { owner: userId }
      : { renter: userId };

    const requests = await ContactRequest.find(filter).select('_id').lean();
    const requestIds = requests.map((r: any) => r._id);

    if (requestIds.length === 0) {
      return NextResponse.json({ success: true, newInquiries: 0, unreadMessages: 0, total: 0 });
    }

    // Count distinct conversations that have at least one message:
    // - NOT sent by the current user
    // - NOT already in readBy for the current user
    const unreadConversations = await Message.aggregate([
      {
        $match: {
          contactRequest: { $in: requestIds },
          sender: { $ne: userId },
          readBy: { $not: { $elemMatch: { $eq: userId } } },
        },
      },
      {
        $group: { _id: '$contactRequest' },
      },
    ]);

    const total = unreadConversations.length;
    return NextResponse.json({ success: true, newInquiries: 0, unreadMessages: total, total });
  } catch {
    return NextResponse.json({ success: true, newInquiries: 0, unreadMessages: 0, total: 0 });
  }
}
