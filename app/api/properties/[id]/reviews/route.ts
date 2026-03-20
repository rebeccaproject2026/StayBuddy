import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Property from '@/models/Property';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET - Fetch all reviews for a property
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const propertyId = params.id;

    const reviews = await Review.find({ property: propertyId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Submit a review
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const propertyId = params.id;

    // Verify authentication
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { rating, comment } = await req.json();

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      property: propertyId,
      user: decoded.userId,
    });

    if (existingReview) {
      // Update existing review
      const dbUser = await User.findById(decoded.userId).select('fullName profileImage');
      existingReview.rating = rating;
      existingReview.comment = comment.trim();
      existingReview.userName = dbUser?.fullName || decoded.email;
      existingReview.userImage = dbUser?.profileImage;
      await existingReview.save();

      return NextResponse.json({
        success: true,
        message: 'Review updated successfully',
        review: existingReview,
      });
    } else {
      // Create new review
      const dbUser = await User.findById(decoded.userId).select('fullName profileImage');
      const review = await Review.create({
        property: propertyId,
        user: decoded.userId,
        userName: dbUser?.fullName || decoded.email,
        userImage: dbUser?.profileImage,
        rating,
        comment: comment.trim(),
      });

      return NextResponse.json({
        success: true,
        message: 'Review submitted successfully',
        review,
      }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
