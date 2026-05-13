import ChatBubble from './ChatBubble';
import type { Message, User } from '../../types/chat.types';

interface ChatMessageListProps {
  messages: Message[];
  currentUser: User | null;
  activeContact: User | null;
}

export default function ChatMessageList({ messages, currentUser, activeContact }: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col items-center custom-scrollbar">
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
              <ChatBubble 
                message={message} 
                isCurrentUser={isCurrentUser} 
                sender={sender} 
              />
            </div>
          );
        })}
        {/* Floating action button shown in the image */}
        <div className="flex justify-end w-full pr-12 -mt-4 mb-4">
           <button className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-cyan-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
           </button>
        </div>
      </div>
    </div>
  );
}
