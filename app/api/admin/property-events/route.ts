import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

const clients = new Set<ReadableStreamDefaultController>();

export function notifyNewProperty() {
  const data = `data: ${JSON.stringify({ type: 'new_property', ts: Date.now() })}\n\n`;
  clients.forEach(ctrl => {
    try { ctrl.enqueue(new TextEncoder().encode(data)); } catch { /* disconnected */ }
  });
}

export function notifyNewLead() {
  const data = `data: ${JSON.stringify({ type: 'new_lead', ts: Date.now() })}\n\n`;
  clients.forEach(ctrl => {
    try { ctrl.enqueue(new TextEncoder().encode(data)); } catch { /* disconnected */ }
  });
}

export async function GET(req: NextRequest) {
  // Auth via query param (EventSource can't set headers)
  const token = new URL(req.url).searchParams.get('token');
  if (!token) return new Response('Unauthorized', { status: 401 });

  try {
    const decoded = verifyToken(token);
    await connectDB();
    const user = await User.findById(decoded.userId).select('role').lean();
    if (!user || (user as any).role !== 'admin') {
      return new Response('Forbidden', { status: 403 });
    }
  } catch {
    return new Response('Unauthorized', { status: 401 });
  }

  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      clients.add(ctrl);
      ctrl.enqueue(new TextEncoder().encode(': connected\n\n'));
    },
    cancel() {
      clients.delete(controller);
    },
  });

  const ping = setInterval(() => {
    try {
      controller.enqueue(new TextEncoder().encode(': ping\n\n'));
    } catch {
      clearInterval(ping);
    }
  }, 25_000);

  req.signal.addEventListener('abort', () => {
    clearInterval(ping);
    clients.delete(controller);
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
