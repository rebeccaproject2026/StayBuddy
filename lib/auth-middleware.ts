import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: 'renter' | 'landlord' | 'admin';
    country: 'fr' | 'in';
  };
}

export async function authenticateUser(request: NextRequest) {
  try {
    await connectDB();

    // ── Try JWT first ──────────────────────────────────────────────────────
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = extractTokenFromHeader(authHeader);
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error('User not found');
      return {
        id: user._id.toString(),
        email: user.email,
        role: user.role as 'renter' | 'landlord' | 'admin',
        country: user.country as 'fr' | 'in',
      };
    }

    // ── Fall back to NextAuth session (Google login) ───────────────────────
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      const user = await User.findById(session.user.id);
      if (!user) throw new Error('User not found');
      return {
        id: user._id.toString(),
        email: user.email,
        role: user.role as 'renter' | 'landlord' | 'admin',
        country: user.country as 'fr' | 'in',
      };
    }

    throw new Error('No valid authentication');
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any) => {
    try {
      const user = await authenticateUser(request);
      (request as AuthenticatedRequest).user = user;
      return handler(request as AuthenticatedRequest, context);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}

export function requireRole(roles: string[]) {
  return function(handler: (request: AuthenticatedRequest, context?: any) => Promise<NextResponse>) {
    return async (request: NextRequest, context?: any) => {
      try {
        const user = await authenticateUser(request);
        
        if (!roles.includes(user.role)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }

        (request as AuthenticatedRequest).user = user;
        return handler(request as AuthenticatedRequest, context);
      } catch (error) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    };
  };
}