import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessageResponse } from './chatApi';

const WS_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let stompClient: Client | null = null;

export function connectWebSocket(
  accountId: string,
  onMessage: (msg: ChatMessageResponse) => void,
  onConnect?: () => void
): Client {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${WS_URL}/ws`),
    onConnect: () => {
      stompClient!.subscribe(`/topic/chat/${accountId}`, (frame) => {
        const message: ChatMessageResponse = JSON.parse(frame.body);
        onMessage(message);
      });
      onConnect?.();
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
    onStompError: (frame) => {
      console.error('WebSocket STOMP error:', frame.headers['message']);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function disconnectWebSocket() {
  stompClient?.deactivate();
  stompClient = null;
}
