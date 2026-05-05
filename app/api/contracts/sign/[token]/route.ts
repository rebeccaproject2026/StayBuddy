import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contract from '@/models/Contract';

// GET — fetch contract by tenant sign token (public, no auth)
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await connectDB();
    const contract = await Contract.findOne({ tenantSignToken: params.token })
      .populate('owner', 'fullName email')
      .populate('lawyer', 'fullName email barCouncilNumber')
      .lean() as any;

    if (!contract) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });
    if (contract.status === 'TENANT_SIGNED') {
      return NextResponse.json({ error: 'This contract has already been signed' }, { status: 410 });
    }
    if (contract.status !== 'PENDING_TENANT_REVIEW') {
      return NextResponse.json({ error: 'This link is no longer active' }, { status: 410 });
    }

    // Return contract without sensitive token
    const { tenantSignToken: _, ...safe } = contract;
    return NextResponse.json({ success: true, contract: safe });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — tenant submits signature
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    await connectDB();
    const contract = await Contract.findOne({ tenantSignToken: params.token }).lean() as any;

    if (!contract) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });
    if (contract.status !== 'PENDING_TENANT_REVIEW') {
      return NextResponse.json({ error: 'This link is no longer active' }, { status: 410 });
    }

    const { tenantSignature } = await request.json();
    if (!tenantSignature) return NextResponse.json({ error: 'Signature is required' }, { status: 400 });

    await Contract.findByIdAndUpdate(contract._id, {
      status: 'TENANT_SIGNED',
      tenantSignature,
      tenantSignedAt: new Date(),
      tenantSignToken: null, // invalidate token
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
