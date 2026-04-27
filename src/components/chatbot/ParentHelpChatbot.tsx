/**
 * Parent Help Chatbot Component (Smart-wrapper with Dumb UI)
 * Displays chatbot UI with props for state management
 * All state management is handled by Redux in the parent component
 */

import React, { useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import type { BotMessage, FaqItem } from '@/types/chatbot.types';

interface ParentHelpChatbotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: BotMessage[];
  onSendMessage: (message: string) => void;
  faqData: FaqItem[];
  inputValue: string;
  setInputValue: (value: string) => void;
  loading?: boolean;
}

export function ParentHelpChatbot({
  isOpen,
  setIsOpen,
  messages,
  onSendMessage,
  faqData,
  inputValue,
  setInputValue,
  loading = false,
}: ParentHelpChatbotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (inputValue.trim() && !loading) {
      onSendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-8 z-50">
      <button
        className="w-16 h-16 rounded-full bg-cyan-400 text-white border-none shadow-lg cursor-pointer flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open support chat"
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
        <div className="absolute bottom-20 right-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="bg-cyan-400 text-white p-4 flex items-center justify-between">
            <div className="font-bold text-sm flex items-center gap-2.5">
              <span className="bg-white dark:bg-slate-800 rounded-full w-3 h-3 opacity-90"></span>
              Sprouty Support
            </div>
            <button
              className="bg-none border-none text-white cursor-pointer flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
              onClick={() => setIsOpen(false)}
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
            <div className="max-h-72 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex mb-3', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'p-3 rounded-xl relative max-w-4/5 break-words',
                      msg.sender === 'user'
                        ? 'bg-cyan-400 text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm leading-relaxed m-0 font-semibold whitespace-pre-line">
                      {msg.text}
                    </p>
                    <div
                      className={cn(
                        'text-xs mt-2 mb-2 font-semibold',
                        msg.sender === 'user'
                          ? 'text-white/80 text-right'
                          : 'text-gray-500'
                      )}
                    >
                      {msg.time}
                    </div>

                    {msg.showFaqButtons && (
                      <div className="mt-4 pt-3 border-t border-gray-300">
                        <p className="text-xs font-extrabold text-gray-500 mb-2 uppercase tracking-wide">
                          TRY THESE QUESTIONS
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {faqData.map((faq, idx) => (
                            <button
                              key={idx}
                              className="bg-white dark:bg-slate-800 border border-cyan-400 text-cyan-400 rounded-3xl px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-cyan-50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => onSendMessage(faq.question)}
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

              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 gap-3">
              <input
                type="text"
                className="flex-1 border border-gray-200 dark:border-gray-700 dark:bg-slate-700 dark:text-white rounded-3xl px-4 py-2.5 text-sm outline-none focus:border-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className="bg-cyan-400 text-white border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 hover:bg-cyan-500 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleSendClick}
                disabled={!inputValue.trim() || loading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
