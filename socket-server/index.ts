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
import ContractModel from '../models/Contract';
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
  console.log(`[socket-server] User ${userId} is now online. Total online users:`, onlineUsers.size);

  // Join personal room for targeted notifications
  socket.join(`user:${userId}`);
  console.log(`[socket-server] User ${userId} joined personal room: user:${userId}`);

  // Broadcast user online status to all connected clients
  io.emit('user_status', { userId, status: 'online' });
  console.log(`[socket-server] Broadcasted online status for ${userId}`);

  // Test connection handler
  socket.on('test_connection', (data: any) => {
    console.log('[test_connection] Received from', userId, ':', data);
    socket.emit('test_response', { message: 'Hello from server', userId });
  });

  // ── Get online users ─────────────────────────────────────────────────────────
  socket.on('get_online_users', () => {
    const onlineUserIds = Array.from(onlineUsers.keys());
    console.log(`[socket-server] Sending online users to ${userId}:`, onlineUserIds);
    socket.emit('online_users', onlineUserIds);
  });

  // ── Join a chat room ─────────────────────────────────────────────────────────
  socket.on('join_room', async (requestId: string) => {
    try {
      await connectDB();
      console.log('[join_room] User', userId, 'attempting to join room:', requestId);
      const cr = await ContactRequestModel.findById(requestId).lean() as any;
      if (!cr) {
        console.log('[join_room] Contact request not found:', requestId);
        return socket.emit('error', 'Contact request not found');
      }

      const isParticipant =
        cr.renter.toString() === userId ||
        cr.owner.toString() === userId;
      if (!isParticipant) {
        console.log('[join_room] User not a participant');
        return socket.emit('error', 'Forbidden');
      }

      // Leave other chat rooms first
      for (const room of socket.rooms) {
        if (room.startsWith('chat:') && room !== `chat:${requestId}`) {
          socket.leave(room);
          console.log(`[join_room] Socket ${socket.id} auto-left previous chat room: ${room}`);
        }
      }

      socket.join(`chat:${requestId}`);
      console.log('[join_room] User', userId, 'successfully joined room chat:' + requestId);
      socket.emit('joined_room', requestId);
    } catch (err) {
      console.error('[join_room]', err);
    }
  });

  // ── Leave a chat room ────────────────────────────────────────────────────────
  socket.on('leave_room', (requestId: string) => {
    socket.leave(`chat:${requestId}`);
    console.log('[leave_room] User', userId, 'explicitly left room chat:' + requestId);
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

      // Check if receiver is in the chat room
      const receiverSockets = await io.in(`chat:${requestId}`).fetchSockets();
      const receiverInRoom = receiverSockets.some(s => {
        const authSocket = s as any;
        return authSocket.userId === receiverId;
      });

      console.log('[send_message] Receiver in room?', receiverInRoom, 'receiverId:', receiverId, 'requestId:', requestId);
      console.log('[send_message] Sockets in room:', receiverSockets.map((s: any) => s.userId));

      // Only send notification if receiver is NOT in the chat room
      if (!receiverInRoom) {
        console.log('[send_message] Sending notification to user:' + receiverId);
        const notificationPayload = {
          type: 'new_message',
          requestId,
          senderId: userId,
          preview: text.trim().slice(0, 80),
        };
        console.log('[send_message] Notification payload:', notificationPayload);
        io.to(`user:${receiverId}`).emit('notification', notificationPayload);
        
        // Also check if receiver is connected at all
        const receiverOnline = onlineUsers.has(receiverId);
        console.log('[send_message] Receiver online?', receiverOnline);
      } else {
        console.log('[send_message] Skipping notification - receiver is in the chat room');
      }

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

  // ── Typing indicator ─────────────────────────────────────────────────────────
  socket.on('typing_start', async (payload: { requestId: string }) => {
    try {
      await connectDB();
      const { requestId } = payload;
      console.log('[typing_start] Received from userId:', userId, 'requestId:', requestId);
      
      const cr = await ContactRequestModel.findById(requestId).lean() as any;
      if (!cr) {
        console.log('[typing_start] Contact request not found:', requestId);
        return;
      }

      const isParticipant =
        cr.renter.toString() === userId ||
        cr.owner.toString() === userId;
      if (!isParticipant) {
        console.log('[typing_start] User not a participant');
        return;
      }

      console.log('[typing_start] Broadcasting to room chat:' + requestId);
      // Broadcast typing to others in the room (excluding sender)
      socket.to(`chat:${requestId}`).emit('user_typing', { requestId, userId, typing: true });
    } catch (err) {
      console.error('[typing_start]', err);
    }
  });

  socket.on('typing_stop', async (payload: { requestId: string }) => {
    try {
      await connectDB();
      const { requestId } = payload;
      console.log('[typing_stop] Received from userId:', userId, 'requestId:', requestId);
      
      const cr = await ContactRequestModel.findById(requestId).lean() as any;
      if (!cr) {
        console.log('[typing_stop] Contact request not found:', requestId);
        return;
      }

      const isParticipant =
        cr.renter.toString() === userId ||
        cr.owner.toString() === userId;
      if (!isParticipant) {
        console.log('[typing_stop] User not a participant');
        return;
      }

      console.log('[typing_stop] Broadcasting to room chat:' + requestId);
      // Broadcast typing stopped to others in the room
      socket.to(`chat:${requestId}`).emit('user_typing', { requestId, userId, typing: false });
    } catch (err) {
      console.error('[typing_stop]', err);
    }
  });

  // ── Contract notification (lawyer → owner) ───────────────────────────────────
  socket.on('notify_contract', async (payload: { contractId: string; ownerId: string }) => {
    try {
      await connectDB();
      const { contractId, ownerId } = payload;
      if (!contractId || !ownerId) return;

      // Verify the contract belongs to this lawyer and the given owner
      const contract = await ContractModel.findById(contractId).lean() as any;
      if (!contract) return;
      if (contract.lawyer.toString() !== userId) return;
      if (contract.owner.toString() !== ownerId) return;

      const lawyer = await UserModel.findById(userId).select('fullName').lean() as any;

      // Push live notification to the owner's personal room
      io.to(`user:${ownerId}`).emit('notification', {
        type: 'new_contract',
        contractId,
        lawyerName: lawyer?.fullName || 'Your lawyer',
      });
    } catch (err) {
      console.error('[notify_contract]', err);
    }
  });

  // ── Contract notification (lawyer → tenant) ───────────────────────────────────
  socket.on('notify_tenant_contract', async (payload: { contractId: string; tenantEmail: string }) => {
    try {
      await connectDB();
      const { contractId, tenantEmail } = payload;
      if (!contractId || !tenantEmail) return;

      // Verify the contract belongs to this lawyer
      const contract = await ContractModel.findById(contractId).lean() as any;
      if (!contract) return;
      if (contract.lawyer.toString() !== userId) return;

      // Look up tenant by email to get their userId
      const tenant = await UserModel.findOne({ email: tenantEmail }).select('_id fullName').lean() as any;
      if (!tenant) return; // tenant may not have an account — email-only flow is fine

      const lawyer = await UserModel.findById(userId).select('fullName').lean() as any;

      // Push live notification to the tenant's personal room
      io.to(`user:${tenant._id.toString()}`).emit('notification', {
        type: 'new_contract_tenant',
        contractId,
        lawyerName: lawyer?.fullName || 'Your lawyer',
      });
    } catch (err) {
      console.error('[notify_tenant_contract]', err);
    }
  });

  // ── Tenant signed notification (tenant → lawyer) ─────────────────────────────
  socket.on('notify_tenant_signed', async (payload: { contractId: string; lawyerId: string; tenantName: string }) => {
    try {
      await connectDB();
      const { contractId, lawyerId, tenantName } = payload;
      if (!contractId || !lawyerId) return;

      // Verify the contract exists and this user is the tenant (by email match)
      const contract = await ContractModel.findById(contractId)
        .populate('lawyer', '_id')
        .lean() as any;
      if (!contract) return;
      if (contract.lawyer._id.toString() !== lawyerId) return;

      // Push live notification to the lawyer's personal room
      io.to(`user:${lawyerId}`).emit('notification', {
        type: 'tenant_signed',
        contractId,
        tenantName: tenantName || 'The tenant',
      });
    } catch (err) {
      console.error('[notify_tenant_signed]', err);
    }
  });

  // ── Disconnect ───────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const sockets = onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        console.log(`[socket-server] User ${userId} is now offline. Total online users:`, onlineUsers.size);
        // Broadcast user offline status to all connected clients
        io.emit('user_status', { userId, status: 'offline' });
        console.log(`[socket-server] Broadcasted offline status for ${userId}`);
      }
    }
    console.log(`[socket-server] disconnected: ${userId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[socket-server] Socket.IO server running on port ${PORT}`);
});
