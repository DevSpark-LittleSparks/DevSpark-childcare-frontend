import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Camera, User, MapPin, ArrowLeft, Loader2, Save,
  Edit3, X, Sparkles, Scale, Ruler, Droplets,
  ClipboardList, Users, Mail, Phone, Hash, Calendar, Heart
} from 'lucide-react';
import { apiClient } from '../../services/axiosInstance';

/**
 * ChildViewPage - Admin Management View
 * Synchronized with AdmissionsPage data structure for Sprouty.
 */

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
    parentID: ''
  });

  // Calculate age dynamically if DOB is changed during edit
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
    }
  }, [formData.dob]);

  // Load actual data from backend
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const res = await apiClient.get(`/api/v1/auth/admin/child/${studentId}`);
        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            fullName: `${data.firstName} ${data.lastName}`,
            nameWithInitials: `${data.firstName.charAt(0)}.${data.lastName}`, // Fallback
            dob: data.dob || '',
            gender: data.gender ? data.gender.toLowerCase() : 'male',
            bloodGroup: data.bloodGroup || '',
            height: data.height || '',
            weight: data.weight || '',
            address: data.address || '',
            specialNote: data.specialNote || '',
            relationship: data.relationship || '',
            parentFullName: data.parentFullName || '',
            parentEmail: data.parentEmail || '',
            parentContact: data.parentContact || '',
            parentID: data.parentID || ''
          });
          setPreviewImage(data.profileImage || null);
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Split fullName back to first/last for backend if needed
      const nameParts = formData.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const payload = {
        firstName,
        lastName,
        dob: formData.dob,
        gender: formData.gender.toUpperCase(),
        bloodGroup: formData.bloodGroup,
        height: formData.height,
        weight: formData.weight,
        address: formData.address,
        specialNote: formData.specialNote,
        guardianName: formData.parentFullName,
        guardianEmail: formData.parentEmail,
        profilePic: previewImage
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
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">

      {/* --- TOP BAR --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <ArrowLeft className="text-slate-400 group-hover:text-primary-500" size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1 text-primary-500">
                <Sparkles size={14} className="fill-primary-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">LittleSparks Student Management</p>
              </div>
              <h1 className="text-3xl font-black text-midnight tracking-tight italic font-sans">
                {isEditing ? "Modify Spark Details" : formData.nameWithInitials}
              </h1>
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl border-2 px-6">
                    <X size={18} className="mr-2" /> Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="rounded-xl shadow-lg shadow-primary-500/20 px-8">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="mr-2" />}
                    Save Data
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="rounded-xl px-10 shadow-lg active:scale-95">
                  <Edit3 size={18} className="mr-2" /> Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

          {/* --- STUDENT BIO SECTION --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(10,6,55,0.02)] border border-slate-100 p-8 md:p-12 relative overflow-hidden">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    className={`h-40 w-40 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden relative group transition-all ${isEditing ? 'cursor-pointer ring-8 ring-primary-500/5' : ''}`}
                  >
                    {previewImage ? (
                      <img src={previewImage} className="h-full w-full object-cover" alt="child" />
                    ) : (
                      <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-200">
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
                  <p className="mt-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Reference ID: {studentId || 'SP-000'}</p>
                </div>

                <div className="md:col-span-3 space-y-7">
                  <InputField label="Full Legal Name" name="fullName" value={formData.fullName} isEditing={isEditing} onChange={handleInputChange} />
                  <InputField label="Name with Initials" name="nameWithInitials" value={formData.nameWithInitials} isEditing={isEditing} onChange={handleInputChange} />
                </div>
              </div>

              {/* Physical Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-7 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50">
                <MiniStat icon={<Calendar size={14} />} label="DOB" value={formData.dob} isEditing={isEditing} name="dob" type="date" onChange={handleInputChange} />
                <MiniStat icon={<Heart size={14} />} label="Calculated Age" value={age} />
                <MiniStat icon={<Ruler size={14} />} label="Height (CM)" value={formData.height} isEditing={isEditing} name="height" type="number" onChange={handleInputChange} />
                <MiniStat icon={<Scale size={14} />} label="Weight (KG)" value={formData.weight} isEditing={isEditing} name="weight" type="number" onChange={handleInputChange} />
              </div>

              {/* Health & Demographics */}
              <div className="mt-12 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                    <Droplets size={16} />
                  </div>
                  <h3 className="text-xs font-black text-midnight uppercase tracking-[0.2em]">Medical & Safety</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} isEditing={isEditing} type="select" options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} onChange={handleInputChange} />
                  <InputField label="Gender" name="gender" value={formData.gender} isEditing={isEditing} type="select" options={['male', 'female']} onChange={handleInputChange} />
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ClipboardList size={12} className="text-primary-500" /> Important Health Notes
                  </label>
                  {isEditing ? (
                    <textarea
                      name="specialNote"
                      value={formData.specialNote}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-5 bg-slate-50 border-2 border-primary-500/10 focus:border-primary-500 rounded-3xl outline-none text-sm font-bold transition-all"
                    />
                  ) : (
                    <div className="p-6 bg-primary-50/20 border border-primary-100/30 rounded-3xl text-sm font-bold text-slate-600 leading-relaxed italic">
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
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users size={120} />
              </div>

              <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-primary-400" />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight">Parental Record</h3>
              </div>

              <div className="space-y-7 relative z-10">
                <InputField dark label="Relationship" name="relationship" value={formData.relationship} isEditing={isEditing} type="select" options={['father', 'mother', 'guardian']} onChange={handleInputChange} />
                <InputField dark label="Guardian Name" name="parentFullName" value={formData.parentFullName} isEditing={isEditing} onChange={handleInputChange} />
                <InputField dark label="Email Contact" name="parentEmail" value={formData.parentEmail} isEditing={isEditing} onChange={handleInputChange} />
                <InputField dark label="Mobile Number" name="parentContact" value={formData.parentContact} isEditing={isEditing} onChange={handleInputChange} />
                <InputField dark label="ID Number (NIC)" name="parentID" value={formData.parentID} isEditing={isEditing} onChange={handleInputChange} />
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
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const InputField = ({ label, value, isEditing, name, dark, type = "text", options, onChange }: any) => (
  <div className="space-y-2 text-left">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
    {isEditing ? (
      type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all border-2 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-primary-500/10 focus:border-primary-500 text-midnight'}`}
        >
          {options.map((opt: string) => <option key={opt} value={opt} className="text-midnight">{opt.toUpperCase()}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all border-2 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-primary-500/10 focus:border-primary-500 text-midnight'}`}
        />
      )
    ) : (
      <p className={`text-base font-bold ml-1 tracking-tight ${dark ? 'text-white' : 'text-midnight'}`}>{value || "---"}</p>
    )}
  </div>
);

const MiniStat = ({ icon, label, value, isEditing, name, type, onChange }: any) => (
  <div className="flex flex-col text-left">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1.5 mb-2">{icon} {label}</span>
    {isEditing && name ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-transparent border-b-2 border-primary-500/40 outline-none text-sm font-black text-midnight w-full pb-1"
      />
    ) : (
      <span className="text-sm font-black text-midnight tracking-tight">{value}</span>
    )}
  </div>
);

export default ChildViewPage;