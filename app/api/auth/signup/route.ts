import { NextRequest, NextResponse } from 'next/server';
import connectDB, { getDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signupSchema } from '@/lib/validation';
import { sendOTPEmail } from '@/lib/email';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const db = await getDB();

    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    const emailLower = validatedData.email.toLowerCase().trim();
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('[signup] Generated OTP:', otp, 'for', emailLower);

    const existingDoc = await db.collection('users').findOne({
      email: emailLower,
      country: validatedData.country,
    });

    if (existingDoc) {
      if (existingDoc.isVerified) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
      // Unverified user — update OTP
      await db.collection('users').updateOne(
        { email: emailLower, country: validatedData.country },
        { $set: { otpCode: otp, otpExpires } }
      );
      console.log('[signup] Updated OTP for existing unverified user');
    } else {
      // New user — create via Mongoose for password hashing
      const user = new User({
        fullName: validatedData.fullName,
        email: emailLower,
        phoneNumber: validatedData.phoneNumber,
        password: validatedData.password,
        role: validatedData.role,
        country: validatedData.country,
        isVerified: false,
        otpCode: otp,
        otpExpires,
      });
      await user.save();
      console.log('[signup] Created new user with OTP');
    }

    // Confirm OTP was saved
    const saved = await db.collection('users').findOne({ email: emailLower });
    console.log('[signup] Confirmed saved otpCode:', saved?.otpCode);

    await sendOTPEmail(emailLower, otp, validatedData.fullName);

    return NextResponse.json(
      { message: 'OTP sent to your email. Please verify your account.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[signup] error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
