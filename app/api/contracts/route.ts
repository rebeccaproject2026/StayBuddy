import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import Contract from '@/models/Contract';
import User from '@/models/User';
import Property from '@/models/Property';

// GET /api/contracts — list contracts for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    await connectDB();

    let contracts;
    if (user.role === 'lawyer') {
      contracts = await Contract.find({ lawyer: user.id })
        .populate('owner', 'fullName email phoneNumber profileImage')
        .populate('property', 'title location areaName price images pgName societyName')
        .sort({ createdAt: -1 })
        .lean();
    } else if (user.role === 'landlord') {
      contracts = await Contract.find({ owner: user.id })
        .populate('lawyer', 'fullName email phoneNumber profileImage barCouncilNumber experienceYears')
        .populate('property', 'title location areaName price images pgName societyName')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, contracts });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST /api/contracts — lawyer creates a new contract (DRAFT)
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (user.role !== 'lawyer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { ownerId, propertyId } = body;

    if (!ownerId) {
      return NextResponse.json({ error: 'ownerId is required' }, { status: 400 });
    }

    await connectDB();

    // Auto-fill owner details
    const owner = await User.findById(ownerId).select('fullName email phoneNumber').lean() as any;
    if (!owner) return NextResponse.json({ error: 'Owner not found' }, { status: 404 });

    // Auto-fill property details if provided
    let propertyAddress = '';
    let monthlyRent = 0;
    let securityDeposit = 0;
    if (propertyId) {
      const prop = await Property.findById(propertyId).select('fullAddress location price deposit').lean() as any;
      if (prop) {
        propertyAddress = prop.fullAddress || prop.location || '';
        monthlyRent = prop.price || 0;
        securityDeposit = prop.deposit || 0;
      }
    }

    // Default terms template
    const defaultTerms = `RENTAL AGREEMENT

This Rental Agreement is entered into between:

OWNER: ${owner.fullName}
Email: ${owner.email}
Phone: ${owner.phoneNumber || '—'}

PROPERTY ADDRESS: ${propertyAddress || '[Property Address]'}

TERMS AND CONDITIONS:
1. The tenant agrees to pay the monthly rent on or before the 5th of each month.
2. The security deposit is refundable at the end of the lease, subject to deductions for damages.
3. The tenant shall not sublet the property without prior written consent from the owner.
4. The tenant shall maintain the property in good condition.
5. Any modifications to the property require written approval from the owner.
6. Utilities (electricity, water, gas) are the responsibility of the tenant unless otherwise agreed.
7. The tenant shall allow the owner reasonable access for inspections with prior notice.`;

    const defaultPolicies = `POLICIES:
- No smoking inside the premises.
- Pets are not allowed without prior written consent.
- Noise levels must be kept reasonable, especially between 10 PM and 8 AM.
- Garbage disposal must follow local municipal guidelines.
- Parking (if applicable) is limited to designated areas only.`;

    const contract = await Contract.create({
      lawyer: user.id,
      owner: ownerId,
      property: propertyId || undefined,
      propertyAddress,
      monthlyRent,
      securityDeposit,
      terms: defaultTerms,
      policies: defaultPolicies,
      status: 'DRAFT',
    });

    const populated = await Contract.findById(contract._id)
      .populate('owner', 'fullName email phoneNumber profileImage')
      .populate('property', 'title location areaName price images pgName societyName')
      .lean();

    return NextResponse.json({ success: true, contract: populated }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
