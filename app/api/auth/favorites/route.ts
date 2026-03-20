import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET /api/auth/favorites — return user's favorited properties
export async function GET(req: NextRequest) {
  try {
    const authUser = await authenticateUser(req);
    await connectDB();

    const user = await User.findById(authUser.id).populate('favorites');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, favorites: user.favorites });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST /api/auth/favorites — toggle a property favorite
export async function POST(req: NextRequest) {
  try {
    const authUser = await authenticateUser(req);
    const { propertyId } = await req.json();

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(authUser.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const objId = new mongoose.Types.ObjectId(propertyId);
    const idx = user.favorites.findIndex((f: mongoose.Types.ObjectId) => f.equals(objId));

    let isFavorite: boolean;
    if (idx === -1) {
      user.favorites.push(objId);
      isFavorite = true;
    } else {
      user.favorites.splice(idx, 1);
      isFavorite = false;
    }

    await user.save();

    return NextResponse.json({ success: true, isFavorite, favoriteIds: user.favorites.map((f: mongoose.Types.ObjectId) => f.toString()) });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
