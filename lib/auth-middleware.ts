import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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
    // Connect to database
    await connectDB();

    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    // Verify token
    const decoded = verifyToken(token);

    // Find user to ensure they still exist
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      country: user.country,
    };
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