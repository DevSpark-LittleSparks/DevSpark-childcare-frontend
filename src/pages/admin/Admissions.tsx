import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, User, MapPin, ArrowLeft, Loader2,
  CheckCircle, Sparkles, Scale, Ruler, Droplets,
  ClipboardList, Users, Mail, Phone, Hash
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { PhoneInput } from '../../components/common/PhoneInput';
import { apiClient } from '../../services/axiosInstance';

const AdmissionsPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    nameWithInitials: '',
    dob: '',
    gender: '',
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

  // Calculate child age
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    if (name === "parentContact") {
      value = "+94" + value.replace(/^\+94\s?/, '');
    }
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
    // 1. Check if all boxes are filled (except Special Note)
    const requiredFields = [
      'fullName', 'nameWithInitials', 'dob', 'gender', 'bloodGroup',
      'height', 'weight', 'address', 'relationship', 'parentFullName',
      'parentEmail', 'parentContact', 'parentID'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return typeof value === 'string' ? value.trim() === "" : !value;
    });

    if (missingFields.length > 0) {
      alert(`Registration failed! Please fill the following missing fields: \n${missingFields.join(', ')}`);
      return false;
    }

    if (!previewImage) {
      alert("Registration failed! Child's Profile Picture is mandatory. Please upload an image.");
      return false;
    }

    // 2. Child Age Validation (must be between 3 and 10 years old for childcare)
    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      const ageInYears = Math.floor((today.getTime() - dob.getTime()) / 31557600000);

      if (dob > today) {
        alert("Invalid Birthday! Date of birth cannot be in the future.");
        return false;
      }
      if (ageInYears < 3) {
        alert("Child must be at least 3 years old to be registered.");
        return false;
      }
      if (ageInYears > 10) {
        alert("Child must be 10 years old or younger for childcare registration.");
        return false;
      }
    }

    // Validate phone number
    const slPhoneRegex = /^\+94\d{9}$/;
    if (!slPhoneRegex.test(formData.parentContact)) {
      alert("Invalid Mobile Number! It must start with +94 followed by 9 digits (e.g., +94701234567)");
      return false;
    }

    return true;
  };


  // display msg when submit button is clicked 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const payload = {
          ...formData,
          profilePic: previewImage
        };
        await apiClient.post('/api/v1/child/register', payload);
        alert("Registration Successful! Child has been registered in the system.");
        navigate('/admin/dashboard');
      } catch (err: any) {
        console.error("Registration failed:", err);
        alert(err.response?.data?.message || "Registration failed! Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-10">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-3 bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50 transition-all group"
            >
              <ArrowLeft className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-primary-500" size={20} />
            </button>

          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="bg-white dark:bg-[#0f172a] px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-sm flex flex-col items-center min-w-[120px]">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Capacity</span>
              <span className="text-sm font-black text-midnight dark:text-white leading-none mt-1">85% Full</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-[0_20px_60px_rgba(10,6,55,0.03)] border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 p-8 md:p-12">

              <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-black text-midnight dark:text-white uppercase tracking-tight">Student Information</h2>
              </div>

              {/* Photo & Identity */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 w-32 bg-slate-50 dark:bg-slate-800/40 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden cursor-pointer flex items-center justify-center relative group"
                  >
                    {previewImage ? <img src={previewImage} className="h-full w-full object-cover" alt="child" /> : <Camera size={24} className="text-slate-300" />}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  <p className="mt-3 text-[9px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Child Photo</p>
                </div>

                <div className="md:col-span-3 space-y-7">
                  <LittleInput label="Full Legal Name" name="fullName" placeholder="As per birth certificate" onChange={handleInputChange} />
                  <LittleInput label="Name with Initials" name="nameWithInitials" placeholder="A.B.C. Perera" onChange={handleInputChange} />
                </div>
              </div>

              {/* Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Birthday</label>
                  <input
                    type="date"
                    name="dob"
                    onChange={handleInputChange}
                    // 3 to 10 years limit
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]}
                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:bg-[#0f172a] rounded-2xl outline-none text-sm font-bold shadow-sm transition-all"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                    Age
                  </label>
                  <div className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold text-midnight dark:text-white shadow-sm">
                    {age || "AGE"}
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select
                    name="gender"
                    onChange={handleInputChange}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl outline-none text-sm font-bold appearance-none border-2 border-transparent focus:border-primary-500 shadow-sm transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Medical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Droplets size={10} /> Blood Group</label>
                  <select name="bloodGroup" onChange={handleInputChange} className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl outline-none text-sm font-bold appearance-none border-2 border-transparent focus:border-primary-500">
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Ruler size={10} /> Height (cm)</label>
                  <input type="number" name="height" placeholder="110" onChange={handleInputChange} className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none text-sm font-bold" />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Scale size={10} /> Weight (kg)</label>
                  <input type="number" name="weight" placeholder="20" onChange={handleInputChange} className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none text-sm font-bold" />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                  <textarea
                    name="address"
                    onChange={handleInputChange}
                    placeholder="Current living address..."
                    rows={2}
                    className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:bg-[#0f172a] rounded-2xl outline-none text-sm font-bold text-midnight dark:text-white min-h-[70px] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Health Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ClipboardList size={12} className="text-primary-500" /> Health Notes / Allergies
                </label>
                <textarea
                  name="specialNote"
                  onChange={handleInputChange}
                  placeholder="Enter any medical conditions or specific requirements..."
                  rows={3}
                  className="w-full p-6 bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:bg-[#0f172a] rounded-[2rem] outline-none text-sm font-bold text-midnight dark:text-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Guardian Section */}
          <div className="space-y-8 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <div className="bg-midnight rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <h3 className="text-white font-black text-lg uppercase tracking-tight mb-8">Guardian Details</h3>

              <div className="space-y-5 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Relationship</label>
                  <select
                    name="relationship"
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white dark:bg-[#0f172a]/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white appearance-none focus:border-primary-500"
                  >
                    <option value="" className="bg-midnight">Select Relationship</option>
                    <option value="father" className="bg-midnight">Father</option>
                    <option value="mother" className="bg-midnight">Mother</option>
                    <option value="guardian" className="bg-midnight">Guardian</option>
                  </select>
                </div>

                <LittleInput dark label={<span className="flex items-center gap-1"><Users size={10} /> Guardian Name</span>} name="parentFullName" placeholder="Primary parent name" onChange={handleInputChange} />
                {/* Pre-register parent email */}
                <LittleInput dark label={<span className="flex items-center gap-1"><Mail size={10} /> Email Address</span>} name="parentEmail" placeholder="auth@littlesparks.com" onChange={handleInputChange} />
                
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Phone size={10} /> Mobile
                  </label>
                  <PhoneInput 
                    name="parentContact" 
                    variant="dark"
                    onChange={handleInputChange} 
                    value={formData.parentContact} 
                    className="border-white/10"
                  />
                </div>

                <LittleInput dark label={<span className="flex items-center gap-1"><Hash size={10} /> Identity Number</span>} name="parentID" placeholder="NIC or Passport" onChange={handleInputChange} />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-7 rounded-[2.2rem] shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-4 font-black text-xs tracking-[0.25em] uppercase"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <><CheckCircle size={20} /> Register with LittleSparks</>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

// Reusable Input Component
const LittleInput = ({ label, dark, ...props }: any) => (
  <div className="space-y-2 text-left">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${dark ? 'text-slate-400 dark:text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{label}</label>
    <input
      {...props}
      className={`w-full p-4 rounded-2xl outline-none text-sm font-bold transition-all ${dark
        ? 'bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-primary-500'
        : 'bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-primary-500 focus:bg-white text-midnight shadow-sm'
        }`}
    />
  </div>
);

export default AdmissionsPage;