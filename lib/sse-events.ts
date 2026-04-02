/**
 * SSE event broadcaster for admin property/lead events.
 * Kept outside the route file so Next.js doesn't complain about
 * non-HTTP exports in route modules.
 */

const clients = new Set<ReadableStreamDefaultController>();

export function addSseClient(ctrl: ReadableStreamDefaultController) {
  clients.add(ctrl);
}

export function removeSseClient(ctrl: ReadableStreamDefaultController) {
  clients.delete(ctrl);
}

function broadcast(payload: object) {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  clients.forEach(ctrl => {
    try { ctrl.enqueue(new TextEncoder().encode(data)); } catch { /* disconnected */ }
  });
}

export function notifyNewProperty() {
  broadcast({ type: 'new_property', ts: Date.now() });
}

export function notifyNewLead() {
  broadcast({ type: 'new_lead', ts: Date.now() });
}
