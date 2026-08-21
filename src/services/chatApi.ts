import axios from 'axios';
import { firebaseAuth } from '@/lib/firebase';
import type { ChatMessage } from '@/types/chat.types';

// The messaging service is a separate backend from the main API
// (VITE_API_BASE_URL) — configure its origin independently.
const CHAT_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080';

export interface SendMessageRequest {
  senderId: string;
  receiverId: string;
  content: string;
}

export interface ChatMessageResponse {
  messageId: string;
  content: string;
  sentAt: string;
  viewed: boolean;
  senderId: string;
  senderEmail: string;
  receiverId: string;
  receiverEmail: string;
}

export interface ConversationSummaryResponse {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

const chatHttp = axios.create({
  baseURL: CHAT_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

chatHttp.interceptors.request.use(async (config) => {
  const currentUser = firebaseAuth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatApi = {
  sendMessage: (data: SendMessageRequest) =>
    chatHttp.post<ChatMessageResponse>('/api/chat/messages', data),

  getConversation: (userA: string, userB: string) =>
    chatHttp.get<ChatMessageResponse[]>(`/api/chat/messages/${userA}/${userB}`),

  markAsRead: (messageId: string) =>
    chatHttp.put(`/api/chat/messages/${messageId}/read`),

  getUnreadCount: (accountId: string) =>
    chatHttp.get<number>(`/api/chat/unread/${accountId}/count`),

  getConversations: (accountId: string) =>
    chatHttp.get<ConversationSummaryResponse[]>(`/api/chat/conversations/${accountId}`),
};

export function toChatMessage(dto: ChatMessageResponse): ChatMessage {
  return {
    id: dto.messageId,
    content: dto.content,
    senderId: dto.senderId,
    timestamp: new Date(dto.sentAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    isRead: dto.viewed,
  };
}

export default chatHttp;
