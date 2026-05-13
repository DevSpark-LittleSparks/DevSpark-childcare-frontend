import axios from 'axios';
import type { Message } from '../types/chat.types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const chatApi = {
  sendMessage: (data: SendMessageRequest) =>
    api.post<ChatMessageResponse>('/api/chat/messages', data),

  getConversation: (userA: string, userB: string) =>
    api.get<ChatMessageResponse[]>(`/api/chat/messages/${userA}/${userB}`),

  markAsRead: (messageId: string) =>
    api.put(`/api/chat/messages/${messageId}/read`),

  getUnreadCount: (accountId: string) =>
    api.get<number>(`/api/chat/unread/${accountId}/count`),
};

export function toMessage(dto: ChatMessageResponse): Message {
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

export default api;
