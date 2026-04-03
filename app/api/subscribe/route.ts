import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { sendSubscribeConfirmationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, city, propertyType, country } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const subscriberCountry = country === 'fr' ? 'fr' : 'in';

    // Atomic upsert — avoids race conditions and handles old single-email unique index
    const result = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase(), country: subscriberCountry },
      {
        $set: {
          isActive: true,
          country: subscriberCountry,
          preferences: { city: city || undefined, propertyType: propertyType || undefined },
        },
        $setOnInsert: { email: email.toLowerCase() },
      },
      { upsert: true, new: true, runValidators: true }
    );

    // If it was already active before this update, treat as duplicate
    // (findOneAndUpdate returns the updated doc; we can't easily tell if it was already active,
    //  so we just return success — the user gets re-subscribed which is fine)

    // Send confirmation email (fire-and-forget)
    sendSubscribeConfirmationEmail(email, city, propertyType).catch(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'already_subscribed' }, { status: 409 });
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      console.error('[POST /api/subscribe] Validation error:', err.message);
      return NextResponse.json({ error: 'Invalid data', details: err.message }, { status: 400 });
    }
    console.error('[POST /api/subscribe]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
