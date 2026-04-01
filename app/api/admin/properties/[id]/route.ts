import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';
import '@/models/User'; // ensure User model is registered for populate
import { authenticateUser } from '@/lib/auth-middleware';
import mongoose from 'mongoose';
import { sendPropertyApprovedEmail, sendPropertyVerifiedEmail, sendNewPropertyEmail } from '@/lib/email';

// PATCH /api/admin/properties/[id]
// body: { action: 'approve' | 'reject' | 'verify' }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    const { action } = await req.json();
    if (!['approve', 'reject', 'verify'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const update: Record<string, any> = {};
    if (action === 'approve')  update.approvalStatus = 'approved';
    if (action === 'reject')   update.approvalStatus = 'rejected';
    if (action === 'verify')   update.isVerified = true;

    const property = await Property.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true }
    ).populate('createdBy', 'fullName email').lean();

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Send email to owner (fire-and-forget)
    const owner = (property as any).createdBy as { fullName?: string; email?: string } | null;
    if (owner?.email) {
      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const propertyUrl = `${baseUrl}/in/property/${params.id}`;
      if (action === 'approve') {
        sendPropertyApprovedEmail(owner.email, owner.fullName || 'Owner', (property as any).title, propertyUrl)
          .catch(err => console.error('[email] Approved notification failed:', err));

        // Notify subscribers — only now that the property is live
        sendNewPropertyEmail({
          _id: params.id,
          title: (property as any).title,
          location: (property as any).location,
          price: (property as any).price,
          propertyType: (property as any).propertyType,
          country: (property as any).country,
        }).catch(err => console.error('[email] Subscriber new-property notification failed:', err));
      }
      if (action === 'verify') {
        sendPropertyVerifiedEmail(owner.email, owner.fullName || 'Owner', (property as any).title, propertyUrl)
          .catch(err => console.error('[email] Verified notification failed:', err));
      }
    }

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error('[PATCH /api/admin/properties/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
