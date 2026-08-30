import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Baby, Eye, EyeOff, Lock, Heart, ArrowLeft,
  Save, Edit2, Key, CheckCircle2, AlertCircle, Loader2, Camera, Send, ShieldCheck, FileText
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setUser } from '../../store/slices/authSlice';
import { Button } from '../../components/common/Button';
import { PhoneInput } from '../../components/common/PhoneInput';
import { ErrorMessage } from '../../components/common/ErrorMessage';
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
  phone1: string;
  phone2: string;
  nic: string;
  address: string;
  children: ChildSummary[];
}

const ParentProfilePage: React.FC<{ initialUser?: UserProfile }> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useState<ParentProfileData>({
    parentId: '',
    fullName: '',
    email: '',
    profilePicture: '',
    role: '',
    relationship: 'Guardian',
    phone1: '',
    phone2: '',
    nic: '',
    address: '',
    children: []
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
    if (name === 'phone1' || name === 'phone2' || name === 'phone') {
      value = "+94" + value.replace(/^\+94\s?/, '');
    }
    setUser(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    const newErrors: Record<string, string> = {};
    if (!user.fullName?.trim()) newErrors.fullName = 'Full Name is required';
    if (!user.address?.trim()) newErrors.address = 'Address is required';
    const slPhoneRegex = /^\+94\d{9}$/;
    if (user.phone1 && !slPhoneRegex.test(user.phone1)) newErrors.phone1 = 'Invalid phone number';
    if (user.phone2 && !slPhoneRegex.test(user.phone2)) newErrors.phone2 = 'Invalid phone number';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    try {
      const payload = {
        fullName: user.fullName,
        phone: user.phone1,
        address: user.address,
        profilePicture: user.profilePicture,
        nic: user.nic
      };
      await apiClient.put('/api/v1/parent/profile', payload);
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Parent profile updated successfully!' });
      if (reduxUser) {
        dispatch(setUser({ ...reduxUser, displayName: user.fullName, photoURL: user.profilePicture || reduxUser.photoURL }));
      }
      fetchProfile();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const newErrors: Record<string, string> = {};
    if (passwords.new !== passwords.confirm) newErrors.confirm = 'Passwords do not match.';
    if (passwords.new.length < 6) newErrors.new = 'New password must be at least 6 characters.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSubmitRequest = async () => {
    const newErrors: Record<string, string> = {};
    if (!requestType) newErrors.requestType = 'Please select a request type';
    if (!requestDescription.trim()) newErrors.requestDescription = 'Please provide a description';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmittingRequest(true);
    try {
      await apiClient.post(`/api/v1/notifications/submit-request`, { type: requestType, description: requestDescription });
      setRequestType("");
      setRequestDescription("");
      setStatusMessage({ type: 'success', text: 'Request submitted to administration.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to submit request.' });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group">
          <ArrowLeft className="text-slate-400 group-hover:text-primary-500" size={20} />
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-6 space-y-8">
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-xl border bg-white ${statusMessage.type === 'success' ? 'text-secondary-500 border-secondary-500/20' : 'text-red-500 border-red-100'}`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{statusMessage.text}</span>
          </div>
        )}

        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(10,6,55,0.05)] border border-slate-200 overflow-hidden">
          <div className="relative h-72 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-hero-blue via-hero-purple to-hero-pink opacity-90"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="h-32 w-32 bg-white p-1.5 rounded-[2.2rem] shadow-2xl border border-white/50 overflow-hidden">
                  <div className="h-full w-full bg-sidebar-bg rounded-[1.8rem] overflow-hidden flex items-center justify-center">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Parent" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 to-hero-purple text-white font-black text-5xl uppercase">
                        {user.fullName ? user.fullName.charAt(0) : 'P'}
                      </div>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button onClick={() => fileInputRef.current?.click()} className="absolute -right-1 -bottom-1 bg-primary-500 text-white p-2.5 rounded-2xl shadow-xl hover:bg-primary-600 border-4 border-white">
                    <Camera size={18} />
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
              <h1 className="text-3xl font-black text-white uppercase">{user.fullName || "Parent Name"}</h1>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="flex justify-between items-center bg-sidebar-bg/40 p-5 rounded-[2.5rem] border border-sidebar-bg">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Guardian Account Control</span>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="rounded-2xl px-6 bg-white border-2 border-primary-500 text-primary-500 font-bold text-xs"><Edit2 size={14} className="mr-2" /> Modify Profile</Button>
              ) : (
                <div className="flex gap-4">
                  <button onClick={() => { setIsEditing(false); fetchProfile(); }} className="text-slate-500 font-bold text-xs">Discard</button>
                  <Button onClick={handleSaveData} disabled={isSaving} className="bg-primary-500 px-8 rounded-2xl font-bold text-xs py-3">
                    {isSaving ? <Loader2 className="animate-spin" size={14} /> : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-midnight uppercase tracking-[0.4em]">Personal Information</h3>
                <div className="space-y-6">
                  <ParentInput label="Full Name" name="fullName" icon={User} value={user.fullName} onChange={handleInputChange} disabled={!isEditing} error={errors.fullName} />
                  <ParentInput label="Registered Email" name="email" icon={Mail} value={user.email} disabled={true} />
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Phone</label>
                      <PhoneInput name="phone1" variant="profile" value={user.phone1} onChange={handleInputChange} disabled={!isEditing} error={errors.phone1} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secondary Phone</label>
                      <PhoneInput name="phone2" variant="profile" value={user.phone2} onChange={handleInputChange} disabled={!isEditing} error={errors.phone2} />
                    </div>
                    <ParentInput label="National ID / NIC" name="nic" icon={Lock} value={user.nic} onChange={handleInputChange} disabled={!isEditing} error={errors.nic} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[11px] font-black text-midnight uppercase tracking-[0.4em]">Residential Data</h3>
                <div className="space-y-6 bg-sidebar-bg/20 p-8 rounded-[2.5rem] border border-sidebar-bg/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Address</label>
                    <textarea name="address" value={user.address || ''} onChange={handleInputChange} disabled={!isEditing} rows={3} className={`w-full pl-4 p-4 bg-white border-2 ${errors.address ? 'border-red-500' : 'border-slate-100'} rounded-2xl outline-none text-sm font-bold text-midnight disabled:bg-slate-50`} />
                    <ErrorMessage message={errors.address} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sidebar-bg/20 rounded-[3rem] p-8 border border-sidebar-bg/50">
              <h3 className="text-[11px] font-black text-midnight mb-6 uppercase tracking-[0.3em]">Administrative Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Send size={12} className="text-secondary-500" /> Request Type</label>
                  <select value={requestType} onChange={(e) => setRequestType(e.target.value)} className={`w-full p-4 bg-white border-2 ${errors.requestType ? 'border-red-500' : 'border-slate-100'} rounded-2xl outline-none text-sm font-bold text-midnight appearance-none`}>
                    <option value="" disabled>Select inquiry type</option>
                    <option value="Billing Issue">Billing Issue</option>
                    <option value="Child Progress">Child Progress</option>
                    <option value="Schedule Change">Schedule Change</option>
                    <option value="Other">Other</option>
                  </select>
                  <ErrorMessage message={errors.requestType} />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={12} className="text-secondary-500" /> Description</label>
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 w-full">
                      <textarea value={requestDescription} onChange={(e) => setRequestDescription(e.target.value)} placeholder="Detail your request here..." rows={2} className={`w-full p-4 bg-white border-2 ${errors.requestDescription ? 'border-red-500' : 'border-slate-100'} rounded-2xl outline-none text-sm font-bold text-slate-700 resize-none`} />
                      <ErrorMessage message={errors.requestDescription} />
                    </div>
                    <Button onClick={handleSubmitRequest} disabled={isSubmittingRequest} className="bg-midnight text-white px-8 rounded-2xl font-black text-[10px] py-4">SUBMIT</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <div className="bg-midnight rounded-[3rem] p-8 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                    <input type="password" placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                    <input type="password" placeholder="Enter new password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className={`w-full p-4 bg-white/5 border ${errors.new ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-sm outline-none`} />
                    <ErrorMessage message={errors.new} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New</label>
                    <div className="flex gap-3">
                      <input type="password" placeholder="Confirm password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className={`w-full p-4 bg-white/5 border ${errors.confirm ? 'border-red-500' : 'border-white/10'} rounded-2xl text-white text-sm outline-none`} />
                      <button onClick={handlePasswordUpdate} className="bg-primary-500 p-4 rounded-2xl text-white active:scale-95">{isChangingPassword ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}</button>
                    </div>
                    <ErrorMessage message={errors.confirm} />
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

const ParentInput = ({ label, icon: Icon, error, value, ...props }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
      <input {...props} value={value || ''} className={`w-full pl-12 p-4 bg-white border-2 ${error ? 'border-red-500' : 'border-slate-100'} rounded-2xl outline-none text-sm font-bold text-midnight disabled:bg-slate-50 transition-all`} />
    </div>
    <ErrorMessage message={error} />
  </div>
);

export default ParentProfilePage;