import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth-middleware';
import Contract from '@/models/Contract';
import { sendContractPdfEmail } from '@/lib/email';

// POST /api/contracts/[id]/send-pdf
// Lawyer sends the fully-executed contract PDF to owner and tenant
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateUser(request);
    if (user.role !== 'lawyer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const contract = await Contract.findById(params.id)
      .populate('owner', 'fullName email')
      .populate('lawyer', 'fullName email')
      .lean() as any;

    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (contract.lawyer?._id?.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (contract.status !== 'TENANT_SIGNED') {
      return NextResponse.json({ error: 'Contract must be fully executed before sending PDF' }, { status: 400 });
    }

    const { pdfBase64 } = await request.json();
    if (!pdfBase64) {
      return NextResponse.json({ error: 'pdfBase64 is required' }, { status: 400 });
    }

    const lawyerName = contract.lawyer?.fullName || 'Your lawyer';
    const propertyAddress = contract.propertyAddress || '';

    const sends: Promise<void>[] = [];

    // Send to owner
    if (contract.owner?.email) {
      sends.push(
        sendContractPdfEmail({
          recipientEmail: contract.owner.email,
          recipientName: contract.owner.fullName || 'Owner',
          role: 'owner',
          lawyerName,
          propertyAddress,
          pdfBase64,
        }).catch(() => {})
      );
    }

    // Send to tenant
    if (contract.tenantEmail) {
      sends.push(
        sendContractPdfEmail({
          recipientEmail: contract.tenantEmail,
          recipientName: contract.tenantName || 'Tenant',
          role: 'tenant',
          lawyerName,
          propertyAddress,
          pdfBase64,
        }).catch(() => {})
      );
    }

    await Promise.all(sends);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
