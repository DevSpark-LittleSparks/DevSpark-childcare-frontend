import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, Eye, EyeOff, Save, Edit2, 
  Key, CheckCircle2, AlertCircle, Loader2, Camera, School, Users, ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/common/Button';

// Asset import
import adminAvatar from '../../assets/images/admin-avatar.jpeg';

interface AdminProfileData {
  name: string;
  email: string;
  role: string;
  phone1: string;
  phone2: string;
  address: string;
  password: string;
  profileImage?: string;
  centerName: string;
  capacity: string;
}

interface AdminProfilePageProps {
  initialUser: AdminProfileData;
}

const AdminProfilePage: React.FC<AdminProfilePageProps> = ({ initialUser }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useState<AdminProfileData>(initialUser);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUser(prev => ({ ...prev, profileImage: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAllData = async () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('admin_profile_data', JSON.stringify(user));
      setIsSaving(false);
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Administrative profile and center details updated successfully.' });
    }, 1500);
  };

  return (
    /* Strict Scroll Hide: 
       'overflow-y-auto' සහ 'no-scrollbar' (Tailwind plugin/CSS) භාවිතා කර ඇත.
    */
    <div className="h-screen w-full bg-surface-secondary overflow-hidden font-sans">
      <div className="h-full w-full overflow-y-auto scrollbar-hide md:p-8 p-4">
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <div className="max-w-4xl mx-auto pb-20">
          
          {/* Status Alert */}
          {statusMessage && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-xl border animate-in slide-in-from-top-4 duration-300 z-50 bg-white ${
              statusMessage.type === 'success' ? 'text-secondary-500 border-secondary-500/20' : 'text-red-500 border-red-100'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{statusMessage.text}</span>
            </div>
          )}

          <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(10,6,55,0.05)] border border-slate-200 overflow-hidden">
            
            {/* Header Section with Config Gradients */}
            <div className="relative h-72 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-hero-blue via-hero-purple to-hero-pink opacity-90"></div>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06C5D4 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="h-32 w-32 bg-white p-1.5 rounded-[2.2rem] shadow-2xl border border-white/50 overflow-hidden">
                    <div className="h-full w-full bg-sidebar-bg rounded-[1.8rem] overflow-hidden">
                      <img 
                        src={user.profileImage || adminAvatar} 
                        alt="Admin" 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
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

                <h1 className="text-3xl font-black text-midnight tracking-tight mb-2 uppercase">
                  {user.name}
                </h1>
                
                <span className="bg-midnight text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.25em] shadow-lg shadow-midnight/20">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-12">

              {/* Action Bar */}
              <div className="flex justify-between items-center bg-sidebar-bg/40 p-5 rounded-[2.5rem] border border-sidebar-bg">
                <div className="flex items-center gap-3 ml-2">
                   <div className="p-2 bg-white rounded-xl shadow-sm">
                      <ShieldCheck className="text-primary-500" size={20} />
                   </div>
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Management Console</span>
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
                      onClick={() => { setIsEditing(false); setUser(initialUser); }} 
                      className="text-slate-500 font-bold text-xs hover:text-midnight"
                    >
                      Discard
                    </button>
                    <Button 
                      onClick={handleSaveAllData} 
                      disabled={isSaving} 
                      className="bg-primary-500 hover:bg-primary-600 text-white px-8 rounded-2xl shadow-lg shadow-primary-500/20 font-bold text-xs py-3"
                    >
                      {isSaving ? <Loader2 className="animate-spin mr-2" size={14} /> : <Save size={14} className="mr-2" />} 
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                
                {/* Personal Info */}
                <div className="space-y-8">
                  <h3 className="text-[11px] font-black text-midnight uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-10 h-[3px] bg-primary-500 rounded-full"></div> Personal Information
                  </h3>
                  <div className="space-y-6">
                    <AdminInput label="Full Name" name="name" icon={User} value={user.name} onChange={handleInputChange} disabled={!isEditing} />
                    <AdminInput label="Registered Email" name="email" icon={Mail} value={user.email} disabled={true} />
                    <div className="grid grid-cols-2 gap-4">
                      <AdminInput label="Primary Phone" name="phone1" icon={Phone} value={user.phone1} onChange={handleInputChange} disabled={!isEditing} />
                      <AdminInput label="Secondary" name="phone2" icon={Phone} value={user.phone2} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                  </div>
                </div>

                {/* Preschool Data */}
                <div className="space-y-8">
                  <h3 className="text-[11px] font-black text-midnight uppercase tracking-[0.4em] flex items-center gap-3">
                    <div className="w-10 h-[3px] bg-secondary-500 rounded-full"></div> Preschool Data
                  </h3>
                  <div className="space-y-6 bg-sidebar-bg/20 p-8 rounded-[2.5rem] border border-sidebar-bg/50">
                    <AdminInput label="Institution Name" name="centerName" icon={School} value={user.centerName} onChange={handleInputChange} disabled={!isEditing} />
                    <AdminInput label="Max Enrollment" name="capacity" icon={Users} value={user.capacity} onChange={handleInputChange} disabled={!isEditing} />
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Physical Address</label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                          <textarea 
                            name="address"
                            value={user.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full pl-12 p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none text-sm font-bold text-midnight min-h-[90px] focus:border-primary-500 transition-all disabled:bg-slate-50"
                          />
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="pt-10 border-t border-slate-100">
                 <div className="bg-midnight rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                       <div className="space-y-4">
                          <div className="inline-block p-3 bg-white/5 border border-white/10 rounded-2xl mb-2">
                            <Key className="text-primary-500" size={24} />
                          </div>
                          <h4 className="text-white font-black text-xl uppercase tracking-tight">Security Credentials</h4>
                          <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                            Keep your administrative access safe. This key is required for all sensitive system updates.
                          </p>
                       </div>

                       <div className="space-y-6">
                          <div className="relative group">
                             <input 
                               type={showPassword ? "text" : "password"} 
                               value={user.password} 
                               disabled 
                               className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-primary-100 font-mono text-sm tracking-[0.3em] transition-all group-hover:bg-white/10" 
                             />
                             <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-5 text-slate-500 hover:text-white transition-colors">
                               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                             </button>
                          </div>

                          <div className="flex gap-3">
                             <input 
                                type="text" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={!isEditing}
                                placeholder="New Security Key..."
                                className="flex-1 p-4 bg-white/10 border border-white/10 rounded-2xl text-white font-mono text-xs focus:border-primary-500 outline-none disabled:opacity-20 placeholder:text-slate-600"
                             />
                             <button 
                               onClick={() => {
                                 if(newPassword.length < 6) return setStatusMessage({type:'error', text:'Key is too weak.'});
                                 setUser({...user, password: newPassword});
                                 setNewPassword("");
                                 setStatusMessage({type:'success', text:'Security key updated locally.'});
                               }} 
                               disabled={!isEditing || !newPassword}
                               className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-800 p-4 rounded-2xl text-white transition-all shadow-lg"
                             >
                               <CheckCircle2 size={20} />
                             </button>
                          </div>
                       </div>
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

// Reusable Input
const AdminInput = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={18} />
      <input 
        {...props} 
        className="w-full pl-12 p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none text-sm font-bold text-midnight disabled:opacity-60 disabled:bg-slate-50" 
      />
    </div>
  </div>
);

export default AdminProfilePage;