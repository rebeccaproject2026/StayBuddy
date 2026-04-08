"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/lib/token-storage';

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

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationHandlers = useRef<((n: Notification) => void)[]>([]);

  useEffect(() => {
    const authToken = token && token !== 'nextauth' ? token : getToken();
    if (!authToken) return;

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
        setUnreadCount(c => c + 1);
        notificationHandlers.current.forEach(h => h(n));
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  const joinRoom = useCallback((requestId: string) => {
    socketRef.current?.emit('join_room', requestId);
  }, []);

  const sendMessage = useCallback((requestId: string, text: string) => {
    socketRef.current?.emit('send_message', { requestId, text });
  }, []);

  const markSeen = useCallback((requestId: string) => {
    socketRef.current?.emit('mark_seen', requestId);
    setUnreadCount(0);
  }, []);

  const onMessage = useCallback((handler: (msg: ChatMessage) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on('new_message', handler);
    return () => socket.off('new_message', handler);
  }, []);

  const onSeen = useCallback((handler: (data: { requestId: string; seenBy: string }) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on('messages_seen', handler);
    return () => socket.off('messages_seen', handler);
  }, []);

  const onNotification = useCallback((handler: (n: Notification) => void) => {
    notificationHandlers.current.push(handler);
    return () => {
      notificationHandlers.current = notificationHandlers.current.filter(h => h !== handler);
    };
  }, []);

  const resetUnread = useCallback(() => setUnreadCount(0), []);

  return {
    socket: socketRef.current,
    connected,
    unreadCount,
    joinRoom,
    sendMessage,
    markSeen,
    onMessage,
    onSeen,
    onNotification,
    resetUnread,
  };
}
