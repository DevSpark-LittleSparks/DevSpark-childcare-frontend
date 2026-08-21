import ChatBubble from './ChatBubble';
import type { ChatMessage, ChatParticipant } from '@/types/chat.types';

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUser: ChatParticipant | null;
  activeContact: ChatParticipant | null;
}

export default function ChatMessageList({ messages, currentUser, activeContact }: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col items-center scrollbar-hide">
      <div className="w-full max-w-3xl flex flex-col mt-auto pt-10">
        {messages.map((message) => {
          const isCurrentUser = currentUser?.id === message.senderId;
          const sender = isCurrentUser ? currentUser : activeContact;

          return (
            <div key={message.id} className="w-full">
              {message.dateSection && (
                <div className="flex justify-center mb-6 mt-2">
                  <span className="bg-white/90 text-gray-500 text-xs px-4 py-1.5 rounded-full shadow-sm">
                    {message.dateSection}
                  </span>
                </div>
              )}
              <ChatBubble message={message} isCurrentUser={isCurrentUser} sender={sender} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
