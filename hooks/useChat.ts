'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

export type ChatMessage = {
  _id: string;
  contactRequest: string;
  sender: string;
  senderRole: 'landlord' | 'renter';
  senderName: string;
  text: string;
  readBy: string[];
  createdAt: string;
};

type TypingState = { userId: string; senderName: string; isTyping: boolean };

type UseChatOptions = {
  requestId: string | null;
  userId: string | null;
  /** The other party's userId — used to push live notifications to them */
  recipientId?: string | null;
  token: string | null;
  initialCount?: number;
  onMessage?: (msg: ChatMessage) => void;
  onTyping?: (state: TypingState) => void;
  onRead?: (userId: string) => void;
};

const POLL_INTERVAL = 3000; // 3s fallback polling

export function useChat({ requestId, userId, recipientId, token, initialCount = 0, onMessage, onTyping, onRead }: UseChatOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [usingPolling, setUsingPolling] = useState(false);
  const mountedRef = useRef(true);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMsgCountRef = useRef(0);
  const wsFailedRef = useRef(false);
  const reconnectCount = useRef(0);

  const authHeaders = useCallback((): Record<string, string> => {
    if (!token || token === 'nextauth') return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  // ── Polling fallback ──────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (!requestId || !mountedRef.current) return;
    setUsingPolling(true);
    setConnected(true); // treat polling as "connected"

    const poll = async () => {
      if (!requestId || !mountedRef.current) return;
      try {
        const res = await fetch(`/api/messages/${requestId}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (!data.success || !mountedRef.current) return;
        const msgs: ChatMessage[] = data.messages || [];
        // Only fire onMessage for genuinely new messages
        if (msgs.length > lastMsgCountRef.current) {
          const newMsgs = msgs.slice(lastMsgCountRef.current);
          newMsgs.forEach(m => onMessage?.(m));
          lastMsgCountRef.current = msgs.length;
        }
      } catch { /* ignore network errors */ }
    };

    poll(); // immediate first poll
    pollTimer.current = setInterval(poll, POLL_INTERVAL);
  }, [requestId, authHeaders, onMessage]);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  // ── WebSocket ─────────────────────────────────────────────────────────────
  const connectWS = useCallback(() => {
    if (!requestId || !userId || typeof window === 'undefined') return;

    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    } catch {
      wsFailedRef.current = true;
      startPolling();
      return;
    }
    wsRef.current = ws;

    // If WS doesn't open within 2s, fall back to polling
    const openTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        wsFailedRef.current = true;
        ws.onclose = null;
        ws.close();
        startPolling();
      }
    }, 2000);

    ws.onopen = () => {
      clearTimeout(openTimeout);
      if (!mountedRef.current) return;
      wsFailedRef.current = false;
      reconnectCount.current = 0;
      setConnected(true);
      setUsingPolling(false);
      ws.send(JSON.stringify({ type: 'join', requestId, userId }));
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message' && data.requestId === requestId) {
          onMessage?.(data.message);
          lastMsgCountRef.current += 1;
        }
        if (data.type === 'typing' && data.requestId === requestId) {
          onTyping?.(data);
        }
        if (data.type === 'read' && data.requestId === requestId) {
          onRead?.(data.userId);
        }
      } catch { /* ignore */ }
    };

    ws.onclose = () => {
      clearTimeout(openTimeout);
      if (!mountedRef.current) return;
      setConnected(false);
      // If WS was working before, try to reconnect; otherwise fall back to polling
      if (!wsFailedRef.current) {
        const delay = Math.min(1000 * 2 ** reconnectCount.current, 15000);
        reconnectCount.current += 1;
        reconnectTimer.current = setTimeout(() => {
          if (mountedRef.current) connectWS();
        }, delay);
      } else {
        startPolling();
      }
    };

    ws.onerror = () => {
      clearTimeout(openTimeout);
      wsFailedRef.current = true;
      ws.onclose = null;
      ws.close();
      if (mountedRef.current) startPolling();
    };
  }, [requestId, userId, startPolling, onMessage, onTyping, onRead]);

  // Update lastMsgCountRef when initial messages load
  useEffect(() => {
    if (initialCount > lastMsgCountRef.current) {
      lastMsgCountRef.current = initialCount;
    }
  }, [initialCount]);
  useEffect(() => {
    mountedRef.current = true;
    lastMsgCountRef.current = initialCount; // start from already-loaded messages
    wsFailedRef.current = false;
    reconnectCount.current = 0;
    connectWS();

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      stopPolling();
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [requestId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Send helpers ──────────────────────────────────────────────────────────
  const sendMessage = useCallback((message: ChatMessage) => {
    if (!usingPolling && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', message, recipientId: recipientId ?? null }));
    }
    // In polling mode, REST POST in ChatPanel is sufficient — no WS broadcast needed
  }, [usingPolling, recipientId]);

  const sendTyping = useCallback((senderName: string, isTyping: boolean) => {
    if (!usingPolling && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing', senderName, isTyping }));
    }
  }, [usingPolling]);

  const sendRead = useCallback(() => {
    if (!usingPolling && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'read' }));
    }
  }, [usingPolling]);

  return { connected, usingPolling, sendMessage, sendTyping, sendRead };
}
