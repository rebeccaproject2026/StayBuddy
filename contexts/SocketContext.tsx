"use client";

import React, {
  createContext, useContext, useEffect, useRef, useState, useCallback,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/token-storage';
import { useAuth } from '@/contexts/AuthContext';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  `http://localhost:${process.env.NEXT_PUBLIC_WS_PORT || 3001}`;

export interface ChatMessage {
  _id: string;
  contactRequest: string;
  sender: string;
  receiver: string;
  text: string;
  seenByReceiver: boolean;
  createdAt: string;
}

export interface Notification {
  type: 'new_message' | 'new_contract' | 'new_contract_tenant' | 'tenant_signed';
  requestId?: string;
  senderId?: string;
  preview?: string;
  contractId?: string;
  lawyerName?: string;
  tenantName?: string;
}

interface SocketContextValue {
  connected: boolean;
  // Per-request unread counts: requestId → count
  unreadByRequest: Record<string, number>;
  // Total unread across all conversations
  totalUnread: number;
  // Pending contract notifications count
  contractUnread: number;
  // Online users: Set of user IDs
  onlineUsers: Set<string>;
  // Control socket connection
  connect: () => void;
  disconnect: () => void;
  clearContractUnread: () => void;
  joinRoom: (requestId: string) => void;
  leaveRoom: (requestId: string) => void;
  sendMessage: (requestId: string, text: string) => void;
  markSeen: (requestId: string) => void;
  clearAll: () => void;
  emitTypingStart: (requestId: string) => void;
  emitTypingStop: (requestId: string) => void;
  emitContractNotify: (contractId: string, ownerId: string) => void;
  emitTenantContractNotify: (contractId: string, tenantEmail: string) => void;
  emitTenantSigned: (contractId: string, lawyerId: string, tenantName: string) => void;
  onMessage: (handler: (msg: ChatMessage) => void) => () => void;
  onSeen: (handler: (data: { requestId: string; seenBy: string }) => void) => () => void;
  onTyping: (handler: (data: { requestId: string; userId: string; typing: boolean }) => void) => () => void;
  onNotification: (handler: (n: Notification) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadByRequest, setUnreadByRequest] = useState<Record<string, number>>({});
  const [contractUnread, setContractUnread] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [shouldConnect, setShouldConnect] = useState(false);
  const notifHandlers = useRef<((n: Notification) => void)[]>([]);
  const msgHandlers = useRef<((m: ChatMessage) => void)[]>([]);
  const seenHandlers = useRef<((d: { requestId: string; seenBy: string }) => void)[]>([]);
  const typingHandlers = useRef<((d: { requestId: string; userId: string; typing: boolean }) => void)[]>([]);

  // Fetch initial unread count from database when user logs in
  useEffect(() => {
    if (!isAuthenticated) return;
    const authToken = token && token !== 'nextauth' ? token : getToken();
    if (!authToken) return;

    const fetchInitialUnreadCount = async () => {
      try {
        console.log('[SocketContext] Fetching initial unread counts...');
        const res = await fetch('/api/notifications/count', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        console.log('[SocketContext] Initial unread counts received:', data);
        if (data.success && data.unreadByRequest) {
          // Initialize with per-request unread counts from database
          setUnreadByRequest(data.unreadByRequest);
          console.log('[SocketContext] Set unreadByRequest to:', data.unreadByRequest);
        }
      } catch (err) {
        console.error('Failed to fetch initial unread count:', err);
      }
    };

    fetchInitialUnreadCount();
  }, [isAuthenticated, token]);

  // Auto-connect socket when authenticated (simplified approach)
  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        console.log('[SocketContext] Disconnecting - not authenticated');
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
        setOnlineUsers(new Set());
      }
      return;
    }

    const authToken = token && token !== 'nextauth' ? token : getToken();
    if (!authToken) {
      console.log('[SocketContext] No auth token available');
      return;
    }

    // Don't create a new socket if one already exists and is connected
    if (socketRef.current?.connected) {
      console.log('[SocketContext] Socket already connected');
      return;
    }

    // Clean up any existing disconnected socket
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    console.log('[SocketContext] Creating new socket connection...');
    const socket = io(SOCKET_URL, {
      auth: { token: authToken },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[SocketContext] ✅ Connected to socket server');
      setConnected(true);
      socket.emit('get_online_users');
    });
    
    socket.on('disconnect', () => {
      console.log('[SocketContext] ❌ Disconnected from socket server');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[SocketContext] Connection error:', error);
    });

    // Listen for online users list
    socket.on('online_users', (userIds: string[]) => {
      setOnlineUsers(new Set(userIds));
    });

    // Listen for user status changes
    socket.on('user_status', (data: { userId: string; status: 'online' | 'offline' }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (data.status === 'online') {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    socket.on('notification', (n: Notification) => {
      console.log('[SocketContext] Notification received:', n);
      if (n.type === 'new_message') {
        setUnreadByRequest(prev => {
          const updated = {
            ...prev,
            [n.requestId!]: (prev[n.requestId!] || 0) + 1,
          };
          console.log('[SocketContext] Updated unreadByRequest after notification:', updated);
          return updated;
        });
      } else if (n.type === 'new_contract') {
        setContractUnread(c => c + 1);
      }
      notifHandlers.current.forEach(h => h(n));
    });

    socket.on('joined_room', (requestId: string) => {
      console.log('[SocketContext] ✅ Successfully joined room:', requestId);
    });

    socket.on('new_message', (msg: ChatMessage) => {
      msgHandlers.current.forEach(h => h(msg));
    });

    socket.on('messages_seen', (data: { requestId: string; seenBy: string }) => {
      seenHandlers.current.forEach(h => h(data));
    });

    socket.on('user_typing', (data: { requestId: string; userId: string; typing: boolean }) => {
      console.log('[SocketContext] user_typing event received:', data);
      typingHandlers.current.forEach(h => h(data));
    });

    socket.on('test_response', (data: any) => {
      console.log('[SocketContext] ✅ Test response received:', data);
    });

    return () => {
      console.log('[SocketContext] Cleaning up socket connection');
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated, token]);

  // Disconnect when logged out
  useEffect(() => {
    if (!isAuthenticated && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
      setUnreadByRequest({});
      setContractUnread(0);
      setOnlineUsers(new Set());
    }
  }, [isAuthenticated]);

  const joinRoom = useCallback((requestId: string) => {
    socketRef.current?.emit('join_room', requestId);
  }, []);

  const leaveRoom = useCallback((requestId: string) => {
    console.log('[SocketContext] leaveRoom called for requestId:', requestId);
    socketRef.current?.emit('leave_room', requestId);
  }, []);

  const sendMessage = useCallback((requestId: string, text: string) => {
    socketRef.current?.emit('send_message', { requestId, text });
  }, []);

  const markSeen = useCallback((requestId: string) => {
    console.log('[SocketContext] markSeen called for requestId:', requestId);
    socketRef.current?.emit('mark_seen', requestId);
    // Clear unread for this specific conversation
    setUnreadByRequest(prev => {
      const next = { ...prev };
      delete next[requestId];
      console.log('[SocketContext] Updated unreadByRequest after markSeen:', next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setUnreadByRequest({});
  }, []);

  const clearContractUnread = useCallback(() => {
    setContractUnread(0);
  }, []);

  const emitContractNotify = useCallback((contractId: string, ownerId: string) => {
    socketRef.current?.emit('notify_contract', { contractId, ownerId });
  }, []);

  const emitTenantContractNotify = useCallback((contractId: string, tenantEmail: string) => {
    socketRef.current?.emit('notify_tenant_contract', { contractId, tenantEmail });
  }, []);

  const emitTenantSigned = useCallback((contractId: string, lawyerId: string, tenantName: string) => {
    socketRef.current?.emit('notify_tenant_signed', { contractId, lawyerId, tenantName });
  }, []);

  const emitTypingStart = useCallback((requestId: string) => {
    socketRef.current?.emit('typing_start', { requestId });
  }, []);

  const emitTypingStop = useCallback((requestId: string) => {
    socketRef.current?.emit('typing_stop', { requestId });
  }, []);

  const onMessage = useCallback((handler: (msg: ChatMessage) => void) => {
    msgHandlers.current.push(handler);
    return () => { msgHandlers.current = msgHandlers.current.filter(h => h !== handler); };
  }, []);

  const onSeen = useCallback((handler: (data: { requestId: string; seenBy: string }) => void) => {
    seenHandlers.current.push(handler);
    return () => { seenHandlers.current = seenHandlers.current.filter(h => h !== handler); };
  }, []);

  const onNotification = useCallback((handler: (n: Notification) => void) => {
    notifHandlers.current.push(handler);
    return () => { notifHandlers.current = notifHandlers.current.filter(h => h !== handler); };
  }, []);

  const onTyping = useCallback((handler: (data: { requestId: string; userId: string; typing: boolean }) => void) => {
    typingHandlers.current.push(handler);
    return () => { typingHandlers.current = typingHandlers.current.filter(h => h !== handler); };
  }, []);

  const connectSocket = useCallback(() => {
    setShouldConnect(true);
  }, []);

  const disconnectSocket = useCallback(() => {
    setShouldConnect(false);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
      setOnlineUsers(new Set());
    }
  }, []);

  const totalUnread = Object.values(unreadByRequest).reduce((s, c) => s + c, 0);

  return (
    <SocketContext.Provider value={{
      connected,
      unreadByRequest,
      totalUnread,
      contractUnread,
      onlineUsers,
      connect: connectSocket,
      disconnect: disconnectSocket,
      clearContractUnread,
      emitContractNotify,
      emitTenantContractNotify,
      emitTenantSigned,
      emitTypingStart,
      emitTypingStop,
      joinRoom,
      leaveRoom,
      sendMessage,
      markSeen,
      clearAll,
      onMessage,
      onSeen,
      onTyping,
      onNotification,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider');
  return ctx;
}
