// ─────────────────────────────────────────────────────────────────────────────
// UniversalSmartAssistant.tsx  —  "Sprouty" chatbot bubble
// Mount this ONCE inside each layout (Admin/Teacher/Parent).
// It floats bottom-right on every page and is role-aware.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleChatbot, closeChatbot, addMessage, replaceLastMessage,
  setTyping, setChatError, clearMessages, syncContext,
  selectChatbotOpen, selectChatMessages, selectChatTyping,
} from '../../store/slices/chatbotSlice';
import { selectUser } from '../../features/auth/model/authSlice';
import { apiClient } from '../../services/axiosInstance';
import type { ChatMessage, MessageRole } from '../../types/chatbot.types';
import { X, Send, MessageCircle, Trash2, Bot } from 'lucide-react';
import { LogoIcon } from '../common/Logo';

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ── Typing dots animation ─────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-[#06B6D4]/60 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

interface UniversalSmartAssistantProps {
  /** Force the public/guest experience regardless of a background login
   *  session — used on the landing page, since Firebase keeps a user
   *  signed in site-wide and this widget must not leak their real
   *  role/name into the anonymous marketing page. */
  guestOnly?: boolean;
}

// ── Main Component ────────────────────────────────────────────────────────────
const UniversalSmartAssistant: React.FC<UniversalSmartAssistantProps> = ({ guestOnly = false }) => {
  const dispatch  = useAppDispatch();
  const location  = useLocation();
  const authUser  = useAppSelector(selectUser);
  const user      = guestOnly ? null : authUser;
  const isOpen    = useAppSelector(selectChatbotOpen);
  const messages  = useAppSelector(selectChatMessages);
  const isTyping  = useAppSelector(selectChatTyping);

  const [input, setInput] = useState('');
  const bottomRef         = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);

  // Whoever this mount of the widget currently represents. Kept in Redux (not a
  // local ref) so it survives the full unmount/remount that happens when the
  // router swaps LandingPage for a portal layout — a plain ref would just reset
  // to its initial value on every navigation and never detect the switch.
  const identityKey = guestOnly ? 'GUEST' : (authUser?.uid ?? 'pending');
  useEffect(() => {
    dispatch(syncContext(identityKey));
  }, [identityKey, dispatch]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ── Send a message ────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');

    // Add user message
    const userMsg: ChatMessage = {
      id:        makeId(),
      role:      'user',
      content:   text,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(userMsg));
    dispatch(setTyping(true));
    dispatch(setChatError(null));

    // Add loading placeholder
    const loadingId = makeId();
    dispatch(addMessage({
      id:        loadingId,
      role:      'assistant',
      content:   '',
      timestamp: new Date().toISOString(),
      isLoading: true,
    }));

    try {
      // Build history excluding the loading placeholder
      const history = messages
        .filter(m => !m.isLoading)
        .map(m => ({ role: m.role as MessageRole, content: m.content }));

      const res = await apiClient.post('/api/v1/chatbot/message', {
        message: text,
        context: {
          role:        user?.role || 'GUEST',
          name:        user?.displayName || 'Guest',
          currentPage: location.pathname,
        },
        history,
      });

      const reply: string = res.data?.reply || "I'm not sure how to help with that. Please contact support.";

      dispatch(replaceLastMessage({
        id:        loadingId,
        role:      'assistant',
        content:   reply,
        timestamp: new Date().toISOString(),
      }));
    } catch {
      dispatch(replaceLastMessage({
        id:        loadingId,
        role:      'assistant',
        content:   "Sorry, I'm having trouble connecting right now. Please try again shortly.",
        timestamp: new Date().toISOString(),
      }));
      dispatch(setChatError('Connection error'));
    } finally {
      dispatch(setTyping(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-[360px] max-h-[520px] z-[9999] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-100"
          style={{ animation: 'slideUp 0.2s ease' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-midnight">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden p-1.5">
                <LogoIcon color="#FFFFFF" className="w-full h-full" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-bold tracking-tight text-white"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Little<span style={{ color: '#06C5D4' }}>Sparks</span> Assistant
              </p>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                Online | Ready to Help
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(clearMessages())}
                title="Clear chat"
                className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => dispatch(closeChatbot())}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 space-y-3 max-h-[340px]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mr-2 mt-1 shadow-sm bg-midnight flex items-center justify-center p-1">
                    <LogoIcon color="#FFFFFF" className="w-full h-full" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#06B6D4] text-white rounded-tr-sm'
                      : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'
                  }`}
                >
                  {msg.isLoading ? <TypingDots /> : (
                    <>
                      <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400'} font-bold`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}

            {isTyping && !messages.some(m => m.isLoading) && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Assistant something…"
              disabled={isTyping}
              className="flex-1 text-sm text-slate-700 font-medium placeholder:text-slate-300 bg-transparent outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-[#06B6D4] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#0891B2] transition-colors shadow-sm"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => dispatch(toggleChatbot())}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-95 ${
          isOpen
            ? 'bg-slate-800 hover:bg-slate-700'
            : 'bg-midnight hover:bg-[#140f52]'
        }`}
        title="Chat with Assistant"
      >
        {isOpen
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
      </button>

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </>
  );
};

export default UniversalSmartAssistant;
