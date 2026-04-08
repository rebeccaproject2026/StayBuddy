import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import ContactRequest from '@/models/ContactRequest';
import { authenticateUser } from '@/lib/auth-middleware';

// GET /api/messages/[requestId] — fetch messages for a contact request
export async function GET(req: NextRequest, { params }: { params: { requestId: string } }) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);
    const { requestId } = params;

    const cr = await ContactRequest.findById(requestId).lean() as any;
    if (!cr) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isParticipant =
      cr.renter.toString() === authUser.id ||
      cr.owner.toString() === authUser.id;
    if (!isParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const messages = await Message.find({ contactRequest: requestId })
      .sort({ createdAt: 1 })
      .lean();

    // Mark unseen messages as seen
    await Message.updateMany(
      { contactRequest: requestId, receiver: authUser.id, seenByReceiver: false },
      { seenByReceiver: true }
    );

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    console.error('[GET /api/messages]', err);
    if (err.message?.includes('Authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages/[requestId] — send a message (REST fallback)
export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);
    const { requestId } = params;
    const { text } = await req.json();

    if (!text?.trim()) return NextResponse.json({ error: 'Message text required' }, { status: 400 });

    const cr = await ContactRequest.findById(requestId).lean() as any;
    if (!cr) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isParticipant =
      cr.renter.toString() === authUser.id ||
      cr.owner.toString() === authUser.id;
    if (!isParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const receiverId = cr.renter.toString() === authUser.id
      ? cr.owner.toString()
      : cr.renter.toString();

    const message = await Message.create({
      contactRequest: requestId,
      sender: authUser.id,
      receiver: receiverId,
      text: text.trim(),
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/messages]', err);
    if (err.message?.includes('Authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
