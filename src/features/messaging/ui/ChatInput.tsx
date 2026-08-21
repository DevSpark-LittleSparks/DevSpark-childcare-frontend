import { useRef, useState } from 'react';
import { Paperclip, Smile, Send, X, File as FileIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, selectChatCurrentUser, selectActiveContact } from '../model/messagingSlice';
import { chatApi, toChatMessage } from '@/services/chatApi';

export default function ChatInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectChatCurrentUser);
  const activeContact = useAppSelector(selectActiveContact);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() && !selectedFile) return;
    if (!currentUser || !activeContact) return;
    if (sending) return;

    const content = messageText.trim() || (selectedFile ? `Sent attachment: ${selectedFile.name}` : '');

    setMessageText('');
    setShowEmojiPicker(false);
    handleRemoveFile();
    setSending(true);

    try {
      const res = await chatApi.sendMessage({
        senderId: currentUser.id,
        receiverId: activeContact.id,
        content,
      });
      dispatch(addMessage(toChatMessage(res.data)));
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const emojis = ['😀', '😂', '😍', '👍', '🙏', '🎉', '🍎', '✨', '🔥', '😊', '🤔', '🙌'];

  const handleEmojiClick = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  return (
    <div className="bg-transparent px-8 py-6 w-full max-w-5xl mx-auto flex flex-col items-center justify-center relative z-10 pb-10">
      {selectedFile && (
        <div className="w-full flex justify-start mb-2 pl-14">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-cyan-100 flex items-center gap-2 max-w-xs">
            <div className="bg-cyan-50 p-1.5 rounded-md">
              <FileIcon className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 w-full">
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        <button
          onClick={handleAttachmentClick}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors bg-white/50 rounded-full hover:bg-white/80"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-white rounded-full flex items-center px-6 py-3 shadow-sm border border-gray-100">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            disabled={sending}
          />
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              <Smile className="w-6 h-6" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-4 bg-white border border-gray-200 shadow-lg rounded-xl p-3 w-48 z-50">
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-xl hover:bg-gray-100 p-1 rounded transition-colors flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white p-3.5 rounded-full shadow-md transition-colors flex items-center justify-center shrink-0"
        >
          <Send className="w-5 h-5 -ml-0.5" />
        </button>
      </div>

      <div className="absolute bottom-3 left-0 right-0 text-center">
        <p className="text-xs text-gray-400">Messages are monitored for safety. Press Enter to send.</p>
      </div>
    </div>
  );
}
