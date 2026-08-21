export interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'STAFF' | 'PARENT' | 'ADMIN';
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
  dateSection?: string; // e.g., 'Today, 9:30 AM'
}
