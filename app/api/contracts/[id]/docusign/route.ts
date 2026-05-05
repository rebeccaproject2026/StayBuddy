import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import Contract from '@/models/Contract';
import { buildContractDocument, createSigningUrl } from '@/lib/docusign';

/**
 * POST /api/contracts/[id]/docusign
 * Owner calls this to get a DocuSign embedded signing URL.
 * Returns { signingUrl } which the frontend opens in a modal.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateUser(request);
    if (user.role !== 'landlord') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const contract = await Contract.findById(params.id)
      .populate('owner', 'fullName email')
      .populate('lawyer', 'fullName email')
      .lean() as any;

    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (contract.owner._id.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (contract.status !== 'PENDING_OWNER_REVIEW') {
      return NextResponse.json({ error: 'Contract is not ready for signing' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${appUrl}/api/contracts/${params.id}/docusign-callback?event=signing_complete`;

    const documentBase64 = buildContractDocument({
      ...contract,
      owner: contract.owner,
      lawyer: contract.lawyer,
    });

    const signingUrl = await createSigningUrl({
      contractId: params.id,
      ownerName: contract.owner.fullName,
      ownerEmail: contract.owner.email,
      documentBase64,
      returnUrl,
    });

    return NextResponse.json({ success: true, signingUrl });
  } catch (error: any) {
    const isConfig = error?.message?.includes('not configured');
    return NextResponse.json(
      { error: error?.message || 'DocuSign error', isConfigError: isConfig },
      { status: isConfig ? 503 : 500 }
    );
  }
}
