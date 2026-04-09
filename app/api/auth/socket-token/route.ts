import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/socket-token
 * Issues a real JWT for users authenticated via NextAuth (Google OAuth).
 * This token can be used for socket.io auth and Bearer-authenticated API calls.
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id)
      .select('_id email role country isBlocked')
      .lean() as any;

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.isBlocked) return NextResponse.json({ error: 'Account blocked' }, { status: 403 });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      country: user.country,
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error('[socket-token]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
