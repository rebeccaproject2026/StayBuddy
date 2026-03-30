import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { sendSubscribeConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, city, propertyType } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Upsert: if already exists, reactivate and update preferences
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ error: 'already_subscribed' }, { status: 409 });
      }
      // Reactivate
      existing.isActive = true;
      existing.preferences = { city: city || undefined, propertyType: propertyType || undefined };
      await existing.save();
    } else {
      await Subscriber.create({
        email: email.toLowerCase(),
        preferences: { city: city || undefined, propertyType: propertyType || undefined },
        isActive: true,
      });
    }

    // Send confirmation email (fire-and-forget)
    sendSubscribeConfirmationEmail(email, city, propertyType).catch(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'already_subscribed' }, { status: 409 });
    }
    console.error('[POST /api/subscribe]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
