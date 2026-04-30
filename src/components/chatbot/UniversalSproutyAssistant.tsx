/**
 * Universal Sprouty Assistant
 * Global Chatbot component that connects to Redux for state management.
 * Provides support across all routes.
 */

import React, { useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setIsOpen,
  setInputValue,
  addMessage,
  sendChatbotMessage,
  fetchFaqData,
} from '@/store/slices/chatbotSlice';

export function UniversalSproutyAssistant() {
  const dispatch = useAppDispatch();
  const { isOpen, messages, faqData, inputValue, loading } = useAppSelector(
    (state) => state.chatbot
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Fetch FAQ data if not already loaded
  useEffect(() => {
    if (faqData.length === 0) {
      dispatch(fetchFaqData());
    }
  }, [dispatch, faqData.length]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message locally for immediate feedback
    const userMsg = {
      id: Date.now(),
      sender: 'user' as const,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(addMessage(userMsg));
    dispatch(sendChatbotMessage(text));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (inputValue.trim() && !loading) {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-8 z-[9999]">
      <button
        className="w-16 h-16 rounded-full bg-cyan-400 text-white border-none shadow-lg cursor-pointer flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all active:scale-95"
        onClick={() => dispatch(setIsOpen(!isOpen))}
        aria-label="Open Sprouty assistant"
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-xl">🌱</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="font-bold text-sm">Sprouty Assistant</div>
                <div className="text-[10px] opacity-80 uppercase tracking-wider font-semibold">Online | Ready to help</div>
              </div>
            </div>
            <button
              className="bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
              onClick={() => dispatch(setIsOpen(false))}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 flex flex-col">
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'p-3.5 rounded-2xl relative max-w-[85%] break-words shadow-sm',
                      msg.sender === 'user'
                        ? 'bg-cyan-400 text-white rounded-tr-none'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-tl-none'
                    )}
                  >
                    <p className="text-sm leading-relaxed m-0 font-medium whitespace-pre-line">
                      {msg.text}
                    </p>
                    <div
                      className={cn(
                        'text-[10px] mt-2 font-semibold',
                        msg.sender === 'user'
                          ? 'text-white/70 text-right'
                          : 'text-gray-400'
                      )}
                    >
                      {msg.time}
                    </div>

                    {msg.showFaqButtons && (
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          Suggested Questions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {faqData.map((faq, idx) => (
                            <button
                              key={idx}
                              className="bg-white dark:bg-slate-800 border border-cyan-400 text-cyan-500 rounded-full px-3 py-1.5 text-[11px] font-bold cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all disabled:opacity-50"
                              onClick={() => handleSendMessage(faq.question)}
                              disabled={loading}
                            >
                              {faq.question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700/50 rounded-full px-4 py-1 border border-gray-100 dark:border-gray-600 focus-within:border-cyan-400 transition-colors">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none py-2.5 text-sm outline-none dark:text-white placeholder:text-gray-400"
                  placeholder="Ask Sprouty something..."
                  value={inputValue}
                  onChange={(e) => dispatch(setInputValue(e.target.value))}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    inputValue.trim() && !loading 
                      ? "bg-cyan-400 text-white hover:bg-blue-500" 
                      : "bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
                  )}
                  onClick={handleSendClick}
                  disabled={!inputValue.trim() || loading}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
