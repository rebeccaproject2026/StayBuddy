import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';
import { sendOTPEmail } from '@/lib/email';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await getDB();
    const emailLower = email.toLowerCase().trim();

    const userDoc = await db.collection('users').findOne({ email: emailLower });

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userDoc.isVerified) {
      return NextResponse.json({ error: 'Account is already verified' }, { status: 400 });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection('users').updateOne(
      { email: emailLower },
      { $set: { otpCode: otp, otpExpires } }
    );

    await sendOTPEmail(emailLower, otp, userDoc.fullName);

    return NextResponse.json({ message: 'New OTP sent to your email.' }, { status: 200 });
  } catch (error: any) {
    console.error('[resend-otp] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
