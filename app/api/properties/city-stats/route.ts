import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

// GET /api/properties/city-stats?country=in&cities=Ahmedabad,Surat
// GET /api/properties/city-stats?country=in&top=8   ← returns top N cities by listing count
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const citiesParam = searchParams.get('cities');
    const top = parseInt(searchParams.get('top') || '0', 10);

    const baseFilter: Record<string, any> = {
      $or: [{ approvalStatus: 'approved' }, { approvalStatus: { $exists: false } }],
    };
    if (country) baseFilter.country = country;

    // Mode 1: fixed city list
    if (citiesParam) {
      const cities = citiesParam.split(',').map((c) => c.trim()).filter(Boolean);
      const filter = { ...baseFilter, location: { $in: cities } };
      const stats = await Property.aggregate([
        { $match: filter },
        { $group: { _id: '$location', count: { $sum: 1 } } },
      ]);
      const result: Record<string, number> = {};
      for (const s of stats) result[s._id] = s.count;
      return NextResponse.json({ success: true, counts: result });
    }

    // Mode 2: top N cities
    const limit = top > 0 ? top : 10;
    const stats = await Property.aggregate([
      { $match: baseFilter },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const cities = stats.map((s: any) => ({ name: s._id as string, count: s.count as number }));
    return NextResponse.json({ success: true, cities });
  } catch (error: any) {
    console.error('[GET /api/properties/city-stats]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
