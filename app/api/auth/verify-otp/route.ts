import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const db = await getDB();
    const emailLower = email.toLowerCase().trim();
    const otpTrimmed = String(otp).trim();

    const userDoc = await db.collection('users').findOne({ email: emailLower });

    console.log('[verify-otp] email:', emailLower);
    console.log('[verify-otp] received otp:', otpTrimmed);
    console.log('[verify-otp] db otpCode:', userDoc?.otpCode);
    console.log('[verify-otp] isVerified:', userDoc?.isVerified);
    console.log('[verify-otp] otpExpires:', userDoc?.otpExpires);

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userDoc.isVerified) {
      return NextResponse.json({ error: 'Account is already verified' }, { status: 400 });
    }

    if (!userDoc.otpCode || !userDoc.otpExpires) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new one.' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(userDoc.otpExpires)) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (String(userDoc.otpCode).trim() !== otpTrimmed) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    await db.collection('users').updateOne(
      { email: emailLower },
      {
        $set: { isVerified: true },
        $unset: { otpCode: '', otpExpires: '' },
      }
    );

    return NextResponse.json(
      { message: 'Email verified successfully! You can now log in.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[verify-otp] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
