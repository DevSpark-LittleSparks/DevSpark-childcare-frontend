export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'STAFF' | 'PARENT';
  isOnline: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
  dateSection?: string; // e.g., 'Today, 9:30 AM'
}
