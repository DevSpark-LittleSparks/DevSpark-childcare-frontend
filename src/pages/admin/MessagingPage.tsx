import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/features/auth/model/authSlice';
import { useAccountId } from '@/entities/auth/model/useAccountId';
import {
  selectMessages,
  selectChatCurrentUser,
  selectActiveContact,
  selectMessagingLoading,
  selectConversations,
  selectConversationsLoading,
  setMessages,
  setLoading,
  addMessage,
  setCurrentUser,
  setActiveContact,
  setConversations,
  setConversationsLoading,
  type ConversationSummary,
} from '@/features/messaging/model/messagingSlice';
import ChatHeader from '@/features/messaging/ui/ChatHeader';
import ChatMessageList from '@/features/messaging/ui/ChatMessageList';
import ChatInput from '@/features/messaging/ui/ChatInput';
import { chatApi, toChatMessage } from '@/services/chatApi';
import { connectWebSocket, disconnectWebSocket } from '@/services/chatWebSocket';
import type { ChatMessageResponse } from '@/services/chatApi';

const formatConversationTime = (iso: string | null) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function AdminMessagingPage() {
  const dispatch = useAppDispatch();
  const authUser = useSelector(selectUser);
  const { accountId } = useAccountId();

  const messages = useAppSelector(selectMessages);
  const currentUser = useAppSelector(selectChatCurrentUser);
  const activeContact = useAppSelector(selectActiveContact);
  const loading = useAppSelector(selectMessagingLoading);
  const conversations = useAppSelector(selectConversations);
  const conversationsLoading = useAppSelector(selectConversationsLoading);

  // Keeps the websocket callback (registered once per accountId) able to see
  // whichever conversation is open right now, without tearing down/rebuilding
  // the connection every time the admin switches conversations.
  const activeContactRef = useRef(activeContact);
  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  // Resolve the admin's own chat identity.
  useEffect(() => {
    if (!accountId) return;
    dispatch(
      setCurrentUser({
        id: accountId,
        name: authUser?.displayName || 'Admin',
        avatarUrl: authUser?.photoURL || undefined,
        role: 'ADMIN',
        isOnline: true,
      })
    );
  }, [accountId, authUser?.displayName, authUser?.photoURL, dispatch]);

  const refreshConversations = useCallback(() => {
    if (!accountId) return;
    dispatch(setConversationsLoading(true));
    chatApi
      .getConversations(accountId)
      .then((res) => dispatch(setConversations(res.data)))
      .catch((err) => console.error('Failed to load conversations:', err))
      .finally(() => dispatch(setConversationsLoading(false)));
  }, [accountId, dispatch]);

  // Load the inbox and open the realtime channel once identity is known.
  useEffect(() => {
    if (!accountId) return;
    refreshConversations();

    let cancelled = false;
    connectWebSocket(accountId, (msg: ChatMessageResponse) => {
      if (cancelled) return;
      const otherPartyId = msg.senderId === accountId ? msg.receiverId : msg.senderId;
      if (msg.senderId !== accountId && activeContactRef.current?.id === otherPartyId) {
        dispatch(addMessage(toChatMessage(msg)));
      }
      refreshConversations();
    });

    return () => {
      cancelled = true;
      disconnectWebSocket();
    };
  }, [accountId, refreshConversations, dispatch]);

  const handleSelectConversation = async (conv: ConversationSummary) => {
    dispatch(
      setActiveContact({
        id: conv.partnerId,
        name: conv.partnerName,
        role: 'PARENT',
        isOnline: true,
      })
    );
    if (!accountId) return;

    dispatch(setLoading(true));
    try {
      const res = await chatApi.getConversation(accountId, conv.partnerId);
      dispatch(setMessages(res.data.map(toChatMessage)));

      const unread = res.data.filter((m) => m.senderId !== accountId && !m.viewed);
      if (unread.length > 0) {
        await Promise.all(unread.map((m) => chatApi.markAsRead(m.messageId)));
        refreshConversations();
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Conversation list */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Messages</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Parent conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversationsLoading && conversations.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-8">Loading...</p>
          )}
          {!conversationsLoading && conversations.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-8 px-6">No messages yet.</p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.partnerId}
              onClick={() => handleSelectConversation(conv)}
              className={`w-full text-left px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                activeContact?.id === conv.partnerId ? 'bg-cyan-50' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 text-sm truncate">{conv.partnerName}</span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {formatConversationTime(conv.lastMessageTime)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-xs text-slate-500 truncate">{conv.lastMessage || 'No messages yet'}</span>
                {conv.unreadCount > 0 && (
                  <span className="bg-cyan-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active conversation */}
      <div className="flex-1 flex flex-col relative">
        {activeContact ? (
          <>
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3">
            <MessageCircle size={48} strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-400">Select a conversation to start replying</p>
          </div>
        )}
      </div>
    </div>
  );
}
