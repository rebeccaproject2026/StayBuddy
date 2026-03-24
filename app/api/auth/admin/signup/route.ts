import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod';

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  country: z.enum(['in', 'fr']),
  secret: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, email, password, country, secret } = schema.parse(body);

    // Read at request time so restarts pick up new env values
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    if (ADMIN_SECRET && secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const emailLower = email.toLowerCase().trim();

    const existing = await User.findOne({ email: emailLower, country });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const admin = new User({
      fullName,
      email: emailLower,
      password,
      role: 'admin',
      country,
      isVerified: true,
      provider: 'credentials',
    });

    await admin.save();

    return NextResponse.json({ message: 'Admin account created' }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    console.error('[admin/signup]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
