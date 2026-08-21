import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/features/auth/model/authSlice';
import { useAccountId } from '@/entities/auth/model/useAccountId';
import {
  selectMessages,
  selectChatCurrentUser,
  selectActiveContact,
  selectMessagingLoading,
  setMessages,
  setLoading,
  addMessage,
  setCurrentUser,
  setActiveContact,
} from '@/features/messaging/model/messagingSlice';
import ChatHeader from '@/features/messaging/ui/ChatHeader';
import ChatMessageList from '@/features/messaging/ui/ChatMessageList';
import ChatInput from '@/features/messaging/ui/ChatInput';
import { chatApi, toChatMessage } from '@/services/chatApi';
import { connectWebSocket, disconnectWebSocket } from '@/services/chatWebSocket';
import type { ChatMessageResponse } from '@/services/chatApi';

// The school's staff/support account this parent messages.
// TODO: replace with a real "assigned staff" lookup once that endpoint exists.
const SCHOOL_STAFF_CONTACT = {
  id: import.meta.env.VITE_CHAT_STAFF_ACCOUNT_ID || 'staff1',
  name: 'LittleSparks Staff',
  role: 'STAFF' as const,
  isOnline: true,
};

export default function MessagingPage() {
  const dispatch = useAppDispatch();
  const authUser = useSelector(selectUser);
  const { accountId } = useAccountId();

  const messages = useAppSelector(selectMessages);
  const currentUser = useAppSelector(selectChatCurrentUser);
  const activeContact = useAppSelector(selectActiveContact);
  const loading = useAppSelector(selectMessagingLoading);

  // The staff contact isn't tied to auth resolving — show it immediately.
  useEffect(() => {
    dispatch(setActiveContact(SCHOOL_STAFF_CONTACT));
  }, [dispatch]);

  // Resolve the chat identity from the logged-in parent's real account.
  useEffect(() => {
    if (!accountId) return;

    dispatch(
      setCurrentUser({
        id: accountId,
        name: authUser?.displayName || 'Parent',
        avatarUrl: authUser?.photoURL || undefined,
        role: 'PARENT',
        isOnline: true,
      })
    );
  }, [accountId, authUser?.displayName, authUser?.photoURL, dispatch]);

  useEffect(() => {
    if (!currentUser || !activeContact) return;

    dispatch(setLoading(true));
    chatApi
      .getConversation(currentUser.id, activeContact.id)
      .then((res) => {
        dispatch(setMessages(res.data.map(toChatMessage)));
      })
      .catch((err) => {
        console.error('Failed to load messages:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });

    connectWebSocket(currentUser.id, (msg: ChatMessageResponse) => {
      if (msg.senderId !== currentUser.id) {
        dispatch(addMessage(toChatMessage(msg)));
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, [currentUser?.id, activeContact?.id, dispatch]);

  return (
    <div className="flex flex-col h-full w-full relative">
      <ChatHeader />

      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-chat-bg via-[#a4bccc] to-[#d6f0fd]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading messages...</p>
          </div>
        ) : (
          <ChatMessageList messages={messages} currentUser={currentUser} activeContact={activeContact} />
        )}
        <ChatInput />
      </div>
    </div>
  );
}
