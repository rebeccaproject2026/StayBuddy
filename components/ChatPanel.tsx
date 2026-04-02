'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Trash2, Wifi, WifiOff, MessageSquare } from 'lucide-react';
import { useChat, ChatMessage } from '@/hooks/useChat';

type Props = {
  requestId: string;
  propertyTitle: string;
  otherPartyName: string;
  userId: string;
  token: string | null;
  userRole: 'landlord' | 'renter';
  isDark?: boolean;
  onClose: () => void;
  onDelete?: () => void;
  language?: string;
};

export default function ChatPanel({
  requestId, propertyTitle, otherPartyName, userId, token,
  userRole, isDark = false, onClose, onDelete, language = 'en',
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState('');
  const [initialCount, setInitialCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFr = language === 'fr';

  const authHeaders: Record<string, string> = (token && token !== 'nextauth')
    ? { Authorization: `Bearer ${token}` }
    : {};

  // Load initial messages from REST API
  useEffect(() => {
    if (!requestId) return;
    setLoading(true);
    fetch(`/api/messages/${requestId}`, { headers: authHeaders })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const msgs: ChatMessage[] = d.messages || [];
          setMessages(msgs);
          // Tell the hook how many messages already exist so polling skips them
          setInitialCount(msgs.length);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [requestId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleNewMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.some(m => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const handleTyping = useCallback(({ senderName, isTyping: t }: any) => {
    setTypingName(senderName);
    setIsTyping(t);
  }, []);

  const { connected, usingPolling, sendMessage, sendTyping, sendRead } = useChat({
    requestId,
    userId,
    token,
    initialCount,
    onMessage: handleNewMessage,
    onTyping: handleTyping,
  });

  // Mark as read when panel opens
  useEffect(() => {
    if (connected) sendRead();
  }, [connected, requestId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    sendTyping(otherPartyName, true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => sendTyping(otherPartyName, false), 1500);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput('');
    sendTyping(otherPartyName, false);

    try {
      const res = await fetch(`/api/messages/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        // Broadcast via WebSocket so other party gets it instantly
        sendMessage(data.message);
        // Add to own list
        setMessages(prev => {
          if (prev.some(m => m._id === data.message._id)) return prev;
          return [...prev, data.message];
        });
      }
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const bg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const headerBg = isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-primary to-primary-dark';
  const msgBg = isDark ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${bg}`}
      style={{ height: '520px' }}
    >
      {/* Header */}
      <div className={`${headerBg} px-4 py-3 flex items-center gap-3 flex-shrink-0`}>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{propertyTitle}</p>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            <p className="text-white/70 text-xs">
              {connected
                ? usingPolling
                  ? (isFr ? `En ligne · ${otherPartyName}` : `Live · ${otherPartyName}`)
                  : (isFr ? `En ligne · ${otherPartyName}` : `Online · ${otherPartyName}`)
                : (isFr ? 'Reconnexion...' : 'Reconnecting...')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {connected
            ? <Wifi className="w-4 h-4 text-green-400" />
            : <WifiOff className="w-4 h-4 text-red-400 animate-pulse" />}
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-red-300">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TTL notice */}
      <div className={`px-4 py-1.5 text-center text-xs ${isDark ? 'bg-gray-800/50 text-gray-500' : 'bg-amber-50 text-amber-600'} flex-shrink-0`}>
        {isFr ? '⏱ Messages supprimés automatiquement après 7 jours' : '⏱ Messages auto-delete after 7 days'}
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto px-4 py-3 space-y-2 ${msgBg}`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <MessageSquare className={`w-10 h-10 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {isFr ? 'Aucun message. Dites bonjour!' : 'No messages yet. Say hello!'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = msg.sender === userId;
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                    {!isMine && (
                      <span className={`text-xs font-medium px-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {msg.senderName}
                      </span>
                    )}
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      isMine
                        ? 'bg-primary text-white rounded-br-sm'
                        : isDark
                          ? 'bg-gray-700 text-gray-100 rounded-bl-sm'
                          : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-xs px-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex justify-start"
                >
                  <div className={`px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1 ${isDark ? 'bg-gray-700' : 'bg-white shadow-sm border border-gray-100'}`}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-400'}`}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`px-3 py-3 flex-shrink-0 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isFr ? 'Écrire un message...' : 'Type a message...'}
            className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {sending
              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send className="w-3.5 h-3.5 text-white" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
