import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, country } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const filter: Record<string, any> = { email: email.toLowerCase() };
    if (country) filter.country = country === 'fr' ? 'fr' : 'in';

    const result = await Subscriber.findOneAndUpdate(
      filter,
      { isActive: false },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/unsubscribe]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also support GET for one-click unsubscribe links in emails
// e.g. /api/unsubscribe?email=user@example.com
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const email = req.nextUrl.searchParams.get('email');
    const country = req.nextUrl.searchParams.get('country');

    if (!email) {
      return new Response('<h2>Missing email parameter.</h2>', { headers: { 'Content-Type': 'text/html' } });
    }

    const filter: Record<string, any> = { email: email.toLowerCase() };
    if (country) filter.country = country === 'fr' ? 'fr' : 'in';

    await Subscriber.findOneAndUpdate(filter, { isActive: false });

    return new Response(
      `<html><body style="font-family:sans-serif;text-align:center;padding:60px">
        <h2 style="color:#4f46e5">StayBuddy</h2>
        <p>You've been successfully unsubscribed.</p>
        <p style="color:#6b7280;font-size:14px">You won't receive any more property alerts from us.</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch {
    return new Response('<h2>Something went wrong.</h2>', { headers: { 'Content-Type': 'text/html' } });
  }
}
