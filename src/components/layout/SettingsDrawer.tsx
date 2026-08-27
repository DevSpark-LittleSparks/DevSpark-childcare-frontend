import React, { useState, useEffect, useRef } from 'react';
import { X, Moon, Globe, DollarSign, Clock, ChevronRight, LogOut, User, Check, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, logout } from '../../features/auth/model/authSlice';
import { updateSettings, setLocalSetting } from '../../features/settings/model/settingsSlice';
import { RootState } from '../../store';
import adminAvatar from '../../assets/images/admin-avatar.jpeg';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ open, onClose }) => {
  const user = useSelector(selectUser);
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Close on outside click or escape
  useEffect(() => {
    if (!open) {
      setExpandedSection(null);
      return;
    }
    const handleMouse = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleMouse);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleMouse);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const handleSignOut = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
  };

  const handleProfileNav = () => {
    onClose();
    navigate('/admin/profile');
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleChange = (key: 'theme' | 'language' | 'currency' | 'timezone', value: string) => {
    // Optimistic local update
    dispatch(setLocalSetting({ key, value }));
    // API update
    dispatch(updateSettings({ [key]: value }) as any);
  };

  const isDarkMode = settings?.theme === 'dark';

  const languages = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
  ];
  const currencies = [
    { code: 'LKR', label: 'LKR' },
    { code: 'USD', label: 'USD' },
  ];
  const timezones = [
    { code: 'Asia/Colombo', label: 'Colombo' },
    { code: 'America/New_York', label: 'New York' },
  ];

  const currentLangLabel = languages.find(l => l.code === settings?.language)?.label || 'English (US)';
  const currentCurrLabel = currencies.find(c => c.code === settings?.currency)?.label || 'LKR';
  const currentTzLabel = timezones.find(t => t.code === settings?.timezone)?.label || 'Colombo';

  const CustomSelect = ({ 
    id, options, currentValue, onChange 
  }: { 
    id: string, options: {code: string, label: string}[], currentValue: string, onChange: (val: string) => void 
  }) => {
    if (expandedSection !== id) return null;
    return (
      <div className="mt-2 ml-14 mr-2 bg-slate-50 rounded-xl p-2 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200 dark:bg-slate-800">
        {options.map((opt) => (
          <div 
            key={opt.code} 
            onClick={() => { onChange(opt.code); setExpandedSection(null); }}
            className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
              currentValue === opt.code 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400' 
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {opt.label}
            {currentValue === opt.code && <Check className="w-3.5 h-3.5" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[1100] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-screen z-[1200] w-[280px] bg-[#F8FAFC] dark:bg-slate-900 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Profile Header Area */}
        <div className="relative pt-6 pb-12 px-6 shrink-0 flex flex-col items-center text-center">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-lg transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mt-4 mb-3">
            <img
              src={user?.photoURL && user.photoURL !== "null" && user.photoURL.trim() !== "" ? user.photoURL : adminAvatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto dark:border-slate-800"
              onError={(e) => { (e.target as HTMLImageElement).src = adminAvatar; }}
            />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {user?.displayName || "Admin User"}
          </h2>
          <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-[11px] font-medium dark:text-slate-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span>{user?.role || "Administrator"}</span>
          </div>
        </div>

        {/* White Settings Card */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-t-[1.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-5 py-6 overflow-y-auto scrollbar-hide">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 px-1">Settings</h3>
          
          <div className="space-y-4">
            
            {/* Account Settings */}
            <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors" onClick={handleProfileNav}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Account</span>
                  <span className="text-[10px] text-slate-400 font-medium">Manage your profile</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors mr-1" />
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors" onClick={() => handleChange('theme', isDarkMode ? 'light' : 'dark')}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Dark Mode</span>
              </div>
              <div className={`w-[42px] h-6 rounded-full transition-colors relative mr-1 ${isDarkMode ? 'bg-primary-500' : 'bg-slate-200'}`}>
                <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-[18px]' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Language */}
            <div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors" onClick={() => toggleSection('language')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ff4d6d] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#ff4d6d]/20">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Language</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 mr-1">
                  <span className="text-[11px] font-medium">{currentLangLabel}</span>
                  {expandedSection === 'language' ? <ChevronDown className="w-4 h-4 text-[#ff4d6d]" /> : <ChevronRight className="w-4 h-4 group-hover:text-[#ff4d6d] transition-colors" />}
                </div>
              </div>
              <CustomSelect id="language" options={languages} currentValue={settings?.language || ''} onChange={(v) => handleChange('language', v)} />
            </div>

            {/* Currency */}
            <div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors" onClick={() => toggleSection('currency')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f72585] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#f72585]/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Currency</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 mr-1">
                  <span className="text-[11px] font-medium">{currentCurrLabel}</span>
                  {expandedSection === 'currency' ? <ChevronDown className="w-4 h-4 text-[#f72585]" /> : <ChevronRight className="w-4 h-4 group-hover:text-[#f72585] transition-colors" />}
                </div>
              </div>
              <CustomSelect id="currency" options={currencies} currentValue={settings?.currency || ''} onChange={(v) => handleChange('currency', v)} />
            </div>

            {/* Timezone */}
            <div>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors" onClick={() => toggleSection('timezone')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#4cc9f0] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#4cc9f0]/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Timezone</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 mr-1">
                  <span className="text-[11px] font-medium max-w-[80px] truncate">{currentTzLabel}</span>
                  {expandedSection === 'timezone' ? <ChevronDown className="w-4 h-4 text-[#4cc9f0]" /> : <ChevronRight className="w-4 h-4 group-hover:text-[#4cc9f0] transition-colors" />}
                </div>
              </div>
              <CustomSelect id="timezone" options={timezones} currentValue={settings?.timezone || ''} onChange={(v) => handleChange('timezone', v)} />
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-slate-100 dark:bg-slate-700 my-4 mx-2"></div>

            {/* Sign Out */}
            <div 
              className="flex items-center gap-4 group cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-colors" 
              onClick={handleSignOut}
            >
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-[13px] font-bold text-red-500">Sign Out</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;


