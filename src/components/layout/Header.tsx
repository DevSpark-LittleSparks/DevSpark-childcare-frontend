import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectActiveContact, clearMessages } from '../../store/slices/chatSlice';

export default function Header() {
  const activeContact = useAppSelector(selectActiveContact);
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearChat = () => {
    dispatch(clearMessages());
    setIsMenuOpen(false);
  };

  const handleSearch = () => {
    // In a real app, this would open a search input or modal
    alert('Search functionality would open here');
    setIsMenuOpen(false);
  };

  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-20 relative">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {activeContact?.name?.substring(0, 2).toUpperCase() || 'ST'}
          </div>
          {activeContact?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            {activeContact?.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-green-500 font-medium">Online</span>
          </div>
        </div>
      </div>
      
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30">
            <button 
              onClick={handleSearch}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>Search</span>
            </button>
            <button 
              onClick={handleClearChat}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Clear Chat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
