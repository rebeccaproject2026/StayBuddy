import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireRole } from '@/lib/auth-middleware';

// GET /api/admin/stats - Get platform statistics (Admin only)
export const GET = requireRole(['admin'])(async (request) => {
  try {
    await connectDB();

    // Get user counts by role
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user counts by country
    const countryStats = await User.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get verified vs unverified users
    const verificationStats = await User.aggregate([
      {
        $group: {
          _id: '$isVerified',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsersCount = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get total users
    const totalUsers = await User.countDocuments();

    // Format the stats
    const roleStats = {
      renter: 0,
      landlord: 0,
      admin: 0
    };

    userStats.forEach(stat => {
      if (stat._id in roleStats) {
        roleStats[stat._id as keyof typeof roleStats] = stat.count;
      }
    });

    const countryStatsFormatted = {
      fr: 0,
      in: 0
    };

    countryStats.forEach(stat => {
      if (stat._id in countryStatsFormatted) {
        countryStatsFormatted[stat._id as keyof typeof countryStatsFormatted] = stat.count;
      }
    });

    const verificationStatsFormatted = {
      verified: 0,
      unverified: 0
    };

    verificationStats.forEach(stat => {
      if (stat._id === true) {
        verificationStatsFormatted.verified = stat.count;
      } else {
        verificationStatsFormatted.unverified = stat.count;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        recentUsersCount,
        roleStats,
        countryStats: countryStatsFormatted,
        verificationStats: verificationStatsFormatted
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});