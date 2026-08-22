import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Baby, Eye, EyeOff, Lock, Heart, ArrowLeft,
  Save, Edit2, Key, CheckCircle2, AlertCircle, Loader2, Camera, Send, ShieldCheck
} from 'lucide-react';
import { useAppSelector } from '../../store';
import { Button } from '../../components/common/Button';
import { PhoneInput } from '../../components/common/PhoneInput';
import { apiClient } from '../../services/axiosInstance';
import { UserProfile } from '../../types/user.types';

interface ChildSummary {
  childId: string;
  name: string;
  profilePic?: string;
  status: string;
}

interface ParentProfileData {
  parentId: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  role: string;
  relationship: string;
  phone: string;
  nic: string;
  address: string;
  children: ChildSummary[];
}

const ParentProfilePage: React.FC<{ initialUser?: UserProfile }> = () => {
  const navigate = useNavigate();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useState<ParentProfileData>({
    parentId: '',
    fullName: '',
    email: '',
    profilePicture: '',
    role: '',
    relationship: 'Guardian',
    phone: '',
    nic: '',
    address: '',
    children: []
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Request form state
  const [requestType, setRequestType] = useState<string>("");
  const [requestDescription, setRequestDescription] = useState<string>("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/api/v1/parent/profile');
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch parent profile:", err);
      setStatusMessage({ type: 'error', text: 'Failed to load profile data.' });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    if (name === 'phone') {
      value = "+94" + value.replace(/^\+94\s?/, '');
    }
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUser(prev => ({ ...prev, profilePicture: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      await apiClient.put('/api/v1/parent/profile', user);
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Parent profile updated successfully!' });
      fetchProfile();
    } catch (err: any) {
      console.error("Update failed:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Update failed. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      return setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
    }
    if (passwords.new.length < 6) {
      return setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
    }

    setIsChangingPassword(true);
    try {
      const res = await apiClient.post('/api/v1/parent/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: 'Security key updated successfully.' });
        setPasswords({ current: '', new: '', confirm: '' });
      }
    } catch (err: any) {
      console.error("Failed to update password:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };


  const handleSubmitRequest = async () => {
    if (!requestType || !requestDescription.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in all request fields.' });
      return;
    }
    if (!reduxUser?.uid) return;

    setIsSubmittingRequest(true);
    try {
      await apiClient.post(`/api/v1/notifications/submit-request?userId=${reduxUser.uid}&type=${requestType}`, requestDescription);
      setRequestType("");
      setRequestDescription("");
      setStatusMessage({ type: 'success', text: 'Request submitted to administration.' });
    } catch (err) {
      console.error("Failed to submit request:", err);
      setStatusMessage({ type: 'error', text: 'Failed to submit request.' });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft className="text-slate-400 group-hover:text-primary-500" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-xl border animate-in slide-in-from-top-4 duration-300 z-50 bg-white ${statusMessage.type === 'success' ? 'text-secondary-500 border-secondary-500/20' : 'text-red-500 border-red-100'
            }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{statusMessage.text}</span>
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(10,6,55,0.05)] border border-slate-200 overflow-hidden">
          <div className="relative h-72 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-hero-blue via-hero-purple to-hero-pink opacity-90"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06C5D4 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="h-32 w-32 bg-white p-1.5 rounded-[2.2rem] shadow-2xl border border-white/50 overflow-hidden">
                  <div className="h-full w-full bg-sidebar-bg rounded-[1.8rem] overflow-hidden flex items-center justify-center">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Parent"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 to-hero-purple text-white font-black text-5xl uppercase select-none">
                        {user.fullName ? user.fullName.charAt(0) : 'P'}
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -right-1 -bottom-1 bg-primary-500 text-white p-2.5 rounded-2xl shadow-xl hover:bg-primary-600 transition-all border-4 border-white"
                  >
                    <Camera size={18} />
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">
                {user.fullName || "Parent Name"}
              </h1>

              <div className="flex items-center justify-center mt-2">
                <span className="bg-midnight text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.25em] shadow-lg shadow-midnight/20">
                  {user.relationship} Profile
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="flex justify-between items-center bg-sidebar-bg/40 p-5 rounded-[2.5rem] border border-sidebar-bg">
              <div className="flex items-center gap-3 ml-2">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <ShieldCheck className="text-primary-500" size={20} />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Guardian Account Control</span>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="rounded-2xl px-6 bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 transition-all font-bold text-xs"
                >
                  <Edit2 size={14} className="mr-2" /> Modify Profile
                </Button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => { setIsEditing(false); fetchProfile(); }}
                    className="text-slate-500 font-bold text-xs hover:text-midnight"
                  >
                    Discard
                  </button>
                  <Button
                    onClick={handleSaveData}
                    disabled={isSaving}
                    className="bg-primary-500 hover:bg-primary-600 px-8 rounded-2xl shadow-lg shadow-primary-500/20 font-bold text-xs py-3"
                  >
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={14} /> : <Save size={14} className="mr-2" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-midnight uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="w-10 h-[3px] bg-primary-500 rounded-full"></div> Personal Information
                </h3>
                <div className="space-y-6">
                  <ParentInput label="Full Name" name="fullName" icon={User} value={user.fullName} onChange={handleInputChange} disabled={!isEditing} />
                  <ParentInput label="Relationship" name="relationship" icon={Heart} value={user.relationship} disabled={true} />
                  <ParentInput label="Registered Email" name="email" icon={Mail} value={user.email} disabled={true} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Phone</label>
                      <PhoneInput 
                        name="phone" 
                        variant="profile"
                        value={user.phone} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                      />
                    </div>
                    <ParentInput label="National ID / NIC" name="nic" icon={Lock} value={user.nic} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-midnight uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="w-10 h-[3px] bg-indigo-500 rounded-full"></div> Residential Data
                </h3>
                <div className="space-y-6 bg-sidebar-bg/20 p-8 rounded-[2.5rem] border border-sidebar-bg/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                      <textarea
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none text-sm font-bold text-midnight min-h-[224px] focus:border-primary-500 transition-all disabled:bg-slate-50 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 p-4 opacity-[0.1] rotate-[-15deg] pointer-events-none">
                <Baby size={220} className="text-primary-900" />
              </div>

              <h3 className="text-[11px] font-black text-midnight mb-8 flex items-center gap-3 uppercase tracking-[0.3em] relative z-10">
                Enrolled <span className="text-primary-500 underline decoration-primary-500/30 underline-offset-8 tracking-normal">Little Sparks</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {user.children && user.children.length > 0 ? (
                  user.children.map((child) => (
                    <div
                      key={child.childId}
                      onClick={() => navigate(`/parent/child-profile/${child.childId}`)}
                      className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2.2rem] hover:shadow-2xl hover:shadow-primary-500/5 hover:border-primary-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="bg-midnight h-14 w-14 rounded-2xl flex items-center justify-center text-primary-500 font-black group-hover:scale-105 transition-transform shadow-lg overflow-hidden border border-slate-200">
                          {child.profilePic ? (
                            <img src={child.profilePic} className="h-full w-full object-cover" alt={child.name} />
                          ) : (
                            <span className="text-xl uppercase">{child.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-midnight text-base tracking-tight">{child.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-secondary-500"></div>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{child.status}</p>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-sidebar-bg flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all border border-sidebar-bg">
                        <Eye size={16} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center bg-white/50 rounded-3xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 text-sm font-bold">No active enrollments found.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-sidebar-bg/20 rounded-[3rem] p-8 border border-sidebar-bg/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <Send size={100} className="text-primary-900" />
              </div>
              <h3 className="text-[11px] font-black text-midnight mb-6 flex items-center gap-3 uppercase tracking-[0.3em] relative z-10">
                <Send size={16} className="text-primary-500" />
                Administrative Request
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Request Category</label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 outline-none font-bold text-sm text-midnight appearance-none"
                  >
                    <option value="">Select Type</option>
                    <option value="child-info-update">Child Info Update</option>
                    <option value="relationship-correction">Correct Relationship</option>
                    <option value="billing-query">Billing Query</option>
                    <option value="pickup-change">Pickup Change</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                      placeholder="Detail your request here..."
                      autoComplete="off"
                      className="flex-1 p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 outline-none font-bold text-sm text-midnight"
                    />
                    <Button
                      onClick={handleSubmitRequest}
                      disabled={isSubmittingRequest}
                      className="bg-midnight hover:bg-black text-white px-8 rounded-2xl font-black text-[10px] tracking-widest py-4"
                    >
                      {isSubmittingRequest ? <Loader2 className="animate-spin" size={16} /> : "SUBMIT"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <div className="bg-midnight rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="space-y-2">
                      <h4 className="text-white font-black text-xl uppercase tracking-tight">Security & Credentials</h4>
                      <p className="text-slate-400 text-xs tracking-wider">Secure your parent portal access keys.</p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                      <ShieldCheck className="text-primary-500" size={24} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Key</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="w-full pl-11 p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-primary-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">New Key</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input
                          type="password"
                          placeholder="New access key"
                          value={passwords.new}
                          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          className="w-full pl-11 p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-primary-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New</label>
                      <div className="relative flex gap-3">
                        <div className="relative flex-1">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                          <input
                            type="password"
                            placeholder="Confirm key"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full pl-11 p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-primary-500 transition-all"
                          />
                        </div>
                        <button
                          onClick={handlePasswordUpdate}
                          disabled={isChangingPassword || !passwords.current || !passwords.new}
                          className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-800 p-4 rounded-2xl text-white transition-all shadow-lg active:scale-95"
                        >
                          {isChangingPassword ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Parent Input Component
const ParentInput = ({ label, icon: Icon, locked, ...props }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
      {label} {locked && <Lock size={10} className="text-primary-500 ml-1 inline mb-0.5" />}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={18} />
      <input
        {...props}
        className="w-full pl-12 p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none text-sm font-bold text-midnight disabled:opacity-60 disabled:bg-slate-50 shadow-sm"
      />
    </div>
  </div>
);

export default ParentProfilePage;