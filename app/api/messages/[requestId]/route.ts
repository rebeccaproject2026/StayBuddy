import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import ContactRequest from '@/models/ContactRequest';
import User from '@/models/User';
import { authenticateUser } from '@/lib/auth-middleware';
import { sendChatMessageEmail } from '@/lib/email';

// GET /api/messages/[requestId] — fetch all messages and mark them as read
export async function GET(req: NextRequest, { params }: { params: { requestId: string } }) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);
    const { requestId } = params;

    const contactReq = await ContactRequest.findById(requestId).lean() as any;
    if (!contactReq) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = contactReq.owner.toString() === authUser.id;
    const isRenter = contactReq.renter.toString() === authUser.id;
    if (!isOwner && !isRenter) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Mark all messages NOT sent by this user as read — fire-and-forget, never block response
    Message.updateMany(
      {
        contactRequest: requestId,
        sender: { $ne: authUser.id },
        readBy: { $ne: authUser.id },
      },
      { $addToSet: { readBy: authUser.id } }
    ).catch(() => {});

    const messages = await Message.find({ contactRequest: requestId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    if (err.message?.includes('token') || err.message?.includes('Authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages/[requestId] — send a message
export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);
    const { requestId } = params;
    const { text } = await req.json();

    if (!text?.trim()) return NextResponse.json({ error: 'Message text is required' }, { status: 400 });

    const contactReq = await ContactRequest.findById(requestId).lean() as any;
    if (!contactReq) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = contactReq.owner.toString() === authUser.id;
    const isRenter = contactReq.renter.toString() === authUser.id;
    if (!isOwner && !isRenter) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const senderUser = await User.findById(authUser.id).select('fullName').lean() as any;
    const senderName = senderUser?.fullName || authUser.email || 'User';

    const message = await Message.create({
      contactRequest: requestId,
      sender: authUser.id,
      senderRole: authUser.role === 'landlord' ? 'landlord' : 'renter',
      senderName,
      text: text.trim(),
    });

    // Send email notification to the OTHER party (fire-and-forget)
    try {
      const recipientId = isOwner ? contactReq.renter : contactReq.owner;
      const recipient = await User.findById(recipientId).select('email fullName country').lean() as any;
      if (recipient?.email) {
        const country = recipient.country || 'in';
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const dashboardUrl = `${baseUrl}/${country}/dashboard/${isOwner ? 'tenant' : 'owner'}`;
        await sendChatMessageEmail(
          recipient.email,
          recipient.fullName || 'there',
          senderName,
          contactReq.propertyTitle,
          text.trim(),
          dashboardUrl
        );
      }
    } catch (mailErr) {
      console.error('[messages] email notification failed:', mailErr);
    }

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('token') || err.message?.includes('Authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/messages/[requestId] — delete all messages in a thread (owner or renter)
export async function DELETE(req: NextRequest, { params }: { params: { requestId: string } }) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req);
    const { requestId } = params;

    const contactReq = await ContactRequest.findById(requestId).lean() as any;
    if (!contactReq) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = contactReq.owner.toString() === authUser.id;
    const isRenter = contactReq.renter.toString() === authUser.id;
    if (!isOwner && !isRenter) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await Message.deleteMany({ contactRequest: requestId });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message?.includes('token') || err.message?.includes('Authorization')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
