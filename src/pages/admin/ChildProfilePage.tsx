import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Camera, User, MapPin, ArrowLeft, Loader2, Save,
  Edit3, X, Scale, Ruler, Droplets,
  ClipboardList, Users, Calendar, Heart
} from 'lucide-react';
import { apiClient } from '../../services/axiosInstance';
import { Button } from '../../components/common/Button';

/**
 * ChildViewPage - Admin Management View
 * Synchronized with AdmissionsPage data structure for Sprouty.
 */

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  ENROLLED: {
    label: 'Preschool',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  BIG_SCHOOL_READY: {
    label: 'School Age',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? {
    label: status?.replace(/_/g, ' ') || 'Unknown',
    bg: 'bg-slate-50 dark:bg-slate-800/10',
    text: 'text-slate-500 dark:text-slate-300',
    dot: 'bg-slate-400',
  };

const ChildViewPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const location = useLocation();

  // Security: Check if user is accessing via the admin route
  const isAdmin = location.pathname.startsWith('/admin');

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State: Keys match the AdmissionsPage exactly
  const [formData, setFormData] = useState({
    fullName: '',
    nameWithInitials: '',
    dob: '',
    gender: 'male',
    bloodGroup: '',
    height: '',
    weight: '',
    address: '',
    specialNote: '',
    relationship: '',
    parentFullName: '',
    parentEmail: '',
    parentContact: '',
    parentID: '',
    status: 'ENROLLED'
  });

  // Calculate Age dynamically
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? `${calculatedAge} Years` : "");

      // Auto update status based on age
      if (calculatedAge >= 0) {
        const newStatus = calculatedAge >= 6 ? 'BIG_SCHOOL_READY' : 'ENROLLED';
        setFormData(prev => {
          if (prev.status !== 'ALUMNI' && prev.status !== newStatus) {
            return { ...prev, status: newStatus };
          }
          return prev;
        });
      }
    }
  }, [formData.dob]);

  // Load actual data from backend
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        // Fetch profile data
        const res = await apiClient.get(`/api/v1/auth/admin/child/${studentId}`);
        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            fullName: `${data.firstName} ${data.lastName}`.trim(),
            nameWithInitials: data.nameWithInitials || `${data.firstName.charAt(0)}.${data.lastName}`, // Read from DB or Fallback
            dob: data.dob || '',
            gender: data.gender ? data.gender.toLowerCase() : 'male',
            bloodGroup: data.bloodGroup || '',
            height: data.height || '',
            weight: data.weight || '',
            address: data.address || '',
            specialNote: data.specialNote || '',
            relationship: data.relationship || '',
            parentFullName: data.guardianName || '',
            parentEmail: data.guardianEmail || '',
            parentContact: data.parentContact || '',
            parentID: data.parentID || '',
            status: data.status || 'ENROLLED'
          });
          setPreviewImage(data.profilePic || null);
        }
      } catch (err) {
        console.error("Failed to fetch child data:", err);
      }
    };

    if (studentId) {
      fetchChildData();
    }
  }, [studentId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      'fullName', 'nameWithInitials', 'dob', 'gender', 'bloodGroup',
      'height', 'weight'
    ];

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (typeof value === 'string' ? value.trim() === "" : !value) {
        newErrors[field] = "Required";
      }
    });

    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      const ageInYears = Math.floor((today.getTime() - dob.getTime()) / 31557600000);

      if (dob > today) {
        newErrors['dob'] = "Cannot be in future";
      } else if (ageInYears < 3) {
        newErrors['dob'] = "Must be at least 3 years";
      } else if (ageInYears > 10) {
        newErrors['dob'] = "Must be <= 10 years";
      }
    }

    if (formData.height) {
      const h = Number(formData.height);
      if (isNaN(h) || h < 30 || h > 200) {
        newErrors['height'] = "Height must be between 30 and 200";
      }
    }

    if (formData.weight) {
      const w = Number(formData.weight);
      if (isNaN(w) || w < 2 || w > 100) {
        newErrors['weight'] = "Weight must be between 2 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Please check the form for errors.");
      return;
    }
    
    setIsSaving(true);

    try {
      // Split fullName back to first/last for backend if needed
      const nameParts = formData.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const payload = {
        firstName,
        lastName,
        nameWithInitials: formData.nameWithInitials,
        dob: formData.dob,
        gender: formData.gender.toUpperCase(),
        bloodGroup: formData.bloodGroup,
        height: formData.height,
        weight: formData.weight,
        address: formData.address,
        specialNote: formData.specialNote,
        guardianName: formData.parentFullName,
        guardianEmail: formData.parentEmail,
        profilePic: previewImage,
        status: formData.status
      };

      await apiClient.put(`/api/v1/auth/admin/child/${studentId}`, payload);
      setIsEditing(false);
      alert("Changes saved to database successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-10">

      {/* --- TOP BAR --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <ArrowLeft className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-primary-500" size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Student Profile
              </h1>
            </div>
          </div>

          {isAdmin && !isEditing && (
            <div className="flex gap-3">
              <Button onClick={() => setIsEditing(true)} className="rounded-xl px-10 shadow-lg active:scale-95">
                <Edit3 size={18} className="mr-2" /> Edit Profile
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

          {/* --- STUDENT BIO SECTION --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-[0_20px_60px_rgba(10,6,55,0.02)] border border-slate-100 dark:border-slate-800/60 p-8 md:p-12 relative overflow-hidden">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    className={`h-40 w-40 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden relative group transition-all ${isEditing ? 'cursor-pointer ring-8 ring-primary-500/5' : ''}`}
                  >
                    {previewImage ? (
                      <img src={previewImage} className="h-full w-full object-cover" alt="child" />
                    ) : (
                      <div className="h-full w-full bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center text-slate-200">
                        <User size={60} />
                      </div>
                    )}
                    {isEditing && (
                      <div className="absolute inset-0 bg-midnight/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                </div>

                <div className="md:col-span-3 space-y-7 flex flex-col justify-center">
                  {isEditing ? (
                    <>
                      <InputField label="Full Legal Name" name="fullName" value={formData.fullName} isEditing={isEditing} onChange={handleInputChange} error={errors.fullName} />
                      <InputField label="Name with Initials" name="nameWithInitials" value={formData.nameWithInitials} isEditing={isEditing} onChange={handleInputChange} error={errors.nameWithInitials} />
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{formData.fullName}</h2>
                        <p className="text-[10px] md:text-[11px] font-black text-slate-400 mt-1.5 uppercase tracking-[0.2em]">{formData.nameWithInitials}</p>
                      </div>
                      <div className="pt-2">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusConfig(formData.status).bg} ${getStatusConfig(formData.status).text} w-fit`}>
                          <span className={`w-2 h-2 rounded-full ${getStatusConfig(formData.status).dot} shrink-0`} />
                          {getStatusConfig(formData.status).label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Physical Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-7 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60">
                <MiniStat 
                  icon={<Calendar size={14} />} 
                  label="DOB" 
                  value={formData.dob} 
                  isEditing={isEditing} 
                  name="dob" 
                  type="date" 
                  onChange={handleInputChange} 
                  error={errors.dob}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
                />
                <MiniStat icon={<Heart size={14} />} label="Calculated Age" value={`${age || '---'}`} isEditing={false} />
                <MiniStat icon={<Ruler size={14} />} label="Height (cm)" value={formData.height} isEditing={isEditing} name="height" type="number" onChange={handleInputChange} error={errors.height} />
                <MiniStat icon={<Scale size={14} />} label="Weight (kg)" value={formData.weight} isEditing={isEditing} name="weight" type="number" onChange={handleInputChange} error={errors.weight} />
              </div>

              {/* Health & Demographics */}
              <div className="mt-12 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                    <Droplets size={16} />
                  </div>
                  {/* Display health info */}
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Medical & Safety</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} isEditing={isEditing} type="select" options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} onChange={handleInputChange} error={errors.bloodGroup} />
                  <InputField label="Gender" name="gender" value={formData.gender} isEditing={isEditing} type="select" options={['male', 'female']} onChange={handleInputChange} error={errors.gender} />
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ClipboardList size={12} className="text-primary-500" /> Important Health Notes
                  </label>
                  {isEditing ? (
                    <>
                      <textarea
                        name="specialNote"
                        value={formData.specialNote}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full p-6 bg-slate-100 dark:bg-slate-800/40 border-2 ${errors.specialNote ? 'border-red-500' : 'border-transparent focus:border-primary-500'} focus:bg-white dark:focus:bg-[#0f172a] rounded-[2rem] outline-none text-sm font-bold text-slate-900 dark:text-white transition-all resize-none`}
                      />
                      {errors.specialNote && <span className="text-xs font-bold text-red-500 ml-2 mt-1 block">{errors.specialNote}</span>}
                    </>
                  ) : (
                    <div className="p-6 bg-primary-50/20 border border-primary-100/30 rounded-3xl text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      {formData.specialNote || "No medical conditions reported."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* --- GUARDIAN CARD --- */}
          <div className="space-y-8">
            <div className="bg-midnight rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
              {/* Animated Blur Background */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] animate-pulse"></div>
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users size={120} />
              </div>

              <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight">Parental Record</h3>
              </div>

              <div className="space-y-7 relative z-10">
                <InputField dark label="Relationship" name="relationship" value={formData.relationship} isEditing={false} type="select" options={['father', 'mother', 'guardian']} onChange={handleInputChange} error={errors.relationship} />
                <InputField dark label="Guardian Name" name="parentFullName" value={formData.parentFullName} isEditing={false} onChange={handleInputChange} error={errors.parentFullName} />
                <InputField dark label="Email Contact" name="parentEmail" value={formData.parentEmail} isEditing={false} onChange={handleInputChange} error={errors.parentEmail} />
                <InputField dark label="Mobile Number" name="parentContact" value={formData.parentContact} isEditing={false} onChange={handleInputChange} error={errors.parentContact} />
                <InputField dark label="ID Number (NIC)" name="parentID" value={formData.parentID} isEditing={false} onChange={handleInputChange} error={errors.parentID} />
                {isEditing && (
                  <InputField dark label="Address" name="address" value={formData.address} isEditing={false} onChange={handleInputChange} error={errors.address} />
                )}
              </div>

              {!isEditing && (
                <div className="mt-12 pt-8 border-t border-white/5 space-y-4 relative z-10">
                  <div className="flex items-start gap-4 text-slate-400">
                    <MapPin size={18} className="mt-1 flex-shrink-0 text-primary-500" />
                    <p className="text-xs font-bold leading-relaxed">{formData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons at the bottom */}
        {isEditing && (
          <div className="flex items-center justify-end gap-4 pt-6 mt-8 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl border-2 px-8 py-3 font-bold">
              <X size={18} className="mr-2" /> Cancel Changes
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-xl shadow-lg shadow-primary-500/20 px-10 py-3 font-bold bg-primary-600 hover:bg-primary-700 text-white">
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="mr-2" />}
              Save Profile
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const InputField = ({ label, value, isEditing, name, dark, type = "text", options, onChange, error }: any) => (
  <div className="space-y-1.5 text-left">
    <label className={`text-[11px] font-black uppercase tracking-wider ml-1 ${dark ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>{label}</label>
    {isEditing ? (
      <>
        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-3.5 rounded-2xl outline-none text-sm font-bold transition-all ${dark ? `bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} text-white focus:bg-white/10 focus:border-primary-500` : `bg-slate-100 dark:bg-slate-800/40 border-2 ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] text-slate-900 dark:text-white shadow-sm`}`}
          >
            {options.map((opt: string) => <option key={opt} value={opt} className="text-slate-900 dark:text-white bg-white dark:bg-[#0f172a]">{opt.toUpperCase()}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-3.5 rounded-2xl outline-none text-sm font-bold transition-all ${dark ? `bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} text-white focus:bg-white/10 focus:border-primary-500` : `bg-slate-100 dark:bg-slate-800/40 border-2 ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary-500 focus:bg-white dark:focus:bg-[#0f172a] text-slate-900 dark:text-white shadow-sm`}`}
          />
        )}
        {error && <span className="text-xs font-bold text-red-500 ml-1">{error}</span>}
      </>
    ) : (
      <p className={`text-[15px] font-bold ml-1 tracking-tight ${dark ? 'text-slate-100' : 'text-slate-800 dark:text-slate-200'}`}>{value || "---"}</p>
    )}
  </div>
);

const MiniStat = ({ icon, label, value, isEditing, name, type, onChange, error, ...props }: any) => (
  <div className="flex flex-col text-left">
    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter flex items-center gap-1.5 mb-2">{icon} {label}</span>
    {isEditing && name ? (
      <>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
          className={`w-full mt-1 p-3 bg-slate-100 dark:bg-[#0f172a] border-2 ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary-500 rounded-xl outline-none text-sm font-bold text-slate-900 dark:text-white transition-all shadow-sm focus:bg-white`}
        />
        {error && <span className="text-xs font-bold text-red-500 mt-1 ml-1">{error}</span>}
      </>
    ) : (
      <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
    )}
  </div>
);

export default ChildViewPage;