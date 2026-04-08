"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { useSocket, ChatMessage } from '@/hooks/useSocket';
import { getToken } from '@/lib/token-storage';

interface ChatWindowProps {
  requestId: string;
  currentUserId: string;
  otherUserName: string;
  propertyTitle: string;
  token: string | null;
  isDark?: boolean;
  onClose?: () => void;
  onUnreadChange?: (count: number) => void;
}

export default function ChatWindow({
  requestId,
  currentUserId,
  otherUserName,
  propertyTitle,
  token,
  isDark = false,
  onClose,
  onUnreadChange,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { connected, joinRoom, sendMessage, markSeen, onMessage, onSeen } = useSocket(token);

  // Fetch history
  useEffect(() => {
    const authToken = token && token !== 'nextauth' ? token : getToken();
    if (!authToken || !requestId) return;
    setLoading(true);
    fetch(`/api/messages/${requestId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setMessages(data.messages || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [requestId, token]);

  // Join socket room
  useEffect(() => {
    if (connected && requestId) {
      joinRoom(requestId);
      markSeen(requestId);
      onUnreadChange?.(0);
    }
  }, [connected, requestId, joinRoom, markSeen, onUnreadChange]);

  // Listen for new messages
  useEffect(() => {
    const off = onMessage((msg: ChatMessage) => {
      if (msg.contactRequest !== requestId) return;
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (msg.sender !== currentUserId) {
        markSeen(requestId);
        onUnreadChange?.(0);
      }
    });
    return off;
  }, [onMessage, requestId, currentUserId, markSeen, onUnreadChange]);

  // Listen for seen events
  useEffect(() => {
    const off = onSeen(({ requestId: rid }) => {
      if (rid !== requestId) return;
      setMessages(prev =>
        prev.map(m => m.sender === currentUserId ? { ...m, seenByReceiver: true } : m)
      );
    });
    return off;
  }, [onSeen, requestId, currentUserId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput('');

    if (connected) {
      sendMessage(requestId, text);
    } else {
      // REST fallback
      const authToken = token && token !== 'nextauth' ? token : getToken();
      try {
        const res = await fetch(`/api/messages/${requestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        if (data.success) {
          setMessages(prev => [...prev, data.message]);
        }
      } catch {}
    }
    setSending(false);
    inputRef.current?.focus();
  }, [input, sending, connected, sendMessage, requestId, token]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const base = isDark
    ? { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', sub: 'text-gray-400', input: 'bg-gray-800 border-gray-700 text-white placeholder-gray-500', header: 'bg-gray-800 border-gray-700' }
    : { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', sub: 'text-gray-500', input: 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400', header: 'bg-gray-50 border-gray-200' };

  return (
    <div className={`flex flex-col h-full rounded-2xl border overflow-hidden ${base.bg} ${base.border}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${base.header}`}>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-bold text-sm">{otherUserName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${base.text}`}>{otherUserName}</p>
          <p className={`text-xs truncate ${base.sub}`}>{propertyTitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`flex items-center gap-1 text-xs ${connected ? 'text-green-500' : 'text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
            {connected ? 'Live' : 'Offline'}
          </span>
          {onClose && (
            <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className={`w-6 h-6 animate-spin ${base.sub}`} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <MessageSquare className={`w-10 h-10 ${base.sub}`} />
            <p className={`text-sm ${base.sub}`}>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender === currentUserId;
            return (
              <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? 'bg-primary text-white rounded-br-sm'
                    : isDark
                    ? 'bg-gray-800 text-gray-100 rounded-bl-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  <p>{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${isMine ? 'text-white/60' : base.sub}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMine && (
                      <span className={`text-[10px] ${msg.seenByReceiver ? 'text-blue-300' : 'text-white/50'}`}>
                        {msg.seenByReceiver ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`px-3 py-3 border-t ${base.border}`}>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={2000}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${base.input}`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
