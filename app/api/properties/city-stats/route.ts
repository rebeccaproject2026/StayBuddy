import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

// GET /api/properties/city-stats?country=in&cities=Ahmedabad,Surat,Vadodara
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const citiesParam = searchParams.get('cities');

    if (!citiesParam) {
      return NextResponse.json({ error: 'cities param required' }, { status: 400 });
    }

    const cities = citiesParam.split(',').map((c) => c.trim()).filter(Boolean);

    const filter: Record<string, any> = {
      location: { $in: cities },
      $or: [{ approvalStatus: 'approved' }, { approvalStatus: { $exists: false } }],
    };
    if (country) filter.country = country;

    const stats = await Property.aggregate([
      { $match: filter },
      { $group: { _id: '$location', count: { $sum: 1 } } },
    ]);

    const result: Record<string, number> = {};
    for (const s of stats) {
      result[s._id] = s.count;
    }

    return NextResponse.json({ success: true, counts: result });
  } catch (error: any) {
    console.error('[GET /api/properties/city-stats]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
