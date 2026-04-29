import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import {
  User, Lock, Mail, Phone, MapPin, Eye, EyeOff,
  Save, X, Edit2, Sparkles, Key, CheckCircle2, AlertCircle, Loader2, Camera, Send
} from 'lucide-react';
import { UserProfile } from '../../types/user.types';
import { Button } from '../../components/common/Button';
import { themeColors } from '../../shared/theme/colors';

// Asset import
import adminAvatar from '../../assets/images/admin-avatar.jpeg';

interface TeacherProfilePageProps {
  initialUser: UserProfile;
}

const TeacherProfilePage: React.FC<TeacherProfilePageProps> = ({ initialUser }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Request form state
  const [requestType, setRequestType] = useState<string>("");
  const [requestDescription, setRequestDescription] = useState<string>("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSuggestion = () => {
    const randomID = Math.floor(1000 + Math.random() * 9000);
    const suggested = `SPARK-${user.name.split(' ')[0].toUpperCase() || 'TEACHER'}-${randomID}`;
    setSuggestion(suggested);
  };

  const applyNewPassword = () => {
    if (newPassword.trim().length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setUser(prev => ({ ...prev, password: newPassword }));
    setNewPassword("");
    setSuggestion("");
    setStatusMessage({ type: 'success', text: 'Security key updated locally.' });
  };

  const handleSaveData = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Teacher profile updated successfully!' });
    }, 1500);
  };

  const handleSubmitRequest = async () => {
    if (!requestType || !requestDescription.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in all request fields.' });
      return;
    }
    setIsSubmittingRequest(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingRequest(false);
      setRequestType("");
      setRequestDescription("");
      setStatusMessage({ type: 'success', text: 'Request submitted successfully!' });
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 bg-[#fcfcfd] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Status Alerts */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm border ${
            statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{statusMessage.text}</span>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">

          {/* Header Section */}
          <div className="relative h-48" style={{ background: themeColors.heroGradient }}>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

            {/* Top Bar Content */}
            <div className="absolute -bottom-12 left-10 flex items-end gap-6 w-full pr-20">
              {/* Profile Image Container */}
              <div className="relative group">
                <div
                  onClick={handleImageClick}
                  className={`h-36 w-36 bg-white p-2 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white ${isEditing ? 'cursor-pointer' : ''}`}
                >
                  <div className="h-full w-full bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 overflow-hidden">
                    <img
                      src={user.profileImage || adminAvatar}
                      alt="Teacher Profile"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + user.name;
                      }}
                    />
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Camera className="text-white mb-1" size={28} />
                      <span className="text-[10px] text-white font-black uppercase tracking-tighter">Change</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              {/* Name & Role Info */}
              <div className="mb-8 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {user.name}
                  </h1>
                  {isEditing && <div className="h-2 w-2 rounded-full bg-white animate-ping mt-2"></div>}
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-8 bg-white/50"></div>
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.25em] bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-28 p-10 space-y-12">

            {/* Control Bar */}
            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-3 ml-2">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <Sparkles className="text-cyan-500" size={18} />
                </div>
                <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Teacher Profile Management</h2>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 size={16} className="mr-2" />
                  Modify Profile
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => { setIsEditing(false); setUser(initialUser); }}
                    variant="ghost"
                    size="sm"
                  >
                    Discard
                  </Button>
                  <Button
                    onClick={handleSaveData}
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                    {isSaving ? "SAVING..." : "CONFIRM CHANGES"}
                  </Button>
                </div>
              )}
            </div>

            {/* Form Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

              {/* Name Field */}
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
                <div className="relative">
                  <User className={`absolute left-4 top-4 transition-colors ${!isEditing ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-cyan-500'}`} size={18} />
                  <input
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      !isEditing
                      ? 'bg-slate-50 border-slate-50 text-slate-400'
                      : 'bg-white border-slate-100 text-slate-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 shadow-sm'
                    }`}
                  />
                </div>
              </div>

              {[
                { label: 'Email Address', name: 'email', icon: Mail, value: user.email, disabled: true, locked: true },
                { label: 'Mobile Number', name: 'phone1', icon: Phone, value: user.phone1, disabled: !isEditing },
                { label: 'Alternative Contact', name: 'phone2', icon: Phone, value: user.phone2, disabled: !isEditing },
              ].map((field) => (
                <div key={field.name} className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    {field.label} {field.locked && <Lock size={10} className="text-secondary-500" />}
                  </label>
                  <div className="relative">
                    <field.icon className={`absolute left-4 top-4 transition-colors ${field.disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-cyan-500'}`} size={18} />
                    <input
                      name={field.name}
                      value={field.value as string}
                      onChange={handleInputChange}
                      disabled={field.disabled}
                      className={`w-full pl-12 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                        field.disabled
                        ? 'bg-slate-50 border-slate-50 text-slate-400'
                        : 'bg-white border-slate-100 text-slate-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 shadow-sm'
                      }`}
                    />
                  </div>
                </div>
              ))}

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-12 p-5 bg-white border-2 border-slate-100 rounded-[1.8rem] focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all disabled:bg-slate-50 font-bold text-sm shadow-sm"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Request Form Section */}
            <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
              <h3 className="text-xs font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                <Send size={16} className="text-cyan-500" />
                Submit Request
              </h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Request Type</label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all font-bold text-sm shadow-sm"
                  >
                    <option value="">Select Request Type</option>
                    <option value="schedule-change">Schedule Change</option>
                    <option value="leave-request">Leave Request</option>
                    <option value="material-request">Material Request</option>
                    <option value="student-concern">Student Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    placeholder="Describe your request in detail..."
                    className="w-full p-5 bg-white border-2 border-slate-100 rounded-[1.8rem] focus:border-secondary-500 focus:ring-4 focus:ring-secondary-500/5 transition-all font-bold text-sm shadow-sm"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={isSubmittingRequest}
                  className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-cyan-600 transition-all transform hover:-translate-y-0.5"
                >
                  {isSubmittingRequest ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send size={16} className="mr-2" />}
                  {isSubmittingRequest ? "SUBMITTING..." : "SUBMIT REQUEST"}
                </Button>
              </div>
            </div>

            {/* Security Area */}
            <div className="border-t border-slate-100 pt-14">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-1 w-12 bg-cyan-500 rounded-full"></div>
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Privacy & Credentials</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Active Authentication Key</label>
                  <div className="relative group">
                    <input type={showPassword ? "text" : "password"} value={user.password} disabled
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 pr-14 font-mono text-xs font-bold" />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 p-2"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-[2.2rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={16} className="text-cyan-500" /> AI Suggestion
                      </span>
                      <Button onClick={generateSuggestion} size="sm" className="bg-cyan-500 text-white">
                        NEW KEY
                      </Button>
                    </div>
                    {suggestion && (
                      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 animate-in slide-in-from-bottom-3 relative z-10">
                        <span className="font-mono text-sm font-black text-secondary-500 tracking-widest">{suggestion}</span>
                        <Button onClick={() => setNewPassword(suggestion)} variant="ghost" size="sm" className="text-white">
                          APPLY
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Establish New Key</label>
                  <div className="flex flex-col gap-4">
                    <div className="relative group">
                      <Key className={`absolute left-4 top-4 transition-colors ${!isEditing ? 'text-slate-200' : 'text-slate-400 group-focus-within:text-secondary-500'}`} size={18} />
                      <input
                        placeholder="Define your new secret code..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={!isEditing}
                        className="w-full pl-12 p-4 bg-white border border-slate-100 rounded-2xl focus:border-secondary-500 focus:ring-4 focus:ring-secondary-500/5 transition-all text-xs font-bold font-mono shadow-sm"
                      />
                    </div>
                    <Button
                      onClick={applyNewPassword}
                      disabled={!isEditing || !newPassword}
                      variant="secondary"
                      className="w-full"
                    >
                      UPDATE ACCESS KEY
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;