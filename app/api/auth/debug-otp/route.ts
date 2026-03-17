import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    const conn = await connectDB();
    const { email } = await request.json();

    // Try both ways to get db
    const db1 = mongoose.connection.db;
    const db2 = (conn as any).connection?.db;

    console.log('[debug] mongoose.connection.readyState:', mongoose.connection.readyState);
    console.log('[debug] db1:', !!db1);
    console.log('[debug] db2:', !!db2);

    const db = db1 || db2;
    if (!db) {
      return NextResponse.json({ error: 'No db', readyState: mongoose.connection.readyState });
    }

    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found' });
    }

    return NextResponse.json({
      found: true,
      email: user.email,
      isVerified: user.isVerified,
      hasOtpCode: !!user.otpCode,
      otpCode: user.otpCode,         // show it for debugging
      otpExpires: user.otpExpires,
      otpExpired: user.otpExpires ? new Date() > new Date(user.otpExpires) : null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
