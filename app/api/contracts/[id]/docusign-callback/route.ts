import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contract from '@/models/Contract';

/**
 * GET /api/contracts/[id]/docusign-callback?event=signing_complete
 * DocuSign redirects here after the owner signs (or declines/cancels).
 * We mark the contract OWNER_SIGNED and redirect back to the dashboard.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const event = request.nextUrl.searchParams.get('event');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (event === 'signing_complete') {
    try {
      await connectDB();
      await Contract.findByIdAndUpdate(params.id, {
        status: 'OWNER_SIGNED',
        ownerSignedAt: new Date(),
      });
    } catch {
      // best-effort — redirect regardless
    }
    // Close the iframe by redirecting to a tiny page that posts a message to the parent
    return new NextResponse(
      `<!DOCTYPE html><html><body><script>
        window.parent.postMessage({ type: 'DOCUSIGN_SIGNED', contractId: '${params.id}' }, '*');
      </script><p>Signing complete. Closing...</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Declined or cancelled — just close the modal
  return new NextResponse(
    `<!DOCTYPE html><html><body><script>
      window.parent.postMessage({ type: 'DOCUSIGN_CANCELLED', contractId: '${params.id}' }, '*');
    </script><p>Signing cancelled.</p></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
