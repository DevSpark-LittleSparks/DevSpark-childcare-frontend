import { cn } from '../../utils/cn';
import type { Message, User } from '../../types/chat.types';

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  sender: User | null;
}

export default function ChatBubble({ message, isCurrentUser, sender }: ChatBubbleProps) {
  return (
    <div className={cn(
      "flex w-full mb-6",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <div className="flex flex-col items-center mr-3 mt-1">
          <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {sender?.name?.substring(0, 2).toUpperCase() || 'ST'}
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm relative",
        isCurrentUser 
          ? "bg-chat-bubbleRight text-white rounded-tr-sm" 
          : "bg-white text-gray-800 rounded-tl-sm"
      )}>
        {message.content === '...' ? (
          <div className="flex space-x-1.5 h-6 items-center px-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed">{message.content}</p>
        )}
        
        <div className={cn(
          "text-[11px] mt-1.5 flex items-center gap-1",
          isCurrentUser ? "text-cyan-100 justify-end" : "text-gray-400 justify-start"
        )}>
          <span>{message.timestamp}</span>
          {isCurrentUser && message.isRead && (
            <span className="ml-1 text-white text-[10px]">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
