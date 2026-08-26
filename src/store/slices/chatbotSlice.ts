// ─────────────────────────────────────────────────────────────────────────────
// chatbotSlice.ts
// Redux slice for Universal Smart Assistant (Sprouty) state
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatbotState, ChatMessage } from '../../types/chatbot.types';

// ── Initial greeting message from Sprouty ────────────────────────────────────
const initialGreeting: ChatMessage = {
  id: 'init-0',
  role: 'assistant',
  content: "Hello! I'm Sprouty, your virtual assistant. How can I help you today?",
  timestamp: new Date().toISOString(),
};

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState: ChatbotState = {
  isOpen: false,
  messages: [initialGreeting],
  isTyping: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    // Toggle chatbot panel visibility
    openChatbot(state) {
      state.isOpen = true;
    },
    closeChatbot(state) {
      state.isOpen = false;
    },
    toggleChatbot(state) {
      state.isOpen = !state.isOpen;
    },

    // Add any message (user or assistant)
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },

    // Replace the last message (used to swap loading placeholder with real reply)
    replaceLastMessage(state, action: PayloadAction<ChatMessage>) {
      if (state.messages.length > 0) {
        state.messages[state.messages.length - 1] = action.payload;
      }
    },

    // Show/hide typing indicator
    setTyping(state, action: PayloadAction<boolean>) {
      state.isTyping = action.payload;
    },

    // Error from API call
    setChatError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Clear all messages and reset to greeting
    clearMessages(state) {
      state.messages = [initialGreeting];
      state.error    = null;
    },
  },
});

export const {
  openChatbot,
  closeChatbot,
  toggleChatbot,
  addMessage,
  replaceLastMessage,
  setTyping,
  setChatError,
  clearMessages,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectChatbotOpen     = (s: any) => s.chatbot.isOpen    as boolean;
export const selectChatMessages    = (s: any) => s.chatbot.messages  as ChatMessage[];
export const selectChatTyping      = (s: any) => s.chatbot.isTyping  as boolean;
export const selectChatError       = (s: any) => s.chatbot.error     as string | null;
