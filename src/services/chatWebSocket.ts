import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { firebaseAuth } from '@/lib/firebase';
import type { ChatMessageResponse } from './chatApi';

const CHAT_WS_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080';

let stompClient: Client | null = null;

export async function connectWebSocket(
  accountId: string,
  onMessage: (msg: ChatMessageResponse) => void,
  onConnect?: () => void
): Promise<Client | null> {
  if (!firebaseAuth.currentUser) {
    console.error('Cannot open messaging WebSocket: no authenticated user');
    return null;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${CHAT_WS_URL}/ws`),
    // Runs before every (re)connection attempt, including the client's own
    // automatic reconnects - fetching the token here rather than once up
    // front means a stale/expired token doesn't strand the connection
    // permanently after ~1hr idle (getIdToken() auto-refreshes as needed).
    beforeConnect: async () => {
      const token = await firebaseAuth.currentUser?.getIdToken();
      if (token && stompClient) {
        stompClient.connectHeaders = { Authorization: `Bearer ${token}` };
      }
    },
    onConnect: () => {
      stompClient!.subscribe(`/topic/chat/${accountId}`, (frame) => {
        const message: ChatMessageResponse = JSON.parse(frame.body);
        onMessage(message);
      });
      onConnect?.();
    },
    onDisconnect: () => {
      console.log('Messaging WebSocket disconnected');
    },
    onStompError: (frame) => {
      console.error('Messaging WebSocket STOMP error:', frame.headers['message']);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function disconnectWebSocket() {
  stompClient?.deactivate();
  stompClient = null;
}
