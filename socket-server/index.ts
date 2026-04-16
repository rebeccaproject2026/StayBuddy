import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ── DB connection ──────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;
const PORT = parseInt(process.env.SOCKET_PORT || process.env.WS_PORT || '3001', 10);
const CLIENT_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

let dbConnected = false;
async function connectDB() {
  if (dbConnected) return;
  await mongoose.connect(MONGO_URI);
  dbConnected = true;
  console.log('[socket-server] MongoDB connected');
}

// ── Inline models (avoid Next.js module resolution issues) ────────────────────
import MessageModel from '../models/Message';
import ContactRequestModel from '../models/ContactRequest';
import UserModel from '../models/User';
import { sendChatMessageEmail } from '../lib/email';

// ── Auth middleware ────────────────────────────────────────────────────────────
interface AuthSocket extends Socket {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

function authenticateSocket(socket: AuthSocket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    socket.userId = decoded.userId;
    socket.userEmail = decoded.email;
    socket.userRole = decoded.role;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
}

// ── Email throttle: one email per (sender→receiver) per 5 min ─────────────────
const emailThrottle = new Map<string, number>();
function shouldSendEmail(senderId: string, receiverId: string): boolean {
  const key = `${senderId}:${receiverId}`;
  const last = emailThrottle.get(key) || 0;
  if (Date.now() - last > 5 * 60 * 1000) {
    emailThrottle.set(key, Date.now());
    return true;
  }
  return false;
}

// ── Server setup ───────────────────────────────────────────────────────────────
const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use(authenticateSocket);

// Track online users: userId → Set of socketIds
const onlineUsers = new Map<string, Set<string>>();

io.on('connection', async (socket: AuthSocket) => {
  const userId = socket.userId!;
  console.log(`[socket-server] connected: ${userId}`);

  // Register user as online
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId)!.add(socket.id);

  // Join personal room for targeted notifications
  socket.join(`user:${userId}`);

  // ── Join a chat room ─────────────────────────────────────────────────────────
  socket.on('join_room', async (requestId: string) => {
    try {
      await connectDB();
      const cr = await ContactRequestModel.findById(requestId).lean() as any;
      if (!cr) return socket.emit('error', 'Contact request not found');

      const isParticipant =
        cr.renter.toString() === userId ||
        cr.owner.toString() === userId;
      if (!isParticipant) return socket.emit('error', 'Forbidden');

      socket.join(`chat:${requestId}`);
      socket.emit('joined_room', requestId);
    } catch (err) {
      console.error('[join_room]', err);
    }
  });

  // ── Send a message ───────────────────────────────────────────────────────────
  socket.on('send_message', async (payload: { requestId: string; text: string }) => {
    try {
      await connectDB();
      const { requestId, text } = payload;
      if (!text?.trim()) return;

      const cr = await ContactRequestModel.findById(requestId).lean() as any;
      if (!cr) return socket.emit('error', 'Contact request not found');

      const isParticipant =
        cr.renter.toString() === userId ||
        cr.owner.toString() === userId;
      if (!isParticipant) return socket.emit('error', 'Forbidden');

      const receiverId = cr.renter.toString() === userId
        ? cr.owner.toString()
        : cr.renter.toString();

      const message = await MessageModel.create({
        contactRequest: requestId,
        sender: userId,
        receiver: receiverId,
        text: text.trim(),
      });

      const msgObj = {
        _id: message._id.toString(),
        contactRequest: requestId,
        sender: userId,
        receiver: receiverId,
        text: message.text,
        seenByReceiver: false,
        createdAt: message.createdAt,
      };

      // Broadcast to everyone in the chat room
      io.to(`chat:${requestId}`).emit('new_message', msgObj);

      // Real-time notification to receiver's personal room
      io.to(`user:${receiverId}`).emit('notification', {
        type: 'new_message',
        requestId,
        senderId: userId,
        preview: text.trim().slice(0, 80),
      });

      // Email notification (throttled, fire-and-forget)
      if (shouldSendEmail(userId, receiverId)) {
        try {
          const [sender, receiver] = await Promise.all([
            UserModel.findById(userId).select('fullName').lean() as any,
            UserModel.findById(receiverId).select('fullName email').lean() as any,
          ]);
          if (receiver?.email) {
            const dashboardUrl = `${CLIENT_ORIGIN}/${cr.renter.toString() === receiverId ? 'in' : 'in'}/dashboard/${cr.renter.toString() === receiverId ? 'tenant' : 'owner'}?tab=messages`;
            sendChatMessageEmail(
              receiver.email,
              receiver.fullName || 'User',
              sender?.fullName || 'Someone',
              cr.propertyType || 'Tenant',
              cr.pgName || '',
              cr.societyName || cr.propertyTitle || 'a property',
              text.trim().slice(0, 120),
              dashboardUrl
            ).catch(e => console.error('[email]', e));
          }
        } catch (e) {
          console.error('[email lookup]', e);
        }
      }
    } catch (err) {
      console.error('[send_message]', err);
    }
  });

  // ── Mark messages as seen ────────────────────────────────────────────────────
  socket.on('mark_seen', async (requestId: string) => {
    try {
      await connectDB();
      await MessageModel.updateMany(
        { contactRequest: requestId, receiver: userId, seenByReceiver: false },
        { seenByReceiver: true }
      );
      // Notify sender that messages were seen
      io.to(`chat:${requestId}`).emit('messages_seen', { requestId, seenBy: userId });
    } catch (err) {
      console.error('[mark_seen]', err);
    }
  });

  // ── Disconnect ───────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const sockets = onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) onlineUsers.delete(userId);
    }
    console.log(`[socket-server] disconnected: ${userId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[socket-server] Socket.IO server running on port ${PORT}`);
});
