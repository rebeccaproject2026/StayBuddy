import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import Contract from '@/models/Contract';
import { sendContractToOwnerEmail, sendContractToTenantEmail } from '@/lib/email';

// GET /api/contracts/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateUser(request);
    await connectDB();

    const contract = await Contract.findById(params.id)
      .populate('owner', 'fullName email phoneNumber profileImage')
      .populate('lawyer', 'fullName email phoneNumber profileImage barCouncilNumber experienceYears')
      .populate('property', 'title location areaName price images pgName societyName')
      .lean() as any;

    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isLawyer = user.role === 'lawyer' && contract.lawyer?._id?.toString() === user.id;
    const isOwner  = user.role === 'landlord' && contract.owner?._id?.toString() === user.id;
    if (!isLawyer && !isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return NextResponse.json({ success: true, contract });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// PATCH /api/contracts/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateUser(request);
    await connectDB();

    const contract = await Contract.findById(params.id)
      .populate('owner', 'fullName email')
      .populate('lawyer', 'fullName email')
      .lean() as any;

    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isLawyer = user.role === 'lawyer' && contract.lawyer?._id?.toString() === user.id;
    const isOwner  = user.role === 'landlord' && contract.owner?._id?.toString() === user.id;

    if (!isLawyer && !isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { action, ...fields } = body;

    let update: Record<string, any> = {};

    if (isLawyer) {
      if (action === 'save') {
        if (!['DRAFT', 'REVISION_REQUIRED'].includes(contract.status)) {
          return NextResponse.json({ error: 'Cannot edit in current status' }, { status: 400 });
        }
        const allowed = ['tenantName','tenantEmail','tenantPhone','propertyAddress',
          'monthlyRent','securityDeposit','leaseDuration','startDate','endDate',
          'noticePeriod','terms','policies','property'];
        for (const key of allowed) {
          if (fields[key] !== undefined) update[key] = fields[key];
        }

      } else if (action === 'send_to_owner') {
        if (!['DRAFT', 'REVISION_REQUIRED'].includes(contract.status)) {
          return NextResponse.json({ error: 'Cannot send in current status' }, { status: 400 });
        }
        update.status = 'PENDING_OWNER_REVIEW';
        const allowed = ['tenantName','tenantEmail','tenantPhone','propertyAddress',
          'monthlyRent','securityDeposit','leaseDuration','startDate','endDate',
          'noticePeriod','terms','policies'];
        for (const key of allowed) {
          if (fields[key] !== undefined) update[key] = fields[key];
        }
        // Send email to owner (fire-and-forget)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const ownerCountry = 'in';
        sendContractToOwnerEmail({
          ownerEmail: contract.owner.email,
          ownerName: contract.owner.fullName,
          lawyerName: contract.lawyer.fullName,
          propertyAddress: fields.propertyAddress || contract.propertyAddress || '',
          monthlyRent: fields.monthlyRent || contract.monthlyRent || 0,
          dashboardUrl: `${appUrl}/${ownerCountry}/dashboard/owner?tab=contracts`,
        }).catch(() => {});

      } else if (action === 'save_tenant') {
        // Allow updating tenant fields when owner has signed (before sending to tenant)
        if (!['DRAFT', 'REVISION_REQUIRED', 'OWNER_SIGNED'].includes(contract.status)) {
          return NextResponse.json({ error: 'Cannot edit tenant details in current status' }, { status: 400 });
        }
        const tenantFields = ['tenantName', 'tenantEmail', 'tenantPhone'];
        for (const key of tenantFields) {
          if (fields[key] !== undefined) update[key] = fields[key];
        }

      } else if (action === 'send_to_tenant') {
        if (contract.status !== 'OWNER_SIGNED') {
          return NextResponse.json({ error: 'Owner must sign before sending to tenant' }, { status: 400 });
        }
        // Use form fields if provided (lawyer may have just updated them), fall back to stored values
        const tenantEmail = fields.tenantEmail || contract.tenantEmail;
        const tenantName = fields.tenantName || contract.tenantName;
        if (!tenantEmail) {
          return NextResponse.json({ error: 'Tenant email is required' }, { status: 400 });
        }
        // Persist any tenant field updates alongside the status change
        if (fields.tenantName !== undefined) update.tenantName = fields.tenantName;
        if (fields.tenantEmail !== undefined) update.tenantEmail = fields.tenantEmail;
        if (fields.tenantPhone !== undefined) update.tenantPhone = fields.tenantPhone;
        // Generate a one-time signing token
        const token = randomBytes(32).toString('hex');
        update.status = 'PENDING_TENANT_REVIEW';
        update.tenantSignToken = token;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const signingUrl = `${appUrl}/sign-contract/${token}`;

        sendContractToTenantEmail({
          tenantEmail,
          tenantName: tenantName || 'Tenant',
          lawyerName: contract.lawyer.fullName,
          ownerName: contract.owner.fullName,
          propertyAddress: contract.propertyAddress || '',
          monthlyRent: contract.monthlyRent || 0,
          securityDeposit: contract.securityDeposit || 0,
          leaseDuration: contract.leaseDuration || '',
          startDate: contract.startDate || '',
          signingUrl,
        }).catch(() => {});
      }
    }

    if (isOwner) {
      if (action === 'sign') {
        if (contract.status !== 'PENDING_OWNER_REVIEW') {
          return NextResponse.json({ error: 'Cannot sign in current status' }, { status: 400 });
        }
        update.status = 'OWNER_SIGNED';
        update.ownerSignedAt = new Date();
        if (fields.ownerSignature) update.ownerSignature = fields.ownerSignature;
      } else if (action === 'request_changes') {
        if (contract.status !== 'PENDING_OWNER_REVIEW') {
          return NextResponse.json({ error: 'Cannot request changes in current status' }, { status: 400 });
        }
        update.status = 'REVISION_REQUIRED';
        update.revisionNote = fields.revisionNote || '';
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid action' }, { status: 400 });
    }

    const updated = await Contract.findByIdAndUpdate(params.id, update, { new: true })
      .populate('owner', 'fullName email phoneNumber profileImage')
      .populate('lawyer', 'fullName email phoneNumber profileImage barCouncilNumber experienceYears')
      .populate('property', 'title location areaName price images pgName societyName')
      .lean();

    return NextResponse.json({ success: true, contract: updated });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
