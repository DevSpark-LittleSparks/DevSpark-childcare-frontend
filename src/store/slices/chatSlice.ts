import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Message, User } from '../../types/chat.types';

const CURRENT_USER_ID = import.meta.env.VITE_CURRENT_USER_ID || 'parent1';
const ACTIVE_CONTACT_ID = import.meta.env.VITE_ACTIVE_CONTACT_ID || 'staff1';

const INITIAL_CURRENT_USER: User = {
  id: CURRENT_USER_ID,
  name: 'Sarah',
  role: 'PARENT',
  isOnline: true,
};

const INITIAL_ACTIVE_CONTACT: User = {
  id: ACTIVE_CONTACT_ID,
  name: 'Sprouty Staff',
  role: 'STAFF',
  isOnline: true,
};

interface ChatState {
  messages: Message[];
  currentUser: User | null;
  activeContact: User | null;
  loading: boolean;
}

const initialState: ChatState = {
  messages: [],
  currentUser: INITIAL_CURRENT_USER,
  activeContact: INITIAL_ACTIVE_CONTACT,
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setMessages, addMessage, clearMessages, setLoading } = chatSlice.actions;

export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectCurrentUser = (state: { chat: ChatState }) => state.chat.currentUser;
export const selectActiveContact = (state: { chat: ChatState }) => state.chat.activeContact;
export const selectLoading = (state: { chat: ChatState }) => state.chat.loading;

export default chatSlice.reducer;
