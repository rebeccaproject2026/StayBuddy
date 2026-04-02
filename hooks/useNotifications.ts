'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

type UseNotificationsOptions = {
  userId: string | null;
  token: string | null;
  enabled?: boolean;
  /** Called whenever a new notification arrives (new message for this user) */
  onNotification?: (payload: { requestId: string; message: any }) => void;
};

const POLL_INTERVAL = 30_000;

/**
 * Connects to the WS server's personal notification room (`notif:{userId}`).
 * Falls back to polling /api/notifications/count every 30s if WS is unavailable.
 *
 * Returns the live unread count and a `refresh` function to force a re-fetch.
 */
export function useNotifications({ userId, token, enabled = true, onNotification }: UseNotificationsOptions) {
  const [count, setCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const mountedRef = useRef(true);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsFailedRef = useRef(false);
  const reconnectCount = useRef(0);

  const authHeaders = useCallback((): Record<string, string> => {
    if (!token || token === 'nextauth') return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const fetchCount = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      const res = await fetch('/api/notifications/count', { headers: authHeaders() });
      const data = await res.json();
      if (data.success && mountedRef.current) setCount(data.total ?? 0);
    } catch { /* ignore */ }
  }, [authHeaders]);

  const startPolling = useCallback(() => {
    fetchCount();
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(fetchCount, POLL_INTERVAL);
  }, [fetchCount]);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) { clearInterval(pollTimer.current); pollTimer.current = null; }
  }, []);

  const connectWS = useCallback(() => {
    if (!userId || typeof window === 'undefined') return;
    if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }

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
      stopPolling();
      ws.send(JSON.stringify({ type: 'join_notif', userId }));
      // Fetch current count once on connect
      fetchCount();
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          onNotification?.({ requestId: data.requestId, message: data.message });
          // Bump count optimistically; a full re-fetch keeps it accurate
          setCount(c => c + 1);
          fetchCount();
        }
      } catch { /* ignore */ }
    };

    ws.onclose = () => {
      clearTimeout(openTimeout);
      if (!mountedRef.current) return;
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
  }, [userId, fetchCount, startPolling, stopPolling, onNotification]);

  useEffect(() => {
    if (!enabled || !userId) return;
    mountedRef.current = true;
    wsFailedRef.current = false;
    reconnectCount.current = 0;
    connectWS();

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      stopPolling();
      if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }
    };
  }, [userId, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { count, refresh: fetchCount, setCount };
}
