export type AlertPriority = 'NORMAL' | 'HIGH';

export interface AlertItem {
  id: string;
  title: string;
  body: string;
  priority: AlertPriority;
  isRead: boolean;
  createdAt: string | null;
}

export interface SentAlert {
  id: string;
  title: string;
  body: string;
  priority: AlertPriority;
  targetLabel: string;
  createdAt: string | null;
}

export interface AlertRecipient {
  accountId: string;
  name: string;
  email: string;
  role: 'PARENT' | 'TEACHER';
}
