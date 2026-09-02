import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import {
  User, Mail, MapPin, Save, Edit2, ArrowLeft, Briefcase,
  Key, CheckCircle2, AlertCircle, Loader2, Camera, School, Users, ShieldCheck, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { PhoneInput } from '../../components/common/PhoneInput';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { apiClient } from '../../services/axiosInstance';
import { useAppDispatch, useAppSelector } from '../../store';
import { setUser as setReduxUser } from '../../features/auth/model/authSlice';
import { firebaseAuth } from '../../lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

interface AdminProfileData {
  fullName: string;
  email: string;
  role: string;
  phone1: string;
  phone2: string;
  address: string;
  profilePic?: string;
  designation: string;
  branchName: string;
}

const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useState<AdminProfileData>({
    fullName: '',
    email: '',
    role: '',
    phone1: '',
    phone2: '',
    address: '',
    designation: '',
    branchName: ''
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/api/v1/auth/admin/profile');
      if (res.data.success) {
        const data = res.data.data;
        if (data.phone1) {
          data.phone1 = data.phone1.replace(/\s+/g, '');
          data.phone1 = data.phone1.startsWith('+94') ? data.phone1 : "+94" + data.phone1.replace(/^0+/, '');
        }
        if (data.phone2) {
          data.phone2 = data.phone2.replace(/\s+/g, '');
          data.phone2 = data.phone2.startsWith('+94') ? data.phone2 : "+94" + data.phone2.replace(/^0+/, '');
        }
        setUser(prev => ({
          ...prev,
          ...data,
          phone1: data.phone1 || '',
          phone2: data.phone2 || ''
        }));
      }
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
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
    if (name === 'phone1' || name === 'phone2') {
      value = "+94" + value.replace(/^\+94\s?/, '').replace(/\s+/g, '');
    }
    setUser(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUser(prev => ({ ...prev, profilePic: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAllData = async () => {
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
      const res = await apiClient.put('/api/v1/auth/admin/profile', user);
      if (res.data.success) {
        setIsEditing(false);
        setStatusMessage({ type: 'success', text: 'Administrative profile and center details updated successfully.' });
        if (reduxUser) {
          dispatch(setReduxUser({ ...reduxUser, displayName: user.fullName, photoURL: user.profilePic || reduxUser.photoURL }));
        }
        fetchProfile();
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const newErrors: Record<string, string> = {};
    if (!passwords.current) newErrors.current = 'Required';
    
    if (!passwords.new) {
      newErrors.new = 'Required';
    } else {
      if (passwords.new.length < 8) newErrors.new = 'Must be at least 8 characters.';
      else if (!/[A-Z]/.test(passwords.new)) newErrors.new = 'Must contain an uppercase letter.';
      else if (!/[0-9]/.test(passwords.new)) newErrors.new = 'Must contain a number.';
      else if (!/[!@#$%^&*]/.test(passwords.new)) newErrors.new = 'Must contain a special character.';
    }

    if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsChangingPassword(true);
    try {
      if (!firebaseAuth.currentUser || !firebaseAuth.currentUser.email) {
        throw new Error('User not logged in properly.');
      }

      // 1. Re-authenticate with current password
      const credential = EmailAuthProvider.credential(firebaseAuth.currentUser.email, passwords.current);
      await reauthenticateWithCredential(firebaseAuth.currentUser, credential);

      // 2. Update to new password
      await updatePassword(firebaseAuth.currentUser, passwords.new);

      setStatusMessage({ type: 'success', text: 'Password updated successfully.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      console.error("Failed to update password:", err);
      // Format Firebase error messages nicely
      let errorMsg = 'Failed to update password.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMsg = 'Current password is incorrect.';
      } else if (err.code === 'auth/requires-recent-login') {
        errorMsg = 'Please log out and log back in to change your password.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group"
          >
            <ArrowLeft className="text-slate-400 group-hover:text-primary-500" size={20} />
          </button>
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
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="h-32 w-32 bg-white p-1.5 rounded-[2.2rem] shadow-2xl border border-white/50 overflow-hidden">
                  <div className="h-full w-full bg-sidebar-bg rounded-[1.8rem] overflow-hidden flex items-center justify-center relative">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="Admin" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 to-hero-purple text-white font-black text-5xl uppercase select-none">
                        {user.fullName ? user.fullName.charAt(0) : 'A'}
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
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              </div>
              <h1 className="text-3xl font-black text-midnight tracking-tight mb-2 uppercase">{user.fullName}</h1>
              <span className="bg-midnight text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.25em] shadow-lg shadow-midnight/20">{user.role}</span>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="flex justify-between items-center bg-sidebar-bg/40 p-5 rounded-[2.5rem] border border-sidebar-bg">
              <div className="flex items-center gap-3 ml-2">
                <div className="p-2 bg-white rounded-xl shadow-sm"><ShieldCheck className="text-primary-500" size={20} /></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Management Console</span>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="rounded-2xl px-6 bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 transition-all font-bold text-xs">
                  <Edit2 size={14} className="mr-2" /> Modify Profile
                </Button>
              ) : (
                <div className="flex gap-4">
                  <button onClick={() => { setIsEditing(false); fetchProfile(); }} className="text-slate-500 font-bold text-xs hover:text-midnight">Discard</button>
                  <Button onClick={handleSaveAllData} disabled={isSaving} className="bg-primary-500 hover:bg-primary-600 px-8 rounded-2xl shadow-lg shadow-primary-500/20 font-bold text-xs py-3">
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={14} /> : <Save size={14} className="mr-2" />} Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              <div className="space-y-8 bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-[0_20px_60px_rgba(10,6,55,0.03)] border border-slate-100 dark:border-slate-800/60 p-8 md:p-12">
                <h3 className="text-xl font-black text-midnight dark:text-white uppercase tracking-tight flex items-center gap-4"><div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500"><User size={20} /></div> Personal Information</h3>
                <div className="space-y-6">
                  <AdminInput label="Full Name" name="fullName" icon={User} value={user.fullName} onChange={handleInputChange} disabled={!isEditing} error={errors.fullName} />
                  <AdminInput label="Registered Email" name="email" icon={Mail} value={user.email} disabled={true} />
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2 group text-left">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Primary Phone</label>
                      <PhoneInput name="phone1" variant="profile" value={user.phone1} onChange={handleInputChange} disabled={!isEditing} error={errors.phone1} />
                    </div>
                    <div className="space-y-2 group text-left">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Secondary Phone</label>
                      <PhoneInput name="phone2" variant="profile" value={user.phone2} onChange={handleInputChange} disabled={!isEditing} error={errors.phone2} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-[0_20px_60px_rgba(10,6,55,0.03)] border border-slate-100 dark:border-slate-800/60 p-8 md:p-12">
                <h3 className="text-xl font-black text-midnight dark:text-white uppercase tracking-tight flex items-center gap-4"><div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center text-secondary-500"><School size={20} /></div> Preschool Data</h3>
                <div className="space-y-6">
                  <AdminInput label="Branch Name" name="branchName" icon={School} value={user.branchName} onChange={handleInputChange} disabled={!isEditing} />
                  <AdminInput label="Designation" name="designation" icon={Briefcase} value={user.designation} onChange={handleInputChange} disabled={!isEditing} />
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                      <textarea
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full pl-12 p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.address ? 'border-red-500' : 'border-transparent'} rounded-2xl outline-none text-sm font-bold text-midnight dark:text-white min-h-[90px] focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] shadow-sm transition-all disabled:opacity-60 disabled:bg-slate-50`}
                      />
                    </div>
                    <ErrorMessage message={errors.address} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 dark:border-slate-800/60 mt-10">
              <div className="bg-slate-50/50 dark:bg-[#0f172a]/50 rounded-3xl border border-slate-100 dark:border-slate-800/60 p-8 md:p-10 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-midnight dark:text-white uppercase tracking-tight flex items-center gap-4">
                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-primary-500"><ShieldCheck size={18} /></div>
                        Security & Password
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full pl-12 p-4 bg-slate-100 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-midnight dark:text-white text-sm font-bold outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] shadow-sm transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className={`w-full pl-12 p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.new ? 'border-red-500' : 'border-transparent'} rounded-2xl text-midnight dark:text-white text-sm font-bold outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] shadow-sm transition-all`} />
                      </div>
                      <ErrorMessage message={errors.new} />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Confirm New</label>
                      <div className="relative flex gap-3">
                        <div className="relative flex-1">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input
                            type="password"
                            placeholder="Confirm password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className={`w-full pl-12 p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.confirm ? 'border-red-500' : 'border-transparent'} rounded-2xl text-midnight dark:text-white text-sm font-bold outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] shadow-sm transition-all`}
                          />
                        </div>
                        <button
                          onClick={handlePasswordUpdate}
                          disabled={isChangingPassword || !passwords.current || !passwords.new}
                          className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 p-4 rounded-2xl text-white transition-all shadow-lg active:scale-95 flex items-center justify-center"
                        >
                          {isChangingPassword ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        </button>
                      </div>
                      <ErrorMessage message={errors.confirm} />
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

const AdminInput = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="space-y-2 group text-left">
    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={18} />
      <input
        {...props}
        className={`w-full pl-12 p-4 bg-slate-100 dark:bg-slate-800/40 border-2 ${error ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] shadow-sm transition-all outline-none text-sm font-bold text-midnight dark:text-white disabled:opacity-60 disabled:bg-slate-50`}
      />
    </div>
    <ErrorMessage message={error} />
  </div>
);

export default AdminProfilePage;