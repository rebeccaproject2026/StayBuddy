import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { authenticateUser } from '@/lib/auth-middleware';
import { notifyNewLead } from '@/lib/sse-events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req).catch(() => null);
    if (!authUser || authUser.role !== 'admin')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const filter: Record<string, any> = {};
    if (country) filter.country = country;

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, leads });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req).catch(() => null);
    if (!authUser || authUser.role !== 'admin')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { phone, name, pgName, country } = await req.json();
    if (!phone || !country)
      return NextResponse.json({ error: 'phone and country are required' }, { status: 400 });

    // Upsert — update messageSentAt if same phone+country already exists
    const lead = await Lead.findOneAndUpdate(
      { phone: phone.replace(/\D/g, ''), country },
      { $set: { name, pgName, messageSentAt: new Date() }, $setOnInsert: { status: 'contacted' } },
      { upsert: true, new: true }
    );
    notifyNewLead();
    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req).catch(() => null);
    if (!authUser || authUser.role !== 'admin')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { leadId, status } = await req.json();
    const lead = await Lead.findByIdAndUpdate(leadId, { status }, { new: true });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await authenticateUser(req).catch(() => null);
    if (!authUser || authUser.role !== 'admin')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
