/**
 * Chatbot Redux Slice
 * Manages state for UniversalSproutyAssistant
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import chatbotService from '@/services/chatbotService';
import type { ChatbotState, BotMessage, FaqItem } from '@/types/chatbot.types';

const initialState: ChatbotState = {
  isOpen: false,
  messages: [chatbotService.getInitialMessage()],
  faqData: [],
  inputValue: '',
  loading: false,
  error: null,
};

/**
 * Async Thunk: Fetch FAQ data
 */
export const fetchFaqData = createAsyncThunk(
  'chatbot/fetchFaqData',
  async (_, { rejectWithValue }) => {
    try {
      const faqData = await chatbotService.getFaqData();
      return faqData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch FAQ data'
      );
    }
  }
);

/**
 * Async Thunk: Send message and get bot response
 */
export const sendChatbotMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async (userMessage: string, { rejectWithValue }) => {
    try {
      const response = await chatbotService.sendMessage(userMessage);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to send message'
      );
    }
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action: PayloadAction<BotMessage>) => {
      state.messages.push(action.payload);
    },
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [chatbotService.getInitialMessage()];
    },
    resetChatbot: (state) => {
      state.isOpen = false;
      state.messages = [chatbotService.getInitialMessage()];
      state.inputValue = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch FAQ data
    builder
      .addCase(fetchFaqData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqData.fulfilled, (state, action) => {
        state.loading = false;
        state.faqData = action.payload;
      })
      .addCase(fetchFaqData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Send message
    builder
      .addCase(sendChatbotMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatbotMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Create bot message from response
        const botMsg: BotMessage = {
          id: action.payload.id,
          sender: 'bot',
          text: action.payload.text,
          time: action.payload.time,
          showFaqButtons: action.payload.showFaqButtons,
        };
        state.messages.push(botMsg);
        state.inputValue = '';
      })
      .addCase(sendChatbotMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Add error message to chat
        const errorMsg: BotMessage = {
          id: Date.now(),
          sender: 'bot',
          text: 'Sorry, I encountered an error. Please try again later.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        state.messages.push(errorMsg);
      });
  },
});

export const {
  setIsOpen,
  toggleChatbot,
  addMessage,
  setInputValue,
  clearMessages,
  resetChatbot,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
