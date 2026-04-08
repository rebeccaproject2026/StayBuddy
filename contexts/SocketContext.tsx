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
  type: 'new_message';
  requestId: string;
  senderId: string;
  preview: string;
}

interface SocketContextValue {
  connected: boolean;
  // Per-request unread counts: requestId → count
  unreadByRequest: Record<string, number>;
  // Total unread across all conversations
  totalUnread: number;
  joinRoom: (requestId: string) => void;
  sendMessage: (requestId: string, text: string) => void;
  markSeen: (requestId: string) => void;
  clearAll: () => void;
  onMessage: (handler: (msg: ChatMessage) => void) => () => void;
  onSeen: (handler: (data: { requestId: string; seenBy: string }) => void) => () => void;
  onNotification: (handler: (n: Notification) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadByRequest, setUnreadByRequest] = useState<Record<string, number>>({});
  const notifHandlers = useRef<((n: Notification) => void)[]>([]);
  const msgHandlers = useRef<((m: ChatMessage) => void)[]>([]);
  const seenHandlers = useRef<((d: { requestId: string; seenBy: string }) => void)[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const authToken = token && token !== 'nextauth' ? token : getToken();
    if (!authToken) return;

    // Reuse existing socket if already connected with same token
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token: authToken },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('notification', (n: Notification) => {
      if (n.type === 'new_message') {
        setUnreadByRequest(prev => ({
          ...prev,
          [n.requestId]: (prev[n.requestId] || 0) + 1,
        }));
        notifHandlers.current.forEach(h => h(n));
      }
    });

    socket.on('new_message', (msg: ChatMessage) => {
      msgHandlers.current.forEach(h => h(msg));
    });

    socket.on('messages_seen', (data: { requestId: string; seenBy: string }) => {
      seenHandlers.current.forEach(h => h(data));
    });

    return () => {
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
    }
  }, [isAuthenticated]);

  const joinRoom = useCallback((requestId: string) => {
    socketRef.current?.emit('join_room', requestId);
  }, []);

  const sendMessage = useCallback((requestId: string, text: string) => {
    socketRef.current?.emit('send_message', { requestId, text });
  }, []);

  const markSeen = useCallback((requestId: string) => {
    socketRef.current?.emit('mark_seen', requestId);
    // Clear unread for this specific conversation
    setUnreadByRequest(prev => {
      const next = { ...prev };
      delete next[requestId];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setUnreadByRequest({});
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

  const totalUnread = Object.values(unreadByRequest).reduce((s, c) => s + c, 0);

  return (
    <SocketContext.Provider value={{
      connected,
      unreadByRequest,
      totalUnread,
      joinRoom,
      sendMessage,
      markSeen,
      clearAll,
      onMessage,
      onSeen,
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
