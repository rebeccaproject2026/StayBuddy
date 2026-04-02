import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Map: roomKey → Set of connected WebSocket clients
// roomKey can be a requestId (chat room) or "notif:{userId}" (notification room)
const rooms = new Map<string, Set<WebSocket>>();

function joinRoom(roomKey: string, ws: WebSocket) {
  if (!rooms.has(roomKey)) rooms.set(roomKey, new Set());
  rooms.get(roomKey)!.add(ws);
}

function leaveRoom(roomKey: string, ws: WebSocket) {
  rooms.get(roomKey)?.delete(ws);
  if (rooms.get(roomKey)?.size === 0) rooms.delete(roomKey);
}

function broadcast(roomKey: string, payload: object, exclude?: WebSocket) {
  const data = JSON.stringify(payload);
  rooms.get(roomKey)?.forEach(client => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Notify a specific user that their unread count changed
export function notifyUser(userId: string, payload: object) {
  broadcast(`notif:${userId}`, payload);
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ noServer: true });

  // Upgrade HTTP → WebSocket only for /ws path
  server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url || '', true);
    if (pathname === '/ws') {
      wss.handleUpgrade(req, socket as any, head, ws => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws: WebSocket) => {
    let currentRoom: string | null = null;
    let notifRoom: string | null = null;
    let userId: string | null = null;

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        // Join a chat room (existing behaviour)
        if (msg.type === 'join') {
          if (currentRoom) leaveRoom(currentRoom, ws);
          currentRoom = msg.requestId as string;
          userId = msg.userId as string;
          joinRoom(currentRoom, ws);
          ws.send(JSON.stringify({ type: 'joined', requestId: currentRoom }));
          return;
        }

        // Join a personal notification room
        if (msg.type === 'join_notif') {
          if (notifRoom) leaveRoom(notifRoom, ws);
          notifRoom = `notif:${msg.userId as string}`;
          joinRoom(notifRoom, ws);
          ws.send(JSON.stringify({ type: 'notif_joined' }));
          return;
        }

        if (msg.type === 'message' && currentRoom) {
          // Broadcast to chat room
          broadcast(currentRoom, {
            type: 'message',
            requestId: currentRoom,
            message: msg.message,
          });
          // Notify the recipient's notification room
          if (msg.recipientId) {
            broadcast(`notif:${msg.recipientId}`, {
              type: 'notification',
              requestId: currentRoom,
              message: msg.message,
            });
          }
          return;
        }

        if (msg.type === 'typing' && currentRoom) {
          broadcast(currentRoom, {
            type: 'typing',
            requestId: currentRoom,
            userId,
            senderName: msg.senderName,
            isTyping: msg.isTyping,
          }, ws);
          return;
        }

        if (msg.type === 'read' && currentRoom) {
          broadcast(currentRoom, {
            type: 'read',
            requestId: currentRoom,
            userId,
          }, ws);
          return;
        }

      } catch {
        // ignore malformed messages
      }
    });

    ws.on('close', () => {
      if (currentRoom) leaveRoom(currentRoom, ws);
      if (notifRoom) leaveRoom(notifRoom, ws);
    });

    ws.on('error', () => {
      if (currentRoom) leaveRoom(currentRoom, ws);
      if (notifRoom) leaveRoom(notifRoom, ws);
    });
  });

  const PORT = parseInt(process.env.PORT || '3000', 10);
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT} (WebSocket on ws://localhost:${PORT}/ws)`);
  });
});
