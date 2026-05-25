"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, MessageSquare, Loader2, Clock } from 'lucide-react';
import { useSocketContext, ChatMessage } from '@/contexts/SocketContext';
import { getToken } from '@/lib/token-storage';

interface ChatWindowProps {
  requestId: string;
  currentUserId: string;
  otherUserId?: string; // Add this to track the other user's ID
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
  otherUserId,
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
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { connected, joinRoom, leaveRoom, sendMessage, markSeen, onMessage, onSeen, onTyping, emitTypingStart, emitTypingStop, onlineUsers } = useSocketContext();
  
  // Check if the other user is online
  const isOtherUserOnline = otherUserId ? onlineUsers.has(otherUserId) : false;

  // Fetch history
  useEffect(() => {
    if (!requestId) return;
    const authToken = token && token !== 'nextauth' ? token : getToken();
    setLoading(true);
    fetch(`/api/messages/${requestId}`, {
      credentials: 'include', // needed for NextAuth session fallback
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (data.success) setMessages(data.messages || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [requestId, token]);

  // Join/leave socket room
  useEffect(() => {
    if (connected && requestId) {
      joinRoom(requestId);
      markSeen(requestId);
      // Don't call onUnreadChange here - markSeen already handles clearing this specific conversation's unread count
      
      return () => {
        leaveRoom(requestId);
      };
    }
  }, [connected, requestId, joinRoom, leaveRoom, markSeen]);

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
        // Don't call onUnreadChange here - markSeen already handles clearing this specific conversation's unread count
      }
    });
    return off;
  }, [onMessage, requestId, currentUserId, markSeen]);

  // Listen for seen events
  useEffect(() => {
    const off = onSeen(({ requestId: rid, seenBy }) => {
      if (rid !== requestId) return;
      setMessages(prev =>
        prev.map(m => {
          if (m.sender === currentUserId) {
            return { ...m, seenByReceiver: true };
          }
          return m;
        })
      );
    });
    return off;
  }, [onSeen, requestId, currentUserId]);

  // Listen for typing events
  useEffect(() => {
    const off = onTyping(({ requestId: rid, userId, typing }) => {
      if (rid !== requestId || userId === currentUserId) return;
      setIsOtherUserTyping(typing);
    });
    return off;
  }, [onTyping, requestId, currentUserId]);

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
      // When using socket, the message will be added via the new_message event
      // So we don't add it here to avoid duplicates
      sendMessage(requestId, text);
    } else {
      // REST fallback - add message manually since no socket event
      const authToken = token && token !== 'nextauth' ? token : getToken();
      try {
        const res = await fetch(`/api/messages/${requestId}`, {
          method: 'POST',
          credentials: 'include',
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

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Emit typing start
    if (connected && e.target.value.trim()) {
      emitTypingStart(requestId);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to emit typing stop after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStop(requestId);
      }, 2000);
    } else if (connected && !e.target.value.trim()) {
      emitTypingStop(requestId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (connected) {
        emitTypingStop(requestId);
      }
    };
  }, [connected, requestId, emitTypingStop]);

  const base = isDark
    ? { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', sub: 'text-gray-400', input: 'bg-gray-800 border-gray-700 text-white placeholder-gray-500', header: 'bg-gray-800 border-gray-700' }
    : { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', sub: 'text-gray-500', input: 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400', header: 'bg-gray-50 border-gray-200' };

  return (
    <div className={`flex flex-col rounded-xl border overflow-hidden ${base.bg} ${base.border}`} style={{ height: '100%', minHeight: 0 }}>
      {/* Header — fixed height, never shrinks */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b ${base.header}`}>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-bold text-sm">{otherUserName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${base.text}`}>{otherUserName}</p>
          <p className={`text-xs truncate ${base.sub}`}>{propertyTitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`flex items-center gap-1.5 text-xs font-medium ${isOtherUserOnline ? 'text-green-500' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isOtherUserOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            {isOtherUserOnline ? 'Online' : 'Offline'}
          </span>
          {onClose && (
            <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages — takes remaining space, scrolls internally */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3" data-lenis-prevent>
        {/* Retention notice */}
        {!loading && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${isDark ? 'bg-gray-800/60 text-gray-400' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Messages are automatically deleted after 7 days.</span>
          </div>
        )}
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
                  <div className={`flex items-center gap-1.5 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${isMine ? 'text-white/70' : base.sub}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMine && (
                      <span 
                        className={`text-xs font-bold ${msg.seenByReceiver ? 'text-blue-300' : 'text-white/60'}`} 
                        title={msg.seenByReceiver ? 'Seen' : 'Sent'}
                      >
                        {msg.seenByReceiver ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isOtherUserTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '400ms', animationDuration: '1s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — fixed height, never shrinks */}
      <div className={`flex-shrink-0 px-3 py-3 border-t ${base.border}`}>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
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
