import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage, ChatParticipant } from '@/types/chat.types';

export interface ConversationSummary {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

interface MessagingState {
  messages: ChatMessage[];
  currentUser: ChatParticipant | null;
  activeContact: ChatParticipant | null;
  loading: boolean;
  // Inbox state — only used by the admin conversation list, ignored by the
  // parent's single-fixed-contact page.
  conversations: ConversationSummary[];
  conversationsLoading: boolean;
}

const initialState: MessagingState = {
  messages: [],
  currentUser: null,
  activeContact: null,
  loading: false,
  conversations: [],
  conversationsLoading: false,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<ChatParticipant | null>) {
      state.currentUser = action.payload;
    },
    setActiveContact(state, action: PayloadAction<ChatParticipant | null>) {
      state.activeContact = action.payload;
    },
    setConversations(state, action: PayloadAction<ConversationSummary[]>) {
      state.conversations = action.payload;
    },
    setConversationsLoading(state, action: PayloadAction<boolean>) {
      state.conversationsLoading = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  clearMessages,
  setLoading,
  setCurrentUser,
  setActiveContact,
  setConversations,
  setConversationsLoading,
} = messagingSlice.actions;

export const selectMessages = (state: { messaging: MessagingState }) => state.messaging.messages;
export const selectChatCurrentUser = (state: { messaging: MessagingState }) => state.messaging.currentUser;
export const selectActiveContact = (state: { messaging: MessagingState }) => state.messaging.activeContact;
export const selectMessagingLoading = (state: { messaging: MessagingState }) => state.messaging.loading;
export const selectConversations = (state: { messaging: MessagingState }) => state.messaging.conversations;
export const selectConversationsLoading = (state: { messaging: MessagingState }) => state.messaging.conversationsLoading;

export default messagingSlice.reducer;
