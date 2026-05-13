import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectMessages,
  selectCurrentUser,
  selectActiveContact,
  selectLoading,
  setMessages,
  setLoading,
  addMessage,
} from '../store/slices/chatSlice';
import Header from '../components/layout/Header';
import ChatMessageList from '../components/chat/ChatMessageList';
import ChatInput from '../components/chat/ChatInput';
import { chatApi, toMessage } from '../services/chatApi';
import { connectWebSocket, disconnectWebSocket } from '../services/chatWebSocket';
import type { ChatMessageResponse } from '../services/chatApi';

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const currentUser = useAppSelector(selectCurrentUser);
  const activeContact = useAppSelector(selectActiveContact);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    if (!currentUser || !activeContact) return;

    dispatch(setLoading(true));
    chatApi
      .getConversation(currentUser.id, activeContact.id)
      .then((res) => {
        dispatch(setMessages(res.data.map(toMessage)));
      })
      .catch((err) => {
        console.error('Failed to load messages:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });

    // Subscribe to real-time messages from the active contact
    connectWebSocket(currentUser.id, (msg: ChatMessageResponse) => {
      if (msg.senderId !== currentUser.id) {
        dispatch(addMessage(toMessage(msg)));
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, [currentUser?.id, activeContact?.id, dispatch]);

  return (
    <div className="flex flex-col h-full w-full relative">
      <Header />

      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-chat-bg via-[#a4bccc] to-[#d6f0fd]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading messages...</p>
          </div>
        ) : (
          <ChatMessageList
            messages={messages}
            currentUser={currentUser}
            activeContact={activeContact}
          />
        )}
        <ChatInput />
      </div>
    </div>
  );
}
